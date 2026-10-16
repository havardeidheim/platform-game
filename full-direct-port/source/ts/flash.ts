// Small helpers that mimic the bits of the Flash runtime the game relies on.

export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 480;
export const FRAME_RATE = 40;
export const STAGE_COLOR = '#CCCCCC';

/** AS3 int conversion (truncates towards zero) */
export function int(v: number): number {
    return Math.trunc(v) | 0;
}

/** DisplayObject x/y are stored as whole twips (1/20 px), truncated */
export function twips(v: number): number {
    return Math.trunc(v * 20) / 20;
}

export interface Point {
    x: number;
    y: number;
}

export class Rectangle {
    constructor(public x: number, public y: number, public width: number, public height: number) {}

    get left(): number { return this.x; }
    get right(): number { return this.x + this.width; }
    get top(): number { return this.y; }
    get bottom(): number { return this.y + this.height; }

    /** flash.geom.Rectangle.intersects - touching edges do not count */
    intersects(r: Rectangle): boolean {
        if (this.width <= 0 || this.height <= 0 || r.width <= 0 || r.height <= 0) {
            return false;
        }
        return r.x < this.right && r.right > this.x && r.y < this.bottom && r.bottom > this.y;
    }
}

/** A one-shot flash.utils.Timer running on game time */
export interface GameTimer {
    fireAt: number;
    callback: () => void;
    stopped: boolean;
}

export class TimerQueue {
    private time = 0;
    private timers: GameTimer[] = [];

    start(delayMs: number, callback: () => void): GameTimer {
        const timer = { fireAt: this.time + delayMs, callback, stopped: false };
        this.timers.push(timer);
        return timer;
    }

    /** Advances game time and fires due timers, like Flash does between frames */
    advance(ms: number): void {
        this.time += ms;
        const due = this.timers.filter(t => t.fireAt <= this.time);
        this.timers = this.timers.filter(t => t.fireAt > this.time && !t.stopped);
        for (const t of due) {
            if (!t.stopped) {
                t.stopped = true;
                t.callback();
            }
        }
    }
}
