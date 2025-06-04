// TiltedCard vanilla JS
// Usage: panggil createTiltedCard(options) dan append ke DOM
function createTiltedCard({
  imageSrc,
  altText = '',
  captionText = '',
  overlayText = '',
  width = 300,
  height = 300,
  rotateAmplitude = 12,
  scaleOnHover = 1.2
}) {
  const figure = document.createElement('figure');
  figure.className = 'tilted-card-figure';
  figure.style.width = width + 'px';
  figure.style.height = height + 'px';

  const inner = document.createElement('div');
  inner.className = 'tilted-card-inner';
  inner.style.width = width + 'px';
  inner.style.height = height + 'px';

  const img = document.createElement('img');
  img.className = 'tilted-card-img';
  img.src = imageSrc;
  img.alt = altText;
  img.style.width = width + 'px';
  img.style.height = height + 'px';

  const overlay = document.createElement('div');
  overlay.className = 'tilted-card-overlay';
  overlay.innerHTML = overlayText;

  inner.appendChild(img);
  inner.appendChild(overlay);
  figure.appendChild(inner);

  if (captionText) {
    const caption = document.createElement('figcaption');
    caption.className = 'tilted-card-caption';
    caption.textContent = captionText;
    figure.appendChild(caption);
  }

  // Tilt effect
  figure.addEventListener('mousemove', function(e) {
    const rect = figure.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -rotateAmplitude;
    const rotateY = ((x - centerX) / centerX) * rotateAmplitude;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`;
  });
  figure.addEventListener('mouseleave', function() {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
  figure.addEventListener('mouseenter', function() {
    inner.style.transition = 'transform 0.18s cubic-bezier(.23,1.01,.32,1)';
    setTimeout(() => { inner.style.transition = ''; }, 200);
  });

  return figure;
}
// Untuk penggunaan, lihat index.html
