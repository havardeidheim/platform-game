import { GameObject } from './game-object.js';
import { Rectangle } from '../utils/geometry.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class RightSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x, this.y + 2, this.width - 5, this.height - 4);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STROKE;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }

    update(dt: number, player: Player, game: Game): void {
        // no update needed
    }

}
