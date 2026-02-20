import { Level } from './levels/level.js';
import { DIMENSION_STATIC, DIMENSION_1, DIMENSION_2, DIMENSION_INACTIVE_ALPHA, TARGET_FPS } from './utils/constants.js';

const CAMERA_SPEED = 6;
const CAMERA_SPEED_FAST = 18;

export class LevelInspector {
    private level: Level;
    private ctx: CanvasRenderingContext2D;
    private running: boolean = false;
    private animationFrameId: number = 0;
    private lastTime: number = 0;
    private frameInterval: number = 1000 / TARGET_FPS;
    private accumulated: number = 0;
    currentDimension: number = DIMENSION_1;
    private onExitCallback: (() => void) | null = null;

    // Camera
    private cameraX: number = 0;
    private cameraY: number = 0;

    // Key state
    private keys: Record<string, boolean> = {};
    private onKeyDown: (e: KeyboardEvent) => void;
    private onKeyUp: (e: KeyboardEvent) => void;

    // FPS counter
    private fpsFrames: number = 0;
    private fpsTime: number = 0;
    private fpsDisplay: number = 0;

    constructor(level: Level, ctx: CanvasRenderingContext2D) {
        this.level = level;
        this.ctx = ctx;

        this.onKeyDown = (e) => { this.keys[e.code] = true; };
        this.onKeyUp = (e) => { this.keys[e.code] = false; };

        // Center camera on the level's starting area (first object or origin)
        const firstObj = level.objects[0];
        if (firstObj) {
            this.cameraX = firstObj.x - ctx.canvas.width / 2;
            this.cameraY = firstObj.y - ctx.canvas.height / 2;
        }
    }

    start(): void {
        this.running = true;
        this.lastTime = performance.now();
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
    }

    destroy(): void {
        this.running = false;
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    setOnExit(callback: () => void): void {
        this.onExitCallback = callback;
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

        this.updateFps(time);
        this.update();
        this.accumulated = Math.min(this.accumulated - this.frameInterval, this.frameInterval - 1);
        this.render();
    }

    private updateFps(time: number): void {
        this.fpsFrames++;
        if (time - this.fpsTime >= 1000) {
            this.fpsDisplay = this.fpsFrames;
            this.fpsFrames = 0;
            this.fpsTime = time;
        }
    }

    private consume(code: string): boolean {
        if (this.keys[code]) {
            this.keys[code] = false;
            return true;
        }
        return false;
    }

    private update(): void {
        // Exit
        if (this.consume('Escape')) {
            this.onExitCallback?.();
            return;
        }

        // Dimension toggle
        if (this.consume('Space')) {
            this.currentDimension = this.currentDimension === DIMENSION_1 ? DIMENSION_2 : DIMENSION_1;
        }

        // Camera movement
        const speed = this.keys['ShiftLeft'] || this.keys['ShiftRight'] ? CAMERA_SPEED_FAST : CAMERA_SPEED;

        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.cameraX -= speed;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.cameraX += speed;
        }
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.cameraY -= speed;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.cameraY += speed;
        }
    }

    private render(): void {
        const { ctx } = this;

        // Background
        ctx.fillStyle = 'slategray';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const passiveDimension = this.currentDimension === DIMENSION_1 ? DIMENSION_2 : DIMENSION_1;

        // Apply camera offset
        ctx.save();
        ctx.translate(-this.cameraX, -this.cameraY);

        // 1. Passive dimension (background, reduced opacity)
        ctx.globalAlpha = DIMENSION_INACTIVE_ALPHA;
        for (const obj of this.level.objects) {
            if (obj.dimension === passiveDimension) {
                obj.render(ctx, this as never);
            }
        }
        ctx.globalAlpha = 1;

        // 2. Active dimension
        for (const obj of this.level.objects) {
            if (obj.dimension === this.currentDimension) {
                obj.render(ctx, this as never);
            }
        }

        // 3. Static dimension (always on top)
        for (const obj of this.level.objects) {
            if (obj.dimension === DIMENSION_STATIC) {
                obj.render(ctx, this as never);
            }
        }

        // 4. Object number labels
        this.renderObjectLabels();

        ctx.restore();

        // UI overlays
        this.renderLevelName();
        this.renderControlHints();
        this.renderFps();
    }

    private renderObjectLabels(): void {
        const { ctx } = this;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';

        for (let i = 0; i < this.level.objects.length; i++) {
            const obj = this.level.objects[i];
            const label = `${this.level.level}.${i + 1}`;
            const x = obj.x + 1;
            const y = obj.y;
            const metrics = ctx.measureText(label);
            const pw = 2;
            const ph = 1;
            const boxW = metrics.width + pw * 2;
            const boxH = 13 + ph;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(x, y, boxW, boxH);
            ctx.fillStyle = '#ffff00';
            ctx.fillText(label, x + pw, y + 11);
        }
    }

    private renderLevelName(): void {
        const { ctx } = this;
        ctx.font = '18px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText(`Level ${this.level.level} (Inspector)`, 10, 20);
    }

    private renderControlHints(): void {
        const { ctx } = this;
        ctx.font = '18px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText('ESC - exit', ctx.canvas.width - 10, 20);
        ctx.fillText('WASD/Arrows - move camera', ctx.canvas.width - 10, 42);
        ctx.fillText('Shift - move faster', ctx.canvas.width - 10, 64);
        ctx.fillText('Space - toggle dimension', ctx.canvas.width - 10, 86);
        ctx.textAlign = 'left';
    }

    private renderFps(): void {
        const { ctx } = this;
        ctx.font = '18px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText(`FPS: ${this.fpsDisplay}`, ctx.canvas.width - 10, ctx.canvas.height - 10);
        ctx.textAlign = 'left';
    }
}
