/* ============================================
   CART PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummarySubtotal = document.getElementById('summary-subtotal');
  const cartSummaryShipping = document.getElementById('summary-shipping');
  const cartSummaryTotal = document.getElementById('summary-total');
  const cartCountEl = document.getElementById('cart-count');
  const emptyState = document.getElementById('cart-empty');
  const cartLayout = document.getElementById('cart-layout');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartItemsContainer) return;

  renderCartPage();

  // --- Clear Cart ---
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your entire cart?')) {
        clearCart();
        renderCartPage();
        showToast('Cart cleared!', 'info');
      }
    });
  }

  // --- Checkout ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('Checkout is not available in this demo.', 'info');
    });
  }

  function renderCartPage() {
    const cart = getCart();

    if (cart.length === 0) {
      cartLayout.style.display = 'none';
      emptyState.style.display = 'block';
      if (cartCountEl) cartCountEl.textContent = '(0 items)';
      return;
    }

    cartLayout.style.display = 'grid';
    emptyState.style.display = 'none';
    if (cartCountEl) cartCountEl.textContent = `(${getCartCount()} items)`;

    renderCartItems(cart);
    renderSummary(cart);
  }

  function renderCartItems(cart) {
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.style.animationDelay = `${index * 0.05}s`;
      el.dataset.id = item.id;

      el.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">
            <a href="product.html?id=${item.id}">${item.title}</a>
          </div>
          <span class="cart-item-category">${item.category}</span>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <div class="quantity-controls">
          <button class="qty-minus" data-id="${item.id}" title="Decrease">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="qty-plus" data-id="${item.id}" title="Increase">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" title="Remove item">🗑</button>
      `;

      cartItemsContainer.appendChild(el);
    });

    // Event delegation for quantity and remove
    cartItemsContainer.addEventListener('click', handleCartAction);
  }

  function handleCartAction(e) {
    const target = e.target.closest('[data-id]');
    if (!target) return;

    const id = Number(target.dataset.id);

    if (target.classList.contains('qty-plus')) {
      const item = getCart().find(i => i.id === id);
      if (item) {
        updateQuantity(id, item.quantity + 1);
        renderCartPage();
      }
    } else if (target.classList.contains('qty-minus')) {
      const item = getCart().find(i => i.id === id);
      if (item) {
        if (item.quantity <= 1) {
          const row = cartItemsContainer.querySelector(`[data-id="${id}"].cart-item`);
          if (row) {
            row.classList.add('removing');
            row.addEventListener('animationend', () => {
              removeFromCart(id);
              renderCartPage();
            });
          }
        } else {
          updateQuantity(id, item.quantity - 1);
          renderCartPage();
        }
      }
    } else if (target.classList.contains('cart-item-remove')) {
      const row = cartItemsContainer.querySelector(`.cart-item[data-id="${id}"]`);
      if (row) {
        row.classList.add('removing');
        row.addEventListener('animationend', () => {
          removeFromCart(id);
          renderCartPage();
          showToast('Item removed from cart.', 'info');
        });
      }
    }
  }

  function renderSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + shipping;

    if (cartSummarySubtotal) cartSummarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartSummaryShipping) cartSummaryShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (cartSummaryTotal) cartSummaryTotal.textContent = `$${total.toFixed(2)}`;
  }
});
