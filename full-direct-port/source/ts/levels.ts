import { RAW_LEVELS } from './data/levels';
import { TimerQueue } from './flash';
import { AbstractObject } from './objects/abstract-object';
import { Block, BouncingBlock, FallingBlock, InterBlock, SlidingBlock, SneakyBlock } from './objects/blocks';
import { BouncingBlockRot } from './objects/bouncing-block-rot';
import { CheckPoint, Goal } from './objects/checkpoint';
import { DangerousArea } from './objects/dangerous-area';
import { HorizontalSawBlade, VerticalSawBlade } from './objects/saw-blades';
import { TextBubble } from './objects/text-bubble';

/** Objects of a level, per dimension (true/false) */
export interface LevelObjects {
    true: AbstractObject[];
    false: AbstractObject[];
}

export function getLevelCount(): number {
    return RAW_LEVELS.length;
}

/** Builds the game objects of a level from the placements in the Flash file (Levels.as) */
export function getLevel(levelnr: number, timers: TimerQueue): LevelObjects {
    const raw = RAW_LEVELS[levelnr];
    const level: LevelObjects = { true: [], false: [] };
    for (let j = raw.length - 1; j >= 0; j--) {
        const o = raw[j];
        const dim = o.alpha === 1;
        const add = level[dim ? 'true' : 'false'];
        const other = level[dim ? 'false' : 'true'];
        const { x, y, width, height } = o;

        switch (o.symbol) {
            case 'Block':
                add.push(new Block(x, y, width, height));
                break;
            case 'FallingBlock':
                add.push(new FallingBlock(timers, x, y, width, height));
                break;
            case 'VannTrampolineBlock':
            case 'LoddTrampolinBlock':
                add.push(new BouncingBlock(x, y, width, height));
                break;
            case 'BuildingCheckPoint':
                add.push(new CheckPoint(x, y));
                break;
            case 'SagRIGHTBlock':
                add.push(new HorizontalSawBlade(x + 20, y, width - 40));
                break;
            case 'SagLEFTBlock':
                add.push(new HorizontalSawBlade(x - 20, y, -width + 40));
                break;
            case 'SagDOWNBlock':
                add.push(new VerticalSawBlade(x, y + 20, height - 40));
                break;
            case 'SagUPBlock':
                add.push(new VerticalSawBlade(x, y - 20, -height + 40));
                break;
            case 'BuildingGoal':
                add.push(new Goal(x, y));
                break;
            case 'TextField':
                add.push(new TextBubble(x, y, o.text ?? '', width, height));
                other.push(new TextBubble(x, y, o.text ?? '', width, height));
                break;
            case 'DangerousBlock':
                add.push(new DangerousArea(x, y, width, height));
                break;
            case 'UpLeftTrampolineBlock':
            case 'UpRightTrampolineBlock':
                add.push(new BouncingBlockRot(x, y));
                break;
            case 'SlideBlock':
                add.push(new SlidingBlock(x, y, width, height));
                break;
            case 'SneakyBlock':
                other.push(new SneakyBlock(x, y, width, height));
                break;
            case 'InterBlock':
                add.push(new InterBlock(x, y, width, height));
                other.push(new InterBlock(x, y, width, height));
                break;
        }
    }
    return level;
}
