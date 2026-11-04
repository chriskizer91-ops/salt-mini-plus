/* =====================================================================================
   THE HATCH GROUP B'S WHEEL: the Hatch's white 15-inch flat-face rally wheel (cars/hatch 81_wheel htWheel: eight
   round windows, four lug nuts, a plain cap) on the gravel tyre and the race brake the game gives the Group B:
   - The tyre (78_run hdTyre 'at'): chunky blocks in staggered rows, a zig-zag centre groove, notched shoulders and
     lugs down the sidewall, for gravel.
   - The brake (78_run hdBrake): a bigger vented rotor than the road car's and a four-piston caliper in the build's
     red, as big as fits inside the 15-inch barrel.
   ===================================================================================== */
function hbWheel(w){
  /* the Hatch's wheel, its tyre and brake swapped for the Group B's (the same calls, other choices) */
  const ty=hdTyre,br=hdBrake;
  hdTyre=(o,w2,op)=>ty(o,w2,Object.assign({},op,{kind:'at'}));
  hdBrake=(s,f,w2,op)=>br(s,f,w2,Object.assign({},op,{ro:.13,ri:.08,pistons:4}));
  try{return htWheel(w);}finally{hdTyre=ty;hdBrake=br;}
}
