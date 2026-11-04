/* =====================================================================================
   THE COUPE'S OWN KIT (models/src/cars/coupe/80_kit): small pieces the underside, the bay and the bolt-ons share.
   - cpAx: a frame whose z axis runs from a to b, so a profile revolved by hdRev (its [r, z]) lies along the line.
   - cpRev: a revolved profile laid along a to b (bushes, boots, flanges, bearings).
   - cpHelix: a coil spring's wire from a to b, its two end turns closed up flat as a real spring's are.
   - cpBar: a forged arm or a pressed rail: a rounded section swept along a path, its ends capped.
   - cpBush: a rubber bush in its steel sleeve, the bolt through it, a nut on each end.
   - cpHex: a hex-headed bolt or nut sitting on a face, along its normal.
   - cpCoilover: a damper body, its spring between two seats and the adjuster ring, the polished shaft, the top mount.
   - cpBoot: a ribbed rubber boot (CV joints, the steering rack).
   ===================================================================================== */
const cpAx=(a,b)=>{const d=V3.norm(V3.sub(b,a)),g=Math.abs(d[1])<.9?[0,1,0]:[1,0,0],f=V3.norm(V3.cross(g,d)),u=V3.cross(d,f);return M4.basis(a,f,u,d);};
function cpRev(dst,a,b,prof,m,n=24,deg=40){hdPart(dst,mb=>{hdRev(mb,prof,n,m);},deg,null,cpAx(a,b));}
function cpHelix(a,b,r,turns,per=20){const M=cpAx(a,b),L=V3.len(V3.sub(b,a)),n=Math.round(turns*per),o=[],e=.8/turns;
  /* the pitch: flat over the first and last 0.8 of a turn, open between */
  const zf=t=>t<e?t/e*.05:t>1-e?.95+(t-1+e)/e*.05:.05+(t-e)/(1-2*e)*.9;
  for(let i=0;i<=n;i++){const t=i/n,q=t*turns*TAU;o.push(M4.xform(M,[Math.cos(q)*r,Math.sin(q)*r,zf(t)*L]));}return o;}
function cpBar(dst,path,hw,hh,rr,m,upv=[0,1,0],deg=40,nc=3){const sec=hdRRect(hw,hh,rr,nc);hdPart(dst,mb=>{hdSweep(mb,path,sec,m,upv,true,true);},deg);}
function cpBush(dst,c,dir,r,len,o={}){const d=V3.norm(dir),a=V3.add(c,V3.mul(d,-len/2)),b=V3.add(c,V3.mul(d,len/2));
  const SL=o.sleeve||SMC('#3a3b3e',SM.ENGINE),RB=SV([.02,.02,.021],MAT.RUBBER);
  cpRev(dst,a,b,[[r*.55,-.004],[r*.55,0],[r,0],[r,len],[r*.55,len],[r*.55,len+.004]],SL,20,40);
  cpRev(dst,a,b,[[r*.9,.003],[r*.92,.004],[r*.92,len-.004],[r*.9,len-.003]],RB,20,40);
  hdPart(dst,mb=>{hdCyl(mb,V3.add(a,V3.mul(d,-.012)),V3.add(b,V3.mul(d,.012)),r*.32,r*.32,8,HC.BOLT);
    hdCyl(mb,V3.add(a,V3.mul(d,-.012)),V3.add(a,V3.mul(d,-.003)),r*.62,r*.62,6,HC.BOLT);hdCyl(mb,V3.add(b,V3.mul(d,.003)),V3.add(b,V3.mul(d,.012)),r*.62,r*.62,6,HC.BOLT);},25);}
function cpHex(mb,c,nrm,r,h,m=HC.BOLT){const d=V3.norm(nrm);hdCyl(mb,c,V3.add(c,V3.mul(d,h)),r,r,6,m);hdCyl(mb,V3.add(c,V3.mul(d,h)),V3.add(c,V3.mul(d,h*1.35)),r*.5,r*.42,8,m);}
function cpCoilover(dst,a,b,o={}){
  const d=V3.norm(V3.sub(b,a)),L=V3.len(V3.sub(b,a)),at=t=>V3.add(a,V3.mul(d,t));
  const DB=o.body||SMC('#2c2d30',SM.SATIN),SP=o.spring||SMC('#c2241c',SM.PAINTED),SEAT=o.seat||SMC('#9a9da2',SM.ENGINE);
  const bL=o.bodyL||L*.48,s0=o.s0||L*.1,s1=o.s1||L*.46,rs=o.rs||.048;
  /* the lower eye and the body */
  cpRev(dst,at(-.02),at(bL),[[0,0],[.016,0],[.022,.012],[.027,.03],[.027,bL-.01],[.024,bL+.01],[.012,bL+.018],[0,bL+.02]],DB,24,35);
  hdPart(dst,mb=>{const e=V3.norm(V3.cross(d,[0,0,1]));hdCyl(mb,V3.add(at(-.02),V3.mul(e,-.022)),V3.add(at(-.02),V3.mul(e,.022)),.017,.017,16,DB);},35);
  /* the threaded collar and the two spring seats */
  cpRev(dst,at(s0-.03),at(s0),[[.029,0],[.031,.002],[.031,.028],[.029,.03]],SEAT,24,30);
  cpRev(dst,at(s0-.004),at(s0+.006),[[.024,0],[rs+.008,0],[rs+.008,.01],[.024,.01]],SEAT,28,30);
  cpRev(dst,at(s1-.006),at(s1+.004),[[.012,0],[rs+.008,0],[rs+.008,.01],[.012,.01]],SEAT,28,30);
  /* the spring */
  hdPart(dst,mb=>{hdTube(mb,cpHelix(at(s0+.012),at(s1-.012),rs,o.turns||5,22),o.wire||.0085,8,SP,false,true);},40);
  /* the shaft and the bump stop, the top mount */
  cpRev(dst,at(bL+.018),at(L),[[.011,0],[.011,L-bL-.018]],MM.CHROME,14,40);
  cpRev(dst,at(s1),at(s1+.05),[[.02,0],[.024,.01],[.024,.04],[.018,.05]],SV([.03,.03,.032],MAT.RUBBER),16,40);
  cpRev(dst,at(L-.012),at(L+.012),[[.012,0],[.045,0],[.05,.008],[.05,.016],[.03,.024],[.012,.024]],SEAT,28,35);
}
function cpBoot(dst,a,b,r0,r1,ribs,m){const p=[[r0*.8,0]];const L=V3.len(V3.sub(b,a));
  for(let k=0;k<=ribs*2;k++){const t=k/(ribs*2),r=r0+(r1-r0)*t;p.push([r*(k%2?.82:1),.012+(L-.024)*t]);}p.push([r1*.8,L]);cpRev(dst,a,b,p,m||SMC('#141415',SM.HOSE),20,55);}
/* the floor's underside at (u, z): the pan, and the tunnel down the middle opening up toward the bell housing (the
   underside builds the pan on it; the bay leaves the tunnel's mouth open in the firewall) */
const cpTunH=u=>.195+.14*sm01((1.85-u)/.25),cpTunW=u=>.165+.1*sm01((1.85-u)/.25),cpFloorY=(u,z)=>.205+cpTunH(u)*Math.exp(-Math.pow(z/cpTunW(u),2));
