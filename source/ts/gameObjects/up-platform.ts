import { GameObject } from './base/game-object.js';

export class UpPlatform extends GameObject {
    private canFall: boolean = false;
    private falling: boolean = false;
    private ySpeed: number = 0;
    private started: boolean = false;

    render(ctx: CanvasRenderingContext2D): void {
        // TODO
    }

    update(dt: number): void {
        // TODO: handle fall timing and gravity if canFall
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
