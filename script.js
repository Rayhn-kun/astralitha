function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Optional: Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
});
document.getElementById('changeView').addEventListener('click', () => {
    const iframe = document.getElementById('splineFrame');
    iframe.src = "https://build.spline.design/aZHh7aLq4tFl-92DMFAx/scene.splineswift?view=alternative"; // Contoh perubahan view
});
