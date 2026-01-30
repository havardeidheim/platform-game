import { GameObject } from './base/game-object.js';
import { Rectangle } from './base/geometry.js';

export class UpSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x + 2, this.y + 5, this.width - 4, this.height - 10);
    }

    render(ctx: CanvasRenderingContext2D): void {
        // TODO
    }

    update(dt: number): void {
        // no update needed
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
