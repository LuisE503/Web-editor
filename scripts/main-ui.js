/**
 * CodeCraft Studio - Main UI Script
 * Handles navigation, theme switching, language selector, and UI interactions
 */

(function() {
  'use strict';

  // ==========================================
  // THEME MANAGEMENT
  // ==========================================
  
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Load saved theme or use system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme, false);
  }
  
  // Set theme with optional animation
  function setTheme(theme, animate = true) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (animate) {
      document.body.classList.add('theme-transitioning');
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }
  }
  
  // Toggle theme
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // ==========================================
  // LANGUAGE SELECTOR
  // ==========================================
  
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langSelector = document.querySelector('.language-selector');
  
  if (langBtn && langDropdown) {
    // Toggle language dropdown
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelector.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langSelector.contains(e.target)) {
        langSelector.classList.remove('active');
      }
    });
    
    // Close dropdown on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        langSelector.classList.remove('active');
      }
    });
  }
  
  // ==========================================
  // MOBILE MENU
  // ==========================================
  
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Update icon
      const icon = mobileMenuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
  
  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  document.querySelectorAll('[class*="animate-"]').forEach(el => {
    observer.observe(el);
  });
  
  // ==========================================
  // NAVBAR SCROLL BEHAVIOR
  // ==========================================
  
  const mainNav = document.querySelector('.main-nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      mainNav.classList.remove('scroll-up');
      return;
    }
    
    if (currentScroll > lastScroll && !mainNav.classList.contains('scroll-down')) {
      // Scrolling down
      mainNav.classList.remove('scroll-up');
      mainNav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && mainNav.classList.contains('scroll-down')) {
      // Scrolling up
      mainNav.classList.remove('scroll-down');
      mainNav.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
  });
  
  // ==========================================
  // LOADING STATES
  // ==========================================
  
  // Remove loading class when page is loaded
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
  
  // ==========================================
  // COPY TO CLIPBOARD
  // ==========================================
  
  // Add copy functionality to code blocks
  document.querySelectorAll('pre code').forEach((codeBlock) => {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '<i class="fas fa-copy"></i>';
    button.setAttribute('aria-label', 'Copy code');
    
    const pre = codeBlock.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    button.addEventListener('click', async () => {
      const code = codeBlock.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-copy"></i>';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });
  
  // ==========================================
  // FORM VALIDATION
  // ==========================================
  
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
  
  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        
        // Remove error class on input
        input.addEventListener('input', () => {
          input.classList.remove('error');
        }, { once: true });
      }
    });
    
    return isValid;
  }
  
  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================
  
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K = Focus search (if exists)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Ctrl/Cmd + / = Open help modal (if exists)
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      const helpModal = document.getElementById('helpModal');
      if (helpModal) {
        helpModal.classList.add('active');
      }
    }
  });
  
  // ==========================================
  // TOOLTIPS
  // ==========================================
  
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    const tooltipText = trigger.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    trigger.appendChild(tooltip);
    
    trigger.addEventListener('mouseenter', () => {
      tooltip.classList.add('visible');
    });
    
    trigger.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
  
  // ==========================================
  // PROGRESS BAR
  // ==========================================
  
  // Create reading progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    
    progressBar.style.width = `${progress}%`;
  });
  
  // ==========================================
  // CONSOLE MESSAGE
  // ==========================================
  
  console.log(
    '%cCodeCraft Studio%c\\n' +
    'Made with ❤️ by developers for developers\\n' +
    'https://codecraft.studio',
    'font-size: 24px; font-weight: bold; color: #667eea;',
    'font-size: 14px; color: #64748b;'
  );
  
  console.log('💡 Tip: Press Ctrl+K to focus search');
  
  // ==========================================
  // INITIALIZE
  // ==========================================
  
  initTheme();
  
  console.log('✅ UI initialized successfully');
  
})();
