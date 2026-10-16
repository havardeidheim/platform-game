const STORAGE_KEY = 'platformgame-progress';

interface ProgressData {
    [levelNumber: string]: number;
}

export class SaveManager {
    private data: ProgressData;

    constructor() {
        this.data = {};
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                this.data = JSON.parse(raw);
            } catch {
                this.data = {};
            }
        }
    }

    getStars(levelNumber: number): number {
        return this.data[String(levelNumber)] ?? 0;
    }

    setStars(levelNumber: number, stars: number): void {
        const current = this.getStars(levelNumber);
        if (stars > current) {
            this.data[String(levelNumber)] = stars;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
    }
}
