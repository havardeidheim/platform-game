import { GameObject } from './base/game-object.js';

export class HorizontalSawBlade extends GameObject {
    private radius: number = 0;
    private dynamic: boolean = false;
    private path: number = 0;
    private progress: number = 0;
    private movingRight: boolean = false;
    private rotation: number = 0;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, dimension: number = 0) {
        super(x, y, width, height, dimension);
        this.radius = this.width / 2;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const r = this.width / 2;
        const spikeHeight = 3;
        const numSpikes = 12;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        for (let i = 0; i < numSpikes * 2; i++) {
            const angle = (i / (numSpikes * 2)) * Math.PI * 2;
            const dist = i % 2 === 0 ? r + spikeHeight : r - spikeHeight;
            const px = Math.cos(angle) * dist;
            const py = Math.sin(angle) * dist;
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();

        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'magenta';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    update(dt: number): void {
        this.rotation += 2 * dt;
    }

    hitTest(other: GameObject): boolean {
        const bounds = other.getBounds();
        const closestX = Math.max(bounds.left, Math.min(this.x, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(this.y, bounds.bottom));
        const dx = this.x - closestX;
        const dy = this.y - closestY;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}
