// ===================================
// Shopping Cart Functionality
// ===================================

// Cart state
let cart = storage.get('mediahub_cart') || [];

// Add item to cart
function addToCart(item) {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartUI();
  showToast(`${item.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  updateCartUI();
  showToast('Item removed from cart', 'info');
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
  const item = cart.find(item => item.id === itemId);
  
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      item.quantity = newQuantity;
      saveCart();
      updateCartUI();
    }
  }
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// Save cart to localStorage
function saveCart() {
  storage.set('mediahub_cart', cart);
}

// Get cart total
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart count
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart UI
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const count = getCartCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartUI();
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    saveCart,
    updateCartUI
  };
}
