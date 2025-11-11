document.addEventListener("DOMContentLoaded", () => {
  const adsContainer = document.getElementById("adsContainer");

  if (adsContainer) {
    const banner = document.createElement("div");
    banner.className = "ads-banner";
    banner.innerHTML = `
      <p>🔥 Promo Spesial! Top Up sekarang dapat bonus saldo + event eksklusif! 🔥</p>
    `;
    adsContainer.appendChild(banner);
  }
});