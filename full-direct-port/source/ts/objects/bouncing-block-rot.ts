import { linesIntersect } from '../co';
import { Point, Rectangle } from '../flash';
import { drawSymbol } from '../graphics';
import type { Player } from '../player';
import { AbstractObject } from './abstract-object';

const SYMBOL = 'Objects/Platforms/BouncingBlockRot';

const DOWN = 1;
const UP = 2;
const LEFT = 3;
const RIGHT = 4;

/** BouncingBlockRot.as - the pink diamond that bounces you diagonally */
export class BouncingBlockRot extends AbstractObject {
    private lastpoints: Point[] = [];
    private thispoints: Point[] = [];

    get width(): number { return 40; }
    get height(): number { return 40; }

    getCollidiableBounds(): Rectangle {
        return new Rectangle(this.x, this.y, 40, 40);
    }

    hitTest(player: Player, _normal: Point): boolean {
        const b = this.getCollidiableBounds();
        if (!b.intersects(player.bounds)) {
            return false;
        }
        const lb = player.lastBounds;
        const tb = player.bounds;
        const lastpoints = this.lastpoints;
        const thispoints = this.thispoints;

        lastpoints[DOWN] = { x: lb.x + lb.width / 2, y: lb.bottom };
        lastpoints[UP] = { x: lb.x + lb.width / 2, y: lb.y };
        lastpoints[LEFT] = { x: lb.x, y: lb.y + lb.height / 2 };
        lastpoints[RIGHT] = { x: lb.right, y: lb.y + lb.height / 2 };

        thispoints[DOWN] = { x: tb.x + tb.width / 2, y: tb.bottom };
        thispoints[UP] = { x: tb.x + tb.width / 2, y: tb.y };
        thispoints[LEFT] = { x: tb.x, y: tb.y + tb.height / 2 };
        thispoints[RIGHT] = { x: tb.right, y: tb.y + tb.height / 2 };

        const crosses = (x1: number, y1: number, x2: number, y2: number, dir: number): boolean =>
            linesIntersect(x1, y1, x2, y2, lastpoints[dir].x, lastpoints[dir].y, thispoints[dir].x, thispoints[dir].y);

        // up left
        if (crosses(b.x, b.y + 20, b.x + 21, b.y, DOWN) || crosses(b.x, b.y + 20, b.x + 21, b.y, RIGHT)) {
            player.superBoost(0.5);
            player.superJump(1);
            return false;
        }
        // up right
        if (crosses(b.x + 20, b.y, b.x + 40, b.y + 20 + 1, DOWN) || crosses(b.x + 20, b.y, b.x + 40, b.y + 20, LEFT)) {
            player.superBoost(-0.5);
            player.superJump(1);
            return false;
        }
        // bottom left
        if (crosses(b.x, b.y + 20, b.x + 21, b.y + 40, UP) || crosses(b.x, b.y + 20, b.x + 21, b.y + 40, RIGHT)) {
            player.superBoost(0.5);
            player.superJump(-1);
            return false;
        }
        // bottom right
        if (crosses(b.x + 20, b.y + 40, b.x + 40, b.y + 20 + 1, UP) || crosses(b.x + 20, b.y + 40, b.x + 40, b.y + 20, LEFT)) {
            player.superBoost(-0.5);
            player.superJump(-1);
            return false;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        drawSymbol(ctx, SYMBOL, this.x, this.y);
    }

    displayBounds(): Rectangle {
        return new Rectangle(this.x, this.y, 40, 40);
    }
}
