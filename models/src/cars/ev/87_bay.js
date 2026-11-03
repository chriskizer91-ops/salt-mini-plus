/* =====================================================================================
   THE EV'S FRONT TRUNK (79_bay hdBayGen, its electric layout): no engine under the bonnet, so a front trunk in its
   place, moulded in black with tie-down loops and a ribbed mat; the front motor's inverter under it and its orange
   high-voltage cables back along the aprons; round it what any car has: the radiator for the battery's cooling and
   its two electric fans, the 12-volt battery, the brake booster, the fuse box, the coolant and washer bottles.
   (The game draws an engine for the EV's bay from a stand-in spec, 37_newbuilds evm; the Studio shows what an
   electric car has.)
   ===================================================================================== */
function evBay(car){return hdBayGen(car,{engine:{layout:'EV',efans:1},tubeR:.04});}
