// Vanilla JS Particles Background (OGL-inspired, no React)
// Usage: <div id="particles-bg"></div> lalu <script src="./particles-bg.js"></script>
(function(){
  const container = document.getElementById('particles-bg');
  if (!container) return;
  // Set style agar full background
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '0';
  container.style.pointerEvents = 'none';

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'particles-bg-canvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Resize
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Particle config
  const PARTICLE_COUNT = 160;
  const COLORS = ['#fff', '#a78bfa', '#7f5af0'];
  const BASE_SIZE = 1.2;
  const SPEED = 0.18;
  const SPREAD = 0.9;

  // Particle state
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(window.innerWidth, window.innerHeight) * SPREAD * 0.5;
    const x = window.innerWidth/2 + Math.cos(angle) * radius;
    const y = window.innerHeight/2 + Math.sin(angle) * radius;
    particles.push({
      x, y,
      vx: (Math.random()-0.5)*SPEED,
      vy: (Math.random()-0.5)*SPEED,
      r: BASE_SIZE + Math.random()*1.5,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      alpha: 0.5 + Math.random()*0.5
    });
  }

  // Animation
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (const p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      p.x += p.vx;
      p.y += p.vy;
      // Bounce
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();
