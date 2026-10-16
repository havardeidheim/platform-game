import { int, Point, Rectangle, twips } from '../flash';
import type { Player } from '../player';

/** Base class for every level object (AbstractObject.as) */
export abstract class AbstractObject {
    private _x = 0;
    private _y = 0;
    alpha = 1;

    protected startX: number;
    protected startY: number;
    startXX: number;
    startYY: number;

    constructor(xx: number, yy: number) {
        xx = int(xx);
        yy = int(yy);
        this.startX = xx;
        this.startY = yy;
        this.startXX = xx;
        this.startYY = yy;
        this.x = xx;
        this.y = yy;
    }

    get x(): number { return this._x; }
    set x(v: number) { this._x = twips(v); }
    get y(): number { return this._y; }
    set y(v: number) { this._y = twips(v); }

    /** DisplayObject.width/height */
    abstract get width(): number;
    abstract get height(): number;

    move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.startX = int(this.startX + dx);
        this.startY = int(this.startY + dy);
    }

    setAlpha(a: number): void {
        if (a > 1 || a < 0) {
            throw new Error('illegal argument');
        }
        this.alpha = a;
    }

    reset(): void {
        this.x = this.startXX;
        this.y = this.startYY;
        this.startX = this.startXX;
        this.startY = this.startYY;
    }

    getCollidiableBounds(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    abstract hitTest(player: Player, normal: Point): boolean;

    loop(): void {
        // nothing
    }

    /** Draws the object at full opacity, alpha is applied by the game */
    abstract draw(ctx: CanvasRenderingContext2D): void;

    /** Area covered on screen, used when drawing the object with alpha */
    abstract displayBounds(): Rectangle;
}

/** Shared collision test of the solid blocks: left, right, top, bottom */
export function solidHitTest(b: Rectangle, player: Player, normal: Point): boolean {
    const bounds = player.bounds;
    const last = player.lastBounds;
    if (last.right <= b.left && bounds.right >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
        normal.x = b.left - bounds.right;
        normal.y = 0;
        return true;
    }
    if (last.left >= b.right && bounds.left <= b.right && bounds.top <= b.bottom && bounds.bottom >= b.top) {
        normal.x = b.right - bounds.left;
        normal.y = 0;
        return true;
    }
    if (last.bottom <= b.top && bounds.bottom >= b.top && bounds.right >= b.left && bounds.left <= b.right) {
        normal.x = 0;
        normal.y = b.top - bounds.bottom;
        return true;
    }
    if (last.top >= b.bottom && bounds.top <= b.bottom && bounds.right >= b.left && bounds.left <= b.right) {
        normal.x = 0;
        normal.y = b.bottom - bounds.top;
        return true;
    }
    return false;
}
