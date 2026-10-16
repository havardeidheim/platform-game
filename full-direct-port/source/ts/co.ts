// Game constants and math helpers (Co.as)

export const X_MAX_SPEED = 4;
export const Y_MAX_SPEED = 10;

export const X_ACCELERATION = 0.6;
export const Y_ACCELERATION = 7;

export const GRAVITY = 0.3;
export const FRICTION = 0.1;

/** Returns whichever of a and b is closest to value (not a real clamp, but that is how the original works) */
export function clamp(value: number, a: number, b: number): number {
    const vtoa = Math.abs(value - a);
    const vtob = Math.abs(value - b);
    if (Math.min(vtoa, vtob) === vtoa) {
        return a;
    }
    return b;
}

export function linesIntersect(
    x1: number, y1: number, x2: number, y2: number,
    x3: number, y3: number, x4: number, y4: number,
): boolean {
    const bx = x2 - x1;
    const by = y2 - y1;
    const dx = x4 - x3;
    const dy = y4 - y3;
    const bDotDPerp = bx * dy - by * dx;
    if (bDotDPerp === 0) {
        return false;
    }
    const cx = x3 - x1;
    const cy = y3 - y1;
    const t = (cx * dy - cy * dx) / bDotDPerp;
    if (t < 0 || t > 1) {
        return false;
    }
    const u = (cx * by - cy * bx) / bDotDPerp;
    if (u < 0 || u > 1) {
        return false;
    }
    return true;
}
