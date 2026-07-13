/* ============================================
   PORTFOLIO JAVASCRIPT
   Animations | Interactions | Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. TYPING ANIMATION ──
    const typingElement = document.querySelector('.typing-text');
    const phrases = [
        'Computer Science Undergraduate',
        'AI & ML Enthusiast',
        'Problem Solver',
        'Aspiring Developer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            // Typing
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                // Pause at end of word
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }
            setTimeout(typeEffect, 80);
        } else {
            // Deleting
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 500);
                return;
            }
            setTimeout(typeEffect, 40);
        }
    }

    if (typingElement) {
        setTimeout(typeEffect, 1000);
    }


    // ── 2. INTERSECTION OBSERVER — GENERAL ANIMATIONS ──
    const animatedElements = document.querySelectorAll('.animate-in');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((el) => {
        animationObserver.observe(el);
    });


    // ── 3. SKILL BAR ANIMATION ──
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    skillBars.forEach((bar) => {
        skillObserver.observe(bar);
    });


    // ── 4. ANIMATED COUNTERS ──
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.round(easedProgress * target);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });


    // ── 5. SMOOTH SCROLL NAVIGATION ──
    const navLinksAll = document.querySelectorAll('a[href^="#"]');
    const navLinksContainer = document.getElementById('navLinks');

    navLinksAll.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const targetSection = document.querySelector(href);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                }
                const hamburger = document.getElementById('hamburger');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        });
    });


    // ── 6. MOBILE HAMBURGER MENU ──
    const hamburger = document.getElementById('hamburger');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }


    // ── 7. NAVBAR SCROLL EFFECT ──
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Run once on load


    // ── 8. ACTIVE NAV LINK HIGHLIGHTING ──
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function highlightActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });
    highlightActiveNav();


    // ── 9. PARALLAX FLOATING ORBS ──
    const orbs = document.querySelectorAll('.floating-orb');
    let mouseX = 0;
    let mouseY = 0;
    let orbAnimFrameId = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!orbAnimFrameId) {
            orbAnimFrameId = requestAnimationFrame(updateOrbs);
        }
    }, { passive: true });

    function updateOrbs() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (mouseX - centerX) / 80;
        const deltaY = (mouseY - centerY) / 80;

        orbs.forEach((orb, index) => {
            const factor = (index + 1) * 0.4;
            const x = deltaX * factor;
            const y = deltaY * factor;
            orb.style.transform += ''; // Keep CSS animation
            orb.style.marginLeft = `${x}px`;
            orb.style.marginTop = `${y}px`;
        });

        orbAnimFrameId = null;
    }


    // ── 10. STAGGERED ANIMATION DELAYS ──
    const staggerContainers = document.querySelectorAll('.stagger-children');

    staggerContainers.forEach((container) => {
        const children = container.querySelectorAll('.animate-in');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.12}s`;
        });
    });


    // ── 11. SCROLL PROGRESS INDICATOR ──
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();


    // ── 12. CARD TILT EFFECT (subtle) ──
    const cards = document.querySelectorAll('.project-card, .profile-card, .cert-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
