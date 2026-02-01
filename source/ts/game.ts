import { Level } from './levels/level.js';
import { Player } from './game-objects/player.js';
import { CheckPoint } from './game-objects/checkpoint.js';
import { GameKeyboardControls } from './game-keyboard-controls.js';
import { Point } from './utils/geometry.js';
import { DIMENSION_STATIC, DIMENSION_1, DIMENSION_2, DIMENSION_INACTIVE_ALPHA } from './utils/constants.js';

export class Game {
    level: Level;
    running: boolean = false;
    currentDimension: number = DIMENSION_1;
    player: Player;
    private controls: GameKeyboardControls;
    private animationFrameId: number = 0;
    private lastTime: number = 0;
    private frameInterval: number = 1000 / 60;
    private accumulated: number = 0;
    private ctx: CanvasRenderingContext2D;

    // FPS counter
    private fpsFrames: number = 0;
    private fpsTime: number = 0;
    private fpsDisplay: number = 0;

    private checkpoint: CheckPoint | null = null;
    private onWinCallback: (() => void) | null = null;
    private onExitCallback: (() => void) | null = null;
    private won: boolean = false;

    // Camera state
    private cameraX: number = 0;
    private cameraY: number = 0;
    private firstSpawn: boolean = true;
    private respawnCamera: boolean = false;

    constructor(level: Level, ctx: CanvasRenderingContext2D) {
        this.level = level;
        this.ctx = ctx;
        this.controls = new GameKeyboardControls();
        this.player = new Player(0, 0, this.controls);
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

    destroy(): void {
        this.pause();
        this.controls.destroy();
    }

    reset(): void {
        this.currentDimension = DIMENSION_1;

        for (const obj of this.level.objects) {
            obj.reset();
        }

        if (this.checkpoint) {
            this.player.startX = this.checkpoint.x + this.player.width/2;
            this.player.startY = this.checkpoint.y + this.player.width/2;
        }

        this.player.respawn();
        this.respawnCamera = true;
    }

    win(): void {
        if (this.won) return;
        this.won = true;
        setTimeout(() => {
            this.onWinCallback?.();
        }, 500);
    }

    setOnWin(callback: () => void): void {
        this.onWinCallback = callback;
    }

    setOnExit(callback: () => void): void {
        this.onExitCallback = callback;
    }

    setCheckpoint(checkpoint: CheckPoint): void {
        if(this.checkpoint){
            this.checkpoint.active = false;
        }
        this.checkpoint = checkpoint;
        checkpoint.active = true;
    }

    setActiveDimension(dimension: number): void {
        if (dimension === DIMENSION_1 || dimension === DIMENSION_2) {
            this.currentDimension = dimension;
        }
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
        while (this.accumulated >= this.frameInterval) {
            this.update(this.frameInterval / 1000);
            this.accumulated -= this.frameInterval;
        }
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

    private update(dt: number): void {
        // Handle exit to level select
        if (this.controls.hasExited()) {
            this.onExitCallback?.();
            return;
        }

        // Handle respawn
        if (this.controls.hasRespawned()) {
            this.reset();
        }

        // Handle dimension switch
        if (this.controls.hasSwitchedDimension()) {
            this.setActiveDimension(
                this.currentDimension === DIMENSION_1 ? DIMENSION_2 : DIMENSION_1
            );
        }

        // 1. Update all objects (animation, movement — dimension-independent)
        for (const obj of this.level.objects) {
            obj.update(dt, this.player, this);
        }

        // 2. Update player
        this.player.update(dt, this.player, this);

        // 3. Resolve collisions (only active dimension + static)
        let collided = false;
        const normal = new Point(0, 0);

        for (const obj of this.level.objects) {
            if (obj.dimension === this.currentDimension || obj.dimension === DIMENSION_STATIC) {
                normal.x = 0;
                normal.y = 0;
                if (obj.resolvePlayerCollision(this.player, normal, this)) {
                    this.player.collide(normal);
                    collided = true;
                }
            }
        }
        if (!collided) {
            this.player.noCollision();
        }

        // 4. Update camera to follow player
        this.centerStage();
    }

    private centerStage(): void {
        const canvasWidth = this.ctx.canvas.width;
        const canvasHeight = this.ctx.canvas.height;

        // X: player is always centered horizontally
        this.cameraX = this.player.x - canvasWidth / 2;

        // Y: dead zone between upper and lower bounds
        if (this.firstSpawn || this.respawnCamera) {
            // On first spawn or respawn, center player vertically
            this.cameraY = this.player.y - canvasHeight / 2;
            this.firstSpawn = false;
            this.respawnCamera = false;
        } else {
            const playerScreenY = this.player.y - this.cameraY;
            const upperBound = canvasHeight / 3 + 50;
            const lowerBound = (canvasHeight / 3) * 2;

            if (playerScreenY < upperBound) {
                this.cameraY = this.player.y - upperBound;
            } else if (playerScreenY > lowerBound) {
                this.cameraY = this.player.y - lowerBound;
            }
            // Within dead zone: cameraY stays unchanged
        }
    }

    private renderBackground(): void {
        const { ctx } = this;
        ctx.fillStyle = 'slategray';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    private render(): void {
        this.renderBackground();

        const { ctx } = this;
        const passiveDimension = this.currentDimension === DIMENSION_1 ? DIMENSION_2 : DIMENSION_1;

        // Apply camera offset — all world objects shift by the camera position
        ctx.save();
        ctx.translate(-this.cameraX, -this.cameraY);

        // 1. Passive dimension (background, reduced opacity)
        ctx.globalAlpha = DIMENSION_INACTIVE_ALPHA;
        for (const obj of this.level.objects) {
            if (obj.dimension === passiveDimension) {
                obj.render(ctx, this);
            }
        }
        ctx.globalAlpha = 1;

        // 2. Active dimension
        for (const obj of this.level.objects) {
            if (obj.dimension === this.currentDimension) {
                obj.render(ctx, this);
            }
        }

        // 3. Static dimension (always on top)
        for (const obj of this.level.objects) {
            if (obj.dimension === DIMENSION_STATIC) {
                obj.render(ctx, this);
            }
        }

        // 4. Player (always on top of everything)
        this.player.render(ctx);

        ctx.restore();

        this.renderFps();
    }

    private renderFps(): void {
        const { ctx } = this;
        const text = `FPS: ${this.fpsDisplay}`;
        ctx.font = '14px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText(text, ctx.canvas.width - 10, 20);
        ctx.textAlign = 'left';
    }
}
