import { GameObject } from './base/game-object.js';

export class Text extends GameObject {
    text: string;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, dimension: number = 0, text: string = '') {
        super(x, y, width, height, dimension);
        this.text = text;
    }

    render(ctx: CanvasRenderingContext2D): void {
        // TODO
    }

    update(dt: number): void {
        // no update needed
    }

    hitTest(_other: GameObject): boolean {
        return false;
    }
}
