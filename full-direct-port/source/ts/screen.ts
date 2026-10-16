import type { Renderer } from './renderer';

export interface StagePointer {
    id: number;
    x: number;
    y: number;
    touch: boolean;
}

/** A top level view on the stage: the menu or a running game */
export interface Screen {
    /** Runs one frame (ENTER_FRAME) */
    tick(): void;
    render(renderer: Renderer): void;
    keyDown(code: string): void;
    keyUp(code: string): void;
    pointerDown(p: StagePointer): void;
    pointerMove(p: StagePointer): void;
    pointerUp(p: StagePointer): void;
    /** Css cursor to show at a stage position */
    cursorAt(x: number, y: number): string;
}

/** Navigation between screens (Main.as) */
export interface MainNavigation {
    newGame(levelnr: number): void;
    showMenu(): void;
}
