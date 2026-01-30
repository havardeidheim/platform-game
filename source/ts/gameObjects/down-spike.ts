import { GameObject } from './base/game-object.js';
import { Rectangle } from './base/geometry.js';

export class DownSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x + 2, this.y, this.width - 4, this.height - 5);
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
