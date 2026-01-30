import { GameObject } from './base/game-object.js';
import { Rectangle } from './base/geometry.js';

export class DownSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x + 2, this.y, this.width - 4, this.height - 5);
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
