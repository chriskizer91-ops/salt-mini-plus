/* =====================================================================================
   THE WAGON'S RUB STRIPS (in place of 26_wagon EXTRAS.rubstrip's painted lines, and the strips FACES.wagon and
   TAILS.wagon paint across the nose's corners and the tail): one black rubber moulding, rounded, standing proud of
   the skin, at the game's heights, running unbroken where the game's lines meet: from the nose's corners round to
   the front arches, along both doors between the arches, and from behind the rear arches round the tail and
   across it.
   ===================================================================================== */
function wgRub(out,car){
  const K=HDK,D=K.D,a=D.arch.a,dy=K.dy,Y=y=>y+dy,RB=SV([.02,.02,.022],MAT.RUBBER);
  /* the section [out of the skin, up]; side +1 when the sweep's sideways points out of the car, -1 when in */
  const sec=[[-.002,-.015],[.003,-.0145],[.0068,-.011],[.0085,-.004],[.0085,.004],[.0068,.011],[.003,.0145],[-.002,.015]];
  const strip=(path,side)=>hdPart(out,mb=>{hdSweep(mb,path,sec.map(([o,u])=>[side*o,u]),RB,[0,1,0],true,true);},40);
  for(const s of [1,-1]){
    /* the nose's corner, round to the front arch: across the face until the corner turns onto the side */
    {const y=Y(.445),p=[];let z=.44;for(;z<.95;z+=.015){if(K.uFront(z,y)>=.12)break;p.push(hdS('F',s*z,y));}
      for(let u=.135;u<=D.uFa-a-.04+1e-6;u+=.02)p.push(hdSS(s,u,y));strip(p,-s);}
    /* along the doors */
    {const y=Y(.49),p=[];for(let u=D.uFa+a+.04;u<=D.uRa-a-.04+1e-6;u+=.04)p.push(hdSS(s,u,y));strip(p,-s);}
  }
  /* from behind one rear arch, round the tail and across it, to behind the other */
  {const y=Y(.485),p=[],u0=D.uRa+a+.04;let uc=D.L-.1;
    /* (where the side turns onto the tail: the tail's surface reached at the corner) */
    const zc=K.sideZ(uc,y);
    for(let u=u0;u<=uc+1e-6;u+=.02)p.push(hdSS(-1,u,y));
    for(let z=-zc+.02;z<=zc-.02+1e-6;z+=.02)p.push(hdS('R',z,y));
    for(let u=uc;u>=u0-1e-6;u-=.02)p.push(hdSS(1,u,y));strip(p,1);}
}
