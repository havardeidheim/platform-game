import { GameObject } from './base/game-object.js';
import { Rectangle } from './base/geometry.js';

export class RightSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x, this.y + 2, this.width - 5, this.height - 4);
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
