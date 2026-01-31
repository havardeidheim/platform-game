import { GameObject } from './game-object.js';
import { COLOR_TEXT_BACKGROUND, COLOR_TEXT_STROKE } from '../utils/colors.js';
import { DIMENSION_STATIC } from '../utils/constants.js';
import type { Player } from './player.js';

const CORNER_RADIUS = 5;
const FONT_SIZE = 20;
const PADDING = 10;

export class Text extends GameObject {
    text: string;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, text: string = '') {
        super(x, y, width, height, DIMENSION_STATIC);
        this.text = text;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const r = CORNER_RADIUS;
        const bx = this.x - PADDING;
        const by = this.y - PADDING;
        const bw = this.width + PADDING * 2;
        const bh = this.height + PADDING * 2;

        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + bw - r, by);
        ctx.arcTo(bx + bw, by, bx + bw, by + r, r);
        ctx.lineTo(bx + bw, by + bh - r);
        ctx.arcTo(bx + bw, by + bh, bx + bw - r, by + bh, r);
        ctx.lineTo(bx + r, by + bh);
        ctx.arcTo(bx, by + bh, bx, by + bh - r, r);
        ctx.lineTo(bx, by + r);
        ctx.arcTo(bx, by, bx + r, by, r);
        ctx.closePath();

        ctx.fillStyle = COLOR_TEXT_BACKGROUND;
        ctx.fill();
        ctx.strokeStyle = COLOR_TEXT_STROKE;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (this.text) {
            ctx.fillStyle = COLOR_TEXT_STROKE;
            ctx.font = `${FONT_SIZE}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    update(dt: number, player: Player, game: Game): void {
        // no update needed
    }

    hitTest(_other: GameObject): boolean {
        return false;
    }
}
