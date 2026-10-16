#!/usr/bin/env python3
"""
Converts the original Flash project (../original-flash-game/PlatformGame/PlatformGame.fla)
into TypeScript data modules used by the browser port:

  source/ts/data/symbols.ts  - vector graphics of the library symbols (as canvas path ops)
  source/ts/data/levels.ts   - the raw level placements (RawLevel0..9 movieclips)

The .fla is an XFL zip archive. Flash wrote it with a slightly broken central
directory, so entries are read by scanning the local file headers.

Usage (from full-direct-port): python3 tools/convert-fla.py
"""
import json
import os
import re
import struct
import sys
import zlib
import xml.etree.ElementTree as ET

PORT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_DIR = os.path.dirname(PORT_DIR)
FLA = os.path.join(REPO_DIR, 'original-flash-game', 'PlatformGame', 'PlatformGame.fla')
OUT_DIR = os.path.join(PORT_DIR, 'source', 'ts', 'data')

NS = '{http://ns.adobe.com/xfl/2008/}'

# Symbols needed at runtime (in-game objects, menu and controls)
RUNTIME_SYMBOLS = [
    'Objects/Player',
    'Objects/CheckPoint',
    'Objects/Goal',
    'Objects/Platforms/Block',
    'Objects/Platforms/BouncingBlock',
    'Objects/Platforms/BouncingBlockRot',
    'Objects/Platforms/FallingBlock',
    'Objects/Platforms/InterBlock',
    'Objects/Platforms/SlidingBlock',
    'Objects/Platforms/SneakyBlock',
    'Objects/SagBlad/LoddSagBlad',
    'Objects/SagBlad/VannSagBlad',
    'Menu/MenuKnapp',
    'Menu/MenuStar',
    'Menu/Returnknapp',
    'Controls/LeftButton',
    'Controls/RightButton',
    'Controls/JumpButton',
    'Controls/DimensionButton',
    'Controls/RespawnButton',
]


def read_fla(path):
    data = open(path, 'rb').read()
    files = {}
    i = 0
    while True:
        i = data.find(b'PK\x03\x04', i)
        if i < 0:
            break
        _, _, method, _, _, _, csize, _, nlen, elen = struct.unpack('<HHHHHIIIHH', data[i + 4:i + 30])
        name = data[i + 30:i + 30 + nlen].decode('utf-8', 'replace')
        start = i + 30 + nlen + elen
        raw = data[start:start + csize]
        try:
            files[name] = raw if method == 0 else zlib.decompress(raw, -15)
        except zlib.error:
            i += 4
            continue
        i = start + csize
    return files


def library_file_name(symbol_name):
    # XFL escapes '[' as '&#091' in library file names
    return 'LIBRARY/' + symbol_name.replace('[', '&#091') + '.xml'


def parse_number(tok):
    if tok.startswith('#'):
        whole, _, frac = tok[1:].partition('.')
        v = int(whole, 16)
        if v >= 0x800000:
            v -= 0x1000000
        if frac:
            v += int(frac, 16) / (16 ** len(frac))
        return v
    return float(tok)


EDGE_TOKEN = re.compile(r'[!|/\[\]]|S\d+|#[0-9A-Fa-f]+(?:\.[0-9A-Fa-f]+)?|-?\d+(?:\.\d+)?')


def parse_edges(s):
    """Returns a list of segments in twips: ('L', p0, p1) or ('Q', p0, c, p1)."""
    toks = [t for t in EDGE_TOKEN.findall(s) if not t.startswith('S')]
    segs = []
    pos = None
    i = 0
    while i < len(toks):
        t = toks[i]
        if t == '!':
            pos = (parse_number(toks[i + 1]), parse_number(toks[i + 2]))
            i += 3
        elif t in ('|', '/'):
            p = (parse_number(toks[i + 1]), parse_number(toks[i + 2]))
            if p != pos:
                segs.append(('L', pos, p))
            pos = p
            i += 3
        elif t in ('[', ']'):
            c = (parse_number(toks[i + 1]), parse_number(toks[i + 2]))
            p = (parse_number(toks[i + 3]), parse_number(toks[i + 4]))
            segs.append(('Q', pos, c, p))
            pos = p
            i += 5
        else:
            i += 1
    return segs


def color_of(el, default='#000000'):
    """Returns (color, alpha) of a SolidColor element."""
    if el is None:
        return default, 1.0
    return el.get('color', default), float(el.get('alpha', '1'))


def matrix_of(el):
    m = el.find(NS + 'matrix')
    if m is None:
        return (1, 0, 0, 1, 0, 0)
    m = m[0]
    return tuple(float(m.get(k, d)) for k, d in
                 (('a', 1), ('b', 0), ('c', 0), ('d', 1), ('tx', 0), ('ty', 0)))


def mat_mul(m1, m2):
    """Returns m1 * m2 (apply m2 first, then m1)."""
    a1, b1, c1, d1, tx1, ty1 = m1
    a2, b2, c2, d2, tx2, ty2 = m2
    return (a1 * a2 + c1 * b2, b1 * a2 + d1 * b2,
            a1 * c2 + c1 * d2, b1 * c2 + d1 * d2,
            a1 * tx2 + c1 * ty2 + tx1, b1 * tx2 + d1 * ty2 + ty1)


def apply(m, p):
    a, b, c, d, tx, ty = m
    return (a * p[0] + c * p[1] + tx, b * p[0] + d * p[1] + ty)


def r(v):
    return round(v, 3)


def key(p):
    return (round(p[0], 2), round(p[1], 2))


def reverse_seg(s):
    if s[0] == 'L':
        return ('L', s[2], s[1])
    return ('Q', s[3], s[2], s[1])


def chain_loops(segs):
    """Chains directed segments into closed loops."""
    by_start = {}
    for idx, s in enumerate(segs):
        by_start.setdefault(key(s[1]), []).append(idx)
    used = [False] * len(segs)
    loops = []
    for idx in range(len(segs)):
        if used[idx]:
            continue
        loop = []
        cur = idx
        start = key(segs[idx][1])
        while cur is not None:
            used[cur] = True
            loop.append(segs[cur])
            end = key(segs[cur][-1])
            if end == start:
                break
            nxt = None
            for cand in by_start.get(end, []):
                if not used[cand]:
                    nxt = cand
                    break
            cur = nxt
        loops.append(loop)
    return loops


def path_ops(loops, m, close):
    """Converts segment loops (twips) into flat path ops in pixels: M x y, L x y, Q cx cy x y, Z."""
    ops = []
    for loop in loops:
        pos = None
        for s in loop:
            p0 = apply(m, (s[1][0] / 20, s[1][1] / 20))
            if pos is None or key(pos) != key(p0):
                ops += ['M', r(p0[0]), r(p0[1])]
            if s[0] == 'L':
                p1 = apply(m, (s[2][0] / 20, s[2][1] / 20))
                ops += ['L', r(p1[0]), r(p1[1])]
            else:
                c = apply(m, (s[2][0] / 20, s[2][1] / 20))
                p1 = apply(m, (s[3][0] / 20, s[3][1] / 20))
                ops += ['Q', r(c[0]), r(c[1]), r(p1[0]), r(p1[1])]
            pos = p1
        if close:
            ops.append('Z')
    return ops


def quad_extrema(p0, c, p1):
    pts = [p0, p1]
    for axis in (0, 1):
        den = p0[axis] - 2 * c[axis] + p1[axis]
        if den != 0:
            t = (p0[axis] - c[axis]) / den
            if 0 < t < 1:
                pts.append(tuple((1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * c[k] + t * t * p1[k] for k in (0, 1)))
    return pts


def ops_points(ops):
    pts = []
    i = 0
    pos = None
    while i < len(ops):
        o = ops[i]
        if o in ('M', 'L'):
            pos = (ops[i + 1], ops[i + 2])
            pts.append(pos)
            i += 3
        elif o == 'Q':
            c = (ops[i + 1], ops[i + 2])
            p = (ops[i + 3], ops[i + 4])
            pts += quad_extrema(pos, c, p)
            pos = p
            i += 5
        else:
            i += 1
    return pts


class Converter:
    def __init__(self, files):
        self.files = files
        self.cache = {}

    def symbol_root(self, name):
        return ET.fromstring(self.files[library_file_name(name)])

    def shape_ops(self, shape, m, alpha):
        m = mat_mul(m, matrix_of(shape))
        fills = {}
        for f in shape.iter(NS + 'FillStyle'):
            col = f.find(NS + 'SolidColor')
            fills[f.get('index')] = color_of(col)
        strokes = {}
        for s in shape.iter(NS + 'StrokeStyle'):
            st = s[0]
            fill = st.find(NS + 'fill')
            col = fill.find(NS + 'SolidColor') if fill is not None else None
            c, a = color_of(col)
            strokes[s.get('index')] = {
                'color': c, 'alpha': a,
                'weight': float(st.get('weight', '1')),
                'caps': st.get('caps', 'round'),
                'joints': st.get('joints', 'round'),
            }
        edges = []
        for e in shape.iter(NS + 'Edge'):
            if e.get('edges') is None:
                continue
            edges.append((e.get('fillStyle0'), e.get('fillStyle1'), e.get('strokeStyle'), parse_edges(e.get('edges'))))

        out = []
        for idx, (col, a) in fills.items():
            segs = []
            for f0, f1, _, ss in edges:
                if f0 == idx:
                    segs += ss
                if f1 == idx:
                    segs += [reverse_seg(s) for s in ss]
            if segs:
                out.append({'type': 'fill', 'color': col, 'alpha': a * alpha,
                            'path': path_ops(chain_loops(segs), m, True)})
        scale = (abs(m[0] * m[3] - m[1] * m[2])) ** 0.5
        for idx, st in strokes.items():
            segs = [s for _, _, ss_idx, ss in edges if ss_idx == idx for s in ss]
            if segs:
                out.append({'type': 'stroke', 'color': st['color'], 'alpha': st['alpha'] * alpha,
                            'width': r(st['weight'] * scale), 'caps': st['caps'], 'joints': st['joints'],
                            'path': path_ops([segs], m, False)})
        return out

    def element_ops(self, el, m, alpha):
        tag = el.tag.replace(NS, '')
        if tag == 'DOMShape':
            return self.shape_ops(el, m, alpha)
        if tag == 'DOMGroup':
            out = []
            for child in el.find(NS + 'members'):
                out += self.element_ops(child, mat_mul(m, matrix_of(el)), alpha)
            return out
        if tag == 'DOMSymbolInstance':
            col = el.find(NS + 'color')
            a = alpha
            if col is not None:
                a *= float(col[0].get('alphaMultiplier', '1'))
            frame = int(el.get('firstFrame', '0'))
            return self.symbol_frame_ops(el.get('libraryItemName'), frame, mat_mul(m, matrix_of(el)), a)
        return []  # texts are handled by the game code

    def frame_count(self, root):
        n = 1
        for frame in root.iter(NS + 'DOMFrame'):
            n = max(n, int(frame.get('index')) + int(frame.get('duration', '1')))
        return n

    def symbol_frame_ops(self, name, frame_index, m=(1, 0, 0, 1, 0, 0), alpha=1.0):
        root = self.symbol_root(name)
        layers = [l for l in root.iter(NS + 'DOMLayer') if l.get('layerType') not in ('guide', 'folder', 'mask')]
        out = []
        # XFL lists layers top-first, draw bottom-first
        for layer in reversed(layers):
            for frame in layer.iter(NS + 'DOMFrame'):
                start = int(frame.get('index'))
                if start <= frame_index < start + int(frame.get('duration', '1')):
                    els = frame.find(NS + 'elements')
                    for el in (els if els is not None else []):
                        out += self.element_ops(el, m, alpha)
        return out

    def symbol(self, name):
        root = self.symbol_root(name)
        frames = []
        labels = {}
        for i in range(self.frame_count(root)):
            ops = self.symbol_frame_ops(name, i)
            frames.append({'ops': ops, 'bounds': bounds_of(ops)})
        for layer in root.iter(NS + 'DOMLayer'):
            for frame in layer.iter(NS + 'DOMFrame'):
                if frame.get('name'):
                    labels[frame.get('name')] = int(frame.get('index'))
        result = {'frames': frames, 'labels': labels}
        if root.get('scaleGridLeft') is not None:
            result['scaleGrid'] = [float(root.get(k)) for k in
                                   ('scaleGridLeft', 'scaleGridTop', 'scaleGridRight', 'scaleGridBottom')]
        return result


def bounds_of(ops):
    xmin = ymin = float('inf')
    xmax = ymax = float('-inf')
    for op in ops:
        pts = ops_points(op['path'])
        pad = op['width'] / 2 if op['type'] == 'stroke' else 0
        for x, y in pts:
            xmin, ymin = min(xmin, x - pad), min(ymin, y - pad)
            xmax, ymax = max(xmax, x + pad), max(ymax, y + pad)
    if xmin == float('inf'):
        return [0, 0, 0, 0]
    return [r(xmin), r(ymin), r(xmax - xmin), r(ymax - ymin)]


def convert_levels(conv):
    levels = []
    bounds_cache = {}
    for n in range(10):
        root = conv.symbol_root('Levels/RawLevel%d' % n)
        children = []
        for frame in root.iter(NS + 'DOMFrame'):
            if frame.get('index') != '0':
                continue
            for el in frame.find(NS + 'elements'):
                tag = el.tag.replace(NS, '')
                a, b, c, d, tx, ty = matrix_of(el)
                if tag == 'DOMSymbolInstance':
                    name = el.get('libraryItemName')
                    if name not in bounds_cache:
                        bounds_cache[name] = bounds_of(conv.symbol_frame_ops(name, 0))
                    bx, by, bw, bh = bounds_cache[name]
                    corners = [apply((a, b, c, d, tx, ty), p) for p in
                               ((bx, by), (bx + bw, by), (bx, by + bh), (bx + bw, by + bh))]
                    xs = [p[0] for p in corners]
                    ys = [p[1] for p in corners]
                    col = el.find(NS + 'color')
                    alpha = float(col[0].get('alphaMultiplier', '1')) if col is not None else 1.0
                    children.append({
                        'symbol': name.split('/')[-1],
                        'x': r(tx), 'y': r(ty),
                        'width': r(max(xs) - min(xs)), 'height': r(max(ys) - min(ys)),
                        'alpha': alpha,
                    })
                elif tag in ('DOMDynamicText', 'DOMInputText'):
                    text = ''.join(ch.text or '' for ch in el.iter(NS + 'characters'))
                    # XFL stores the text area without the 2px gutters of the runtime TextField
                    children.append({
                        'symbol': 'TextField',
                        'x': r(tx + float(el.get('left', '0')) - 2), 'y': r(ty - 2),
                        'width': r(float(el.get('width')) + 4), 'height': r(float(el.get('height')) + 4),
                        'alpha': 1.0,
                        'text': text,
                    })
        levels.append(children)
    return levels


def write_ts(path, header, name, type_name, data):
    with open(path, 'w', newline='\n') as f:
        f.write(header)
        f.write('export const %s: %s = %s;\n' % (name, type_name, json.dumps(data, separators=(',', ':'))))


def main():
    files = read_fla(FLA)
    conv = Converter(files)
    os.makedirs(OUT_DIR, exist_ok=True)
    note = '// Generated by tools/convert-fla.py from the original PlatformGame.fla - do not edit.\n'

    symbols = {name: conv.symbol(name) for name in RUNTIME_SYMBOLS}
    write_ts(os.path.join(OUT_DIR, 'symbols.ts'),
             note + "import type { SymbolData } from '../symbol-types';\n\n",
             'SYMBOLS', 'Record<string, SymbolData>', symbols)

    levels = convert_levels(conv)
    write_ts(os.path.join(OUT_DIR, 'levels.ts'),
             note + "import type { RawLevelChild } from '../symbol-types';\n\n",
             'RAW_LEVELS', 'RawLevelChild[][]', levels)

    for name in RUNTIME_SYMBOLS:
        print('%-40s frames=%d bounds=%s' % (name, len(symbols[name]['frames']),
                                             [f['bounds'] for f in symbols[name]['frames']]))
    for i, lvl in enumerate(levels):
        print('level %d: %d children' % (i, len(lvl)))


if __name__ == '__main__':
    sys.exit(main())
