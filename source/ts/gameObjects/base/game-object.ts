import { Rectangle } from './geometry.js';

export interface LevelObjectData {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    dimension: number;
    text?: string;
}

export interface LevelData {
    level: number;
    sourceFile: string;
    objects: LevelObjectData[];
}

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

    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract update(dt: number): void;
    abstract hitTest(other: GameObject): boolean;
}
