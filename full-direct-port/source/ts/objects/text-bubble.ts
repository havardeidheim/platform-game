import { Point, Rectangle } from '../flash';
import { drawTextField } from '../graphics';
import type { Player } from '../player';
import { AbstractObject } from './abstract-object';

const BORDER = 4;

/** TekstBoble.as - a text box placed in the level */
export class TextBubble extends AbstractObject {
    private readonly boxWidth: number;
    private readonly boxHeight: number;

    constructor(xx: number, yy: number, private readonly text: string,
                private readonly textWidth: number, private readonly textHeight: number) {
        super(xx, yy);
        this.boxWidth = textWidth + 10;
        this.boxHeight = textHeight + 10;
    }

    get width(): number { return this.boxWidth + BORDER; }
    get height(): number { return this.boxHeight + BORDER; }

    getCollidiableBounds(): Rectangle {
        throw new Error('does not support bounds');
    }

    hitTest(_player: Player, _normal: Point): boolean {
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.roundRect(0, 0, this.boxWidth, this.boxHeight, 2.5);
        ctx.fillStyle = '#999966';
        ctx.fill();
        ctx.lineWidth = BORDER;
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.stroke();
        drawTextField(ctx, this.text, 5, 5, this.textWidth, this.textHeight, { size: 24, bold: true, multiline: true });
        ctx.restore();
    }

    displayBounds(): Rectangle {
        return new Rectangle(this.x - BORDER / 2, this.y - BORDER / 2, this.width, this.height);
    }
}
