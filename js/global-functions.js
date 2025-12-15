// ============================================
// GLOBAL FUNCTIONS - Works on ALL pages
// Load this AFTER cart.js and auth.js
// ============================================

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

// Navigate to different pages
window.navigateToHome = function() {
    window.location.href = 'home.html';
  };
  
  window.navigateToShop = function() {
    window.location.href = 'index.html';
  };
  
  window.navigateToBags = function() {
    window.location.href = 'bags.html';
  };
  
  window.navigateToBespoke = function() {
    window.location.href = 'made_to_order.html';
  };
  
  window.navigateToLogin = function() {
    window.location.href = 'login.html';
  };
  
  window.navigateToSignup = function() {
    window.location.href = 'signup.html';
  };
  
  window.navigateToTrackOrder = function() {
    window.location.href = 'track_order.html';
  };
  
  window.navigateToStoreLocator = function() {
    window.location.href = 'store_locator.html';
  };
  
  window.navigateToContact = function() {
    window.location.href = 'contact.html';
  };
  
  // ============================================
  // CHECKOUT FUNCTIONS
  // ============================================
  
  window.proceedToCheckout = function() {
    const cart = getCartItems();
    
    if (!cart || cart.length === 0) {
      alert('Your cart is empty!\n\nPlease add items to your cart before checking out.');
      return;
    }
    
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
      const shouldLogin = confirm('Please login to checkout.\n\nDo you want to login now?');
      if (shouldLogin) {
        // Store redirect info
        sessionStorage.setItem('redirectAfterLogin', 'checkout');
        window.location.href = 'login.html';
      }
      return;
    }
    
    // Store cart for checkout page
    localStorage.setItem('checkout_cart', JSON.stringify(cart));
    
    // For now, show checkout summary (replace with actual checkout page later)
    showCheckoutSummary();
  };
  
  function showCheckoutSummary() {
    const cart = getCartItems();
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const itemsList = cart.map(item => 
      `• ${item.title}\n  Size: ${item.size}${item.color ? `, Color: ${item.color}` : ''}\n  Qty: ${item.quantity} - ${item.price}`
    ).join('\n\n');
    
    const proceed = confirm(
      `CHECKOUT SUMMARY\n\n${itemsList}\n\n` +
      `Subtotal: NIS ${total.toFixed(2)}\n` +
      `Shipping: FREE\n` +
      `────────────────────\n` +
      `TOTAL: NIS ${total.toFixed(2)}\n\n` +
      `Do you want to place this order?`
    );
    
    if (proceed) {
      placeOrder();
    }
  }
  
  function placeOrder() {
    const cart = getCartItems();
    const user = getCurrentUser();
    const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000);
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      orderNumber: orderNumber,
      date: new Date().toISOString(),
      customer: user,
      items: cart,
      total: total,
      status: 'Processing'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    // Show success
    alert(
      `✓ ORDER PLACED SUCCESSFULLY!\n\n` +
      `Order Number: ${orderNumber}\n` +
      `Total: NIS ${total.toFixed(2)}\n\n` +
      `A confirmation email has been sent to:\n${user.email}\n\n` +
      `Estimated delivery: 5-7 business days\n\n` +
      `Thank you for shopping with Stilleto!`
    );
    
    // Redirect to home
    window.location.href = 'home.html';
  }
  
  // ============================================
  // VIEW BAG FUNCTION
  // ============================================
  
  window.viewBag = function() {
    const cart = getCartItems();
    
    if (!cart || cart.length === 0) {
      alert('Your bag is empty!\n\nBrowse our collections and add items to your bag.');
      return;
    }
    
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const itemsList = cart.map((item, index) => 
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
  
  // ============================================
  // STORE LOCATOR FUNCTIONS
  // ============================================
  
  window.getDirections = function(storeName) {
    const stores = {
      'Ramallah': 'Main Street, Ramallah, West Bank',
      'Nablus': 'Old City, Nablus, West Bank',
      'Bethlehem': 'Manger Square, Bethlehem, West Bank',
      'Hebron': 'Al-Khalil, Hebron, West Bank'
    };
    
    const address = stores[storeName];
    if (address) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert('Store location not found.');
    }
  };
  
  window.searchStores = function() {
    const searchInput = document.getElementById('store-search-input');
    if (!searchInput) return;
    
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
      alert('Please enter a city or postal code to search.');
      return;
    }
    
    const stores = document.querySelectorAll('.store-card');
    let foundCount = 0;
    
    stores.forEach(store => {
      const storeName = store.querySelector('h3').textContent.toLowerCase();
      const storeAddress = store.querySelector('.store-address').textContent.toLowerCase();
      
      if (storeName.includes(query) || storeAddress.includes(query)) {
        store.style.display = 'block';
        store.style.animation = 'fadeIn 0.5s ease';
        foundCount++;
      } else {
        store.style.display = 'none';
      }
    });
    
    if (foundCount === 0) {
      alert(`No stores found near "${query}".\n\nShowing all available stores.`);
      stores.forEach(store => {
        store.style.display = 'block';
      });
    }
  };
  
  // ============================================
  // SOCIAL MEDIA FUNCTIONS
  // ============================================
  
  window.openSocialMedia = function(platform) {
    const urls = {
      facebook: 'https://facebook.com/stilleto',
      instagram: 'https://instagram.com/stilleto',
      twitter: 'https://twitter.com/stilleto',
      whatsapp: 'https://wa.me/970591234567',
      tiktok: 'https://tiktok.com/@stilleto',
      pinterest: 'https://pinterest.com/stilleto'
    };
    
    const url = urls[platform.toLowerCase()];
    if (url) {
      window.open(url, '_blank');
    }
  };
  
  // ============================================
  // WISHLIST MANAGEMENT
  // ============================================
  
  window.viewWishlist = function() {
    const wishlist = JSON.parse(localStorage.getItem('stilleto_wishlist') || '[]');
    
    if (wishlist.length === 0) {
      alert('Your wishlist is empty!\n\nClick the ♡ icon on products to add them to your wishlist.');
      return;
    }
    
    alert(
      `YOUR WISHLIST\n\n` +
      `You have ${wishlist.length} item(s) in your wishlist.\n\n` +
      `Wishlist IDs: ${wishlist.join(', ')}\n\n` +
      `(Full wishlist page coming soon)`
    );
  };
  
  window.clearWishlist = function() {
    const confirm = window.confirm('Are you sure you want to clear your entire wishlist?');
    if (confirm) {
      localStorage.setItem('stilleto_wishlist', '[]');
      const wishlistBadge = document.getElementById('wishlist-count');
      if (wishlistBadge) wishlistBadge.textContent = '0';
      
      // Remove active class from all wishlist icons
      document.querySelectorAll('.wishlist.active, .wishlist-icon.active').forEach(icon => {
        icon.classList.remove('active');
        icon.style.color = '';
        icon.style.backgroundColor = '';
      });
      
      alert('✓ Your wishlist has been cleared.');
    }
  };
  
  // ============================================
  // SIZE GUIDE
  // ============================================
  
  window.showSizeGuide = function() {
    const sizeGuide = `
  SIZE GUIDE - HEELS
  
  EU Size | US Size | UK Size | CM
  ───────────────────────────────
    35    |   5     |   2.5   | 22.5
    36    |   6     |   3.5   | 23.0
    37    |   7     |   4.5   | 23.5
    38    |   8     |   5.5   | 24.0
    39    |   9     |   6.5   | 24.5
    40    |   10    |   7.5   | 25.0
    41    |   11    |   8.5   | 25.5
    42    |   12    |   9.5   | 26.0
  
  HOW TO MEASURE:
  1. Place your foot on paper
  2. Mark heel and longest toe
  3. Measure the distance
  4. Add 0.5cm for comfort
  
  TIPS:
  • Measure in the evening
  • Wear socks you'll use
  • If between sizes, go up
    `;
    
    alert(sizeGuide);
  };
  
  // ============================================
  // PRODUCT COMPARISON
  // ============================================
  
  window.compareProducts = function() {
    alert('Product comparison feature coming soon!\n\nYou\'ll be able to compare multiple products side-by-side.');
  };
  
  // ============================================
  // SHARE PRODUCT
  // ============================================
  
  window.shareProduct = function(productName) {
    const url = window.location.href;
    const text = `Check out ${productName} at Stilleto!`;
    
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: text,
        url: url
      }).catch(() => {
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('✓ Link copied to clipboard!\n\nShare it with your friends.');
  }
  
  // ============================================
  // NEWSLETTER SUBSCRIPTION
  // ============================================
  
  window.subscribeNewsletter = function(email) {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return false;
    }
    
    const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    
    if (subscriptions.includes(email)) {
      alert('You are already subscribed to our newsletter!');
      return false;
    }
    
    subscriptions.push(email);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
    
    alert(
      `✓ SUBSCRIPTION SUCCESSFUL!\n\n` +
      `Welcome to the Stilleto family!\n\n` +
      `You'll receive:\n` +
      `• 15% off your first order\n` +
      `• Exclusive early access to sales\n` +
      `• New arrival notifications\n` +
      `• Style tips & inspiration\n\n` +
      `Check your inbox: ${email}`
    );
    
    return true;
  };
  
  // ============================================
  // LIVE CHAT / CUSTOMER SUPPORT
  // ============================================
  
  window.openLiveChat = function() {
    alert(
      `CUSTOMER SUPPORT\n\n` +
      `We're here to help!\n\n` +
      `📞 Phone: +970 2 123 4567\n` +
      `📧 Email: support@stilleto.com\n` +
      `💬 WhatsApp: +970 59 123 4567\n\n` +
      `Hours: Sun-Thu 9AM-8PM\n\n` +
      `(Live chat coming soon)`
    );
  };
  
  // ============================================
  // GIFT WRAPPING
  // ============================================
  
  window.addGiftWrapping = function() {
    const cart = getCartItems();
    
    if (!cart || cart.length === 0) {
      alert('Please add items to your cart first.');
      return;
    }
    
    const addGift = confirm(
      `GIFT WRAPPING SERVICE\n\n` +
      `Make it special with our premium gift wrapping!\n\n` +
      `Includes:\n` +
      `• Luxury gift box\n` +
      `• Satin ribbon\n` +
      `• Personalized message card\n\n` +
      `Price: NIS 25.00\n\n` +
      `Add gift wrapping to your order?`
    );
    
    if (addGift) {
      addToCartGlobal({
        title: 'Gift Wrapping Service',
        price: 'NIS 25.00',
        image: 'images/gift-wrap.png',
        size: 'Service',
        quantity: 1,
        type: 'service'
      });
      
      alert('✓ Gift wrapping added to your cart!');
    }
  };
  
  // ============================================
  // APPLY DISCOUNT CODE
  // ============================================
  
  window.applyDiscountCode = function(code) {
    if (!code) {
      const inputCode = prompt('Enter your discount code:');
      if (!inputCode) return;
      code = inputCode.trim().toUpperCase();
    }
    
    const validCodes = {
      'WELCOME15': { discount: 0.15, description: '15% off first order' },
      'SUMMER20': { discount: 0.20, description: '20% summer sale' },
      'FREESHIP': { discount: 0, description: 'Free shipping', freeShipping: true },
      'BESPOKE10': { discount: 0.10, description: '10% off bespoke orders' }
    };
    
    const discountInfo = validCodes[code];
    
    if (discountInfo) {
      localStorage.setItem('appliedDiscount', JSON.stringify({ code, ...discountInfo }));
      
      alert(
        `✓ DISCOUNT CODE APPLIED!\n\n` +
        `Code: ${code}\n` +
        `Discount: ${discountInfo.description}\n\n` +
        `Your discount will be applied at checkout.`
      );
    } else {
      alert('❌ Invalid discount code.\n\nPlease check your code and try again.');
    }
  };
  
  // ============================================
  // REQUEST CALLBACK
  // ============================================
  
  window.requestCallback = function() {
    const user = getCurrentUser();
    const phone = prompt(
      'REQUEST A CALLBACK\n\n' +
      'Enter your phone number and we\'ll call you back within 1 hour:\n\n' +
      (user ? `(Logged in as: ${user.email})` : '')
    );
    
    if (phone && phone.length > 5) {
      alert(
        `✓ CALLBACK REQUESTED\n\n` +
        `We'll call you at: ${phone}\n\n` +
        `Expected callback time:\n` +
        `Within the next hour during business hours\n\n` +
        `Thank you!`
      );
    }
  };
  
  // ============================================
  // SAVE FOR LATER
  // ============================================
  
  window.saveForLater = function(itemIndex) {
    const cart = getCartItems();
    if (!cart[itemIndex]) return;
    
    const item = cart[itemIndex];
    
    // Remove from cart
    removeFromCart(itemIndex);
    
    // Add to saved items
    const savedItems = JSON.parse(localStorage.getItem('savedForLater') || '[]');
    savedItems.push(item);
    localStorage.setItem('savedForLater', JSON.stringify(savedItems));
    
    alert(`✓ Item saved for later!\n\n${item.title}\n\nView saved items from your account.`);
  };
  
  // ============================================
  // QUICK REORDER
  // ============================================
  
  window.quickReorder = function(orderNumber) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
      alert('Order not found.');
      return;
    }
    
    const reorder = confirm(
      `QUICK REORDER\n\n` +
      `Order #${orderNumber}\n` +
      `${order.items.length} item(s)\n` +
      `Total: NIS ${order.total.toFixed(2)}\n\n` +
      `Add all items to your cart?`
    );
    
    if (reorder) {
      order.items.forEach(item => {
        addToCartGlobal(item);
      });
      alert(`✓ ${order.items.length} items added to your cart!`);
      toggleCart();
    }
  };
  
  // ============================================
  // PRODUCT AVAILABILITY ALERT
  // ============================================
  
  window.notifyWhenAvailable = function(productName) {
    const user = getCurrentUser();
    const email = user ? user.email : prompt('Enter your email to be notified when this product is back in stock:');
    
    if (email && email.includes('@')) {
      alert(
        `✓ NOTIFICATION SET\n\n` +
        `We'll email you at ${email} when:\n` +
        `"${productName}"\n` +
        `is back in stock.`
      );
    }
  };
  
  // ============================================
  // INSTALLATION & INITIALIZATION
  // ============================================
  
  document.addEventListener('DOMContentLoaded', function() {
    // Setup all store buttons
    document.querySelectorAll('.store-btn').forEach(btn => {
      btn.onclick = function() {
        const storeName = this.closest('.store-card').querySelector('h3').textContent.split(' ')[0];
        getDirections(storeName);
      };
    });
    
    // Setup social links
    document.querySelectorAll('.social-links a').forEach(link => {
      link.onclick = function(e) {
        e.preventDefault();
        const icon = this.querySelector('i');
        if (icon) {
          const platform = icon.className.split('fa-')[1];
          openSocialMedia(platform);
        }
      };
    });
    
    // Setup checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn && !checkoutBtn.onclick) {
      checkoutBtn.onclick = proceedToCheckout;
    }
    
    // Setup view bag button
    const viewBagBtn = document.querySelector('.view-bag-btn');
    if (viewBagBtn && !viewBagBtn.onclick) {
      viewBagBtn.onclick = viewBag;
    }
    
    console.log('✓ Global functions initialized');
  });
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  // Show loading indicator
  window.showLoading = function(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      color: white;
      font-size: 18px;
      font-weight: 600;
    `;
    loader.textContent = message;
    document.body.appendChild(loader);
  };
  
  window.hideLoading = function() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();
  };
  
  // Format currency
  window.formatPrice = function(price) {
    const num = parseFloat(price.toString().replace(/[^\d.]/g, ''));
    return `NIS ${num.toFixed(2)}`;
  };
  
  // Scroll to top
  window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  console.log('✓ Global functions loaded successfully');


 



// ============================================
// UPDATED GLOBAL FUNCTIONS WITH NEW PAGES
// Add this to your existing global-functions.js
// ============================================

// Navigate to New Arrivals page
window.viewNewArrivals = function() {
  window.location.href = 'new-arrivals.html';
};

// Navigate to Sale page
window.shopSale = function() {
  window.location.href = 'sale.html';
};

// Navigate to Checkout page
window.goToCheckout = function() {
  window.location.href = 'checkout.html';
};

// Navigate to Admin Dashboard
window.goToAdmin = function() {
  window.location.href = 'admin-login.html';
};

// Update the existing viewAllProducts function
window.viewAllProducts = function() {
  window.location.href = 'new-arrivals.html';
};

// FIXED: Proceed to checkout - now goes directly to checkout.html
window.proceedToCheckout = function() {
  const cart = getCartItems();
  
  if (!cart || cart.length === 0) {
    alert('Your cart is empty!\n\nPlease add items to your cart before checking out.');
    return;
  }
  
  // Check if user is logged in
  const user = getCurrentUser();
  if (!user) {
    const shouldLogin = confirm('Please login to checkout.\n\nDo you want to login now?');
    if (shouldLogin) {
      sessionStorage.setItem('redirectAfterLogin', 'checkout');
      window.location.href = 'login.html';
    }
    return;
  }
  
  // Go directly to checkout page
  window.location.href = 'checkout.html';
};

// Update login redirect
document.addEventListener('DOMContentLoaded', function() {
  // Check for redirect after login
  const redirect = sessionStorage.getItem('redirectAfterLogin');
  if (redirect === 'checkout') {
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = 'checkout.html';
  }
});

console.log('✓ Updated global functions loaded with checkout navigation');