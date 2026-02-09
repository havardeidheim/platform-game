import { TARGET_FPS } from './utils/constants.js';

// Speed thresholds in seconds: [star3, star4, star5]
// Levels without thresholds have null (max 2 stars for those levels)
const SPEED_THRESHOLDS: (readonly [number, number, number] | null)[] = [
    null,          // index 0 unused (levels are 1-indexed)
    [5.33, 5.07, 4.80],     // Level 1
    [14.93, 14.40, 14.00],  // Level 2
    [26.13, 25.47, 25.07],  // Level 3
    [24.00, 23.33, 22.67],  // Level 4
    [22.00, 20.80, 20.40],  // Level 5
    null,  // Level 6
    null,  // Level 7
    null,  // Level 8
    null,  // Level 9
    null,  // Level 10
];

export function calculateStars(levelNumber: number, totalFrames: number, didRespawn: boolean): number {
    const timeSeconds = totalFrames / TARGET_FPS;

    // Star 1: completion (always awarded)
    let stars = 1;

    // Star 2: no deaths
    if (!didRespawn) {
        stars++;
    }

    // Stars 3-5: speed thresholds
    const thresholds = SPEED_THRESHOLDS[levelNumber] ?? null;
    if (thresholds) {
        if (timeSeconds <= thresholds[0]) stars++; // Star 3
        if (timeSeconds <= thresholds[1]) stars++; // Star 4
        if (timeSeconds <= thresholds[2]) stars++; // Star 5
    }

    return stars;
}
