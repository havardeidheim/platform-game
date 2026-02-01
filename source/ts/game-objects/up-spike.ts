import { GameObject } from './game-object.js';
import { Rectangle } from '../utils/geometry.js';

export class UpSpike extends GameObject {
    getBounds(): Rectangle {
        return new Rectangle(this.x + 2, this.y + 5, this.width - 4, this.height - 10);
    }
}
