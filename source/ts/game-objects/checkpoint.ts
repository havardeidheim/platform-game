import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_CHECKPOINT } from '../utils/colors.js';

export class CheckPoint extends GameObject {
    active: boolean = false;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_CHECKPOINT;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update(dt: number): void {
        // no update needed
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
