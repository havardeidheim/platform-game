import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_GOAL } from '../utils/colors.js';
import { Point } from '../utils/geometry.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class Goal extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        const circleDiameter = 40;
        const cx = this.x + this.width / 2;
        const cy = this.y + circleDiameter / 2;
        const r = circleDiameter / 2 - 1.5;
        const halfRectW = r / 2;
        const rectBottom = this.y + this.height - 1.5;
        const intersectY = cy + r * Math.sqrt(3) / 2;

        ctx.beginPath();
        ctx.moveTo(cx - halfRectW, rectBottom);
        ctx.lineTo(cx - halfRectW, intersectY);
        ctx.arc(cx, cy, r, 2 * Math.PI / 3, Math.PI / 3, false);
        ctx.lineTo(cx + halfRectW, rectBottom);
        ctx.closePath();

        ctx.fillStyle = COLOR_FILL;
        ctx.fill();
        ctx.strokeStyle = COLOR_GOAL;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        if (this.getBounds().intersects(player.getBounds())) {
            game.win();
        }
        return false;
    }
}
