/* =====================================================================================
   THE HYPERCAR'S TAIL, IN THREE DIMENSIONS (in place of 36_hyper TAILS.hyper's decals, 25_coupe REARS.coupeDiff's
   boxes and 23_parts' centre exhaust, which is taken off the game's body):
   - The light blades (their sharp outer tips blunted a touch, so the seal round them has no spike): a thin black
     cavity a side under a red lens, a red light guide glowing along it, a row of
     small bulbs behind it for the brake lamp; the two reversing lamps in the middle between them.
   - The mesh panel right across the tail: a deep black opening, a fine honeycomb set back in it.
   - The two fat tips high in the middle: each in a black heat-shield ring let into the tail, a polished barrel
     with a rolled lip, a perforated baffle inside and the pipe running back to the silencer (86).
   - The diffuser: a black valance across the tail's foot, the floor under the tail sweeping up to it, seven fins
     standing down from it, red reflectors at its ends, a red rain lamp in the middle.
   ===================================================================================== */
function hpTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body],X=K.X,L=D.L,GUIDE=SV([1,1,1],MAT.TAIL);
  /* ---------- the blades ---------- */
  for(const s of [1,-1]){const P=[[.18,.705],[.84,.69],[.884,.709],[.886,.721],[.2,.728]].map(([z,y])=>[s*z,Y(y)]);
    hdLampUnit(out,'R',P,cuts,{deep:.03,k:.88,wall:HC.GB,back:()=>HC.GB,bulge:.0015,cell:.004,lens:()=>HC.REDL,seal:false,tol:.05,
      inside:o=>{const pts=[];for(let t=0;t<=1.0001;t+=.1){const z=.21+.64*t;pts.push(hdS('R',s*z,Y(.7165-.012*t+.012*t*t*t),-.011));}
        hdPart(o,mb=>{hdTube(mb,pts,.0042,10,GUIDE,false,true);},50);
        hdPart(o,mb=>{for(let z=.26;z<=.76;z+=.05)ball(mb,hdS('R',s*z,Y(.7155-.012*(z-.21)/.64),-.017),.0028,8,HC.BULB);},50);}});
    hdTrim(out,'R',hdResample(P,.006),.006,.0025,HC.SEAL,true,50);
    /* the reversing lamp in the middle */
    const Rv=RR2(Math.min(s*.06,s*.14),Math.max(s*.06,s*.14),Y(.69),Y(.72),.005);
    hdLampUnit(out,'R',Rv,cuts,{deep:.025,k:.85,wall:HC.REFLC,back:()=>HC.REFLC,bulge:.0015,cell:.003,lens:()=>HC.LENSR,seal:false,
      inside:o=>{hdPart(o,mb=>{for(const z of [.08,.1,.12])ball(mb,hdS('R',s*z,Y(.705),-.014),.0035,10,HC.BULB);},50);}});
    hdTrim(out,'R',hdResample(Rv,.005),.005,.002,HC.SEAL,true,50);}
  /* ---------- the mesh panel ---------- */
  {const M0=RR2(-.82,.82,Y(.4),Y(.66),.02);for(const c of cuts)hdCut(c,'R',M0);hdRecess(out,'R',M0,.12,.97,HC.GB,()=>HC.GB);
    hdHoney(out,'R',hdShrink(M0,.97),.035,.016,.0016,.012,HC.HONEY);
    hdTrim(out,'R',hdResample(M0,.008),.012,.004,HC.GB,true,50);}
  /* ---------- the tips ---------- */
  hpTips(out,car,cuts);
  /* ---------- the diffuser ---------- */
  hpDiffuser(out,car);
}
/* the centre of each tip: the game's own, as 23_parts exhausts('centre') puts it */
function hpTipAt(){const D=HDK.D;return {y:D.sill(D.L)+.33+D.B.fit.rdy,z:.13};}
function hpTips(out,car,cuts){
  const K=HDK,D=K.D,X=K.X,L=D.L,{y,z}=hpTipAt(),POL=SMC('#c9ccd1',SM.BRUSH),DARK=SMC('#1a1a1b',SM.ENGINE),SOOT=SMC('#0c0b0a',SM.CAST);
  /* the game's pipes and tips off its body */
  hdDrop(car.body,(c,m)=>{const u=D.uC-c[0];return u>4.05&&Math.abs(c[1]-y)<.085&&Math.abs(Math.abs(c[2])-z)<.085&&(m===MAT.CHROME||m===MAT.COL||m===MAT.METAL);});
  for(const s of [1,-1]){const zc=s*z;
    /* the heat-shield ring let into the tail round it */
    const C=EL2(zc,y,.088,.088,40);for(const c of cuts)hdCut(c,'R',C);hdRecess(out,'R',C,.05,.94,HC.GB,()=>SOOT);
    hdTrim(out,'R',hdResample(C,.006),.007,.003,HC.GB,true,50);
    /* the barrel: polished, tapering back into the car, its lip rolled over; the inside dark */
    const xL=X(L+.035),x0=X(L-.2);
    hdPart(out,mb=>{hdRev(mb,[[.06,0],[.066,.03],[.07,.2],[.072,.226],[.0745,.232],[.074,.236],[.068,.237],[.064,.233]],40,POL);},40,null,M4.basis([x0,y,zc],[0,0,1],[0,1,0],[-1,0,0]));
    hdPart(out,mb=>{hdRev(mb,[[.064,.233],[.0625,.2],[.0605,.05]],40,SOOT,0,TAU,true);},30,null,M4.basis([x0,y,zc],[0,0,1],[0,1,0],[-1,0,0]));
    /* the perforated baffle a little inside, a ring of holes round a solid middle */
    hdPart(out,mb=>{hdRev(mb,[[.061,0],[0,0]],40,DARK,0,TAU,true);},30,null,M4.basis([xL+.03,y,zc],[0,0,1],[0,1,0],[-1,0,0]));
    hdPart(out,mb=>{for(let r=.016;r<=.052;r+=.012){const n=Math.round(TAU*r/.009);for(let i=0;i<n;i++){const a=(i+(r*100%2)*.5)/n*TAU;
        mb.tri([xL+.0285,y+Math.cos(a)*r+.0025,zc+Math.sin(a)*r],[xL+.0285,y+Math.cos(a)*r-.00125,zc+Math.sin(a)*r-.0022],[xL+.0285,y+Math.cos(a)*r-.00125,zc+Math.sin(a)*r+.0022],SOOT[0],SOOT[1],SOOT[2]);}}},0);
    /* a turned band round the barrel where it meets the tail */
    hdPart(out,mb=>{hdRev(mb,[[.071,.17],[.0755,.172],[.0755,.18],[.071,.182]],40,DARK);},30,null,M4.basis([x0,y,zc],[0,0,1],[0,1,0],[-1,0,0]));}
}
function hpDiffuser(out,car){
  const K=HDK,D=K.D,X=K.X,x=X(D.L),y0=D.sill(D.L),PL=HC.PLASTIC,GB=HC.GB;
  /* the valance across the tail's foot */
  hdPart(out,mb=>{hdRBox(mb,[x-.006,y0+.025,0],[.013,.03,.8],.01,GB,3);},35);
  /* the floor under the tail, sweeping up to it */
  {const ax=V3.norm([1,-.24,0]),ay=V3.norm([.24,1,0]);hdPart(out,mb=>{hdRBox(mb,[0,0,0],[.24,.006,.78],.004,PL,2);},30,null,M4.basis([x+.2,y0-.055,0],ax,ay,[0,0,1]));}
  /* seven fins standing down from it, the outer ones taller */
  for(let k=-3;k<=3;k++){const h=.05+.02*Math.abs(k)/3;hdPart(out,mb=>{hdExtrude(mb,[[x+.42,y0-.11],[x+.32,y0-.11-h*.3],[x-.014,y0-.03-h],[x-.014,y0+.04]],k*.13-.003,k*.13+.003,PL,.0015,2,true);},35);}
  for(const s of [1,-1])hdPart(out,mb=>{hdRBox(mb,[x-.0195,y0+.035,s*.75],[.003,.011,.04],.003,HC.REFR,2);},40);
  /* the rain lamp in the middle */
  hdPart(out,mb=>{hdRBox(mb,[x-.0195,y0+.025,0],[.003,.012,.045],.004,HC.REDL,2);},40);
  hdPart(out,mb=>{for(let z=-.03;z<=.0301;z+=.015)ball(mb,[x-.016,y0+.025,z],.003,8,HC.BULB);},50);
}
