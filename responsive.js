// ===================================
// Responsive Design Utilities
// Mobile & Tablet Enhancements
// ===================================

// Breakpoint detection
const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
};

function getCurrentBreakpoint() {
  const width = window.innerWidth;
  if (width <= breakpoints.mobile) return 'mobile';
  if (width <= breakpoints.tablet) return 'tablet';
  return 'desktop';
}

function isMobile() {
  return window.innerWidth <= breakpoints.mobile;
}

function isTablet() {
  return window.innerWidth > breakpoints.mobile && window.innerWidth <= breakpoints.tablet;
}

function isDesktop() {
  return window.innerWidth > breakpoints.tablet;
}

// ===================================
// Mobile Drawer Management
// ===================================

function openDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Create overlay if it doesn't exist
  let overlay = document.querySelector('.drawer-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'drawer-overlay sidebar-overlay';
    overlay.onclick = () => closeDrawer(drawerId);
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
}

function closeDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  
  drawer.classList.remove('open');
  document.body.style.overflow = '';
  
  // Hide overlay
  const overlay = document.querySelector('.drawer-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// ===================================
// Dashboard Sidebar Mobile Toggle
// ===================================

function toggleMobileSidebar() {
  const sidebar = document.querySelector('.dashboard-sidebar') || 
                  document.querySelector('aside[id*="Sidebar"]') ||
                  document.querySelector('aside[id*="sidebar"]');
  
  if (!sidebar) return;
  
  if (sidebar.classList.contains('open')) {
    closeDrawer sidebar.id);
  } else {
    openDrawer(sidebar.id);
  }
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.dashboard-sidebar') || 
                  document.querySelector('aside[id*="Sidebar"]') ||
                  document.querySelector('aside[id*="sidebar"]');
  
  if (sidebar) {
    closeDrawer(sidebar.id);
  }
}

// ===================================
// Shop Filter Drawer
// ===================================

function openFilterDrawer() {
  const filterSidebar = document.getElementById('filterSidebar');
  if (!filterSidebar) return;
  
  filterSidebar.classList.add('mobile-drawer', 'open');
  document.body.style.overflow = 'hidden';
  
  // Create overlay
  let overlay = document.querySelector('.filter-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'filter-overlay drawer-overlay';
    overlay.onclick = closeFilterDrawer;
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
}

function closeFilterDrawer() {
  const filterSidebar = document.getElementById('filterSidebar');
  if (!filterSidebar) return;
  
  filterSidebar.classList.remove('open');
  document.body.style.overflow = '';
  
  const overlay = document.querySelector('.filter-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function updateFilterCount() {
  const activeFilters = document.querySelectorAll('#platformFilters input:checked');
  const badge = document.getElementById('activeFilterCount');
  if (badge) {
    badge.textContent = activeFilters.length;
  }
}

// ===================================
// Touch Gesture Support
// ===================================

function addSwipeListener(element, callbacks) {
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  
  element.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  
  element.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
  }, { passive: true });
  
  element.addEventListener('touchend', () => {
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    // Horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0 && callbacks.onSwipeLeft) {
        callbacks.onSwipeLeft();
      } else if (diffX < 0 && callbacks.onSwipeRight) {
        callbacks.onSwipeRight();
      }
    }
    
    // Vertical swipe
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0 && callbacks.onSwipeUp) {
        callbacks.onSwipeUp();
      } else if (diffY < 0 && callbacks.onSwipeDown) {
        callbacks.onSwipeDown();
      }
    }
  });
}

// Swipe to close drawers
function addSwipeToClose(element, callback) {
  addSwipeListener(element, {
    onSwipeLeft: callback
  });
}

// ===================================
// Mobile Menu Enhancements
// ===================================

function initMobileMenu() {
  const toggle = document.getElementById('navbarToggle');
  const menu = document.querySelector('.navbar-menu');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
  
  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}

// ===================================
// Bottom Navigation (Mobile)
// ===================================

function initBottomNav() {
  if (!isMobile()) return;
  
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav';
  bottomNav.innerHTML = `
    <a href="index.html" class="bottom-nav-item ${isActivePage('index.html') ? 'active' : ''}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      <span>Home</span>
    </a>
    <a href="shop.html" class="bottom-nav-item ${isActivePage('shop.html') ? 'active' : ''}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span>Shop</span>
    </a>
    <a href="cart.html" class="bottom-nav-item ${isActivePage('cart.html') ? 'active' : ''}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span>Cart</span>
      <span class="bottom-nav-badge" id="bottomCartCount" style="display: none;">0</span>
    </a>
    <a href="dashboard.html" class="bottom-nav-item ${isActivePage('dashboard.html') ? 'active' : ''}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span>Account</span>
    </a>
  `;
  
  document.body.appendChild(bottomNav);
  document.body.classList.add('has-bottom-nav');
  
  // Update cart count
  updateBottomCartCount();
}

function isActivePage(pageName) {
  return window.location.pathname.includes(pageName);
}

function updateBottomCartCount() {
  const cart = JSON.parse(localStorage.getItem('mediahub_cart') || '[]');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.getElementById('bottomCartCount');
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// ===================================
// Responsive Images
// ===================================

function handleResponsiveImages() {
  const images = document.querySelectorAll('img[data-src-mobile], img[data-src-desktop]');
  
  images.forEach(img => {
    const mobileSrc = img.dataset.srcMobile;
    const desktopSrc = img.dataset.srcDesktop;
    
    if (isMobile() && mobileSrc) {
      img.src = mobileSrc;
    } else if (desktopSrc) {
      img.src = desktopSrc;
    }
  });
}

// ===================================
// Orientation Change Handler
// ===================================

function handleOrientationChange() {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Close any open drawers
      document.querySelectorAll('.mobile-drawer.open').forEach(drawer => {
        drawer.classList.remove('open');
      });
      document.querySelectorAll('.drawer-overlay.active').forEach(overlay => {
        overlay.classList.remove('active');
      });
      document.body.style.overflow = '';
      
      // Scroll to top
      window.scrollTo(0, 0);
    }, 100);
  });
}

// ===================================
// Debounce Utility
// ===================================

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

// ===================================
// Pull-to-Refresh (Optional)
// ===================================

function initPullToRefresh() {
  if (!isMobile()) return;
  
  let startY = 0;
  let currentY = 0;
  let refreshing = false;
  
  const indicator = document.createElement('div');
  indicator.className = 'pull-to-refresh-indicator';
  indicator.innerHTML = '<div class="spinner"></div><span>Pull to refresh</span>';
  indicator.style.cssText = `
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  document.body.appendChild(indicator);
  
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0 && !refreshing) {
      startY = e.touches[0].clientY;
    }
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (window.scrollY === 0 && !refreshing) {
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0 && diff < 150) {
        indicator.style.opacity = diff / 150;
      }
    }
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    if (window.scrollY === 0 && !refreshing) {
      const diff = currentY - startY;
      
      if (diff > 100) {
        refreshing = true;
        indicator.innerHTML = '<div class="spinner rotating"></div><span>Refreshing...</span>';
        indicator.style.opacity = '1';
        
        // Trigger refresh
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        indicator.style.opacity = '0';
      }
    }
  });
}

// ===================================
// Cart Summary Mobile Sticky
// ===================================

function initMobileCartSummary() {
  if (!isMobile()) return;
  
  const cartSummary = document.getElementById('cartSummary');
  if (!cartSummary) return;
  
  cartSummary.classList.add('mobile-sticky');
  
  // Add wrapper class for padding
  const cartItems = document.querySelector('#cartItems');
  if (cartItems) {
    cartItems.classList.add('cart-items-wrapper');
  }
}

// ===================================
// Account Detail Mobile Buy Bar
// ===================================

function initMobileBuyBar() {
  if (!isMobile()) return;
  
  const buySection = document.querySelector('.buy-section') || 
                     document.querySelector('#buyNow');
  if (!buySection) return;
  
  // Clone for mobile bar
  const mobileBar = document.createElement('div');
  mobileBar.className = 'mobile-buy-bar';
  
  const price = buySection.querySelector('.price')?.textContent || '$0';
  const buyBtn = buySection.querySelector('.btn-primary');
  
  mobileBar.innerHTML = `
    <div style="flex: 1;">
      <div style="font-size: 0.75rem; color: var(--text-light);">Total Price</div>
      <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">${price}</div>
    </div>
    <button class="btn btn-primary" onclick="${buyBtn?.onclick || 'window.location.href=\\'cart.html\\''}">
      Buy Now
    </button>
  `;
  
  document.body.appendChild(mobileBar);
  
  // Add padding to content
  const content = document.querySelector('.account-detail-content');
  if (content) {
    content.classList.add('account-detail-content');
  }
}

// ===================================
// Initialization
// ===================================

function initResponsiveFeatures() {
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize bottom navigation on mobile
  if (isMobile()) {
    initBottomNav();
    initMobileCartSummary();
    initMobileBuyBar();
  }
  
  // Handle orientation changes
  handleOrientationChange();
  
  // Add swipe to close for drawers
  document.querySelectorAll('.mobile-drawer').forEach(drawer => {
    addSwipeToClose(drawer, () => {
      closeDrawer(drawer.id);
    });
  });
  
  // Update filter count on shop page
  if (document.getElementById('platformFilters')) {
    document.querySelectorAll('#platformFilters input').forEach(input => {
      input.addEventListener('change', updateFilterCount);
    });
    updateFilterCount();
  }
  
  // Handle responsive images
  handleResponsiveImages();
  
  // Optional: Pull to refresh
  // initPullToRefresh();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResponsiveFeatures);
} else {
  initResponsiveFeatures();
}

// Re-initialize on resize (debounced)
window.addEventListener('resize', debounce(() => {
  if (isMobile() && !document.querySelector('.bottom-nav')) {
    initBottomNav();
  } else if (!isMobile() && document.querySelector('.bottom-nav')) {
    document.querySelector('.bottom-nav')?.remove();
    document.body.classList.remove('has-bottom-nav');
  }
}, 250));

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    breakpoints,
    getCurrentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    openDrawer,
    closeDrawer,
    toggleMobileSidebar,
    closeMobileSidebar,
    openFilterDrawer,
    closeFilterDrawer,
    updateFilterCount,
    addSwipeListener,
    initResponsiveFeatures
  };
}
