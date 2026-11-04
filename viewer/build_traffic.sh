#!/bin/sh
# Builds the traffic test page (src/traffic.js) two ways:
#   traffic.html             one self-contained page: the shell, the models' code, every car's data, the page
#   <split-dir> (optional)   the same in pieces, for hosting: index.html, models.js, page.js, data/<key>.js (each car's
#                            data, loaded when it's first shown)
# The cars' data: the Coupe's baked data (models/coupe) and the traffic Coupes (models/coupe-traffic/data).
# usage: sh viewer/build_traffic.sh [split-dir]
set -e
cd "$(dirname "$0")"
M=../models/src; T=../models/coupe-traffic/data; SPLIT=$1
B=$(mktemp /tmp/smp-traffic-bundle.XXXXXX.js); C=$(mktemp /tmp/smp-traffic-models.XXXXXX.js)
npx esbuild src/traffic.js --bundle --minify --format=iife --target=es2020 --outfile=$B --log-level=warning
{ for f in $M/game/*.js $M/hd/*.js; do cat "$f"; printf '\n;\n'; done
  for d in $M/cars/*/; do for f in "$d"*.js; do cat "$f"; printf '\n;\n'; done; done; } > $C
{ cat shell/traffic_head.html; printf '<script>\n'; cat $C
  cat ../models/coupe/coupe_baked_data.js; printf '\n;\n'; for f in $T/*.js; do cat "$f"; printf '\n;\n'; done
  printf '</script>\n<script>\n'; cat $B; printf '\n</script>\n</body></html>\n'; } > traffic.html
echo "traffic.html: $(wc -c < traffic.html) bytes"
if [ -n "$SPLIT" ]; then rm -rf $SPLIT; mkdir -p $SPLIT/data
  cp $C $SPLIT/models.js; cp $B $SPLIT/page.js; cp ../models/coupe/coupe_baked_data.js $SPLIT/data/coupe.js; cp $T/*.js $SPLIT/data/
  { cat shell/traffic_head.html; printf '<script src="models.js"></script>\n<script src="page.js"></script>\n</body></html>\n'; } > $SPLIT/index.html
  echo "$SPLIT: $(du -sh $SPLIT | cut -f1)"; fi
rm -f $B $C
