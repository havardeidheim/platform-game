import { GameObject } from './game-object.js';
import { COLOR_BLOCK_FILL, COLOR_DANGER_RED } from '../utils/colors.js';
import { Point } from '../utils/geometry.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class VerticalSawBlade extends GameObject {
    private radius: number = 0;
    private range: number = 0;
    private dynamic: boolean = false;
    private progress: number = 0;
    private movingUp: boolean = false;
    private readonly initialMovingUp: boolean;
    private rotation: number = 0;

    constructor(x: number = 0, y: number = 0, diameter: number = 0, range: number = 0, dimension: number = 0) {
        super(x, y, diameter, diameter, dimension);
        this.radius = diameter / 2;
        this.range = range;
        this.dynamic = range !== 0;
        this.movingUp = range < 0;
        this.initialMovingUp = this.movingUp;
    }

    override reset(): void {
        super.reset();
        this.progress = 0;
        this.movingUp = this.initialMovingUp;
        this.rotation = 0;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const r = this.width / 2 - 1.5;
        const spikeHeight = 2;
        const numSpikes = 16;

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

        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fill();
        ctx.strokeStyle = COLOR_DANGER_RED;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }

    update(dt: number, player: Player, game: Game): void {
        this.rotation += 2 * dt;

        if (this.dynamic) {
            if (this.progress >= Math.abs(this.range)) {
                this.movingUp = !this.movingUp;
                this.progress = 0;
            }
            this.progress++;
            this.y += this.movingUp ? -1 : 1;
        }
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const cx = this.x + this.radius;
        const cy = this.y + this.radius;
        const bounds = player.getBounds();
        const closestX = Math.max(bounds.left, Math.min(cx, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(cy, bounds.bottom));
        const dx = cx - closestX;
        const dy = cy - closestY;
        if (Math.sqrt(dx * dx + dy * dy) < this.radius) {
            game.reset();
        }
        return false;
    }
}
