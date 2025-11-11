// === SIDEBAR AUTO GENERATOR ===

// Daftar halaman (otomatis muncul di semua pages)
const pages = [
  { name: "Home", link: "index.html" },
  { name: "About", link: "about.html" },
  { name: "Features", link: "features.html" },
  { name: "Monitor", link: "monitor.html" },
  { name: "Pricing", link: "pricing.html" },
  { name: "Contact", link: "contact.html" },
  { name: "Store", link: "store.html" }
];

// Tambahkan sidebar ke semua halaman yang memiliki elemen .sidebar
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  // Buat struktur sidebar
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
    <footer>
      <p>© 2025 OneDev</p>
    </footer>
  `;

  // Sidebar toggle (☰)
  const menuBtn = document.getElementById("menu-toggle");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Responsif: klik di luar sidebar -> auto tutup (mobile)
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