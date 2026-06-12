/* ============================================
   API HELPER — Fake Store API
   ============================================ */

const API_BASE = 'https://fakestoreapi.com';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get all products
 */
async function getAllProducts() {
  return apiFetch('/products');
}

/**
 * Get a single product by ID
 */
async function getProductById(id) {
  return apiFetch(`/products/${id}`);
}

/**
 * Get all categories
 */
async function getCategories() {
  return apiFetch('/products/categories');
}

/**
 * Get products by category
 */
async function getProductsByCategory(category) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}`);
}
