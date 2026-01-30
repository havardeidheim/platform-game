import { GameObject } from './game-object.js';

export class UpPlatform extends GameObject {
    private canFall: boolean = false;
    private falling: boolean = false;
    private ySpeed: number = 0;
    private started: boolean = false;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'magenta';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update(dt: number): void {
        // TODO: handle fall timing and gravity if canFall
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
