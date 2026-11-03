/* =====================================================================================
   THE HATCH'S ENGINE BAY (79_bay hdBayGen): the homologation 1.8 turbo four (the game's i18t, 16_engines) across the
   nose (ENGINE_OF.hatch mount 'trans'), in the game's colours for it (a grey block, a red cam cover), its turbo on
   the exhaust side with the intercooler in front, the plug leads to the distributor; two electric fans.
   ===================================================================================== */
function htBay(car){return hdBayGen(car,{engine:{layout:'I4',cyl:4,trans:1,turbo:1,efans:1,block:'#85888d',head:'#9a9da2',cover:'#b0201c',coverPaint:1,leads:'#b0201c'},tubeR:.04});}
