# Beyond the Last Road

*A story game by Christopher. You're a bush pilot with one plane and one truck, working where the last paved road ends: sand dunes on one side, savanna on the other. The plane goes where the truck can't, and the truck goes where the plane can't land.*

This file is the plan. It's written so that a fresh Claude session (or this one) can pick the game up and build it with Christopher, step by step. Everything the game is built from is in this repo. Before changing anything, read **How to work with Christopher** at the bottom.

## What he asked for (Nov 7 2026)

> "I want to make a story that uses the mud and rock off road SUV and the bush plane… It can be called something other than Red Line or Red Tail, because I think Red Tail should stay my racing game with an airplane added… I want it to be able to run on my phone and also visually look as good as the current airplane and SUV in game look. We can have a sandy dune region. We can have a savanna region. We can make more digital assets for the game, whatever we need."

## Decided (his picks, Nov 7 2026)

- **Name: Beyond the Last Road.** "Redline" and "Redtail" stay with his racing game.
- **Story: bush pilot jobs.** You run a one-plane, one-truck outfit: supply runs, rescues, wildlife counts. The story grows out of the jobs.
- **How it plays: open map + story chain.** You roam both regions freely. The main story is a chain of missions, with side jobs in between.
- **The plane gets a new name of its own** in the story. It's the same model (redtail-2) with its own name and paint. Its name isn't picked yet (see below).
- **The truck is the SUV Rock & Mud** (the game's build id is `crawler`).
- **Runs on his phone** (Pixel 7a) and on the laptop (MSI Cyborg 15). It must **look as good as the Redtail and the SUV do in Salt & Sand today.**
- **Two regions: sandy dunes and savanna.** Making new digital assets is fine.
- **One self-contained HTML file**, like all his games. Being a single file is part of the appeal to him.

## Still to decide (ask him, one at a time, when it comes up)

- **The plane's name.** Some ideas from savanna birds: *Bateleur* (an eagle that rocks its wings as it glides), *Kestrel*, *Hornbill*, *Secretary Bird*. Or his own.
- **The outfit's name** (painted on the hangar and the plane), and **who you are** (a name, or just "the pilot").
- **The plane's paint in the story.** A new ChatGPT paint job made with `redtail/paint-template/`, or Wilderness Olive.
- **Fuel for the plane:** yes (bush flying is about range) or no (simpler).
- **Walking:** none to start is suggested. You switch between truck and plane when you're parked beside the other one. Walking means a person model and animation, and a person costs the phone a lot.
- **People:** shown as a radio voice plus a portrait card (ChatGPT pictures) and short lines of text, rather than 3D people. Voices can come later.
- **Where it is:** a made-up country is suggested, so the places and animals can be whatever fits.

## What it's built from (all in this repo)

| What | Where | Notes |
| --- | --- | --- |
| The game engine | `salt-and-sand/salt-and-sand.html` | Under Salt & Sand, the page carries all of Road Not Found: the renderer, the physics, the Digital Engine sound, the open-world generator with trees and grass, the career and money, and **people with jobs** (`PEOPLE`, `JOBS`, steps: talk, goto, deliver, chal, part, medals, speed). Its source was never saved, so **the page is the source**. See `salt-and-sand/README.md`. |
| The plane, flying | `redtail/game/` (`rt-game.js`, `rt-fly.js`, `rt_patch.py`) | Lift, stall, flaps, the prop's blast over the tail, the stick, tilt, the throttle lever, a cockpit camera, lights, the engine and prop sound, the PAINT button. Tested numbers are in `redtail/README.md`. |
| The plane's model | `redtail/versions/redtail-2/` | 60k triangles with baked pictures. Its moving parts: prop, wheels, tailwheel, rudder, elevators, flaps, ailerons, and the cowl comes off. |
| A paint job for the plane | `redtail/tools/livery.py` + `redtail/paint-template/` | His ChatGPT pictures → a paint for redtail-2. Two are done (Yellow & Black, Wilderness Olive). |
| The truck | `models/suv-rockmud/`, `models/src/` | The Studio 2 Rock & Mud is 790,531 triangles: body 328,949, underside 147,774, cabin 84,840, engine bay 66,300, one wheel 34,490. The page builds it from code (`KIT.setAlt('2')`). The Studio 1 is 528,718 and the game's own is 61,432. |
| The dunes | Salt & Sand's world, in the page | White dunes about 12 m tall, gentle on one side and steep on the other, with sand grip, sand dust and wind ripples. |
| The cameras | Salt & Sand's cameras, in the page | Chase, Hood, Cockpit, Wheel cam, Tracking car, Roadside, Cinematic, the drones, Director, Jump cam. |
| A finished build to look at | `redtail/builds/salt-and-sand-redtail-2-flying-paints.html` | What "looks as good as now" means. |

Not in any repo: Redline County's ground-clutter pack (grasses, bushes, trees). The `building-with-assets-` repo is a game-launcher app and doesn't hold it. If Christopher has the pack on his laptop, it could help the savanna. Otherwise the savanna's plants are made new.

## The big technical problem: the phone's budget

Salt & Sand draws about **850,000 triangles a frame**, 808,000 of them the SUV's Studio 2, and Christopher judges that **about the most his phone can draw smoothly**. In a test, a frame with the Redtail took about two thirds of the time a frame with the SUV's Studio 2 did.

This game needs more on screen than Salt & Sand: the truck, the plane parked or flying, a savanna with grass, trees and animals, buildings and airstrips. With the Rock & Mud at 790k, there's almost nothing left for the world. So:

- **The plane is already light** (60k), because it was baked from a 241k model onto a simpler one.
- **The truck needs the same treatment for this game:** the Studio 2 Rock & Mud cut down to a lighter copy, with its fine detail baked into pictures, the way redtail-2 was made from redtail-1. The aim is somewhere around 150,000 to 250,000 triangles. Note that in early Nov 2026 he judged an earlier bake (the game's own 51k mesh wearing the Studio surface) to look worse than the Studio models. This bake is different: it keeps the Studio 2 shape and cuts it down, as the plane was. Prove it on his phone before relying on it.
- **Step 1 of the build order is a look test on his phone:**
  - the Studio 2 Rock & Mud as it is (790k);
  - its Studio 2 Drive (the engine bay taken out, about 724k);
  - one or two baked copies.

  Show them side by side with the triangle counts, in the same light and from the same cameras. He drives each on his phone and picks. Everything after that is sized from his pick.
- **The world's share:**
  - trees, rocks and animals drawn many at once with one draw for each kind (instancing, as the traffic is in the Salt Flats demo);
  - grass mostly as a ground texture and colour, with real blades only close to the camera;
  - a simpler tree far off than up close;
  - only the near world casting shadows.
- **The vehicle you're not in:** the plane parked is 60k. The truck parked far off can be a much simpler copy.
- **Keep counting:** the page's F readout gives triangles and draws. The test browser has no graphics card, so only his phone can say how smooth it is.

## The world (a first draft to change with him)

- **Home base: the airstrip at the end of the last road.** The highway comes in from off the map and stops. There's a hangar, fuel drums, a workshop (the game's garage), a radio shack and a windsock. The story starts here.
- **The Dune Sea, on one side:** Salt & Sand's dunes, bigger and wider. A dune camp with tents, an old well, a long-crashed plane half buried (a landmark from the air), and a salt pan flat enough to land on.
- **The Savanna, on the other side:**
  - grassland in greens and golds, flat-topped acacias, thorn bushes, termite mounds;
  - rock outcrops (kopjes), a river with sandbanks, waterholes, and one giant baobab as a landmark;
  - a ranger station, a village with a clinic, a safari lodge.
- **Between them:** dirt tracks for the truck, and **five or six airstrips** of different difficulty: long and flat at base, short at the village, a high strip on top of a kopje, the salt pan in the dunes. Each has a windsock and markers.
- **Size:** about 12 km by 8 km to start. At 75 mph cruise, the plane crosses 1 km in about 30 s, so a flight across the long side takes about 6 minutes (about 3½ at its top speed of 136 mph), and across the short side about 4. The world generator already makes land in 128 m chunks around the car, so a big map costs nothing until you're near.

## Driving and flying together

- The vehicle you're not in **stays where you left it**, drawn in the world.
- Stop within about 20 m of the other one and a **SWITCH** button appears (a key on the laptop). The cameras and controls change over.
- Long trips shouldn't strand you: by default, **the truck can be sent by radio to any airstrip** for a small fee and a short wait. Ask him.
- The story's best moments **use both:**
  - the plane spots something the truck then reaches;
  - the truck brings something to a strip, and the plane carries it on.

## The jobs and the story

The page's job system already has people, a column of light where someone has work, an arrow to the next step, steps, payment and a career save. Bush-pilot jobs add steps:

| Step | What it asks |
| --- | --- |
| fly to / land at | Land on a strip and roll to a stop inside it. Bonus for a gentle touchdown. |
| carry | Load at A, unload at B. The load weighs the plane down: longer take-off, slower climb. |
| spot | Fly low and slow over a place, such as a herd or a lost truck, until it's counted or found. |
| drop | Airdrop a package onto a marker, with bonus for how close it lands. |
| drive to | Take the truck somewhere the plane can't land. |
| against the clock | The existing deliver step, for medicine and medevacs. |

**Main story chain (a draft for him to rewrite; every name here is a working name):**

1. **End of the Road.** You arrive in the truck where the highway stops. The retiring pilot hands over the plane and the outfit. First flight: round the strip and land.
2. **First Run.** Fly medicine to the village clinic: a short dirt strip, your first real landing.
3. **Two Ways There.** The ranger station needs fence wire, too heavy for the plane. Drive it across the savanna tracks, then fly home.
4. **The Count.** Fly the ranger low and slow over the herds for the wildlife count.
5. **Lost in the Dunes.** A dune camp's supply truck is overdue. Search from the air, find it, land on the salt pan, and get water to them in the truck.
6. **Storm Season.** A dust storm is coming. Fly the last supplies out before it, and land with the sand blowing.
7. **The High Strip.** A delivery to the kopje-top strip: short, uphill and gusty.
8. **The River Rises.** Floods cut the tracks. Medevac from the village to base at night, on landing lights.

After the chain, the map stays open with side jobs. Side jobs: cargo runs, photo flights for the lodge, fence checks by truck, fuel drops, airdrops, tourist flights (smooth flying earns tips), and the game's existing feats.

**Money buys:**
- the truck's parts (the game's garage already has them);
- plane upgrades (bigger tires for rough strips, a cargo pod, long-range tanks, a stronger engine);
- paint jobs (his ChatGPT pictures).

## Assets to make

| Asset | How | Notes |
| --- | --- | --- |
| The baked Rock & Mud | `models/tools/bake.py`, the redtail-2 bake (`redtail/tools/`) | Step 1's look test. |
| The plane's story name and paint | ChatGPT + `redtail/tools/livery.py` | A new paint is a paint option for redtail-2, not a new model version. |
| Savanna ground and grass | code (shader) + ChatGPT texture pictures | Colour by region: dry gold, green near water. |
| Acacia, thorn bush, baobab, termite mound, kopje rocks | code, the way the game builds its trees, with a near and a far version of each | Drawn many at once. |
| Animals: zebra, antelope, giraffe, elephant, birds | code, low triangle counts, walking done in the shader, herds drawn many at once | Only near the camera. A big sight from the plane. |
| Buildings: hangar, radio shack, fuel drums, windsock, tents, huts, clinic, lodge, ranger station | code | A few draws each. |
| Airstrips | code: dirt strips, markers, windsock | Their own surface for the tyres. |
| Portraits of the people | ChatGPT pictures | For the radio card. |
| Sounds | the game's audio | Wind, radio crackle, animal calls. |
| Weather | the game's sky, fog and times of day | A dust storm: fog, a sky tint and wind on the plane. |

## Build order

Each step ends with something Christopher can open on his phone, plus screenshots and simple numbers.

0. **The fork.** `beyond-the-last-road.html` = Salt & Sand + the plane + this game's own patches:
   - a new title and **new save keys**, so it never touches Salt & Sand's saves;
   - the Rock & Mud as the only truck and the plane under its new name;
   - it starts at home base.

   Fix the plane's three known faults on the way: the car lights and gear on the HUD, the bay showing the car, the chase camera staying level.
1. **The look test** (the phone's budget, above). He picks the truck's version.
2. **Switching** between the truck and the plane.
3. **The map:** home base, the Dune Sea, the Savanna, the tracks and the airstrips, with stand-in buildings.
4. **The savanna's look:** grass, trees, rocks, the river, the waterholes, the baobab. Check the phone's budget again.
5. **Jobs:** the radio, the job steps above, money, a save of its own.
6. **The story chain:** the eight missions, their lines, the portraits.
7. **Life:** herds, birds, the dust storm, times of day.
8. **Upgrades and paints.**
9. **Polish:** the opening, the menus, the sounds, the ending.

## How to work with Christopher

- **He can't code.** He builds everything through Claude. Explain in plain words, and **prove every step with screenshots and simple numbers.**
- **Uncluttered phone screens.** He dislikes a crowded UI. On the phone, every button has to earn its place.
- **His devices:** a Pixel 7a phone and an MSI Cyborg 15 laptop (RTX 5060), with Edge on the laptop. Frame rates, tilt and sound can only be judged there.
- **Never overwrite:**
  - a new build gets a new file name, and older builds are kept;
  - every version of a model is kept, and a change to a model is a new version (his rule for the plane, which holds here too).
- **Change the page with exact text swaps** that must each match once, like `salt-and-sand/ice-and-snow-freeze.py` and `redtail/game/rt_patch.py`. A changed upstream page then fails loudly. Put this game's own code in its own `.js` files that the build script puts into the page.
- **Where things go:** `beyond-the-last-road/` holds `src/` (this game's code), `build.sh`, `builds/` (the pages), `docs/` (pictures) and this README. Keep this README's Decided list up to date as he decides things.
- **Testing:**
  - Playwright with headless Chrome (`redtail/game/rt-run.py` is a working harness);
  - run one browser at a time;
  - the test browser has no graphics card, so frame rates mean nothing there, but triangle counts, draws, speeds and distances do.
- **His other tools:** ChatGPT Pro for pictures (reference sheets, paint jobs, textures, portraits). He makes them from prompts Claude writes.
- **Notes:** the Salt Flats Plus project's `claude/salt-flats-notes.md` holds the decisions for everything in this repo. Add this game's decisions there too.
