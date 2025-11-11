document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  // === Daftar halaman ===
  const pages = [
    { name: "🏠 Home", link: "index.html" },
    { name: "💡 About", link: "about.html" },
    { name: "✨ Features", link: "features.html" },
    { name: "⏳ Monitor", link: "monitor.html" },
    { name: "💰 Pricing", link: "pricing.html" },
    { name: "📩 Contact", link: "contact.html" },
    { name: "🛒 Store", link: "store.html" }
  ];

  // === Struktur Sidebar ===
  sidebar.innerHTML = `
    <h2 class="logo">ONE<span>DEV</span></h2>
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

  // === Toggle tombol menu ===
  const menuBtn = document.getElementById("menu-toggle");
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // biar klik tombol nggak dianggap klik luar
      sidebar.classList.toggle("active");
    });
  }

  // Tutup sidebar jika klik area luar (hanya untuk mobile)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 900 && // biar cuma di HP
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !e.target.closest("#menu-toggle")
    ) {
      sidebar.classList.remove("active");
    }
  });
});