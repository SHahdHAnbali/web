<?php
// ============================================
// HOME.PHP - Fixed with MySQLi
// ============================================

session_start();

// Initialize variables
$currentUser = null;
$firstName = '';
$initials = 'U';
$avatarColor = '#8C28B6';

// Include database config
if (file_exists('config.php')) {
    require_once 'config.php';
    
    // Get user data if logged in
    if (isset($_SESSION['user_id']) && isset($mysqli)) {
        $stmt = $mysqli->prepare("SELECT id, full_name, email, phone, role, profile_image FROM users WHERE id = ?");
        
        if ($stmt) {
            $stmt->bind_param("i", $_SESSION['user_id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $currentUser = $result->fetch_assoc();
            
            if ($currentUser) {
                // Update last login
                $updateStmt = $mysqli->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                if ($updateStmt) {
                    $updateStmt->bind_param("i", $_SESSION['user_id']);
                    $updateStmt->execute();
                    $updateStmt->close();
                }
                
                // Get first name
                $nameParts = explode(' ', trim($currentUser['full_name']));
                $firstName = $nameParts[0];
                
                // Get initials
                if (count($nameParts) >= 2) {
                    $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[count($nameParts) - 1], 0, 1));
                } else {
                    $initials = strtoupper(substr($currentUser['full_name'], 0, 2));
                }
                
                // Get avatar color
                $colors = ['#8C28B6', '#c0392b', '#2980b9', '#27ae60', '#e67e22', '#9b59b6', '#34495e', '#16a085'];
                $name = $currentUser['full_name'];
                $colorIndex = (ord($name[0]) + ord($name[strlen($name) - 1])) % count($colors);
                $avatarColor = $colors[$colorIndex];
            }
            
            $stmt->close();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stilleto - Luxury Heels & Bags</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <link rel="stylesheet" href="../css/index.css" />
    <link rel="stylesheet" href="../css/home.css" />
  </head>
  <body>
    <div class="header-decoration"></div>

    <div class="header">
      <div class="header-left">
        <a href="home.php"><img src="../heels/logo1.png" alt="Logo" /></a>
      </div>
      <div class="header-right">
        <!-- Main Navigation -->
        <a href="home.php">Home</a>
        <a href="../heels.html">Heels</a>
        <a href="../bags.html">Bags</a>
        <a href="../made_to_order.html">Bespoke</a>
        <a href="../new-arrivals.html">New</a>
        <a href="../sale.html">Sale</a>

        <!-- Secondary Navigation -->
        <a href="../track_order.html"
          ><i class="fa-solid fa-truck"></i> <span>Track Order</span></a
        >
        <a href="../store_locator.html"
          ><i class="fa-solid fa-location-dot"></i>
          <span>Store Locator</span></a
        >
        <a href="../contact.html"
          ><i class="fa-solid fa-phone"></i> <span>Contact</span></a
        >

        <!-- Cart Badge -->
        <div class="icon-badge" onclick="toggleCart()">
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="badge-pill" id="cart-count">0</span>
        </div>

        <!-- Wishlist Badge -->
        <div class="icon-badge" onclick="viewWishlist()">
          <i class="fa-solid fa-heart"></i>
          <span class="badge-pill" id="wishlist-count">0</span>
        </div>

        <!-- User Account -->
        <a href="../login.html" id="user-link"
          ><i class="fa-solid fa-user"></i> <span>Login</span></a
        >

        <!-- Theme Toggle -->
        <div class="theme-toggle"><i class="fa-solid fa-moon"></i></div>

        <!-- Mobile Menu Toggle -->
        <button class="toggle-sidebar"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>

    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="hero-slider">
        <div
          class="hero-slide active"
          style="
            background: linear-gradient(
                135deg,
                rgba(140, 40, 182, 0.9),
                rgba(192, 57, 43, 0.9)
              ),
              url('heels/hero-bg.jpg');
          "
        >
          <div class="hero-content">
            <span class="hero-tag">New Collection 2025</span>
            <h1 class="hero-title">Step Into Elegance</h1>
            <p class="hero-subtitle">
              Discover our handcrafted luxury heels made in Italy
            </p>
            <div class="hero-buttons">
              <a
                href="#"
                onclick="viewAllProducts(); return false;"
                class="btn-hero-primary"
                >Shop Now</a
              >
              <a href="../made_to_order.html" class="btn-hero-secondary"
                >Bespoke Service</a
              >
            </div>
          </div>
        </div>
        <div
          class="hero-slide"
          style="
            background: linear-gradient(
                135deg,
                rgba(192, 57, 43, 0.9),
                rgba(140, 40, 182, 0.9)
              ),
              url('bags/hero-bg.jpg');
          "
        >
          <div class="hero-content">
            <span class="hero-tag">Premium Bags</span>
            <h1 class="hero-title">Carry Your Dreams</h1>
            <p class="hero-subtitle">
              Exquisite bags crafted from finest leather
            </p>
            <div class="hero-buttons">
              <a
                href="#"
                onclick="viewAllProducts(); return false;"
                class="btn-hero-primary"
                >Explore Collection</a
              >
              <a href="#new-arrivals" class="btn-hero-secondary"
                >New Arrivals</a
              >
            </div>
          </div>
        </div>
        <div
          class="hero-slide"
          style="
            background: linear-gradient(
                135deg,
                rgba(231, 76, 60, 0.9),
                rgba(41, 128, 185, 0.9)
              ),
              url('heels/hero-bg-2.jpg');
          "
        >
          <div class="hero-content">
            <span class="hero-tag">Limited Edition</span>
            <h1 class="hero-title">Exclusive Designs</h1>
            <p class="hero-subtitle">Own a piece of timeless fashion</p>
            <div class="hero-buttons">
              <a href="../made_to_order.html" class="btn-hero-primary"
                >Create Yours</a
              >
              <a href="#featured" class="btn-hero-secondary">View Featured</a>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-navigation">
        <button class="hero-prev" onclick="changeSlide(-1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="hero-next" onclick="changeSlide(1)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="hero-indicators">
        <span class="indicator active" onclick="goToSlide(0)"></span>
        <span class="indicator" onclick="goToSlide(1)"></span>
        <span class="indicator" onclick="goToSlide(2)"></span>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="features-section">
      <div class="container-home">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fa-solid fa-truck-fast"></i>
          </div>
          <h3>Free Shipping</h3>
          <p>On orders over NIS 300</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fa-solid fa-hand-sparkles"></i>
          </div>
          <h3>Handcrafted</h3>
          <p>Italian artisan quality</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fa-solid fa-rotate-left"></i>
          </div>
          <h3>30-Day Returns</h3>
          <p>Hassle-free returns</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h3>Secure Payment</h3>
          <p>100% safe checkout</p>
        </div>
      </div>
    </section>

    <!-- CATEGORIES SECTION -->
    <section class="categories-section">
      <div class="container-home">
        <div class="section-header">
          <h2 class="section-title">Shop By Category</h2>
          <p class="section-subtitle">Explore our curated collections</p>
        </div>

        <div class="categories-grid">
          <div class="category-card large" onclick="goToCategory('heels')">
            <img src="../heels/black_suede.png" alt="Heels" />
            <div class="category-overlay">
              <h3>Heels</h3>
              <p>120+ Styles</p>
              <span class="category-arrow"
                ><i class="fa-solid fa-arrow-right"></i
              ></span>
            </div>
          </div>
          <div class="category-card" onclick="goToCategory('bags')">
            <img src="../bags/strath_burgundy1.png" alt="Bags" />
            <div class="category-overlay">
              <h3>Bags</h3>
              <p>85+ Styles</p>
              <span class="category-arrow"
                ><i class="fa-solid fa-arrow-right"></i
              ></span>
            </div>
          </div>
          <div class="category-card" onclick="goToCategory('bespoke')">
            <img src="../heels/red_satin.png" alt="Bespoke" />
            <div class="category-overlay">
              <h3>Bespoke</h3>
              <p>Custom Made</p>
              <span class="category-arrow"
                ><i class="fa-solid fa-arrow-right"></i
              ></span>
            </div>
          </div>
          <div class="category-card" onclick="goToCategory('heels')">
            <img src="../heels/white_bowtie2.png" alt="Accessories" />
            <div class="category-overlay">
              <h3>Bridal</h3>
              <p>45+ Styles</p>
              <span class="category-arrow"
                ><i class="fa-solid fa-arrow-right"></i
              ></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW ARRIVALS SECTION -->
    <section class="new-arrivals-section" id="new-arrivals">
      <div class="container-home">
        <div class="section-header">
          <h2 class="section-title">New Arrivals</h2>
          <p class="section-subtitle">Discover our latest additions</p>
          <a href="../new-arrivals.html" class="view-all-btn"
            >View All <i class="fa-solid fa-arrow-right"></i
          ></a>
        </div>

        <div class="products-carousel">
          <div class="product-card-home">
            <div class="product-badge new">New</div>
            <i class="fa-solid fa-heart wishlist-icon"></i>
            <img src="../heels/green_mirror.png" alt="Green Mirror Pumps" />
            <div class="product-info-home">
              <h4>Green Mirror Pumps</h4>
              <div class="product-rating-home">★★★★★</div>
              <div class="product-price-home">NIS 120.00</div>
              <button class="quick-add-btn">Quick Add</button>
            </div>
          </div>

          <div class="product-card-home">
            <div class="product-badge new">New</div>
            <i class="fa-solid fa-heart wishlist-icon"></i>
            <img src="../heels/dark_pink_suede.png" alt="Pink Suede Heels" />
            <div class="product-info-home">
              <h4>Pink Suede Heels</h4>
              <div class="product-rating-home">★★★★★</div>
              <div class="product-price-home">NIS 150.00</div>
              <button class="quick-add-btn">Quick Add</button>
            </div>
          </div>

          <div class="product-card-home">
            <div class="product-badge new">New</div>
            <i class="fa-solid fa-heart wishlist-icon"></i>
            <img src="../heels/dark_purple_suede.png" alt="Purple Suede Heels" />
            <div class="product-info-home">
              <h4>Purple Suede Heels</h4>
              <div class="product-rating-home">★★★★★</div>
              <div class="product-price-home">NIS 180.00</div>
              <button class="quick-add-btn">Quick Add</button>
            </div>
          </div>

          <div class="product-card-home">
            <div class="product-badge new">New</div>
            <i class="fa-solid fa-heart wishlist-icon"></i>
            <img src="../bags/strath_burgundy1.png" alt="Burgundy Bag" />
            <div class="product-info-home">
              <h4>Burgundy Mini Bag</h4>
              <div class="product-rating-home">★★★★★</div>
              <div class="product-price-home">NIS 120.00</div>
              <button class="quick-add-btn">Quick Add</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DISCOUNT SECTION -->
    <section class="discount-section">
      <div class="discount-banner">
        <div class="discount-content">
          <span class="discount-tag">Limited Time Offer</span>
          <h2 class="discount-title">Up to 40% Off</h2>
          <p class="discount-text">
            On selected items from our premium collection
          </p>
          <div class="countdown-timer" id="countdown">
            <div class="time-unit">
              <span class="time-value" id="days">00</span>
              <span class="time-label">Days</span>
            </div>
            <div class="time-unit">
              <span class="time-value" id="hours">00</span>
              <span class="time-label">Hours</span>
            </div>
            <div class="time-unit">
              <span class="time-value" id="minutes">00</span>
              <span class="time-label">Minutes</span>
            </div>
            <div class="time-unit">
              <span class="time-value" id="seconds">00</span>
              <span class="time-label">Seconds</span>
            </div>
          </div>
          <a href="../sale.html" class="btn-discount">Shop Sale</a>
        </div>
        <div class="discount-image">
          <img src="../heels/gold.png" alt="Sale Item" />
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="featured-section" id="featured">
      <div class="container-home">
        <div class="section-header">
          <h2 class="section-title">Featured Collection</h2>
          <p class="section-subtitle">Handpicked favorites just for you</p>
        </div>

        <div class="featured-grid">
          <div class="featured-product">
            <div class="product-badge bestseller">Bestseller</div>
            <img src="../heels/black_leather.png" alt="Black Leather Heels" />
            <div class="featured-info">
              <h4>Classic Black Leather</h4>
              <p>Timeless elegance</p>
              <div class="featured-price">
                <span class="original-price">NIS 250.00</span>
                <span class="sale-price">NIS 180.00</span>
              </div>
            </div>
          </div>

          <div class="featured-product">
            <div class="product-badge hot">Hot</div>
            <img src="../heels/silver.png" alt="Silver Heels" />
            <div class="featured-info">
              <h4>Silver Metallic Pumps</h4>
              <p>Perfect for evening</p>
              <div class="featured-price">
                <span class="sale-price">NIS 200.00</span>
              </div>
            </div>
          </div>

          <div class="featured-product">
            <div class="product-badge discount">-30%</div>
            <img src="../heels/dark_red_suede.png" alt="Red Suede Heels" />
            <div class="featured-info">
              <h4>Red Suede Elegance</h4>
              <p>Statement piece</p>
              <div class="featured-price">
                <span class="original-price">NIS 280.00</span>
                <span class="sale-price">NIS 196.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BESPOKE BANNER -->
    <section class="bespoke-banner">
      <div class="bespoke-content-wrapper">
        <div class="bespoke-text">
          <span class="bespoke-tag">Exclusive Service</span>
          <h2>Create Your Perfect Pair</h2>
          <p>
            Design custom heels tailored to your style. Choose materials,
            colors, and heel heights for a truly unique creation.
          </p>
          <ul class="bespoke-features">
            <li><i class="fa-solid fa-check"></i> Italian craftsmanship</li>
            <li><i class="fa-solid fa-check"></i> Premium materials</li>
            <li><i class="fa-solid fa-check"></i> 4-6 weeks delivery</li>
          </ul>
          <a href="../made_to_order.html" class="btn-bespoke">Start Designing</a>
        </div>
        <div class="bespoke-image-grid">
          <img src="../heels/jimmy-choo.jpg" alt="Bespoke 1" />
          <img src="../heels/pink_satin.png" alt="Bespoke 2" />
          <img src="../heels/navy_satin.png" alt="Bespoke 3" />
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS SECTION -->
    <section class="testimonials-section">
      <div class="container-home">
        <div class="section-header">
          <h2 class="section-title">What Our Customers Say</h2>
          <p class="section-subtitle">Real reviews from real customers</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-rating">★★★★★</div>
            <p class="testimonial-text">
              "Absolutely stunning heels! The quality is exceptional and they're
              so comfortable. Worth every penny."
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">S</div>
              <div>
                <h5>Sarah Johnson</h5>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-rating">★★★★★</div>
            <p class="testimonial-text">
              "The bespoke service exceeded my expectations. My custom heels fit
              perfectly and look amazing!"
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">M</div>
              <div>
                <h5>Maria Garcia</h5>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-rating">★★★★★</div>
            <p class="testimonial-text">
              "Fast shipping and beautiful packaging. The heels are even more
              gorgeous in person. Highly recommend!"
            </p>
            <div class="testimonial-author">
              <div class="author-avatar">L</div>
              <div>
                <h5>Layla Ahmed</h5>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- INSTAGRAM SECTION -->
    <section class="instagram-section">
      <div class="container-home">
        <div class="section-header">
          <h2 class="section-title">#StilletoStyle</h2>
          <p class="section-subtitle">
            Follow us on Instagram for daily inspiration
          </p>
          <a
            href="#"
            onclick="openSocialMedia('instagram'); return false;"
            class="instagram-follow-btn"
          >
            <i class="fa-brands fa-instagram"></i> Follow @stilleto
          </a>
        </div>

        <div class="instagram-grid">
          <div class="instagram-item">
            <img src="../heels/green_mirror.png" alt="Instagram 1" />
            <div class="instagram-overlay">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="instagram-item">
            <img src="../heels/dark_pink_suede.png" alt="Instagram 2" />
            <div class="instagram-overlay">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="instagram-item">
            <img src="../bags/strath_burgundy1.png" alt="Instagram 3" />
            <div class="instagram-overlay">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="instagram-item">
            <img src="../heels/silver.png" alt="Instagram 4" />
            <div class="instagram-overlay">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="instagram-item">
            <img src="../heels/gold.png" alt="Instagram 5" />
            <div class="instagram-overlay">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div class="instagram-item">
            <img src="../heels/dark_purple_suede.png" alt="Instagram 6" />
            <div class="instagram-overlay">
              <i class="fa-brands fa-instagram"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER SECTION -->
    <section class="newsletter-section">
      <div class="newsletter-wrapper">
        <div class="newsletter-content">
          <h2>Stay In The Loop</h2>
          <p>Subscribe to our newsletter and get 15% off your first order</p>
          <form
            class="newsletter-form"
            onsubmit="event.preventDefault(); subscribeNewsletter(this.querySelector('input').value); this.reset();"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          <p class="newsletter-note">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>

    <!-- SHOPPING CART SIDEBAR -->
    <div id="cartSidebar" class="cart-sidebar">
      <div class="cart-header">
        <h2>MY BAG (<span id="cart-items-count">0</span>)</h2>
        <button class="cart-close" onclick="toggleCart()">&times;</button>
      </div>

      <div class="cart-items" id="cartItemsContainer">
        <div class="cart-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <p>Your bag is empty</p>
        </div>
      </div>

      <div class="cart-footer">
        <div class="cart-subtotal">
          <span>SUBTOTAL</span>
          <span class="subtotal-amount" id="cartSubtotal">NIS 0.00</span>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">
          CHECKOUT
        </button>
        <button class="view-bag-btn" onclick="viewBag()">VIEW BAG</button>
      </div>
    </div>

    <div id="cartOverlay" class="cart-overlay" onclick="toggleCart()"></div>

    <footer>
      <p>&copy; 2025 Stilleto | All rights reserved.</p>
      <p>
        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> |
        <a href="#">Help</a>
      </p>
    </footer>

    <script src="../js/auth.js"></script>
    <script src="../js/cart.js"></script>
    <script src="../js/global-functions.js"></script>
    <script src="../js/home.js"></script>

    <script>
      // Force update header on page load
      window.addEventListener("load", function () {
        setTimeout(function () {
          if (typeof updateHeaderForUser === "function") {
            updateHeaderForUser();
          }
        }, 100);
      });
    </script>
  </body>
</html>
