#!/bin/sh
# Brings this page's copy of the Studio cars' code up to date with the models next door (../models/src: the Studio
# kit in hd/, each car's own detail in cars/, and the one game builder the Studio hooks into, game/23_parts.js),
# then rebuilds the page. The page keeps its own copy so that work on the models never changes it by surprise: run
# this when you want their latest, then check the cars.
# It refuses while the models don't yet have the second Studio versions (KIT.setAlt in hd/90_kit.js): this page's
# copy has the Coupe's Studio 2, merged in from a viewer build, and copying over it would take it away.
set -e
cd "$(dirname "$0")/.."
M=../models/src
grep -q "setAlt" $M/hd/90_kit.js || { echo "The models don't have the second Studio versions yet (no setAlt in $M/hd/90_kit.js): nothing copied."; exit 1; }
[ -n "$(ls $M/cars/coupe/ 2>/dev/null | grep -v '^8[0-7]_')" ] || { echo "The models don't have the Coupe's Studio 2 files yet: nothing copied."; exit 1; }
cp $M/hd/*.js src/hd/
cp $M/game/23_parts.js src/game/23_parts.js
rm -rf src/cars && mkdir -p src/cars && cp -r $M/cars/* src/cars/
sh build.sh
