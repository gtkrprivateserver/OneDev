document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const orderModal = document.getElementById("orderModal");
  const closeModal = document.getElementById("closeModal");
  const orderForm = document.getElementById("orderForm");
  const statusText = document.getElementById("statusText");

  const webhookURL = "YOUR_DISCORD_WEBHOOK_URL"; // Ganti webhook Discord kamu

  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".topup-card");
      document.getElementById("product").value = card.dataset.product;
      document.getElementById("price").value = card.dataset.price;
      overlay.classList.remove("hidden");
      orderModal.classList.remove("hidden");
    });
  });

  closeModal.addEventListener("click", () => {
    overlay.classList.add("hidden");
    orderModal.classList.add("hidden");
  });

  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    orderModal.classList.add("hidden");
  });

  orderForm.addEventListener("submit", async e => {
    e.preventDefault();

    const product = document.getElementById("product").value;
    const price = document.getElementById("price").value;
    const name = document.getElementById("buyerName").value;
    const discordName = document.getElementById("discordName").value;
    const growID = document.getElementById("growID").value;
    const note = document.getElementById("note").value;

    statusText.textContent = "Please be patient, your order is being processed...";

    const embed = {
      embeds: [{
        title: "🛒 New Top Up Order",
        color: 3447003,
        fields: [
          { name: "Produk", value: product, inline: true },
          { name: "Harga", value: price, inline: true },
          { name: "Nama", value: name || "-", inline: false },
          { name: "Discord", value: discordName, inline: false },
          { name: "GrowID GTKR", value: growID, inline: false },
          { name: "Catatan", value: note || "-", inline: false }
        ],
        footer: { text: "ONEDEV TopUp System" },
        timestamp: new Date()
      }],
      components: [{
        type: 1,
        components: [
          { type: 2, style: 3, label: "✅ Setuju", custom_id: "approve_order" },
          { type: 2, style: 4, label: "❌ Tolak", custom_id: "reject_order" }
        ]
      }]
    };

    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    });

    statusText.textContent = "✅ Order terkirim ke admin, mohon tunggu konfirmasi.";
    orderForm.reset();
  });
});