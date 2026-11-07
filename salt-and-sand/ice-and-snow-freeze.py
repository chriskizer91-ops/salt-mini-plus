"""Ice & Snow: Salt & Sand with the salt flats frozen into a lake, the white sands under snow, and Highway 40 glazed.
Reads the Salt & Sand page, writes the Ice & Snow page. Every change is an exact text swap that must match once."""
import sys

SRC, OUT = sys.argv[1], sys.argv[2]
s = open(SRC, encoding='utf-8').read()


def swap(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        raise SystemExit(f'expected {count} of:\n{old[:200]}\nfound {n}')
    s = s.replace(old, new)


# ---------------------------------------------------------------- the names
swap('<title>Redline County: Salt &amp; Sand (Studio 2)</title>',
     '<title>Redline County: Ice &amp; Snow (Studio 2)</title>')
swap('<small class="tagw">Salt &amp; Sand · Studio 2</small>',
     '<small class="tagw">Ice &amp; Snow · Studio 2</small>')
swap('(Drive ▶ takes it out onto the salt and the sand)',
     '(Drive ▶ takes it out onto the ice and the snow)')
swap('<h2>The salt clubs</h2><p class="hint" style="margin:0 0 8px">Top speed anywhere out on the salt flats.',
     '<h2>The ice clubs</h2><p class="hint" style="margin:0 0 8px">Top speed anywhere out on the frozen lake.')
swap("return Math.abs(z)<6?'Highway 40':z<0?'The salt flats':'The white sands';",
     "return Math.abs(z)<6?'Highway 40':z<0?'The frozen lake':'The snow dunes';")

# ---------------------------------------------------------------- the lake: the salt's look becomes ice
OLD_SALT_HEAD = '''      /* the salt flats (City Limits'): pale crust and tan clay in big soft patches, cracked into plates in places */
      if(sw>.004){float big=fbmS(wp*.0035),mid=vn(wp*.045);
#ifdef LEAN_D
        vec3 sc=mix(vec3(.42,.38,.32),vec3(.60,.585,.55),smoothstep(.32,.78,big*.85+mid*.3))*.93;
#else
        float fine=vn(wp*1.7);
        vec3 sc=mix(vec3(.42,.38,.32),vec3(.60,.585,.55),smoothstep(.32,.78,big*.85+mid*.3))*(.93+.1*fine*near(.6));
        float crack=smoothstep(.3,.62,fbmS(wp*.012+4.1))*near(.25);
        if(crack>0.&&DET>.3){float e=cellEdge(wp*.52);sc*=1.-(1.-smoothstep(.0,.05,e))*.26*crack;}
#endif
        sc=photoG(sc,T_SALT,wp);
        alb=mix(alb,sc,sw);gG*=1.-sw*.85;gw*=1.-sw;rw*=1.-sw;'''
NEW_SALT_HEAD = '''      /* (Ice & Snow) THE FROZEN LAKE, in place of the salt flats: black ice, clear and dark with the sky in it, grey-white
         ice in big soft patches, white cracks wandering across it (lines where slow noise crosses its middle, faded to
         their share once thinner than a pixel, so they don't crawl); snow over it in long drifts running
         with the wind (east and west), banked beside the road where the plough threw it, and over anything that rises
         off the lake. ig: how much is bare ice (its gloss is set after the ground's own, below) */
      float ig=0.;
      if(sw>.004){float big=fbmS(wp*.0035),mid=vn(wp*.045);
        float wi=smoothstep(.5,.86,big*.85+mid*.3);
        vec3 ic=mix(vec3(.011,.024,.038),vec3(.19,.24,.29),wi);
        /* (each crack about the same width in metres wherever it runs, jagged a little: the distance to the line is the
           noise's distance from its middle over how fast it is changing there) */
        float px=max(gFP,1e-3);vec2 wq=wp+(vn(wp*.3)-.5)*1.4;vec3 q1=vnd(wq*.03+vec2(3.7,1.9));
        float d1=abs(q1.x-.5)/max(length(q1.yz)*.03,1e-4),k1=(1.-smoothstep(.055,.055+px*1.5,d1))*min(1.,.055/px);
#ifndef LEAN_D
        float fine=vn(wp*.37);ic*=.88+.24*fine;
        vec3 q2=vnd(wq*.08+vec2(-5.1,8.3));float d2=abs(q2.x-.5)/max(length(q2.yz)*.08,1e-4);
        k1=max(k1,(1.-smoothstep(.035,.035+px*1.5,d2))*min(1.,.035/px)*.65);
#endif
        ic=mix(ic,vec3(.6,.66,.72),k1*(1.-wi*.5));
        float dr=fbmS(vec2(wp.x*.006,wp.y*.05)+vec2(2.3,7.7));
        float sn=smoothstep(.62,.76,dr+(mid-.5)*.25);
        sn=max(sn,1.-smoothstep(7.5,13.,abs(wp.y)+(mid-.5)*5.));
        sn=max(sn,smoothstep(.4,1.6,Pw.y));
        vec3 sc=mix(ic,vec3(.78,.82,.88)*(.92+.08*vn(wp*.012)),sn);
        ig=(1.-sn)*sw;
#ifndef LEAN_D
        /* (the ice not quite flat: a slow waver, so the sky and the car in it ripple a little) */
        {vec3 a=vnd(wp*.21);gG+=a.yz*.21*.05*ig;}
#endif
        alb=mix(alb,sc,sw);gG*=1.-sw*.85;gw*=1.-sw;rw*=1.-sw;'''
swap(OLD_SALT_HEAD, NEW_SALT_HEAD)

# ---------------------------------------------------------------- the dunes: the gypsum becomes snow
OLD_SAND = '''      /* (Salt & Sand) the white gypsum: cream white in big soft patches, the wind's ripples across it (crests running
         north and south, a few centimetres apart, faded out once they're smaller than a pixel) */
      if(dw>.004){vec3 sd=vec3(.80,.77,.70)*(.9+.12*vn(wp*.012)+.05*vn(wp*.37));
        float ph=dot(wp,vec2(.93,.37))*26.+vn(wp*.35)*5.;gG=mix(gG,vec2(.93,.37)*cos(ph)*.32*near(.09),dw);'''
NEW_SAND = '''      /* (Ice & Snow) the snow on the dunes, in place of the gypsum: white with a touch of blue, in big soft patches, the
         wind's ripples across it as on the sand (crests running north and south, faded out once smaller than a pixel) */
      if(dw>.004){vec3 sd=vec3(.8,.84,.89)*(.93+.07*vn(wp*.012)+.04*vn(wp*.37));
        float ph=dot(wp,vec2(.93,.37))*26.+vn(wp*.35)*5.;gG=mix(gG,vec2(.93,.37)*cos(ph)*.24*near(.09),dw);'''
swap(OLD_SAND, NEW_SAND)

OLD_SPEC = '''      spec=.03;shin=8.;
      if(mw>0.){'''
NEW_SPEC = '''      spec=.03;shin=8.;
      /* (Ice & Snow) bare ice glossy, the sky in it (and, off the phone's lean ground, the car too: the screen's
         reflections); snow a soft sheen */
      if(dw>.004){spec=mix(spec,.06,dw);shin=mix(shin,14.,dw);}
      if(ig>0.){spec=mix(spec,1.,ig);shin=mix(shin,700.,ig);
#ifndef LEAN_D
        ssr=max(ssr,ig*.9);
#endif
      }
      if(mw>0.){'''
swap(OLD_SPEC, NEW_SPEC)

# ---------------------------------------------------------------- Highway 40 glazed
OLD_ROAD = '''      alb=ac;spec=.15;shin=6.;em=0.;
    }'''
NEW_ROAD = '''      alb=ac;spec=.15;shin=6.;em=0.;
      /* (Ice & Snow) Highway 40 in winter: the blacktop glazed with ice, polished dark and glossy where the tyres run,
         packed snow between the tracks and on the crown, blown across in streaks, and white past the edge lines where
         the plough left it */
      {float lane=cls>3.5?3.65:3.2,q=mod(ad,lane),el=lane*(cls>4.5?2.:1.);
        float trk=max(exp(-pow((q-lane*.28)/.5,2.)),exp(-pow((q-lane*.72)/.5,2.)));
        float st=fbmS(vec2(wp.x*.045,wp.y*.5)+vec2(5.3,1.1));
        float sn=smoothstep(.42,.66,st+.2-.5*trk);
        sn=max(sn,smoothstep(el-.35,el+.45,ad+(n2-.5)*.6));
        vec3 pk=vec3(.6,.64,.69)*(.86+.18*n2)*(.92+.12*n3);
        alb=mix(ac*.92,pk,sn);spec=mix(.9,.07,sn);shin=mix(380.,12.,sn);
#ifndef LEAN_D
        ssr=max(ssr,(1.-sn)*.75);
#endif
      }
    }'''
swap(OLD_ROAD, NEW_ROAD)

# ---------------------------------------------------------------- the shoulders under snow
swap("""      alb=gc;spec=.05+.04*tr;shin=14.;em=0.;
    }""","""      alb=gc;spec=.05+.04*tr;shin=14.;em=0.;
      /* (Ice & Snow) the shoulders under snow: packed white, here and there a little of the stone showing through */
      {float sn=smoothstep(.25,.55,vn(wp*.6)*.6+vn(wp*2.3)*.4+.15);alb=mix(gc,vec3(.74,.78,.84)*(.9+.1*n2),sn);spec=mix(spec,.06,sn);}
    }""")

# ---------------------------------------------------------------- what the tyres throw: snow, not dust
swap("const FX_COL={sand:[.8,.77,.7],dirt:[.36,.22,.12],trail:[.4,.27,.15],strip:[.6,.57,.52],",
     "const FX_COL={sand:[.9,.92,.95],dirt:[.36,.22,.12],trail:[.4,.27,.15],strip:[.84,.87,.91],")
swap("gravel:[.46,.43,.38],asphalt:[.3,.3,.3],ruts:[.13,.085,.05]};",
     "gravel:[.82,.85,.88],asphalt:[.8,.83,.87],ruts:[.13,.085,.05]};")
swap("else if(surf!=='concrete'&&surf!=='asphalt'){const k0=surf==='rock'?.3:",
     "else if(surf!=='concrete'){const k0=surf==='asphalt'?.35:surf==='strip'?.5:surf==='rock'?.3:")

# ---------------------------------------------------------------- the light off the snow
swap("if(DYB.dunes){const A=DYB.air;E.fogDen*=A.fog;E.fogAmb=E.fogAmb.map(v=>v*A.fog);E.ambUp=E.ambUp.map(v=>v*A.amb);E.key*=A.key;}",
     "if(DYB.dunes){const A=DYB.air;E.fogDen*=A.fog;E.fogAmb=E.fogAmb.map(v=>v*A.fog);E.ambUp=E.ambUp.map(v=>v*A.amb);E.key*=A.key;}\n"
     "  /* (Ice & Snow) the light up off the snow: as bright as the ground's was and more, white with a touch of blue */\n"
     "  if(DYB.snow){const a=E.ambDn,l=a[0]*.2126+a[1]*.7152+a[2]*.0722;E.ambDn=[l*1.75,l*1.9,l*2.15];}")

# ---------------------------------------------------------------- the grip
OLD_GRIP = '''/* (every tread grips on the sand and the salt: the few City Limits didn't list get a dirt-like number) */
for(const t of Object.keys(TREAD_MU)){const m=TREAD_MU[t];if(m.sand==null)m.sand=+(m.dirt*.8).toFixed(2);if(m.salt==null)m.salt=+(m.strip*.95).toFixed(2);}'''
NEW_GRIP = OLD_GRIP + '''
/* =====================================================================================
   ICE & SNOW: Salt & Sand frozen. The salt flats are a frozen lake (the physics' "strip": glare ice), the white sands
   are snow over the dunes ("sand"), Highway 40 is glazed with ice ("asphalt") and its shoulders are snow over gravel.
   Everything else is Salt & Sand's own: the same land, the same cars, the same cameras.
   The grip: the world's share of each surface's dry grip, for every tyre on every driving level (and the Sim's).
   Against the game's own dry grip (the Dev panel's traction, 2 by default): the lake 0.13 of the salt's, the road 0.2
   of the tarmac's, the shoulders 0.3 of the gravel's, the snow 0.55 of the sand's (with the factory all-seasons about
   0.24, 0.44, 0.47 and 0.37, where dry tarmac is 2.2). Then by tread on the ice and the snow: all-seasons and all-terrains as they are,
   rally and mud tyres better in the snow, slicks and drag radials hopeless on both. The bay's dyno and its spec
   sheet are still the dry numbers (its own flat tarmac, not this world).
   Rolling: the ice rolls easier than the salt, the snow drags more than the sand.
   ===================================================================================== */
DYB.snow=true;
DYB.grip={strip:.13,asphalt:.2,gravel:.3,sand:.55};
const ICE_TREAD={perf:[.9,.85],slick:[.65,.55],drag:[.65,.55],runner:[.8,.7],mud:[.9,1.12],at:[1,1.08],gravel:[1.05,1.12],knobby:[.95,1.1],paddle:[.85,1.15],kart:[.65,.55],flat:[.8,.8]};
for(const [t,[i,n]] of Object.entries(ICE_TREAD)){const m=TREAD_MU[t];if(!m)continue;m.strip=+(m.strip*i).toFixed(3);m.sand=+(m.sand*n).toFixed(3);}
SURF_RR.strip=.013;SURF_RR.sand=.045;
RANCH.world.grip=DYB.grip;'''
swap(OLD_GRIP, NEW_GRIP)

# (the Dev panel's traction fit would put its own table in the world's place: keep the ice's under it)
swap("function devFit(t){if(!DEV)return;t.tune=DEV_T.car;t.applyTune();t.world.grip=DEV_GRIP;}",
     "function devFit(t){if(!DEV)return;t.tune=DEV_T.car;t.applyTune();const I=DYB.grip||{},g=Object.assign({},DEV_GRIP);for(const k in I)g[k]=(DEV_GRIP[k]??1)*I[k];t.world.grip=g;}")

open(OUT, 'w', encoding='utf-8').write(s)
print('written', OUT, len(s))
