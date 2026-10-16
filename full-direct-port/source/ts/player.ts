import * as Co from './co';
import { Point, Rectangle, twips } from './flash';
import { drawSymbol, symbolBounds } from './graphics';
import type { CheckPoint } from './objects/checkpoint';

export interface PlayerListener {
    setCheckpoint(checkpoint: CheckPoint): void;
    reset(): void;
    win(): void;
}

const SYMBOL = 'Objects/Player';

export class Player {
    private _x = 0;
    private _y = 0;

    private moveRight = false;
    private moveLeft = false;

    private xfart = 0;
    private yfart = 0;

    private falling = true;
    private canjump = false;
    private jumping = false;

    private privlastpos: Point;

    slideLeft = false;
    slideRight = false;

    readonly width: number;
    readonly height: number;

    constructor(xx: number, yy: number, private game: PlayerListener) {
        this.x = Math.trunc(xx);
        this.y = Math.trunc(yy);
        this.privlastpos = { x: Math.trunc(xx), y: Math.trunc(yy) };
        const [, , w, h] = symbolBounds(SYMBOL);
        this.width = w;
        this.height = h;
    }

    get x(): number { return this._x; }
    set x(v: number) { this._x = twips(v); }
    get y(): number { return this._y; }
    set y(v: number) { this._y = twips(v); }

    movePlayerLeft(): void {
        this.moveLeft = true;
    }
    stopMovePlayerLeft(): void {
        this.moveLeft = false;
    }
    movePlayerRight(): void {
        this.moveRight = true;
    }
    stopMovePlayerRight(): void {
        this.moveRight = false;
    }

    jump(): void {
        if (this.canjump) {
            this.yfart = -Co.Y_ACCELERATION;
            this.canjump = false;
            this.jumping = true;
            this.falling = true;
        }
        if (this.slideLeft && this.moveLeft) {
            this.superBoost(0.4);
        } else if (this.slideRight && this.moveRight) {
            this.superBoost(-0.4);
        } else if (this.slideRight) {
            this.x += 1;
            this.superBoost(-0.2);
        } else if (this.slideLeft) {
            this.x -= 1;
            this.superBoost(0.2);
        }
    }

    superJump(dir: number): void {
        this.yfart = -Co.Y_ACCELERATION * 1.5 * dir;
        this.canjump = false;
        this.jumping = true;
        this.falling = true;
    }

    superBoost(dir: number): void {
        this.xfart = -Co.Y_ACCELERATION * 2 * dir;
        this.canjump = false;
        this.jumping = true;
        this.falling = true;
    }

    collide(change: Point): void {
        this.x += change.x;
        this.y += change.y;
        if (change.x > 0) {
            this.xfart = 0;
        } else if (change.x < 0) {
            this.xfart = 0;
        }
        if (change.y > 0) {
            this.falling = true;
            this.yfart = 0;
        } else if (change.y < 0) {
            this.yfart = 0;
            this.canjump = true;
            this.falling = false;
            this.jumping = false;
        }

        if (this.slideLeft || this.slideRight) {
            this.canjump = true;
            this.falling = true;
            this.jumping = false;
        }
    }

    noCollision(): void {
        this.falling = true;
        this.canjump = false;
        this.slideLeft = false;
        this.slideRight = false;
    }

    reachedCheckpoint(checkpoint: CheckPoint): void {
        this.game.setCheckpoint(checkpoint);
    }

    die(): void {
        this.game.reset();
    }

    win(): void {
        this.game.win();
    }

    get bounds(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    get lastBounds(): Rectangle {
        return new Rectangle(this.privlastpos.x, this.privlastpos.y, this.width, this.height);
    }

    set lastPosition(p: Point) {
        this.privlastpos = p;
    }

    loop(): void {
        // gravity
        if (this.falling && this.yfart < Co.Y_MAX_SPEED) {
            this.yfart += Co.GRAVITY;
            if (this.yfart > Co.Y_MAX_SPEED) {
                this.yfart = Co.Y_MAX_SPEED;
            }
        }
        // movement
        if (this.moveLeft) {
            if (!this.falling && this.xfart > -Co.X_MAX_SPEED) {
                this.xfart -= Co.X_ACCELERATION;
            } else if (this.xfart > -Co.X_MAX_SPEED) {
                this.xfart -= Co.X_ACCELERATION / 4;
            }
        }
        if (this.moveRight) {
            if (!this.falling && this.xfart < Co.X_MAX_SPEED) {
                this.xfart += Co.X_ACCELERATION;
            } else if (this.xfart < Co.X_MAX_SPEED) {
                this.xfart += Co.X_ACCELERATION / 4;
            }
        }
        // friction
        if (!this.moveRight && this.xfart > 0) {
            this.xfart -= Co.FRICTION;
        } else if (!this.moveLeft && this.xfart < 0) {
            this.xfart += Co.FRICTION;
        }

        if (Math.abs(this.xfart) <= Co.FRICTION) {
            this.xfart = 0;
        }
        this.privlastpos.x = this.x;
        this.privlastpos.y = this.y;
        this.x += this.xfart;
        if (this.falling) {
            this.y += this.yfart;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        drawSymbol(ctx, SYMBOL, this.x, this.y);
    }
}
