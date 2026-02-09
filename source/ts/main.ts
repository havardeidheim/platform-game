import { Game } from './game.js';
import { Level } from './levels/level.js';
import { LevelSelect } from './level-select.js';
import { LoadingScreen } from './loading-screen.js';

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

function startLevel(levelNumber: number): void {
    if (levelSelect) {
        levelSelect.destroy();
        levelSelect = null;
    }

    const level = Level.fromCached(levelNumber);
    currentGame = new Game(level, ctx);
    currentGame.setOnWin(() => {
        showLevelSelect();
    });
    currentGame.setOnExit(() => {
        showLevelSelect();
    });
    currentGame.start();
}

document.addEventListener('visibilitychange', () => {
    if (!currentGame) return;
    if (document.hidden) {
        currentGame.pause();
        currentGame.renderPauseOverlay();
    } else {
        currentGame.resume();
    }
});

const loadingScreen = new LoadingScreen(ctx);
loadingScreen.start();

Level.preloadAll((loaded, total) => {
    loadingScreen.setProgress(loaded, total);
}).then(() => {
    loadingScreen.destroy();
    showLevelSelect();
});
