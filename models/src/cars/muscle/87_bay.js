/* =====================================================================================
   THE MUSCLE'S ENGINE BAY (79_bay hdBayGen): the factory 7.0 big-block V8 (the game's bb72, 16_engines) lengthways
   against the firewall, in the game's colours for it: a blue block and heads, polished valve covers. A 1970 engine,
   so no plenum and no airbox: a four-barrel carburettor on a cast intake under a big round chrome air cleaner, plug
   leads to the distributor at the back; a mechanical fan in its shroud.
   ===================================================================================== */
function muBay(car){return hdBayGen(car,{engine:{layout:'V8',carb:1,polish:1,block:'#2b4796',head:'#2b4796',cover:'#c9ccd1'},tubeR:.05});}
