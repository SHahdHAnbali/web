// ============================================
// FIXED HOME.JS - Homepage with Working Quick Add
// Requires: cart.js, auth.js
// ============================================

// Product data for quick add functionality
const homeProducts = {
  "Green Mirror Pumps": {
    title: "Green Mirror Pumps",
    price: "NIS 120.00",
    image: "heels/green_mirror.png",
    size: "35",
  },
  "Pink Suede Heels": {
    title: "Pink Suede Heels",
    price: "NIS 150.00",
    image: "heels/dark_pink_suede.png",
    size: "36",
  },
  "Purple Suede Heels": {
    title: "Purple Suede Heels",
    price: "NIS 180.00",
    image: "heels/dark_purple_suede.png",
    size: "37",
  },
  "Burgundy Mini Bag": {
    title: "Burgundy Mini Bag",
    price: "NIS 120.00",
    image: "bags/strath_burgundy1.png",
    size: "mini bag",
  },
  "Classic Black Leather": {
    title: "Classic Black Leather",
    price: "NIS 180.00",
    image: "heels/black_leather.png",
    size: "38",
  },
  "Silver Metallic Pumps": {
    title: "Silver Metallic Pumps",
    price: "NIS 200.00",
    image: "heels/silver.png",
    size: "37",
  },
  "Red Suede Elegance": {
    title: "Red Suede Elegance",
    price: "NIS 196.00",
    image: "heels/dark_red_suede.png",
    size: "36",
  },
};

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
const indicators = document.querySelectorAll(".indicator");

function changeSlide(direction) {
  slides[currentSlide].classList.remove("active");
  indicators[currentSlide].classList.remove("active");

  currentSlide = (currentSlide + direction + slides.length) % slides.length;

  slides[currentSlide].classList.add("active");
  indicators[currentSlide].classList.add("active");
}

function goToSlide(index) {
  slides[currentSlide].classList.remove("active");
  indicators[currentSlide].classList.remove("active");

  currentSlide = index;

  slides[currentSlide].classList.add("active");
  indicators[currentSlide].classList.add("active");
}

// Auto slide every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

// Make functions global
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;

// Countdown Timer - FIXED
function updateCountdown() {
  // Get or set sale end date (7 days from first visit)
  let endDate = localStorage.getItem("saleEndDate");

  if (!endDate) {
    // First time - set sale end date to 7 days from now
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 7);
    endDate = newEndDate.getTime();
    localStorage.setItem("saleEndDate", endDate);
  } else {
    endDate = parseInt(endDate);
  }

  const now = new Date().getTime();
  const distance = endDate - now;

  // Check if sale has ended
  if (distance < 0) {
    // Sale ended - reset for new sale (7 days from now)
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 7);
    localStorage.setItem("saleEndDate", newEndDate.getTime());
    updateCountdown();
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Newsletter form handler - FIXED with email simulation
window.handleNewsletter = function (event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;

  const subscriptions = JSON.parse(
    localStorage.getItem("newsletterSubscriptions") || "[]"
  );

  if (subscriptions.includes(email)) {
    alert("You are already subscribed to our newsletter!");
    return;
  }

  subscriptions.push(email);
  localStorage.setItem(
    "newsletterSubscriptions",
    JSON.stringify(subscriptions)
  );

  // Simulate sending email
  showEmailSimulation(email);

  event.target.reset();
};

// Simulate email being sent
function showEmailSimulation(email) {
  // Create email preview overlay
  const emailOverlay = document.createElement("div");
  emailOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    animation: fadeIn 0.3s ease;
  `;

  const emailBox = document.createElement("div");
  emailBox.style.cssText = `
    background: white;
    max-width: 600px;
    width: 90%;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
    max-height: 80vh;
    overflow-y: auto;
  `;

  emailBox.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #27ae60, #2ecc71); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
        <i class="fa-solid fa-check" style="font-size: 40px; color: white;"></i>
      </div>
      <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 28px;">Email Sent!</h2>
      <p style="color: #7f8c8d; margin: 0;">Check your inbox at <strong>${email}</strong></p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; border: 2px solid #e8ecef;">
      <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
        <h3 style="margin: 0 0 15px 0; color: #2c3e50;">
          <img src="heels/logo1.png" alt="Stilleto" style="height: 40px; vertical-align: middle;">
        </h3>
        <hr style="border: none; border-top: 2px solid #e8ecef; margin: 20px 0;">
        
        <h2 style="color: #8C28B6; margin: 20px 0;">Welcome to Stilleto! 🎉</h2>
        
        <p style="color: #555; line-height: 1.8; margin: 15px 0;">
          Thank you for subscribing to our newsletter! We're thrilled to have you as part of our fashion community.
        </p>
        
        <div style="background: linear-gradient(135deg, #8C28B6, #c0392b); padding: 20px; border-radius: 10px; color: white; text-align: center; margin: 25px 0;">
          <h3 style="margin: 0 0 10px 0; font-size: 24px;">Your Welcome Gift 🎁</h3>
          <p style="margin: 10px 0; font-size: 32px; font-weight: bold; letter-spacing: 2px;">WELCOME15</p>
          <p style="margin: 10px 0; opacity: 0.9;">Use this code for 15% off your first order!</p>
        </div>
        
        <h4 style="color: #2c3e50; margin: 25px 0 15px 0;">What You'll Receive:</h4>
        <ul style="color: #555; line-height: 2; padding-left: 20px;">
          <li>✨ Exclusive early access to new collections</li>
          <li>🎉 Special subscriber-only promotions</li>
          <li>💎 Style tips and fashion inspiration</li>
          <li>🎁 Birthday surprises and rewards</li>
          <li>👠 Behind-the-scenes content</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="heels.html" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #8C28B6, #c0392b); color: white; text-decoration: none; border-radius: 50px; font-weight: 600;">
            Start Shopping Now
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e8ecef; margin: 25px 0;">
        
        <p style="color: #95a5a6; font-size: 12px; text-align: center; margin: 15px 0;">
          Follow us on social media for daily inspiration<br>
          📱 Instagram | 👍 Facebook | 🐦 Twitter
        </p>
        
        <p style="color: #95a5a6; font-size: 11px; text-align: center; margin: 10px 0;">
          You're receiving this email because you subscribed at stilleto.com<br>
          <a href="#" style="color: #8C28B6;">Unsubscribe</a> | <a href="#" style="color: #8C28B6;">Manage Preferences</a>
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <button onclick="this.closest('[style*=fixed]').remove()" style="padding: 12px 40px; background: #2c3e50; color: white; border: none; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 16px;">
        Close Preview
      </button>
    </div>
  `;

  emailOverlay.appendChild(emailBox);
  document.body.appendChild(emailOverlay);

  // Auto-close after 15 seconds
  setTimeout(() => {
    if (emailOverlay.parentNode) {
      emailOverlay.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => emailOverlay.remove(), 300);
    }
  }, 15000);

  // Close on overlay click
  emailOverlay.onclick = function (e) {
    if (e.target === emailOverlay) {
      emailOverlay.remove();
    }
  };
}

// Add animation styles
const animationStyles = document.createElement("style");
animationStyles.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(animationStyles);

// Theme toggle
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const icon = themeToggle.querySelector("i");
      if (document.body.classList.contains("dark")) {
        icon.className = "fa-solid fa-sun";
      } else {
        icon.className = "fa-solid fa-moon";
      }
    });
  }

  // Initialize Quick Add buttons with cart integration
  initializeQuickAddButtons();

  // Initialize wishlist icons
  initializeWishlistIcons();
});

// Initialize Quick Add buttons - FIXED VERSION
function initializeQuickAddButtons() {
  document.querySelectorAll(".quick-add-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const productCard =
        this.closest(".product-card-home") || this.closest(".featured-product");
      if (!productCard) return;

      const productName = productCard.querySelector("h4").textContent.trim();
      const priceElement = productCard.querySelector(
        ".product-price-home, .sale-price"
      );

      if (!priceElement) return;

      const productPrice = priceElement.textContent.trim();

      // Get product data from our database
      const product = homeProducts[productName];

      if (!product) {
        console.warn("Product not found:", productName);
        // Fallback: use data from card
        const productImage = productCard.querySelector("img");
        addToCartGlobal({
          title: productName,
          price: productPrice,
          image: productImage ? productImage.src : "heels/default.png",
          size: "37",
          quantity: 1,
        });
      } else {
        // Use product data from database
        addToCartGlobal({
          title: product.title,
          price: product.price,
          image: product.image,
          size: product.size,
          quantity: 1,
        });
      }

      // Visual feedback - button animation
      const originalText = this.textContent;
      this.textContent = "✓ Added!";
      this.style.background = "#27ae60";

      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = "";
      }, 1500);

      // Show notification
      showNotification(`${productName} added to cart!`);

      // Animate cart badge
      const cartBadge = document.getElementById("cart-count");
      if (cartBadge) {
        cartBadge.classList.add("animate");
        setTimeout(() => cartBadge.classList.remove("animate"), 300);
      }
    });
  });
}

// Initialize wishlist functionality
function initializeWishlistIcons() {
  document.querySelectorAll(".wishlist-icon").forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");

      if (this.classList.contains("active")) {
        this.style.color = "#e74c3c";
        this.style.backgroundColor = "#fee";
      } else {
        this.style.color = "";
        this.style.backgroundColor = "white";
      }

      // Update wishlist count
      const activeWishlists = document.querySelectorAll(
        ".wishlist-icon.active"
      ).length;
      const wishlistBadge = document.getElementById("wishlist-count");
      if (wishlistBadge) {
        wishlistBadge.textContent = activeWishlists;
        wishlistBadge.classList.add("animate");
        setTimeout(() => wishlistBadge.classList.remove("animate"), 300);
      }
    });
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add animation keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe sections for animation
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(
    ".features-section, .categories-section, .new-arrivals-section, .discount-section, .featured-section, .bespoke-banner, .testimonials-section, .instagram-section, .newsletter-section"
  );

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
});

// Product card click to view details
document
  .querySelectorAll(".product-card-home, .featured-product")
  .forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't navigate if clicking wishlist or quick add button
      if (
        e.target.closest(".wishlist-icon") ||
        e.target.closest(".quick-add-btn")
      ) {
        return;
      }
      window.location.href = "heels.html";
    });
  });

// Parallax effect for hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroSlides = document.querySelectorAll(".hero-slide");

  heroSlides.forEach((slide) => {
    if (slide.classList.contains("active")) {
      slide.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
});

// Lazy loading images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Mobile menu toggle
document
  .querySelector(".toggle-sidebar")
  ?.addEventListener("click", function () {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("active");
    }
  });

// Featured product hover effect
document
  .querySelectorAll(".featured-product, .product-card-home")
  .forEach((product) => {
    product.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    product.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

// Category card tilt effect
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("mousemove", function (e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener("mouseleave", function () {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});

// Instagram grid hover effect
document.querySelectorAll(".instagram-item").forEach((item) => {
  item.addEventListener("click", function () {
    window.open("https://instagram.com/stilleto", "_blank");
  });
});

// Auto-update year in footer
const yearElements = document.querySelectorAll("footer p");
yearElements.forEach((el) => {
  if (el.textContent.includes("2025")) {
    const currentYear = new Date().getFullYear();
    el.textContent = el.textContent.replace("2025", currentYear);
  }
});

// Store scroll position
window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("scrollPosition", window.scrollY);
});

// Restore scroll position
window.addEventListener("load", function () {
  const scrollPosition = sessionStorage.getItem("scrollPosition");
  if (scrollPosition) {
    window.scrollTo(0, parseInt(scrollPosition));
    sessionStorage.removeItem("scrollPosition");
  }
});

// Add visual feedback for all clickable elements
document
  .querySelectorAll(
    "a, button, .product-card-home, .featured-product, .category-card"
  )
  .forEach((element) => {
    element.style.cursor = "pointer";
    element.style.transition = "all 0.3s ease";
  });

// Performance optimization: Debounce scroll events
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

// Optimized scroll handler
const handleScroll = debounce(function () {
  const scrolled = window.pageYOffset;

  // Add header shadow on scroll
  const header = document.querySelector(".header");
  if (header) {
    if (scrolled > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
    } else {
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }
  }
}, 10);

window.addEventListener("scroll", handleScroll);

// Console welcome message
console.log(
  "%c Welcome to Stilleto! ",
  "background: linear-gradient(135deg, #8C28B6 0%, #c0392b 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;"
);
console.log(
  "%c Handcrafted luxury heels & bags from Italy ",
  "color: #8C28B6; font-size: 14px; padding: 5px;"
);

// ============================================
// NAVIGATION FUNCTIONS FOR HOME PAGE BUTTONS
// ============================================

// View All button in New Arrivals section
window.viewAllProducts = function () {
  window.location.href = "heels.html";
};

// Shop Sale button in discount section
window.shopSale = function () {
  // Navigate to shop page with sale filter
  sessionStorage.setItem("filterBySale", "true");
  window.location.href = "heels.html";
};

// Category navigation functions
window.goToCategory = function (category) {
  sessionStorage.setItem("filterCategory", category);
  if (category === "bags") {
    window.location.href = "bags.html";
  } else if (category === "bespoke") {
    window.location.href = "made_to_order.html";
  } else {
    window.location.href = "heels.html";
  }
};

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Animate elements on load
  setTimeout(() => {
    document.querySelectorAll(".hero-content").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, 100);

  // Initialize tooltips for badges
  document.querySelectorAll(".product-badge").forEach((badge) => {
    badge.title = badge.textContent;
  });

  console.log("✓ Homepage initialized successfully with cart integration");
});
