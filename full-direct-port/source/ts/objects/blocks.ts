import * as Co from '../co';
import { GameTimer, int, Point, Rectangle, TimerQueue } from '../flash';
import { drawSymbol } from '../graphics';
import type { Player } from '../player';
import { AbstractObject, solidHitTest } from './abstract-object';

/** A library symbol stretched to a given width/height (9-slice scaled) */
abstract class SizedSymbolObject extends AbstractObject {
    private readonly w: number;
    private readonly h: number;

    constructor(private readonly symbol: string, xx: number, yy: number, aWidth: number, aHeight: number) {
        super(xx, yy);
        this.w = int(aWidth);
        this.h = int(aHeight);
    }

    get width(): number { return this.w; }
    get height(): number { return this.h; }

    draw(ctx: CanvasRenderingContext2D): void {
        drawSymbol(ctx, this.symbol, this.x, this.y, { width: this.w, height: this.h });
    }

    displayBounds(): Rectangle {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }
}

/** Block.as - solid from every side */
export class Block extends SizedSymbolObject {
    constructor(xx: number, yy: number, aWidth: number, aHeight: number) {
        super('Objects/Platforms/Block', xx, yy, aWidth, aHeight);
    }

    hitTest(player: Player, normal: Point): boolean {
        return solidHitTest(this.getCollidiableBounds(), player, normal);
    }
}

/** InterBlock.as - a solid block that exists in both dimensions */
export class InterBlock extends SizedSymbolObject {
    constructor(xx: number, yy: number, aWidth: number, aHeight: number) {
        super('Objects/Platforms/InterBlock', xx, yy, aWidth, aHeight);
    }

    hitTest(player: Player, normal: Point): boolean {
        return solidHitTest(this.getCollidiableBounds(), player, normal);
    }
}

/** SneakyBlock.as - solid, but shown faded in the dimension where it is solid */
export class SneakyBlock extends SizedSymbolObject {
    constructor(xx: number, yy: number, aWidth: number, aHeight: number) {
        super('Objects/Platforms/SneakyBlock', xx, yy, aWidth, aHeight);
    }

    hitTest(player: Player, normal: Point): boolean {
        return solidHitTest(this.getCollidiableBounds(), player, normal);
    }

    setAlpha(a: number): void {
        if (a > 1 || a < 0) {
            throw new Error('illegal argument');
        }
        this.alpha = a === 1 ? 0.2 : 1;
    }
}

/** SlidingBlock.as - the brown wall-jump block */
export class SlidingBlock extends SizedSymbolObject {
    constructor(xx: number, yy: number, aWidth: number, aHeight: number) {
        super('Objects/Platforms/SlidingBlock', xx, yy, aWidth, aHeight);
    }

    hitTest(player: Player, normal: Point): boolean {
        const b = this.getCollidiableBounds();
        const bounds = player.bounds;
        const last = player.lastBounds;
        if (last.left >= b.right && bounds.left - 2 <= b.right && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.right - bounds.left;
            normal.y = 0;
            player.slideRight = true;
            return true;
        }
        if (last.right <= b.left && bounds.right + 2 >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.left - bounds.right;
            normal.y = 0;
            player.slideLeft = true;
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
}

/** BouncingBlock.as - the pink trampoline block */
export class BouncingBlock extends SizedSymbolObject {
    constructor(xx: number, yy: number, aWidth: number, aHeight: number) {
        super('Objects/Platforms/BouncingBlock', xx, yy, aWidth, aHeight);
    }

    hitTest(player: Player, _normal: Point): boolean {
        const b = this.getCollidiableBounds();
        const bounds = player.bounds;
        const last = player.lastBounds;
        if (last.right <= b.left && bounds.right >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            player.superBoost(1);
            return false;
        }
        if (last.left >= b.right && bounds.left <= b.right && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            player.superBoost(-1);
            return false;
        }
        if (last.bottom <= b.top && bounds.bottom >= b.top && bounds.right >= b.left && bounds.left <= b.right) {
            player.superJump(1);
            return false;
        }
        if (last.top >= b.bottom && bounds.top <= b.bottom && bounds.right >= b.left && bounds.left <= b.right) {
            player.superJump(-1);
            return false;
        }
        return false;
    }
}

/** FallingBlock.as - the yellow block that falls half a second after you land on it */
export class FallingBlock extends SizedSymbolObject {
    private falling = false;
    private yfart = 0;
    private started = false;

    private didcollide = false;
    private pl: Player | null = null;

    private startfalltimer: GameTimer | null = null;
    private spawntimer: GameTimer | null = null;

    constructor(private timers: TimerQueue, xx: number, yy: number, aWidth: number, aHeight: number) {
        super('Objects/Platforms/FallingBlock', xx, yy, aWidth, aHeight);
    }

    reset(): void {
        super.reset();
        this.yfart = 0;
        if (this.startfalltimer) {
            this.startfalltimer.stopped = true;
        }
        if (this.spawntimer) {
            this.spawntimer.stopped = true;
        }
        this.falling = false;
        this.started = false;
        this.didcollide = false;
    }

    hitTest(player: Player, normal: Point): boolean {
        const b = this.getCollidiableBounds();
        this.pl = player;
        this.didcollide = false;
        const bounds = player.bounds;
        if (player.lastBounds.bottom <= b.top && bounds.bottom >= b.top && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.top - bounds.bottom;
            if (!this.started) {
                this.startfalltimer = this.timers.start(500, () => this.startfalling());
                this.started = true;
            }
            this.didcollide = true;
            return true;
        }
        return false;
    }

    loop(): void {
        if (this.falling) {
            this.fall();
        }
        if (this.didcollide && this.pl) {
            this.pl.y += this.yfart + 1;
        }
    }

    private startfalling(): void {
        this.falling = true;
        this.spawntimer = this.timers.start(3000, () => this.finishfalling());
    }

    private finishfalling(): void {
        this.falling = false;
        this.started = false;
        this.x = this.startX;
        this.y = this.startY;
        this.yfart = 0;
    }

    private fall(): void {
        if (this.falling && this.yfart < Co.Y_MAX_SPEED) {
            this.yfart += Co.GRAVITY;
            if (this.yfart > Co.Y_MAX_SPEED) {
                this.yfart = Co.Y_MAX_SPEED;
            }
        }
        this.y += this.yfart;
    }
}
