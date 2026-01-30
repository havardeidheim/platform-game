import { GameObject, LevelData, LevelObjectData } from './game-object.js';
import { Block } from '../block.js';
import { InterBlock } from '../inter-block.js';
import { SneakyBlock } from '../sneaky-block.js';
import { SlidingBlock } from '../sliding-block.js';
import { FallingBlock } from '../falling-block.js';
import { BouncingBlock } from '../bouncing-block.js';
import { BouncingBlockRot } from '../bouncing-block-rot.js';
import { CheckPoint } from '../checkpoint.js';
import { Goal } from '../goal.js';
import { DangerousArea } from '../dangerous-area.js';
import { Text } from '../text.js';
import { UpSpike } from '../up-spike.js';
import { DownSpike } from '../down-spike.js';
import { LeftSpike } from '../left-spike.js';
import { RightSpike } from '../right-spike.js';
import { UpPlatform } from '../up-platform.js';
import { DownPlatform } from '../down-platform.js';
import { LeftPlatform } from '../left-platform.js';
import { RightPlatform } from '../right-platform.js';
import { UpLeftTrampoline } from '../up-left-trampoline.js';
import { UpRightTrampoline } from '../up-right-trampoline.js';
import { VerticalSawBlade } from '../vertical-saw-blade.js';
import { HorizontalSawBlade } from '../horizontal-saw-blade.js';

const typeMap: Record<string, new (...args: ConstructorParameters<typeof GameObject>) => GameObject> = {
    Block,
    InterBlock,
    SneakyBlock,
    SlidingBlock,
    FallingBlock,
    BouncingBlock,
    BouncingBlockRot,
    CheckPoint,
    Goal,
    DangerousArea,
    Text,
    UpSpike,
    DownSpike,
    LeftSpike,
    RightSpike,
    UpPlatform,
    DownPlatform,
    LeftPlatform,
    RightPlatform,
    UpLeftTrampoline,
    UpRightTrampoline,
    VerticalSawBlade,
    HorizontalSawBlade,
};

const sawBladeTypes = new Set(['HorizontalSawBlade', 'VerticalSawBlade']);

function createGameObject(data: LevelObjectData): GameObject {
    const Ctor = typeMap[data.type];
    if (!Ctor) {
        throw new Error(`Unknown game object type: ${data.type}`);
    }
    if (sawBladeTypes.has(data.type)) {
        return new Ctor(data.x, data.y, data.diameter!, data.range!, data.dimension);
    }
    return new Ctor(data.x, data.y, data.width, data.height, data.dimension);
}

export class Level {
    level: number;
    sourceFile: string;
    objects: GameObject[];

    constructor(data: LevelData) {
        this.level = data.level;
        this.sourceFile = data.sourceFile;
        this.objects = data.objects.map(createGameObject);
    }

    static async load(path: string): Promise<Level> {
        const response = await fetch(path);
        const data: LevelData = await response.json();
        return new Level(data);
    }
}
