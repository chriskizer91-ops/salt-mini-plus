/* =====================================================================================
   THE WEDGE'S FRONT TRUNK (79_bay hdBayGen, its mid-engined layout): no engine under the front lid, so a trunk in
   its place, moulded in black with tie-down loops and a ribbed mat; round it the radiator support, the brake
   booster, the fuse box, the battery, the coolant and washer bottles and two electric fans. (The game draws its V12
   here, as it does for every car; the Studio puts it behind the cabin, 86_engine.)
   ===================================================================================== */
function wdBay(car){const B=hdBayGen(car,{engine:{layout:'MID',efans:1},tubeR:.04}),K=HDK,D=K.D,X=K.X,H=D.hood,uF=H.u0+.09,uR=H.u1-.02,y=D.sill((uF+uR)/2)+.012;
  /* (and the trunk's floor pan under it all, so nothing shows through to the road beside the tub) */
  hdPart(B.bay,mb=>{const rows=[];for(let u=uF-.04;u<=uR+.02+1e-6;u+=.04){const zz=Math.min(H.hz(u),D.plan(u)*.72)-.01,row=[];for(let j=0;j<=10;j++)row.push([X(u),y,-zz+2*zz*j/10]);rows.push(row);}hdLoft(mb,rows,HC.LINER,false,true);},30);
  return B;}
