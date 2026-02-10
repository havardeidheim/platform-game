# Classic platforming game based on an original flash/as3 game

This is a classic platforming game, ported to typescript from an old project written in flash/as3. The game has a thin html wrapper around a simple canvas based platform game.

## For porting

The folder `original-flash-game/PlatformGame/source` contains the source of the original game.

## Technology

The game is written in typescript and use a simple html wrapper. The build is handled using vite and scss is used for styling. The game runs at 60fps with a resolution of 1280x720.

- Html entry point: `source/index.html`
- Scss styling: `source/scss/`
- Typescript source code: `source/ts/`

### Building and typechecking

Always use the npm scripts defined in package.json:
- `npm run build` - typecheck and build for production
- `npm run typecheck` - typecheck only (no emit)
- `npm run dev` - typecheck and start dev server

## How the game works

The game consists of levels. Each level has a start and a goal, super mario style, with checkpoints. The gimmick is that each game object exists in a given "dimension", the player can switch between the 2 dimensions by pressing space and the player only interacts with the object in their current dimension.

The game has a main game loop where logic in run and objects are rendered. each game object has its own logic based on collision and different effects.

## Game objects

The different building blocks of the game are defined in `source/ts/game-objects`, this includes the level building blocks and the player.

## Levels / map definitions

Levels are stored as json in `source/public/levels` and consists of a collection of game objects and placements.

## Controls

The game use simple keyboard controls, defined in `source/ts/game-keyboard-controls.ts`

## Saving

The game saves level completion and stars to localStorage in `source/ts/save-manager.ts`
