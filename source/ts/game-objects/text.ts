import { GameObject } from './game-object.js';
import { COLOR_TEXT_BACKGROUND, COLOR_TEXT_STROKE } from '../utils/colors.js';
import { DIMENSION_STATIC } from '../utils/constants.js';

const CORNER_RADIUS = 5;
const FONT_SIZE = 24;

export class Text extends GameObject {
    text: string;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, text: string = '') {
        super(x, y, width, height, DIMENSION_STATIC);
        this.text = text;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const r = CORNER_RADIUS;

        ctx.beginPath();
        ctx.moveTo(this.x + r, this.y);
        ctx.lineTo(this.x + this.width - r, this.y);
        ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + r, r);
        ctx.lineTo(this.x + this.width, this.y + this.height - r);
        ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - r, this.y + this.height, r);
        ctx.lineTo(this.x + r, this.y + this.height);
        ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - r, r);
        ctx.lineTo(this.x, this.y + r);
        ctx.arcTo(this.x, this.y, this.x + r, this.y, r);
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

    update(dt: number): void {
        // no update needed
    }

    hitTest(_other: GameObject): boolean {
        return false;
    }
}
