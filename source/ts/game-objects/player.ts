import { GameObject } from './game-object.js';
import { Point, Rectangle } from '../utils/geometry.js';
import { GameKeyboardControls } from '../game-keyboard-controls.js';
import type { Game } from '../game.js';
import {
    X_MAX_SPEED, Y_MAX_SPEED,
    X_ACCELERATION, Y_ACCELERATION,
    GRAVITY, FRICTION,
    PLAYER_WIDTH, PLAYER_HEIGHT,
} from '../utils/constants.js';

export class Player extends GameObject {
    private vx: number = 0;
    private vy: number = 0;
    private falling: boolean = true;
    private canJump: boolean = false;
    private jumping: boolean = false;
    private coyoteFrames: number = 0;
    private lastPosition: Point;
    private controls: GameKeyboardControls;

    slideLeft: boolean = false;
    slideRight: boolean = false;

    startX: number;
    startY: number;

    constructor(x: number, y: number, controls: GameKeyboardControls) {
        super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, 0);
        this.startX = x;
        this.startY = y;
        this.lastPosition = new Point(x, y);
        this.controls = controls;
    }

    update(player: Player, game: Game): void {
        // Jump (one-shot)
        if (this.controls.hasJumped()) {
            this.jump();
        }

        // Gravity
        if (this.falling && this.vy < Y_MAX_SPEED) {
            this.vy += GRAVITY;
            if (this.vy > Y_MAX_SPEED) {
                this.vy = Y_MAX_SPEED;
            }
        }

        // Horizontal movement
        if (this.controls.isMovingLeft()) {
            if (!this.falling && this.vx > -X_MAX_SPEED) {
                this.vx -= X_ACCELERATION;
            } else if (this.vx > -X_MAX_SPEED) {
                this.vx -= X_ACCELERATION / 4;
            }
        }
        if (this.controls.isMovingRight()) {
            if (!this.falling && this.vx < X_MAX_SPEED) {
                this.vx += X_ACCELERATION;
            } else if (this.vx < X_MAX_SPEED) {
                this.vx += X_ACCELERATION / 4;
            }
        }

        // Friction
        if (!this.controls.isMovingRight() && this.vx > 0) {
            this.vx -= FRICTION;
        } else if (!this.controls.isMovingLeft() && this.vx < 0) {
            this.vx += FRICTION;
        }

        if (Math.abs(this.vx) <= FRICTION) {
            this.vx = 0;
        }

        // Store last position and apply velocity
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        this.x += this.vx;
        if (this.falling) {
            this.y += this.vy;
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 1.5, this.y + 1.5, this.width - 3, this.height - 3);
    }

    getLastBounds(): Rectangle {
        return new Rectangle(this.lastPosition.x, this.lastPosition.y, this.width, this.height);
    }

    private jump(): void {
        if (this.canJump) {
            this.vy = -Y_ACCELERATION;
            this.canJump = false;
            this.jumping = true;
            this.falling = true;
            this.coyoteFrames = 0;
        }

        if (this.slideLeft && this.controls.isMovingLeft()) {
            this.superBoost(0.4);
        } else if (this.slideRight && this.controls.isMovingRight()) {
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
        this.vy = -Y_ACCELERATION * 1.5 * dir;
        this.canJump = false;
        this.jumping = true;
        this.falling = true;
    }

    superBoost(dir: number): void {
        this.vx = -Y_ACCELERATION * 2 * dir;
        this.canJump = false;
        this.jumping = true;
        this.falling = true;
    }

    collide(change: Point): void {
        this.x += change.x;
        this.y += change.y;

        if (change.x !== 0) {
            this.vx = 0;
        }

        if (change.y > 0) {
            this.falling = true;
            this.vy = 0;
        } else if (change.y < 0) {
            this.vy = 0;
            this.canJump = true;
            this.falling = false;
            this.jumping = false;
            this.coyoteFrames = 3;
        }

        if (this.slideLeft || this.slideRight) {
            this.canJump = true;
            this.falling = true;
            this.jumping = false;
        }
    }

    noCollision(): void {
        this.falling = true;
        this.slideLeft = false;
        this.slideRight = false;

        if (!this.jumping && this.coyoteFrames > 0) {
            this.coyoteFrames--;
        } else {
            this.canJump = false;
        }
    }

    respawn(): void {
        this.x = this.startX;
        this.y = this.startY;
        this.lastPosition.x = this.startX;
        this.lastPosition.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.falling = true;
        this.canJump = false;
        this.jumping = false;
        this.coyoteFrames = 0;
        this.slideLeft = false;
        this.slideRight = false;
    }
}
