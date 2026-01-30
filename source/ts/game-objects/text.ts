import { GameObject } from './game-object.js';

export class Text extends GameObject {
    text: string;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, dimension: number = 0, text: string = '') {
        super(x, y, width, height, dimension);
        this.text = text;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'magenta';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update(dt: number): void {
        // no update needed
    }

    hitTest(_other: GameObject): boolean {
        return false;
    }
}
