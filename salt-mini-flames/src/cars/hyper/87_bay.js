/* =====================================================================================
   THE HYPERCAR'S FRONT TRUNK (79_bay hdBayGen, its mid-engine layout): no engine under the bonnet, so a small
   front trunk in its place, moulded in black, with what a mid-engined car keeps in its nose round it: the
   radiators and their two electric fans, the 12-volt battery, the brake booster, the fuse box, the washer bottle.
   (The game draws an engine for this bay from its spec; the Studio shows what a mid-engined car has there: its
   V10 is behind the cabin, 86.)
   ===================================================================================== */
function hpBay(car){return hdBayGen(car,{engine:{layout:'MID',efans:1},tubeR:.04});}
