/* =====================================================================================
   THE EV'S BOLT-ONS, each taken off the game's body and modelled again:
   - The race mirrors (the game's 'race'): 79_parts hdMirrorsRace, shared with the Coupe and the Muscle.
   - The flush door handles: a painted paddle lying flush in the skin, a fine dark gap round it.
   - The charge flap on the left front fender: a painted door flush in the skin, its gap round it.
   ===================================================================================== */
function evHandles(out,car){
  const K=HDK,D=K.D,G=D.G,lk=D.look;
  for(const u of D.B.handles||[G.pillars[0][0]-.2,G.pillars[1][0]-.17]){const y=D.belt(u)-.09;
    hdDrop(car.body,(c,m)=>{const uu=D.uC-c[0];return Math.abs(uu-(u-.015))<.1&&Math.abs(c[1]-y)<.03&&(m===MAT.COL||m===MAT.CHROME||m===MAT.SHUT)&&hdOff(c)>.002;});
    for(const s of [1,-1])hdFlush(out,car,s,RR2(u-.09,u+.06,y-.014,y+.014,.012),.008);}
}
function evCharge(out,car){
  const K=HDK,D=K.D,u0=D.uFa+.5,u1=u0+.15,yc=D.belt((u0+u1)/2)-.12;
  /* the game's outline, painted high on the fender (34_ev FACES.ev), off; the flap on the left front fender */
  hdDrop(car.body,(c,m)=>{const u=D.uC-c[0];return m===MAT.SHUT&&u>u0-.02&&u<u0+.18&&c[1]>.88&&hdOff(c)>.002;});
  hdFlush(out,car,-1,RR2(u0,u1,yc-.045,yc+.045,.022),.014);
}
