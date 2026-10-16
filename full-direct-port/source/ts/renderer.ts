import { Rectangle, STAGE_HEIGHT, STAGE_WIDTH } from './flash';

/**
 * Draws onto the stage canvas in stage coordinates (800x480).
 * Objects with alpha below 1 are drawn through an offscreen layer so the alpha
 * applies to the object as a whole, like a cached Flash display object.
 */
export class Renderer {
    readonly ctx: CanvasRenderingContext2D;
    private readonly layer: HTMLCanvasElement;
    private readonly layerCtx: CanvasRenderingContext2D;
    private pixelScale = 1;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.layer = document.createElement('canvas');
        this.layerCtx = this.layer.getContext('2d')!;
    }

    /** Sets the backing store size, scale is device pixels per stage pixel */
    resize(scale: number): void {
        this.pixelScale = scale;
        const w = Math.max(1, Math.round(STAGE_WIDTH * scale));
        const h = Math.max(1, Math.round(STAGE_HEIGHT * scale));
        this.canvas.width = w;
        this.canvas.height = h;
        this.layer.width = w;
        this.layer.height = h;
    }

    beginFrame(background: string): void {
        const ctx = this.ctx;
        ctx.setTransform(this.pixelScale, 0, 0, this.pixelScale, 0, 0);
        ctx.globalAlpha = 1;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    }

    /** Draws something covering the given stage area with the given alpha, skipping it when off stage */
    draw(alpha: number, bounds: Rectangle, draw: (ctx: CanvasRenderingContext2D) => void): void {
        if (alpha <= 0 || bounds.right < -2 || bounds.bottom < -2 || bounds.x > STAGE_WIDTH + 2 || bounds.y > STAGE_HEIGHT + 2) {
            return;
        }
        if (alpha >= 1) {
            draw(this.ctx);
            return;
        }
        const s = this.pixelScale;
        const x0 = Math.max(0, Math.floor((bounds.x - 2) * s));
        const y0 = Math.max(0, Math.floor((bounds.y - 2) * s));
        const x1 = Math.min(this.layer.width, Math.ceil((bounds.right + 2) * s));
        const y1 = Math.min(this.layer.height, Math.ceil((bounds.bottom + 2) * s));
        if (x1 <= x0 || y1 <= y0) {
            return;
        }
        const lc = this.layerCtx;
        lc.setTransform(1, 0, 0, 1, 0, 0);
        lc.clearRect(x0, y0, x1 - x0, y1 - y0);
        lc.setTransform(s, 0, 0, s, 0, 0);
        lc.globalAlpha = 1;
        draw(lc);
        const ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = alpha;
        ctx.drawImage(this.layer, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
        ctx.restore();
    }
}
