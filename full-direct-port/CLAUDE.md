# Classic platforming game based on an original flash/as3 game

This is a classic platforming game, ported to typescript from an old project written in flash/as3. The game has a thin html wrapper around a simple canvas based platform game.

This folder holds a from-scratch port that stays as close as possible to the original Flash game: same logic, balance, levels, graphics and menus. It does not include the changes made in the polished port in `../opus-4-6-manual-port`; see `../PORT-COMPARISON.md` for the differences. Keep it faithful: gameplay changes belong in a separate port.

## For porting

The folder `../original-flash-game/PlatformGame/source` contains the source of the original game.

## Technology

The game is written in typescript and use a simple html wrapper. The build is handled using vite and scss is used for styling. Like the original, the game runs at 40fps with a resolution of 800x480, scaled to fit the window.

- Html entry point: `source/index.html`
- Scss styling: `source/scss/`
- Typescript source code: `source/ts/`

### Building and typechecking

Always use the npm scripts defined in package.json, run from this folder (`full-direct-port`):
- `npm run build` - typecheck and build for production
- `npm run typecheck` - typecheck only (no emit)
- `npm run dev` - typecheck and start dev server

## How the game works

The game consists of levels. Each level has a start and a goal, super mario style, with checkpoints. The gimmick is that each game object exists in a given "dimension", the player can switch between the 2 dimensions by pressing space and the player only interacts with the object in their current dimension.

The game has a main game loop where logic in run and objects are rendered. each game object has its own logic based on collision and different effects.

## Game objects

The level objects are defined in `source/ts/objects`, the player in `source/ts/player.ts`. Each class is a direct port of the AS3 class with the same logic (the original class name is noted in the doc comment).

## Levels and graphics

Levels and graphics are extracted from the original `PlatformGame.fla` by `tools/convert-fla.py`, which generates `source/ts/data/levels.ts` (raw level placements) and `source/ts/data/symbols.ts` (vector graphics as canvas path ops). Do not edit the generated files; rerun `python3 tools/convert-fla.py` instead. `source/ts/levels.ts` turns the placements into game objects like `Levels.as`.

## Controls

The game use simple keyboard controls (A/D move, W jump, SPACE shift dimension, R respawn), defined in `source/ts/game-controls.ts`, plus the original on-screen touch buttons which appear once the screen is touched.

## Saving

The game saves stars and best times to localStorage in `source/ts/achievements.ts`. The original Flash game cleared its save on every start.
