import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_INTER_BLOCK } from '../utils/colors.js';
import { DIMENSION_STATIC } from '../utils/constants.js';
import type { Player } from './player.js';

export class InterBlock extends GameObject {
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, _dimension: number = 0) {
        super(x, y, width, height, DIMENSION_STATIC);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_INTER_BLOCK;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }

    update(dt: number, player: Player, game: Game): void {
        // static block, no update needed
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
