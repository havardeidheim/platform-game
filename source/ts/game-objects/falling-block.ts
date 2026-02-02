import { GameObject } from './game-object.js';
import { Point } from '../utils/geometry.js';
import { COLOR_BLOCK_FILL, COLOR_FALLING_BLOCK } from '../utils/colors.js';
import { GRAVITY, Y_MAX_SPEED, FRAME_INTERVAL } from '../utils/constants.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

const FALL_DELAY = 500;      // ms before falling starts
const FALL_DURATION = 3000;  // ms of falling before reset

export class FallingBlock extends GameObject {
    private falling: boolean = false;
    private ySpeed: number = 0;
    private started: boolean = false;
    private fallTimer: number = 0;
    private respawnTimer: number = 0;
    private lastBlockY: number = 0;

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = COLOR_FALLING_BLOCK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 1.5);
        ctx.lineTo(this.x + this.width, this.y + 1.5);
        ctx.stroke();
    }

    override resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();
        const lastBounds = player.getLastBounds();

        // Use the block's pre-movement top so a player resting on it still
        // registers after the block falls in update(). A small tolerance avoids
        // the check degenerating into exact float equality when the player is
        // grounded and not moving (lastBounds.bottom == bounds.bottom).
        const prevTop = this.lastBlockY;
        const eps = 0.5;

        if (lastBounds.bottom <= prevTop + eps && bounds.bottom >= prevTop - eps && bounds.right >= b.left && bounds.left <= b.right) {
            normal.x = 0;
            normal.y = b.top - bounds.bottom;

            // Block fell below the player: reposition directly and zero the
            // normal so collide() keeps the grounded state.
            if (normal.y > 0) {
                player.y += normal.y;
                normal.y = 0;
            }

            if (!this.started) {
                this.started = true;
                this.fallTimer = 0;
            }

            return true;
        }

        return false;
    }

    update(player: Player, game: Game): void {
        // Capture position before movement for collision checks
        this.lastBlockY = this.y;

        // Delay before falling starts
        if (this.started && !this.falling) {
            this.fallTimer += FRAME_INTERVAL;
            if (this.fallTimer >= FALL_DELAY) {
                this.falling = true;
                this.respawnTimer = 0;
            }
        }

        if (this.falling) {
            // Apply gravity
            if (this.ySpeed < Y_MAX_SPEED) {
                this.ySpeed += GRAVITY;
                if (this.ySpeed > Y_MAX_SPEED) {
                    this.ySpeed = Y_MAX_SPEED;
                }
            }
            this.y += this.ySpeed;

            // Track fall duration and reset
            this.respawnTimer += FRAME_INTERVAL;
            if (this.respawnTimer >= FALL_DURATION) {
                this.reset();
            }
        }
    }

    override reset(): void {
        super.reset();
        this.ySpeed = 0;
        this.falling = false;
        this.started = false;
        this.fallTimer = 0;
        this.respawnTimer = 0;
        this.lastBlockY = this.y;
    }
}
