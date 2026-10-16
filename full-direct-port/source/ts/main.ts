import * as Achievements from './achievements';
import { FRAME_RATE, STAGE_HEIGHT, STAGE_WIDTH } from './flash';
import { Game } from './game';
import { Menu } from './menu';
import { Renderer } from './renderer';
import type { MainNavigation, Screen, StagePointer } from './screen';

const FRAME_MS = 1000 / FRAME_RATE;
const MAX_FRAMES_PER_UPDATE = 4;

/** Owns the stage: scaling, input, the 40 fps frame loop and switching between menu and game (Main.as) */
class Main implements MainNavigation {
    private screen: Screen;
    private readonly renderer: Renderer;
    private touchButtons = false;

    private lastTime = 0;
    private accumulator = 0;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        Achievements.load();
        this.screen = new Menu(this);

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.bindInput();
        requestAnimationFrame(t => this.frame(t));
    }

    newGame(levelnr: number): void {
        this.screen = new Game(this, levelnr, this.touchButtons);
    }

    showMenu(): void {
        this.screen = new Menu(this);
    }

    /** Scales the stage to fit the window, keeping its aspect ratio (Flash "showAll") */
    private resize(): void {
        const scale = Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT);
        const cssWidth = Math.floor(STAGE_WIDTH * scale);
        const cssHeight = Math.floor(STAGE_HEIGHT * scale);
        this.canvas.style.width = cssWidth + 'px';
        this.canvas.style.height = cssHeight + 'px';
        this.renderer.resize((cssWidth / STAGE_WIDTH) * (window.devicePixelRatio || 1));
        this.screen.render(this.renderer);
    }

    private toStage(e: PointerEvent): StagePointer {
        const rect = this.canvas.getBoundingClientRect();
        return {
            id: e.pointerId,
            x: ((e.clientX - rect.left) / rect.width) * STAGE_WIDTH,
            y: ((e.clientY - rect.top) / rect.height) * STAGE_HEIGHT,
            touch: e.pointerType === 'touch',
        };
    }

    private bindInput(): void {
        window.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                e.preventDefault();
            }
            this.screen.keyDown(e.code);
        });
        window.addEventListener('keyup', e => this.screen.keyUp(e.code));
        // Releases held keys when the window loses focus, like Flash losing focus
        window.addEventListener('blur', () => {
            this.screen.keyUp('KeyA');
            this.screen.keyUp('KeyD');
        });

        const canvas = this.canvas;
        canvas.addEventListener('pointerdown', e => {
            e.preventDefault();
            canvas.setPointerCapture(e.pointerId);
            const p = this.toStage(e);
            if (p.touch) {
                // played on a touch screen, show the on-screen controls in every level from now on
                this.touchButtons = true;
            }
            this.screen.pointerDown(p);
        });
        canvas.addEventListener('pointermove', e => {
            const p = this.toStage(e);
            this.screen.pointerMove(p);
            canvas.style.cursor = this.screen.cursorAt(p.x, p.y);
        });
        const up = (e: PointerEvent) => this.screen.pointerUp(this.toStage(e));
        canvas.addEventListener('pointerup', up);
        canvas.addEventListener('pointercancel', up);
        canvas.addEventListener('contextmenu', e => e.preventDefault());
    }

    private frame(time: number): void {
        if (this.lastTime === 0) {
            this.lastTime = time;
        }
        this.accumulator += time - this.lastTime;
        this.lastTime = time;

        let steps = 0;
        while (this.accumulator >= FRAME_MS && steps < MAX_FRAMES_PER_UPDATE) {
            this.screen.tick();
            this.accumulator -= FRAME_MS;
            steps++;
        }
        if (steps === MAX_FRAMES_PER_UPDATE) {
            // fell behind (tab in background or slow device), drop the backlog like Flash drops frames
            this.accumulator = 0;
        }
        if (steps > 0) {
            this.screen.render(this.renderer);
        }
        requestAnimationFrame(t => this.frame(t));
    }
}

async function start(): Promise<void> {
    // Text is drawn on the canvas, so the font has to be ready before the first frame
    try {
        await Promise.all([
            document.fonts.load('24px GameTimes'),
            document.fonts.load('bold 24px GameTimes'),
        ]);
    } catch {
        // fall back to whatever serif font is available
    }
    new Main(document.getElementById('stage') as HTMLCanvasElement);
}

start();
