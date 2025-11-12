// topup.js
// meng-handle popup dan kirim order ke server (/api/order).
document.addEventListener('DOMContentLoaded', () => {
  const buyButtons = document.querySelectorAll('.btn-buy');
  const overlay = document.getElementById('overlay');
  const orderModal = document.getElementById('orderModal');
  const closeModal = document.getElementById('closeModal');
  const productInput = document.getElementById('product');
  const priceInput = document.getElementById('price');
  const orderForm = document.getElementById('orderForm');
  const statusText = document.getElementById('statusText');

  const API_BASE = ''; // jika frontend dilayani dari server yang sama, biarkan kosong. Jika beda domain, isi url lengkap seperti 'https://your-domain.com'

  function openModal(product, price) {
    productInput.value = product;
    priceInput.value = price;
    overlay.classList.remove('hidden');
    orderModal.classList.remove('hidden');
    statusText.textContent = '';
  }

  function closeModalFn() {
    overlay.classList.add('hidden');
    orderModal.classList.add('hidden');
    orderForm.reset();
    statusText.textContent = '';
    stopPolling();
  }

  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.topup-card');
      const product = card.dataset.product;
      const price = card.dataset.price;
      openModal(product, price);
    });
  });

  closeModal.addEventListener('click', closeModalFn);
  overlay.addEventListener('click', closeModalFn);

  // polling handle
  let pollingInterval = null;
  function startPolling(orderId) {
    if (pollingInterval) clearInterval(pollingInterval);
    statusText.textContent = 'Please wait, admin sedang memproses...';
    pollingInterval = setInterval(async () => {
      try {
        const resp = await fetch(`${API_BASE}/api/order/${orderId}/status`);
        const data = await resp.json();
        if (data.status === 'approved') {
          statusText.textContent = '✅ Congratulations, your process was successful';
          clearInterval(pollingInterval);
        } else if (data.status === 'rejected') {
          statusText.textContent = '❌ Your process failed';
          clearInterval(pollingInterval);
        } else {
          // tetap pending
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 3000);
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const buyerName = document.getElementById('buyerName').value;
    const buyerPhone = document.getElementById('buyerPhone').value;
    const product = productInput.value;
    const price = priceInput.value;
    const note = document.getElementById('note').value;

    if (!buyerPhone) {
      alert('Masukkan nomor WhatsApp tujuan (contoh: 62812...)');
      return;
    }

    // Kirim ke server
    try {
      const resp = await fetch(`${API_BASE}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerName, buyerPhone, product, price, note })
      });
      const data = await resp.json();
      if (data.id) {
        // mulai polling status
        startPolling(data.id);
        statusText.textContent = 'Please wait, admin sedang memproses...';
      } else {
        statusText.textContent = 'Error: tidak mendapat order ID';
      }
    } catch (err) {
      console.error(err);
      statusText.textContent = 'Gagal mengirim order, coba lagi.';
    }
  });
});