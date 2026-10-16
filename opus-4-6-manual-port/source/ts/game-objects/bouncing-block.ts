import { GameObject } from './game-object.js';
import { Point } from '../utils/geometry.js';
import { COLOR_BLOCK_FILL, COLOR_BOUNCING_BLOCK } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class BouncingBlock extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_BOUNCING_BLOCK;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);

        // Draw spring zigzag to indicate bouncing
        ctx.strokeStyle = COLOR_BOUNCING_BLOCK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const zigzagWidth = Math.min(this.width * 0.4, 12);
        const zigzagHeight = Math.min(this.height * 0.5, 12);
        const steps = 3;
        const stepH = (zigzagHeight * 2) / steps;
        ctx.moveTo(cx, cy - zigzagHeight);
        for (let i = 0; i < steps; i++) {
            const dir = i % 2 === 0 ? 1 : -1;
            ctx.lineTo(cx + zigzagWidth * dir, cy - zigzagHeight + stepH * (i + 0.5));
        }
        ctx.lineTo(cx, cy + zigzagHeight);
        ctx.stroke();
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();
        const lastBounds = player.getLastBounds();

        // Player's right edge crosses block's left edge (player moving right) -> bounce right
        if (lastBounds.right <= b.left && bounds.right >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            player.superBoost(1);
            return false;
        }
        // Player's left edge crosses block's right edge (player moving left) -> bounce left
        if (lastBounds.left >= b.right && bounds.left <= b.right && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            player.superBoost(-1);
            return false;
        }
        // Player's bottom edge crosses block's top edge (player falling onto block) -> bounce up
        if (lastBounds.bottom <= b.top && bounds.bottom >= b.top && bounds.right >= b.left && bounds.left <= b.right) {
            player.superJump(1);
            return false;
        }
        // Player's top edge crosses block's bottom edge (player jumping into block) -> bounce down
        if (lastBounds.top >= b.bottom && bounds.top <= b.bottom && bounds.right >= b.left && bounds.left <= b.right) {
            player.superJump(-1);
            return false;
        }

        return false;
    }
}
