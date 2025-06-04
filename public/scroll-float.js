// ScrollFloat effect for HTML (vanilla JS, mirip React+GSAP ScrollFloat)
// Usage: <h2 class="scroll-float">Judul Melayang</h2>
(function(){
  function splitTextToSpans(el) {
    if (!el.dataset.sfProcessed) {
      const text = el.textContent;
      el.innerHTML = '';
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        el.appendChild(span);
      });
      el.dataset.sfProcessed = '1';
    }
  }
  function animateOnScroll() {
    document.querySelectorAll('.scroll-float').forEach(el => {
      splitTextToSpans(el);
      const chars = el.querySelectorAll('.char');
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            chars.forEach((span, i) => {
              setTimeout(()=>{
                span.classList.add('char-in');
              }, i*40);
            });
          } else {
            chars.forEach(span => span.classList.remove('char-in'));
          }
        });
      }, { threshold: 0.2 });
      observer.observe(el);
    });
  }
  if (document.readyState !== 'loading') animateOnScroll();
  else document.addEventListener('DOMContentLoaded', animateOnScroll);
})();
