import { GameObject } from './game-object.js';
import { COLOR_BLOCK_FILL, COLOR_NORMAL_BLOCK } from '../utils/colors.js';
export class NormalBlock extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = COLOR_NORMAL_BLOCK;
        ctx.lineWidth = 2;

        // Draw 20x20 grid overlay aligned to block
        ctx.beginPath();
        for (let gx = 20; gx < this.width; gx += 20) {
            ctx.moveTo(this.x + gx, this.y);
            ctx.lineTo(this.x + gx, this.y + this.height);
        }
        for (let gy = 20; gy < this.height; gy += 20) {
            ctx.moveTo(this.x, this.y + gy);
            ctx.lineTo(this.x + this.width, this.y + gy);
        }
        ctx.stroke();

        // Outline
        ctx.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
    }
}
