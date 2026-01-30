import { Level } from './gameObjects/base/level.js';

export class Game {
    level: Level;
    running: boolean = false;
    currentDimension: number = 1;
    private animationFrameId: number = 0;
    private lastTime: number = 0;
    private ctx: CanvasRenderingContext2D;

    constructor(level: Level, ctx: CanvasRenderingContext2D) {
        this.level = level;
        this.ctx = ctx;
    }

    start(): void {
        this.running = true;
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
    }

    pause(): void {
        this.running = false;
        cancelAnimationFrame(this.animationFrameId);
    }

    private loop(time: number): void {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(dt);
        this.render();

        if (this.running) {
            this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
        }
    }

    private update(dt: number): void {
        // TODO: update game state
    }

    private render(): void {
        const { ctx } = this;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const passiveDimension = this.currentDimension === 1 ? 2 : 1;

        // 1. Passive dimension (background)
        for (const obj of this.level.objects) {
            if (obj.dimension === passiveDimension) {
                obj.render(ctx);
            }
        }

        // 2. Active dimension
        for (const obj of this.level.objects) {
            if (obj.dimension === this.currentDimension) {
                obj.render(ctx);
            }
        }

        // 3. Static dimension (always on top)
        for (const obj of this.level.objects) {
            if (obj.dimension === 0) {
                obj.render(ctx);
            }
        }
    }
}
