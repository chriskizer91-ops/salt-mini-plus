/* =====================================================================================
   THE COUPE'S ENGINE BAY (79_bay hdBayGen): the factory 5.2 flat-plane V8 (the game's fp52, 16_engines) lengthways
   against the firewall, in the game's colours for it (a grey block, red cam covers), breathing through the airbox;
   two electric fans.
   ===================================================================================== */
function cpBay(car){return hdBayGen(car,{engine:{layout:'V8',efans:1,block:'#85888d',head:'#9a9da2',cover:'#b0201c',coverPaint:1},tubeR:.05});}
