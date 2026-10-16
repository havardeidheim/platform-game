# Classic platforming game based on an original flash/as3 game

A classic platforming game written in Flash/AS3 (2011-2012), and two TypeScript ports of it that run in the browser. Each level has a start, checkpoints and a goal. The gimmick is that every object exists in one of two "dimensions": the player switches between them with space and only interacts with objects in the current dimension.

## Folders

- `original-flash-game/` - the original Flash project. `PlatformGame/source` has the AS3 source, `PlatformGame/PlatformGame.fla` holds the levels and graphics (XFL format, a zip archive).
- `opus-4-6-manual-port/` - the first port, made with Opus 4.6 and polished by hand. Redrawn graphics, 1280x720 at 60fps and several gameplay changes, so the balance differs from the original.
- `full-direct-port/` - a faithful port, as close to the original as possible: same logic and balance, levels and graphics extracted from the `.fla`, original menus, 800x480 at 40fps. Use it as the reference for how the original plays.

`PORT-COMPARISON.md` lists the differences between the two ports.

Each port is a standalone Vite + TypeScript + SCSS project with its own `package.json` and `CLAUDE.md`. Run the npm scripts from the port's folder:

- `npm install`
- `npm run dev` - typecheck and start dev server
- `npm run build` - typecheck and build for production
- `npm run typecheck` - typecheck only

Keep changes to one port at a time, and keep `full-direct-port` faithful to the original.
