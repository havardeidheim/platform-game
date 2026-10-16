import { clamp } from '../co';
import { Point, Rectangle } from '../flash';
import { drawSymbol, symbolBounds } from '../graphics';
import type { Player } from '../player';
import { AbstractObject } from './abstract-object';

/** Shared logic of VannSagBlad.as and LoddSagBlad.as */
abstract class SawBlade extends AbstractObject {
    protected readonly radius: number;
    protected readonly dynamisk: boolean;
    protected progress = 0;
    protected rotation = 0;

    constructor(private readonly symbol: string, xx: number, yy: number, protected readonly bane: number) {
        super(xx, yy);
        this.bane = Math.trunc(bane);
        this.radius = this.width / 2;
        this.dynamisk = this.bane !== 0;
    }

    get width(): number { return symbolBounds(this.symbol)[2]; }
    get height(): number { return symbolBounds(this.symbol)[3]; }

    getCollidiableBounds(): Rectangle {
        throw new Error('SagBlad does not support bounds');
    }

    hitTest(player: Player, _normal: Point): boolean {
        const rect = player.bounds;
        const closestX = clamp(this.x, rect.left, rect.right);
        const closestY = clamp(this.y, rect.top, rect.bottom);
        const xdist = this.x - closestX;
        const ydist = this.y - closestY;
        const hypdist = Math.sqrt(xdist * xdist + ydist * ydist);
        if (hypdist < this.radius) {
            player.die();
            return false;
        }
        return false;
    }

    protected rotate(deg: number): void {
        // DisplayObject.rotation is kept within -180..180
        let r = this.rotation + deg;
        while (r > 180) r -= 360;
        while (r < -180) r += 360;
        this.rotation = r;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        drawSymbol(ctx, this.symbol, this.x, this.y, { rotation: this.rotation });
    }

    displayBounds(): Rectangle {
        const r = this.width / 2 + 2;
        return new Rectangle(this.x - r, this.y - r, r * 2, r * 2);
    }
}

/** VannSagBlad.as - saw blade moving horizontally, bane is the travel distance */
export class HorizontalSawBlade extends SawBlade {
    private right: boolean;

    constructor(xx: number, yy: number, bane: number) {
        super('Objects/SagBlad/VannSagBlad', xx, yy, bane);
        this.right = this.bane > 0;
    }

    reset(): void {
        super.reset();
        this.progress = 0;
        this.right = this.bane > 0;
    }

    loop(): void {
        this.rotate(-4);
        if (this.dynamisk) {
            if (this.progress >= Math.abs(this.bane)) {
                this.right = !this.right;
                this.progress = 0;
            }
            this.progress += 1;
            if (this.right) {
                this.x += 1;
                this.rotate(8);
            } else {
                this.x -= 1;
            }
        }
    }
}

/** LoddSagBlad.as - saw blade moving vertically, bane is the travel distance */
export class VerticalSawBlade extends SawBlade {
    private up: boolean;

    constructor(xx: number, yy: number, bane: number) {
        super('Objects/SagBlad/LoddSagBlad', xx, yy, bane);
        this.up = this.bane < 0;
    }

    reset(): void {
        super.reset();
        this.progress = 0;
        this.up = this.bane < 0;
    }

    loop(): void {
        this.rotate(-4);
        if (this.dynamisk) {
            if (this.progress >= Math.abs(this.bane)) {
                this.up = !this.up;
                this.progress = 0;
            }
            this.progress += 1;
            if (this.up) {
                this.y -= 1;
                this.rotate(8);
            } else {
                this.y += 1;
            }
        }
    }
}
