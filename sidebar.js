// sidebar.js
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar HTML otomatis
  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <h2 class="logo">ONE<span>DEV</span></h2>
      <nav>
        <a href="index.html">🏠 Home</a>
        <a href="store.html">🛒 Store</a>
        <a href="monitor.html">⏳ Monitor</a>
        <a href="about.html">💡 About</a>
        <a href="services.html">⚙️ Services</a>
        <a href="contact.html">📩 Contact</a>
      </nav>
      <footer>© 2025 ONEDEV. All rights reserved.</footer>
    </aside>
  `;
  document.getElementById("sidebar-container").innerHTML = sidebarHTML;

  // Header otomatis
  const headerHTML = `
    <header>
      <div class="header-left">
        <button class="menu-btn" id="menuBtn">☰</button>
        <h1 id="pageTitle"></h1>
      </div>
    </header>
  `;
  document.getElementById("header-container").innerHTML = headerHTML;

  // Tentukan judul halaman otomatis
  const titleMap = {
    "index.html"; "Home",
    "store.html": "ONEDEV Store",
    "monitor.html": "Server Monitor",
    "about.html": "Tentang ONEDEV",
    "services.html": "Layanan Kami",
    "contact.html": "Hubungi Kami"
  };
  const currentFile = window.location.pathname.split("/").pop();
  document.getElementById("pageTitle").innerText = titleMap[currentFile] || "ONEDEV";

  // Tombol menu sidebar
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  menuBtn.addEventListener("click", () => sidebar.classList.toggle("active"));

  // Tandai link aktif
  document.querySelectorAll(".sidebar nav a").forEach(link => {
    if (link.href.includes(currentFile)) link.classList.add("active");
  });
});