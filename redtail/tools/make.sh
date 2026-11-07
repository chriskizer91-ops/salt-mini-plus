set -e
# redtail-1's own viewer, rebuilt from redtail/tools/viewer.js. Run from the repo's top folder; npm ci in redtail/tools once first.
cd "$(dirname "$0")/../.."; mkdir -p redtail/work
redtail/tools/node_modules/.bin/esbuild redtail/tools/viewer.js --bundle --format=iife --minify --outfile=redtail/work/viewer.bundle.js --log-level=warning
python3 - <<'PY'
js=open('redtail/work/viewer.bundle.js').read()
head=open('redtail/tools/viewer-head.html').read()
open('redtail/work/redtail-viewer.html','w').write(head+"<script>setTimeout(function(){"+js.replace('</script','<\\/script')+";document.getElementById('load').remove();},30);</script></body></html>")
PY
ls -la redtail/work/redtail-viewer.html
