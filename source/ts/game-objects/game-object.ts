import { Rectangle, Point } from '../utils/geometry.js';
import { COLOR_FILL, COLOR_STROKE } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export abstract class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    dimension: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0, dimension: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dimension = dimension;
    }

    getBounds(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_STROKE;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }
    abstract update(dt: number, player: Player, game: Game): void;
    abstract hitTest(other: GameObject): boolean;

    resolvePlayerCollision(player: Player, normal: Point): boolean {
        return false;
    }
}
