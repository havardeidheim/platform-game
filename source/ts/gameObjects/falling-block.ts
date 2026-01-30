import { GameObject } from './base/game-object.js';

export class FallingBlock extends GameObject {
    private falling: boolean = false;
    private ySpeed: number = 0;
    private started: boolean = false;
    private fallTimer: number = 0;
    private respawnTimer: number = 0;

    render(ctx: CanvasRenderingContext2D): void {
        // TODO
    }

    update(dt: number): void {
        // TODO: handle fall timing and gravity
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
