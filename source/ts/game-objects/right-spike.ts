import { GameObject } from './game-object.js';
import { Rectangle } from '../utils/geometry.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';

export class RightSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x, this.y + 2, this.width - 5, this.height - 4);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STROKE;
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
