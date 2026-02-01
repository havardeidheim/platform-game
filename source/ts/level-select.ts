import {
    COLOR_GAME_BACKGROUND,
    COLOR_LEVEL_SELECT_ITEM,
    COLOR_LEVEL_SELECT_ITEM_HOVER,
    COLOR_LEVEL_SELECT_TITLE,
} from './utils/colors.js';

export class LevelSelect {
    private ctx: CanvasRenderingContext2D;
    private selectedIndex: number = 0;
    private hoveredIndex: number = -1;
    private onSelect: (levelNumber: number) => void;
    private animationFrameId: number = 0;
    private running: boolean = false;

    private onKeyDown: (e: KeyboardEvent) => void;
    private onMouseMove: (e: MouseEvent) => void;
    private onClick: (e: MouseEvent) => void;

    private readonly levelCount = 10;
    private readonly itemHeight = 44;
    private readonly itemWidth = 300;
    private readonly itemGap = 6;
    private readonly startX = 80;
    private readonly titleY: number;
    private readonly firstItemY: number;

    constructor(ctx: CanvasRenderingContext2D, onSelect: (levelNumber: number) => void) {
        this.ctx = ctx;
        this.onSelect = onSelect;

        const listHeight = this.levelCount * this.itemHeight + (this.levelCount - 1) * this.itemGap;
        const titleHeight = 40;
        const titleGap = 30;
        const totalHeight = titleHeight + titleGap + listHeight;
        const topY = (ctx.canvas.height - totalHeight) / 2;
        this.titleY = topY + titleHeight;
        this.firstItemY = topY + titleHeight + titleGap;

        this.onKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'ArrowUp':
                    this.selectedIndex = (this.selectedIndex - 1 + this.levelCount) % this.levelCount;
                    break;
                case 'ArrowDown':
                    this.selectedIndex = (this.selectedIndex + 1) % this.levelCount;
                    break;
                case 'Enter':
                    this.onSelect(this.selectedIndex + 1);
                    break;
            }
        };

        this.onMouseMove = (e: MouseEvent) => {
            const index = this.getIndexFromMouse(e);
            this.hoveredIndex = index;
            if (index >= 0) {
                this.selectedIndex = index;
            }
        };

        this.onClick = (e: MouseEvent) => {
            const index = this.getIndexFromMouse(e);
            if (index >= 0) {
                this.onSelect(index + 1);
            }
        };
    }

    start(): void {
        this.running = true;
        window.addEventListener('keydown', this.onKeyDown);
        this.ctx.canvas.addEventListener('mousemove', this.onMouseMove);
        this.ctx.canvas.addEventListener('click', this.onClick);
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    destroy(): void {
        this.running = false;
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('keydown', this.onKeyDown);
        this.ctx.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.ctx.canvas.removeEventListener('click', this.onClick);
    }

    private loop(): void {
        if (!this.running) return;
        this.render();
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    private render(): void {
        const { ctx } = this;

        // Background
        ctx.fillStyle = COLOR_GAME_BACKGROUND;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Title
        ctx.font = 'bold 32px monospace';
        ctx.fillStyle = COLOR_LEVEL_SELECT_TITLE;
        ctx.textAlign = 'left';
        ctx.fillText('SELECT LEVEL', this.startX, this.titleY);

        // Level items
        for (let i = 0; i < this.levelCount; i++) {
            const y = this.firstItemY + i * (this.itemHeight + this.itemGap);

            // Item background
            ctx.fillStyle = i === this.hoveredIndex ? COLOR_LEVEL_SELECT_ITEM_HOVER : COLOR_LEVEL_SELECT_ITEM;
            ctx.fillRect(this.startX, y, this.itemWidth, this.itemHeight);

            // Selection border
            if (i === this.selectedIndex) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.startX, y, this.itemWidth, this.itemHeight);
            }

            // Item text
            ctx.font = '20px monospace';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Level ${i + 1}`, this.startX + 16, y + this.itemHeight / 2);
        }

        // Reset textBaseline
        ctx.textBaseline = 'alphabetic';
    }

    private getIndexFromMouse(e: MouseEvent): number {
        const rect = this.ctx.canvas.getBoundingClientRect();
        const scaleX = this.ctx.canvas.width / rect.width;
        const scaleY = this.ctx.canvas.height / rect.height;
        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        for (let i = 0; i < this.levelCount; i++) {
            const itemY = this.firstItemY + i * (this.itemHeight + this.itemGap);
            if (
                canvasX >= this.startX && canvasX <= this.startX + this.itemWidth &&
                canvasY >= itemY && canvasY <= itemY + this.itemHeight
            ) {
                return i;
            }
        }
        return -1;
    }
}
