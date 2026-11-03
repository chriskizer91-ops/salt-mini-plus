/* A .glb read back and drawn the way any game engine reads one (three.js's glTF loader, not the viewer's own code),
   posed as a driven car: the hood opened about its hinge, the front wheels steered, every wheel turned, the lamps lit
   from their materials' glow. Proves the pieces are apart and move as they should.
   usage: node models/tools/glb_check.js <in.glb> <out.png> [L (the car's length, for the camera)] */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const [inp,out,Ls]=process.argv.slice(2),L=+(Ls||4.9),s=L/4.92;
const GB=`/tmp/glbcheck-${process.pid}.js`;execSync(`npx esbuild src/glbcheck.js --bundle --format=iife --outfile=${GB} --log-level=warning`,{cwd:path.join(__dirname,'..','..','viewer')});
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage();await p.setContent('<html><body style="margin:0"></body></html>');await p.addScriptTag({path:GB});
  const r=await p.evaluate(([d,s])=>CHECK(d,1280,800,{hood:1.0,steer:.45,spin:.6,lamps:true,cam:[[5.2*s,2.2*s,4.2*s],[.3*s,.75,0]]}),[fs.readFileSync(inp).toString('base64'),s]);
  fs.writeFileSync(out,Buffer.from(r.png.split(',')[1],'base64'));console.log(JSON.stringify({tris:r.tris,draws:r.draws,nodes:r.names.length}));await b.close();})();
