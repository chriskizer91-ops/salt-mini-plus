#!/bin/sh
# Everything a car gets, from the Studio's code (models/src): run from the repo's top, e.g. sh models/tools/make_car.sh pickup
# (about ten minutes on two processor cores: the bake and the Cycles render take most of it). Its work folder is
# /tmp/smp-<car> (W=... for another; it's unset after, as shot.js reads W as the picture's width); what it writes is in models/<car>:
#   <car>_studio.glb, <car>_baked.glb             the Studio car and the baked car, in their pieces (studio_glb.py, baked_glb.py)
#   <car>_studio_data.js, <car>_baked_data.js     the same in the game's own mesh form (pack_studio.js, pack_game.py)
#   docs/*.webp, numbers.json                     the pictures and the numbers (shot.js, cycles_render.py, glb_check.js, docs.py)
#   (OUT=models/suv for the SUV, whose build is 'stock'; KEEP_BAKED=1 keeps its baked data as Baked SUV Test made it;
#   STUDIO_ONLY=1 makes no baked version: no bake, no baked data or .glb, no baked pictures)
set -e
car=$1; X=${W:-/tmp/smp-$car}; unset W; M=${OUT:-models/$car}; N=$(basename $M); V="${VIEWS:-front34 rear34 side wheel face tail cabin bay:open}"
mkdir -p $M/docs $X/shots
node models/tools/export_parts.js $car $X
python3 models/tools/studio_glb.py $X/studio $M/${N}_studio.glb > $X/glb.log 2>&1
node --max-old-space-size=4096 models/tools/pack_studio.js $car $M/${N}_studio_data.js
if [ -z "$STUDIO_ONLY" ]; then
python3 models/tools/bake.py $X/bake-in $X/bake-out 2048 1024 32 > $X/bake.log 2>&1
[ -n "$KEEP_BAKED" ] || python3 models/tools/pack_game.py $X/bake-out $car $M/${N}_baked_data.js
python3 models/tools/baked_glb.py $X/bake-out $X/studio/manifest.json $M/${N}_baked.glb > $X/glb_baked.log 2>&1
fi
sh viewer/build.sh
node models/tools/shot.js $X/shots $car studio $V
node models/tools/shot.js $X/shots $car game front34
[ -n "$STUDIO_ONLY" ] || node models/tools/shot.js $X/shots $car baked front34
L=$(node -e "console.log(require('$X/studio/manifest.json').D.L)")
node models/tools/glb_check.js $M/${N}_studio.glb $X/glb_check.png $L
[ -n "$STUDIO_ONLY" ] || node models/tools/glb_check.js $M/${N}_baked.glb $X/glb_check_baked.png $L
[ -f $X/cycles_front34.png ] || python3 models/tools/cycles_render.py $X/studio $X/cycles_front34.png front34 1600 1000 ${SAMPLES:-64} > $X/cycles.log 2>&1
python3 models/tools/docs.py $car $X $N
