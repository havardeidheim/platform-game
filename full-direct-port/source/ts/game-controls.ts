import { Rectangle } from './flash';
import { drawSymbol, symbolBounds } from './graphics';
import type { Renderer } from './renderer';
import type { StagePointer } from './screen';

export interface GameControlsListener {
    leftClicked(): void;
    rightClicked(): void;
    leftReleased(): void;
    rightReleased(): void;
    jumpClicked(): void;
    dimensionClicked(): void;
    respawnClicked(): void;
    toMenuClicked(): void;
}

const RETURN_SYMBOL = 'Menu/Returnknapp';
const RETURN_X = 40;
const RETURN_Y = 0;

interface TouchButton {
    symbol: string;
    x: number;
    y: number;
    begin: () => void;
    end: () => void;
}

/**
 * Keyboard controls and the return-to-menu button (GameControls.as).
 * The on-screen touch buttons were disabled in the last Flash build; they are
 * shown here only once the player touches the screen, so the game works on phones.
 */
export class GameControls {
    private dimensionupdown = false;
    private readonly touchButtons: TouchButton[];
    private readonly pointerButtons = new Map<number, TouchButton | null>();

    constructor(private readonly listener: GameControlsListener, public showTouchButtons: boolean) {
        const l = listener;
        this.touchButtons = [
            { symbol: 'Controls/LeftButton', x: 5, y: 375, begin: () => l.leftClicked(), end: () => l.leftReleased() },
            { symbol: 'Controls/RightButton', x: 110, y: 375, begin: () => l.rightClicked(), end: () => l.rightReleased() },
            { symbol: 'Controls/JumpButton', x: 695, y: 375, begin: () => l.jumpClicked(), end: () => {} },
            {
                symbol: 'Controls/DimensionButton', x: 590, y: 375,
                begin: () => {
                    if (!this.dimensionupdown) {
                        l.dimensionClicked();
                        this.dimensionupdown = true;
                    }
                },
                end: () => { this.dimensionupdown = false; },
            },
            { symbol: 'Controls/RespawnButton', x: 350, y: -50, begin: () => l.respawnClicked(), end: () => {} },
        ];
    }

    keyDown(code: string): void {
        if (code === 'KeyA') {
            this.listener.leftClicked();
        } else if (code === 'KeyD') {
            this.listener.rightClicked();
        } else if (code === 'KeyW') {
            this.listener.jumpClicked();
        } else if (code === 'Space') {
            this.listener.dimensionClicked();
        } else if (code === 'KeyR') {
            this.listener.respawnClicked();
        }
    }

    keyUp(code: string): void {
        if (code === 'KeyA') {
            this.listener.leftReleased();
        } else if (code === 'KeyD') {
            this.listener.rightReleased();
        }
    }

    private returnButtonBounds(): Rectangle {
        const [bx, by, bw, bh] = symbolBounds(RETURN_SYMBOL);
        return new Rectangle(RETURN_X + bx, RETURN_Y + by, bw, bh);
    }

    private touchButtonAt(x: number, y: number): TouchButton | null {
        if (!this.showTouchButtons) {
            return null;
        }
        for (const b of this.touchButtons) {
            const dx = x - (b.x + 50);
            const dy = y - (b.y + 50);
            if (dx * dx + dy * dy <= 52 * 52) {
                return b;
            }
        }
        return null;
    }

    isOverButton(x: number, y: number): boolean {
        const r = this.returnButtonBounds();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    pointerDown(p: StagePointer): void {
        if (p.touch) {
            this.showTouchButtons = true;
            const button = this.touchButtonAt(p.x, p.y);
            this.pointerButtons.set(p.id, button);
            button?.begin();
            if (button) {
                return;
            }
        }
        if (this.isOverButton(p.x, p.y)) {
            this.listener.toMenuClicked();
        }
    }

    pointerMove(p: StagePointer): void {
        if (!this.pointerButtons.has(p.id)) {
            return;
        }
        const previous = this.pointerButtons.get(p.id) ?? null;
        const button = this.touchButtonAt(p.x, p.y);
        if (button !== previous) {
            previous?.end();
            button?.begin();
            this.pointerButtons.set(p.id, button);
        }
    }

    pointerUp(p: StagePointer): void {
        if (!this.pointerButtons.has(p.id)) {
            return;
        }
        this.pointerButtons.get(p.id)?.end();
        this.pointerButtons.delete(p.id);
    }

    render(renderer: Renderer): void {
        const ctx = renderer.ctx;
        if (this.showTouchButtons) {
            for (const b of this.touchButtons) {
                drawSymbol(ctx, b.symbol, b.x, b.y);
            }
        }
        drawSymbol(ctx, RETURN_SYMBOL, RETURN_X, RETURN_Y);
    }
}
