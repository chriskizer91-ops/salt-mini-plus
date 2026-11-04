/* =====================================================================================
   THE SLEEPER'S ENGINE BAY (86_baygen slBayGen): its built 3.8 twin-turbo V6 (the game's tt38, 16_engines, with the
   build's bigger turbos) lengthways against the firewall, in the game's colours for it (a grey block, red cam
   covers), a turbo low by each bank, the charge pipes through the intercooler ahead of the radiator to the throttle
   body; two electric fans.
   ===================================================================================== */
function slBay(car){return slBayGen(car,{engine:{layout:'V6',turbo:2,efans:1,block:'#5d6066',head:'#74777c',cover:'#a3201c',coverPaint:1},tubeR:.05});}
