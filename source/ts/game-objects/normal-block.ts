import { GameObject } from './game-object.js';
import { COLOR_BLOCK_FILL, COLOR_NORMAL_BLOCK } from '../utils/colors.js';
export class NormalBlock extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_NORMAL_BLOCK;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }
}
