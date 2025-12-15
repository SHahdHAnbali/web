// ملف products.js - للتعامل مع API المنتجات

const API_URL = 'products.php';

// جلب جميع المنتجات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// إعداد المستمعين
function setupEventListeners() {
    // البحث
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const sidebarSearch = document.getElementById('sidebar-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });
    }
    
    if (sidebarSearch) {
        sidebarSearch.addEventListener('input', handleSearch);
    }
    
    // الفلاتر
    const priceRange = document.getElementById('price-range');
    const priceBox = document.getElementById('price-box');
    
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            priceBox.value = this.value;
            applyFilters();
        });
    }
    
    if (priceBox) {
        priceBox.addEventListener('input', function() {
            priceRange.value = this.value;
            applyFilters();
        });
    }
    
    // فلاتر الألوان والأحجام
    document.querySelectorAll('.color-filter, .size-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // زر إعادة تعيين
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // الترتيب
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', sortProducts);
    }
}

// جلب المنتجات من API
async function loadProducts(category = null) {
    try {
        showLoading();
        
        let url = API_URL + '?action=list';
        if (category) {
            url += `&category=${category}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        } else {
            console.error('Error loading products:', data.message);
            showError('Failed to load products');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Network error');
    } finally {
        hideLoading();
    }
}

// عرض المنتجات
function displayProducts(products) {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return;
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    productsContainer.innerHTML = products.map(product => {
        const mainImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'heels/placeholder.png';
        
        const sizesData = product.availableSizes.join(',');
        const price = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
            ? `NIS ${product.minPrice} - ${product.maxPrice}`
            : `NIS ${product.price}`;
        
        return `
            <div class="product" 
                 data-id="${product.id}" 
                 data-color="${product.availableColors[0] || ''}"
                 data-sizes="${sizesData}"
                 data-price="${product.price}">
                <i class="fa-solid fa-heart wishlist" onclick="toggleWishlist(event, ${product.id})"></i>
                ${product.isNew ? '<span class="badge new-badge">NEW</span>' : ''}
                ${product.isOnSale ? '<span class="badge sale-badge">SALE</span>' : ''}
                <img src="${mainImage}" alt="${product.name}" onclick="viewProduct(${product.id})">
                <h3>${product.name}</h3>
                <div class="price">${price}</div>
                <div class="rating">★★★★★</div>
                <div class="actions">
                    <button onclick="addToCartQuick(${product.id})">Add to Cart</button>
                    <button class="quick-view-btn" onclick="quickView(${product.id})">Quick View</button>
                </div>
            </div>
        `;
    }).join('');
}

// عرض تفاصيل المنتج
async function viewProduct(productId) {
    try {
        const response = await fetch(`${API_URL}?action=detail&id=${productId}`);
        const data = await response.json();
        
        if (data.success) {
            const product = data.product;
            
            // إخفاء صفحة المتجر وإظهار صفحة التفاصيل
            document.getElementById('shopPage').classList.remove('active');
            document.getElementById('productPage').classList.add('active');
            
            // تحديث العناصر
            document.getElementById('detailTitle').textContent = product.name;
            document.getElementById('detailDescription').innerHTML = product.description || '';
            document.getElementById('detailPrice').textContent = `NIS ${product.price}`;
            document.getElementById('breadcrumbProduct').textContent = product.name;
            
            // تحديث الصور
            const mainImage = document.getElementById('mainImage');
            const thumbnailContainer = document.querySelector('.thumbnail-container');
            
            if (product.images && product.images.length > 0) {
                mainImage.src = product.images[0];
                
                thumbnailContainer.innerHTML = product.images.map((img, index) => `
                    <img src="${img}" 
                         class="thumbnail ${index === 0 ? 'active' : ''}" 
                         onclick="changeImage(this)">
                `).join('');
            }
            
            // تحديث الأحجام المتاحة
            displayAvailableSizes(product.availableSizes);
            
            // تحديث الألوان المتاحة
            displayAvailableColors(product.availableColors);
            
            // حفظ بيانات المنتج الحالي
            window.currentProduct = product;
            
            // التمرير للأعلى
            window.scrollTo(0, 0);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load product details');
    }
}

// عرض الأحجام المتاحة
function displayAvailableSizes(sizes) {
    const sizeOptionsContainer = document.querySelector('.size-options');
    if (!sizeOptionsContainer) return;
    
    sizeOptionsContainer.innerHTML = sizes.map(size => `
        <div class="size-option" data-size="${size}">${size}</div>
    `).join('');
    
    // إضافة حدث النقر على الأحجام
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.size-option').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// عرض الألوان المتاحة
function displayAvailableColors(colors) {
    const colorOptionsContainer = document.getElementById('colorOptions');
    if (!colorOptionsContainer) return;
    
    colorOptionsContainer.innerHTML = colors.map((color, index) => `
        <div class="color-option ${index === 0 ? 'active' : ''}" 
             data-color="${color}" 
             title="${color}"
             style="background-color: ${getColorCode(color)}"></div>
    `).join('');
    
    // إضافة حدث النقر على الألوان
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('selectedColorName').textContent = this.getAttribute('title');
        });
    });
}

// الحصول على كود اللون
function getColorCode(colorName) {
    const colorMap = {
        'red': '#e74c3c',
        'orange': '#e67e22',
        'yellow': '#f39c12',
        'green': '#27ae60',
        'blue': '#3498db',
        'purple': '#9b59b6',
        'pink': '#e91e63',
        'black': '#2c3e50',
        'white': '#ecf0f1',
        'gold': '#f1c40f',
        'silver': '#bdc3c7',
        'mirror green': '#1abc9c'
    };
    
    const normalized = colorName.toLowerCase();
    return colorMap[normalized] || '#95a5a6';
}

// البحث عن المنتجات
async function handleSearch() {
    const searchTerm = document.getElementById('search-input')?.value || 
                      document.getElementById('sidebar-search')?.value || '';
    
    if (searchTerm.trim() === '') {
        loadProducts();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?action=search&q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// تطبيق الفلاتر
async function applyFilters() {
    const maxPrice = document.getElementById('price-box')?.value || 500;
    const selectedColors = Array.from(document.querySelectorAll('.color-filter:checked'))
        .map(cb => cb.value);
    const selectedSizes = Array.from(document.querySelectorAll('.size-filter:checked'))
        .map(cb => cb.value);
    
    let url = `${API_URL}?action=search&max_price=${maxPrice}`;
    
    if (selectedColors.length > 0) {
        url += `&color=${selectedColors[0]}`; // للبساطة، نأخذ اللون الأول فقط
    }
    
    if (selectedSizes.length > 0) {
        url += `&size=${selectedSizes[0]}`; // للبساطة، نأخذ الحجم الأول فقط
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('price-box').value = 500;
    document.getElementById('price-range').value = 500;
    document.querySelectorAll('.color-filter, .size-filter').forEach(cb => cb.checked = false);
    document.getElementById('sidebar-search').value = '';
    loadProducts();
}

// ترتيب المنتجات
function sortProducts() {
    const sortBy = document.getElementById('sort-by').value;
    const products = Array.from(document.querySelectorAll('.product'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        
        if (sortBy === 'Price: Low to High') {
            return priceA - priceB;
        } else if (sortBy === 'Price: High to Low') {
            return priceB - priceA;
        }
        return 0;
    });
    
    const container = document.querySelector('.products');
    products.forEach(product => container.appendChild(product));
}

// إضافة إلى السلة بسرعة
async function addToCartQuick(productId) {
    try {
        const response = await fetch(`${API_URL}?action=detail&id=${productId}`);
        const data = await response.json();
        
        if (data.success) {
            // هنا يمكنك استدعاء دالة إضافة إلى السلة من cart.js
            console.log('Adding to cart:', data.product);
            alert('Product added to cart!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// عرض سريع
async function quickView(productId) {
    try {
        const response = await fetch(`${API_URL}?action=detail&id=${productId}`);
        const data = await response.json();
        
        if (data.success) {
            const product = data.product;
            
            // تحديث المودال
            document.getElementById('modalTitle').textContent = product.name;
            document.getElementById('modalDescription').textContent = product.description || '';
            document.getElementById('modalImage').src = product.images[0] || 'heels/placeholder.png';
            document.getElementById('modalSizes').textContent = product.availableSizes.join(', ');
            document.getElementById('modalStatus').textContent = 'In Stock';
            document.getElementById('modalFeatures').textContent = 'Free shipping, Premium quality';
            
            // إظهار المودال
            document.getElementById('quickViewModal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// إضافة/إزالة من قائمة الأمنيات
function toggleWishlist(event, productId) {
    event.stopPropagation();
    const icon = event.target;
    icon.classList.toggle('active');
    
    // هنا يمكنك إضافة كود حفظ في localStorage أو إرسال إلى API
    console.log('Wishlist toggled for product:', productId);
}

// دوال مساعدة
function showLoading() {
    const container = document.querySelector('.products');
    if (container) {
        container.innerHTML = '<div class="loading">Loading products...</div>';
    }
}

function hideLoading() {
    // يتم إخفاء التحميل تلقائياً عند عرض المنتجات
}

function showError(message) {
    const container = document.querySelector('.products');
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// تغيير الصورة في صفحة التفاصيل
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumbnail.src;
    
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// التحكم بالكمية
function increaseQuantity() {
    const quantityEl = document.getElementById('quantity');
    let quantity = parseInt(quantityEl.textContent);
    quantityEl.textContent = quantity + 1;
}

function decreaseQuantity() {
    const quantityEl = document.getElementById('quantity');
    let quantity = parseInt(quantityEl.textContent);
    if (quantity > 1) {
        quantityEl.textContent = quantity - 1;
    }
}

// إضافة إلى السلة من صفحة التفاصيل
function addToCartFromDetail() {
    const selectedSize = document.querySelector('.size-option.active');
    const selectedColor = document.querySelector('.color-option.active');
    const quantity = parseInt(document.getElementById('quantity').textContent);
    
    if (!selectedSize) {
        alert('Please select a size');
        return;
    }
    
    console.log('Adding to cart:', {
        product: window.currentProduct,
        size: selectedSize.dataset.size,
        color: selectedColor?.dataset.color,
        quantity: quantity
    });
    
    alert('Product added to cart!');
}

// إغلاق المودال
document.querySelector('.close')?.addEventListener('click', function() {
    document.getElementById('quickViewModal').style.display = 'none';
});

window.onclick = function(event) {
    const modal = document.getElementById('quickViewModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}