// Aurora background effect (vanilla JS, OGL-inspired, no React)
// Usage: <div id="aurora-bg"></div> lalu <script src="./aurora-bg.js"></script>
(function(){
  const container = document.getElementById('aurora-bg');
  if (!container) return;
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '1';
  container.style.pointerEvents = 'none';

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'aurora-bg-canvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Resize
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Aurora config (theme: #3A29FF, #7f5af0, #a78bfa, #181028)
  const colorStops = [
    [58/255, 41/255, 255/255],   // #3A29FF
    [127/255, 90/255, 240/255],  // #7f5af0
    [167/255, 139/255, 250/255]  // #a78bfa
  ];
  const blend = 0.45;
  const amplitude = 1.1;
  const speed = 0.18;

  // Aurora draw
  function lerp(a, b, t) { return a + (b - a) * t; }
  function colorRamp(stops, t) {
    if (t <= 0) return stops[0];
    if (t >= 1) return stops[stops.length-1];
    const idx = Math.floor(t * (stops.length-1));
    const frac = t * (stops.length-1) - idx;
    const c0 = stops[idx], c1 = stops[idx+1];
    return [
      lerp(c0[0], c1[0], frac),
      lerp(c0[1], c1[1], frac),
      lerp(c0[2], c1[2], frac)
    ];
  }
  function snoise(x, y) {
    // Simple 2D value noise (not Perlin, but enough for aurora)
    const s = Math.sin(x*12.9898 + y*78.233) * 43758.5453;
    return s - Math.floor(s);
  }
  function drawAurora(time) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = canvas.width, h = canvas.height;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const uvx = x/w, uvy = y/h;
        // Aurora height
        let n = snoise(uvx*2 + time*0.1, time*0.25);
        let height = Math.exp(n * 0.5 * amplitude);
        height = (uvy * 2.0 - height + 0.2);
        let intensity = 0.6 * height;
        // Blend
        const midPoint = 0.20;
        const auroraAlpha = Math.max(0, Math.min(1, (intensity - (midPoint-blend*0.5)) / (blend)));
        // Color
        const ramp = colorRamp(colorStops, uvx);
        const r = ramp[0]*intensity, g = ramp[1]*intensity, b = ramp[2]*intensity;
        ctx.globalAlpha = auroraAlpha*0.7;
        ctx.fillStyle = `rgb(${Math.floor(r*255)},${Math.floor(g*255)},${Math.floor(b*255)})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawAurora);
  }
  let t0 = performance.now();
  function animate() {
    const t = (performance.now() - t0) * speed * 0.001;
    drawAurora(t);
  }
  function loop() {
    animate();
    requestAnimationFrame(loop);
  }
  loop();
})();
