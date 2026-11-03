# Salt Mini Plus

Salt Mini Plus is Redline County's physics and logic on a salt flat with a long road and a few traffic cars about
600 m apart. This repo will hold the game later. For now it holds the traffic cars' models (`models/`) and a page to
look at them (`viewer/`).

Each car comes three ways:

- **Game's own**: the car exactly as Redline County: Wide Open 2: Road Not Found + Traffic builds it.
- **Studio**: the same car modelled for a close look, at least as detailed as the Studio SUV everywhere. It's made
  to be driven as well as passed: the wheels spin and steer, the hood opens, and the lamps light. Traffic draws it
  out to about 100 m, and a small flat picture beyond that (the game makes those itself).
- **Baked**: the game's own mesh at the game's own triangle count, wearing the Studio car's detail as three
  pictures. It's the backup in case the Studio car doesn't fit the phone's budget.

<!-- TABLE -->
| Car | Status | Studio triangles | Baked triangles | Game's own | Baked pictures (Low / Medium) | Picture |
| --- | --- | --- | --- | --- | --- | --- |
| [SUV](models/suv/) | Done | 484,359 (+3,000 engine bay) | 51,408 | 51,586 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![SUV](models/suv/docs/front34.webp) |
| [Pickup](models/pickup/) | Done | 545,652 (+31,712 engine bay) | 53,950 | 54,356 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Pickup](models/pickup/docs/front34.webp) |
| [Hatch](models/hatch/) | Done | 430,908 (+31,178 engine bay) | 46,655 | 46,833 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Hatch](models/hatch/docs/front34.webp) |
| [Wagon](models/wagon/) | Done | 532,457 (+33,666 engine bay) | 52,006 | 52,334 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Wagon](models/wagon/docs/front34.webp) |
| [EV](models/ev/) | Done | 498,744 (+23,526 engine bay) | 55,314 | 55,432 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![EV](models/ev/docs/front34.webp) |
| [Trail (4x4)](models/trail/) | Done | 492,105 (+27,684 engine bay) | 50,181 | 50,799 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Trail (4x4)](models/trail/docs/front34.webp) |
| [Coupe](models/coupe/) | Done | 480,718 (+31,334 engine bay) | 50,361 | 50,475 | 1024 x 1536, 24.0 MB / 2048 x 3072, 96.0 MB | ![Coupe](models/coupe/docs/front34.webp) |
| Muscle | To do | | | | | |
<!-- /TABLE -->

"Studio triangles" is the whole car as you see it with the hood shut: body, cabin, lamps, the four wheels and their
brakes, and the Trail's spare on its door. The engine bay is counted separately because it's only drawn with the hood up. The baked pictures' memory
includes their mipmaps.

## The viewer

`viewer/viewer.html` is one self-contained page. Open it in Edge or Chrome on the laptop or phone.

- **Moving round the car:** drag to turn round it (all the way over and underneath). Pinch or scroll to come
  closer. Double-tap a part to swing round it.
- **The bar along the bottom:**
  - the car's name: pick a car
  - **Game / Studio / Baked**: switch between the three versions
  - **Hood**: open or close the hood
  - **Paint**: the traffic's sixteen colours, plus the car's own factory colour
  - **Lights**: steps through head and tail lamps, then the brake lamps, then the indicators and reversing lamps
- **On the phone:** to keep the screen clear, Paint, Lights, the camera views and Reset are under **•••**.
- **Top right:** the car, the version, its triangle count and its draw calls.

The Studio cars are built in the page from the code, the same way SUV Studio builds its truck. That takes a few
seconds the first time you pick each one. The baked cars are unpacked from their pictures.

`sh viewer/build.sh` rebuilds the page from `viewer/shell`, `viewer/src` and `models/`. Run `npm install` in
`viewer/` once first (it installs three.js and esbuild).

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
  any pixel that still met a surface from behind (`models/tools/bake.py`). A little soft grey shading is left on
  the rear flares, where the game's flare sits a few centimetres off the Studio one. The Studio Hatch doesn't have
  this.
- **Baked EV's engine bay:** the baked cars keep the game's own engine bay, and the game has no electric one: it
  draws a stand-in engine under the EV's bonnet. The Studio EV has its front trunk and the motor's inverter.
- **Liveries:** none of the three versions shows the game's paint liveries, such as the Muscle's two white stripes.
  The game draws them in its paint shader, which picks the second colour by where each point is on the body
  (`13_lit`). The viewer's paint doesn't do that yet, and neither do the .glb files.
- **Hatch Studio triangle count:** lower than the SUV's because the car is much smaller (3.6 m against 4.9 m, on
  15-inch wheels). Every part on the SUV's list is there at the SUV's level: each wheel is 51,000 triangles against
  the SUV's 47,700, the cabin 64,000 against 54,000, and the engine bay 31,000 against the SUV's game bay of 3,000.

## How the models are made

The method is SUV Studio's (cargames, branch `suv-studio/hd-truck`).

1. **The game's own builders.** `models/src/game/` holds copies of the game's builders, unchanged. These are
   `21_suv` (every car's body), `22_faces`, `23_parts`, `24_4x4` to `29_hatch`, `30_wheels`, `31_engine_bay`,
   `32_builds`, `34_ev` and `37_newbuilds`, from `rlcwo2rnf-traffic/src`. They're joined by SUV Studio's
   `00_prelude` and `36_stubs`, which holds empty stand-ins for the physics tables `37_newbuilds` writes into. So
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
