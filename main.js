// ===================================
// Main JavaScript - Core Functionality
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initScrollProgress();
  initBackToTop();
  initMobileMenu();
  initScrollAnimations();
});

// Navbar scroll effect
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Scroll progress bar
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Back to top button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.getElementById('navbarToggle');
  const menu = document.querySelector('.navbar-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function() {
    this.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

// Scroll-triggered animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// Toast Notification System
// ===================================
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-message">${message}</div>
    <div class="toast-close" onclick="this.parentElement.remove()">✕</div>
  `;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===================================
// Utility Functions
// ===================================

// Format number with K, M suffix
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Local Storage helpers
const storage = {
  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};

// ===================================
// Counter Animation
// ===================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);
    
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===================================
// Typing Effect
// ===================================
function typeText(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// ===================================
// Tab System
// ===================================
function initTabs(tabContainer) {
  const tabItems = tabContainer.querySelectorAll('.tab-item');
  const tabIndicator = tabContainer.querySelector('.tab-indicator');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabItems.length || !tabPanels.length) return;

  function updateIndicator(item) {
    tabIndicator.style.left = item.offsetLeft + 'px';
    tabIndicator.style.width = item.offsetWidth + 'px';
  }

  tabItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      // Remove active from all tabs
      tabItems.forEach(tab => tab.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // Add active to clicked tab
      this.classList.add('active');
      updateIndicator(this);

      // Show corresponding panel
      const panelId = this.dataset.tab;
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Initialize indicator position
  const activeTab = tabContainer.querySelector('.tab-item.active');
  if (activeTab) {
    setTimeout(() => updateIndicator(activeTab), 100);
  }
}

// ===================================
// Form Validation
// ===================================
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('.form-input[required]');

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      input.classList.remove('success');
      isValid = false;
    } else {
      input.classList.remove('error');
      input.classList.add('success');
    }
  });

  return isValid;
}

// Real-time input validation
function initInputValidation(input) {
  input.addEventListener('blur', function() {
    if (this.hasAttribute('required') && !this.value.trim()) {
      this.classList.add('error');
      this.classList.remove('success');
    } else if (this.value.trim()) {
      this.classList.remove('error');
      this.classList.add('success');
    }
  });

  input.addEventListener('input', function() {
    if (this.classList.contains('error') && this.value.trim()) {
      this.classList.remove('error');
      this.classList.add('success');
    }
  });
}

// Initialize all inputs with validation
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.form-input').forEach(input => {
    initInputValidation(input);
  });
});

// ===================================
// Page Transitions
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('page-loaded');
});

// ===================================
// Modal System
// ===================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.parentElement.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    formatNumber,
    debounce,
    storage,
    animateCounter,
    typeText,
    initTabs,
    validateForm,
    openModal,
    closeModal
  };
}
