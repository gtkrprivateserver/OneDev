const overlay = document.getElementById("overlay");
const modal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const productInput = document.getElementById("product");
const priceInput = document.getElementById("price");
const statusText = document.getElementById("statusText");

document.querySelectorAll(".btn-buy").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".topup-card");
    productInput.value = card.dataset.product;
    priceInput.value = card.dataset.price;
    modal.classList.remove("hidden");
    overlay.classList.add("active");
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  modal.classList.add("hidden");
  overlay.classList.remove("active");
});

// Form submit (fetch webhook + admin bot handled in server)
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  const buyerName = document.getElementById("buyerName").value;
  const discordName = document.getElementById("discordName").value;
  const growID = document.getElementById("growID").value;
  const product = productInput.value;
  const price = priceInput.value;

  statusText.textContent = "Please be patient, your order is being processed...";

  // Kirim request ke server.js untuk webhook/admin bot
  fetch('/order', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({buyerName, discordName, growID, product, price})
  }).then(res => res.json())
    .then(data => {
      statusText.textContent = data.message;
      document.getElementById("orderForm").reset();
    })
    .catch(err => {
      statusText.textContent = "Gagal mengirim order. Coba lagi.";
    });
});