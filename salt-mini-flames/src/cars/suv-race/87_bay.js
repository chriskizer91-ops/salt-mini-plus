/* =====================================================================================
   THE RACE'S ENGINE BAY (suv-sleeper/86_baygen slBayGen, the three SUV builds' copy of 79_bay hdBayGen): its 7.4
   big-block (the game's bb74, 16_engines) lengthways against the firewall, in the game's colours for it (an orange
   block and heads, polished covers), a turbo low by each bank, the charge pipes through the intercooler ahead of the
   radiator to the throttle body; two electric fans.
   ===================================================================================== */
function rcBay(car){return slBayGen(car,{engine:{layout:'V8',turbo:1,efans:1,polish:1,block:'#b8401c',head:'#b8401c',cover:'#c9ccd1'},tubeR:.05});}
