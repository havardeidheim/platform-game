import { GameObject } from './base/game-object.js';

export class RightPlatform extends GameObject {
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
