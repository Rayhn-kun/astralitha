document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Submission
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Thank you for contacting us!');
        form.reset();
    });

    // Smooth Scrolling for Navigation Links
    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth'});
        });
    });
});
// Adding a simple animation to the hero section on scroll
document.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero-content');
    const scrollPosition = window.scrollY;
    hero.style.opacity = 1 - (scrollPosition / 500); // Simple fade effect
});
// Smooth scroll to sections
function scrollToSection(id) {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message!');
});
// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollTopButton = document.getElementById('scroll-top');
    if (window.scrollY > 300) {
        scrollTopButton.style.display = 'block';
    } else {
        scrollTopButton.style.display = 'none';
    }
});
