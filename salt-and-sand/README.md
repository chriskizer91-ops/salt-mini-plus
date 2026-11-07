# Salt & Sand and Ice & Snow

- `salt-and-sand.html` (3.3 MB): one Studio 2 car in a world that's half salt flats, half white sand dunes, with Highway 40 through the middle. The Dyno Bay is the menu. **This is the page Christopher sent on Nov 6 2026, kept exactly as it was.** Its source (`build.py --dunes`, `dunes.py`, `src/sas.js`, `src/sas_cams.js`, `src/sas_world.js`) lived in an earlier session's scratch space and was never saved. It was built from *Redline County: Wide Open 2: Road Not Found + Traffic* and `models/src`. **So the page itself is now the source.** Change it the way Ice & Snow and the Redtail do: a script of exact text swaps, each of which must match exactly once, so a changed page fails loudly instead of quietly.
- `ice-and-snow.html`: the same game frozen (an icy lake, snow dunes, glazed road, icy grip). `python3 salt-and-sand/ice-and-snow-freeze.py salt-and-sand/salt-and-sand.html salt-and-sand/ice-and-snow.html` remakes it byte for byte (checked Nov 7 2026).
- With the plane added, see `../redtail/builds/`.

## What's inside the page (useful for anything built from it)

Under Salt & Sand, the page carries the whole Road Not Found game. Most of it is switched off in Salt & Sand, but all of it is there. Each part starts with a `/* =====` heading:

- **Renderer and look:** Shiftlight 3's HDR renderer (cascaded sun shadows, clustered lights, reflections), the graphics tiers Mobile to Ultra, and the times of day.
- **Cars:** every car and build, including the Studio 2 cars (`HD_CARS`, built in background workers), the garage and parts, the dyno lab, the tune sheet and the ratings.
- **Driving:** the physics (Dirt Sleeper Mini 4's, with off-road ground contact on any surface), the Digital Engine sound, dust, mud and spray.
- **The open world (`WORLDGEN`):** land, roads, creeks, hills, woods (`TREES`, `treeShapes`, `treeList`) and grass, made in 128 m chunks round the car in a background worker.
- **Game systems:** feats and combos, the career (money, a save of its own, the dealer), races against robot drivers, traffic and police, challenges, and **people and their jobs** (`PEOPLE`, `JOBS`). A job's steps are talk, goto, deliver (against the clock), chal, part, medals and speed. A column of light marks someone with work, and an arrow points to the next step.
- **Screens:** the HUD, the map, the menu, the garage, the touch controls for a phone held sideways, the Dyno Bay, Salt & Sand's world and its cameras (Director, Jump cam, Tracking car, Cinematic, the drones), and the boot.
