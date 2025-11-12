import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔐 Ambil secret dari Railway
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const ADMIN_ID = process.env.DISCORD_ADMIN_ID;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.post("/api/topup", async (req, res) => {
  const { buyerName, discordName, growID, product, price } = req.body;
  if (!buyerName || !discordName || !growID) {
    return res.json({ success: false, message: "Data tidak lengkap" });
  }

  // === 1️⃣ Kirim ke Discord Webhook (channel) ===
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "OneDev TopUp",
      embeds: [{
        title: "🛒 Pesanan Baru",
        description: `**Nama:** ${buyerName}\n**Discord:** ${discordName}\n**GrowID:** ${growID}\n**Produk:** ${product}\n**Harga:** ${price}`,
        color: 5814783,
        footer: { text: "OneDev TopUp System" }
      }]
    })
  });

  // === 2️⃣ Kirim ke Admin DM lewat Bot Token ===
  await fetch(`https://discord.com/api/v10/users/${ADMIN_ID}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: `📩 **Pesanan Baru!**
**Nama:** ${buyerName}
**Discord:** ${discordName}
**GrowID:** ${growID}
**Produk:** ${product}
**Harga:** ${price}

Tindakan admin:`,
      components: [{
        type: 1,
        components: [
          { type: 2, style: 3, label: "✅ Setuju", custom_id: "approve_order" },
          { type: 2, style: 4, label: "❌ Tolak", custom_id: "reject_order" }
        ]
      }]
    })
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("✅ OneDev TopUp Backend Aktif"));