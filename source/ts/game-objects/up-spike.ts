import { GameObject } from './game-object.js';
import { Rectangle } from '../utils/geometry.js';

export class UpSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x + 2, this.y + 5, this.width - 4, this.height - 10);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'magenta';
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
