



# Classic platforming game based on an original flash/as3 game

This is a classic platforming game, ported to plain javascript from an old project written in flash/as3. The game has a thin html wrapper around a simple canvas based game.
The original game is very simple and does not follow any best practices around object orientations etc, the maps are defined in keyframes and layers and will be the most difficult to extract.


## For porting

the folder /original-flash-game contains the source of the original game.


## Game objects

TODO


## Levels / map definitions

The original levels are stored inside `original-flash-game/PlatformGame/PlatformGame.fla`, which is a ZIP archive (Flash CS5.5 format). Inside the archive, each level is an XML file under `LIBRARY/Levels/` named `RawLevel0.xml` through `RawLevel9.xml`.

Each level XML contains layers with `DOMSymbolInstance` elements representing placed game objects. Object positions are encoded in `<Matrix tx="X" ty="Y"/>` tags. The `libraryItemName` attribute identifies the object type (e.g. `LevelBlocks/BuildingCheckPoint`, `LevelBlocks/Farlig/DownSpike`).

To extract level data, unzip the `.fla` and parse the XML files from the `LIBRARY/Levels/` folder.



## Game architecture

Different parts of the game logic is included with multiple .js files, use nativ browser js modules