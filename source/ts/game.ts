import { Level } from './levels/level.js';
import { Player } from './game-objects/player.js';
import { CheckPoint } from './game-objects/checkpoint.js';
import { GameKeyboardControls } from './game-keyboard-controls.js';

export class Game {
    level: Level;
    running: boolean = false;
    currentDimension: number = 1;
    player: Player;
    private controls: GameKeyboardControls;
    private animationFrameId: number = 0;
    private lastTime: number = 0;
    private frameInterval: number = 1000 / 60;
    private accumulated: number = 0;
    private ctx: CanvasRenderingContext2D;

    private checkpoint: CheckPoint | null = null;

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
        this.currentDimension = 1;

        if (this.checkpoint) {
            this.player.startX = this.checkpoint.x + this.player.width/2;
            this.player.startY = this.checkpoint.y + this.player.width/2;
        }

        this.player.respawn();
        this.respawnCamera = true;
    }

    win(): void {
        this.pause();
    }

    setCheckpoint(checkpoint: CheckPoint): void {
        if(this.checkpoint){
            this.checkpoint.active = false;
        }
        this.checkpoint = checkpoint;
        checkpoint.active = true;
    }

    setActiveDimension(dimension: number): void {
        if (dimension === 1 || dimension === 2) {
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

        const dt = this.accumulated / 1000;
        this.accumulated = 0;

        this.update(dt);
        this.render();
    }

    private update(dt: number): void {
        // Handle respawn
        if (this.controls.hasRespawned()) {
            this.reset();
        }

        const passiveDimension = this.currentDimension === 1 ? 2 : 1;

        // 1. Passive dimension (background)
        for (const obj of this.level.objects) {
            if (obj.dimension === passiveDimension) {
                obj.update(dt, this.player, this);
            }
        }

        // 2. Active dimension
        for (const obj of this.level.objects) {
            if (obj.dimension === this.currentDimension) {
                obj.update(dt, this.player, this);
            }
        }

        // 3. Static dimension (always on top)
        for (const obj of this.level.objects) {
            if (obj.dimension === 0) {
                obj.update(dt, this.player, this);
            }
        }

        // 4. Player (after all other objects)
        this.player.update(dt, this.player, this);

        // 5. Update camera to follow player
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
        const passiveDimension = this.currentDimension === 1 ? 2 : 1;

        // Apply camera offset — all world objects shift by the camera position
        ctx.save();
        ctx.translate(-this.cameraX, -this.cameraY);

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

        // 4. Player (always on top of everything)
        this.player.render(ctx);

        ctx.restore();
    }
}
