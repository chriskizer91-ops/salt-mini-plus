#!/bin/sh
# Builds viewer.html (one self-contained page): the shell, then one script with the models' code in the order the
# tools load it (models/src/game: the game's car builders, copied; models/src/hd: the Studio kit; models/src/cars:
# each car's own Studio detail), then each car's baked data (models/<car>/<car>_baked_data.js), then the page itself
# (src/main.js and src/mats.js with three.js, bundled by esbuild). Needs: npm install (three, esbuild) here once.
set -e
cd "$(dirname "$0")"
M=../models/src
# (the bundle goes to a scratch file of its own, so two builds at once in two copies of the repo don't share one)
B=$(mktemp /tmp/smp-viewer-bundle.XXXXXX.js)
npx esbuild src/main.js --bundle --minify --format=iife --target=es2020 --outfile=$B --log-level=warning
{
  cat shell/head.html
  printf '<script>\n'
  for f in $M/game/*.js $M/hd/*.js; do cat "$f"; printf '\n;\n'; done
  for d in $M/cars/*/; do [ -d "$d" ] && for f in "$d"*.js; do cat "$f"; printf '\n;\n'; done; done
  for f in ../models/*/*_baked_data.js; do [ -f "$f" ] && { cat "$f"; printf '\n;\n'; }; done
  printf '</script>\n<script>\n'
  cat $B
  printf '\n</script>\n</body></html>\n'
} > viewer.html
rm -f $B
echo "viewer.html: $(wc -c < viewer.html) bytes"
