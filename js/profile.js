/**
 * Profile Page JavaScript
 * Handles user profile management, orders, wishlist, and settings
 */

let currentUser = null;
let isEditMode = false;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  loadUserProfile();
  setupEventListeners();
  initializeCart();
});

// ============================================
// AUTHENTICATION
// ============================================

function checkAuthentication() {
  currentUser = getCurrentUser();

  if (!currentUser) {
    alert("⚠ Please login to view your profile");
    window.location.href = "login.html";
    return;
  }
}

// ============================================
// USER PROFILE
// ============================================

function loadUserProfile() {
  if (!currentUser) return;

  // Update sidebar
  document.getElementById(
    "profileName"
  ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("profileEmail").textContent = currentUser.email;

  // Set avatar initials
  const initials =
    `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
  document.getElementById("avatarInitials").textContent = initials;

  // Update personal info display
  document.getElementById("displayFirstName").textContent =
    currentUser.firstName;
  document.getElementById("displayLastName").textContent = currentUser.lastName;
  document.getElementById("displayEmail").textContent = currentUser.email;
  document.getElementById("displayPhone").textContent =
    currentUser.phone || "Not provided";

  // Format member since date
  if (currentUser.registeredDate) {
    const date = new Date(currentUser.registeredDate);
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    document.getElementById("displayMemberSince").textContent = formatted;
  }

  // Update header user link
  const userLink = document.getElementById("user-link");
  if (userLink) {
    userLink.innerHTML = `<i class="fa-solid fa-user"></i> <span>${currentUser.firstName}</span>`;
  }

  // Load user data
  loadOrders();
  loadWishlistItems();
  updateStatistics();
  updateLastLogin();
}

function updateLastLogin() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("lastLogin").textContent = `Today at ${timeString}`;
}

// ============================================
// SECTION NAVIGATION
// ============================================

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Update menu
  document.querySelectorAll(".profile-menu li").forEach((item) => {
    item.classList.remove("active");
  });
  event.target.closest("li").classList.add("active");
}

// ============================================
// EDIT PERSONAL INFO
// ============================================

function toggleEditMode() {
  isEditMode = true;
  document.getElementById("infoDisplay").style.display = "none";
  document.getElementById("editForm").style.display = "block";

  // Fill form with current data
  document.getElementById("editFirstName").value = currentUser.firstName;
  document.getElementById("editLastName").value = currentUser.lastName;
  document.getElementById("editEmail").value = currentUser.email;
  document.getElementById("editPhone").value = currentUser.phone || "";
}

function cancelEdit() {
  isEditMode = false;
  document.getElementById("infoDisplay").style.display = "block";
  document.getElementById("editForm").style.display = "none";
}

// Handle edit form submission
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const updatedData = {
    firstName: document.getElementById("editFirstName").value,
    lastName: document.getElementById("editLastName").value,
    email: document.getElementById("editEmail").value,
    phone: document.getElementById("editPhone").value,
  };

  // Update current user object
  currentUser = { ...currentUser, ...updatedData };

  // Save to storage
  const storage = localStorage.getItem("currentUser")
    ? localStorage
    : sessionStorage;
  storage.setItem("currentUser", JSON.stringify(currentUser));

  // Reload profile display
  loadUserProfile();
  cancelEdit();

  alert("✓ Profile updated successfully!");
});

// ============================================
// ORDERS MANAGEMENT
// ============================================

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const userOrders = orders.filter(
    (o) => o.customer?.email === currentUser.email
  );

  const container = document.getElementById("ordersContainer");
  const recentContainer = document.getElementById("recentOrdersContainer");

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <h3>No orders found</h3>
        <p>You haven't placed any orders yet</p>
        <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none; width: auto; padding: 12px 30px;">
          Start Shopping
        </a>
      </div>
    `;
    return;
  }

  // Render all orders
  container.innerHTML = userOrders
    .reverse()
    .map(
      (order) => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-number">${order.orderNumber}</div>
          <div class="order-date">${new Date(order.date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}</div>
        </div>
        <span class="status-badge status-${order.status
          .toLowerCase()
          .replace(" ", "-")}">
          ${order.status}
        </span>
      </div>
      
      <div class="order-items">
        ${order.items
          .slice(0, 2)
          .map(
            (item) => `
          <div class="order-item">
            <img src="${item.image}" class="order-item-image" alt="${item.title}">
            <div class="order-item-details">
              <h4>${item.title}</h4>
              <p>Qty: ${item.quantity} • ${item.price}</p>
            </div>
          </div>
        `
          )
          .join("")}
        ${
          order.items.length > 2 ? (
            <p style="color: #7f8c8d; font-size: 14px;">
              +${order.items.length - 2} more items
            </p>
          ) : (
            ""
          )
        }
      </div>
      
      <div class="order-footer">
        <div class="order-total">Total: NIS ${order.total.toFixed(2)}</div>
        <div class="order-actions">
          <button class="btn-small" onclick="viewOrderDetails('${
            order.orderNumber
          }')">
            <i class="fa-solid fa-eye"></i> View Details
          </button>
          <button class="btn-small" onclick="trackOrderByNumber('${
            order.orderNumber
          }')">
            <i class="fa-solid fa-truck"></i> Track
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Render recent orders (last 2 for overview)
  if (recentContainer) {
    recentContainer.innerHTML = userOrders
      .slice(0, 2)
      .map(
        (order) => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-number">${order.orderNumber}</div>
            <div class="order-date">${new Date(
              order.date
            ).toLocaleDateString()}</div>
          </div>
          <span class="status-badge status-${order.status
            .toLowerCase()
            .replace(" ", "-")}">
            ${order.status}
          </span>
        </div>
        <div class="order-footer">
          <div class="order-total">Total: NIS ${order.total.toFixed(2)}</div>
          <button class="btn-small" onclick="viewOrderDetails('${
            order.orderNumber
          }')">View</button>
        </div>
      </div>
    `
      )
      .join("");
  }
}

function viewOrderDetails(orderNumber) {
  window.location.href = `track_order.html?order=${orderNumber}`;
}

function trackOrderByNumber(orderNumber) {
  window.location.href = `track_order.html?order=${orderNumber}`;
}

// ============================================
// WISHLIST MANAGEMENT
// ============================================

function loadWishlistItems() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const userWishlist = wishlist.filter(
    (item) => item.userEmail === currentUser.email
  );

  const container = document.getElementById("wishlistContainer");

  if (userWishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-heart-crack"></i>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love to buy them later</p>
        <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none; width: auto; padding: 12px 30px;">
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML =
    '<div class="products" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;"></div>';

  const productsGrid = container.querySelector(".products");

  userWishlist.forEach((item) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
      <i class="fa-solid fa-heart wishlist active" onclick="removeFromWishlist('${item.id}')" style="color: #e74c3c; cursor: pointer;"></i>
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <div class="price">${item.price}</div>
      <div class="actions">
        <button onclick="addWishlistToCart('${item.id}')">Add to Cart</button>
      </div>
    `;
    productsGrid.appendChild(productDiv);
  });
}

function removeFromWishlist(itemId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  wishlist = wishlist.filter((item) => item.id !== itemId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  loadWishlistItems();
  updateStatistics();

  // Update wishlist badge
  const badge = document.getElementById("wishlist-count");
  if (badge) {
    const userWishlist = wishlist.filter(
      (item) => item.userEmail === currentUser.email
    );
    badge.textContent = userWishlist.length;
  }
}

function addWishlistToCart(itemId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const item = wishlist.find((i) => i.id === itemId);

  if (item) {
    addToCartGlobal({
      title: item.title,
      price: item.price,
      image: item.image,
      size: item.size || "37",
      quantity: 1,
    });

    alert("✓ Added to cart!");
  }
}

// ============================================
// STATISTICS
// ============================================

function updateStatistics() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const userOrders = orders.filter(
    (o) => o.customer?.email === currentUser.email
  );
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const userWishlist = wishlist.filter(
    (item) => item.userEmail === currentUser.email
  );

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  document.getElementById("totalOrders").textContent = userOrders.length;
  document.getElementById(
    "totalSpent"
  ).textContent = ` NIS ${totalSpent.toFixed(2)}`;
  document.getElementById("wishlistItems").textContent = userWishlist.length;
}

// ============================================
// ADDRESS MANAGEMENT
// ============================================

function addNewAddress() {
  alert(
    "💡 Add new address functionality\n\nThis would open a modal with a form to add a new shipping address."
  );
  // In production, you would open a modal with address form
}

// ============================================
// SECURITY / PASSWORD CHANGE
// ============================================

function handlePasswordChange(e) {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    alert("❌ New passwords do not match!");
    return;
  }

  // Validate password strength
  if (newPassword.length < 8) {
    alert("❌ Password must be at least 8 characters!");
    return;
  }

  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    alert("❌ Password must contain uppercase, lowercase, and numbers!");
    return;
  }

  // In production, this would call an API endpoint
  // For now, just show success message
  alert("✓ Password updated successfully!");
  document.getElementById("passwordForm").reset();
}

// ============================================
// LOGOUT
// ============================================

function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    logoutUser();
    window.location.href = "home.html";
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Avatar upload
  const avatarUpload = document.getElementById("avatarUpload");
  if (avatarUpload) {
    avatarUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please select an image file");
          return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert("Image size must be less than 2MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          const avatarDiv = document.querySelector(".profile-avatar");
          avatarDiv.innerHTML = `
            <img src="${event.target.result}" alt="Avatar">
            <div class="change-avatar-btn">
              <i class="fa-solid fa-camera"></i>
            </div>
          `;

          // Save to localStorage (in production, upload to server)
          localStorage.setItem("userAvatar", event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Theme toggle
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const icon = themeToggle.querySelector("i");
      icon.className = document.body.classList.contains("dark")
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
    });
  }

  // Load saved avatar
  const savedAvatar = localStorage.getItem("userAvatar");
  if (savedAvatar) {
    const avatarDiv = document.querySelector(".profile-avatar");
    avatarDiv.innerHTML = `
      <img src="${savedAvatar}" alt="Avatar">
      <div class="change-avatar-btn">
        <i class="fa-solid fa-camera"></i>
      </div>
    `;
  }
}

// ============================================
// CART TOGGLE
// ============================================

window.toggleCart = function () {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartSidebar && cartOverlay) {
    cartSidebar.classList.toggle("active");
    cartOverlay.classList.toggle("active");

    if (cartSidebar.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      updateCartDisplay();
    } else {
      document.body.style.overflow = "";
    }
  }
};

// ============================================
// GLOBAL EXPORTS
// ============================================

// Make functions available globally
window.showSection = showSection;
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.viewOrderDetails = viewOrderDetails;
window.trackOrderByNumber = trackOrderByNumber;
window.removeFromWishlist = removeFromWishlist;
window.addWishlistToCart = addWishlistToCart;
window.addNewAddress = addNewAddress;
window.handlePasswordChange = handlePasswordChange;
window.handleLogout = handleLogout;

console.log("✓ Profile page loaded successfully");
