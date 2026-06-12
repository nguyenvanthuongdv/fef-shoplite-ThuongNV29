/* Cart Page */

document.addEventListener('DOMContentLoaded', () => {
  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  const countEl = document.getElementById('cart-count');
  const emptyState = document.getElementById('cart-empty');
  const cartLayout = document.getElementById('cart-layout');
  const clearBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartItems) return;

  renderCartPage();

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear your entire cart?')) {
        clearCart();
        renderCartPage();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('Checkout is not available in this demo.');
    });
  }

  function renderCartPage() {
    const cart = getCart();

    if (cart.length === 0) {
      cartLayout.style.display = 'none';
      emptyState.style.display = 'block';
      if (countEl) countEl.textContent = '(0 items)';
      return;
    }

    cartLayout.style.display = 'grid';
    emptyState.style.display = 'none';
    if (countEl) countEl.textContent = `(${getCartCount()} items)`;

    renderItems(cart);
    renderSummary(cart);
  }

  function renderItems(cart) {
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title"><a href="product.html?id=${item.id}">${item.title}</a></div>
          <span class="cart-item-category">${item.category}</span>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <div class="quantity-controls">
          <button class="qty-btn" data-id="${item.id}" data-action="minus">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" data-action="remove">X</button>
      `;
      cartItems.appendChild(el);
    });

    cartItems.onclick = handleAction;
  }

  function handleAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'plus') {
      const item = getCart().find(i => i.id === id);
      if (item) { updateQuantity(id, item.quantity + 1); renderCartPage(); }
    } else if (action === 'minus') {
      const item = getCart().find(i => i.id === id);
      if (item) {
        if (item.quantity <= 1) removeFromCart(id);
        else updateQuantity(id, item.quantity - 1);
        renderCartPage();
      }
    } else if (action === 'remove') {
      removeFromCart(id);
      renderCartPage();
    }
  }

  function renderSummary(cart) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }
});
