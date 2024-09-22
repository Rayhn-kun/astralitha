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
// Function to scroll to the top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to show/hide the scroll button
function toggleScrollTopButton() {
    const scrollTopButton = document.getElementById('scroll-top');
    if (window.scrollY > 200) {  // Tampilkan saat scroll lebih dari 200px
        scrollTopButton.classList.add('show');
    } else {
        scrollTopButton.classList.remove('show');
    }
}
// Event listener for scrolling
window.addEventListener('scroll', toggleScrollTopButton);
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const colors = ['#663399', '#00CED1', '#FFFFFF']; // Warna sesuai tema Astralitha

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
        if (this.alpha > 0.1) this.alpha -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.3) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function createParticles(e) {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)]));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', createParticles);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)]));
    }
});

animate();
(function() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = [];

    function createStar() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.5
        };
    }

    function initStars() {
        stars = []; // Reset the stars array
        for (let i = 0; i < 100; i++) {
            stars.push(createStar());
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.7;
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars(); // Reinitialize stars on resize
    });

    initStars();
    animateStars();
})();
