/* =====================================================================================
   THE TRAIL'S ENGINE BAY (79_bay hdBayGen): the factory 4.0 inline-six (the game's i40, 16_engines) lengthways
   against the firewall, in the game's colours for it (a dark block, a silver cam cover), its plug leads to the
   distributor, breathing through the airbox; a mechanical fan in a shroud, as an engine that isn't tuned has.
   ===================================================================================== */
function trBay(car){return hdBayGen(car,{engine:{layout:'I6',cyl:6,block:'#2b2c2f',head:'#6e7176',cover:'#7b7f86'},tubeR:.05});}
