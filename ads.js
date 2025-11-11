document.addEventListener("DOMContentLoaded", () => {
  const adsContainer = document.getElementById("adsContainer");
  if (!adsContainer) return;

  const banners = [
    { text: "🔥 Promo Top Up! Dapatkan bonus + event eksklusif hari ini!", link: "#topup" },
    { text: "💎 Paket AI Premium diskon 20%! Buruan klaim sekarang!", link: "#topup" },
    { text: "🎉 Kolaborasi GTKR x DonatSur: Event & reward spesial menunggu!", link: "#collab" },
    { text: "🚀 Upgrade server Anda dengan paket Pro sekarang!", link: "#pricing" }
  ];

  let currentIndex = 0;

  const showBanner = (index) => {
    adsContainer.innerHTML = "";
    const banner = document.createElement("a");
    banner.className = "ads-banner";
    banner.href = banners[index].link;
    banner.target = "_blank";
    banner.textContent = banners[index].text;
    adsContainer.appendChild(banner);
  };

  showBanner(currentIndex);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % banners.length;
    showBanner(currentIndex);
  }, 5000);
});