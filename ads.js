document.addEventListener("DOMContentLoaded", () => {
  const adsContainerTop = document.getElementById("adsContainer");
  const adsContainerBottom = document.getElementById("adsContainerBottom");

  const ads = [
    "Promo AI Pack 50% OFF!",
    "Top Up sekarang dan dapatkan bonus server!",
    "Limited Offer: Pro Plan + Extra Support!"
  ];

  function createAdBanner(text) {
    const a = document.createElement("a");
    a.className = "ads-banner";
    a.href = "#";
    a.textContent = text;
    return a;
  }

  ads.forEach(ad => {
    adsContainerTop.appendChild(createAdBanner(ad));
    adsContainerBottom.appendChild(createAdBanner(ad));
  });
});