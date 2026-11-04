/* =====================================================================================
   THE HATCH'S TAIL, IN THREE DIMENSIONS (in place of 29_hatch TAILS.hatch's decals and REARS.hatch's boxes):
   - The lamp band right across the tail: the black ribbed panel in the middle, raised ribs over a dark back; either
     side a lamp in its own cavity: the red (reflector ribs, bulbs), the white reversing block low on its inner end
     behind black dividers, the amber wrapping the corner behind a chrome divider, each under its own lens.
   - The bumper: a black moulding along its plan, its corners wrapping forward to the flares, with a plain plate in a
     recess in the middle and its lamp.
   ===================================================================================== */
function htTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,cuts=[car.body];
  const band=RR2(-.787,.787,Y(.598),Y(.767),.006);for(const c of cuts)hdCut(c,'R',band);
  /* ---------- the ribbed panel in the middle ---------- */
  hdRecess(out,'R',RR2(-.299,.299,Y(.599),Y(.766),.004),.016,.985,HC.GB,()=>HC.GB,3);
  for(const [y0,y1] of [[.601,.615],[.627,.645],[.657,.675],[.687,.705],[.717,.735],[.747,.764]]){const yc=Y((y0+y1)/2),h=(y1-y0)/2,path=[];for(let z=-.292;z<=.2921;z+=.02)path.push(hdS('R',z,yc,-.004));
    hdPart(out,mb=>{hdSweep(mb,path,[[-.006,-h],[.002,-h*.85],[.003,0],[.002,h*.85],[-.006,h]].map(([a,b])=>[-a,b]),HC.PLASTIC,[-1,0,0],true,true);},40);}
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){const Lp=RR2(s*.301,s*.786,Y(.599),Y(.766),.004),rev=(z,y)=>Math.abs(z)<.4&&y<Y(.682),amb=z=>Math.abs(z)>.662;
    hdRecess(out,'R',Lp,.06,.92,HC.GB,()=>HC.REFLC,7);
    /* dividers: chrome between the red and the amber, black round the reversing block */
    {const p=[];for(let y=.602;y<=.7631;y+=.01)p.push([s*.662,Y(y)]);hdTrim(out,'R',p,.005,.055,MM.CHROME,false,50,-.058);}
    {const p=[];for(let y=.602;y<=.6821;y+=.008)p.push([s*.4,Y(y)]);hdTrim(out,'R',p,.005,.055,HC.GB,false,50,-.058);
      const q=[];for(let z=.304;z<=.4001;z+=.008)q.push([s*z,Y(.682)]);hdTrim(out,'R',q,.005,.055,HC.GB,false,50,-.058);}
    hdPart(out,mb=>{for(let y=.61;y<.76;y+=.014){const za=y<.682?.41:.31,a=hdS('R',s*za,Y(y),-.045),b=hdS('R',s*.652,Y(y),-.045);hdCyl(mb,a,b,.0022,.0022,6,HC.REFLC,false);}},30);
    hdPart(out,mb=>{for(const z of [.47,.58])ball(mb,hdS('R',s*z,Y(.71),-.04),.007,14,HC.BULB);ball(mb,hdS('R',s*.35,Y(.64),-.04),.007,12,HC.BULB);ball(mb,hdS('R',s*.725,Y(.682),-.04),.007,12,HC.BULB);},50);
    hdPart(out,mb=>{hdGrid(mb,'R',Lp,()=>.0018,(z,y)=>amb(z)?HC.AMBERL:rev(z,y)?HC.LENSR:HC.REDL,.005);},40);
    hdTrim(out,'R',hdResample(Lp,.006),.006,.003,HC.SEAL,true,50);}
  htBumperR(out,car);
}
function htBumperR(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,xr=X(D.L)-.08,CL=SV([1,1,1],MAT.CLAD);
  const half=[];for(let z=0;z<=.74;z+=.02)half.push([xr+.006*(z/.74)**2,z]);const rc=.1;for(let k=1;k<=14;k++){const a=k/14*PI/2;half.push([xr+.006+rc-Math.cos(a)*rc,.74+Math.sin(a)*rc]);}
  for(let x=xr+.006+rc+.03;x<=X(D.L-.18);x+=.03)half.push([x,.84]);
  const sec=[[.12,Y(.552)],[.04,Y(.555)],[.012,Y(.549)],[.002,Y(.536)],[0,Y(.5)],[0,Y(.474)],[0,Y(.44)],[0,Y(.38)],[0,Y(.346)],[.002,Y(.32)],[.008,Y(.302)],[.02,Y(.293)],[.05,Y(.289)],[.13,Y(.287)]];
  const pl=(z,y)=>Math.abs(z)<.17&&y>Y(.346)&&y<Y(.474);
  const bar=hdBumperLoft(out,{half,sec,in:[xr+1.2,0],m:CL,hole:pl});
  hdBumperPocket(out,bar,hdResample(RR2(-.17,.17,Y(.346),Y(.474),.01),.008),.022,CL,CL,.99);
  {const P=hdResample(RR2(-.155,.155,Y(.352),Y(.468),.008),.01);
    hdPart(out,mb=>{const F=P.map(([z,y])=>bar.onBar(z,y,.012)),B=P.map(([z,y])=>bar.onBar(z,y,.018));hdCap(mb,F,SV([1,1,1],MAT.PLATE),true);hdLoft(mb,[F,B],SV([1,1,1],MAT.PLATE),true);},20);
    hdPart(out,mb=>{const r=hdResample(RR2(-.148,.148,Y(.358),Y(.462),.006),.01).map(([z,y])=>bar.onBar(z,y,.0105));r.push(r[0]);hdTube(mb,r,.0018,6,SV([.05,.07,.18],MAT.COL),false,false);},40);
    for(const z of [-.11,.11])hdPart(out,mb=>{const a=bar.onBar(z,Y(.452),.012);hdCyl(mb,a,V3.add(a,[-.004,0,0]),.006,.0055,10,MM.CHROME);},40);
    hdPart(out,mb=>{hdRBox(mb,bar.onBar(0,Y(.49),.0),[.006,.006,.035],.004,HC.LENS,2);},40);}
}
