import {
    COLOR_GAME_BACKGROUND,
    COLOR_LEVEL_SELECT_ITEM,
    COLOR_LEVEL_SELECT_TITLE,
} from './utils/colors.js';

export class LoadingScreen {
    private ctx: CanvasRenderingContext2D;
    private animationFrameId: number = 0;
    private running: boolean = false;
    private loaded: number = 0;
    private total: number = 1;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    start(): void {
        this.running = true;
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    setProgress(loaded: number, total: number): void {
        this.loaded = loaded;
        this.total = total;
    }

    destroy(): void {
        this.running = false;
        cancelAnimationFrame(this.animationFrameId);
    }

    private loop(): void {
        if (!this.running) return;
        this.render();
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    private render(): void {
        const { ctx } = this;
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        ctx.fillStyle = COLOR_GAME_BACKGROUND;
        ctx.fillRect(0, 0, w, h);

        // Title
        ctx.font = 'bold 32px monospace';
        ctx.fillStyle = COLOR_LEVEL_SELECT_TITLE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LOADING...', w / 2, h / 2 - 30);

        // Progress bar
        const barWidth = 300;
        const barHeight = 24;
        const barX = (w - barWidth) / 2;
        const barY = h / 2 + 10;
        const progress = this.total > 0 ? this.loaded / this.total : 0;

        // Track
        ctx.fillStyle = COLOR_LEVEL_SELECT_ITEM;
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Fill
        ctx.fillStyle = COLOR_LEVEL_SELECT_TITLE;
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);

        ctx.textBaseline = 'alphabetic';
    }
}
