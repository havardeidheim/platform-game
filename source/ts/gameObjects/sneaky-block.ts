import { GameObject } from './base/game-object.js';

export class SneakyBlock extends GameObject {
    render(ctx: CanvasRenderingContext2D): void {
        // TODO: renders with reduced opacity when in active dimension
    }

    update(dt: number): void {
        // static block, no update needed
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
