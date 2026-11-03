/* =====================================================================================
   SALT MINI PLUS: THE STUDIO KIT FOR THE OTHER CARS. The SUV Studio's own files (70 to 76) are as they were; this
   adds what the other cars need on top of them: materials of their own, and the shared pieces (77 to 79: tyres and
   brakes built the SUV's way, lamps, the split of the underside), each car's own detail in models/src/cars/<car>.
   ===================================================================================== */
/* the lamps by what they do (so each lights on its own when the car is driven: the head and fog lamps, the tail and
   brake lamps, the indicators, the reversing lamps), and the new cars' surfaces */
Object.assign(SM,{LAMPH:96,LENSR:97,REFR:98,TREADAT:99,BEDLINER:100,PLASTIC:101,CLOTH:102,PAINTED:103,ENGINE:104,HOSE:105,WHITE:106,TRIMIN:107,LENSH:108});
Object.assign(HC,{LAMPH:SV([1,1,1],SM.LAMPH),LENSH:SV([1,1,1],SM.LENSH),LENSR:SV([1,1,1],SM.LENSR),REFR:SV([1,1,1],SM.REFR),TREADAT:SV([.028,.028,.03],SM.TREADAT),
  BEDLINER:SV(lin('#151516'),SM.BEDLINER),PLASTIC:SV(lin('#18181a'),SM.PLASTIC)});
/* a part's material: a colour on one of the studio's surfaces */
const SMC=(h,m,em=0)=>SV(lin(h),m,em);
