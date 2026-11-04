#!/bin/sh
# A car's Studio 2 numbers and pictures, from the repo's top: sh models/tools/s2_car.sh <car> <folder>
# (e.g. sh models/tools/s2_car.sh stock suv). Rebuilds the viewer, writes models/<folder>/numbers_s2.json (s2_numbers.js)
# and models/<folder>/docs/s2_*.webp (s2_shots.js, s2_docs.py: Studio and Studio 2 side by side), then the README's tables.
set -e
car=$1; F=$2; X=${S2W:-/tmp/smp-s2-$car}
sh viewer/build.sh
node models/tools/s2_numbers.js $car $F
node models/tools/s2_shots.js $X $car
python3 models/tools/s2_docs.py $car $X $F
python3 models/tools/readme.py > /dev/null
