import { GameObject } from './game-object.js';
import { Point, Line } from '../utils/geometry.js';
import { COLOR_BLOCK_FILL, COLOR_BOUNCING_BLOCK } from '../utils/colors.js';
import type { Player } from './player.js';
import type { Game } from '../game.js';

export class BouncingBlockRot extends GameObject {

    constructor(x: number, y: number, width: number, height: number, dimension: number) {
        // Original is always 40x40
        super(x, y, 40, 40, dimension);
    }

    render(ctx: CanvasRenderingContext2D): void {
        const cx = this.x + 20;
        const cy = this.y + 20;

        // Draw diamond shape
        ctx.fillStyle = COLOR_BLOCK_FILL;
        ctx.beginPath();
        ctx.moveTo(cx, this.y);          // top
        ctx.lineTo(this.x + 40, cy);     // right
        ctx.lineTo(cx, this.y + 40);     // bottom
        ctx.lineTo(this.x, cy);          // left
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = COLOR_BOUNCING_BLOCK;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    resolvePlayerCollision(player: Player, normal: Point, game: Game): boolean {
        const b = this.getBounds();
        const bounds = player.getBounds();

        // Quick AABB rejection test
        if (!bounds.intersects(b)) {
            return false;
        }

        const lastBounds = player.getLastBounds();

        // Player edge midpoints: last frame and current frame
        const lastBottom = new Point(lastBounds.x + lastBounds.width / 2, lastBounds.bottom);
        const lastTop = new Point(lastBounds.x + lastBounds.width / 2, lastBounds.y);
        const lastLeft = new Point(lastBounds.x, lastBounds.y + lastBounds.height / 2);
        const lastRight = new Point(lastBounds.right, lastBounds.y + lastBounds.height / 2);

        const curBottom = new Point(bounds.x + bounds.width / 2, bounds.bottom);
        const curTop = new Point(bounds.x + bounds.width / 2, bounds.y);
        const curLeft = new Point(bounds.x, bounds.y + bounds.height / 2);
        const curRight = new Point(bounds.right, bounds.y + bounds.height / 2);

        // Diamond edges (the four sides of the rotated square):
        // Top-left edge: from left midpoint (x, y+20) to top midpoint (x+20, y)
        const edgeUpLeft = new Line(b.x, b.y + 20, b.x + 21, b.y);
        // Top-right edge: from top midpoint (x+20, y) to right midpoint (x+40, y+20)
        const edgeUpRight = new Line(b.x + 20, b.y, b.x + 40, b.y + 21);
        // Bottom-left edge: from left midpoint (x, y+20) to bottom midpoint (x+20, y+40)
        const edgeBottomLeft = new Line(b.x, b.y + 20, b.x + 21, b.y + 40);
        // Bottom-right edge: from bottom midpoint (x+20, y+40) to right midpoint (x+40, y+20)
        const edgeBottomRight = new Line(b.x + 20, b.y + 40, b.x + 40, b.y + 21);

        // UPLEFT: player coming from below or from the right hits the top-left edge
        const bottomMovement = new Line(lastBottom.x, lastBottom.y, curBottom.x, curBottom.y);
        const rightMovement = new Line(lastRight.x, lastRight.y, curRight.x, curRight.y);
        const topMovement = new Line(lastTop.x, lastTop.y, curTop.x, curTop.y);
        const leftMovement = new Line(lastLeft.x, lastLeft.y, curLeft.x, curLeft.y);

        // UPLEFT quadrant: bounce up and slightly right
        if (edgeUpLeft.intersects(bottomMovement)) {
            player.superBoost(0.5);
            player.superJump(1);
            return false;
        }
        if (edgeUpLeft.intersects(rightMovement)) {
            player.superBoost(0.5);
            player.superJump(1);
            return false;
        }

        // UPRIGHT quadrant: bounce up and slightly left
        if (edgeUpRight.intersects(bottomMovement)) {
            player.superBoost(-0.5);
            player.superJump(1);
            return false;
        }
        if (edgeUpRight.intersects(leftMovement)) {
            player.superBoost(-0.5);
            player.superJump(1);
            return false;
        }

        // BOTLEFT quadrant: bounce down and slightly right
        if (edgeBottomLeft.intersects(topMovement)) {
            player.superBoost(0.5);
            player.superJump(-1);
            return false;
        }
        if (edgeBottomLeft.intersects(rightMovement)) {
            player.superBoost(0.5);
            player.superJump(-1);
            return false;
        }

        // BOTRIGHT quadrant: bounce down and slightly left
        if (edgeBottomRight.intersects(topMovement)) {
            player.superBoost(-0.5);
            player.superJump(-1);
            return false;
        }
        if (edgeBottomRight.intersects(leftMovement)) {
            player.superBoost(-0.5);
            player.superJump(-1);
            return false;
        }

        return false;
    }
}
