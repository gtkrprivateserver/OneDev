document.addEventListener("DOMContentLoaded", () => {
  const adsData = [
    { text: "Promo Top Up 50%!", link: "#" },
    { text: "Dapatkan Bonus Saldo AI", link: "#" },
    { text: "Server Premium Diskon Hari Ini!", link: "#" }
  ];

  const adsContainer = document.getElementById("adsContainer");
  const adsContainerBottom = document.getElementById("adsContainerBottom");

  adsData.forEach(ad => {
    const aTop = document.createElement("a");
    aTop.href = ad.link;
    aTop.className = "ads-banner";
    aTop.textContent = ad.text;
    adsContainer.appendChild(aTop);

    const aBottom = document.createElement("a");
    aBottom.href = ad.link;
    aBottom.className = "ads-banner";
    aBottom.textContent = ad.text;
    adsContainerBottom.appendChild(aBottom);
  });
});