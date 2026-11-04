#!/bin/sh
# Builds salt-flats.html (one self-contained page): the shell, then one script with the game's code in the game's own
# order (Salt Mini's, salt-mini-flames/build.sh): the car builders and the Studio models straight from the models
# (../models/src: game, hd and every car's folder), the physics and the engine (src/drive: Salt Mini's, byte for byte
# but for the save keys), the HUD and the sound (src/ui), the ground's pictures and the engines' names (src/flats),
# the traffic Coupe's data (../models/coupe-traffic/data), then the page itself (src/flats/main.js with three.js,
# bundled by esbuild).
# Needs: npm ci (three, esbuild) in this folder once.
set -e
cd "$(dirname "$0")"
M=../models/src
B=$(mktemp /tmp/salt-flats-bundle.XXXXXX.js)
CARS=$(for d in $M/cars/*/; do for f in "$d"*.js; do printf '%s ' "$f"; done; done)
npx esbuild src/flats/main.js --bundle --minify --format=iife --target=es2020 --outfile=$B --log-level=warning
ORDER="$M/game/00_prelude src/ui/10_hud $M/game/14_loft src/drive/15_digital_engine src/drive/16_engines $M/game/21_suv $M/game/22_faces $M/game/23_parts
  $M/game/24_4x4 $M/game/25_coupe $M/game/26_wagon $M/game/27_pickup $M/game/28_muscle $M/game/29_hatch $M/game/34_ev $M/game/35_wedge $M/game/36_hyper
  $M/game/30_wheels $M/game/31_engine_bay $M/game/32_builds src/drive/34_machines
  src/drive/40_physics src/drive/41_ground src/drive/42_chassis src/drive/43_sim $M/game/37_newbuilds src/drive/45_ev
  $M/hd/70_geo $M/hd/71_wheel $M/hd/72_face $M/hd/73_arch $M/hd/75_cabin $M/hd/76_trim $M/hd/77_kit $M/hd/78_run $M/hd/79_bay $M/hd/79_bits $M/hd/79_cabin $M/hd/79_parts $M/hd/89_hd $M/hd/90_kit"
{
  # (the fonts go in where the head says <!--FONTS-->: the game's own, shell/fonts.html)
  awk '$0=="<!--FONTS-->"{while((getline l<"shell/fonts.html")>0)print l;next}1' shell/head.html
  printf '<script>\n'
  for m in $ORDER; do cat "$m.js"; printf '\n;\n'; done
  for f in $CARS; do cat "$f"; printf '\n;\n'; done
  for m in src/ui/17_audio src/ui/20_instruments src/ui/61_hud src/flats/49_ground src/flats/91_kit; do cat "$m.js"; printf '\n;\n'; done
  # (the traffic Coupe: 5k triangles, the Studio 2 surface baked on)
  cat ../models/coupe-traffic/data/coupe_t5000_s2.js; printf '\n;\n'
  printf '</script>\n<script>\n'
  cat $B
  printf '\n</script>\n</body></html>\n'
} > salt-flats.html
rm -f $B
echo "salt-flats.html: $(wc -c < salt-flats.html) bytes"
