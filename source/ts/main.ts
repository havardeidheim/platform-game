import { Game, LevelResult } from './game.js';
import { Level } from './levels/level.js';
import { LevelSelect } from './level-select.js';
import { LoadingScreen } from './loading-screen.js';
import { SaveManager } from './save-manager.js';
import { calculateStars } from './star-calculator.js';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let currentGame: Game | null = null;
let levelSelect: LevelSelect | null = null;
const saveManager = new SaveManager();

function showLevelSelect(): void {
    if (currentGame) {
        currentGame.destroy();
        currentGame = null;
    }

    levelSelect = new LevelSelect(ctx, startLevel, saveManager);
    levelSelect.start();
}

function startLevel(levelNumber: number): void {
    if (levelSelect) {
        levelSelect.destroy();
        levelSelect = null;
    }

    const level = Level.fromCached(levelNumber);
    currentGame = new Game(level, ctx);
    currentGame.setOnWin((result: LevelResult) => {
        const stars = calculateStars(result.levelNumber, result.frames, result.didRespawn);
        saveManager.setStars(result.levelNumber, stars);
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
