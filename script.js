/* =============================================
   PORTFOLIO — script.js
   ============================================= */

/* ---------- Navigation ---------- */
function navigate(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  // Close mobile menu
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger section-specific animations
  if (sectionId === 'home') startCounters();
  if (sectionId === 'resume') animateTimeline();
}

// Wire up nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.section);
  });
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

/* ---------- Typed text animation ---------- */
const phrases = [
  'Software Developer',
  'Problem Solver',
  'Full-Stack Engineer',
  'Open Source Contributor',
  'Lifelong Learner',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let typedEl   = document.getElementById('typedText');

function typeLoop() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 55 : 90);
}

typeLoop();

/* ---------- Counter animation ---------- */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  document.querySelectorAll('.stat-number').forEach(el => {
    const target  = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const step     = Math.ceil(duration / target);
    let current    = 0;

    const timer = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, step);
  });
}

// Run counters on initial load (home is default active)
startCounters();

/* ---------- Project filter ---------- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);

      // Small stagger animation on show
      if (match) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn 0.35s ease forwards';
      }
    });
  });
});

/* ---------- Timeline entrance animation ---------- */
let timelineAnimated = false;

function animateTimeline() {
  if (timelineAnimated) return;
  timelineAnimated = true;

  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(() => {
      item.style.opacity   = '1';
      item.style.transform = 'translateX(0)';
    }, i * 150);
  });

  document.querySelectorAll('.cert-card').forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(15px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(() => {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, i * 100 + 200);
  });
}

/* ---------- Contact form ---------- */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// ── Replace this URL with your own Formspree endpoint ──
// Sign up free at https://formspree.io, create a form, and paste the
// action URL (e.g. https://formspree.io/f/abcdefgh) below.
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

function validateForm() {
  let valid = true;

  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  const nameErr    = document.getElementById('nameErr');
  const emailErr   = document.getElementById('emailErr');
  const messageErr = document.getElementById('messageErr');

  // Reset
  [name, email, message].forEach(el => el.classList.remove('invalid'));
  [nameErr, emailErr, messageErr].forEach(el => el.textContent = '');

  if (!name.value.trim()) {
    nameErr.textContent = 'Name is required.';
    name.classList.add('invalid');
    valid = false;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    emailErr.textContent = 'Email is required.';
    email.classList.add('invalid');
    valid = false;
  } else if (!emailRe.test(email.value)) {
    emailErr.textContent = 'Please enter a valid email address.';
    email.classList.add('invalid');
    valid = false;
  }

  if (!message.value.trim()) {
    messageErr.textContent = 'Message is required.';
    message.classList.add('invalid');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateForm()) return;

  // Show loading state
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  btnText.style.display    = 'none';
  btnLoading.style.display = 'inline-flex';
  submitBtn.disabled       = true;

  try {
    const data = new FormData(form);

    // If using Formspree, POST to the endpoint
    const res = await fetch(FORMSPREE_URL, {
      method:  'POST',
      body:    data,
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      form.reset();
      formSuccess.style.display = 'flex';
      setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
    } else {
      alert('Something went wrong. Please email me directly.');
    }
  } catch {
    // Network error fallback — open mail client
    const name    = document.getElementById('name').value;
    const email   = document.getElementById('email').value;
    const subject = document.getElementById('subject').value || 'Portfolio Contact';
    const message = document.getElementById('message').value;
    window.location.href =
      `mailto:you@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
  } finally {
    btnText.style.display    = 'inline-flex';
    btnLoading.style.display = 'none';
    submitBtn.disabled       = false;
  }
});

// Live validation on blur
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => {
    if (el.value.trim()) el.classList.remove('invalid');
  });
});

/* ---------- Back to top ---------- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 300);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Footer year ---------- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ---------- Skill cards entrance (Intersection Observer) ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(20px)';
  card.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
  observer.observe(card);
});
