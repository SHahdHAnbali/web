let quantity = 1;
let cartCount = 0;
let wishlistCount = 0;
let isInWishlistDetail = false;
let currentProductData = null;
let cartItems = [];
let selectedSize = 'M';

const productData = {
  1: {
    title: "Embroidered Red Thobe",
    price: "NIS 120.00",
    image: "image/web images/dress1.webp",
    sku: "RED-THOBE-001",
    description: "This exquisite hand-embroidered Palestinian thobe features traditional red and black motifs, showcasing the rich cultural heritage of Palestine. Each piece is carefully crafted by skilled artisans, making every thobe a unique work of art.",
    sizes: ["S", "M", "L", "XL"]
  },
  2: {
    title: "Embroidered Blue Thobe",
    price: "NIS 300.00",
    image: "image/web images/dress2.webp",
    sku: "BLUE-THOBE-002",
    description: "Beautiful blue Palestinian thobe with intricate embroidery patterns. This stunning piece represents the timeless beauty of traditional Palestinian craftsmanship with modern elegance.",
    sizes: ["M", "L", "XL"]
  },
  3: {
    title: "Embroidered Green Thobe",
    price: "NIS 250.00",
    image: "image/web images/dress3.jpg",
    sku: "GREEN-THOBE-003",
    description: "Elegant green thobe featuring authentic Palestinian embroidery. The vibrant color and detailed patterns make this a perfect choice for celebrating cultural heritage.",
    sizes: ["S", "M", "L"]
  },
  4: {
    title: "Embroidered Pink Thobe",
    price: "NIS 150.00",
    image: "image/web images/dress4.jpg",
    sku: "PINK-THOBE-004",
    description: "Delicate pink thobe perfect for special occasions. This beautiful piece combines traditional embroidery techniques with a soft, feminine color palette.",
    sizes: ["XS", "S", "M", "L"]
  },
  5: {
    title: "Embroidered Blue Thobe",
    price: "NIS 300.00",
    image: "image/web images/dress5.webp",
    sku: "BLUE-THOBE-005",
    description: "Stunning blue thobe with detailed embroidery work. Each stitch tells a story of Palestinian heritage and artistic excellence.",
    sizes: ["M", "L", "XL", "XXL"]
  },
  6: {
    title: "Embroidered Purple Thobe",
    price: "NIS 330.00",
    image: "image/web images/dress6.jpg",
    sku: "PURPLE-THOBE-006",
    description: "Luxurious purple thobe with ornate embroidery. This premium piece showcases the finest Palestinian craftsmanship with elegant detailing.",
    sizes: ["S", "M", "L", "XL"]
  },
  7: {
    title: "Embroidered Green Thobe",
    price: "NIS 250.00",
    image: "image/web images/dress7.avif",
    sku: "GREEN-THOBE-007",
    description: "Classic green thobe with authentic Palestinian embroidery. Traditional style meets quality materials in this timeless piece.",
    sizes: ["M", "L", "XL"]
  },
  8: {
    title: "Embroidered Blue Thobe",
    price: "NIS 300.00",
    image: "image/web images/dress8.webp",
    sku: "BLUE-THOBE-008",
    description: "Vibrant blue thobe featuring traditional motifs. Handmade with care, this piece represents cultural heritage at its finest.",
    sizes: ["S", "M", "L"]
  },
  9: {
    title: "Embroidered Orange Thobe",
    price: "NIS 250.00",
    image: "image/web images/dress9.jpg",
    sku: "ORANGE-THOBE-009",
    description: "Warm orange thobe with beautiful embroidered details. Eye-catching design that celebrates Palestinian artistic traditions.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  10: {
    title: "Embroidered Red Thobe",
    price: "NIS 200.00",
    image: "image/web images/dress10.webp",
    sku: "RED-THOBE-010",
    description: "Bold red thobe with striking embroidery patterns. Authentic craftsmanship using high-quality fabric for lasting beauty.",
    sizes: ["M", "L", "XL"]
  },
  11: {
    title: "Embroidered Blue Thobe",
    price: "NIS 400.00",
    image: "image/web images/dress11.webp",
    sku: "BLUE-THOBE-011",
    description: "Premium blue thobe with exquisite embroidery work. Luxury fabric and master craftsmanship combine in this exceptional piece.",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  12: {
    title: "Embroidered Purple Thobe",
    price: "NIS 500.00",
    image: "image/web images/dress12.webp",
    sku: "PURPLE-THOBE-012",
    description: "Exclusive purple thobe with premium embroidery details. A unique collectible piece showcasing the pinnacle of Palestinian textile artistry.",
    sizes: ["M", "L", "XL"]
  }
};

function showShopPage() {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  // Show shop page
  document.getElementById('shopPage').classList.add('active');
  window.scrollTo(0, 0);
}

window.showLoginPage = function() {
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  document.getElementById('loginPage').classList.add('active');
  window.scrollTo(0, 0);
}

window.showTrackOrderPage = function() {
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  document.getElementById('trackOrderPage').classList.add('active');
  window.scrollTo(0, 0);
}

window.showStoreLocatorPage = function() {
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  document.getElementById('storeLocatorPage').classList.add('active');
  window.scrollTo(0, 0);
}

window.showContactPage = function() {
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  document.getElementById('contactPage').classList.add('active');
  window.scrollTo(0, 0);
}

function showProductPage(productId) {
  const product = productData[productId];
  if (!product) return;

  currentProductData = product;
  
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailSKU').textContent = product.sku;
  document.getElementById('mainImage').src = product.image;
  document.getElementById('breadcrumbProduct').textContent = product.title;
  
  const descDiv = document.getElementById('detailDescription');
  descDiv.innerHTML = `<p>${product.description}</p><p>The intricate embroidery patterns tell stories of Palestinian tradition and history, passed down through generations. Perfect for special occasions or as a statement piece celebrating cultural identity.</p>`;

  document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    thumb.src = product.image;
  });

  // Update available sizes based on product data
  const sizeOptionsContainer = document.querySelector('.size-options');
  sizeOptionsContainer.innerHTML = ''; // Clear existing sizes
  
  const allSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const availableSizes = product.sizes || [];
  
  let firstAvailableAdded = false;
  
  allSizes.forEach((size) => {
    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'size-option';
    sizeDiv.textContent = size;
    
    // Check if this size is available
    if (availableSizes.includes(size)) {
      // Size is available - make it clickable
      sizeDiv.onclick = function() { selectSize(this); };
      
      // Make first available size active
      if (!firstAvailableAdded) {
        sizeDiv.classList.add('active');
        firstAvailableAdded = true;
      }
    } else {
      // Size is NOT available - disable it
      sizeDiv.classList.add('disabled');
      sizeDiv.style.cursor = 'not-allowed';
      sizeDiv.style.opacity = '0.3';
    }
    
    sizeOptionsContainer.appendChild(sizeDiv);
  });

  // Hide all pages, show product page
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  document.getElementById('productPage').classList.add('active');
  window.scrollTo(0, 0);
}

// Form handlers
window.handleLogin = function(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  // Here you would typically send this to your backend
  alert(`Login attempted with:\nEmail: ${email}\nPassword: ${password.replace(/./g, '*')}`);
  
  // For demo purposes, just show success message
  alert('Login successful! (Demo mode)');
}

window.handleTrackOrder = function(event) {
  event.preventDefault();
  const orderNumber = document.getElementById('order-number').value;
  const email = document.getElementById('order-email').value;
  
  alert(`Tracking order:\nOrder #: ${orderNumber}\nEmail: ${email}\n\nOrder Status: In Transit\nExpected Delivery: 3-5 business days`);
}

window.searchStores = function() {
  const searchInput = document.getElementById('store-search-input').value;
  if (searchInput) {
    alert(`Searching for stores near: ${searchInput}\n\nShowing all available stores...`);
  } else {
    alert('Please enter a city or postal code to search.');
  }
}

window.handleContact = function(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;
  
  alert(`Message sent successfully!\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nWe'll get back to you within 24 hours.`);
  
  // Reset form
  event.target.reset();
}

window.showRegisterForm = function() {
  alert('Register form would appear here. (Not implemented in demo)');
}

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.querySelector('.products');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const sidebarSearch = document.getElementById('sidebar-search');
  const sortSelect = document.getElementById('sort-by');
  const gridBtn = document.getElementById('grid-btn');
  const listBtn = document.getElementById('list-btn');
  const priceRange = document.getElementById('price-range');
  const priceBox = document.getElementById('price-box');
  const resetBtn = document.getElementById('reset-btn');

  let originalOrder = Array.from(productsContainer.querySelectorAll('.product')).map(p => p.cloneNode(true));

  function parsePrice(priceText) {
    const num = parseFloat(priceText.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  function attachProductListeners() {
    document.querySelectorAll('.wishlist').forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll('.wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        wishlistCount = document.querySelectorAll('.wishlist.active').length;
        document.getElementById('wishlist-count').textContent = wishlistCount;
        animateBadge('wishlist-count');
      });
    });

    document.querySelectorAll('.quick-view-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('modalImage').src = button.dataset.image;
        document.getElementById('modalTitle').textContent = button.dataset.title;
        document.getElementById('modalDescription').textContent = button.dataset.description;
        document.getElementById('modalSizes').textContent = button.dataset.sizes;
        document.getElementById('modalStatus').textContent = button.dataset.status;
        document.getElementById('modalFeatures').textContent = button.dataset.features;
        modal.style.display = 'flex';
      });
    });

    document.querySelectorAll('.product').forEach(product => {
      product.addEventListener('click', (e) => {
        if (!e.target.closest('.wishlist') && !e.target.closest('.actions')) {
          const productId = product.getAttribute('data-id');
          showProductPage(productId);
        }
      });
    });
  }

  attachProductListeners();

  window.addToCart = function(e) {
    if (e) e.stopPropagation();
    
    // Get the product element
    const productElement = e.target.closest('.product');
    if (!productElement) return;
    
    const productId = productElement.getAttribute('data-id');
    const product = productData[productId];
    
    if (!product) return;
    
    const cartItem = {
      id: Date.now(),
      title: product.title,
      price: product.price,
      image: product.image,
      size: product.sizes[0], // Use first available size
      quantity: 1
    };
    
    // Check if same product with same size exists
    const existingItemIndex = cartItems.findIndex(
      item => item.title === cartItem.title && item.size === cartItem.size
    );
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(cartItem);
    }
    
    updateCartDisplay();
    toggleCart();
  };

  function animateBadge(id) {
    const b = document.getElementById(id);
    if (!b) return;
    b.classList.add('animate');
    setTimeout(() => b.classList.remove('animate'), 300);
  }

  let selectedColors = [];
  let selectedSizes = [];

  document.querySelectorAll('.color-filter').forEach(cb => {
    cb.addEventListener('change', function() {
      selectedColors = Array.from(document.querySelectorAll('.color-filter:checked')).map(i => i.value);
      applyFilters();
    });
  });

  document.querySelectorAll('.size-filter').forEach(cb => {
    cb.addEventListener('change', function() {
      selectedSizes = Array.from(document.querySelectorAll('.size-filter:checked')).map(i => i.value);
      applyFilters();
    });
  });

  function applyFilters() {
    const mainQuery = searchInput.value.toLowerCase().trim();
    const sideQuery = sidebarSearch.value.toLowerCase().trim();
    const query = mainQuery || sideQuery;
    const maxPrice = Number(priceRange.value);

    document.querySelectorAll('.product').forEach(product => {
      const name = product.querySelector('h3').textContent.toLowerCase();
      const price = parsePrice(product.querySelector('.price').textContent);
      const color = product.getAttribute('data-color') || '';
      const productSizes = (product.getAttribute('data-sizes') || '').split(',').map(s => s.trim());

      const matchesQuery = query === "" || name.includes(query);
      const matchesPrice = isNaN(maxPrice) ? true : (price <= maxPrice);
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(color);
      
      // Check if product has at least one of the selected sizes
      const matchesSize = selectedSizes.length === 0 || selectedSizes.some(size => productSizes.includes(size));

      if (matchesQuery && matchesPrice && matchesColor && matchesSize) {
        product.style.display = '';
      } else {
        product.style.display = 'none';
      }
    });
  }

  searchBtn.addEventListener('click', applyFilters);
  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });
  sidebarSearch.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });

  priceRange.value = priceRange.max;
  priceBox.value = priceRange.value;

  priceRange.addEventListener('input', () => {
    priceBox.value = priceRange.value;
    applyFilters();
  });

  priceBox.addEventListener('input', () => {
    let v = Number(priceBox.value);
    if (isNaN(v)) v = Number(priceRange.max);
    if (v < Number(priceRange.min)) v = Number(priceRange.min);
    if (v > Number(priceRange.max)) v = Number(priceRange.max);
    priceBox.value = v;
    priceRange.value = v;
    applyFilters();
  });

  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.color-filter').forEach(cb => cb.checked = false);
    document.querySelectorAll('.size-filter').forEach(cb => cb.checked = false);
    selectedColors = [];
    selectedSizes = [];
    priceRange.value = priceRange.max;
    priceBox.value = priceRange.value;
    searchInput.value = '';
    sidebarSearch.value = '';
    sortSelect.value = 'Default';
    productsContainer.innerHTML = '';
    originalOrder.forEach(clone => productsContainer.appendChild(clone.cloneNode(true)));
    attachProductListeners();
    applyFilters();
  });

  sortSelect.addEventListener('change', () => {
    let items = Array.from(productsContainer.querySelectorAll('.product'));
    if (sortSelect.value === "Price: Low to High") {
      items.sort((a,b) => parsePrice(a.querySelector('.price').textContent) - parsePrice(b.querySelector('.price').textContent));
    } else if (sortSelect.value === "Price: High to Low") {
      items.sort((a,b) => parsePrice(b.querySelector('.price').textContent) - parsePrice(a.querySelector('.price').textContent));
    } else {
      productsContainer.innerHTML = '';
      originalOrder.forEach(clone => productsContainer.appendChild(clone.cloneNode(true)));
      attachProductListeners();
      applyFilters();
      return;
    }
    productsContainer.innerHTML = '';
    items.forEach(it => productsContainer.appendChild(it));
    attachProductListeners();
    applyFilters();
  });

  gridBtn.addEventListener('click', () => {
    productsContainer.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  });
  listBtn.addEventListener('click', () => {
    productsContainer.classList.add('list-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  });

  document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark')) {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  });

  document.querySelector('.toggle-sidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
  });

  const modal = document.getElementById("quickViewModal");
  const closeBtn = document.querySelector(".close");

  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  attachProductListeners();
  applyFilters();
});

// Initialize cart on load
window.addEventListener('DOMContentLoaded', function() {
  updateCartDisplay();
});

function changeImage(thumbnail) {
  document.getElementById('mainImage').src = thumbnail.src;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
}

function selectSize(element) {
  // Don't allow selecting disabled sizes
  if (element.classList.contains('disabled')) {
    return;
  }
  
  document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
  element.classList.add('active');
  selectedSize = element.textContent;
}

// Make functions globally accessible
window.toggleCart = function() {
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
  
  if (cartSidebar.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

window.updateCartDisplay = function() {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartItemsCount = document.getElementById('cart-items-count');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCountBadge = document.getElementById('cart-count');
  
  cartItemsCount.textContent = cartItems.length;
  cartCountBadge.textContent = cartItems.length;
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Your bag is empty</p>
      </div>
    `;
    cartSubtotal.textContent = 'NIS 0.00';
    return;
  }
  
  let subtotal = 0;
  cartItemsContainer.innerHTML = '';
  
  cartItems.forEach((item, index) => {
    const itemTotal = parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity;
    subtotal += itemTotal;
    
    const cartItemHTML = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <div class="cart-item-price">${item.price}</div>
          <div class="cart-item-info"><strong>Size:</strong> ${item.size}</div>
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
  
  cartSubtotal.textContent = `NIS ${subtotal.toFixed(2)}`;
}

window.updateCartQuantity = function(index, change) {
  if (cartItems[index]) {
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      updateCartDisplay();
    }
  }
}

window.removeFromCart = function(index) {
  cartItems.splice(index, 1);
  updateCartDisplay();
}

function addToCartFromDetail() {
  if (!currentProductData) return;
  
  const selectedSizeElement = document.querySelector('.size-option.active');
  const selectedSize = selectedSizeElement ? selectedSizeElement.textContent : 'M';
  
  const cartItem = {
    id: Date.now(),
    title: currentProductData.title,
    price: currentProductData.price,
    image: currentProductData.image,
    size: selectedSize,
    quantity: quantity
  };
  
  // Check if same product with same size exists
  const existingItemIndex = cartItems.findIndex(
    item => item.title === cartItem.title && item.size === cartItem.size
  );
  
  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push(cartItem);
  }
  
  updateCartDisplay();
  toggleCart();
  
  // Reset quantity to 1
  quantity = 1;
  document.getElementById('quantity').textContent = quantity;
}

function increaseQuantity() {
  quantity++;
  document.getElementById('quantity').textContent = quantity;
}

function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    document.getElementById('quantity').textContent = quantity;
  }
}

function addToCartFromDetail() {
  if (!currentProductData) return;
  
  const selectedSizeElement = document.querySelector('.size-option.active');
  const selectedSize = selectedSizeElement ? selectedSizeElement.textContent : 'M';
  
  const cartItem = {
    id: Date.now(),
    title: currentProductData.title,
    price: currentProductData.price,
    image: currentProductData.image,
    size: selectedSize,
    quantity: quantity
  };
  
  // Check if same product with same size exists
  const existingItemIndex = cartItems.findIndex(
    item => item.title === cartItem.title && item.size === cartItem.size
  );
  
  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push(cartItem);
  }
  
  updateCartDisplay();
  toggleCart();
  
  // Reset quantity to 1
  quantity = 1;
  document.getElementById('quantity').textContent = quantity;
}

function toggleWishlistDetail() {
  isInWishlistDetail = !isInWishlistDetail;
  const icon = document.getElementById('wishlistIconDetail');
  
  if (isInWishlistDetail) {
    icon.style.color = '#e74c3c';
    wishlistCount++;
  } else {
    icon.style.color = '';
    wishlistCount--;
  }
  
  document.getElementById('wishlist-count').textContent = wishlistCount;
  
  const badge = document.getElementById('wishlist-count');
  badge.classList.add('animate');
  setTimeout(() => badge.classList.remove('animate'), 300);
}