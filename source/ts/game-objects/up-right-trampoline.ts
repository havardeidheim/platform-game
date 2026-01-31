import { GameObject } from './game-object.js';
import { Point } from '../utils/geometry.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class UpRightTrampoline extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        // Triangle: top-left → bottom-right diagonal, bottom edge, left edge
        ctx.fillStyle = COLOR_FILL;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = COLOR_STROKE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.stroke();
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();
        const lastBounds = player.getLastBounds();

        // Diagonal collision: slope goes from (left, top) to (right, bottom)
        // At x-position px, diagonal y = b.bottom - (b.right - px) * b.height / b.width
        const graphratioy = -b.height / b.width;
        const lastDiagonalY = b.bottom - ((lastBounds.left - b.right) * graphratioy);
        const currDiagonalY = b.bottom - ((bounds.left - b.right) * graphratioy);

        if (bounds.intersects(b) &&
            lastBounds.bottom < lastDiagonalY &&
            bounds.bottom > currDiagonalY) {
            player.superBoost(-0.5);
            player.superJump(1);
            return false;
        }

        // Player's top edge crosses block's bottom edge (player jumping up into block)
        if (lastBounds.top >= b.bottom && bounds.top <= b.bottom && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.bottom - bounds.top;
            return true;
        }

        // Player's right edge crosses block's left edge (player moving right into block)
        if (lastBounds.right <= b.left && bounds.right >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.left - bounds.right;
            normal.y = 0;
            return true;
        }

        return false;
    }
}
