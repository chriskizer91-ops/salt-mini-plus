/* =====================================================================================
   THE COUPE GT'S CABIN: the Coupe's own (cars/coupe 85_cabin cpCabin: the low dash, the three-spoke wheel, the two
   buckets, the shelf), with the roll cage a GT racer carries, in dark satin tube:
   - The main hoop behind the seats, up the sides and across under the roof, a diagonal across it.
   - The front hoop up each windscreen pillar and along under the roof to the main hoop.
   - Two stays from the main hoop back and down under the fastback's glass.
   - An X of door bars on each side, low across the door.
   (The game has no cabin to look into; this is what such a car has inside.)
   ===================================================================================== */
function cgCabin(out,car){cpCabin(out,car);cgCage(out,car,{uh:HDK.D.G.pillars[0][0]+.02,inset:.075,r:.019});}
/* the cage, fitted to the shell: uh the main hoop's u, inset how far inside the skin the tube's centre runs */
function cgCage(out,car,o){
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=D.dy,TUBE=o.mat||SMC('#2c2d30',SM.SATIN),r=o.r||.019,ins=o.inset||.075,yF=(o.floorY!=null?o.floorY:.22+dy)+.03;
  /* inside the skin: the side at (u, y) and the roof at (u, z) */
  const zIn=(u,y)=>K.sideZ(u,y)-ins,yIn=(u,z)=>K.topY(u,Math.abs(z))-ins;
  const tube=pts=>hdPart(out,mb=>{hdTube(mb,cgEase(pts,2),r,14,TUBE,false,true);},40);
  /* the roof's corner over a section at u: the highest point a tube can go at the side */
  const corner=u=>{let y=D.belt(u)+.05;for(let i=0;i<60;i++){const z=zIn(u,y+.01);if(yIn(u,z-.04)<y+.01)break;y+=.01;}const z=zIn(u,y);return [z-.03,Math.min(y,yIn(u,z-.03))];};
  /* ---------- the main hoop ---------- */
  const uh=o.uh,[zc,yc]=corner(uh);
  {const up=s=>{const a=[];for(let i=0;i<=6;i++){const y=yF+(yc-.06-yF)*i/6;a.push([X(uh),y,s*zIn(uh,y)]);}return a;},top=[];
    for(let i=1;i<8;i++){const z=-zc+2*zc*i/8;top.push([X(uh),yIn(uh,z),z]);}
    tube([...up(-1),...top,...up(1).reverse()]);}
  /* the diagonal across it, foot to the far top corner */
  tube([[X(uh),yF+.04,-zIn(uh,yF+.04)+.01],[X(uh),yc-.05,zc-.02]]);
  /* ---------- the front hoop: up each windscreen pillar, then back under the roof's edge to the main hoop ---------- */
  const uf=G.cowl+.12,yb=D.belt(uf)+.02;
  for(const s of [1,-1]){const P=[];
    P.push([X(uf+.06),yF+.05,s*zIn(uf+.06,yF+.25)]);P.push([X(uf),yb,s*zIn(uf,yb)]);
    /* up the pillar's inside, toward the windscreen's top corner */
    for(let i=1;i<=6;i++){const t=i/6,u=uf+(G.rf-uf)*t,yy=yb+(K.topY(G.rf,zc)-ins-yb)*t,z=Math.min(zIn(u,yy),zc+.02);P.push([X(u),Math.min(yy,yIn(u,z)),s*z]);}
    for(let i=1;i<=6;i++){const u=G.rf+(uh-.03-G.rf)*i/6,[z2,y2]=corner(u);P.push([X(u),y2,s*Math.min(z2,zc)]);}
    tube(P);
    /* ---------- the door bars: an X low across the door ---------- */
    const ud0=uf+.12,ud1=uh-.06,ya=yF+.08,yb2=D.belt((ud0+ud1)/2)-.18;
    tube([[X(ud0),ya,s*zIn(ud0,ya)],[X((ud0+ud1)/2),(ya+yb2)/2,s*zIn((ud0+ud1)/2,(ya+yb2)/2)],[X(ud1),yb2,s*zIn(ud1,yb2)]]);
    tube([[X(ud0),yb2,s*zIn(ud0,yb2)],[X((ud0+ud1)/2),(ya+yb2)/2,s*(zIn((ud0+ud1)/2,(ya+yb2)/2)-.03)],[X(ud1),ya,s*zIn(ud1,ya)]]);
    /* ---------- a stay back from the hoop's top corner, down under the rear glass ---------- */
    {const us=Math.min(G.be-.15,uh+.55),P2=[[X(uh),yc-.04,s*(zc-.02)]];for(let i=1;i<=5;i++){const t=i/5,u=uh+(us-uh)*t,z=(zc-.02)+(.45-(zc-.02))*t,yt=yIn(u,z)-.01,yy=(yc-.04)+(D.belt(us)-.02-(yc-.04))*t;P2.push([X(u),Math.min(yy,yt),s*z]);}tube(P2);}
    /* the feet: a plate under each leg */
    for(const [u,y] of [[uh,yF],[uf+.06,yF+.02]])hdPart(out,mb=>{hdRBox(mb,[X(u),y-.012,s*zIn(u,y+.02)],[.04,.006,.04],.004,TUBE,2);},40);
  }
}
