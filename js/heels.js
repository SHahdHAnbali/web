let productsData = {};
let currentProductData = null;
let quantity = 1;
let selectedSize = null;

/* ================= LOAD FROM DB ================= */
document.addEventListener("DOMContentLoaded", () => {
  fetch("heels.php")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((p) => (productsData[p.id] = p));
      buildProductsHTML(data);
      attachProductListeners();
    })
    .catch((err) => console.error("DB ERROR:", err));
});

/* ================= BUILD SAME HTML ================= */
function buildProductsHTML(products) {
  const container = document.querySelector(".products");
  if (!container) return;

  container.innerHTML = "";

  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";
    div.dataset.id = p.id;
    div.dataset.color = (p.colors[0] || "").toLowerCase();
    div.dataset.sizes = p.sizes.join(",");

    div.innerHTML = `
      <i class="fa-solid fa-heart wishlist"></i>
      <img src="${p.image}" alt="">
      <h3>${p.name}</h3>
      <div class="price">NIS ${p.price}</div>
      <div class="rating">★★★★★</div>
      <div class="actions">
        <button onclick="addToCart(event)">Add to Cart</button>
        <button
          class="quick-view-btn"
          data-id="${p.id}">
          Quick View
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* ================= SAME OLD LISTENERS ================= */
function attachProductListeners() {
  // Wishlist
  document.querySelectorAll(".wishlist").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");
    };
  });

  // Quick view
  document.querySelectorAll(".quick-view-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const p = productsData[btn.dataset.id];
      if (!p) return;

      document.getElementById("modalImage").src = p.image;
      document.getElementById("modalTitle").textContent = p.name;
      document.getElementById("modalDescription").textContent =
        p.description || "";
      document.getElementById("modalSizes").textContent = p.sizes.join(", ");
      document.getElementById("modalStatus").textContent = "In Stock";
      document.getElementById("modalFeatures").textContent = "100% Leather";

      document.getElementById("quickViewModal").style.display = "flex";
    };
  });

  // Click product → detail page
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

  document.getElementById("mainImage").src = currentProductData.image;
  document.getElementById("breadcrumbProduct").textContent =
    currentProductData.name;

  buildSizes(currentProductData.sizes);

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

/* ================= CART ================= */
window.addToCart = function (e) {
  e.stopPropagation();
  if (!currentProductData) return;

  const item = {
    id: currentProductData.id,
    name: currentProductData.name,
    price: currentProductData.price,
    image: currentProductData.image,
    size: selectedSize,
    quantity: 1,
  };

  console.log("Add to cart:", item);
};

/* ================= MODAL CLOSE ================= */
document.querySelector(".close")?.addEventListener("click", () => {
  document.getElementById("quickViewModal").style.display = "none";
});

window.onclick = (e) => {
  const modal = document.getElementById("quickViewModal");
  if (e.target === modal) modal.style.display = "none";
};
