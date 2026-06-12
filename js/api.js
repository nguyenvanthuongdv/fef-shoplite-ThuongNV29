/* API Helper — Fake Store API */

const API_BASE = 'https://fakestoreapi.com';

async function apiFetch(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

async function getAllProducts() {
  return apiFetch('/products');
}

async function getProductById(id) {
  return apiFetch(`/products/${id}`);
}

async function getCategories() {
  return apiFetch('/products/categories');
}
