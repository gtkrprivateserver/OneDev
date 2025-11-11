// sidebar.js — Sidebar dan Header otomatis dengan animasi elegan

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // === SIDEBAR ===
  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <h2 class="logo">ONE<span>DEV</span></h2>
      <nav>
        <a href="index.html">🏠 Home</a>
        <a href="about.html">💡 About</a>
        <a href="features.html">✨ Features</a>
        <a href="monitor.html">⏳ Monitor</a>
        <a href="pricing.html">💰 Pricing</a>
        <a href="store.html">🛒 Store</a>
        <a href="contact.html">📩 Contact</a>
      </nav>
      <footer>© 2025 ONEDEV. All rights reserved.</footer>
    </aside>
  `;

  // === HEADER ===
  const headerHTML = `
    <header class="global-header">
      <div class="header-left">
        <button class="menu-btn" id="menuBtn">☰</button>
        <h1 id="pageTitle"></h1>
      </div>
    </header>
  `;

  // Sisipkan header & sidebar hanya jika belum ada
  if (!document.querySelector(".sidebar")) body.insertAdjacentHTML("afterbegin", sidebarHTML);
  const main = document.querySelector(".main-content");
  if (main && !main.querySelector("header")) main.insertAdjacentHTML("afterbegin", headerHTML);

  // === EVENT MENU BUTTON ===
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      menuBtn.classList.toggle("active");
    });
  }

  // === HALAMAN AKTIF ===
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".sidebar nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  // === JUDUL OTOMATIS ===
  const titles = {
    "index.html": "Home",
    "about.html": "About",
    "features.html": "Features",
    "monitor.html": "Monitor Bot",
    "pricing.html": "Pricing",
    "store.html": "Store",
    "contact.html": "Contact"
  };
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle && titles[currentPage]) pageTitle.textContent = titles[currentPage];
});