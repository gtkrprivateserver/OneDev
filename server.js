const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // npm i node-fetch

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_ADMIN_TOKEN = process.env.BOT_ADMIN_TOKEN; // railway secret
const ADMIN_ID = process.env.ADMIN_ID;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'TopUp.html'));
});

app.post('/order', async (req, res) => {
  const {buyerName, discordName, growID, product, price} = req.body;

  try {
    // Kirim ke Webhook Channel
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: "OneDev TopUp",
        embeds: [{
          title: "🛒 New Order",
          description: `**Nama:** ${buyerName}\n**Discord:** ${discordName}\n**GrowID:** ${growID}\n**Produk:** ${product}\n**Harga:** ${price}`,
          color: 5814783,
          footer: { text: "OneDev TopUp System" }
        }]
      })
    });

    // Kirim ke admin bot
    await fetch(`https://discord.com/api/v10/users/${ADMIN_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${BOT_ADMIN_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `📢 Pesanan Baru!\nNama: ${buyerName}\nDiscord: ${discordName}\nGrowID: ${growID}\nProduk: ${product}\nHarga: ${price}\nKlik tombol untuk proses.`,
        components: [{
          type: 1,
          components: [
            {type: 2, label: "✅ Setuju", style: 3, custom_id: "approve_order"},
            {type: 2, label: "❌ Tolak", style: 4, custom_id: "reject_order"}
          ]
        }]
      })
    });

    res.json({message: "✅ Pesanan berhasil dikirim! Tunggu admin memproses."});
  } catch (err) {
    console.error(err);
    res.json({message: "❌ Terjadi kesalahan. Coba lagi."});
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));