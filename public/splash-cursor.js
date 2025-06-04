// SplashCursor effect (vanilla JS version)
// Only runs inside #splash-cursor
(function() {
  const splashDiv = document.getElementById('splash-cursor');
  if (!splashDiv) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'fluid-cursor-canvas';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '50';
  canvas.style.pointerEvents = 'none';
  splashDiv.appendChild(canvas);

  // --- Fluid simulation code (adapted from SplashCursor) ---
  // ...existing code from SplashCursor, adapted for vanilla JS...
  // For brevity, only the structure is shown here. The full code will be inserted in the next step.
})();
