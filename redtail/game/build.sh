set -e
# The Redtail in the games: run from the repo's top folder (sh redtail/game/build.sh).
# 1. redtail-2.glb -> redtail/game/rt2-data.js (its pieces and baked pictures, as one script; not kept in git)
# 2. that script, rt-game.js and rt-fly.js put into Salt & Sand and Ice & Snow, each picture of a paint job with them
cd "$(dirname "$0")/../.."
python3 redtail/game/glb2js.py
python3 redtail/game/rt_patch.py salt-and-sand/salt-and-sand.html redtail/builds/salt-and-sand-redtail-2-flying-paints.html
python3 redtail/game/rt_patch.py salt-and-sand/ice-and-snow.html redtail/builds/ice-and-snow-redtail-2-flying-paints.html
ls -la redtail/builds
