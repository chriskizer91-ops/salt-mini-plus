/* =====================================================================================
   THE WEDGE'S V12, BEHIND THE CABIN (the game's v12w, 37_newbuilds: a 5.2 quad-cam V12 driving the rear wheels), on
   the body, where the louvres (84_body) show it:
   - The room it sits in: the floor, the walls inside the rear fenders, the wall at the tail, in black.
   - The engine lengthways: the crankcase and sump, the two banks at sixty degrees, a red cam cover on each with its
     two cam humps and the bolts along its edges; six twin-choke carburettors down the vee with twelve chrome
     trumpets, the linkage along them; the timing cover and the crank's pulley at the cabin end.
   - The ignition: a distributor at the back of each bank, six red leads from it to the plugs between the humps.
   - The exhaust: six pipes off each bank's outer side into a collector, back to the silencer across the tail.
   - The gearbox behind it, ribbed; two coolant hoses out to the side radiators behind the intakes.
   o.noFloor: the room without its floor (Studio 2: the underside's own below); o.tt: the Night Runner's twin turbos
   (Studio 2: a turbo on each bank's pipe ahead of the silencer, its wastegate, the charge pipe forward to an
   intercooler behind the flank's intake and back over the vee to a hat over the carburettors, blown through).
   ===================================================================================== */
function wdV12(out,car,o={}){
  const K=HDK,D=K.D,X=K.X,topY=K.topY,LIN=HC.LINER;
  const ALU=SMC('#8c8f94',SM.ENGINE),RED=SMC('#a3201a',SM.ENGINE),ZN=SMC('#b5b2aa',SM.ENGINE),EXH=SMC('#6e665d',SM.CAST),SIL=SMC('#9b9892',SM.BRUSH),
    LEAD=SMC('#a61c16',SM.HOSE),CAP=SMC('#151516',SM.PLASTIC),HOSE=SMC('#141414',SM.HOSE),CH=MM.CHROME;
  const uF=2.52,uT=3.96,yFl=.19+D.dy,zW=.6;
  /* ---------- the room ---------- */
  /* (o.noFloor, Studio 2's: the room open underneath, its underside building what is under the engine) */
  if(!o.noFloor)hdPart(out,mb=>{const rows=[];for(let u=uF;u<=uT+1e-6;u+=.04){const row=[];for(let j=0;j<=12;j++){const z=-zW+2*zW*j/12;row.push([X(u),yFl,z]);}rows.push(row);}hdLoft(mb,rows,LIN,false,true);},30);
  for(const s of [1,-1])hdPart(out,mb=>{const rows=[];for(let u=uF;u<=uT+1e-6;u+=.04)rows.push([[X(u),yFl,s*zW],[X(u),topY(u,zW)-.004,s*zW]]);hdLoft(mb,rows,LIN,false,s>0);},30);
  hdPart(out,mb=>{const rows=[];for(let k=0;k<=12;k++){const z=-zW+2*zW*k/12;rows.push([[X(uT),yFl,z],[X(uT),topY(uT,Math.abs(z))-.004,z]]);}hdLoft(mb,rows,LIN,false,true);},30);
  /* ---------- the engine ---------- */
  const uA=2.72,uB=3.42,um=(uA+uB)/2,yC=.42+D.dy,c30=Math.cos(PI/6),s30=Math.sin(PI/6);
  const bank=s=>{const b=[0,c30,s*s30],n=V3.cross([1,0,0],b);return {b,n,at:(u,d,e=0)=>V3.add([X(u),yC,0],V3.add(V3.mul(b,d),V3.mul(n,e)))};};
  const box=(u,d,e,s,h,r,m,seg=3)=>{const B=bank(s);hdPart(out,mb=>{hdRBox(mb,[0,0,0],h,r,m,seg);},30,null,M4.basis(B.at(u,d,e),[1,0,0],B.b,B.n));};
  hdPart(out,mb=>{hdRBox(mb,[X(um),yC-.06,0],[(uB-uA)/2,.1,.15],.02,ALU,3);hdRBox(mb,[X(um+.04),yC-.18,0],[(uB-uA)/2-.08,.035,.12],.015,ALU,3);},30);
  for(const s of [1,-1]){const B=bank(s);
    /* the bank and its head */
    box(um,.175,0,s,[(uB-uA)/2-.005,.125,.1],.015,ALU);
    /* the cam cover, its two humps, the bolts along its edges */
    box(um,.315,0,s,[(uB-uA)/2-.015,.018,.095],.012,RED);
    for(const e of [-.047,.047])box(um,.338,e,s,[(uB-uA)/2-.03,.02,.034],.016,RED,4);
    hdPart(out,mb=>{for(let u=uA+.04;u<uB-.02;u+=.07)for(const e of [-.088,.088])ball(mb,B.at(u,.335,e),.006,8,HC.BOLT);},40);
    /* the plugs' leads: from the distributor at the bank's back to each plug between the humps */
    const dc=B.at(uB+.03,.3,0);
    hdPart(out,mb=>{hdCyl(mb,V3.add(dc,[.03,0,0]),dc,.028,.028,20,ALU);hdCyl(mb,dc,V3.add(dc,[-.04,0,0]),.036,.034,20,CAP);},40);
    hdPart(out,mb=>{for(let i=0;i<6;i++){const u=uA+.07+i*.112,p=B.at(u,.345,0),q=V3.add(p,V3.mul(B.b,.03)),cap=V3.add(dc,[-.04,0,(i-2.5)*.009]);
      hdTube(mb,[p,q,V3.lerp(q,cap,.5).map((v,k)=>k===1?v+.03:v),cap],.0042,8,LEAD,false,true);}},40);
    /* the exhaust: six pipes off the outer side into a collector, back to the silencer */
    hdPart(out,mb=>{for(let i=0;i<6;i++){const u=uA+.07+i*.112,p0=B.at(u,.2,s*.1),p1=V3.add(p0,[0,-.02,s*.06]),p2=[X(u+.03),yC-.02,s*.31],p3=[X(u+.09),yC-.07,s*.33];
        hdTube(mb,[p0,p1,p2,p3],.016,10,EXH,false,true);}
      hdTube(mb,[[X(uA+.12),yC-.075,s*.335],[X(uB+.1),yC-.08,s*.34],[X(3.62),yC-.08,s*.34],[X(3.72),yC-.07,s*.32]],.03,14,EXH,false,true);},35);
    /* a coolant hose out to the radiator behind the intake */
    hdPart(out,mb=>{hdTube(mb,[[X(uA+.02),yC+.08,s*.12],[X(uA-.04),yC+.06,s*.3],[X(uA+.04),yC+.02,s*.5],[X(uA+.1),yC,s*(zW-.005)]],.019,12,HOSE,false,true);},40);}
  /* the carburettors down the vee, their trumpets, the linkage */
  for(let i=0;i<6;i++){const u=uA+.07+i*.112,yb=yC+.27;
    hdPart(out,mb=>{hdRBox(mb,[X(u),yb,0],[.038,.035,.07],.01,ZN,3);hdRBox(mb,[X(u),yb-.045,0],[.03,.02,.09],.006,ALU,2);},35);
    for(const z of [-.036,.036])hdPart(out,mb=>{hdRev(mb,[[.021,0],[.0205,.035],[.023,.06],[.03,.075],[.034,.08],[.033,.083],[.027,.08],[.019,.06],[.018,.02]],28,CH);},40,null,M4.basis([X(u),yb+.035,z],[1,0,0],[0,0,-1],[0,1,0]));}
  hdPart(out,mb=>{hdCyl(mb,[X(uA+.03),yC+.27,.078],[X(uB-.04),yC+.27,.078],.005,.005,10,CH);},40);
  /* the timing cover and the crank's pulley at the cabin end */
  hdPart(out,mb=>{hdRBox(mb,[X(uA-.012),yC+.08,0],[.014,.2,.19],.03,ALU,3);hdCyl(mb,[X(uA-.026),yC-.05,0],[X(uA-.06),yC-.05,0],.075,.075,32,CAP);},35);
  /* ---------- the gearbox behind it, ribbed; the silencer across the tail ---------- */
  hdPart(out,mb=>{hdRBox(mb,[X(3.58),yC-.04,0],[.16,.1,.13],.03,ALU,3);for(const u of [3.47,3.58,3.69])hdRBox(mb,[X(u),yC-.04,0],[.008,.105,.135],.006,ALU,2);},30);
  hdPart(out,mb=>{hdRBox(mb,[X(3.84),yC-.07,0],[.075,.075,.5],.04,SIL,4);for(const s of [1,-1])hdCyl(mb,[X(3.75),yC-.07,s*.32],[X(3.77),yC-.07,s*.32],.034,.034,16,SIL);},35);
  /* ---------- (o.tt) the twin turbos ---------- */
  if(o.tt){const IRON=SMC('#4a433c',SM.CAST),CA=SMC('#a3a6ab',SM.CAST),SILI=SMC('#1b3a8a',SM.HOSE),r0=.06,hat=[X(um),yC+.41,0];
    for(const s of [1,-1]){const tc=[X(3.62),yC+.02,s*.4],cc=[tc[0],tc[1],s*.4];
      hdPart(out,mb=>{ball(mb,tc,r0*1.05,18,IRON);hdCyl(mb,[tc[0]+.04,tc[1],tc[2]],[tc[0]-.03,tc[1],tc[2]],r0,r0,24,IRON);hdTube(mb,[[X(3.6),yC-.08,s*.34],[X(3.61),yC-.04,s*.38],[tc[0],tc[1]-r0*.8,tc[2]]],.026,12,EXH,false,true);
        const c2=[tc[0]+.08,tc[1]+.02,tc[2]];ball(mb,c2,r0*.95,18,CA);hdCyl(mb,[c2[0]+.035,c2[1],c2[2]],[c2[0]-.03,c2[1],c2[2]],r0*.98,r0*.98,24,CA);
        const wg=[tc[0]-.02,tc[1]+r0+.03,tc[2]-s*.03];hdCyl(mb,wg,V3.add(wg,[0,.03,0]),.022,.022,16,SMC('#2a2b2e',SM.PAINTED));},35);
      /* the charge pipe forward along the room's wall to the intercooler behind the intake, and on to the hat */
      const ic=[X(2.72),yC+.06,s*(zW-.06)];
      hdPart(out,mb=>{hdRBox(mb,ic,[.1,.09,.025],.01,SMC('#2a2b2d',SM.ENGINE),2);for(let k=-6;k<=6;k++)hdRBox(mb,V3.add(ic,[k*.014,0,-s*.026]),[.002,.085,.002],.001,SMC('#3a3b3d',SM.ENGINE),1);
        hdTube(mb,suvPath([[tc[0]+.08,tc[1]+.02+r0,tc[2]],[X(3.45),yC+.2,s*.45],[X(3.0),yC+.18,s*(zW-.06)],V3.add(ic,[-.1,.05,0])],4,2),.028,14,CA,false,true);
        hdTube(mb,suvPath([V3.add(ic,[.1,.05,0]),[X(2.66),yC+.3,s*.4],[X(uA+.12),yC+.4,s*.16],[hat[0]+(uB-uA)/2-.04,hat[1],s*.06]],4,2),.03,14,CA,false,true);
        for(const t of [.3,.7])hdCyl(mb,V3.lerp([X(3.45),yC+.2,s*.45],[X(3.0),yC+.18,s*(zW-.06)],t),V3.add(V3.lerp([X(3.45),yC+.2,s*.45],[X(3.0),yC+.18,s*(zW-.06)],t),[.012,0,0]),.032,.032,14,SILI);},35);}
    /* the hat: a long box over the carburettors' trumpets, its ribs, the blow-off valve */
    hdPart(out,mb=>{hdRBox(mb,hat,[(uB-uA)/2-.02,.03,.075],.025,CA,4);for(let k=-4;k<=4;k++)hdRBox(mb,[hat[0]+k*.07,hat[1]+.03,0],[.005,.004,.06],.002,CA,1);
      hdCyl(mb,[hat[0]+.1,hat[1]+.03,.05],[hat[0]+.1,hat[1]+.06,.05],.02,.018,16,CA);hdCyl(mb,[hat[0]+.1,hat[1]+.06,.05],[hat[0]+.1,hat[1]+.07,.05],.014,.012,16,SMC('#b0201c',SM.PAINTED));},35);}
}
