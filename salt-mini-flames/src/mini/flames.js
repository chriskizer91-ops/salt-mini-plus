/* =====================================================================================
   THE FLAMES. Fire out of the exhaust tips, drawn at each tip the game's builder lists (D.tips: where the outlet
   is, which way it points, how big it is). Each tip gets:
   - an outer flame: a teardrop of fire along the pipe's line, its edges soft (bright where you look into it, gone
     at the rim), licking tongues from a scrolling noise, white-yellow at the root through orange to red at the tip;
   - an inner core: a smaller, hotter blue-white cone right at the outlet;
   - a glow: a soft orange halo round the outlet, the way a flame looks brighter than the day around it.
   One orange light at the tips lights the bumper and the ground under it while there's fire.
   Strength k (0 none, 1 a full flame, up to 1.5 on a big bang) and the length come from the page each frame;
   everything here is the look. Nothing here touches the physics or the sound.
   ===================================================================================== */
const NOISE=`
float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return .55*vn(p)+.3*vn(p*2.07+3.1)+.15*vn(p*4.13+7.7);}`;
const VS=`varying vec3 vL;varying vec3 vN;varying vec3 vV;
void main(){vL=position;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`;
/* the outer flame: along +X from 0 (the outlet) to 1 (the tip of the flame). The noise is laid in metres (uLen and
   uWid are the flame's length and width), so it stays the same size of turbulence however the flame is stretched */
const FS_OUTER=`uniform float uT,uK,uSeed,uLen,uWid;varying vec3 vL;varying vec3 vN;varying vec3 vV;${NOISE}
void main(){
  float t=clamp(vL.x,0.,1.),face=abs(dot(normalize(vN),normalize(vV)));
  /* the gas runs away from the pipe: the noise scrolls out along it */
  vec3 w=vec3(vL.x*uLen,vL.y*uWid,vL.z*uWid),q=w*vec3(6.,13.,13.)-vec3(uT*15.,0.,0.)+uSeed;
  float n=fbm(q),n2=fbm(q*2.3-vec3(uT*8.,0.,0.));
  /* the body: thick in the middle of what you see, thin at the rim; tongues eat into it, more the further out */
  float dens=pow(face,2.2)*(1.-t*.8);
  float cut=dens+(n-.5)*.95+(n2-.5)*.45-.1+.08*uK-t*.18;
  float a=smoothstep(0.,.45,cut)*(1.-smoothstep(.72,1.,t));
  /* the heat: pale yellow where it's thickest near the root, yellow, orange, then red at the tongues' ends */
  float h=clamp(dens*1.15*(.5+.75*n)+(1.-t)*.22,0.,1.2);
  vec3 c=mix(vec3(.5,.05,.01),vec3(1.,.26,.03),smoothstep(.08,.35,h));c=mix(c,vec3(1.,.56,.1),smoothstep(.35,.62,h));c=mix(c,vec3(1.,.88,.55),smoothstep(.66,.95,h));
  gl_FragColor=vec4(c*a*uK*(.6+.8*h),min(1.,a*min(uK,1.)*.55));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
/* the core: the hottest part, right at the outlet, blue at its edge and near white in it */
const FS_CORE=`uniform float uT,uK,uSeed,uLen,uWid;varying vec3 vL;varying vec3 vN;varying vec3 vV;${NOISE}
void main(){
  float t=clamp(vL.x,0.,1.),face=abs(dot(normalize(vN),normalize(vV)));
  float n=fbm(vec3(vL.x*uLen,vL.y*uWid,vL.z*uWid)*vec3(8.,18.,18.)-vec3(uT*20.,0.,0.)+uSeed);
  float a=smoothstep(.1,.55,pow(face,1.6)*(1.05-t)+(n-.5)*.55)*(1.-smoothstep(.55,1.,t));
  vec3 c=mix(vec3(.25,.45,1.),vec3(1.,.9,.72),smoothstep(.5,.95,face*(1.-t*.7)));
  gl_FragColor=vec4(c*a*uK*.8,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
/* a teardrop turned round the X axis: the pipe's width at the outlet, out to about three times it, to a point */
function flameGeo(THREE,bulge){const pts=[],N=24;
  for(let i=0;i<=N;i++){const y=i/N,r=(1+bulge*Math.sin(Math.PI*Math.pow(y,.55)))*Math.pow(1-y,.42);pts.push(new THREE.Vector2(Math.max(r,1e-3),y));}
  const g=new THREE.LatheGeometry(pts,20);g.rotateZ(-Math.PI/2);return g;}
function glowTex(THREE){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(255,160,80,.85)');gr.addColorStop(.2,'rgba(255,120,40,.5)');gr.addColorStop(.5,'rgba(255,80,20,.16)');gr.addColorStop(1,'rgba(255,60,10,0)');
  g.fillStyle=gr;g.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}

export function makeFlames(THREE,parent){
  const add={transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.FrontSide,fog:false};
  /* (the outer flame adds its light and covers a little of what's behind it, so it stays orange in front of a bright
     sky instead of adding up to white) */
  const over={blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.OneMinusSrcAlphaFactor,blendEquation:THREE.AddEquation};
  const outerG=flameGeo(THREE,2.1),coreG=flameGeo(THREE,.9),gTex=glowTex(THREE);
  /* one light for every tip, made now so the materials are built with it from the first frame (adding a light later
     would make every material build itself again); dark until there's fire */
  const light=new THREE.PointLight(0xff7a2c,0,7,2);light.castShadow=false;parent.add(light);
  const tips=[];let seed=0;
  function setTips(list,root){for(const T of tips)T.g.removeFromParent();tips.length=0;if(!list||!list.length)return;
    const lp=new THREE.Vector3();
    for(const tp of list){const g=new THREE.Group(),d=new THREE.Vector3(...tp.d).normalize();g.position.set(...tp.p);
      g.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),d);
      const um=()=>({uT:{value:0},uK:{value:0},uSeed:{value:(seed++)*13.7},uLen:{value:1},uWid:{value:.1}});
      const outer=new THREE.Mesh(outerG,new THREE.ShaderMaterial(Object.assign({uniforms:um(),vertexShader:VS,fragmentShader:FS_OUTER},add,over)));
      const core=new THREE.Mesh(coreG,new THREE.ShaderMaterial(Object.assign({uniforms:um(),vertexShader:VS,fragmentShader:FS_CORE},add)));
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:gTex,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false,color:0xffffff}));
      for(const m of [outer,core,glow]){m.castShadow=m.receiveShadow=false;m.frustumCulled=false;m.renderOrder=5;g.add(m);}
      g.visible=false;root.add(g);tips.push({g,outer,core,glow,r:tp.r||.04,d,p:new THREE.Vector3(...tp.p),wob:Math.random()*10});lp.add(new THREE.Vector3(...tp.p).addScaledVector(d,.3));}
    light.position.copy(lp.divideScalar(list.length));}
  /* k: strength; len: this burst's length (about .6 to 1.3); speed in m/s (the air pushes the fire back and thins it) */
  function update(t,k,len,speed){
    const on=k>.025;light.intensity=on?Math.min(1.5,k)*8*(.8+.4*Math.random()):0;
    for(const T of tips){T.g.visible=on;if(!on)continue;
      const kk=Math.min(1.5,k),fl=Math.sin(t*37+T.wob)*.08+Math.sin(t*23.1+T.wob*1.7)*.06+(Math.random()-.5)*.16,
        air=Math.min(1,speed/45),L=(.18+.95*Math.pow(kk,.8)*len)*(1+fl)*(1+.45*air),W=T.r*(1.05+.55*kk)*(1-.3*air)*(1+fl*.5);
      T.outer.scale.set(L,W,W);T.core.scale.set(L*.42,T.r*.95,T.r*.95);
      for(const [m,l,w] of [[T.outer,L,W],[T.core,L*.42,T.r*.95]]){const u=m.material.uniforms;u.uT.value=t;u.uK.value=Math.min(1.2,kk);u.uLen.value=l;u.uWid.value=w;}
      const gs=(.22+.42*kk)*(1+fl);T.glow.scale.set(gs,gs,1);T.glow.position.set(.06+L*.15,0,0);T.glow.material.opacity=Math.min(.8,.2+.35*kk);
      /* (slow, the hot gas lifts a little; fast, the air lays it flat behind) */
      T.g.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),T.d.clone().add(new THREE.Vector3(0,.12*(1-air),0)).normalize());}}
  return {setTips,update,light,get tips(){return tips;}};
}
