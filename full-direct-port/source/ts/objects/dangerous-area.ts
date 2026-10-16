import { int, Point, Rectangle } from '../flash';
import type { Player } from '../player';
import { AbstractObject } from './abstract-object';

const LINE_WIDTH = 2;

/** DangerousArea.as - a red grid that kills on touch */
export class DangerousArea extends AbstractObject {
    private readonly areaWidth: number;
    private readonly areaHeight: number;
    private readonly bounds: Rectangle;

    constructor(xx: number, yy: number, aWidth: number, aHeight: number) {
        super(xx, yy);
        this.areaWidth = int(aWidth);
        this.areaHeight = int(aHeight);
        this.bounds = this.lineBounds();
    }

    /** Bounds of the drawn grid lines including line thickness, which is what width/height report in Flash */
    private lineBounds(): Rectangle {
        const half = LINE_WIDTH / 2;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (let i = 10; i < this.areaWidth; i += 10) {
            minX = Math.min(minX, i - half);
            maxX = Math.max(maxX, i + half);
            minY = Math.min(minY, -half);
            maxY = Math.max(maxY, this.areaHeight + half);
        }
        for (let j = 10; j < this.areaHeight; j += 10) {
            minX = Math.min(minX, -half);
            maxX = Math.max(maxX, this.areaWidth + half);
            minY = Math.min(minY, j - half);
            maxY = Math.max(maxY, j + half);
        }
        if (minX === Infinity) {
            return new Rectangle(0, 0, 0, 0);
        }
        return new Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

    get width(): number { return this.bounds.width; }
    get height(): number { return this.bounds.height; }

    hitTest(player: Player, _normal: Point): boolean {
        const b = this.getCollidiableBounds();
        if (player.bounds.intersects(b)) {
            player.die();
            return false;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 10; i < this.areaWidth; i += 10) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.areaHeight);
        }
        for (let j = 10; j < this.areaHeight; j += 10) {
            ctx.moveTo(0, j);
            ctx.lineTo(this.areaWidth, j);
        }
        ctx.stroke();
        ctx.restore();
    }

    displayBounds(): Rectangle {
        return new Rectangle(this.x + this.bounds.x, this.y + this.bounds.y, this.bounds.width, this.bounds.height);
    }
}
