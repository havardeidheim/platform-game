export class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    distanceTo(other: Point): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }
}

export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get left(): number { return this.x; }
    get right(): number { return this.x + this.width; }
    get top(): number { return this.y; }
    get bottom(): number { return this.y + this.height; }

    intersects(other: Rectangle): boolean {
        return this.left < other.right &&
               this.right > other.left &&
               this.top < other.bottom &&
               this.bottom > other.top;
    }

    contains(x: number, y: number): boolean {
        return x >= this.left && x <= this.right &&
               y >= this.top && y <= this.bottom;
    }

    clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
}

export class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get length(): number {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    get start(): Point { return new Point(this.x1, this.y1); }
    get end(): Point { return new Point(this.x2, this.y2); }

    intersects(other: Line): boolean {
        const d1x = this.x2 - this.x1;
        const d1y = this.y2 - this.y1;
        const d2x = other.x2 - other.x1;
        const d2y = other.y2 - other.y1;

        const denom = d1x * d2y - d1y * d2x;
        if (denom === 0) return false; // parallel

        const dx = other.x1 - this.x1;
        const dy = other.y1 - this.y1;

        const t = (dx * d2y - dy * d2x) / denom;
        const u = (dx * d1y - dy * d1x) / denom;

        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }

    clone(): Line {
        return new Line(this.x1, this.y1, this.x2, this.y2);
    }
}
