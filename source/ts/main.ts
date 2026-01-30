import { Game } from './game.js';
import { Level } from './gameObjects/base/level.js';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

async function init() {
    const level = await Level.load('./levels/level-7.json');
    const game = new Game(level, ctx);
    game.start();
}

init();
