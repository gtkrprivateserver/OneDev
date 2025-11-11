document.addEventListener("DOMContentLoaded", () => {
  const adsContainer = document.getElementById("adsContainer");

  if (!adsContainer) return; // jika halaman tidak ada adsContainer, skip

  // Array banner (bisa ditambah banyak)
  const banners = [
    {
      text: "Dapatkan Paket AI Terbaik ONEDEV Sekarang!",
      link: "https://onedev.example.com/pricing"
    },
    {
      text: "Top Up Saldo ONEDEV dengan Mudah!",
      link: "https://onedev.example.com/topup"
    },
    {
      text: "Kolaborasi Eksklusif: GTKR x DonatSur",
      link: "https://onedev.example.com/collaboration"
    }
  ];

  // Pilih banner random
  const banner = banners[Math.floor(Math.random() * banners.length)];

  // Buat element
  const bannerEl = document.createElement("a");
  bannerEl.className = "ads-banner";
  bannerEl.href = banner.link;
  bannerEl.target = "_blank";
  bannerEl.textContent = banner.text;

  // Tambahkan ke container
  adsContainer.appendChild(bannerEl);
});