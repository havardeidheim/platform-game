import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';
import { DIMENSION_INACTIVE_ALPHA } from '../utils/constants.js';
import type { Player } from './player.js';
import { Game } from '../game.js';

export class SneakyBlock extends GameObject {
    render(ctx: CanvasRenderingContext2D, game: Game): void {
        const active = this.dimension === game.currentDimension;
        const savedAlpha = ctx.globalAlpha;
        ctx.globalAlpha = active ? DIMENSION_INACTIVE_ALPHA : 1;

        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STROKE;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);

        ctx.globalAlpha = savedAlpha;
    }

    update(dt: number, player: Player, game: Game): void {
        // static block, no update needed
    }

}
