/* =============================================
   NITHYASHREE R S — PORTFOLIO ANIMATIONS
   script.js
   ============================================= */

/* ─── 1. NAVBAR: shadow on scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
});

/* ─── 2. SCROLL REVEAL via IntersectionObserver ─── */
const revealEls = document.querySelectorAll(
  '.timeline-item, .work-card, .service-card, .skill-tag, .cta-inner, .section-header, .exp-col'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ─── 3. ANIMATED COUNTERS ─── */
function animateCounter(el, target, duration = 1600) {
  const isDecimal = target % 1 !== 0;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isDecimal
      ? value.toFixed(2)
      : Math.floor(value) + (progress < 1 ? '' : '+');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(2) : target + '+';
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');
const statsSection = document.querySelector('.hero-stats');
let countersStarted = false;
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statNums.forEach((el) => {
          const val = parseFloat(el.textContent.replace('+', '').trim());
          el.textContent = '0';
          animateCounter(el, val);
        });
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);
if (statsSection) statsObserver.observe(statsSection);

/* ─── 4. HERO HEADING: word-by-word fade in ─── */
const heroHeading = document.querySelector('.hero-heading');
if (heroHeading) {
  // Split plain text nodes into word spans, preserve <br> and <span>
  heroHeading.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach((word) => {
        if (word.trim()) {
          const span = document.createElement('span');
          span.classList.add('word-reveal');
          span.textContent = word;
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(word));
        }
      });
      node.replaceWith(frag);
    }
  });

  const wordSpans = heroHeading.querySelectorAll('.word-reveal');
  wordSpans.forEach((span, i) => {
    span.style.animationDelay = `${0.1 + i * 0.08}s`;
  });
}

/* ─── 5. EYEBROW & SUB TEXT: fade-up on load ─── */
['.hero-eyebrow', '.hero-sub', '.hero-buttons', '.hero-stats'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (el) {
    el.style.animationDelay = `${0.45 + i * 0.12}s`;
    el.classList.add('hero-stagger');
  }
});

/* ─── 6. SMOOTH ACTIVE NAV LINK on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-text-link');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('nav-text-link--active',
            link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ─── 7. SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 8. TILT effect on work cards ─── */
document.querySelectorAll('.work-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── 9. SKILL TAG: ripple on click ─── */
document.querySelectorAll('.skill-tag').forEach((tag) => {
  tag.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ─── 10. PROFILE IMAGE: shimmer until loaded ─── */
const profileImg = document.querySelector('.avatar-large img');
if (profileImg) {
  profileImg.closest('.avatar-large').classList.add('img-loading');
  profileImg.addEventListener('load', () => {
    profileImg.closest('.avatar-large').classList.remove('img-loading');
  });
}

/* ─── 11. CURSOR GLOW (desktop only) ─── */
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ─── 12. CONTACT FORM SUBMISSION ─── */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const submitBtn = document.getElementById('submit-btn');

    // UI Feedback
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    formStatus.style.display = 'none';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, subject, message })
      });

      const result = await response.json();

      if (response.ok) {
        formStatus.textContent = result.success || 'Message sent successfully!';
        formStatus.style.color = 'var(--green)';
        formStatus.style.display = 'block';
        contactForm.reset();
      } else {
        formStatus.textContent = result.error || 'Failed to send message. Please try again.';
        formStatus.style.color = '#ef4444'; // Red
        formStatus.style.display = 'block';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      formStatus.textContent = 'A network error occurred. Please try again later.';
      formStatus.style.color = '#ef4444';
      formStatus.style.display = 'block';
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}
