// === SIDEBAR AUTO GENERATOR ===

// Daftar halaman utama (otomatis di semua page)
const pages = [
  { name: "Home", link: "index.html" },
  { name: "About", link: "about.html" },
  { name: "Features", link: "features.html" },
  { name: "Monitor", link: "monitor.html" },
  { name: "Pricing", link: "pricing.html" },
  { name: "Contact", link: "contact.html" },
  { name: "Store", link: "store.html" }
];

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  // === Buat struktur sidebar ===
  sidebar.innerHTML = `
    <div class="logo">One<span>Dev</span></div>

    <nav>
      ${pages
        .map(
          (p) =>
            `<a href="${p.link}" class="${
              window.location.pathname.includes(p.link) ? "active" : ""
            }">${p.name}</a>`
        )
        .join("")}
    </nav>

    <footer class="sidebar-footer">
      <hr class="footer-divider" />
      <p>© 2025 <a href="https://onedevofficial.vercel.app" target="_blank">OneDev</a></p>
      <p class="credit">Powered by <span>OneDev Technologies</span></p>
    </footer>
  `;

  // === Sidebar toggle (tombol ☰) ===
  const menuBtn = document.getElementById("menu-toggle");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Tutup sidebar otomatis di layar kecil kalau klik di luar
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !e.target.closest("#menu-toggle")
    ) {
      sidebar.classList.remove("active");
    }
  });
});