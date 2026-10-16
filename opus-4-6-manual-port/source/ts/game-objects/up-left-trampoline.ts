import { GameObject } from './game-object.js';
import { Point } from '../utils/geometry.js';
import { COLOR_BLOCK_FILL, COLOR_BOUNCING_BLOCK } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class UpLeftTrampoline extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        // Triangle: bottom-left → top-right diagonal, right edge, bottom edge
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = COLOR_BOUNCING_BLOCK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.stroke();
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();
        const lastBounds = player.getLastBounds();

        // Diagonal collision: slope goes from (left, bottom) to (right, top)
        // At x-position px, diagonal y = b.bottom - (px - b.left) * b.height / b.width
        const graphratioy = b.height / b.width;
        const lastDiagonalY = b.bottom - ((lastBounds.right - b.left) * graphratioy);
        const currDiagonalY = b.bottom - ((bounds.right - b.left) * graphratioy);

        if (bounds.intersects(b) &&
            lastBounds.bottom < lastDiagonalY &&
            bounds.bottom > currDiagonalY) {
            player.superBoost(0.5);
            player.superJump(1);
            return false;
        }

        return false;
    }
}
