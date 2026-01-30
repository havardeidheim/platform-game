import { GameObject } from '../game-objects/game-object.js';

export interface LevelObjectData {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    dimension: number;
    text?: string;
    diameter?: number;
    range?: number;
}

export interface LevelData {
    level: number;
    sourceFile: string;
    objects: LevelObjectData[];
}
import { Block } from '../game-objects/block.js';
import { InterBlock } from '../game-objects/inter-block.js';
import { SneakyBlock } from '../game-objects/sneaky-block.js';
import { SlidingBlock } from '../game-objects/sliding-block.js';
import { FallingBlock } from '../game-objects/falling-block.js';
import { BouncingBlock } from '../game-objects/bouncing-block.js';
import { BouncingBlockRot } from '../game-objects/bouncing-block-rot.js';
import { CheckPoint } from '../game-objects/checkpoint.js';
import { Goal } from '../game-objects/goal.js';
import { DangerousArea } from '../game-objects/dangerous-area.js';
import { Text } from '../game-objects/text.js';
import { UpSpike } from '../game-objects/up-spike.js';
import { DownSpike } from '../game-objects/down-spike.js';
import { LeftSpike } from '../game-objects/left-spike.js';
import { RightSpike } from '../game-objects/right-spike.js';
import { UpPlatform } from '../game-objects/up-platform.js';
import { DownPlatform } from '../game-objects/down-platform.js';
import { LeftPlatform } from '../game-objects/left-platform.js';
import { RightPlatform } from '../game-objects/right-platform.js';
import { UpLeftTrampoline } from '../game-objects/up-left-trampoline.js';
import { UpRightTrampoline } from '../game-objects/up-right-trampoline.js';
import { VerticalSawBlade } from '../game-objects/vertical-saw-blade.js';
import { HorizontalSawBlade } from '../game-objects/horizontal-saw-blade.js';

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
