export class PlayerKeyboardControl {
    private keys: Record<string, boolean> = {};
    private onKeyDown: (e: KeyboardEvent) => void;
    private onKeyUp: (e: KeyboardEvent) => void;

    constructor() {
        this.onKeyDown = (e) => { this.keys[e.code] = true; };
        this.onKeyUp = (e) => { this.keys[e.code] = false; };
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    // Continuous movement (poll each frame)
    isMovingLeft(): boolean {
        return !!this.keys['KeyA'];
    }

    isMovingRight(): boolean {
        return !!this.keys['KeyD'];
    }

    // One-shot actions (consume on read so they don't repeat)
    hasJumped(): boolean {
        return this.consume('KeyW');
    }

    hasSwitchedDimension(): boolean {
        return this.consume('Space');
    }

    hasRespawned(): boolean {
        return this.consume('KeyR');
    }

    private consume(code: string): boolean {
        if (this.keys[code]) {
            this.keys[code] = false;
            return true;
        }
        return false;
    }

    destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
}
