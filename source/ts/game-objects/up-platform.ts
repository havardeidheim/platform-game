import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';
import type { Player } from './player.js';

export class UpPlatform extends GameObject {
    private canFall: boolean = false;
    private falling: boolean = false;
    private ySpeed: number = 0;
    private started: boolean = false;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STROKE;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }

    update(dt: number, player: Player, game: Game): void {
        // TODO: handle fall timing and gravity if canFall
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
