/* ============================================
   REGISTER / CONTACT PAGE JS — Form Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const successMessage = document.getElementById('success-message');
  const registerCard = document.getElementById('register-card');
  const passwordToggle = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('password');

  if (!form) return;

  // --- Password Toggle ---
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      passwordToggle.textContent = isPassword ? '🙈' : '👁';
    });
  }

  // --- Real-time Validation ---
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group && group.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  // --- Form Submit ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Checkbox validation
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      const group = termsCheckbox.closest('.form-group');
      if (group) {
        group.classList.add('error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = '⚠ You must agree to the Terms & Conditions.';
          errorEl.style.display = 'flex';
        }
      }
      isValid = false;
    }

    if (isValid) {
      // Success! Show message
      registerCard.style.display = 'none';
      successMessage.classList.add('show');
      showToast('Registration successful!', 'success');
    }
  });

  /**
   * Validate a single field
   */
  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errorEl = group.querySelector('.form-error');
    const name = field.name || field.id;
    const value = field.value.trim();

    let error = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
      error = 'This field is required.';
    }

    // Specific validations
    if (!error && value) {
      switch (name) {
        case 'fullname':
          if (value.length < 2) error = 'Name must be at least 2 characters.';
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
          break;

        case 'password':
          if (value.length < 6) error = 'Password must be at least 6 characters.';
          break;

        case 'phone':
          const phoneRegex = /^[\d\s\-+()]{8,15}$/;
          if (!phoneRegex.test(value)) error = 'Please enter a valid phone number.';
          break;

        case 'subject':
          if (!value) error = 'Please select an option.';
          break;
      }
    }

    // Apply state
    if (error) {
      group.classList.add('error');
      group.classList.remove('success');
      if (errorEl) {
        errorEl.textContent = `⚠ ${error}`;
        errorEl.style.display = 'flex';
      }
      return false;
    } else {
      group.classList.remove('error');
      if (value) group.classList.add('success');
      if (errorEl) errorEl.style.display = 'none';
      return true;
    }
  }

  // --- "Register Again" button ---
  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('error', 'success');
        const err = g.querySelector('.form-error');
        if (err) err.style.display = 'none';
      });
      successMessage.classList.remove('show');
      registerCard.style.display = 'block';
    });
  }
});
