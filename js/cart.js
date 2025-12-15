// ============================================
// COMPLETE CART SYSTEM - Fixed & Ready
// Replace your existing cart.js with this
// ============================================

// Cart state stored in localStorage
let cartItems = [];
let wishlistItems = [];

// Initialize cart from localStorage
function initializeCart() {
  const savedCart = localStorage.getItem('stilleto_cart');
  const savedWishlist = localStorage.getItem('stilleto_wishlist');
  
  if (savedCart) {
    try {
      cartItems = JSON.parse(savedCart);
    } catch (e) {
      console.error('Error loading cart:', e);
      cartItems = [];
    }
  }
  
  if (savedWishlist) {
    try {
      wishlistItems = JSON.parse(savedWishlist);
    } catch (e) {
      console.error('Error loading wishlist:', e);
      wishlistItems = [];
    }
  }
  
  updateCartDisplay();
  updateWishlistDisplay();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('stilleto_cart', JSON.stringify(cartItems));
  updateCartDisplay();
}

// Save wishlist to localStorage
function saveWishlist() {
  localStorage.setItem('stilleto_wishlist', JSON.stringify(wishlistItems));
  updateWishlistDisplay();
}

// Add item to cart
window.addToCartGlobal = function(item) {
  const existingItemIndex = cartItems.findIndex(
    cartItem => 
      cartItem.title === item.title && 
      cartItem.size === item.size &&
      cartItem.color === item.color
  );

  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += item.quantity || 1;
  } else {
    cartItems.push({
      id: Date.now(),
      title: item.title,
      price: item.price,
      image: item.image,
      size: item.size || 'One Size',
      color: item.color || '',
      quantity: item.quantity || 1,
      type: item.type || 'product'
    });
  }
  
  saveCart();
  animateBadge('cart-count');
  return true;
};

// Update cart quantity
window.updateCartQuantity = function(index, change) {
  if (cartItems[index]) {
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
    }
  }
};

// Remove item from cart
window.removeFromCart = function(index) {
  cartItems.splice(index, 1);
  saveCart();
};

// Get cart total
function getCartTotal() {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return total + (price * item.quantity);
  }, 0);
}

// Update cart display
window.updateCartDisplay = function() {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartItemsCount = document.getElementById('cart-items-count');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCountBadge = document.getElementById('cart-count');
  
  if (!cartItemsContainer) return;
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartItemsCount) cartItemsCount.textContent = totalItems;
  if (cartCountBadge) cartCountBadge.textContent = totalItems;
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Your bag is empty</p>
      </div>
    `;
    if (cartSubtotal) cartSubtotal.textContent = 'NIS 0.00';
    return;
  }
  
  const subtotal = getCartTotal();
  cartItemsContainer.innerHTML = '';
  
  cartItems.forEach((item, index) => {
    const cartItemHTML = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <div class="cart-item-price">${item.price}</div>
          ${item.color ? `<div class="cart-item-info"><strong>Color:</strong> ${item.color}</div>` : ''}
          <div class="cart-item-info"><strong>Size:</strong> ${item.size}</div>
          ${item.type === 'bespoke' ? `<div class="cart-item-info" style="color: #8C28B6;"><strong>⚡ Bespoke Order</strong></div>` : ''}
          <div class="cart-item-controls">
            <div class="cart-quantity-controls">
              <button class="cart-quantity-btn" onclick="updateCartQuantity(${index}, -1)">−</button>
              <span class="cart-quantity-display">${item.quantity}</span>
              <button class="cart-quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
    
    cartItemsContainer.innerHTML += cartItemHTML;
  });
  
  if (cartSubtotal) cartSubtotal.textContent = `NIS ${subtotal.toFixed(2)}`;
};

// Toggle cart sidebar
window.toggleCart = function() {
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  
  if (!cartSidebar || !cartOverlay) return;
  
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
  
  if (cartSidebar.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
    updateCartDisplay();
  } else {
    document.body.style.overflow = '';
  }
};

// Wishlist functions
window.toggleWishlistItem = function(productId) {
  const index = wishlistItems.indexOf(productId);
  
  if (index >= 0) {
    wishlistItems.splice(index, 1);
  } else {
    wishlistItems.push(productId);
  }
  
  saveWishlist();
  return index < 0;
};

// Update wishlist display
function updateWishlistDisplay() {
  const wishlistBadge = document.getElementById('wishlist-count');
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlistItems.length;
  }
}

// Animate badge
function animateBadge(id) {
  const badge = document.getElementById(id);
  if (!badge) return;
  badge.classList.add('animate');
  setTimeout(() => badge.classList.remove('animate'), 300);
}

// FIXED: Proceed to checkout - navigates to checkout.html
window.proceedToCheckout = function() {
  if (cartItems.length === 0) {
    alert('Your cart is empty!\n\nPlease add items to your cart before checking out.');
    toggleCart(); // Close cart sidebar
    return;
  }
  
  // Check if user is logged in (optional - can checkout as guest)
  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  
  if (!user) {
    const shouldLogin = confirm(
      'Checkout as Guest or Login?\n\n' +
      'Click OK to login for faster checkout\n' +
      'Click Cancel to continue as guest'
    );
    
    if (shouldLogin) {
      // Store redirect to return to checkout after login
      sessionStorage.setItem('redirectAfterLogin', 'checkout');
      window.location.href = 'login.html';
      return;
    }
  }
  
  // Close cart sidebar
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartSidebar) cartSidebar.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
  
  // Navigate to checkout page
  window.location.href = 'checkout.html';
};

// View bag - show detailed cart view
window.viewBag = function() {
  if (cartItems.length === 0) {
    alert('Your bag is empty!\n\nBrowse our collections and add items to your bag.');
    toggleCart();
    return;
  }
  
  const total = getCartTotal();
  const itemsList = cartItems.map((item, index) => 
    `${index + 1}. ${item.title}\n` +
    `   Size: ${item.size}${item.color ? `, Color: ${item.color}` : ''}\n` +
    `   Qty: ${item.quantity} × ${item.price}`
  ).join('\n\n');
  
  alert(
    `YOUR SHOPPING BAG\n\n${itemsList}\n\n` +
    `────────────────────\n` +
    `Subtotal: NIS ${total.toFixed(2)}\n` +
    `Shipping: FREE\n` +
    `────────────────────\n` +
    `TOTAL: NIS ${total.toFixed(2)}`
  );
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeCart();
  
  // Setup cart overlay close
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.onclick = function() {
      toggleCart();
    };
  }
  
  // Setup cart close button
  const cartClose = document.querySelector('.cart-close');
  if (cartClose) {
    cartClose.onclick = function() {
      toggleCart();
    };
  }
});

// Clear cart (for testing or after order)
window.clearCart = function() {
  cartItems = [];
  saveCart();
};

// Get cart items (for external use)
window.getCartItems = function() {
  return cartItems;
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeCart,
    addToCartGlobal,
    updateCartQuantity,
    removeFromCart,
    toggleCart,
    getCartItems,
    clearCart,
    proceedToCheckout
  };
}

console.log('✓ Complete cart system loaded with checkout navigation');