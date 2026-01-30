
# Classic platforming game based on an original flash/as3 game

This is a classic platforming game, ported to typescript from an old project written in flash/as3. The game has a thin html wrapper around a simple canvas based game.
The original game is very simple and does not follow any best practices around object orientations etc.


## For porting

The folder `original-flash-game\PlatformGame\source` contains the source of the original game.


## Technology

The game is written in typescript and use a simple html wrapper. The build is handled using vite and scss is used for styling.

### Building the game
Use `npm run build` to build the game and `npm run dev` to run a dev server. `build` will also build html and scss using vite.

## How the game works

The game consists of levels. Each level has a start and a goal, super mario style, with checkpoints. The gimmick is that each game object exits in a given "dimension", the player can switch beteen the 2 dimensions by pressing space and the player only interacts with the object in their current dimension.

The game has a main game loop where logic in run and objects are rendered. each game object has its own logic based on collision and different effects.


## Levels / map definitions

Levels are stores as json in `source\public\levels` and consists of a collection of game objects and placements.


## Game architecture

Different parts of the game logic is included with multiple .js files, use nativ browser js modules