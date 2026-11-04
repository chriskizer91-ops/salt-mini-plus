/* =====================================================================================
   THE WEDGE'S CABIN, FINISHED (Studio 2): its Studio cabin (85 wdCabin; its seats' skirts kept above the floor's
   panels) with what it leaves out: the belts' hardware
   (the adjuster on each pillar, the latch plate, the buckle on its stalk beside the tunnel), the seats' rails and
   their levers, a pull strap on each door's card, and the fire extinguisher clipped to the passenger's side of the
   tunnel.
   ===================================================================================== */
function wdCabin2(out,car){
  const n0=out.p.length;wdCabin(out,car);
  /* (the seats' skirts reach below the cabin's floor, as low as the Studio's seats sit: kept above the floor's panels,
     91, so they don't show through them) */
  {const D=HDK.D,G=D.G,yT=.158+D.dy+.004,p=out.p;for(let i=n0;i<p.length;i+=3){const u=D.uC-p[i];if(u>G.cowl&&u<G.rr+.05&&p[i+1]<yT)p[i+1]=yT;}}
  const K=HDK,D=K.D,G=D.G,X=K.X,dy=D.dy,pil=G.pillars.map(p=>p[0]),yF=.2+dy,uHF=pil[0]-.42,BLK=SV([.012,.012,.013],SM.DASH),SAT=HC.SATIN,CHAR=SV(lin('#181819'),SM.DASH),
    cy=(u,z)=>yF+sm01((G.cowl+.34-u)/.28)*.16+(u<pil[0]+.1?.2*Math.exp(-Math.pow(z/.13,2)):0);
  for(const s of [1,-1]){const zc=s*.36;
    /* the rails, low on the floor either side of the seat, the lever across the front */
    for(const e of [-1,1])hdPart(out,mb=>{const z=zc+e*.17;hdRBox(mb,[X(uHF-.2),yF+.008,z],[.24,.008,.013],.003,SMC('#2a2b2d',SM.ENGINE),2);for(const du of [-.42,-.02])cpHex(mb,[X(uHF+du),yF+.016,z],[0,1,0],.007,.005);},30);
    hdPart(out,mb=>{hdTube(mb,[[X(uHF-.46),yF+.03,zc-.1],[X(uHF-.5),yF+.025,zc-.04],[X(uHF-.5),yF+.025,zc+.04],[X(uHF-.46),yF+.03,zc+.1]],.005,8,BLK,false,true);},35);
    /* the belt's adjuster and D-ring, the latch plate, the buckle by the tunnel */
    {const u=pil[0],zt=secKeys(D,u).P[10][0]-.05,yt=K.topY(u,zt)-.12,top=[X(u)+.02,yt,s*(zt-.02)];
      hdPart(out,mb=>{hdRBox(mb,V3.add(top,[0,.04,s*.004]),[.01,.05,.004],.003,CHAR,2);hdCyl(mb,V3.add(top,[0,0,-s*.004]),V3.add(top,[0,0,-s*.012]),.007,.007,12,SAT);
        const lp=[X(u)+.07,yF+.42,s*(zt-.11)];hdRBox(mb,lp,[.018,.026,.004],.003,SAT,2);
        const b=[X(uHF-.1),yF+.2,s*.14],f=cy(uHF-.1,s*.14);hdTube(mb,[[b[0],f,b[2]],[b[0],(f+b[1])/2,b[2]-s*.004],b],.007,8,BLK,false,true);hdRBox(mb,V3.add(b,[0,.03,0]),[.015,.032,.01],.005,BLK,2);
        hdRBox(mb,V3.add(b,[0,.058,0]),[.01,.004,.007],.002,SMC('#b01e18',SM.PLASTIC),1);},35);}
    /* a pull strap on the door's card */
    hdPart(out,mb=>{const u=G.cowl+.6,y=D.belt(u)-.1,z=s*(K.sideZ(u,y)-.075);hdRBox(mb,[X(u),y,z],[.07,.012,.004],.004,SV(lin('#a88d68'),SM.SEAT),2);for(const du of [-.06,.06])cpHex(mb,[X(u+du),y,z-s*.004],[0,0,-s],.005,.004);},35);}
  /* the extinguisher on the tunnel's passenger side */
  {const z=.16,u0=uHF-.35,u1=uHF-.62,rr=.042,y=cy((u0+u1)/2,.25)+.08,A=[X(u0),y,z],B=[X(u1),y,z];
    hdPart(out,mb=>{cpRev(mb,A,B,[[0,0],[rr*.6,0],[rr,.03],[rr,.24],[rr*.7,.26],[.014,.27]],SMC('#c41e1a',SM.PAINTED),28,40);},40);
    hdPart(out,mb=>{hdCyl(mb,B,V3.add(B,[.025,0,0]),.014,.012,14,MM.CHROME);for(const u of [u0-.06,u1+.07]){const ring=[];for(let k=0;k<=24;k++){const a=k/24*TAU;ring.push([X(u),y+Math.sin(a)*(rr+.004),z+Math.cos(a)*(rr+.004)]);}hdTube(mb,ring,.004,6,SAT,true,false);}},40);}
}
