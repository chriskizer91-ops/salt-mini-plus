set -e
# redtail-versions.html: every Redtail version in one viewer (the version chip swaps them; the Paint chip on redtail-2).
# Run from the repo's top folder; npm ci in redtail/tools once first.
cd "$(dirname "$0")/../.."; mkdir -p redtail/work
redtail/tools/node_modules/.bin/esbuild redtail/tools/viewer-versions.js --bundle --format=esm --minify --outfile=redtail/work/viewer-versions.bundle.js --log-level=warning
python3 - <<'PY'
import base64, json
js=open('redtail/work/viewer-versions.bundle.js').read()
head=open('redtail/tools/viewer-versions-head.html').read()
glb=base64.b64encode(open('redtail/versions/redtail-2/redtail-2.glb','rb').read()).decode()
paints={k:base64.b64encode(open(f'redtail/versions/redtail-2/paint/redtail-2-{k}.webp','rb').read()).decode() for k in ('yellow-black','wilderness-olive')}
open('redtail/redtail-versions.html','w').write(head+'<script>window.REDTAIL_GLB="'+glb+'";window.RT_PAINTS='+json.dumps(paints)+';</script><script type="module">'+js.replace('</script','<\\/script')+";document.getElementById('load').remove();</script></body></html>")
PY
ls -la redtail/redtail-versions.html
