import { GameObject } from './game-object.js';
import { Point } from '../utils/geometry.js';
import { COLOR_BLOCK_FILL, COLOR_STICKY_BLOCK } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class StickyBlock extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STICKY_BLOCK;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);

        // Draw vertical dashes on both sides to indicate slidable surface
        ctx.strokeStyle = COLOR_STICKY_BLOCK;
        ctx.lineWidth = 1;
        const dashLen = 6;
        const gap = 4;
        const margin = 5;

        for (let dy = margin; dy < this.height - margin; dy += dashLen + gap) {
            const segEnd = Math.min(dy + dashLen, this.height - margin);
            // Left side
            ctx.beginPath();
            ctx.moveTo(this.x + margin, this.y + dy);
            ctx.lineTo(this.x + margin, this.y + segEnd);
            ctx.stroke();
            // Right side
            ctx.beginPath();
            ctx.moveTo(this.x + this.width - margin, this.y + dy);
            ctx.lineTo(this.x + this.width - margin, this.y + segEnd);
            ctx.stroke();
        }
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();
        const lastBounds = player.getLastBounds();

        // Player approaching from the right (player's left crosses block's right edge)
        if (lastBounds.left >= b.right && bounds.left - 2 <= b.right && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.right - bounds.left;
            normal.y = 0;
            player.slideRight = true;
            return true;
        }
        // Player approaching from the left (player's right crosses block's left edge)
        if (lastBounds.right <= b.left && bounds.right + 2 >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.left - bounds.right;
            normal.y = 0;
            player.slideLeft = true;
            return true;
        }
        // Top collision (player falling onto block)
        if (lastBounds.bottom <= b.top && bounds.bottom >= b.top && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.top - bounds.bottom;
            return true;
        }
        // Bottom collision (player jumping into block from below)
        if (lastBounds.top >= b.bottom && bounds.top <= b.bottom && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.bottom - bounds.top;
            return true;
        }

        return false;
    }
}
