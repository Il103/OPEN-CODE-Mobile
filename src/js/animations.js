class LiquidGlassAnimations {
  constructor() {
    this.particles = [];
    this.animationFrame = null;
    this.isRunning = false;
  }

  init() {
    this.createParticles();
    this.startParticleAnimation();
    this.setupScrollGlow();
  }

  createParticles() {
    const container = document.getElementById('glass-particles');
    const count = 12;
    const shapes = ['circle', 'blob', 'ring'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = 40 + Math.random() * 120;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      if (shape === 'blob') {
        particle.style.borderRadius = '60% 40% 40% 60% / 40% 60% 50% 50%';
      } else if (shape === 'ring') {
        particle.style.background = 'transparent';
        particle.style.border = '1px solid rgba(255,255,255,0.05)';
      }

      particle.style.animationDuration = (15 + Math.random() * 20) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';

      const hue = Math.random() * 60 + 240;
      particle.style.background = shape === 'ring' ? 'transparent' :
        `radial-gradient(circle at 30% 30%, rgba(${hue}, ${100 + Math.random() * 100}, 255, 0.08), rgba(${hue}, ${100 + Math.random() * 100}, 255, 0.01))`;
      if (shape === 'ring') {
        particle.style.borderColor = `rgba(${hue}, ${150 + Math.random() * 105}, 255, 0.06)`;
      }

      container.appendChild(particle);
      this.particles.push({
        el: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        size
      });
    }
  }

  startParticleAnimation() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animateParticles();
  }

  animateParticles() {
    if (!this.isRunning) return;

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > 100) p.speedX *= -1;
      if (p.y < 0 || p.y > 100) p.speedY *= -1;
    });

    this.animationFrame = requestAnimationFrame(() => this.animateParticles());
  }

  stopParticleAnimation() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  setupScrollGlow() {
    const container = document.getElementById('chat-container');
    if (!container) return;

    let ticking = false;
    container.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = container.scrollHeight - container.clientHeight;
          const progress = maxScroll > 0 ? container.scrollTop / maxScroll : 1;
          container.style.setProperty('--scroll-progress', progress);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  static animateMessage(element, isUser = false) {
    element.classList.add('message-anim');
    element.classList.add(isUser ? 'user' : 'ai');
    element.style.opacity = '0';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }

  static liquidRipple(element) {
    element.classList.remove('liquid-ripple');
    void element.offsetWidth;
    element.classList.add('liquid-ripple');
  }

  static async typeText(element, text, speed = 20) {
    const words = text.split(/(?<=\s)/);
    element.textContent = '';
    element.style.display = 'inline';

    for (const word of words) {
      for (const char of word) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
  }

  static springAnimation(element, config = {}) {
    const {
      from = { transform: 'scale(0.8)', opacity: '0' },
      to = { transform: 'scale(1)', opacity: '1' },
      duration = 500
    } = config;

    element.animate([from, to], {
      duration,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
  }
}

window.LiquidGlass = LiquidGlassAnimations;
