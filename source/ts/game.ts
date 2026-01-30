import { Level } from './gameObjects/base/level.js';

export class Game {
    level: Level;
    running: boolean = false;
    currentDimension: number = 1;
    private animationFrameId: number = 0;
    private lastTime: number = 0;
    private frameInterval: number = 1000 / 60;
    private accumulated: number = 0;
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
        if (this.running) {
            this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
        }

        const elapsed = time - this.lastTime;
        this.accumulated += elapsed;
        this.lastTime = time;

        if (this.accumulated < this.frameInterval) {
            return;
        }

        const dt = this.accumulated / 1000;
        this.accumulated = 0;

        this.update(dt);
        this.render();
    }

    private update(dt: number): void {
        const passiveDimension = this.currentDimension === 1 ? 2 : 1;

        // 1. Passive dimension (background)
        for (const obj of this.level.objects) {
            if (obj.dimension === passiveDimension) {
                obj.update(dt);
            }
        }

        // 2. Active dimension
        for (const obj of this.level.objects) {
            if (obj.dimension === this.currentDimension) {
                obj.update(dt);
            }
        }

        // 3. Static dimension (always on top)
        for (const obj of this.level.objects) {
            if (obj.dimension === 0) {
                obj.update(dt);
            }
        }
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
