/* Register Page — Form Validation */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const successMsg = document.getElementById('success-message');
  const registerCard = document.getElementById('register-card');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate all fields
    form.querySelectorAll('input, select').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    // Validate terms checkbox
    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
      setError(terms, 'You must agree to the Terms.');
      valid = false;
    }

    if (valid) {
      registerCard.style.display = 'none';
      successMsg.classList.add('show');
    }
  });

  function validateField(field) {
    const name = field.name || field.id;
    const val = field.value.trim();
    let error = '';

    if (field.hasAttribute('required') && !val) {
      error = 'This field is required.';
    } else if (val) {
      if (name === 'fullname' && val.length < 2) error = 'Name must be at least 2 characters.';
      if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Invalid email.';
      if (name === 'password' && val.length < 6) error = 'Password must be at least 6 characters.';
      if (name === 'phone' && !/^[\d\s\-+()]{8,15}$/.test(val)) error = 'Invalid phone number.';
      if (name === 'subject' && !val) error = 'Please select an option.';
    }

    const group = field.closest('.form-group');
    const errEl = group?.querySelector('.form-error');

    if (error) {
      group?.classList.add('error');
      group?.classList.remove('success');
      if (errEl) { errEl.textContent = error; errEl.style.display = 'block'; }
      return false;
    } else {
      group?.classList.remove('error');
      if (val) group?.classList.add('success');
      if (errEl) errEl.style.display = 'none';
      return true;
    }
  }

  function setError(field, msg) {
    const group = field.closest('.form-group');
    group?.classList.add('error');
    const errEl = group?.querySelector('.form-error');
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
  }

  // Reset button
  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('error', 'success');
        const err = g.querySelector('.form-error');
        if (err) err.style.display = 'none';
      });
      successMsg.classList.remove('show');
      registerCard.style.display = 'block';
    });
  }
});
