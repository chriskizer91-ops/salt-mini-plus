# Salt Mini Plus

Salt Mini Plus is Redline County's physics and logic on a salt flat with a long road and a few traffic cars about
600 m apart. It holds the traffic cars' models (`models/`), a page to look at them (`viewer/`), and the first cut of the
game, the **Salt Flats demo** (`game/`, see `game/README.md`): the salt flat and its road, the stock Coupe as Studio 2
Drive on the road and the full Studio 2 in the dyno bay, and light traffic of 5k Coupes.

Each car comes three ways:

- **Game's own**: the car exactly as Redline County: Wide Open 2: Road Not Found + Traffic builds it.
- **Studio**: the same car modelled for a close look, at least as detailed as the Studio SUV everywhere. It's made
  to be driven as well as passed: the wheels spin and steer, the hood opens, and the lamps light. Traffic draws it
  out to about 100 m, and a small flat picture beyond that (the game makes those itself).
- **Baked**: the game's own mesh at the game's own triangle count, wearing the Studio car's detail as three
  pictures. It's the backup in case the Studio car doesn't fit the phone's budget.

The first eight are the traffic cars and come all three ways. The other nine (the SUV's Sleeper, Rock & Mud and Race
builds, the Coupe GT, the Hatch Group B, and the Wedge and Hypercar with their Night Runner and Track builds) come as
the game's own and Studio only: they have no baked version.

<!-- TABLE -->
| Car | Status | Studio triangles | Studio 2 triangles | Baked triangles | Game's own | Baked pictures (Low / Medium) | Picture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [SUV](models/suv/) | Done | 484,359 (+3,000 engine bay) | 808,095 | 51,408 | 51,586 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![SUV](models/suv/docs/front34.webp) |
| [Pickup](models/pickup/) | Done | 545,652 (+31,712 engine bay) | To do | 53,950 | 54,356 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Pickup](models/pickup/docs/front34.webp) |
| [Hatch](models/hatch/) | Done | 430,908 (+31,178 engine bay) | To do | 46,655 | 46,833 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Hatch](models/hatch/docs/front34.webp) |
| [Wagon](models/wagon/) | Done | 532,457 (+33,666 engine bay) | To do | 52,006 | 52,334 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Wagon](models/wagon/docs/front34.webp) |
| [EV](models/ev/) | Done | 498,744 (+23,526 engine bay) | To do | 55,314 | 55,432 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![EV](models/ev/docs/front34.webp) |
| [Trail (4x4)](models/trail/) | Done | 492,105 (+27,684 engine bay) | To do | 50,181 | 50,799 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Trail (4x4)](models/trail/docs/front34.webp) |
| [Coupe](models/coupe/) | Done | 480,718 (+31,334 engine bay) | 707,820 | 50,361 | 50,475 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Coupe](models/coupe/docs/front34.webp) |
| [Muscle](models/muscle/) | Done | 420,615 (+30,160 engine bay) | To do | 58,121 | 58,395 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Muscle](models/muscle/docs/front34.webp) |
| [SUV Sleeper](models/suv-sleeper/) | Done | 603,760 (+36,306 engine bay) | 892,380 | Studio only | 51,654 | Studio only | ![SUV Sleeper](models/suv-sleeper/docs/front34.webp) |
| [SUV Rock & Mud](models/suv-rockmud/) | Done | 528,718 (+34,076 engine bay) | To do | Studio only | 61,432 | Studio only | ![SUV Rock & Mud](models/suv-rockmud/docs/front34.webp) |
| [SUV Race](models/suv-race/) | Done | 481,953 (+37,330 engine bay) | To do | Studio only | 49,108 | Studio only | ![SUV Race](models/suv-race/docs/front34.webp) |
| [Coupe GT](models/coupe-gt/) | Done | 430,719 (+31,390 engine bay) | To do | Studio only | 52,023 | Studio only | ![Coupe GT](models/coupe-gt/docs/front34.webp) |
| [Hatch Group B](models/hatch-groupb/) | Done | 455,649 (+31,206 engine bay) | To do | Studio only | 52,579 | Studio only | ![Hatch Group B](models/hatch-groupb/docs/front34.webp) |
| [Wedge](models/wedge/) | Done | 499,931 (+20,510 engine bay) | To do | Studio only | 45,696 | Studio only | ![Wedge](models/wedge/docs/front34.webp) |
| [Wedge Night Runner](models/wedge-nightrunner/) | Done | 535,168 (+20,538 engine bay) | To do | Studio only | 48,735 | Studio only | ![Wedge Night Runner](models/wedge-nightrunner/docs/front34.webp) |
| [Hypercar](models/hyper/) | Done | 602,807 (+20,430 engine bay) | To do | Studio only | 50,283 | Studio only | ![Hypercar](models/hyper/docs/front34.webp) |
| [Hypercar Track](models/hyper-track/) | Done | 537,951 (+20,458 engine bay) | To do | Studio only | 48,841 | Studio only | ![Hypercar Track](models/hyper-track/docs/front34.webp) |
<!-- /TABLE -->

"Studio triangles" is the whole car as you see it with the hood shut: body, cabin, lamps, the four wheels and their
brakes, and the Trail's spare on its door. The engine bay is counted separately because it's only drawn with the hood
up. The baked pictures' memory includes their mipmaps.

## Studio 2

The Studio car with the rest of it built again: everything a close camera, a low camera and the garage can see.
Its underside is built whole in place of the game's, its engine bay is its own (showing what that build runs, in
the game's colours for it), and it wears the road-car bits. The wheel houses are deeper and the cabin is finished.
Each is its own entry, `HD_CARS[id + '2']`, picked with `KIT.setAlt('2')`. The shape, wheelbase, track, ride height
and wheel positions are exactly the game's.

- **Its own pieces:** the underside and the engine bay are separate, so the game can leave out what can't be seen.
  The wheels come in two: what turns (`wheel`) and what only steers (`brake`).
- **Studio 1 and Game never change:** after each car, every car's Studio and Game is built and every part's arrays
  are compared with before (`models/tools/same_check.js`).
- **Pictures:** each car's `docs/s2_*.webp`, Studio and Studio 2 side by side (`sh models/tools/s2_car.sh <car> <folder>`).
- **"Whole car"** is everything drawn with the hood shut: the four wheels and brakes counted, and the engine bay too,
  because Studio 2 draws it all the time (it shows from underneath and through the grille). "Hood" is the hood with
  what lifts with it. "Build" is how long it takes to build here, in Node (the viewer in Edge takes about as long).

<!-- S2TABLE -->
| Car | Whole car | Body | Underside | Engine bay | Cabin | Hood | One wheel | One brake | Build | Pictures |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUV | 808,095 | 249,956 | 209,125 | 63,374 | 82,440 | 12,224 | 44,684 | 3,060 | 9.2 s | [front](models/suv/docs/s2_front34.webp), [rear](models/suv/docs/s2_rear34low.webp), [under](models/suv/docs/s2_under.webp), [bay](models/suv/docs/s2_bay.webp), [cabin](models/suv/docs/s2_cabin.webp) |
| Coupe | 707,820 | 208,109 | 210,839 | in the underside | 45,478 | 16,538 | 53,094 | 3,620 | 6.5 s | [front](models/coupe/docs/s2_front34.webp), [rear](models/coupe/docs/s2_rear34low.webp), [under](models/coupe/docs/s2_under.webp), [bay](models/coupe/docs/s2_bay.webp), [cabin](models/coupe/docs/s2_cabin.webp) |
| SUV Sleeper | 892,380 | 313,328 | 167,138 | 75,128 | 84,840 | 14,754 | 55,678 | 3,620 | 8.1 s | [front](models/suv-sleeper/docs/s2_front34.webp), [rear](models/suv-sleeper/docs/s2_rear34low.webp), [under](models/suv-sleeper/docs/s2_under.webp), [bay](models/suv-sleeper/docs/s2_bay.webp), [cabin](models/suv-sleeper/docs/s2_cabin.webp) |
<!-- /S2TABLE -->

## The viewer

`viewer/viewer.html` is one self-contained page. Open it in Edge or Chrome on the laptop or phone.

- **Moving round the car:** drag to turn round it (all the way over and underneath). Pinch or scroll to come
  closer. Double-tap a part to swing round it.
- **The bar along the bottom:**
  - the car's name: pick a car
  - **Game / Studio / Studio 2 / Baked**: switch between the versions. Studio 2 shows where a car has one (the Studio 2
    table below): the Studio car with the rest of it built again, its underside whole, its own engine bay and the road-car
    bits. Its underside and bay are pieces of their own, and the bay is drawn with the hood shut too (it shows from
    underneath)
  - **Hood**: open or close the hood
  - **Paint**: the traffic's sixteen colours, plus the car's own factory colour
  - **Lights**: steps through head and tail lamps, then the brake lamps, then the indicators and reversing lamps
- **On the phone:** to keep the screen clear, the versions are one button that says which is showing (tap it for the
  others), and Paint, Lights, the camera views (Under among them) and Reset are under **•••**.
- **Top right:** the car, the version, its triangle count and its draw calls.
- **Underneath:** with the camera down under the sills, a soft light comes on from below, as under a car on a lift.

The Studio cars are built in the page from the code, the same way SUV Studio builds its truck. That takes a few
seconds the first time you pick each one. The baked cars are unpacked from their pictures.

`node models/tools/same_check.js [repo] > prints.json` builds every car in every version and fingerprints every
part's arrays (positions, normals, colours, materials); `--compare a.json b.json` says whether two copies of the
models build exactly the same.

`sh viewer/build.sh` rebuilds the page from `viewer/shell`, `viewer/src` and `models/`. Run `npm install` in
`viewer/` once first (it installs three.js and esbuild).

## Notes for the game: what's decided so far

- **Laptop only.** Salt Mini Plus is made for the laptop (an MSI Cyborg 15: RTX 5060 with 8 GB, a 1920 x 1080
  screen). Road Not Found stays the one that runs on the phone and the laptop.
- **Your car comes two ways** (tried on the Coupe):
  - **In the dyno bay: Studio 2.** Bonnet up, walk round it, look underneath: 706,516 triangles.
  - **Driving: Studio 2 Drive.** The same car with its own engine bay taken out (the game's small one sits in its
    place, so the space isn't empty from below or through the bonnet vents). The cabin stays, for the view through
    the windows, and so does the whole underside, because cars roll: 644,600 triangles.
- **Traffic: the 5k car with the Studio 2 surface baked on,** its pictures at 512 (6 MB for each kind of car, shared
  by every copy of it): 4,976 triangles and 10 draws. Tried on the Coupe and judged plenty good.
- **Traffic is only ever the basic cars,** the few picked for the game. The souped-up builds are never traffic, so
  they get no traffic version.
- **The demo starts with the lightest traffic:** one car every 600 m (the Drive tab can set more, or none).
- **Not decided yet:**
  - which cars the game has. The idea so far: the SUV, SUV Sleeper and SUV Rock & Mud, the Coupe and Coupe GT, and
    maybe the Hatch, Hatch Group B, Wedge and Hypercar
  - how far you can see: to be tried on the laptop
  - how far the scenery is drawn. Ideas so far: no grass past about 100 m; trees still seen at 500 m, but a simpler
    tree far off than up close, swapped as they come into view

## The traffic test (`viewer/traffic.html`, `models/coupe-traffic/`)

How few triangles a traffic car can have and still look right, tried on the Coupe. Salt Mini Plus is for the laptop;
the car you drive stays the full Studio car, and traffic gets a cut-down one.

- **The traffic Coupes** are the game's own Coupe brought down (`models/tools/traffic_lod.py`):
  - about 25,000 triangles (23,825), 10,000 (9,956) and 5,000 (4,976), the four wheels counted in
  - the hood is part of the body; no engine bay, no cabin, solid glass; the underside is one dark box with a liner
    over each wheel
  - the wheels don't turn: each is a plain tyre and a dished face, with the Studio wheel baked onto it
  - the door shut lines are left off the mesh; the bake paints the Studio car's on
  - the 25k one is the game's exact shape: merging its flat areas alone takes it from 32,000 to 20,000 triangles.
    The 10k and 5k ones are brought down further by Blender's Decimate, the same on both sides
- **Each comes three ways:** Plain (the game's own colours), and with the Studio or the Studio 2 surface baked on
  (`models/tools/bake.py`, at the baked Coupe's picture size). A traffic car's lamps are painted on with the rest,
  so the bake also writes where the head and tail lamps are (`GLOW=1`, the headlamps' lenses included), and the
  page lights them from that.
- **The page:** Studio (one car on the backdrop), Parked (your car beside the traffic car) and Road (the salt flat:
  your car, and the traffic car 30, 100, 200 or 300 m off, coming at you or going away, from the game's Hood,
  Chase and Far cameras, as Salt Mini has them). The left and right arrow keys step through the versions.
  **Pictures 2048 / 1024 / 512** shows the baked cars at full, half and quarter picture size (96, 24 and 6 MB).
  Top left: each car's triangles, draws and picture memory, and on the Road how many pixels the traffic car covers.
- **Studio 2 Drive** (`KIT.setAlt('2d')`, *Studio 2 Drive* on the page): Studio 2 for driving, its engine bay left
  out and the game's small one in its place, the cabin and the underside kept: 644,600 triangles against 706,516.
- **The Studio 2 Coupe** (its underside built whole, its own engine bay, the exhaust out to four tips, the plate,
  the high stop lamp, badges and markers) is now in the models (`models/src/cars/coupe`, `90` to `99`), from the
  viewer it was sent in; `KIT.setAlt('2')` picks it. Every other car builds exactly as before.

- **Still to improve:** the big grille comes out plain black in every baked Coupe (the 50k one too): the Studio
  car's honeycomb sits behind it and doesn't reach the picture. The indicators and reversing lamps don't light on
  the traffic cars.

`sh viewer/build_traffic.sh` rebuilds the page; `sh models/tools/traffic_docs.sh` remakes its pictures and
`models/coupe-traffic/numbers.json`.

![Every version from the front three-quarter](models/coupe-traffic/docs/versions.webp)
![Your car parked by the traffic car](models/coupe-traffic/docs/parked.webp)
![The road from the Chase camera, 30, 100 and 200 m](models/coupe-traffic/docs/road.webp)
![Studio 2 and Studio 2 Drive from underneath; Drive's cabin through the glass](models/coupe-traffic/docs/drive.webp)

## What each car's folder holds (`models/<car>/`)

| File | What it is |
| --- | --- |
| `<car>_studio.glb` | The Studio car, in the pieces the game drives (below). |
| `<car>_baked.glb` | The baked car, in the same pieces, with its pictures inside (WebP). |
| `<car>_studio_data.js` | The Studio car in the game's own mesh form, packed the way Baked SUV Test packs its truck, so the game can draw it without building it. |
| `<car>_baked_data.js` | The baked car in the game's own mesh form, laid out exactly as Baked SUV Test's `33b_baked_data.js`, one file a car. |
| `numbers.json` | Triangles, draw calls, texture memory and file sizes. |
| `docs/` | The pictures: `front34`, `rear34`, `side`, `wheel`, `face`, `tail`, `cabin`, `bay_open`; `compare` (game's own, Studio and baked side by side); `cycles_front34` (path traced in Blender); `glb_check` and `glb_check_baked` (each .glb read back by a standard glTF loader, hood open, front wheels steered, lamps lit). |

### The pieces, in the .glb files

- **`body`**: the shell with the face, tail, cabin, trim and wheel houses merged into it, one primitive (one draw) a
  material.
- **The lamps, one piece each:**
  - `lamp_head`: head and fog lamps
  - `lamp_tail`: tail and brake lamps
  - `lamp_amber`: indicators and repeaters
  - `lamp_reverse`: reversing lamps

  Each lamp's material carries `lamp` and `glow` (its colour when lit) in its extras. The glow starts switched off.
- **`under` and `hide`**: the underside, and what the hood hides. They're pieces of their own so the traffic can
  leave them out.
- **`hood`**: has its origin on the hinge. Turn it about its z to open it (the viewer opens it 1 radian).
- **`bay`**: the engine bay, drawn with the hood up.
- **The wheels:** at each hub there's a `steer_fl` (or `fr`, `rl`, `rr`) node. Turn it about its y to steer.
  - Under it, `wheel_xx` turns about its z to roll.
  - Beside it, `brake_xx` holds the caliper and dust shield. These only steer; they don't roll.
  - The left wheels are their own mirrored copies, so no node is scaled by −1.

  The baked car's wheel is the game's own, with its brake in it.
- **`spare_0`** (the Trail's): the wheel again where the game hangs its spare, on the door, fixed to the car.

Axes are the game's: x forward, y up, z right, metres, the ground at y = 0.

The SUV's model is SUV Studio's, kept as it was. It uses one clear lens for its headlamps, fog lamps and reversing
windows, so its .glb tells its lamps apart by where each piece is, and marks the lamp nodes rather than their
materials. Its wheels have their brakes in them, as SUV Studio built them.

The baked .glb's colour picture keeps the paint mask in its alpha. The material is opaque, so viewers ignore the
alpha, but a game can read it to repaint the car in any colour. The game's-form file has the mask in the same place.
Its material slots are Baked SUV Test's:

| Slot | What it is |
| --- | --- |
| 32 | baked |
| 33 | tail and brake lamps |
| 34 | head lamps |
| 35 | amber lamps |
| 36 | reversing lamps |
| 2, 3 | glass |
| 16 | the dark underside |

So the game's shader needs nothing new for it.

### Draw calls

- **In the game's own renderer**, where the material is a vertex attribute:
  - the game's own car and the baked car: 7 draws (body, hood, what the hood hides, four wheels)
  - the Studio car: 13 draws (body solid, body glass and lenses, underside, hood, what the hood hides, four wheels,
    four brakes); 11 in traffic, which leaves out the underside and what the hood hides
- **In a standard engine** reading the .glb, it's one draw a primitive. Each car's `numbers.json` gives both counts.

## Known things to improve

- **Baked Hatch flares:** the speckled, chrome-looking smear is fixed. Some Studio parts were built facing inward on
  one side of the car, and the bake read them from behind. The bake now turns those parts round first, then mends
  any pixel that still met a surface from behind (`models/tools/bake.py`); every car is baked this way. A little
  soft grey shading is left on the rear flares, where the game's flare sits a few centimetres off the Studio one.
  The Studio Hatch doesn't have this.
- **Baked edges round deep openings:** where the Studio car has a deep recess and the game's face is flat, as round
  the Muscle's grille and the Trail's lamps, the baked picture comes out a little ragged at the edges. It reads
  fine at traffic distance; close up, the Studio car is the one to look at.
- **Baked EV's engine bay:** the baked cars keep the game's own engine bay, and the game has no electric one: it
  draws a stand-in engine under the EV's bonnet. The Studio EV has its front trunk and the motor's inverter.
- **Liveries:** none of the three versions shows the game's paint liveries, such as the Muscle's two white stripes.
  The game draws them in its paint shader, which picks the second colour by where each point is on the body
  (`13_lit`). The viewer's paint doesn't do that yet, and neither do the .glb files. The Wedge Night Runner's neon
  slash down each side is one of these; its glow tubes and underglow are real parts and do light.
- **Pop-up lamps:** the Wedge's pop-up headlamps are part of the hood piece (`hood`) in its .glb, not the headlamp
  piece (`lamp_head`), because they're built into the bonnet. Their lenses are the headlamps' own glass, so they light with them in
  the viewer.
- **Hatch Group B's spot lamps:** they stay put when the bonnet opens, as in the game, so they sit in front of the
  open engine bay.
- **SUV Race and Rock & Mud cabins:** they keep the Studio SUV's own interior; the Race has no roll cage yet.
- **Hypercar's front lid:** its nose lamps stay with the body when the lid opens, as the EV's do, so the open lid
  shows the openings they sit in. On the Track, the flare ends just ahead of and behind each front wheel stand as
  flat slabs, the shape the shared flares have.
- **Coupe GT's front arches:** at the very top of each front arch the flare lies flat on the fender for a short
  stretch, and a couple of its bolts sit on that flat strip.
- **Hatch and Muscle Studio triangle counts:** lower than the SUV's because the cars are smaller and on 15-inch
  wheels. Every part on the SUV's list is there at the SUV's level. The Hatch's wheel is 51,000 triangles against
  the SUV's 47,700, its cabin 64,000 against 54,000, its engine bay 31,000 against the SUV's game bay of 3,000. The
  Muscle's wheel is 43,000: its tyre's tread is built block by block at the same block size as the SUV's, and a
  smaller tyre has fewer blocks.

## How the models are made

The method is SUV Studio's (cargames, branch `suv-studio/hd-truck`).

1. **The game's own builders.** `models/src/game/` holds copies of the game's builders, unchanged. These are
   `21_suv` (every car's body), `22_faces`, `23_parts`, `24_4x4` to `29_hatch`, `30_wheels`, `31_engine_bay`,
   `32_builds`, `34_ev`, `35_wedge`, `36_hyper` and `37_newbuilds`, from `rlcwo2rnf-traffic/src`. They're joined
   by SUV Studio's `00_prelude` and `36_stubs`, which holds empty stand-ins for the physics tables `37_newbuilds`
   writes into, and the game's pixel font (`10_core`) that a race build's numbers are drawn in. So
   each car's shape, wheelbase, track, ride height and wheel positions are exactly the game's. Only the body's
   stations are four times closer together.
2. **The Studio kit.** `models/src/hd/` has the Studio SUV's own files (`70_geo` to `76_trim`, `89_hd`, `90_kit`).
   They're changed only where another car needs something the SUV doesn't use, such as mirror caps and handles in
   other colours, or roof rails in silver. The SUV builds from them byte for byte as it does in SUV Studio, and
   that's checked by comparing every array after each change. Added alongside them:
   - `77_kit`: the new cars' materials
   - `78_run`: tyres, rims and brakes built the SUV's way
   - `79_bits`: underside, wipers, lamps, bumpers
   - `79_cabin`: a cabin generator, each car saying what its cabin has
   - `79_bay`: the engine bay, or an electric car's front trunk
   - `79_parts`: parts first made for one car and shared once another needed them: the EV's lip, diffuser, race
     mirrors and flush panels (the Coupe and the Muscle use them too), and vents cut into the top
3. **Each car's own detail.** This is in `models/src/cars/<car>/`, one file a part: the wheel, face, tail, cabin,
   bolt-ons and engine bay. Each car leaves off the game's decals and boxes that it builds again in 3D.
4. **Blender** (the `bpy` module, no window) does three jobs from what `models/tools/export_parts.js` writes out:
   - the bake (`bake.py`, Baked SUV Test's, plus the second normal picture a .glb needs)
   - the .glb files (`studio_glb.py`, `baked_glb.py`)
   - the path-traced picture (`cycles_render.py`)

`sh models/tools/make_car.sh <car>` makes all of a car's files, from the repo's top. It takes about ten minutes on
two processor cores. The pictures come from `models/tools/shot.js`, which drives the viewer, and `docs.py`.
`models/tools/kit.js` loads the builders into Node for the tools.
