document.addEventListener("DOMContentLoaded", () => {
  const buyButtons = document.querySelectorAll(".btn-buy");
  const overlay = document.getElementById("formOverlay");
  const paymentForm = document.getElementById("paymentForm");
  const closeForm = document.getElementById("closeForm");
  const productInput = document.getElementById("product");
  const priceInput = document.getElementById("price");

  // Tombol beli
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".store-card");
      productInput.value = card.dataset.product;
      priceInput.value = card.dataset.price;

      overlay.style.display = "flex";
    });
  });

  // Tutup popup
  closeForm.addEventListener("click", () => overlay.style.display = "none");
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.style.display = "none";
  });

  // Submit form
  paymentForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const product = productInput.value;
    const price = priceInput.value;
    const email = document.getElementById("email").value;
    const notes = document.getElementById("notes").value;

    // Kirim ke WhatsApp
    const phoneNumber = "628123456789"; // ganti nomor tujuan
    const message = `Halo, saya ingin membeli ${product} seharga ${price}.\nNama: ${name}\nEmail: ${email}\nCatatan: ${notes}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

    paymentForm.reset();
    overlay.style.display = "none";
  });
});