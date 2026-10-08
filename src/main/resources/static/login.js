/* =========================================================
   COMPLAINT AI - COMPANY LOGIN SCRIPT (Phase E1)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const errorBox = document.getElementById('errorBox');
  const errorMessage = document.getElementById('errorMessage');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const togglePasswordIcon = document.getElementById('togglePasswordIcon');

  // Toggle password visibility
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      if (togglePasswordIcon) {
        togglePasswordIcon.classList.toggle('fa-eye', !isPassword);
        togglePasswordIcon.classList.toggle('fa-eye-slash', isPassword);
      }
    });
  }

  // Display error message
  function showError(message) {
    if (errorMessage && errorBox) {
      errorMessage.textContent = message;
      errorBox.classList.remove('hidden');
    }
  }

  // Hide error message
  function hideError() {
    if (errorBox) {
      errorBox.classList.add('hidden');
    }
  }

  // Set loading state on button
  function setLoading(loading) {
    if (loginBtn) {
      loginBtn.disabled = loading;
    }
    if (btnText && btnSpinner) {
      if (loading) {
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
      } else {
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
      }
    }
  }

  // Check if already authenticated as company on page load
  async function checkExistingSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data && data.authenticated && data.role === 'ROLE_COMPANY') {
          window.location.href = '/company.html';
        }
      }
    } catch (e) {
      // Unauthenticated or network issue - proceed with login form
    }
  }

  checkExistingSession();

  // Handle login submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        showError('Please enter both your work email and password.');
        return;
      }

      setLoading(true);

      try {
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!loginResponse.ok) {
          showError('Invalid email or password. Please verify your credentials.');
          setLoading(false);
          return;
        }

        // Verify session and role via /api/auth/me
        const meResponse = await fetch('/api/auth/me');
        if (!meResponse.ok) {
          showError('Authentication verification failed. Please try again.');
          setLoading(false);
          return;
        }

        const meData = await meResponse.json();

        if (meData && meData.role === 'ROLE_COMPANY') {
          // Success: Redirect authorized company user to company operations portal
          window.location.href = '/company.html';
        } else if (meData && meData.role === 'ROLE_CUSTOMER') {
          // Customer account attempted login to company portal:
          // Deny access and invalidate the session immediately
          showError('Customer accounts cannot access the company portal.');
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (logoutErr) {
            // ignore
          }
          setLoading(false);
        } else {
          showError('Unauthorized access level. Access denied.');
          try {
            await fetch('/api/auth/logout', { method: 'POST' });
          } catch (logoutErr) {
            // ignore
          }
          setLoading(false);
        }

      } catch (err) {
        showError('Connection error while signing in. Please check your network and try again.');
        setLoading(false);
      }
    });
  }
});
