import { GameObject } from './base/game-object.js';

export class VerticalSawBlade extends GameObject {
    private radius: number = 0;
    private dynamic: boolean = false;
    private path: number = 0;
    private progress: number = 0;
    private movingUp: boolean = false;
    private rotation: number = 0;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, dimension: number = 0) {
        super(x, y, width, height, dimension);
        this.radius = this.width / 2;
    }

    render(ctx: CanvasRenderingContext2D): void {
        // TODO
    }

    update(dt: number): void {
        // TODO: rotation and vertical movement
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
