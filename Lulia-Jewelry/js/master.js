document.addEventListener('DOMContentLoaded', function () {
  const scrollLinks = document.querySelectorAll('.scroll-link');
  const orderNow = document.getElementById('orderNow');
  const contactUs = document.getElementById('contactUs');
  const feedback = document.getElementById('contactFeedback');

  function smoothScroll(target) {
    const section = document.querySelector(target);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = link.getAttribute('href');
      smoothScroll(target);
      scrollLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  if (orderNow) {
    orderNow.addEventListener('click', () => smoothScroll('#products'));
  }

  if (contactUs) {
    contactUs.addEventListener('click', () => smoothScroll('#contact'));
  }

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      document.querySelector('.site-header').classList.toggle('active-nav');
      mainNav.classList.toggle('open');
    });
  }

  const aiToggle = document.getElementById('aiToggle');
  const aiPanel = document.getElementById('aiPanel');
  const aiClose = document.getElementById('aiClose');
  const aiMessages = document.getElementById('aiMessages');
  const aiForm = document.getElementById('aiForm');
  const aiInput = document.getElementById('aiInput');

  const aiResponses = {
    "hi": "Hello! I can help you with product details, delivery, or contact info.",
    "products": "Check out our Featured Pieces section and click on what inspires you.",
    "shipping": "Standard shipping is 3-5 days, expedited available at checkout.",
    "order": "You can place an order by clicking 'Order Now' and filling out the form. I'll support you step by step.",
    "contact": "Use the contact form at the bottom of the page or email hello@lulia-jewelry.com.",
    "default": "Tell me what you need and I’ll assist. For example: 'I need help with a ring size'."
  };

  function appendAiMessage(text, isUser = false) {
    if (!aiMessages) return;
    const msg = document.createElement('div');
    msg.className = `ai-message ${isUser ? 'ai-user' : 'ai-bot'}`;
    msg.textContent = text;
    aiMessages.appendChild(msg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  if (aiToggle && aiPanel) {
    aiToggle.addEventListener('click', () => {
      aiPanel.classList.toggle('hidden');
    });
  }

  if (aiClose && aiPanel) {
    aiClose.addEventListener('click', () => {
      aiPanel.classList.add('hidden');
    });
  }

  if (aiForm && aiInput) {
    aiForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = aiInput.value.trim();
      if (!question) return;
      appendAiMessage(question, true);
      aiInput.value = '';
      let key = question.toLowerCase();
      if (key.includes('product')) key = 'products';
      else if (key.includes('ship')) key = 'shipping';
      else if (key.includes('order')) key = 'order';
      else if (key.includes('contact')) key = 'contact';
      else if (key.includes('hi') || key.includes('hello')) key = 'hi';
      const response = aiResponses[key] || aiResponses.default;
      setTimeout(() => appendAiMessage(response, false), 500);
    });
  }

  function setTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀' : '🌙';
    }
  }

  const savedTheme = localStorage.getItem('luliaTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
      setTheme(nextTheme);
      localStorage.setItem('luliaTheme', nextTheme);
    });
  }

  const heroBg = document.querySelector('.hero-bg');
  const heroImages = [
    'img/BG.jpg',
    'img/BG1.jpg',
    'img/BG2.jpg',
    'img/BG3.jpg',
    'img/BG4.jpg',
  ];
  let heroImageIndex = 0;

  function setHeroBackground(index) {
    if (!heroBg) return;
    heroBg.style.backgroundImage = `url('${heroImages[index]}')`;
  }

  if (heroBg && heroImages.length) {
    setHeroBackground(heroImageIndex);
    heroBg.classList.add('active');

    setInterval(() => {
      heroBg.classList.remove('active');

      setTimeout(() => {
        heroImageIndex = (heroImageIndex + 1) % heroImages.length;
        setHeroBackground(heroImageIndex);
        heroBg.classList.add('active');
      }, 800);
    }, 7000);
  }

  const revealItems = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.25 }
  );

  revealItems.forEach((item) => observer.observe(item));

  const form = document.getElementById('contactForm');
  if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    function clearValidation() {
      [nameInput, emailInput, messageInput].forEach((field) => {
        field.classList.remove('input-invalid');
      });
      feedback.textContent = '';
      feedback.style.color = '#466a4f';
    }

    [nameInput, emailInput, messageInput].forEach((field) => {
      field.addEventListener('input', clearValidation);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      clearValidation();

      const missing = [];
      if (!nameInput.value.trim()) missing.push('Name');
      if (!emailInput.value.trim()) missing.push('Email');
      if (!messageInput.value.trim()) missing.push('Message');

      if (missing.length > 0) {
        missing.forEach((fieldName) => {
          const field = {
            Name: nameInput,
            Email: emailInput,
            Message: messageInput,
          }[fieldName];
          field.classList.add('input-invalid');
        });

        feedback.textContent = `Please complete required fields: ${missing.join(', ')}.`;
        feedback.style.color = '#b00020';
        return;
      }

      feedback.textContent = 'Thank you! We will contact you soon.';
      feedback.style.color = '#466a4f';
      setTimeout(() => {
        feedback.textContent = '';
        form.reset();
      }, 2500);
    });
  }
});
