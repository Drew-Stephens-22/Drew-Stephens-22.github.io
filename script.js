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
  document.querySelector('.nav-logo').classList.remove('hidden');

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger section-specific animations
  if (sectionId === 'home') startCounters();
  if (sectionId === 'resume' || sectionId === 'certs') animateTimeline();
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
const navLogo   = document.querySelector('.nav-logo');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  navLogo.classList.toggle('hidden');
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
/* ---------- Copy to Clipboard ---------- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const textToCopy = btn.dataset.copy;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const icon = btn.querySelector('i');
      const originalClass = icon.className;
      
      // Change to checkmark
      icon.className = 'fas fa-check';
      btn.classList.add('copied');

      // Revert back after 2 seconds
      setTimeout(() => {
        icon.className = originalClass;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
});