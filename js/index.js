let quantity = 1;
let currentProductData = null;
let selectedSize = '35';

// Product Database - HEELS
const productData = {
  1: {
    title: "Green Mirror Pumps",
    price: "NIS 120.00",
    image: "heels/green_mirror.png",
    images: ["heels/green_mirror.png", "heels/green_mirror1.png", "heels/green_mirror2.png", "heels/green_mirror3.png"],
    sku: "GREEN-PUMPS-001",
    description: "This iconic pump is our ultimate signature style reflecting elegance and femininity. Standing on a stiletto heel of 105mm, this timeless pointy toe pump is neatly designed with pure proportions perfect for any occasion.",
    sizes: ["35", "36", "37", "40"],
    category: "heels"
  }
  // Add more heel products here as needed
};

// ============================================
// PAGE NAVIGATION
// ============================================

function showShopPage() {
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  const shopPage = document.getElementById('shopPage');
  if (shopPage) shopPage.classList.add('active');
  window.scrollTo(0, 0);
}

function showProductPage(productId) {
  const product = productData[productId];
  if (!product) return;

  currentProductData = product;
  
  // Update product details
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailSKU').textContent = product.sku;
  document.getElementById('mainImage').src = product.images ? product.images[0] : product.image;
  document.getElementById('breadcrumbProduct').textContent = product.title;
  
  const descDiv = document.getElementById('detailDescription');
  descDiv.innerHTML = `<p>${product.description}</p>`;

  // Update thumbnails
  const thumbnailContainer = document.querySelector('.thumbnail-container');
  const productImages = product.images || [product.image, product.image, product.image, product.image];
  
  thumbnailContainer.innerHTML = '';
  productImages.forEach((imgSrc, index) => {
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.className = 'thumbnail' + (index === 0 ? ' active' : '');
    thumb.onclick = function() { changeImage(this); };
    thumbnailContainer.appendChild(thumb);
  });

  // Update available sizes
  updateSizeOptions(product);

  // Show product page
  document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
  const productPage = document.getElementById('productPage');
  if (productPage) productPage.classList.add('active');
  window.scrollTo(0, 0);
}

function updateSizeOptions(product) {
  const sizeOptionsContainer = document.querySelector('.size-options');
  if (!sizeOptionsContainer) return;
  
  sizeOptionsContainer.innerHTML = '';
  const allSizes = ["35", "36", "37", "38", "39", "40", "41", "42"];
  const availableSizes = product.sizes || [];
  let firstAvailableAdded = false;
  
  allSizes.forEach((size) => {
    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'size-option';
    sizeDiv.textContent = size;
    
    if (availableSizes.includes(size)) {
      sizeDiv.onclick = function() { selectSize(this); };
      
      if (!firstAvailableAdded) {
        sizeDiv.classList.add('active');
        selectedSize = size;
        firstAvailableAdded = true;
      }
    } else {
      sizeDiv.classList.add('disabled');
    }
    
    sizeOptionsContainer.appendChild(sizeDiv);
  });
}

// ============================================
// PRODUCT INTERACTION
// ============================================

window.changeImage = function(thumbnail) {
  document.getElementById('mainImage').src = thumbnail.src;
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
};

window.selectSize = function(element) {
  if (element.classList.contains('disabled')) return;
  
  document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
  element.classList.add('active');
  selectedSize = element.textContent;
};

window.selectColor = function(element) {
  if (element.classList.contains('disabled')) return;
  
  document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
  
  const colorName = element.getAttribute('data-color');
  const colorNameDisplay = colorName.charAt(0).toUpperCase() + colorName.slice(1);
  const colorNameEl = document.getElementById('selectedColorName');
  if (colorNameEl) colorNameEl.textContent = colorNameDisplay;
};

window.increaseQuantity = function() {
  quantity++;
  document.getElementById('quantity').textContent = quantity;
};

window.decreaseQuantity = function() {
  if (quantity > 1) {
    quantity--;
    document.getElementById('quantity').textContent = quantity;
  }
};

// ============================================
// CART FUNCTIONS - INTEGRATED WITH SHARED CART
// ============================================

window.addToCart = function(e) {
  if (e) e.stopPropagation();
  
  const productElement = e.target.closest('.product');
  if (!productElement) return;
  
  const productId = productElement.getAttribute('data-id');
  const product = productData[productId];
  if (!product) return;
  
  const cartItem = {
    title: product.title,
    price: product.price,
    image: product.image,
    size: (product.sizes && product.sizes[0]) || '35',
    quantity: 1
  };
  
  addToCartGlobal(cartItem);
  toggleCart();
};

window.addToCartFromDetail = function() {
  if (!currentProductData) return;
  
  const cartItem = {
    title: currentProductData.title,
    price: currentProductData.price,
    image: currentProductData.image,
    size: selectedSize,
    quantity: quantity
  };
  
  addToCartGlobal(cartItem);
  toggleCart();
  
  quantity = 1;
  document.getElementById('quantity').textContent = quantity;
};

// ============================================
// WISHLIST FUNCTIONS
// ============================================

window.toggleWishlistDetail = function() {
  if (!currentProductData) return;
  
  const productId = Object.keys(productData).find(
    key => productData[key].title === currentProductData.title
  );
  
  const isAdded = toggleWishlistItem(productId);
  
  const icon = document.getElementById('wishlistIconDetail');
  if (icon) {
    icon.style.color = isAdded ? '#e74c3c' : '';
  }
};

// ============================================
// FILTERS & SEARCH
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.querySelector('.products');
  if (!productsContainer) return;

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
    // Wishlist buttons
    document.querySelectorAll('.wishlist').forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll('.wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productElement = btn.closest('.product');
        const productId = productElement.getAttribute('data-id');
        
        const isAdded = toggleWishlistItem(productId);
        if (isAdded) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });

    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = document.getElementById('quickViewModal');
        document.getElementById('modalImage').src = button.dataset.image;
        document.getElementById('modalTitle').textContent = button.dataset.title;
        document.getElementById('modalDescription').textContent = button.dataset.description;
        document.getElementById('modalSizes').textContent = button.dataset.sizes || 'Standard';
        document.getElementById('modalStatus').textContent = button.dataset.status;
        document.getElementById('modalFeatures').textContent = button.dataset.features;
        modal.style.display = 'flex';
      });
    });

    // Product click to detail
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

  let selectedColors = [];
  let selectedSizes = [];

  // Color filters
  document.querySelectorAll('.color-filter').forEach(cb => {
    cb.addEventListener('change', function() {
      selectedColors = Array.from(document.querySelectorAll('.color-filter:checked')).map(i => i.value);
      applyFilters();
    });
  });

  // Size filters
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
      const matchesSize = selectedSizes.length === 0 || selectedSizes.some(size => productSizes.includes(size));

      product.style.display = (matchesQuery && matchesPrice && matchesColor && matchesSize) ? '' : 'none';
    });
  }

  // Search
  if (searchBtn) searchBtn.addEventListener('click', applyFilters);
  if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });
  if (sidebarSearch) sidebarSearch.addEventListener('keypress', (e) => { if (e.key === 'Enter') applyFilters(); });

  // Price range
  if (priceRange && priceBox) {
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
  }

  // Reset filters
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.color-filter, .size-filter').forEach(cb => cb.checked = false);
      selectedColors = [];
      selectedSizes = [];
      if (priceRange) priceRange.value = priceRange.max;
      if (priceBox) priceBox.value = priceRange.value;
      if (searchInput) searchInput.value = '';
      if (sidebarSearch) sidebarSearch.value = '';
      if (sortSelect) sortSelect.value = 'Default';
      productsContainer.innerHTML = '';
      originalOrder.forEach(clone => productsContainer.appendChild(clone.cloneNode(true)));
      attachProductListeners();
      applyFilters();
    });
  }

  // Sorting
  if (sortSelect) {
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
  }

  // View toggle
  if (gridBtn) {
    gridBtn.addEventListener('click', () => {
      productsContainer.classList.remove('list-view');
      gridBtn.classList.add('active');
      if (listBtn) listBtn.classList.remove('active');
    });
  }
  
  if (listBtn) {
    listBtn.addEventListener('click', () => {
      productsContainer.classList.add('list-view');
      listBtn.classList.add('active');
      if (gridBtn) gridBtn.classList.remove('active');
    });
  }

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const icon = themeToggle.querySelector('i');
      if (document.body.classList.contains('dark')) {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    });
  }

  // Sidebar toggle
  const toggleSidebar = document.querySelector('.toggle-sidebar');
  if (toggleSidebar) {
    toggleSidebar.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.classList.toggle('active');
    });
  }

  // Modal close
  const modal = document.getElementById("quickViewModal");
  const closeBtn = document.querySelector(".close");

  if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  applyFilters();
});

// Color option click handlers
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.color-option').forEach(colorOption => {
    colorOption.addEventListener('click', function() {
      selectColor(this);
    });
  });
});