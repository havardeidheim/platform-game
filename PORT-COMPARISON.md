# Port comparison

How the two TypeScript ports differ from each other and from the original Flash game.

- **`opus-4-6-manual-port`**: the first port, made with Opus 4.6 and polished by hand.
- **`full-direct-port`**: a from-scratch port that follows the original AS3 code class by class. Its levels and graphics are extracted from `PlatformGame.fla`.

The comparison comes from reading both codebases and diffing `opus-4-6-manual-port/source/public/levels/*.json` against the placements in the original `.fla`.

**In short:** the level layouts are almost identical. The feel and the balance are not. The manual port runs the original's per-frame physics at 60 fps instead of 40 fps, so everything happens 1.5× faster. On top of that it shows more of the level, changes several mechanics, scores differently, and still has saw-blade conversion errors in levels 3-9.

## Gameplay and balance

| | Original / `full-direct-port` | `opus-4-6-manual-port` |
|---|---|---|
| Frame rate | 40 fps | 60 fps with the same per-frame constants, so the game runs **1.5× faster** in real time |
| Run speed | 4 px/frame = 160 px/s | 240 px/s |
| Jumps | 7 px/frame up, gravity 0.3 px/frame² | Same height in pixels, ⅔ of the air time |
| Saw blades | 1 px/frame = 40 px/s, rotating 4° per frame | 60 px/s |
| Visible area | 800×480 stage, scaled to fit the window | 1280×720 canvas, not scaled, so 1.6× more of the level is visible in each direction |
| Camera | Moves the whole level by whole pixels each frame. The player's horizontal movement is truncated to whole pixels, so speeds below 1 px/frame don't move the player and 1.8 px/frame moves 1 px | Smooth float camera, so starting to run feels quicker |
| Falling off the map | You fall forever until you press R | You die 5 player-heights below the lowest object |
| Coyote time | None | 3 frames to jump after walking off a ledge |
| Jump / dimension input | Applied the moment the key goes down | Read once per frame |
| Saw hitbox | Radius 20.5, measured to the nearest edge of the player (the original `Co.clamp` returns the nearest end, not a clamped value), so a saw straight above or below has less reach | Radius 17 (3 px leeway), measured to the closest point of the player |
| Falling blocks | Original logic: start falling 500 ms after you land, reset after 3 s, push the player down by their speed + 1 each frame. Switching dimension while standing on one keeps pushing you down | Rewritten with a tolerance check that keeps the player on the block. Timers count real time, so at 60 fps a block falls for 180 frames instead of 120 |
| Collision order | Level order (reverse placement order) | Sorted by height, lowest first, to fix a falling-block case |
| Object update order | Player, then falling blocks, then collisions, then the other objects | All objects, then player, then collisions |
| Reaching the goal | Back to the menu at once | 500 ms pause with a ring around the goal |
| Respawn | Timer goes back to the time you reached the checkpoint | Timer keeps running |

## Scoring and saving

| | Original / `full-direct-port` | `opus-4-6-manual-port` |
|---|---|---|
| Stars | Time only. Levels 1-5: 5/4/3/2 stars at or under four time limits, otherwise 1. Levels 6-10 have no limits, so they always give 1 star | 1 for finishing, +1 if you never respawned, +3 for speed (levels 1-5 only) |
| Level 1 limits | 3.6 / 3.8 / 4.0 / 4.2 s | 4.80 / 5.07 / 5.33 s for the speed stars |
| Best time | Saved and shown in game as a red `time/best` counter (in tenths of a second) | Not stored, no timer shown |
| Save | `localStorage` key `no.platform`. The original Flash game cleared its save on every start; the direct port keeps it | `localStorage` key `platformgame-progress`, stars only |

The manual port's speed limits look like the original limits converted assuming 30 fps (36 units × 4 frames / 30 = 4.8 s). At the original 40 fps they are 3.6 s. Since the manual port also runs 1.5× faster, its speed stars are roughly twice as easy to get as in the original.

## Level data

All 10 levels have the same number and types of objects in both ports. The differences:

### Saw blades

The manual port's saws travel 20 px further at both ends than in the original. Saws that were static in the original oscillate 40 px instead. It looks like the level conversion took the full width of the editor's saw track as the travel range, where the original `Levels.as` subtracts 40 px (the saw's own diameter). Level 10 was fixed by hand ("Adjust level 10"); levels 3-9 still have the difference.

| Level | Saws that differ | Static in the original, moving in the manual port |
|---|---|---|
| 3 | 13 | 1 |
| 4 | 3 | 0 |
| 5 | 5 | 2 |
| 6 | 1 | 0 |
| 7 | 8 | 0 |
| 8 | 13 | 7 |
| 9 | 3 | 2 |
| 10 | 0 | 0 |

### Other changes

- **Level 5:** a pink bouncing block, a normal block and the goal are 20 px lower in the manual port. This came with commit `d3f0cda` ("Adjust textbox sizing across levels"), so it may not have been intentional.
- **Text boxes:** offset by 2 px. This is only how each port handles the Flash text-field gutter, not a real change.
- **Checkpoint and goal hitboxes:** 40×60 in the manual port. In the original they are 43×63, and a checkpoint grows to 63×73 once it is active.

## Look and UI

| | Original / `full-direct-port` | `opus-4-6-manual-port` |
|---|---|---|
| Graphics | The original vector shapes, extracted from the `.fla` | Redrawn: zigzag springs on pink blocks, dashes on the brown/sticky wall-jump blocks, procedural 16-spike saws |
| Colours | `#CCCCCC` background, `#333333` blocks, grey page around the stage | `#708090` background, `#54606C` blocks |
| Inactive dimension | 20% opacity. Drawing order is fixed by the level layout, danger zones at the bottom | 35% opacity. Active dimension drawn over inactive, shared blocks on top |
| Text boxes | Khaki `#999966`, 4 px black border, bold Times 24 px, wrapped to the box | Beige `#F5F5DC`, 1 px border, 20 px sans-serif, one centred line |
| Menu | 10 square buttons in a row near the bottom, star shapes below each | "SELECT LEVEL" title, vertical list, arrow keys + Enter, ★/☆ characters, loading screen |
| In-game HUD | Return-to-menu button and the timer | "Level N", key hints, FPS counter |
| Controls | A/D, W, Space, R; click the return button for the menu; the original touch buttons on touch screens | A/D, W, Space, R, Esc to leave a level; no mouse in game, no touch |
| Tab in the background | Game simply pauses | Pauses with a "PAUSED" overlay |
| Music | None (the original's sound code was commented out) | None |

## Code

| | `full-direct-port` | `opus-4-6-manual-port` |
|---|---|---|
| Handwritten TypeScript | ~2,160 lines | ~2,250 lines |
| Levels | Generated from the `.fla` by `tools/convert-fla.py` into `source/ts/data` | Hand-maintained JSON in `source/public/levels` |
| Structure | One class per AS3 class with the same logic and names noted, so it can be checked against the original side by side | Own structure with dimensions as numbers (0 = both, 1, 2) and a translate-based camera |
| Unused code | None | Spike and slanted-trampoline classes that no level uses |

Editing levels is easy in the manual port (plain JSON). In the direct port it means editing the Flash file and rerunning the converter, but the data cannot drift from the original.

## Where the direct port deviates from the original

On purpose, to make it work well in a browser:

- Progress is saved between sessions (the original wiped it on start).
- The original on-screen touch buttons, which were disabled in the last Flash build, appear on touch screens.
- Liberation Serif is bundled as a metric-compatible fallback for the embedded Times New Roman font.
- Held keys are released when the window loses focus.
- A respawn before reaching any checkpoint goes to the level start (the original would crash, but every level starts on a checkpoint).
