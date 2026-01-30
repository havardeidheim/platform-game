import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_FALLING_BLOCK } from '../utils/colors.js';

export class FallingBlock extends GameObject {
    private falling: boolean = false;
    private ySpeed: number = 0;
    private started: boolean = false;
    private fallTimer: number = 0;
    private respawnTimer: number = 0;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_FALLING_BLOCK;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update(dt: number): void {
        // TODO: handle fall timing and gravity
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
