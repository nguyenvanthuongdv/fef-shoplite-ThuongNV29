/* ============================================
   PRODUCT DETAIL PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-detail-container');
  const loadingSpinner = document.getElementById('loading-spinner');

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showError('No product ID specified.');
    return;
  }

  loadProduct(productId);

  async function loadProduct(id) {
    try {
      loadingSpinner.style.display = 'flex';
      container.style.display = 'none';

      const product = await getProductById(id);

      document.title = `${product.title} — Shopelite`;

      // Update breadcrumb
      const breadcrumbTitle = document.getElementById('breadcrumb-title');
      if (breadcrumbTitle) {
        breadcrumbTitle.textContent = product.title.length > 40
          ? product.title.substring(0, 40) + '...'
          : product.title;
      }

      renderProduct(product);

      loadingSpinner.style.display = 'none';
      container.style.display = 'grid';
    } catch (err) {
      showError('Product not found. It may have been removed or the ID is invalid.');
      console.error('Load product error:', err);
    }
  }

  function renderProduct(product) {
    const starsHTML = renderDetailStars(product.rating.rate);

    container.innerHTML = `
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-detail-info">
        <span class="product-detail-category">${product.category}</span>
        <h1 class="product-detail-title">${product.title}</h1>
        
        <div class="product-detail-rating">
          <div class="rating-stars">${starsHTML}</div>
          <span class="rating-score">${product.rating.rate}</span>
          <span class="rating-count">(${product.rating.count} reviews)</span>
        </div>

        <div class="product-detail-price">${product.price.toFixed(2)}</div>

        <p class="product-detail-description">${product.description}</p>

        <div class="product-detail-actions">
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn">
            🛒 Add to Cart
          </button>
          <a href="index.html" class="btn btn-secondary btn-lg">
            ← Continue Shopping
          </a>
        </div>
      </div>
    `;

    // Add to cart event
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      addToCart(product);
      showToast(`"${product.title.substring(0, 30)}..." added to cart!`, 'success');
    });
  }

  function renderDetailStars(rate) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rate)) {
        html += '★';
      } else if (i === Math.ceil(rate) && rate % 1 >= 0.5) {
        html += '★';
      } else {
        html += '☆';
      }
    }
    return html;
  }

  function showError(message) {
    loadingSpinner.style.display = 'none';
    container.style.display = 'none';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'empty-state';
    errorDiv.innerHTML = `
      <div class="empty-icon">😕</div>
      <p>${message}</p>
      <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">← Back to Shop</a>
    `;
    document.querySelector('.page-content .container').appendChild(errorDiv);
  }
});
