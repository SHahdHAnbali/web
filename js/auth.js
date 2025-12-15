// ============================================
// Authentication and Profile System - FIXED
// ============================================

console.log("✓ Authentication system loading...");

// ============================================
// User Management Functions
// ============================================

function getCurrentUser() {
  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  }
  return null;
}

function saveUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cartItems");
    window.location.href = "home.php";
  }
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

// ============================================
// Profile Image Functions
// ============================================

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function stringToColor(str) {
  if (!str) return "#6366f1";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
  ];
  return colors[Math.abs(hash) % colors.length];
}

function createProfileImage(user) {
  const name = user.fullName || user.firstName || user.email;
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  if (user.profileImage) {
    return `<img src="${user.profileImage}" alt="Profile" class="profile-avatar">`;
  }

  return `<div class="profile-avatar-initials" style="background-color: ${bgColor}">${initials}</div>`;
}

// ============================================
// Header Update Function - الأهم!
// ============================================

function updateHeaderForUser() {
  const user = getCurrentUser();

  // ابحث عن عنصر user-link في الهيدر
  const userLink = document.getElementById("user-link");

  if (!userLink) {
    console.warn("❌ user-link element not found in header");
    return;
  }

  if (!user) {
    console.log("❌ No user logged in");
    // إرجاع زر Login إذا لم يكن المستخدم مسجل دخول
    userLink.innerHTML = '<i class="fa-solid fa-user"></i> <span>Login</span>';
    userLink.href = "login.html";
    userLink.className = "";
    return;
  }

  console.log("✓ User logged in:", user.firstName || user.fullName);

  // إنشاء عنصر البروفايل
  const profileImageHTML = createProfileImage(user);
  const firstName =
    user.firstName || (user.fullName ? user.fullName.split(" ")[0] : "Profile");

  userLink.innerHTML = `
        ${profileImageHTML}
        <span class="profile-name">${firstName}</span>
    `;
  const basePath = window.location.pathname.split("/")[1];
  userLink.href = `/${basePath}/profile.html`;

  userLink.className = "profile-link";

  console.log("✅ Header updated with profile image");

  // إضافة الستايلات إذا لم تكن موجودة
  if (!document.getElementById("profile-styles")) {
    const styles = document.createElement("style");
    styles.id = "profile-styles";
    styles.textContent = `
            .profile-link {
                display: flex !important;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                border-radius: 50px;
                transition: all 0.3s ease;
                text-decoration: none;
                color: var(--text-color);
            }
            .profile-link:hover {
                background: rgba(140, 40, 182, 0.1);
                opacity: 1;
            }
            .profile-avatar,
            .profile-avatar-initials {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid #8C28B6;
            }
            .profile-avatar-initials {
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 16px;
            }
            .profile-name {
                font-weight: 600;
                color: var(--text-color);
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .profile-link:hover .profile-avatar,
            .profile-link:hover .profile-avatar-initials {
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(140, 40, 182, 0.3);
            }
            @media (max-width: 768px) {
                .profile-name {
                    display: none;
                }
            }
        `;
    document.head.appendChild(styles);
  }
}

// ============================================
// Auto-Initialize on Page Load
// ============================================

// تنفيذ فوري عند تحميل الملف
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, updating header...");
    setTimeout(updateHeaderForUser, 100);
  });
} else {
  // إذا كان DOM جاهز بالفعل
  console.log("DOM already loaded, updating header immediately...");
  setTimeout(updateHeaderForUser, 100);
}

// محاولة أخرى بعد ثانية للتأكد
setTimeout(function () {
  const user = getCurrentUser();
  const userLink = document.getElementById("user-link");

  if (user && userLink) {
    // تحقق إذا لم يتم التحديث بعد
    const hasProfileClass = userLink.classList.contains("profile-link");
    const hasProfileContent = userLink.querySelector(
      ".profile-avatar, .profile-avatar-initials"
    );

    if (!hasProfileClass || !hasProfileContent) {
      console.log("🔄 Retry: Updating header after delay...");
      updateHeaderForUser();
    }
  }
}, 1500);

console.log("✓ Authentication system loaded with profile image support");

// ============================================
// Export functions for global use
// ============================================

window.getCurrentUser = getCurrentUser;
window.saveUser = saveUser;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.updateHeaderForUser = updateHeaderForUser;
