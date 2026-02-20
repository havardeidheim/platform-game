import { GameObject } from './game-object.js';
import { COLOR_BLOCK_FILL, COLOR_INTER_BLOCK } from '../utils/colors.js';
import { DIMENSION_STATIC } from '../utils/constants.js';
export class InterBlock extends GameObject {
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, _dimension: number = 0) {
        super(x, y, width, height, DIMENSION_STATIC);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = COLOR_INTER_BLOCK;
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
