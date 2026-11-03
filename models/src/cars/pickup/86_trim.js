/* =====================================================================================
   THE PICKUP'S BOLT-ONS: the mirrors, door handles and wipers are the shared ones (76_trim, 79_bits, the SUV's way),
   in the build's black; here, in place of EXTRAS.steps' boxes, the running boards, and the fuel door cut in for real.
   - Running boards: a black moulding between the arches, rounded over its outer edge, a ribbed rubber tread along the
     top, end caps tapering down; three steel brackets a side from under the rocker.
   - The fuel door: the game's painted outline taken off; the door cut out of the bed side, a dark gap round it and
     the door itself flush in it.
   ===================================================================================== */
function pkSteps(out,car){
  const K=HDK,D=K.D,X=K.X,u0=D.uFa+D.arch.a+.06,u1=D.uRa-D.archB.a-.06,um=(u0+u1)/2,y=D.sill(um)-.05,z=D.plan(um)+.07,BO=HC.PLASTIC,RUB=SV([.016,.016,.017],MAT.RUBBER);
  for(const s of [1,-1]){
    /* the board: a section swept along it, its ends tapering in */
    const n=40,path=[];for(let i=0;i<=n;i++)path.push(u0+(u1-u0)*i/n);
    const sec=t=>{const e=sm01(Math.min(t,1-t)/.04),w=.08,h=.022*(.55+.45*e);return [[-w,-h],[-w,h*.6],[-w+.01,h],[w-.02,h],[w-.004,h*.7],[w,0],[w-.006,-h*.8],[w-.02,-h],[-w+.01,-h]];};
    hdPart(out,mb=>{const rings=path.map((u,i)=>sec(i/n).map(([a,b])=>[X(u),y+b,s*(z+a)]));hdLoft(mb,rings,BO,true,s<0);
      for(const i of [0,rings.length-1])hdCap(mb,rings[i],BO,(i===0)!==(s<0));},40);
    /* the rubber tread on top: ribs along it */
    hdPart(out,mb=>{for(let k=0;k<6;k++){const a=-.062+k*.022;mb.quad([X(u0+.06),y+.0225,s*(z+a)],[X(u1-.06),y+.0225,s*(z+a)],[X(u1-.06),y+.0225,s*(z+a+.004)],[X(u0+.06),y+.0225,s*(z+a+.004)],RUB[0],0,RUB[2]);
        hdRBox(mb,[X(um),y+.0245,s*(z+a+.011)],[(u1-u0)/2-.07,.0025,.006],.002,RUB,1);}},30);
    /* the brackets: a steel arm from under the rocker out under the board */
    for(const u of [u0+.25,um,u1-.25])hdPart(out,mb=>{const zi=D.plan(u)*.82,yr=D.sill(u)+.01;
      hdTube(mb,[[X(u),yr,s*zi],[X(u),yr-.03,s*(zi+.05)],[X(u),y-.02,s*(z-.04)]],.012,8,HC.CAST,false,true);
      hdRBox(mb,[X(u),y-.024,s*(z-.02)],[.03,.004,.05],.003,HC.CAST,2);for(const du of [-.018,.018])hdCyl(mb,[X(u+du),yr+.004,s*zi],[X(u+du),yr-.012,s*zi],.007,.007,6,HC.BOLT);},40);
  }
}
function pkFuel(out,car){hdFuel(out,car);}
