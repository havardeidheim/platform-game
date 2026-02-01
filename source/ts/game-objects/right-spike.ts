import { GameObject } from './game-object.js';
import { Rectangle } from '../utils/geometry.js';

export class RightSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x, this.y + 2, this.width - 5, this.height - 4);
    }
}
