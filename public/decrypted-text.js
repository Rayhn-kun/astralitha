// DecryptedText effect for HTML (vanilla JS, mirip React DecryptedText)
// Usage: <span class="decrypted-text" data-text="Teks Asli">Teks Asli</span>
(function(){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
  function scramble(text, revealed, availableChars) {
    return text.split('').map((c,i)=>{
      if (c===' '||revealed[i]) return c;
      return availableChars[Math.floor(Math.random()*availableChars.length)];
    }).join('');
  }
  function animateDecrypt(el, opts={}) {
    const text = el.dataset.text || el.textContent;
    const speed = opts.speed || 50;
    const maxIterations = opts.maxIterations || 10;
    const availableChars = (opts.characters||chars).split('');
    let revealed = Array(text.length).fill(false);
    let iter = 0;
    let interval = setInterval(()=>{
      for(let i=0;i<text.length;i++){
        if (text[i]===' ') revealed[i]=true;
        else if (!revealed[i] && Math.random()>0.7) revealed[i]=true;
      }
      el.textContent = scramble(text, revealed, availableChars);
      iter++;
      if (iter>=maxIterations || revealed.every(Boolean)) {
        el.textContent = text;
        clearInterval(interval);
      }
    }, speed);
  }
  document.querySelectorAll('.decrypted-text').forEach(el=>{
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter',()=>animateDecrypt(el));
  });
})();
