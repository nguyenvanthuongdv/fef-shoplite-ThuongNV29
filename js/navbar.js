/* Navbar — Toggle + Badge Init */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navbar-toggle');
  const links = document.getElementById('navbar-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  if (typeof updateCartBadge === 'function') updateCartBadge();
});
