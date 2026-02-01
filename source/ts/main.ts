import { Game } from './game.js';
import { Level } from './levels/level.js';
import { LevelSelect } from './level-select.js';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let currentGame: Game | null = null;
let levelSelect: LevelSelect | null = null;

function showLevelSelect(): void {
    if (currentGame) {
        currentGame.destroy();
        currentGame = null;
    }

    levelSelect = new LevelSelect(ctx, startLevel);
    levelSelect.start();
}

async function startLevel(levelNumber: number): Promise<void> {
    if (levelSelect) {
        levelSelect.destroy();
        levelSelect = null;
    }

    const level = await Level.load(`./levels/level-${levelNumber}.json`);
    currentGame = new Game(level, ctx);
    currentGame.setOnWin(() => {
        showLevelSelect();
    });
    currentGame.setOnExit(() => {
        showLevelSelect();
    });
    currentGame.start();
}

showLevelSelect();
