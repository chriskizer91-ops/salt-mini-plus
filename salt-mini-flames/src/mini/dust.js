/* =====================================================================================
   THE DUST. Salt dust off the flat, and tyre smoke off the blacktop, on a fixed budget: at most DUST_MAX soft puffs
   alive at once (fewer on a phone), all drawn in one batched call. When the budget is full new ones simply aren't
   made, so nothing can pile up and slow the page down.
   The rules are the game's own (Road Not Found + Traffic, 53_fx): each tyre on loose ground throws dust by how fast
   it spins against the ground (past 1.5 m/s) and, a little, by how fast it rolls (past 4 m/s); the puffs drift back
   and up, slow in the air, grow to five times their size and fade. Two additions for the salt flats: a tyre sliding
   sideways (a drift, a donut) throws dust the same as one spinning, and a tyre spinning hard on the blacktop
   (a burnout) throws white smoke.
   Nothing here touches the physics: it only reads where each tyre is and how it's moving.
   ===================================================================================== */
const COL={strip:[.78,.77,.74],smoke:[.66,.66,.68]};
const count=n=>Math.floor(n)+(Math.random()<n%1?1:0);

const VS=`attribute vec3 iPos;attribute vec4 iCol;attribute vec2 iSR;varying vec2 vUv;varying vec4 vCol;
void main(){vUv=position.xy+.5;vCol=iCol;vec4 mv=viewMatrix*vec4(iPos,1.);float c=cos(iSR.y),s=sin(iSR.y);
  mv.xy+=mat2(c,s,-s,c)*position.xy*iSR.x;gl_Position=projectionMatrix*mv;}`;
/* a soft round puff with a lumpy edge, lit a little from above (the sun is high) */
const FS=`uniform sampler2D uTex;varying vec2 vUv;varying vec4 vCol;
void main(){vec4 t=texture2D(uTex,vUv);float a=t.a*vCol.a;if(a<.003)discard;vec3 c=vCol.rgb*(.72+.36*vUv.y)*t.r;
  gl_FragColor=vec4(c*a,a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
/* the puff's picture: a soft disc broken up by a few blobs, so no two look like circles */
function puffTex(THREE){const N=64,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d');
  for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,r=Math.random()*N*.2,x=N/2+Math.cos(a)*r,y=N/2+Math.sin(a)*r,R=N*(.14+Math.random()*.2),gr=g.createRadialGradient(x,y,0,x,y,R);
    const l=Math.round(205+Math.random()*50);gr.addColorStop(0,`rgba(${l},${l},${l},.3)`);gr.addColorStop(.6,`rgba(${l},${l},${l},.12)`);gr.addColorStop(1,`rgba(${l},${l},${l},0)`);g.fillStyle=gr;g.fillRect(0,0,N,N);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.NoColorSpace;return t;}

export function makeDust(THREE,scene,{max=360}={}){
  const P=[],prev=[];
  const geo=new THREE.InstancedBufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([-.5,-.5,0, .5,-.5,0, .5,.5,0, -.5,.5,0],3));geo.setIndex([0,1,2,0,2,3]);
  const aPos=new THREE.InstancedBufferAttribute(new Float32Array(max*3),3),aCol=new THREE.InstancedBufferAttribute(new Float32Array(max*4),4),aSR=new THREE.InstancedBufferAttribute(new Float32Array(max*2),2);
  for(const a of [aPos,aCol,aSR])a.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('iPos',aPos);geo.setAttribute('iCol',aCol);geo.setAttribute('iSR',aSR);geo.instanceCount=0;
  const mat=new THREE.ShaderMaterial({uniforms:{uTex:{value:puffTex(THREE)}},vertexShader:VS,fragmentShader:FS,transparent:true,depthWrite:false,
    blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.OneMinusSrcAlphaFactor,blendEquation:THREE.AddEquation});
  const mesh=new THREE.Mesh(geo,mat);mesh.frustumCulled=false;mesh.renderOrder=4;scene.add(mesh);
  const add=(kind,x,y,z,vx,vy,vz,size,life,col,grow,alpha)=>{if(P.length>=max)return false;
    P.push({kind,x,y,z,vx,vy,vz,s:size,s0:size,life,max:life,col,grow,alpha,rot:Math.random()*6.283,spin:(Math.random()-.5)*.8});return true;};
  /* each tyre throws what it is on. wheels: the physics' own (contact, cp the contact point, f and r its forward and
     side, w its spin, R its radius, vl and vt its ground speed along and across, surf the ground) */
  function emit(dt,wheels,vel){const vx0=vel?vel[0]:0,vz0=vel?vel[2]:0,sp=Math.hypot(vx0,vz0),big=1+Math.min(1,sp/60)*1.4;
    /* (the share of the truck's own speed a new puff starts with: the wake drags it along, then the air slows it) */
    const wk=()=>.72+.22*Math.random();
    wheels.forEach((w,i)=>{const cp=w.cp,last=prev[i];prev[i]=w.contact?[cp[0],cp[1],cp[2]]:null;if(!w.contact)return;
      const spinL=w.w*w.R-w.vl,slide=Math.abs(w.vt||0),spin=Math.hypot(spinL,slide),roll=Math.abs(w.vl),f=w.f,r=w.r,sg=spinL>=0?1:-1;
      /* (spread along the line the tyre took since the last frame, so a fast truck leaves a trail and not a row of puffs) */
      const at=()=>{const k=last?Math.random():1;return [last?last[0]+(cp[0]-last[0])*k:cp[0],cp[1],last?last[2]+(cp[2]-last[2])*k:cp[2]];};
      if(w.surf==='asphalt'||w.surf==='concrete'){
        /* a burnout: white smoke once the tyre spins hard against the blacktop */
        const n=count(Math.max(0,spin-4)*2.2*dt);
        for(let k=0;k<n;k++){const p=at();add('smoke',p[0]+(Math.random()-.5)*.3,p[1]+.12,p[2]+(Math.random()-.5)*.3,
          -f[0]*spinL*.12+(Math.random()-.5)*.8+vx0*wk(),.4+Math.random()*.6,-f[2]*spinL*.12+(Math.random()-.5)*.8+vz0*wk(),(.25+Math.random()*.15)*big,2.4+Math.random()*1.2,COL.smoke,6,.22);}
        return;}
      const col=COL[w.surf]||COL.strip,n=count((Math.max(0,spin-1.5)*1.4+Math.max(0,roll-4)*.25)*dt);
      for(let k=0;k<n;k++){const p=at(),vs=(w.vt||0)*.25;add('dust',p[0]+(Math.random()-.5)*.4,p[1]+.1,p[2]+(Math.random()-.5)*.4,
        -f[0]*Math.abs(spinL)*.25*sg+r[0]*vs+(Math.random()-.5)+vx0*wk(),.6+Math.random()*.8,-f[2]*Math.abs(spinL)*.25*sg+r[2]*vs+(Math.random()-.5)+vz0*wk(),(.12+Math.random()*.1)*big,1.6+Math.random(),col,4,.38);}
    });}
  /* the puffs drift and slow in the air, rise a little, grow and fade; then into the batch */
  function step(dt){
    for(let i=P.length-1;i>=0;i--){const p=P[i];p.life-=dt;if(p.life<=0){P[i]=P[P.length-1];P.pop();continue;}
      const a=1-p.life/p.max,h=p.kind==='smoke'?1.1:1.6;p.vx*=1-dt*h;p.vz*=1-dt*h;p.vy=p.vy*(1-dt*1.2)+dt*(p.kind==='smoke'?.35:.25);p.s=p.s0*(1+a*p.grow);p.rot+=p.spin*dt;
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
    const n=P.length,pp=aPos.array,cc=aCol.array,sr=aSR.array;
    for(let i=0;i<n;i++){const p=P[i],f=p.life/p.max,al=p.alpha*Math.min(1,f*1.6)*Math.min(1,(1-f)*8);
      pp[i*3]=p.x;pp[i*3+1]=p.y;pp[i*3+2]=p.z;cc[i*4]=p.col[0];cc[i*4+1]=p.col[1];cc[i*4+2]=p.col[2];cc[i*4+3]=al;sr[i*2]=p.s*2;sr[i*2+1]=p.rot;}
    geo.instanceCount=n;mesh.visible=n>0;
    if(n){for(const a of [aPos,aCol,aSR]){a.clearUpdateRanges();a.addUpdateRange(0,n*a.itemSize);a.needsUpdate=true;}}}
  function clear(){P.length=0;prev.length=0;geo.instanceCount=0;mesh.visible=false;}
  return {emit,step,clear,get count(){return P.length;},max};
}
