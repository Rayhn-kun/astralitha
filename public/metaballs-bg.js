// MetaBalls OGL effect for Astralitha background (vanilla JS, no React)
// Requires: npm i ogl, then copy ogl.min.js to public/ or use CDN
// Theme: ungu (#a78bfa), biru gelap (#181028), hitam (#0a0a23)

// You can use CDN for ogl: https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.umd.js

(function(){
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/ogl@0.0.32/dist/ogl.umd.js';
  script.onload = metaballsInit;
  document.head.appendChild(script);

  function metaballsInit() {
    const { Renderer, Program, Mesh, Triangle, Transform, Vec3, Camera } = window.ogl;
    const container = document.createElement('div');
    container.id = 'metaballs-bg';
    container.style.position = 'fixed';
    container.style.zIndex = '0';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.background = 'linear-gradient(135deg,#181028 0%,#0a0a23 100%)';
    document.body.prepend(container);

    const dpr = window.devicePixelRatio || 1;
    const renderer = new Renderer({ dpr, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0,0,0,0);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 });
    camera.position.z = 1;
    const geometry = new Triangle(gl);

    function parseHexColor(hex) {
      const c = hex.replace('#','');
      const r = parseInt(c.substring(0,2),16)/255;
      const g = parseInt(c.substring(2,4),16)/255;
      const b = parseInt(c.substring(4,6),16)/255;
      return [r,g,b];
    }
    function fract(x){return x-Math.floor(x);}
    function hash31(p){let r=[p*0.1031,p*0.1030,p*0.0973].map(fract);const r_yzx=[r[1],r[2],r[0]];const dotVal=r[0]*(r_yzx[0]+33.33)+r[1]*(r_yzx[1]+33.33)+r[2]*(r_yzx[2]+33.33);for(let i=0;i<3;i++){r[i]=fract(r[i]+dotVal);}return r;}
    function hash33(v){let p=[v[0]*0.1031,v[1]*0.1030,v[2]*0.0973].map(fract);const p_yxz=[p[1],p[0],p[2]];const dotVal=p[0]*(p_yxz[0]+33.33)+p[1]*(p_yxz[1]+33.33)+p[2]*(p_yxz[2]+33.33);for(let i=0;i<3;i++){p[i]=fract(p[i]+dotVal);}const p_xxy=[p[0],p[0],p[1]];const p_yxx=[p[1],p[0],p[0]];const p_zyx=[p[2],p[1],p[0]];const result=[];for(let i=0;i<3;i++){result[i]=fract((p_xxy[i]+p_yxx[i])*p_zyx[i]);}return result;}

    const vertex = `#version 300 es\nprecision highp float;\nlayout(location = 0) in vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0.0, 1.0);\n}`;
    const fragment = `#version 300 es\nprecision highp float;\nuniform vec3 iResolution;\nuniform float iTime;\nuniform vec3 iMouse;\nuniform vec3 iColor;\nuniform vec3 iCursorColor;\nuniform float iAnimationSize;\nuniform int iBallCount;\nuniform float iCursorBallSize;\nuniform vec3 iMetaBalls[50];\nuniform float iClumpFactor;\nuniform bool enableTransparency;\nout vec4 outColor;\nconst float PI = 3.14159265359;\nfloat getMetaBallValue(vec2 c, float r, vec2 p) {vec2 d = p - c;float dist2 = dot(d, d);return (r * r) / dist2;}\nvoid main() {\n  vec2 fc = gl_FragCoord.xy;\n  float scale = iAnimationSize / iResolution.y;\n  vec2 coord = (fc - iResolution.xy * 0.5) * scale;\n  vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;\n  float m1 = 0.0;\n  for (int i = 0; i < 50; i++) {if (i >= iBallCount) break;m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);}\n  float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);\n  float total = m1 + m2;\n  float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));\n  vec3 cFinal = vec3(0.0);\n  if (total > 0.0) {float alpha1 = m1 / total;float alpha2 = m2 / total;cFinal = iColor * alpha1 + iCursorColor * alpha2;}\n  outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);\n}`;

    const [r1,g1,b1] = parseHexColor('#a78bfa'); // ungu
    const [r2,g2,b2] = parseHexColor('#7f5af0'); // biru
    const metaBallsUniform = [];
    for(let i=0;i<50;i++)metaBallsUniform.push(new Vec3(0,0,0));
    const program = new Program(gl,{
      vertex,fragment,
      uniforms:{
        iTime:{value:0},
        iResolution:{value:new Vec3(0,0,0)},
        iMouse:{value:new Vec3(0,0,0)},
        iColor:{value:new Vec3(r1,g1,b1)},
        iCursorColor:{value:new Vec3(r2,g2,b2)},
        iAnimationSize:{value:30},
        iBallCount:{value:15},
        iCursorBallSize:{value:2},
        iMetaBalls:{value:metaBallsUniform},
        iClumpFactor:{value:1},
        enableTransparency:{value:true},
      },
    });
    const mesh = new Mesh(gl,{geometry,program});
    const scene = new Transform();
    mesh.setParent(scene);
    const maxBalls=15;
    const ballParams=[];
    for(let i=0;i<maxBalls;i++){const idx=i+1;const h1=hash31(idx);const st=h1[0]*(2*Math.PI);const dtFactor=0.1*Math.PI+h1[1]*(0.4*Math.PI-0.1*Math.PI);const baseScale=5.0+h1[1]*(10.0-5.0);const h2=hash33(h1);const toggle=Math.floor(h2[0]*2.0);const radiusVal=0.5+h2[2]*(2.0-0.5);ballParams.push({st,dtFactor,baseScale,toggle,radius:radiusVal});}
    const mouseBallPos={x:0,y:0};let pointerInside=false;let pointerX=0;let pointerY=0;
    function resize(){const width=container.clientWidth;const height=container.clientHeight;renderer.setSize(width*dpr,height*dpr);gl.canvas.style.width=width+"px";gl.canvas.style.height=height+"px";program.uniforms.iResolution.value.set(gl.canvas.width,gl.canvas.height,0);}
    window.addEventListener('resize',resize);resize();
    function onPointerMove(e){const rect=container.getBoundingClientRect();const px=e.clientX-rect.left;const py=e.clientY-rect.top;pointerX=(px/rect.width)*gl.canvas.width;pointerY=(1-py/rect.height)*gl.canvas.height;}
    function onPointerEnter(){pointerInside=true;}
    function onPointerLeave(){pointerInside=false;}
    container.addEventListener('pointermove',onPointerMove);
    container.addEventListener('pointerenter',onPointerEnter);
    container.addEventListener('pointerleave',onPointerLeave);
    const startTime=performance.now();let animationFrameId;
    function update(t){animationFrameId=requestAnimationFrame(update);const elapsed=(t-startTime)*0.001;program.uniforms.iTime.value=elapsed;for(let i=0;i<maxBalls;i++){const p=ballParams[i];const dt=elapsed*0.3*p.dtFactor;const th=p.st+dt;const x=Math.cos(th);const y=Math.sin(th+dt*p.toggle);const posX=x*p.baseScale*1;const posY=y*p.baseScale*1;metaBallsUniform[i].set(posX,posY,p.radius);}let targetX,targetY;if(pointerInside){targetX=pointerX;targetY=pointerY;}else{const cx=gl.canvas.width*0.5;const cy=gl.canvas.height*0.5;const rx=gl.canvas.width*0.15;const ry=gl.canvas.height*0.15;targetX=cx+Math.cos(elapsed*0.3)*rx;targetY=cy+Math.sin(elapsed*0.3)*ry;}mouseBallPos.x+=(targetX-mouseBallPos.x)*0.05;mouseBallPos.y+=(targetY-mouseBallPos.y)*0.05;program.uniforms.iMouse.value.set(mouseBallPos.x,mouseBallPos.y,0);renderer.render({scene,camera});}
    animationFrameId=requestAnimationFrame(update);
  }
})();
