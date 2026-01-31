import { GameObject } from './game-object.js';
import { COLOR_FILL, COLOR_CHECKPOINT } from '../utils/colors.js';

export class CheckPoint extends GameObject {
    active: boolean = false;

    render(ctx: CanvasRenderingContext2D): void {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.width / 2;
        const r = this.width / 2 - 1.5;
        const halfRectW = r / 2;
        const rectBottom = this.y + this.height - 1.5;
        const intersectY = cy + r * Math.sqrt(3) / 2;

        ctx.beginPath();
        ctx.moveTo(cx - halfRectW, rectBottom);
        ctx.lineTo(cx - halfRectW, intersectY);
        ctx.arc(cx, cy, r, 2 * Math.PI / 3, Math.PI / 3, false);
        ctx.lineTo(cx + halfRectW, rectBottom);
        ctx.closePath();

        ctx.fillStyle = COLOR_FILL;
        ctx.fill();
        ctx.strokeStyle = COLOR_CHECKPOINT;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    update(dt: number): void {
        // no update needed
    }

    hitTest(other: GameObject): boolean {
        return this.getBounds().intersects(other.getBounds());
    }
}
