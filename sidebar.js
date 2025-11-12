document.addEventListener("DOMContentLoaded", () => {
  // Cari elemen sidebar, buat jika belum ada
  let sidebar = document.querySelector(".sidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.classList.add("sidebar");
    document.body.prepend(sidebar);
  }

  // Daftar halaman
  const pages = [
    { name: "🏠 Home", link: "index.html" },
    { name: "💡 About", link: "about.html" },
    { name: "✨ Features", link: "features.html" },
    { name: "⏳ Monitor", link: "monitor.html" },
    { name: "⚙️ Services", link: "services.html" },
    { name: "💰 Pricing", link: "pricing.html" },
    { name: "📩 Contact", link: "contact.html" },
    { name: "🛒 Store", link: "store.html" },
    { name: "🎮 Top Up", link: "topup.html" },
    { name: "☄️ Collaboration", link: "collaboration.html" }
  ];

  // Bangun sidebar
  sidebar.innerHTML = `
    <h2 class="logo">ONE<span>DEV</span></h2>
    <nav>
      ${pages.map(p => `<a href="${p.link}" class="${window.location.pathname.includes(p.link) ? "active" : ""}">${p.name}</a>`).join("")}
    </nav>
    <footer class="sidebar-footer">
      <hr class="footer-divider" />
      <p>© 2025 <a href="https://onedevofficial.vercel.app" target="_blank">OneDev</a></p>
      <p class="credit">Powered by <span>OneDev Technologies</span></p>
    </footer>
  `;

  // Tombol toggle sidebar
  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });
  }

  // Tutup sidebar jika klik luar di mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 900 &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(e.target) &&
        !e.target.closest("#menuBtn")) {
      sidebar.classList.remove("active");
    }
  });
});