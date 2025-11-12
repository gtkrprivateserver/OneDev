import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// === CONFIG PATH STATIC ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// === ENVIRONMENT VARIABLE dari RAILWAY ===
const TOKEN = process.env.TOKEN;           // Token Bot Admin (OneDev TopUp)
const ADMIN_ID = process.env.ADMIN_ID;     // ID Admin Discord
const WEBHOOK_URL = process.env.WEBHOOK_URL; // Webhook Channel Discord

// === ROUTE UNTUK NOTIFIKASI ===
app.post("/notify", async (req, res) => {
  try {
    const { buyerName, discordName, growID, product, price } = req.body;

    // 1️⃣ Kirim ke Channel via Webhook
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

    // 2️⃣ Kirim ke Admin via Bot Token (DM)
    await fetch(`https://discord.com/api/v10/users/${ADMIN_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `📢 **Pesanan Baru Masuk!**
**Nama:** ${buyerName}
**Discord:** ${discordName}
**GrowID:** ${growID}
**Produk:** ${product}
**Harga:** ${price}

Silakan pilih tindakan:`,
        components: [{
          type: 1,
          components: [
            { type: 2, label: "✅ Setuju", style: 3, custom_id: "approve_order" },
            { type: 2, label: "❌ Tolak", style: 4, custom_id: "reject_order" }
          ]
        }]
      })
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Gagal mengirim notifikasi." });
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ OneDev TopUp aktif di port ${PORT}`));