/* ============================================
   HOME PAGE JS — Product List
   ============================================ */

// State
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 8;

// DOM elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const paginationContainer = document.getElementById('pagination');
const resultsCount = document.getElementById('results-count');
const loadingSpinner = document.getElementById('loading-spinner');

/**
 * Generate star rating HTML
 */
function renderStars(rate) {
  const full = Math.floor(rate);
  const half = rate % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/**
 * Render a single product card
 */
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.animationDelay = `${index * 0.05}s`;

  card.innerHTML = `
    <a href="product.html?id=${product.id}" class="product-card-image">
      <img src="${product.image}" alt="${product.title}" loading="lazy">
    </a>
    <div class="product-card-body">
      <span class="product-card-category">${product.category}</span>
      <h3 class="product-card-title">
        <a href="product.html?id=${product.id}">${product.title}</a>
      </h3>
      <div class="product-card-rating">
        <span class="stars">${renderStars(product.rating.rate)}</span>
        <span>${product.rating.rate}</span>
        <span>(${product.rating.count})</span>
      </div>
    </div>
    <div class="product-card-footer">
      <span class="product-card-price">${product.price.toFixed(2)}</span>
      <div class="product-card-actions">
        <button class="btn btn-primary btn-sm" onclick="handleAddToCart(${product.id})" title="Add to cart">
          🛒 Add
        </button>
        <a href="product.html?id=${product.id}" class="btn btn-secondary btn-sm" title="View details">
          👁 View
        </a>
      </div>
    </div>
  `;

  return card;
}

/**
 * Render products to the grid
 */
function renderProducts() {
  productGrid.innerHTML = '';

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageProducts = filteredProducts.slice(start, end);

  if (pageProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <p>No products found matching your criteria.</p>
      </div>
    `;
    paginationContainer.innerHTML = '';
    resultsCount.textContent = '';
    return;
  }

  pageProducts.forEach((product, index) => {
    productGrid.appendChild(createProductCard(product, index));
  });

  resultsCount.textContent = `Showing ${start + 1}–${Math.min(end, filteredProducts.length)} of ${filteredProducts.length} products`;
  renderPagination();
}

/**
 * Render pagination buttons
 */
function renderPagination() {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  if (totalPages <= 1) return;

  // Prev button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '‹';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => { currentPage--; renderProducts(); scrollToProducts(); });
  paginationContainer.appendChild(prevBtn);

  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.addEventListener('click', () => { currentPage = i; renderProducts(); scrollToProducts(); });
    paginationContainer.appendChild(btn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '›';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => { currentPage++; renderProducts(); scrollToProducts(); });
  paginationContainer.appendChild(nextBtn);
}

function scrollToProducts() {
  document.querySelector('.controls-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Apply search, filter, and sort to products
 */
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const category = categorySelect.value;
  const sort = sortSelect.value;

  filteredProducts = allProducts.filter(product => {
    const matchSearch = !searchTerm || product.title.toLowerCase().includes(searchTerm);
    const matchCategory = !category || product.category === category;
    return matchSearch && matchCategory;
  });

  // Sort
  switch (sort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
  }

  currentPage = 1;
  renderProducts();
}

/**
 * Handle "Add to Cart" click
 */
function handleAddToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
    addToCart(product);
    showToast(`"${product.title.substring(0, 30)}..." added to cart!`, 'success');
  }
}

/**
 * Populate category dropdown
 */
async function loadCategories() {
  try {
    const categories = await getCategories();
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

/**
 * Initialize the home page
 */
async function initHomePage() {
  try {
    loadingSpinner.style.display = 'flex';
    productGrid.style.display = 'none';

    const [products] = await Promise.all([
      getAllProducts(),
      loadCategories(),
    ]);

    allProducts = products;
    filteredProducts = [...allProducts];

    loadingSpinner.style.display = 'none';
    productGrid.style.display = 'grid';

    renderProducts();
  } catch (err) {
    loadingSpinner.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>Failed to load products. Please try again.</p>
        <button class="btn btn-primary" onclick="initHomePage()" style="margin-top: 1rem;">Retry</button>
      </div>
    `;
    console.error('Init error:', err);
  }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    initHomePage();
  }
});
