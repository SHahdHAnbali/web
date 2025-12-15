// ============================================
// LOGIN PAGE WITH PHP AUTHENTICATION - FIXED
// ============================================

document
  .getElementById("loginForm")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember")?.checked || false;

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    // Show loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    try {
      // Call PHP authentication
      const response = await fetch("./api/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          remember: remember,
        }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // IMPORTANT: Save user data with correct structure
        const userData = {
          id: data.user.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          fullName:
            data.user.fullName ||
            `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          phone: data.user.phone || "",
          role: data.user.role || data.role || "USER",
          profileImage: data.user.profileImage || null,
          lastLogin: data.user.lastLogin || new Date().toISOString(),
          createdAt: data.user.createdAt || new Date().toISOString(),
        };

        // Save to localStorage (always save for consistency)
        localStorage.setItem("currentUser", JSON.stringify(userData));

        console.log("✅ User data saved:", userData);

        // Show success message
        alert(`✅ Welcome back, ${userData.firstName}!`);

        // Small delay to ensure data is saved
        setTimeout(() => {
          // Check for redirect
          const redirect = sessionStorage.getItem("redirectAfterLogin");
          if (redirect) {
            sessionStorage.removeItem("redirectAfterLogin");
            window.location.href = redirect + ".html";
          } else {
            // Redirect based on role
            if (userData.role === "ADMIN") {
              window.location.href = "admin.html";
            } else {
              window.location.href = data.redirect || "home.php";
            }
          }
        }, 300);
      } else {
        // Login failed
        alert(
          "❌ " + (data.error || "Login failed. Please check your credentials.")
        );
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Connection error. Please check your internet connection.");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

// Toggle password visibility
document
  .querySelector(".password-toggle")
  ?.addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const icon = this.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });

// Check if already logged in
document.addEventListener("DOMContentLoaded", function () {
  const localUser = localStorage.getItem("currentUser");

  if (localUser) {
    try {
      const user = JSON.parse(localUser);
      const shouldRedirect = confirm(
        `You are already logged in as ${
          user.firstName || user.fullName
        }.\n\nDo you want to continue to your account?`
      );

      if (shouldRedirect) {
        if (user.role === "ADMIN") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "home.php";
        }
      }
    } catch (e) {
      console.error("Error parsing stored user data:", e);
      localStorage.removeItem("currentUser");
    }
  }
});

console.log("✅ Login page loaded with PHP authentication");
