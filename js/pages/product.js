/* Product Detail Page */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-detail-container');
  const spinner = document.getElementById('loading-spinner');
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { showError('No product ID specified.'); return; }

  loadProduct(id);

  async function loadProduct(id) {
    try {
      spinner.style.display = 'flex';
      container.style.display = 'none';

      const product = await getProductById(id);
      document.title = `${product.title} — Shopelite`;

      const breadcrumb = document.getElementById('breadcrumb-title');
      if (breadcrumb) breadcrumb.textContent = product.title;

      renderProduct(product);
      spinner.style.display = 'none';
      container.style.display = 'grid';
    } catch (e) {
      showError('Product not found.');
      console.error(e);
    }
  }

  function renderProduct(product) {
    container.innerHTML = `
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-detail-info">
        <span class="product-detail-category">${product.category}</span>
        <h1 class="product-detail-title">${product.title}</h1>
        <div class="product-detail-rating">
          <span>${product.rating.rate}/5</span>
          <span>(${product.rating.count} reviews)</span>
        </div>
        <div class="product-detail-price">$${product.price.toFixed(2)}</div>
        <p class="product-detail-description">${product.description}</p>
        <div class="product-detail-actions">
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn">Add to Cart</button>
          <a href="index.html" class="btn btn-secondary btn-lg">Continue Shopping</a>
        </div>
      </div>
    `;

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      addToCart(product);
      showToast(`"${product.title}" added to cart!`);
    });
  }

  function showError(msg) {
    spinner.style.display = 'none';
    container.style.display = 'none';
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = `<p>${msg}</p><a href="index.html" class="btn btn-primary" style="margin-top:1rem;">Back to Shop</a>`;
    document.querySelector('.page-content .container').appendChild(div);
  }
});
