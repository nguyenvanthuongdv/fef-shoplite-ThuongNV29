/* Home Page — Product List */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PER_PAGE = 8;

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const pagination = document.getElementById('pagination');
const resultsCount = document.getElementById('results-count');
const spinner = document.getElementById('loading-spinner');

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
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
        <span class="stars">${product.rating.rate}/5</span>
        <span>(${product.rating.count})</span>
      </div>
    </div>
    <div class="product-card-footer">
      <span class="product-card-price">$${product.price.toFixed(2)}</span>
      <div class="product-card-actions">
        <button class="btn btn-primary btn-sm" onclick="handleAddToCart(${product.id})">Add</button>
        <a href="product.html?id=${product.id}" class="btn btn-secondary btn-sm">View</a>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  productGrid.innerHTML = '';
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const page = filteredProducts.slice(start, end);

  if (page.length === 0) {
    productGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>No products found.</p></div>';
    pagination.innerHTML = '';
    resultsCount.textContent = '';
    return;
  }

  page.forEach(p => productGrid.appendChild(createProductCard(p)));
  resultsCount.textContent = `Showing ${start + 1}–${Math.min(end, filteredProducts.length)} of ${filteredProducts.length}`;
  renderPagination();
}

function renderPagination() {
  pagination.innerHTML = '';
  const total = Math.ceil(filteredProducts.length / PER_PAGE);
  if (total <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = '‹';
  prev.disabled = currentPage === 1;
  prev.onclick = () => { currentPage--; renderProducts(); };
  pagination.appendChild(prev);

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = () => { currentPage = i; renderProducts(); };
    pagination.appendChild(btn);
  }

  const next = document.createElement('button');
  next.textContent = '›';
  next.disabled = currentPage === total;
  next.onclick = () => { currentPage++; renderProducts(); };
  pagination.appendChild(next);
}

function applyFilters() {
  const search = searchInput.value.toLowerCase().trim();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  filteredProducts = allProducts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search);
    const matchCat = !cat || p.category === cat;
    return matchSearch && matchCat;
  });

  if (sort === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
  else if (sort === 'name-asc') filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'name-desc') filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  else if (sort === 'rating') filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);

  currentPage = 1;
  renderProducts();
}

function handleAddToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (product) {
    addToCart(product);
    showToast(`"${product.title}" added to cart!`);
  }
}

async function loadCategories() {
  try {
    const cats = await getCategories();
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
      categorySelect.appendChild(opt);
    });
  } catch (e) {
    console.error('Failed to load categories:', e);
  }
}

async function initHome() {
  try {
    spinner.style.display = 'flex';
    productGrid.style.display = 'none';

    const [products] = await Promise.all([getAllProducts(), loadCategories()]);
    allProducts = products;
    filteredProducts = [...allProducts];

    spinner.style.display = 'none';
    productGrid.style.display = 'grid';
    renderProducts();
  } catch (e) {
    spinner.innerHTML = '<div class="empty-state"><p>Failed to load products.</p><button class="btn btn-primary" onclick="initHome()" style="margin-top:1rem;">Retry</button></div>';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    initHome();
  }
});
