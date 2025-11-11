document.addEventListener("DOMContentLoaded", () => {
  const buyButtons = document.querySelectorAll(".btn-buy");
  const paymentForm = document.getElementById("paymentForm");
  const closeForm = document.getElementById("closeForm");
  const productInput = document.getElementById("product");
  const priceInput = document.getElementById("price");

  // Tombol beli
  buyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".store-card");
      const productName = card.dataset.product;
      const productPrice = card.dataset.price;

      // Isi otomatis
      productInput.value = productName;
      priceInput.value = productPrice;

      // Tampilkan form
      paymentForm.style.display = "block";
      paymentForm.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Tombol tutup form
  closeForm.addEventListener("click", () => {
    paymentForm.style.display = "none";
  });

  // Submit form
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const product = productInput.value;
    const price = priceInput.value;
    const email = document.getElementById("email").value;
    const notes = document.getElementById("notes").value;

    // Contoh kirim ke WhatsApp
    const phoneNumber = "628123456789"; // ganti sesuai nomor tujuan
    const message = `Halo, saya ingin membeli ${product} seharga ${price}.\nNama: ${name}\nEmail: ${email}\nCatatan: ${notes}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

    // Reset form
    paymentForm.reset();
    paymentForm.style.display = "none";
  });
});