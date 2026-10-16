/** A path is a flat list of commands: 'M' x y, 'L' x y, 'Q' cx cy x y, 'Z'. Coordinates are in pixels. */
export type PathOps = (string | number)[];

export interface FillOp {
    type: 'fill';
    color: string;
    alpha: number;
    path: PathOps;
}

export interface StrokeOp {
    type: 'stroke';
    color: string;
    alpha: number;
    width: number;
    caps: string;
    joints: string;
    path: PathOps;
}

export type DrawOp = FillOp | StrokeOp;

export interface SymbolFrame {
    ops: DrawOp[];
    /** x, y, width, height of the frame contents including strokes, like DisplayObject.getBounds */
    bounds: [number, number, number, number];
}

export interface SymbolData {
    frames: SymbolFrame[];
    labels: Record<string, number>;
    /** 9-slice scaling grid: left, top, right, bottom */
    scaleGrid?: [number, number, number, number];
}

/** One child of a RawLevel movieclip, as placed in the Flash IDE */
export interface RawLevelChild {
    symbol: string;
    x: number;
    y: number;
    width: number;
    height: number;
    alpha: number;
    text?: string;
}
