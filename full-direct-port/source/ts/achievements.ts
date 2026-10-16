import { int } from './flash';
import { getLevelCount } from './levels';

// Best times and stars per level (Archivements.as). The original stored this in a
// Flash SharedObject named "no.platform"; here it is kept in localStorage.

const STORAGE_KEY = 'no.platform';
const NO_SCORE = 10000 * 4;

const scoreLimits: number[][] = [
    [36, 38, 40, 42],
    [105, 108, 112, 120],
    [188, 191, 196, 210],
    [170, 175, 180, 200],
    [153, 156, 165, 175],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

let scorearray: number[] = [];
let framesarray: number[] = [];

interface SaveData {
    score: number[];
    frames: number[];
}

function readSave(): SaveData | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as SaveData;
        if (!Array.isArray(data.score) || !Array.isArray(data.frames)) return null;
        return data;
    } catch {
        return null;
    }
}

function writeSave(): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ score: scorearray, frames: framesarray }));
    } catch {
        // storage unavailable, progress is kept for this session only
    }
}

export function load(): void {
    const saved = readSave();
    scorearray = [];
    framesarray = [];
    for (let i = 0; i < getLevelCount(); i++) {
        scorearray[i] = saved?.score[i] ?? 0;
        framesarray[i] = saved?.frames[i] ?? NO_SCORE;
    }
}

export function setscore(levelnr: number, frames: number): void {
    const nystars = starsforframes(levelnr, frames);
    if (nystars > scorearray[levelnr]) {
        scorearray[levelnr] = nystars;
    }
    if (frames < framesarray[levelnr]) {
        framesarray[levelnr] = frames;
    }
    writeSave();
}

export function getstars(levelnr: number): number {
    return scorearray[levelnr];
}

export function getDisplayFrames(levelnr: number): number {
    return int(framesarray[levelnr] / 4);
}

export function framesToDisplayframes(frames: number): number {
    return int(frames / 4);
}

function starsforframes(levelnr: number, frames: number): number {
    frames = framesToDisplayframes(frames);
    for (let i = 0; i < 4; i++) {
        if (frames <= scoreLimits[levelnr][i]) {
            return 5 - i;
        }
    }
    return 1;
}

export const MAX_SCORE_FRAMES = NO_SCORE;
