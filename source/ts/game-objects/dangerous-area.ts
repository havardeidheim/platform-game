import { GameObject } from './game-object.js';
import { COLOR_DANGER_RED } from '../utils/colors.js';
import { LINE_WIDTH } from '../utils/constants.js';
import { Point } from '../utils/geometry.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class DangerousArea extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        const spacing = 10;

        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();

        ctx.strokeStyle = COLOR_DANGER_RED;
        ctx.lineWidth = LINE_WIDTH;

        ctx.beginPath();
        for (let x = this.x + spacing; x <= this.x + this.width; x += spacing) {
            ctx.moveTo(x, this.y);
            ctx.lineTo(x, this.y + this.height);
        }
        for (let y = this.y + spacing; y <= this.y + this.height; y += spacing) {
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.width, y);
        }
        ctx.stroke();

        ctx.restore();
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        if (this.getBounds().intersects(player.getBounds())) {
            game.reset();
        }
        return false;
    }
}
