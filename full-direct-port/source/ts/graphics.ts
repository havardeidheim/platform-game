import { SYMBOLS } from './data/symbols';
import type { DrawOp, PathOps, SymbolData } from './symbol-types';

export const FONT_TIMES = 'GameTimes, "Times New Roman", Times, serif';

// Times New Roman metrics, used to place text like a Flash TextField does
const ASCENT = 0.891;
const DESCENT = 0.216;
const TEXTFIELD_GUTTER = 2;

export function getSymbol(name: string): SymbolData {
    const symbol = SYMBOLS[name];
    if (!symbol) {
        throw new Error('Unknown symbol ' + name);
    }
    return symbol;
}

export function symbolBounds(name: string, frame = 0): [number, number, number, number] {
    return getSymbol(name).frames[frame].bounds;
}

type MapPoint = (x: number, y: number) => [number, number];

function buildPath(ops: PathOps, map: MapPoint | null): Path2D {
    const path = new Path2D();
    let i = 0;
    while (i < ops.length) {
        const cmd = ops[i];
        if (cmd === 'M' || cmd === 'L') {
            let x = ops[i + 1] as number;
            let y = ops[i + 2] as number;
            if (map) [x, y] = map(x, y);
            if (cmd === 'M') path.moveTo(x, y); else path.lineTo(x, y);
            i += 3;
        } else if (cmd === 'Q') {
            let cx = ops[i + 1] as number;
            let cy = ops[i + 2] as number;
            let x = ops[i + 3] as number;
            let y = ops[i + 4] as number;
            if (map) {
                [cx, cy] = map(cx, cy);
                [x, y] = map(x, y);
            }
            path.quadraticCurveTo(cx, cy, x, y);
            i += 5;
        } else {
            path.closePath();
            i += 1;
        }
    }
    return path;
}

/** Maps a coordinate along one axis using Flash 9-slice scaling */
function sliceAxis(v: number, start: number, size: number, gridA: number, gridB: number, newSize: number): number {
    const end = start + size;
    if (v <= gridA) return v;
    if (v >= gridB) return start + newSize - (end - v);
    const middle = newSize - (gridA - start) - (end - gridB);
    return gridA + (v - gridA) * (middle / (gridB - gridA));
}

interface CompiledOp {
    op: DrawOp;
    path: Path2D;
}

const cache = new Map<string, CompiledOp[]>();

/**
 * Returns the frame's draw ops. When width/height are given for a symbol with a scale grid,
 * the paths are 9-slice scaled to that size (and must be drawn unscaled).
 */
function compiled(name: string, frame: number, sliceWidth?: number, sliceHeight?: number): CompiledOp[] {
    const cacheKey = `${name}|${frame}|${sliceWidth ?? ''}|${sliceHeight ?? ''}`;
    let result = cache.get(cacheKey);
    if (!result) {
        const symbol = getSymbol(name);
        const data = symbol.frames[frame];
        let map: MapPoint | null = null;
        if (sliceWidth !== undefined && sliceHeight !== undefined && symbol.scaleGrid) {
            const [bx, by, bw, bh] = data.bounds;
            const [gl, gt, gr, gb] = symbol.scaleGrid;
            map = (x, y) => [
                sliceAxis(x, bx, bw, gl, gr, sliceWidth),
                sliceAxis(y, by, bh, gt, gb, sliceHeight),
            ];
        }
        result = data.ops.map(op => ({ op, path: buildPath(op.path, map) }));
        cache.set(cacheKey, result);
    }
    return result;
}

function drawOps(ctx: CanvasRenderingContext2D, ops: CompiledOp[]): void {
    const baseAlpha = ctx.globalAlpha;
    for (const { op, path } of ops) {
        ctx.globalAlpha = baseAlpha * op.alpha;
        if (op.type === 'fill') {
            ctx.fillStyle = op.color;
            ctx.fill(path);
        } else {
            ctx.strokeStyle = op.color;
            ctx.lineWidth = op.width;
            ctx.lineCap = op.caps === 'none' ? 'butt' : (op.caps as CanvasLineCap);
            ctx.lineJoin = op.joints as CanvasLineJoin;
            ctx.stroke(path);
        }
    }
    ctx.globalAlpha = baseAlpha;
}

export interface SymbolDrawOptions {
    frame?: number;
    /** Display width/height, like setting DisplayObject.width/height */
    width?: number;
    height?: number;
    rotation?: number;
}

/** Draws a library symbol with its registration point at x, y */
export function drawSymbol(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, options: SymbolDrawOptions = {}): void {
    const symbol = getSymbol(name);
    const frame = options.frame ?? 0;
    const [, , bw, bh] = symbol.frames[frame].bounds;
    const width = options.width ?? bw;
    const height = options.height ?? bh;
    ctx.save();
    ctx.translate(x, y);
    if (options.rotation) {
        ctx.rotate(options.rotation * Math.PI / 180);
    }
    if (symbol.scaleGrid && (width !== bw || height !== bh)) {
        drawOps(ctx, compiled(name, frame, width, height));
    } else {
        if (width !== bw || height !== bh) {
            ctx.scale(bw ? width / bw : 1, bh ? height / bh : 1);
        }
        drawOps(ctx, compiled(name, frame));
    }
    ctx.restore();
}

export interface TextFieldStyle {
    size: number;
    bold?: boolean;
    color?: string;
    align?: 'left' | 'center';
    multiline?: boolean;
}

function fontString(style: TextFieldStyle): string {
    return `${style.bold ? 'bold ' : ''}${style.size}px ${FONT_TIMES}`;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    for (const paragraph of text.split(/\r\n|\r|\n/)) {
        const words = paragraph.split(' ');
        let line = '';
        for (const word of words) {
            const candidate = line === '' ? word : line + ' ' + word;
            if (line !== '' && ctx.measureText(candidate.trimEnd()).width > maxWidth) {
                lines.push(line);
                line = word;
            } else {
                line = candidate;
            }
        }
        lines.push(line);
    }
    return lines;
}

/** Draws text the way a Flash TextField with the given box would show it */
export function drawTextField(
    ctx: CanvasRenderingContext2D, text: string,
    x: number, y: number, width: number, height: number, style: TextFieldStyle,
): void {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.font = fontString(style);
    ctx.fillStyle = style.color ?? '#000000';
    ctx.textBaseline = 'alphabetic';
    const innerWidth = width - TEXTFIELD_GUTTER * 2;
    const lines = style.multiline ? wrapLines(ctx, text, innerWidth) : [text];
    const lineHeight = style.size * (ASCENT + DESCENT) + 2;
    let baseline = y + TEXTFIELD_GUTTER + style.size * ASCENT;
    for (const line of lines) {
        if (style.align === 'center') {
            ctx.textAlign = 'center';
            ctx.fillText(line, x + width / 2, baseline);
        } else {
            ctx.textAlign = 'left';
            ctx.fillText(line, x + TEXTFIELD_GUTTER, baseline);
        }
        baseline += lineHeight;
    }
    ctx.restore();
}
