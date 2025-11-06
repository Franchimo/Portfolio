/* ============================================
   Enhanced Keyboard Navigation for Menu
   ============================================ */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = nav ? nav.querySelectorAll('a') : [];

const toggleMenu = (open) => {
  const isOpen = open !== undefined ? open : nav.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  
  // Animate hamburger menu
  if (isOpen) {
    navToggle.classList.add('active');
    navLinks[0]?.focus();
  } else {
    navToggle.classList.remove('active');
  }
};

if (navToggle && nav) {
  // Click handler
  navToggle.addEventListener('click', () => toggleMenu());
  
  // Keyboard support for toggle button
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggleMenu(false);
      navToggle.focus();
    }
  });
  
  // Arrow key navigation in menu
  navLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
      let target = null;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        target = navLinks[index + 1] || navLinks[0];
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        target = navLinks[index - 1] || navLinks[navLinks.length - 1];
      } else if (e.key === 'Home') {
        e.preventDefault();
        target = navLinks[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        target = navLinks[navLinks.length - 1];
      } else if (e.key === 'Escape') {
        e.preventDefault();
        toggleMenu(false);
        navToggle.focus();
      }
      
      if (target) {
        target.focus();
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && 
        !nav.contains(e.target) && 
        !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });
  
  // Close menu on Escape key globally
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggleMenu(false);
      navToggle.focus();
    }
  });
}

/* ============================================
   Contact Form Validation
   ============================================ */
const form = document.getElementById('contactForm');
if (form) {
  const statusEl = document.getElementById('formStatus');
  const setError = (name, msg) => {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    setError('name');
    setError('email');
    setError('message');
    statusEl.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let ok = true;
    if (!name) {
      setError('name', 'Please enter your name');
      ok = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Enter a valid email');
      ok = false;
    }
    if (!message) {
      setError('message', 'Please enter a message');
      ok = false;
    }

    if (!ok) return;

    statusEl.textContent = 'Sending…';
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.style.opacity = '1';
      statusEl.textContent = '✓ Thanks! Your message has been sent.';
      form.reset();
      setTimeout(() => {
        statusEl.textContent = '';
      }, 5000);
    }, 800);
  });
}

/* ============================================
   Reveal-on-Scroll Animations with Stagger
   ============================================ */
const addReveal = () => {
  const candidates = [
    '.hero .container',
    '.page-header',
    '.card',
    '.glass-card',
    '.projects-grid .project',
    '.skills-grid .card',
    '.hero-badge',
    '.hero-stats .stat'
  ];
  const all = document.querySelectorAll(candidates.join(','));
  all.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--stagger', String(i % 8));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  all.forEach((el) => io.observe(el));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addReveal);
} else {
  addReveal();
}

/* ============================================
   Typewriter Effect for Hero Heading
   ============================================ */
const typeEl = document.querySelector('.typewriter');
if (typeEl) {
  const phrases = (() => {
    try {
      return JSON.parse(typeEl.dataset.phrases || '[]');
    } catch {
      return [];
    }
  })();
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReduced && phrases.length > 0) {
    let i = 0;
    let j = 0;
    let deleting = false;
    const baseDelay = 80;
    const pause = 1200;
    
    const tick = () => {
      const current = phrases[i];
      typeEl.textContent = deleting ? current.slice(0, j--) : current.slice(0, j++);
      document.body.classList.toggle('typing', !deleting);
      
      if (!deleting && j > current.length + 1) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
      
      if (deleting && j < 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      
      setTimeout(tick, deleting ? baseDelay * 0.5 : baseDelay);
    };
    
    // Start after a delay
    setTimeout(tick, 1000);
  }
}

/* ============================================
   Enhanced Parallax Hero Glow
   ============================================ */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  
  let mouseX = 0.5;
  let mouseY = 0.5;
  let scrollY = 0;
  
  const updateParallax = () => {
    const xOffset = (mouseX - 0.5) * 30;
    const yOffset = (mouseY - 0.5) * 20;
    const scrollOffset = (scrollY - 0.5) * 25;
    
    hero.style.setProperty('--parallax-x', `${xOffset}px`);
    hero.style.setProperty('--parallax-y', `${yOffset}px`);
    hero.style.setProperty('--parallax-y-scroll', `${scrollOffset}px`);
  };
  
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
    updateParallax();
  });
  
  const handleScroll = () => {
    const rect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    scrollY = Math.max(0, Math.min(1, 
      (viewportHeight - rect.top) / (viewportHeight + rect.height)
    ));
    updateParallax();
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call
})();

/* ============================================
   Enhanced Button Ripple Effect
   ============================================ */
document.querySelectorAll('.btn').forEach((btn) => {
  btn.style.overflow = 'hidden';
  btn.style.position = 'relative';
  
  btn.addEventListener('click', (e) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.position = 'absolute';
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.4)';
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms ease';
    ripple.style.pointerEvents = 'none';
    ripple.style.mixBlendMode = 'screen';
    
    btn.appendChild(ripple);
    
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
      ripple.style.opacity = '0';
    });
    
    setTimeout(() => ripple.remove(), 800);
  });
});

/* ============================================
   Enhanced 3D Tilt on Cards
   ============================================ */
(() => {
  const cards = document.querySelectorAll('.glass-card, .card');
  if (cards.length === 0) return;
  
  const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mq.matches) return;
  
  const maxTilt = 12;
  const perspective = 1000;
  
  cards.forEach((card) => {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = `${perspective}px`;
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (-mouseY / rect.height) * maxTilt;
      const rotateY = (mouseX / rect.width) * maxTilt;
      
      card.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================
   Animated Background Particles
   ============================================ */
(() => {
  const heroParticles = document.querySelector('.hero-particles');
  if (!heroParticles) return;
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  
  // Create floating particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(58, 174, 216, ${Math.random() * 0.5 + 0.2})`;
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.pointerEvents = 'none';
    heroParticles.appendChild(particle);
  }
})();

/* ============================================
   Animate Skill Bars on Scroll
   ============================================ */
(() => {
  const skillBars = document.querySelectorAll('.skill-fill');
  if (skillBars.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
          fill.style.width = width;
          fill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 100);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach((bar) => observer.observe(bar));
})();

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#main-content') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

/* ============================================
   Add Loading Animation
   ============================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Animate hero elements
  const heroElements = document.querySelectorAll('.hero-badge, .hero h1, .lead, .hero-cta');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    }, i * 150);
  });
});

/* ============================================
   Enhanced Nav Toggle Animation
   ============================================ */
if (navToggle) {
  const spans = navToggle.querySelectorAll('span');
  navToggle.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    }
  });
}
