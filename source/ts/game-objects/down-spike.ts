import { GameObject } from './game-object.js';
import { Rectangle } from '../utils/geometry.js';

export class DownSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x + 2, this.y, this.width - 4, this.height - 5);
    }
}
