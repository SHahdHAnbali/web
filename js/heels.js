let productsData = {};
let allProducts = [];
let currentProductData = null;
let quantity = 1;
let selectedSize = null;

/* ================= LOAD FROM DB ================= */
document.addEventListener("DOMContentLoaded", () => {
  fetch("./api/heels.php")
    .then((res) => res.json())
    .then((data) => {
      console.log("Heels data:", data);

      allProducts = data;
      data.forEach((p) => (productsData[p.id] = p));

      buildProductsHTML(data);
      attachProductListeners();
      initFilters();
      updateColorCounts(data);
    })
    .catch((err) => console.error("DB ERROR:", err));
});

/* ================= BUILD PRODUCTS ================= */
function buildProductsHTML(products) {
  const container = document.querySelector(".products");
  if (!container) return;

  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.dataset.id = p.id;

    const image = p.images?.[0] || "heels/placeholder.png";

    div.innerHTML = `
      <i class="fa-solid fa-heart wishlist"></i>
      <img src="${image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">NIS ${p.price}</div>
      <div class="rating">★★★★★</div>
      <div class="actions">
        <button class="add-cart-btn">Add to Cart</button>
        <button class="quick-view-btn" data-id="${p.id}">Quick View</button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* ================= FILTER INIT ================= */
function initFilters() {
  // Search inputs
  document
    .getElementById("search-input")
    ?.addEventListener("input", applyFilters);
  document.getElementById("sidebar-search")?.addEventListener("input", (e) => {
    document.getElementById("search-input").value = e.target.value;
    applyFilters();
  });

  // Price filters
  const priceRange = document.getElementById("price-range");
  const priceBox = document.getElementById("price-box");

  priceRange?.addEventListener("input", (e) => {
    priceBox.value = e.target.value;
    applyFilters();
  });

  priceBox?.addEventListener("input", (e) => {
    const val = Math.min(Math.max(0, e.target.value), 500);
    priceBox.value = val;
    priceRange.value = val;
    applyFilters();
  });

  // Color and Size filters
  document.querySelectorAll(".color-filter, .size-filter").forEach((el) => {
    el.addEventListener("change", applyFilters);
  });

  // Sort
  document.getElementById("sort-by")?.addEventListener("change", applyFilters);

  // Reset button
  document.getElementById("reset-btn").onclick = resetFilters;
}

/* ================= APPLY FILTERS ================= */
function applyFilters() {
  const search = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const maxPrice = Number(document.getElementById("price-range").value);

  // Get selected colors
  const selectedColors = [
    ...document.querySelectorAll(".color-filter:checked"),
  ].map((c) => c.value.toLowerCase());

  // Get selected sizes
  const selectedSizes = [
    ...document.querySelectorAll(".size-filter:checked"),
  ].map((s) => s.value);

  console.log("Filters:", { search, maxPrice, selectedColors, selectedSizes });

  // Filter products
  let filtered = allProducts.filter((p) => {
    // 🔍 Search filter
    const searchOk =
      !search ||
      p.name.toLowerCase().includes(search) ||
      (p.description || "").toLowerCase().includes(search);

    // 💰 Price filter
    const priceOk = Number(p.price) <= maxPrice;

    // 🎨 Color filter
    let colorOk = true;
    if (selectedColors.length > 0) {
      const productColors = (p.colors || []).map((c) => c.toLowerCase());

      // Check if ANY selected color matches ANY product color (partial match)
      colorOk = selectedColors.some((selectedColor) =>
        productColors.some(
          (productColor) =>
            productColor.includes(selectedColor) ||
            selectedColor.includes(productColor)
        )
      );
    }

    // 👠 Size filter
    let sizeOk = true;
    if (selectedSizes.length > 0) {
      const productSizes = (p.sizes || []).map((s) => String(s));

      // Check if ANY selected size exists in product sizes
      sizeOk = selectedSizes.some((selectedSize) =>
        productSizes.includes(selectedSize)
      );
    }

    const passes = searchOk && priceOk && colorOk && sizeOk;

    if (!passes) {
      console.log(`Product ${p.name} filtered out:`, {
        searchOk,
        priceOk,
        colorOk,
        sizeOk,
        productColors: p.colors,
        productSizes: p.sizes,
      });
    }

    return passes;
  });

  // Sort
  const sortBy = document.getElementById("sort-by")?.value;
  if (sortBy === "Price: Low to High") {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "Price: High to Low") {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  }

  console.log(`Filtered: ${filtered.length} of ${allProducts.length} products`);

  buildProductsHTML(filtered);
  attachProductListeners();
  updateColorCounts(filtered);
}

/* ================= RESET ================= */
function resetFilters() {
  // Uncheck all filters
  document
    .querySelectorAll(".color-filter, .size-filter")
    .forEach((c) => (c.checked = false));

  // Reset search
  document.getElementById("search-input").value = "";
  document.getElementById("sidebar-search").value = "";

  // Reset price
  document.getElementById("price-range").value = 500;
  document.getElementById("price-box").value = 500;

  // Reset sort
  document.getElementById("sort-by").value = "Default";

  buildProductsHTML(allProducts);
  attachProductListeners();
  updateColorCounts(allProducts);
}

/* ================= COLOR COUNTS ================= */
function updateColorCounts(products) {
  const baseColors = [
    "black",
    "white",
    "red",
    "green",
    "pink",
    "purple",
    "gold",
    "silver",
    "blue",
    "yellow",
    "orange",
    "nude",
  ];

  const counts = {};

  products.forEach((p) => {
    const found = new Set();
    (p.colors || []).forEach((c) => {
      const color = c.toLowerCase();
      baseColors.forEach((base) => {
        if (color.includes(base)) found.add(base);
      });
    });
    found.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
  });

  document.querySelectorAll(".color-filter").forEach((cb) => {
    const base = cb.value.toLowerCase();
    const span = cb.parentElement.querySelector(".color-count");
    if (span) span.textContent = counts[base] || 0;
  });
}

/* ================= LISTENERS ================= */
function attachProductListeners() {
  document.querySelectorAll(".wishlist").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");
    };
  });

  document.querySelectorAll(".quick-view-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const p = productsData[btn.dataset.id];
      if (!p) return;

      document.getElementById("modalImage").src = p.images?.[0] || "";
      document.getElementById("modalTitle").textContent = p.name;
      document.getElementById("modalDescription").textContent =
        p.description || "";
      document.getElementById("modalSizes").textContent = (p.sizes || []).join(
        ", "
      );
      document.getElementById("modalStatus").textContent = "In Stock";
      document.getElementById("modalFeatures").textContent = "Premium Leather";
      document.getElementById("quickViewModal").style.display = "flex";
    };
  });

  document.querySelectorAll(".product").forEach((prod) => {
    prod.onclick = (e) => {
      if (!e.target.closest(".actions") && !e.target.closest(".wishlist")) {
        showProductPage(prod.dataset.id);
      }
    };
  });
}

/* ================= PRODUCT DETAIL ================= */
function showProductPage(id) {
  currentProductData = productsData[id];
  if (!currentProductData) return;

  document.getElementById("detailTitle").textContent = currentProductData.name;
  document.getElementById("detailPrice").textContent =
    "NIS " + currentProductData.price;
  document.getElementById("detailDescription").innerHTML = `<p>${
    currentProductData.description || ""
  }</p>`;
  document.getElementById("mainImage").src =
    currentProductData.images?.[0] || "";
  document.getElementById("breadcrumbProduct").textContent =
    currentProductData.name;

  buildSizes(currentProductData.sizes || []);

  document
    .querySelectorAll(".page-content")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("productPage").classList.add("active");
  window.scrollTo(0, 0);
}

/* ================= SIZES ================= */
function buildSizes(sizes) {
  const box = document.querySelector(".size-options");
  box.innerHTML = "";
  if (!sizes.length) return;

  selectedSize = sizes[0];

  sizes.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "size-option" + (i === 0 ? " active" : "");
    d.textContent = s;
    d.onclick = () => selectSize(d);
    box.appendChild(d);
  });
}

function selectSize(el) {
  document
    .querySelectorAll(".size-option")
    .forEach((s) => s.classList.remove("active"));
  el.classList.add("active");
  selectedSize = el.textContent;
}

/* ================= QUANTITY FUNCTIONS ================= */
function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    document.getElementById("quantity").textContent = quantity;
  }
}

function increaseQuantity() {
  quantity++;
  document.getElementById("quantity").textContent = quantity;
}

/* ================= MODAL CLOSE ================= */
document.querySelector(".close")?.addEventListener("click", () => {
  document.getElementById("quickViewModal").style.display = "none";
});

window.onclick = (e) => {
  const modal = document.getElementById("quickViewModal");
  if (e.target === modal) modal.style.display = "none";
};
