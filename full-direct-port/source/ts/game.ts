import * as Achievements from './achievements';
import { FRAME_RATE, int, Point, STAGE_COLOR, STAGE_HEIGHT, STAGE_WIDTH, TimerQueue } from './flash';
import { GameControls, GameControlsListener } from './game-controls';
import { drawTextField } from './graphics';
import { getLevel, LevelObjects } from './levels';
import { AbstractObject } from './objects/abstract-object';
import { FallingBlock } from './objects/blocks';
import { CheckPoint } from './objects/checkpoint';
import { DangerousArea } from './objects/dangerous-area';
import { Player, PlayerListener } from './player';
import type { Renderer } from './renderer';
import type { MainNavigation, Screen, StagePointer } from './screen';

const STARTDIMENSION = true;
const FRAME_MS = 1000 / FRAME_RATE;

// TimeField symbol: placed at 2,35 with a red 24px Times text field
const TIMEFIELD_X = 2;
const TIMEFIELD_Y = 35;

function dimKey(d: boolean): 'true' | 'false' {
    return d ? 'true' : 'false';
}

/** A running level (Game.as) */
export class Game implements Screen, PlayerListener, GameControlsListener {
    private player: Player;
    private dimension = STARTDIMENSION;
    private objekter: LevelObjects;
    private checkpoint: CheckPoint | null = null;

    private frames = 0;
    private checkpointframes = 0;
    private timeText = '';

    private firstspawn = true;
    private respawn = true;
    private running = true;

    private readonly timers = new TimerQueue();
    private readonly controls: GameControls;
    /** Objects in display list order, bottom first */
    private readonly displayList: AbstractObject[];

    constructor(private readonly main: MainNavigation, private readonly levelnr: number, touchButtons: boolean) {
        this.objekter = getLevel(levelnr, this.timers);

        for (const at of this.objekter[dimKey(STARTDIMENSION)]) {
            at.setAlpha(1);
        }
        for (const af of this.objekter[dimKey(!STARTDIMENSION)]) {
            af.setAlpha(0.2);
        }
        this.displayList = this.buildDisplayList();

        this.player = new Player(0, 0, this);
        this.centerStage();

        this.controls = new GameControls(this, touchButtons);
    }

    /**
     * The original adds the objects with addChildAt(obj, 0), first the start dimension then the other,
     * and then moves every DangerousArea to the bottom. Both lists are in reverse placement order.
     */
    private buildDisplayList(): AbstractObject[] {
        const start = [...this.objekter[dimKey(STARTDIMENSION)]].reverse();
        const other = [...this.objekter[dimKey(!STARTDIMENSION)]].reverse();
        const isDanger = (o: AbstractObject) => o instanceof DangerousArea;
        return [
            ...other.filter(isDanger),
            ...start.filter(isDanger),
            ...other.filter(o => !isDanger(o)),
            ...start.filter(o => !isDanger(o)),
        ];
    }

    setCheckpoint(che: CheckPoint): void {
        if (this.checkpoint !== che && this.checkpoint !== null) {
            this.checkpoint.gotoAndStop('still');
        }
        if (this.checkpoint === null || this.checkpoint !== che) {
            this.checkpoint = che;
            this.checkpointframes = this.frames;
        }
    }

    reset(): void {
        this.frames = this.checkpointframes;
        this.respawn = true;
        for (const at of this.objekter[dimKey(STARTDIMENSION)]) {
            at.setAlpha(1);
            at.reset();
        }
        for (const af of this.objekter[dimKey(!STARTDIMENSION)]) {
            af.setAlpha(0.2);
            af.reset();
        }

        // The original always has a checkpoint at the start of a level, fall back to the level start
        const spawnX = this.checkpoint ? this.checkpoint.x + 10 : 0;
        const spawnY = this.checkpoint ? this.checkpoint.y + 10 : 0;
        this.player = new Player(spawnX, spawnY, this);
        this.centerStage();

        if (this.checkpoint) {
            this.player.x = this.checkpoint.x + 10;
            this.player.y = this.checkpoint.y + 10;
            this.player.lastPosition = { x: this.checkpoint.x + 10, y: this.checkpoint.y + 10 };
        }

        this.dimension = STARTDIMENSION;
    }

    private toMenu(scoreinframes: number): void {
        if (scoreinframes < Achievements.MAX_SCORE_FRAMES) {
            Achievements.setscore(this.levelnr, scoreinframes);
        }
        this.running = false;
        this.main.showMenu();
    }

    win(): void {
        this.toMenu(this.frames);
    }

    tick(): void {
        this.timers.advance(FRAME_MS);
        if (this.running) {
            this.loop();
        }
    }

    private loop(): void {
        this.timeText = Achievements.framesToDisplayframes(this.frames) + '/' + Achievements.getDisplayFrames(this.levelnr);

        this.player.loop();
        for (const obf of this.objekter[dimKey(this.dimension)]) {
            if (obf instanceof FallingBlock) {
                obf.loop();
            }
        }

        let collided = false;
        const changepos: Point = { x: 0, y: 0 };
        for (const obc of this.objekter[dimKey(this.dimension)]) {
            if (obc.hitTest(this.player, changepos)) {
                this.player.collide(changepos);
                collided = true;
            }
        }
        if (!collided) {
            this.player.noCollision();
        }
        for (const obd of this.objekter[dimKey(this.dimension)]) {
            if (!(obd instanceof FallingBlock)) {
                obd.loop();
            }
        }
        for (const obi of this.objekter[dimKey(!this.dimension)]) {
            obi.loop();
        }
        // guard for returning to the menu
        if (this.running) {
            this.centerStage();
        }
        this.frames++;
    }

    /** Keeps the player centered horizontally and within the middle band vertically by moving the level */
    private centerStage(): void {
        let changex = 0;
        let changey = 0;
        const player = this.player;

        changex = int(STAGE_WIDTH / 2 - player.x);
        player.x = STAGE_WIDTH / 2;
        if (this.firstspawn || this.respawn) {
            changey = int(STAGE_HEIGHT / 2 - player.y);
            player.y = STAGE_HEIGHT / 2;
        } else if (player.y > (STAGE_HEIGHT / 3) * 2) {
            changey = int((STAGE_HEIGHT / 3) * 2 - player.y);
            player.y = (STAGE_HEIGHT / 3) * 2;
        } else if (player.y < (STAGE_HEIGHT / 3) * 1 + 50) {
            changey = int((STAGE_HEIGHT / 3) * 1 + 50 - player.y);
            player.y = (STAGE_HEIGHT / 3) * 1 + 50;
        }
        for (const objt of this.objekter.true) {
            objt.move(changex, changey);
        }
        for (const objf of this.objekter.false) {
            objf.move(changex, changey);
        }
        this.firstspawn = false;
        this.respawn = false;
    }

    render(renderer: Renderer): void {
        renderer.beginFrame(STAGE_COLOR);
        for (const o of this.displayList) {
            renderer.draw(o.alpha, o.displayBounds(), ctx => o.draw(ctx));
        }
        drawTextField(renderer.ctx, this.timeText, TIMEFIELD_X, TIMEFIELD_Y, 137, 30.6, { size: 24, color: '#FF0000' });
        this.player.draw(renderer.ctx);
        this.controls.render(renderer);
    }

    // Controls

    keyDown(code: string): void {
        if (this.running) this.controls.keyDown(code);
    }
    keyUp(code: string): void {
        if (this.running) this.controls.keyUp(code);
    }
    pointerDown(p: StagePointer): void {
        if (this.running) this.controls.pointerDown(p);
    }
    pointerMove(p: StagePointer): void {
        if (this.running) this.controls.pointerMove(p);
    }
    pointerUp(p: StagePointer): void {
        if (this.running) this.controls.pointerUp(p);
    }
    cursorAt(x: number, y: number): string {
        return this.controls.isOverButton(x, y) ? 'pointer' : 'default';
    }

    leftClicked(): void {
        this.player.movePlayerLeft();
    }
    rightClicked(): void {
        this.player.movePlayerRight();
    }
    leftReleased(): void {
        this.player.stopMovePlayerLeft();
    }
    rightReleased(): void {
        this.player.stopMovePlayerRight();
    }
    jumpClicked(): void {
        this.player.jump();
    }
    dimensionClicked(): void {
        for (const obd of this.objekter[dimKey(this.dimension)]) {
            obd.setAlpha(0.2);
        }
        for (const obi of this.objekter[dimKey(!this.dimension)]) {
            obi.setAlpha(1);
        }
        this.dimension = !this.dimension;
    }
    respawnClicked(): void {
        this.reset();
    }
    toMenuClicked(): void {
        this.toMenu(Achievements.MAX_SCORE_FRAMES);
    }
}

