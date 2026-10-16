import { Rectangle, Point } from '../utils/geometry.js';
import { COLOR_BLOCK_FILL, COLOR_MISSING } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export abstract class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    dimension: number;
    protected startX: number;
    protected startY: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, dimension: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dimension = dimension;
        this.startX = x;
        this.startY = y;
    }

    reset(): void {
        this.x = this.startX;
        this.y = this.startY;
    }

    getBounds(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    render(ctx: CanvasRenderingContext2D, game: Game): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_MISSING;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }
    
    update(player: Player, game: Game): void {
        // default: no update needed
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();
        const lastBounds = player.getLastBounds();

        // Player's right edge crosses block's left edge (player moving right)
        if (lastBounds.right <= b.left && bounds.right >= b.left && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.left - bounds.right;
            normal.y = 0;
            return true;
        }
        // Player's left edge crosses block's right edge (player moving left)
        if (lastBounds.left >= b.right && bounds.left <= b.right && bounds.top <= b.bottom && bounds.bottom >= b.top) {
            normal.x = b.right - bounds.left;
            normal.y = 0;
            return true;
        }
        // Player's bottom edge crosses block's top edge (player falling down onto block)
        if (lastBounds.bottom <= b.top && bounds.bottom >= b.top && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.top - bounds.bottom;
            return true;
        }
        // Player's top edge crosses block's bottom edge (player jumping up into block)
        if (lastBounds.top >= b.bottom && bounds.top <= b.bottom && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.bottom - bounds.top;
            return true;
        }

        return false;
    }
}
