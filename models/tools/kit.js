/* The models' builders loaded into Node, the same files in the same order as the viewer page loads them
   (models/src/game, then models/src/hd, then each car's folder in models/src/cars), for the tools.
   const KIT=require('./kit.js')(); KIT.studioBuild(id, lod) */
const vm=require('vm'),fs=require('fs'),path=require('path');
const SRC=path.join(__dirname,'..','src');
function files(){const out=[];const dir=d=>fs.readdirSync(d).filter(f=>f.endsWith('.js')).sort().map(f=>path.join(d,f));
  out.push(...dir(path.join(SRC,'game')),...dir(path.join(SRC,'hd')));
  const cars=path.join(SRC,'cars');if(fs.existsSync(cars))for(const c of fs.readdirSync(cars).sort())out.push(...dir(path.join(cars,c)));
  return out;}
module.exports=function(){const ctx={console,performance:{now:()=>Date.now()},window:{},Math,JSON};vm.createContext(ctx);
  vm.runInContext(files().map(f=>fs.readFileSync(f,'utf8')).join('\n;\n'),ctx);return ctx.window.KIT;};
module.exports.files=files;
