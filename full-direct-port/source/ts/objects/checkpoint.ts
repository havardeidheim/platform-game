import { Point, Rectangle } from '../flash';
import { drawSymbol, getSymbol, symbolBounds } from '../graphics';
import type { Player } from '../player';
import { AbstractObject } from './abstract-object';

const CHECKPOINT = 'Objects/CheckPoint';
const GOAL = 'Objects/Goal';

/** CheckPoint.as - shows the "active" frame once reached */
export class CheckPoint extends AbstractObject {
    private frame = 0;

    get width(): number { return symbolBounds(CHECKPOINT, this.frame)[2]; }
    get height(): number { return symbolBounds(CHECKPOINT, this.frame)[3]; }

    gotoAndStop(label: string): void {
        this.frame = getSymbol(CHECKPOINT).labels[label];
    }

    hitTest(player: Player, _normal: Point): boolean {
        const b = this.getCollidiableBounds();
        if (player.bounds.intersects(b)) {
            player.reachedCheckpoint(this);
            this.gotoAndStop('active');
            return false;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        drawSymbol(ctx, CHECKPOINT, this.x, this.y, { frame: this.frame });
    }

    displayBounds(): Rectangle {
        const [bx, by, bw, bh] = symbolBounds(CHECKPOINT, this.frame);
        return new Rectangle(this.x + bx, this.y + by, bw, bh);
    }
}

/** Goal.as */
export class Goal extends AbstractObject {
    get width(): number { return symbolBounds(GOAL)[2]; }
    get height(): number { return symbolBounds(GOAL)[3]; }

    hitTest(player: Player, _normal: Point): boolean {
        const b = this.getCollidiableBounds();
        if (player.bounds.intersects(b)) {
            player.win();
            return false;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        drawSymbol(ctx, GOAL, this.x, this.y);
    }

    displayBounds(): Rectangle {
        const [bx, by, bw, bh] = symbolBounds(GOAL);
        return new Rectangle(this.x + bx, this.y + by, bw, bh);
    }
}
