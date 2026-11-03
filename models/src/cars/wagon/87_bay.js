/* =====================================================================================
   THE WAGON'S ENGINE BAY (79_bay hdBayGen): the factory 2.5 turbo five (the game's i525, 16_engines) lengthways
   against the firewall, as the game mounts it, in the game's colours for it (a grey block, a black cam cover); a
   coil on each plug, its turbo on the exhaust side with the intercooler in front; two electric fans.
   ===================================================================================== */
function wgBay(car){return hdBayGen(car,{engine:{layout:'I5',cyl:5,turbo:1,efans:1,coils:1,block:'#85888d',head:'#9a9da2',cover:'#232528'},tubeR:.045});}
