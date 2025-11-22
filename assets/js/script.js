document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTyping();
    initScrollAnimations();
    initTilt();
    initNavbar();
    initTechStreams();
});

/* --- 1. Particle Network Background --- */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 80; // Number of nodes
    const connectionDistance = 150;
    const mouseDistance = 200;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#10b981' : '#4ade80'; // Emerald or Lime
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(148, 163, 184, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Mouse interaction
            if (mouse.x != null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const directionX = forceDirectionX * force * 3;
                    const directionY = forceDirectionY * force * 3;

                    particles[i].x += directionX;
                    particles[i].y += directionY;
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/* --- 2. Typing Effect --- */
function initTyping() {
    const txtElement = document.querySelector('.txt-type');
    if (!txtElement) return;
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    
    let txt = '';
    let wordIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const current = wordIndex % words.length;
        const fullTxt = words[current];

        if (isDeleting) {
            txt = fullTxt.substring(0, txt.length - 1);
            typeSpeed = 50; // Faster deletion
        } else {
            txt = fullTxt.substring(0, txt.length + 1);
            typeSpeed = 150; // Slower typing
        }

        txtElement.innerHTML = txt;

        if (!isDeleting && txt === fullTxt) {
            typeSpeed = parseInt(wait); // Pause at end
            isDeleting = true;
        } else if (isDeleting && txt === '') {
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --- 3. Scroll Animations --- */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .timeline-item, .about-grid, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

/* --- 4. 3D Tilt Effect for Cards --- */
function initTilt() {
    const cards = document.querySelectorAll('.card[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            const centerX = cardRect.left + cardWidth / 2;
            const centerY = cardRect.top + cardHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / (cardHeight / 2)) * -10; // Max rotation deg
            const rotateY = (mouseX / (cardWidth / 2)) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/* --- 5. Navbar & Mobile Menu --- */
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when link clicked
    if (links) {
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

/* --- 6. Infinite Tech Streams --- */
function initTechStreams() {
    const streams = document.querySelectorAll('.stream-container');

    streams.forEach(stream => {
        const track = stream.querySelector('.stream-track');
        const items = Array.from(track.children);
        
        // Clone items to ensure seamless scrolling
        const contentWidth = track.scrollWidth;
        const screenWidth = window.innerWidth;
        const cloneCount = Math.ceil(screenWidth / contentWidth) + 1;

        for (let i = 0; i < cloneCount; i++) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });
        }

        // Set animation details
        const direction = stream.getAttribute('data-direction') || 'left';
        const speed = stream.getAttribute('data-speed') || 40;
        
        const totalWidth = track.scrollWidth;
        const duration = (totalWidth / 1000) * speed;

        track.style.animationName = direction === 'left' ? 'scrollLeft' : 'scrollRight';
        track.style.animationDuration = `${duration}s`;
        track.style.animationTimingFunction = 'linear';
        track.style.animationIterationCount = 'infinite';
    });
}
