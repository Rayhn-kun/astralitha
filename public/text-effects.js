// Text & content animation effects (vanilla JS, global)
// Split Text, Blur, Shiny, Glitch, Scroll Reveal, Gradient, CountUp, etc.
(function(){
  // Split Text
  document.querySelectorAll('.split-text').forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    el.innerHTML = el.textContent.split('').map(c => `<span class="split-char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  });
  // Blur Text
  document.querySelectorAll('.blur-text').forEach(el => {
    el.style.filter = 'blur(2.5px)';
    el.style.transition = 'filter 0.5s';
    el.addEventListener('mouseenter',()=>el.style.filter='blur(0px)');
    el.addEventListener('mouseleave',()=>el.style.filter='blur(2.5px)');
  });
  // Shiny Text
  document.querySelectorAll('.shiny-text').forEach(el => {
    el.style.position = 'relative';
    if (!el.querySelector('.shiny-effect')) {
      const shine = document.createElement('span');
      shine.className = 'shiny-effect';
      el.appendChild(shine);
    }
  });
  // Glitch Text
  document.querySelectorAll('.glitch-text').forEach(el => {
    el.classList.add('glitch-anim');
  });
  // Gradient Text
  document.querySelectorAll('.gradient-text').forEach(el => {
    el.style.background = 'linear-gradient(90deg,#a78bfa,#7f5af0,#3A29FF)';
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.color = 'transparent';
    el.style.webkitTextFillColor = 'transparent';
  });
  // Scroll Reveal
  function revealOnScroll() {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight-60) el.classList.add('revealed');
      else el.classList.remove('revealed');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
  // Count Up
  document.querySelectorAll('.count-up').forEach(el => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseInt(el.textContent.replace(/\D/g,''),10)||0;
    let n = 0;
    function step() {
      n += Math.ceil((target-n)/8);
      el.textContent = n;
      if (n<target) requestAnimationFrame(step);
      else el.textContent = target;
    }
    step();
  });
  // Efek Circular Text
  window.circularText = function(el, radius=80) {
    const text = el.textContent;
    el.innerHTML = '';
    const deg = 360/text.length;
    text.split('').forEach((c,i)=>{
      const span = document.createElement('span');
      span.textContent = c;
      span.style.position = 'absolute';
      span.style.transform = `rotate(${i*deg}deg) translate(${radius}px) rotate(${-i*deg}deg)`;
      el.appendChild(span);
    });
    el.style.position = 'relative';
    el.style.height = (radius+24)+'px';
    el.style.display = 'inline-block';
  };
  // Efek Falling Text
  window.fallingText = function(el) {
    el.innerHTML = el.textContent.split('').map((c,i)=>`<span style="animation-delay:${i*0.04}s">${c}</span>`).join('');
  };
  // Efek ASCII Text
  window.asciiText = function(el, text) {
    el.classList.add('ascii-text');
    el.textContent = text;
  };
  // Efek Scrambled Text
  window.scrambledText = function(el, text) {
    el.classList.add('scrambled-text');
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*';
    let arr = text.split('');
    let i = 0;
    let interval = setInterval(()=>{
      el.textContent = arr.map((c,idx)=> idx<i?c:chars[Math.floor(Math.random()*chars.length)]).join('');
      if (i++>=arr.length) clearInterval(interval);
    }, 30);
  };
  // Efek Click Spark
  window.clickSpark = function(x, y, color='#a78bfa') {
    for(let i=0;i<12;i++){
      let d = document.createElement('div');
      d.style.position='fixed';d.style.left=x+'px';d.style.top=y+'px';d.style.width='6px';d.style.height='2px';d.style.background=color;d.style.borderRadius='2px';d.style.transform=`rotate(${i*30}deg) translateY(-8px)`;
      d.style.opacity='1';d.style.pointerEvents='none';d.style.transition='all 0.7s cubic-bezier(.23,1.01,.32,1)';
      document.body.appendChild(d);
      setTimeout(()=>{d.style.opacity='0';d.style.transform+= ' scaleX(2)';},10);
      setTimeout(()=>d.remove(),700);
    }
  };
  window.addEventListener('click',e=>window.clickSpark(e.clientX,e.clientY));
})();
