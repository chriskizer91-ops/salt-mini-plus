/* =====================================================================================
   THE STUDIO'S ENTRY TO THE BUILDERS. The game's own builders (src/game, copied from Road Not Found +
   Traffic) make the truck exactly as the game does, only with the body's stations closer together
   (BODY_LOD below 1); the studio's own parts (src/hd) are added on top. Everything comes back as the
   builders' flat arrays (p: positions, n: normals, c: colour + emissive, m: material id, all per vertex).
   ===================================================================================== */
/* the Classic face and tail are built in three dimensions by the studio (72_face): their decals are left off, and
   the builders' surface lookups (K) are kept for it. HD_ON false gives the game's own face and tail. */
let HD_ON=true;
function hdWrap(){if(FACES.__hd)return;FACES.__hd=1;const f=FACES.classic,t=TAILS.classic;
  FACES.classic=K=>{HDK=K;if(!HD_ON)f(K);};
  /* (the tail keeps the game's rubber step pad on the bumper top) */
  TAILS.classic=K=>{HDK=K;if(!HD_ON)t(K);else K.decal('T',RR2(K.D.B.bumperR+.005,K.L-.01,-.55,.55,.01),MM.RUBBER,.004);};
  /* (Salt Mini Plus: every face keeps the builders' surface lookups for the studio, and a car with its own Studio
     detail leaves off the decals and parts it builds again itself: HD_CARS[id].skip, e.g. {FACES:['pickup']}) */
  for(const [nm,T] of Object.entries({FACES,TAILS,FRONTS,REARS,EXTRAS,HOODS}))for(const k of Object.keys(T)){if(T===FACES&&k==='classic'||T===TAILS&&k==='classic')continue;
    const g=T[k];T[k]=K=>{HDK=K;const C=HD_ON&&HD_CUR&&HD_CUR.skip&&HD_CUR.skip[nm];if(C&&C.includes(k)){if(HD_CUR.keep&&HD_CUR.keep[nm+'.'+k])HD_CUR.keep[nm+'.'+k](K);return;}g(K);};}}
/* the build whose Studio detail is being made (its entry in HD_CARS), or null */
let HD_CUR=null;
function studioBuild(id,lod){hdWrap();HDS_MEMO.clear();HD_CUR=HD_ON&&HD_CARS[id]||null;
  const i=BUILDS.findIndex(b=>b.id===id),b=BUILDS[i];KIT_OUT.length=0;
  const t0=performance.now();BODY_LOD=lod;let s;try{s=buildSUV(b.look,b);}finally{BODY_LOD=1;}
  const w=buildWheel(b.look.tyre),wr=b.look.tyreR?buildWheel(b.look.tyreR):w,by=buildBay(b,s.D);
  const out={b,D:s.D,body:s.body,hood:s.hood,hide:s.hide,wheel:w,wheelR:wr,bay:by,ms:0,hd:{}};
  if(typeof hdBuild==='function')hdBuild(out);
  out.ms=performance.now()-t0;return out;
}
window.KIT={setHD:v=>{HD_ON=!!v;},studioBuild,hdk:()=>HDK,BUILDS,PAINTS,MAT,SM,HD_CARS,CARS:typeof CARS!=='undefined'?CARS:[]};
