/* =====================================================================================
   THE PICKUP'S TAIL, IN THREE DIMENSIONS (in place of TAILS.pickup's decals and REARS.pickup's boxes):
   - The tall lamps on the bed's corner posts: a cavity behind each, chrome reflector ribs and bulbs in its two red
     parts, a clear reversing window between them behind a black divider, the red lens and the clear lens over them
     following the corner, a black seal round it.
   - The tailgate: a real shut gap down both sides and along the bottom, the handle in its pocket with a lock.
   - The step bumper: one moulding along its plan, the step on top with a ribbed rubber pad, the plate in a recess
     with its lamps over it and a plain plate (no lettering), the hitch receiver under it with its pin and clip.
   - The third brake lamp on the cab's roof edge, red, with the two cargo lamps either side of it.
   ===================================================================================== */
function pkTail(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,L=D.L,cuts=[car.body];
  /* ---------- the lamps ---------- */
  for(const s of [1,-1]){
    const Lp=RR2(s*.856,s*.93,Y(.858),Y(1.342),.012),inRev=(z,y)=>y>Y(1.012)&&y<Y(1.108);
    hdLampUnit(out,'R',Lp,cuts,{deep:.07,k:.9,wall:HC.GB,back:()=>HC.REFLC,bulge:.004,cell:.005,lens:(z,y)=>inRev(z,y)?HC.LENSR:HC.REDL,
      inside:o=>{
        /* the black dividers either side of the reversing window */
        for(const y of [1.01,1.11]){const p=[];for(let z=.86;z<=.9261;z+=.008)p.push([s*z,Y(y)]);hdTrim(o,'R',p,.006,.06,HC.GB,false,50,-.065);}
        /* the reflector's ribs in the red, and the bulbs */
        hdPart(o,mb=>{for(const [y0,y1] of [[.872,1.0],[1.122,1.33]])for(let y=y0+.012;y<y1;y+=.016){const a=hdS('R',s*.864,Y(y),-.052),b=hdS('R',s*.922,Y(y),-.052);hdCyl(mb,a,b,.0025,.0025,6,HC.REFLC,false);}},30);
        hdPart(o,mb=>{for(const y of [.935,1.18,1.27])ball(mb,hdS('R',s*.893,Y(y),-.045),.0075,14,HC.BULB);ball(mb,hdS('R',s*.893,Y(1.06),-.045),.0075,12,HC.BULB);},50);
      }});
    /* the black housing round the lamp, proud of the body */
    hdTrim(out,'R',hdResample(RR2(s*.851,s*.934,Y(.852),Y(1.348),.016),.006),.01,.005,HC.GB,true,50);
  }
  /* ---------- the tailgate: the shut gaps cut in (both sides and the bottom), the handle ---------- */
  {const gap=(P)=>{for(const c of cuts)hdCut(c,'R',P,.02);hdRecess(out,'R',P,.014,.7,HC.GB,()=>HC.GB,2);};
    gap(RR2(-.843,.843,Y(.717),Y(.723),.001));for(const s of [1,-1])gap(RR2(s*.837,s*.843,Y(.723),Y(1.416),.001));}
  {const P=RR2(-.14,.14,Y(1.16),Y(1.26),.02);for(const c of cuts)hdCut(c,'R',P);hdRecess(out,'R',P,.038,.92,HC.PLASTIC,()=>HC.GB,5);
    hdPart(out,mb=>{hdRBox(mb,hdS('R',0,Y(1.205),-.018),[.012,.022,.115],.008,HC.PLASTIC,3);},40);
    hdRevAt(out,'R',hdS('R',.11,Y(1.235),-.004),[[.011,0],[.011,.003],[.008,.0045],[.002,.0045],[0,.004]],MM.CHROME,24);}
  pkBumperR(out,car);
  /* ---------- the third brake lamp and the cargo lamps, on the cab's roof edge ---------- */
  {const yc=Y(1.846),c=hdS('R',0,yc,0);
    hdPart(out,mb=>{hdRBox(mb,[c[0]+.012,yc,0],[.026,.024,.215],.012,HC.GB,4);},40);
    hdPart(out,mb=>{hdRBox(mb,[c[0]-.0145,yc+.002,0],[.002,.012,.15],.002,HC.REDL,2);},40);
    for(const z of [-.185,.185])hdPart(out,mb=>{hdRBox(mb,[c[0]-.0145,yc+.002,z],[.002,.012,.022],.002,HC.LENS,2);},40);}
}
/* the step bumper (in place of REARS.pickup's boxes): lofted along its plan, holes for the plate */
function pkBumperR(out,car){
  const K=HDK,D=K.D,dy=K.dy,Y=y=>y+dy,X=K.X,xr=X(D.L)-.09,BL=SV(lin('#151517'),SM.PAINTED),RUB=SV([.016,.016,.017],MAT.RUBBER);
  const half=[];for(let z=0;z<=.84;z+=.02)half.push([xr,z]);const rc=.07;for(let k=1;k<=12;k++){const a=k/12*PI/2;half.push([xr+rc-Math.cos(a)*rc,.84+Math.sin(a)*rc]);}
  half.push([xr+rc+.06,.91]);
  const plan=[...half.slice(1).reverse().map(([x,z])=>[x,-z]),...half];
  const st=plan.map((p,i)=>{const a=plan[Math.max(0,i-1)],b=plan[Math.min(plan.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],l=Math.hypot(tx,tz)||1;let n=[-tz/l,tx/l];
    if(n[0]*(xr+1-p[0])+n[1]*(0-p[1])<0)n=[-n[0],-n[1]];return {p,n};});
  /* the section, from the step's front edge over the top, down the face, under it (q: how far forward from the plan) */
  const sec=[[.125,Y(.746)],[.05,Y(.749)],[.016,Y(.747)],[.004,Y(.741)],[0,Y(.728)],[0,Y(.705)],[0,Y(.66)],[0,Y(.62)],[0,Y(.582)],[.003,Y(.566)],[.012,Y(.556)],[.03,Y(.552)],[.13,Y(.55)]];
  const P=(i,j)=>{const s=st[i],[q,y]=sec[j];return [s.p[0]+s.n[0]*q,y,s.p[1]+s.n[1]*q];};
  const plate=(z,y)=>Math.abs(z)<.168&&y>Y(.582)&&y<Y(.705);
  hdPart(out,mb=>{for(let i=0;i<st.length-1;i++)for(let j=0;j<sec.length-1;j++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);if(plate((a[2]+c[2])/2,(a[1]+c[1])/2))continue;mb.quad(a,b,c,d,BL[0],BL[1],BL[2]);}
    for(const i of [0,st.length-1])for(let j=1;j<sec.length-1;j++)mb.tri(P(i,0),P(i,j),P(i,j+1),BL[0],BL[1],BL[2]);},38);
  /* the step's rubber pad, ribbed across */
  hdPart(out,mb=>{const y0=Y(.7485);for(let z=-.8;z<.8;z+=.018){const z1=Math.min(z+.012,.8);
      hdRBox(mb,[xr+.06,y0+.003,(z+z1)/2],[.045,.003,(z1-z)/2],.0015,RUB,1);}
    hdRBox(mb,[xr+.06,y0+.0005,0],[.05,.001,.81],.001,RUB,1);},30);
  /* the plate in its recess, its lamps over it, a plain raised border */
  {const rim=hdResample(RR2(-.168,.168,Y(.582),Y(.705),.012),.008),B=rim.map(([z,y])=>[xr+.022,y,z]);
    hdPart(out,mb=>{hdLoft(mb,[rim.map(([z,y])=>[xr-.0005,y,z]),B],BL,true);hdCap(mb,B,BL,false);},30);
    const pl=hdResample(RR2(-.152,.152,Y(.588),Y(.698),.008),.01);
    hdPart(out,mb=>{const F=pl.map(([z,y])=>[xr+.012,y,z]),Bk=pl.map(([z,y])=>[xr+.018,y,z]);hdCap(mb,F,SV([1,1,1],MAT.PLATE),true);hdLoft(mb,[F,Bk],SV([1,1,1],MAT.PLATE),true);},20);
    hdPart(out,mb=>{const r=hdResample(RR2(-.146,.146,Y(.594),Y(.692),.006),.01);hdTube(mb,r.map(([z,y])=>[xr+.0105,y,z]).concat([[xr+.0105,r[0][1],r[0][0]]]),.0018,6,SV([.05,.07,.18],MAT.COL),false,false);},40);
    for(const z of [-.11,.11])hdPart(out,mb=>{hdCyl(mb,[xr+.012,Y(.682),z],[xr+.008,Y(.682),z],.006,.0055,10,MM.CHROME);},40);
    for(const z of [-.07,.07])hdPart(out,mb=>{hdRBox(mb,[xr+.004,Y(.717),z],[.004,.006,.024],.003,HC.LENS,2);},40);}
  /* the hitch receiver: a square tube out under the middle, its collar, the pin across it and the clip */
  {const y=Y(.5),x0=xr+.12,x1=xr-.035,ST=SV(lin('#121213'),SM.PAINTED);
    hdPart(out,mb=>{const sq=hdRRect(.03,.03,.005,3),ring=x=>sq.map(([a,b])=>[x,y+b,a]),inner=hdRRect(.0254,.0254,.003,3),ri=x=>inner.map(([a,b])=>[x,y+b,a]);
      hdLoft(mb,[ring(x0),ring(x1)],ST,true);hdLoft(mb,[ring(x1),ri(x1)],ST,true);hdLoft(mb,[ri(x1),ri(x1+.08)],HC.GB,true);hdCap(mb,ri(x1+.08),HC.GB,false);
      const col=hdRRect(.036,.036,.006,3);hdLoft(mb,[col.map(([a,b])=>[x1+.006,y+b,a]),col.map(([a,b])=>[x1+.026,y+b,a])],ST,true);},40);
    hdPart(out,mb=>{hdCyl(mb,[x1+.045,y,-.048],[x1+.045,y,.05],.0065,.0065,12,MM.CHROME);hdCyl(mb,[x1+.045,y,-.048],[x1+.045,y,-.052],.011,.011,12,MM.CHROME);
      const clip=[];for(let k=0;k<=14;k++){const a=k/14*PI*1.6-PI*.3;clip.push([x1+.045+Math.cos(a)*.018,y-.012+Math.sin(a)*.03,.056]);}hdTube(mb,clip,.0022,6,MM.CHROME,false,true);},40);}
}
