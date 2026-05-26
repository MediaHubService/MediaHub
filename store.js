// ===================================
// Centralized State Management
// ===================================

class AppStore {
  constructor() {
    this.state = {
      // User state
      user: null,
      isAuthenticated: false,
      
      // Cart state
      cart: [],
      cartTotal: 0,
      cartCount: 0,
      
      // Favorites state
      favorites: [],
      
      // Filter state
      filters: {
        platforms: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'twitch', 'pinterest'],
        priceRange: { min: 0, max: 5000 },
        followersRange: { min: 0, max: 1000000 },
        verifiedOnly: false,
        sortBy: 'newest',
        searchQuery: ''
      },
      
      // UI state
      loading: false,
      theme: 'light',
      sidebarOpen: false,
      cartDrawerOpen: false,
      
      // Order state
      orders: [],
      currentOrder: null
    };
    
    this.listeners = {};
    this.plugins = [];
    
    this.loadFromStorage();
    this.initializePlugins();
  }

  // Get state
  getState() {
    return { ...this.state };
  }

  // Get specific state property
  get(key) {
    return this.state[key];
  }

  // Set state with automatic save
  set(key, value) {
    const previousValue = this.state[key];
    this.state[key] = value;
    
    this.notifyListeners(key, value, previousValue);
    this.saveToStorage();
  }

  // Update nested state
  update(key, updater) {
    const currentValue = this.state[key];
    const newValue = typeof updater === 'function' ? updater(currentValue) : updater;
    this.set(key, newValue);
  }

  // Subscribe to state changes
  subscribe(key, listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners[key] = this.listeners[key].filter(l => l !== listener);
    };
  }

  // Notify listeners of state changes
  notifyListeners(key, newValue, oldValue) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => {
        try {
          listener(newValue, oldValue);
        } catch (error) {
          console.error(`Error in listener for ${key}:`, error);
        }
      });
    }
  }

  // Load state from localStorage
  loadFromStorage() {
    try {
      const user = localStorage.getItem('mediahub_user');
      const authToken = localStorage.getItem('mediahub_auth_token');
      const cart = localStorage.getItem('mediahub_cart');
      const favorites = localStorage.getItem('mediahub_favorites');
      const filters = localStorage.getItem('mediahub_filters');
      const theme = localStorage.getItem('mediahub_theme');

      if (user && authToken) {
        this.state.user = JSON.parse(user);
        this.state.isAuthenticated = true;
      }

      if (cart) {
        this.state.cart = JSON.parse(cart);
        this.updateCartTotals();
      }

      if (favorites) {
        this.state.favorites = JSON.parse(favorites);
      }

      if (filters) {
        this.state.filters = { ...this.state.filters, ...JSON.parse(filters) };
      }

      if (theme) {
        this.state.theme = theme;
      }
    } catch (error) {
      console.error('Error loading state from storage:', error);
    }
  }

  // Save state to localStorage
  saveToStorage() {
    try {
      if (this.state.user) {
        localStorage.setItem('mediahub_user', JSON.stringify(this.state.user));
      }
      
      localStorage.setItem('mediahub_cart', JSON.stringify(this.state.cart));
      localStorage.setItem('mediahub_favorites', JSON.stringify(this.state.favorites));
      localStorage.setItem('mediahub_filters', JSON.stringify(this.state.filters));
      localStorage.setItem('mediahub_theme', this.state.theme);
    } catch (error) {
      console.error('Error saving state to storage:', error);
    }
  }

  // Cart actions
  addToCart(item) {
    const existingItem = this.state.cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.state.cart.push({ ...item, quantity: 1 });
    }
    
    this.updateCartTotals();
    this.saveToStorage();
    this.notifyListeners('cart', this.state.cart, []);
  }

  removeFromCart(itemId) {
    const previousCart = [...this.state.cart];
    this.state.cart = this.state.cart.filter(item => item.id !== itemId);
    
    this.updateCartTotals();
    this.saveToStorage();
    this.notifyListeners('cart', this.state.cart, previousCart);
  }

  updateCartItem(itemId, updates) {
    const item = this.state.cart.find(item => item.id === itemId);
    if (item) {
      Object.assign(item, updates);
      this.updateCartTotals();
      this.saveToStorage();
      this.notifyListeners('cart', this.state.cart, []);
    }
  }

  clearCart() {
    const previousCart = [...this.state.cart];
    this.state.cart = [];
    this.updateCartTotals();
    this.saveToStorage();
    this.notifyListeners('cart', this.state.cart, previousCart);
  }

  updateCartTotals() {
    this.state.cartCount = this.state.cart.reduce((total, item) => total + item.quantity, 0);
    this.state.cartTotal = this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Favorites actions
  addToFavorite(item) {
    const exists = this.state.favorites.find(fav => fav.id === item.id);
    if (!exists) {
      this.state.favorites.push(item);
      this.saveToStorage();
      this.notifyListeners('favorites', this.state.favorites, []);
    }
  }

  removeFromFavorite(itemId) {
    const previousFavorites = [...this.state.favorites];
    this.state.favorites = this.state.favorites.filter(fav => fav.id !== itemId);
    this.saveToStorage();
    this.notifyListeners('favorites', this.state.favorites, previousFavorites);
  }

  isFavorite(itemId) {
    return this.state.favorites.some(fav => fav.id === itemId);
  }

  toggleFavorite(item) {
    if (this.isFavorite(item.id)) {
      this.removeFromFavorite(item.id);
      return false;
    } else {
      this.addToFavorite(item);
      return true;
    }
  }

  // Filter actions
  updateFilters(updates) {
    this.state.filters = { ...this.state.filters, ...updates };
    this.saveToStorage();
    this.notifyListeners('filters', this.state.filters, {});
  }

  resetFilters() {
    const previousFilters = { ...this.state.filters };
    this.state.filters = {
      platforms: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'twitch', 'pinterest'],
      priceRange: { min: 0, max: 5000 },
      followersRange: { min: 0, max: 1000000 },
      verifiedOnly: false,
      sortBy: 'newest',
      searchQuery: ''
    };
    this.saveToStorage();
    this.notifyListeners('filters', this.state.filters, previousFilters);
  }

  // User actions
  setUser(userData) {
    const previousUser = this.state.user;
    this.state.user = userData;
    this.state.isAuthenticated = !!userData;
    this.saveToStorage();
    this.notifyListeners('user', userData, previousUser);
  }

  logout() {
    const previousUser = this.state.user;
    this.state.user = null;
    this.state.isAuthenticated = false;
    localStorage.removeItem('mediahub_user');
    localStorage.removeItem('mediahub_auth_token');
    this.saveToStorage();
    this.notifyListeners('user', null, previousUser);
    window.location.href = 'login.html';
  }

  // Theme actions
  toggleTheme() {
    const previousTheme = this.state.theme;
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('mediahub_theme', this.state.theme);
    this.notifyListeners('theme', this.state.theme, previousTheme);
  }

  // UI actions
  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    this.notifyListeners('sidebarOpen', this.state.sidebarOpen, !this.state.sidebarOpen);
  }

  toggleCartDrawer() {
    this.state.cartDrawerOpen = !this.state.cartDrawerOpen;
    this.notifyListeners('cartDrawerOpen', this.state.cartDrawerOpen, !this.state.cartDrawerOpen);
  }

  // Plugin system
  use(plugin) {
    this.plugins.push(plugin);
  }

  initializePlugins() {
    this.plugins.forEach(plugin => {
      try {
        plugin(this);
      } catch (error) {
        console.error('Error initializing plugin:', error);
      }
    });
  }

  // DevTools - Get full state
  devGetState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  // DevTools - Time travel debugging
  devSetState(newState) {
    this.state = { ...this.state, ...newState };
    this.saveToStorage();
  }
}

// Create singleton instance
const store = new AppStore();

// Common plugins
function loggingPlugin(store) {
  if (process.env.NODE_ENV === 'development') {
    const keys = ['user', 'cart', 'favorites', 'filters'];
    keys.forEach(key => {
      store.subscribe(key, (newValue, oldValue) => {
        console.log(`[Store] ${key} changed:`, { oldValue, newValue });
      });
    });
  }
}

function persistencePlugin(store) {
  // Already handled in loadFromStorage and saveToStorage
  console.log('[Plugin] Persistence loaded');
}

// Register plugins
store.use(loggingPlugin);
store.use(persistencePlugin);

// Subscribe to cart changes and update UI
store.subscribe('cart', (cart) => {
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
    cartCountElement.style.display = count > 0 ? 'flex' : 'none';
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { store, AppStore };
}

// Make available globally
window.store = store;
