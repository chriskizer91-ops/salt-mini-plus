/* =====================================================================================
   THE PICKUP'S ENGINE BAY (79_bay hdBayGen): the factory 5.7 V8 (the game's v57, 16_engines) lengthways against the
   firewall, in the game's colours for it (a dark block, black covers), breathing through the airbox; a mechanical
   fan in a shroud, as the game has on an engine that isn't tuned.
   ===================================================================================== */
function pkBay(car){return hdBayGen(car,{engine:{layout:'V8',block:'#2b2c2f',head:'#6e7176',cover:'#1b1c1e'},tubeR:.05});}
