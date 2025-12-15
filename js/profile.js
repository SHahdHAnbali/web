let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadOrders();
  loadWishlist();
  setupForms();
});

// PROFILE
function loadProfile() {
  fetch("api/profile.php?action=get_profile")
    .then((res) => res.json())
    .then((user) => {
      if (user.error) {
        location.href = "login.html";
        return;
      }

      currentUser = user;

      profileName.textContent = user.firstName + " " + user.lastName;
      profileEmail.textContent = user.email;

      displayFirstName.textContent = user.firstName;
      displayLastName.textContent = user.lastName;
      displayEmail.textContent = user.email;
      displayPhone.textContent = user.phone || "Not provided";
      displayMemberSince.textContent = new Date(
        user.registeredDate
      ).toLocaleDateString("en-US", { year: "numeric", month: "long" });

      // Avatar
      if (user.avatar) {
        avatarImage.src = user.avatar;
        avatarImage.style.display = "block";
        avatarInitials.style.display = "none";
      } else {
        avatarInitials.textContent = user.firstName[0] + user.lastName[0];
      }
    });
}

// MENU
function showSection(id, el) {
  document
    .querySelectorAll(".content-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document
    .querySelectorAll(".profile-menu li")
    .forEach((li) => li.classList.remove("active"));
  el.classList.add("active");
}

// EDIT
function toggleEditMode() {
  infoDisplay.style.display = "none";
  editForm.style.display = "block";

  editFirstName.value = currentUser.firstName;
  editLastName.value = currentUser.lastName;
  editEmail.value = currentUser.email;
  editPhone.value = currentUser.phone || "";
}

function cancelEdit() {
  editForm.style.display = "none";
  infoDisplay.style.display = "block";
}

function setupForms() {
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("api/profile.php?action=update_profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: editFirstName.value,
        lastName: editLastName.value,
        email: editEmail.value,
        phone: editPhone.value,
      }),
    }).then(() => {
      alert("✓ Profile updated");
      cancelEdit();
      loadProfile();
    });
  });

  passwordForm.addEventListener("submit", handlePasswordChange);
}

// PASSWORD
function handlePasswordChange(e) {
  e.preventDefault();

  fetch("api/profile.php?action=change_password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      alert("✓ Password updated");
      e.target.reset();
    });
}

// ORDERS
function loadOrders() {
  fetch("api/profile.php?action=get_orders")
    .then((res) => res.json())
    .then((orders) => {
      totalOrders.textContent = orders.length;
      totalSpent.textContent =
        "NIS " + orders.reduce((s, o) => s + Number(o.total), 0).toFixed(2);

      ordersContainer.innerHTML =
        orders.length === 0
          ? "<p>No orders found</p>"
          : orders
              .map(
                (o) => `
            <div class="order-card">
              <strong>${o.order_number}</strong>
              <div>Status: ${o.status}</div>
              <div>Total: NIS ${o.total}</div>
            </div>
          `
              )
              .join("");
    });
}

// WISHLIST
function loadWishlist() {
  fetch("api/profile.php?action=get_wishlist")
    .then((res) => res.json())
    .then((items) => {
      wishlistItems.textContent = items.length;
      wishlistContainer.innerHTML =
        items.length === 0
          ? "<p>Wishlist is empty</p>"
          : items
              .map(
                (i) => `
            <div class="product">
              <img src="${i.image}">
              <h3>${i.name}</h3>
              <button onclick="removeFromWishlist(${i.id})">Remove</button>
            </div>
          `
              )
              .join("");
    });
}

function removeFromWishlist(id) {
  fetch("api/profile.php?action=remove_wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: id }),
  }).then(loadWishlist);
}

// AVATAR UPLOAD
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("avatar", file);

  fetch("api/profile.php?action=upload_avatar", {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      avatarImage.src = data.path;
      avatarImage.style.display = "block";
      avatarInitials.style.display = "none";
    });
});

// LOGOUT
function handleLogout() {
  if (!confirm("Are you sure you want to logout?")) return;

  // حذف المستخدم من التخزين
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");

  // استدعاء API logout

  fetch("../api/logout.php").finally(() => {
    window.location.href = "login.html";
  });
}

window.showSection = showSection;
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.handleLogout = handleLogout;
