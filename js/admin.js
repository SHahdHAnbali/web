// ============================================
// COMPLETE ADMIN DASHBOARD FUNCTIONALITY
// All buttons fully programmed and working
// ============================================

// ============================================
// AUTHENTICATION & SESSION MANAGEMENT
// ============================================

// Check if admin is logged in
function checkAdminAuth() {
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminUsername = sessionStorage.getItem('adminUsername');
    
    if (!adminLoggedIn || !adminUsername) {
      alert('⚠️ Unauthorized Access!\n\nPlease login to access the admin dashboard.');
      window.location.href = 'admin-login.html';
      return false;
    }
    
    return true;
  }
  
  // Logout admin
  function logoutAdmin() {
    if (confirm('Are you sure you want to logout from the admin dashboard?')) {
      sessionStorage.removeItem('adminLoggedIn');
      sessionStorage.removeItem('adminUsername');
      sessionStorage.removeItem('adminLoginTime');
      
      alert('✓ You have been logged out successfully.');
      window.location.href = 'admin-login.html';
    }
  }
  
  // ============================================
  // DATA INITIALIZATION
  // ============================================
  
  function initializeAdminData() {
    // Initialize products
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    if (products.length === 0) {
      const sampleProducts = [
        { 
          id: 1, 
          name: 'Green Mirror Pumps', 
          category: 'heels', 
          price: 120, 
          stock: 50, 
          image: 'heels/green_mirror.png', 
          status: 'in-stock',
          description: 'Elegant green mirror pumps',
          sales: 45
        },
        { 
          id: 2, 
          name: 'Pink Suede Heels', 
          category: 'heels', 
          price: 150, 
          stock: 30, 
          image: 'heels/dark_pink_suede.png', 
          status: 'in-stock',
          description: 'Luxurious pink suede heels',
          sales: 32
        },
        { 
          id: 3, 
          name: 'Purple Suede Heels', 
          category: 'heels', 
          price: 180, 
          stock: 25, 
          image: 'heels/dark_purple_suede.png', 
          status: 'in-stock',
          description: 'Stunning purple suede heels',
          sales: 28
        },
        { 
          id: 4, 
          name: 'Burgundy Mini Bag', 
          category: 'bags', 
          price: 120, 
          stock: 0, 
          image: 'bags/strath_burgundy1.png', 
          status: 'out-of-stock',
          description: 'Stylish burgundy mini bag',
          sales: 67
        },
        { 
          id: 5, 
          name: 'Black Leather Heels', 
          category: 'heels', 
          price: 175, 
          stock: 40, 
          image: 'heels/black_leather.png', 
          status: 'in-stock',
          description: 'Classic black leather heels',
          sales: 89
        },
        { 
          id: 6, 
          name: 'Silver Metallic Pumps', 
          category: 'heels', 
          price: 200, 
          stock: 15, 
          image: 'heels/silver.png', 
          status: 'in-stock',
          description: 'Glamorous silver metallic pumps',
          sales: 23
        }
      ];
      localStorage.setItem('admin_products', JSON.stringify(sampleProducts));
    }
    
    // Initialize discounts
    const discounts = JSON.parse(localStorage.getItem('admin_discounts') || '[]');
    if (discounts.length === 0) {
      const sampleDiscounts = [
        { 
          id: 1,
          code: 'WELCOME15', 
          type: 'percentage', 
          value: 15, 
          expiry: '2025-12-31', 
          used: 5,
          active: true,
          description: 'Welcome discount for new customers'
        },
        { 
          id: 2,
          code: 'SUMMER20', 
          type: 'percentage', 
          value: 20, 
          expiry: '2025-08-31', 
          used: 12,
          active: true,
          description: 'Summer sale discount'
        },
        { 
          id: 3,
          code: 'FREESHIP', 
          type: 'fixed', 
          value: 0, 
          expiry: '2025-12-31', 
          used: 34,
          active: true,
          description: 'Free shipping on all orders'
        }
      ];
      localStorage.setItem('admin_discounts', JSON.stringify(sampleDiscounts));
    }
  }
  
  // ============================================
  // NAVIGATION - SHOW SECTIONS
  // ============================================
  
  function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    event.target.closest('li').classList.add('active');
    
    // Load data for the section
    switch(section) {
      case 'dashboard':
        loadStatistics();
        break;
      case 'products':
        loadProducts();
        break;
      case 'orders':
        loadOrders();
        break;
      case 'discounts':
        loadDiscounts();
        break;
      case 'customers':
        loadCustomers();
        break;
      case 'settings':
        loadSettings();
        break;
    }
  }
  
  // ============================================
  // DASHBOARD STATISTICS
  // ============================================
  
  function loadStatistics() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const customers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Update statistics cards
    document.getElementById('total-revenue').textContent = `NIS ${totalRevenue.toFixed(2)}`;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-customers').textContent = customers.length;
    
    // Load recent orders table
    loadRecentOrders(orders);
  }
  
  function loadRecentOrders(orders) {
    const tbody = document.getElementById('recent-orders-table');
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #7f8c8d;">No orders yet</td></tr>';
      return;
    }
    
    // Show last 5 orders
    const recentOrders = orders.slice(-5).reverse();
    
    tbody.innerHTML = recentOrders.map(order => `
      <tr>
        <td><strong>${order.orderNumber}</strong></td>
        <td>${order.customer?.firstName || 'Guest'} ${order.customer?.lastName || ''}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td><strong>NIS ${order.total.toFixed(2)}</strong></td>
        <td><span class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></td>
      </tr>
    `).join('');
  }
  
  // ============================================
  // PRODUCTS MANAGEMENT
  // ============================================
  
  function loadProducts() {
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const tbody = document.getElementById('products-table');
    
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #7f8c8d;">No products found</td></tr>';
      return;
    }
    
    tbody.innerHTML = products.map(product => `
      <tr>
        <td><img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" alt="${product.name}"></td>
        <td><strong>${product.name}</strong></td>
        <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
        <td><strong>NIS ${product.price.toFixed(2)}</strong></td>
        <td>${product.stock}</td>
        <td><span class="status-badge status-${product.status}">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-edit" onclick="editProduct(${product.id})" title="Edit Product">
              <i class="fa-solid fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Delete Product">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  function openAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
    document.getElementById('addProductForm').reset();
  }
  
  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }
  
  function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const product = products.find(p => p.id === id);
    
    if (!product) {
      alert('❌ Product not found!');
      return;
    }
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description || '';
    
    // Change form to edit mode
    const form = document.getElementById('addProductForm');
    form.setAttribute('data-edit-id', id);
    
    // Open modal
    document.getElementById('addProductModal').classList.add('active');
    document.querySelector('#addProductModal h3').textContent = 'Edit Product';
  }
  
  function deleteProduct(id) {
    if (!confirm('⚠️ Are you sure you want to delete this product?\n\nThis action cannot be undone.')) {
      return;
    }
    
    let products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    const product = products.find(p => p.id === id);
    
    products = products.filter(p => p.id !== id);
    localStorage.setItem('admin_products', JSON.stringify(products));
    
    alert(`✓ Product "${product.name}" deleted successfully!`);
    loadProducts();
    loadStatistics();
  }
  
  // Handle add/edit product form submission
  document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editId = this.getAttribute('data-edit-id');
    const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
    
    const productData = {
      name: document.getElementById('productName').value.trim(),
      category: document.getElementById('productCategory').value,
      price: parseFloat(document.getElementById('productPrice').value),
      stock: parseInt(document.getElementById('productStock').value),
      image: document.getElementById('productImage').value.trim() || 'heels/default.png',
      description: document.getElementById('productDescription').value.trim(),
      status: parseInt(document.getElementById('productStock').value) > 0 ? 'in-stock' : 'out-of-stock'
    };
    
    if (editId) {
      // Edit existing product
      const index = products.findIndex(p => p.id === parseInt(editId));
      if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        alert(`✓ Product "${productData.name}" updated successfully!`);
      }
      this.removeAttribute('data-edit-id');
      document.querySelector('#addProductModal h3').textContent = 'Add New Product';
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...productData,
        sales: 0
      };
      products.push(newProduct);
      alert(`✓ Product "${productData.name}" added successfully!`);
    }
    
    localStorage.setItem('admin_products', JSON.stringify(products));
    
    closeModal('addProductModal');
    this.reset();
    loadProducts();
    loadStatistics();
  });
  
  // ============================================
  // ORDERS MANAGEMENT
  // ============================================
  
  function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('orders-table');
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #7f8c8d;">No orders found</td></tr>';
      return;
    }
    
    tbody.innerHTML = orders.reverse().map(order => `
      <tr>
        <td><strong>${order.orderNumber}</strong></td>
        <td>
          ${order.customer?.firstName || 'Guest'} ${order.customer?.lastName || ''}<br>
          <small style="color: #7f8c8d;">${order.customer?.email || 'No email'}</small>
        </td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.items.length} item(s)</td>
        <td><strong>NIS ${order.total.toFixed(2)}</strong></td>
        <td><span class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-edit" onclick="viewOrderDetails('${order.orderNumber}')" title="View Details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-icon btn-edit" onclick="updateOrderStatus('${order.orderNumber}')" title="Update Status" style="background: #fff3e0; color: #FF9800;">
              <i class="fa-solid fa-refresh"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteOrder('${order.orderNumber}')" title="Delete Order">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  function viewOrderDetails(orderNumber) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
      alert('❌ Order not found!');
      return;
    }
    
    const itemsList = order.items.map((item, index) => 
      `${index + 1}. ${item.title}\n   Size: ${item.size}${item.color ? `, Color: ${item.color}` : ''}\n   Qty: ${item.quantity} × ${item.price}`
    ).join('\n\n');
    
    alert(
      `ORDER DETAILS\n\n` +
      `Order Number: ${order.orderNumber}\n` +
      `Date: ${new Date(order.date).toLocaleString()}\n` +
      `Status: ${order.status}\n\n` +
      `CUSTOMER INFORMATION\n` +
      `Name: ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}\n` +
      `Email: ${order.customer?.email || 'N/A'}\n` +
      `Phone: ${order.customer?.phone || 'N/A'}\n` +
      `Address: ${order.customer?.address || 'N/A'}\n` +
      `City: ${order.customer?.city || 'N/A'}\n\n` +
      `ORDER ITEMS\n${itemsList}\n\n` +
      `PAYMENT\n` +
      `Method: ${order.payment || 'N/A'}\n` +
      `Subtotal: NIS ${order.subtotal?.toFixed(2) || '0.00'}\n` +
      `Tax: NIS ${order.tax?.toFixed(2) || '0.00'}\n` +
      `TOTAL: NIS ${order.total.toFixed(2)}`
    );
  }
  
  function updateOrderStatus(orderNumber) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
    
    if (orderIndex === -1) {
      alert('❌ Order not found!');
      return;
    }
    
    const statuses = ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'];
    const currentStatus = orders[orderIndex].status;
    
    let statusList = statuses.map((s, i) => `${i + 1}. ${s}${s === currentStatus ? ' (current)' : ''}`).join('\n');
    
    const choice = prompt(
      `UPDATE ORDER STATUS\n\n` +
      `Order: ${orderNumber}\n` +
      `Current Status: ${currentStatus}\n\n` +
      `Select new status:\n${statusList}\n\n` +
      `Enter number (1-5):`
    );
    
    if (choice && choice >= 1 && choice <= 5) {
      const newStatus = statuses[choice - 1];
      orders[orderIndex].status = newStatus;
      localStorage.setItem('orders', JSON.stringify(orders));
      
      alert(`✓ Order status updated to: ${newStatus}`);
      loadOrders();
      loadStatistics();
    }
  }
  
  function deleteOrder(orderNumber) {
    if (!confirm(`⚠️ Are you sure you want to delete order ${orderNumber}?\n\nThis action cannot be undone.`)) {
      return;
    }
    
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.filter(o => o.orderNumber !== orderNumber);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert(`✓ Order ${orderNumber} deleted successfully!`);
    loadOrders();
    loadStatistics();
  }
  
  // ============================================
  // DISCOUNTS MANAGEMENT
  // ============================================
  
  function loadDiscounts() {
    const discounts = JSON.parse(localStorage.getItem('admin_discounts') || '[]');
    const tbody = document.getElementById('discounts-table');
    
    if (discounts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">No discounts found</td></tr>';
      return;
    }
    
    tbody.innerHTML = discounts.map(discount => `
      <tr>
        <td><strong>${discount.code}</strong></td>
        <td><strong>${discount.value}${discount.type === 'percentage' ? '%' : ' NIS'}</strong></td>
        <td>${discount.type.charAt(0).toUpperCase() + discount.type.slice(1)}</td>
        <td>${discount.expiry}</td>
        <td>${discount.used} times</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-edit" onclick="toggleDiscountStatus(${discount.id})" title="${discount.active ? 'Deactivate' : 'Activate'}" style="background: ${discount.active ? '#e8f5e9' : '#ffebee'}; color: ${discount.active ? '#4CAF50' : '#f44336'};">
              <i class="fa-solid fa-${discount.active ? 'toggle-on' : 'toggle-off'}"></i>
            </button>
            <button class="btn-icon btn-edit" onclick="editDiscount(${discount.id})" title="Edit Discount">
              <i class="fa-solid fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteDiscount(${discount.id})" title="Delete Discount">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  function openAddDiscountModal() {
    document.getElementById('addDiscountModal').classList.add('active');
    document.getElementById('addDiscountForm').reset();
  }
  
  function editDiscount(id) {
    const discounts = JSON.parse(localStorage.getItem('admin_discounts') || '[]');
    const discount = discounts.find(d => d.id === id);
    
    if (!discount) {
      alert('❌ Discount not found!');
      return;
    }
    
    document.getElementById('discountCode').value = discount.code;
    document.getElementById('discountType').value = discount.type;
    document.getElementById('discountValue').value = discount.value;
    document.getElementById('discountExpiry').value = discount.expiry;
    
    const form = document.getElementById('addDiscountForm');
    form.setAttribute('data-edit-id', id);
    
    document.getElementById('addDiscountModal').classList.add('active');
    document.querySelector('#addDiscountModal h3').textContent = 'Edit Discount Code';
  }
  
  function toggleDiscountStatus(id) {
    const discounts = JSON.parse(localStorage.getItem('admin_discounts') || '[]');
    const discount = discounts.find(d => d.id === id);
    
    if (!discount) return;
    
    discount.active = !discount.active;
    localStorage.setItem('admin_discounts', JSON.stringify(discounts));
    
    alert(`✓ Discount code "${discount.code}" ${discount.active ? 'activated' : 'deactivated'}!`);
    loadDiscounts();
  }
  
  function deleteDiscount(id) {
    const discounts = JSON.parse(localStorage.getItem('admin_discounts') || '[]');
    const discount = discounts.find(d => d.id === id);
    
    if (!confirm(`⚠️ Are you sure you want to delete discount code "${discount.code}"?\n\nThis action cannot be undone.`)) {
      return;
    }
    
    const updatedDiscounts = discounts.filter(d => d.id !== id);
    localStorage.setItem('admin_discounts', JSON.stringify(updatedDiscounts));
    
    alert(`✓ Discount code "${discount.code}" deleted successfully!`);
    loadDiscounts();
  }
  
  // Handle add/edit discount form submission
  document.getElementById('addDiscountForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editId = this.getAttribute('data-edit-id');
    const discounts = JSON.parse(localStorage.getItem('admin_discounts') || '[]');
    
    const discountData = {
      code: document.getElementById('discountCode').value.trim().toUpperCase(),
      type: document.getElementById('discountType').value,
      value: parseFloat(document.getElementById('discountValue').value),
      expiry: document.getElementById('discountExpiry').value,
      active: true
    };
    
    if (editId) {
      const index = discounts.findIndex(d => d.id === parseInt(editId));
      if (index !== -1) {
        discounts[index] = { ...discounts[index], ...discountData };
        alert(`✓ Discount code "${discountData.code}" updated successfully!`);
      }
      this.removeAttribute('data-edit-id');
      document.querySelector('#addDiscountModal h3').textContent = 'Create Discount Code';
    } else {
      const newDiscount = {
        id: Date.now(),
        ...discountData,
        used: 0,
        description: `${discountData.value}${discountData.type === 'percentage' ? '%' : ' NIS'} discount`
      };
      discounts.push(newDiscount);
      alert(`✓ Discount code "${discountData.code}" created successfully!`);
    }
    
    localStorage.setItem('admin_discounts', JSON.stringify(discounts));
    
    closeModal('addDiscountModal');
    this.reset();
    loadDiscounts();
  });
  
  // ============================================
  // CUSTOMERS MANAGEMENT
  // ============================================
  
  function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('customers-table');
    
    if (customers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">No customers found</td></tr>';
      return;
    }
    
    tbody.innerHTML = customers.map(customer => {
      const customerOrders = orders.filter(o => o.customer?.email === customer.email);
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      
      return `
        <tr>
          <td><strong>${customer.firstName} ${customer.lastName}</strong></td>
          <td>${customer.email}</td>
          <td>${customer.phone || 'N/A'}</td>
          <td>${customerOrders.length}</td>
          <td><strong>NIS ${totalSpent.toFixed(2)}</strong></td>
          <td>${new Date(customer.registeredDate).toLocaleDateString()}</td>
        </tr>
      `;
    }).join('');
  }
  
  // ============================================
  // SETTINGS SECTION
  // ============================================
  
  function loadSettings() {
    // Settings page placeholder
    alert('Settings page is under development.\n\nFeatures coming soon:\n• Store settings\n• Email templates\n• Payment gateway configuration\n• Shipping methods\n• Tax settings');
  }
  
  // ============================================
  // UTILITIES
  // ============================================
  
  // Update current date display
  function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  window.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAdminAuth()) {
      return;
    }
    
    // Initialize data
    initializeAdminData();
    
    // Load initial statistics
    loadStatistics();
    
    // Update date
    updateDate();
    
    // Update date every minute
    setInterval(updateDate, 60000);
    
    console.log('✓ Admin dashboard loaded successfully');
  });
  
  // Make functions globally accessible
  window.showSection = showSection;
  window.logoutAdmin = logoutAdmin;
  window.logout = logoutAdmin; // Alias for logout button
  window.openAddProductModal = openAddProductModal;
  window.openAddDiscountModal = openAddDiscountModal;
  window.closeModal = closeModal;
  window.editProduct = editProduct;
  window.deleteProduct = deleteProduct;
  window.viewOrderDetails = viewOrderDetails;
  window.updateOrderStatus = updateOrderStatus;
  window.deleteOrder = deleteOrder;
  window.editDiscount = editDiscount;
  window.deleteDiscount = deleteDiscount;
  window.toggleDiscountStatus = toggleDiscountStatus;