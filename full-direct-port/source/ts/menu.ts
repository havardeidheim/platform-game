import * as Achievements from './achievements';
import { STAGE_COLOR } from './flash';
import { drawSymbol, drawTextField, symbolBounds } from './graphics';
import { getLevelCount } from './levels';
import type { Renderer } from './renderer';
import type { MainNavigation, Screen, StagePointer } from './screen';

const BUTTON = 'Menu/MenuKnapp';
const STAR = 'Menu/MenuStar';

// MenuKnapp's "tekstfelt": bold 24px Times, centered
const LABEL_X = 15;
const LABEL_Y = 13.6;
const LABEL_WIDTH = 30;
const LABEL_HEIGHT = 40.8;

interface MenuButton {
    levelnr: number;
    x: number;
    y: number;
}

/** Level select (Menu.as / MenuKnapp.as): one button per level with the stars earned below it */
export class Menu implements Screen {
    private readonly buttons: MenuButton[] = [];

    constructor(private readonly main: MainNavigation) {
        for (let i = 0; i < getLevelCount(); i++) {
            this.buttons.push({ levelnr: i, x: 15 + 70 * i, y: 300 });
        }
    }

    private buttonAt(x: number, y: number): MenuButton | null {
        const [bx, by, bw, bh] = symbolBounds(BUTTON);
        for (const b of this.buttons) {
            if (x >= b.x + bx && x <= b.x + bx + bw && y >= b.y + by && y <= b.y + by + bh) {
                return b;
            }
        }
        return null;
    }

    tick(): void {
        // static
    }

    render(renderer: Renderer): void {
        renderer.beginFrame(STAGE_COLOR);
        const ctx = renderer.ctx;
        const buttonHeight = symbolBounds(BUTTON)[3];
        for (const b of this.buttons) {
            drawSymbol(ctx, BUTTON, b.x, b.y);
            drawTextField(ctx, '' + (b.levelnr + 1), b.x + LABEL_X, b.y + LABEL_Y, LABEL_WIDTH, LABEL_HEIGHT,
                { size: 24, bold: true, align: 'center' });
            for (let j = 0; j < Achievements.getstars(b.levelnr); j++) {
                drawSymbol(ctx, STAR, 1 + b.x + 12 * j, b.y + buttonHeight + 5);
            }
        }
    }

    keyDown(_code: string): void {}
    keyUp(_code: string): void {}

    pointerDown(p: StagePointer): void {
        const b = this.buttonAt(p.x, p.y);
        if (b) {
            this.main.newGame(b.levelnr);
        }
    }

    pointerMove(_p: StagePointer): void {}
    pointerUp(_p: StagePointer): void {}

    cursorAt(x: number, y: number): string {
        return this.buttonAt(x, y) ? 'pointer' : 'default';
    }
}
