import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';

export class BouncingBlockRot extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STROKE;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update(dt: number): void {
        // static block, no update needed
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
