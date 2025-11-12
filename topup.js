// === Webhook Discord kamu ===
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1438092114368921702/W8HAa-2Cp43crDKZ-7NcXpFCqf1heEKuik7b6f7QlDYwlTS7wWViJ54Yu9cYC3SzN3G2"; // GANTI

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("orderModal");
  const closeModal = document.getElementById("closeModal");
  const spinner = document.getElementById("spinner");
  const statusText = document.getElementById("statusText");
  const orderForm = document.getElementById("orderForm");

  // Buka form popup saat klik produk
  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".topup-card");
      document.getElementById("product").value = card.dataset.product;
      document.getElementById("price").value = card.dataset.price;
      overlay.style.display = "block";
      modal.style.display = "block";
    });
  });

  // Tutup popup
  const hideModal = () => {
    overlay.style.display = "none";
    modal.style.display = "none";
    orderForm.reset();
    spinner.style.display = "none";
    statusText.textContent = "";
  };
  closeModal.addEventListener("click", hideModal);
  overlay.addEventListener("click", hideModal);

  // Saat submit form
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    spinner.style.display = "block";
    statusText.textContent = "Please be patient, your order is being processed...";

    const data = {
      product: document.getElementById("product").value,
      price: document.getElementById("price").value,
      name: document.getElementById("buyerName").value,
      discord: document.getElementById("discordName").value,
      growid: document.getElementById("growid").value,
      phone: document.getElementById("buyerPhone").value,
      note: document.getElementById("note").value || "Tidak ada catatan"
    };

    // Kirim ke Discord Webhook
    const payload = {
      embeds: [{
        title: "🛒 New Top Up Order",
        color: 3447003,
        fields: [
          { name: "Produk", value: data.product, inline: true },
          { name: "Harga", value: data.price, inline: true },
          { name: "Nama", value: data.name, inline: false },
          { name: "Discord", value: data.discord, inline: false },
          { name: "GrowID (GTKR)", value: data.growid, inline: false },
          { name: "WhatsApp", value: data.phone, inline: false },
          { name: "Catatan", value: data.note, inline: false }
        ],
        footer: { text: "ONEDEV Top Up System" },
        timestamp: new Date()
      }],
      components: [{
        type: 1,
        components: [
          {
            type: 2,
            style: 3,
            label: "✅ Setuju",
            custom_id: "approve_order"
          },
          {
            type: 2,
            style: 4,
            label: "❌ Tolak",
            custom_id: "reject_order"
          }
        ]
      }]
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        spinner.style.display = "none";
        statusText.textContent = "✅ Pesanan berhasil dikirim! Tunggu konfirmasi admin.";
        setTimeout(hideModal, 3000);
      } else {
        throw new Error("Gagal mengirim ke webhook");
      }
    } catch (err) {
      spinner.style.display = "none";
      statusText.textContent = "❌ Terjadi kesalahan saat mengirim pesanan.";
      console.error(err);
    }
  });
});