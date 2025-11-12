// server.js
// Node/Express relay untuk menerima order, kirim ke Discord webhook, dan handle approve/reject links.
// Environment variable required: DISCORD_WEBHOOK (string)

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || ''; // set di Railway secret

if (!DISCORD_WEBHOOK) {
  console.warn('WARNING: DISCORD_WEBHOOK not set. Set process.env.DISCORD_WEBHOOK');
}

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // optional: serve frontend from /public

// In-memory store untuk demo (ganti ke DB jika perlu)
const orders = {};

// Endpoint menerima order dari frontend
app.post('/api/order', async (req, res) => {
  try {
    const { buyerName, buyerPhone, product, price, note } = req.body;
    if (!product || !price || !buyerPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    orders[id] = {
      id,
      buyerName: buyerName || 'Unknown',
      buyerPhone,
      product,
      price,
      note: note || '',
      status: 'pending', // pending | approved | rejected
      createdAt: Date.now()
    };

    // Build approve/reject links (link buttons will open these)
    // (Note: use absolute URL — in production set HOST env)
    const host = process.env.HOST || (`${req.protocol}://${req.get('host')}`);
    const approveUrl = `${host}/order/${id}/approve`;
    const rejectUrl = `${host}/order/${id}/reject`;

    // Send message to Discord webhook with embed + link-buttons
    const embed = {
      title: 'New Topup Order',
      description: `Produk: **${product}**\nHarga: **${price}**\nNama: **${orders[id].buyerName}**\nWA: **${buyerPhone}**\nCatatan: ${orders[id].note || '-'}`,
      color: 3447003,
      timestamp: new Date().toISOString(),
      footer: { text: `Order ID: ${id}` }
    };

    // Discord webhook payload with components (link buttons)
    const payload = {
      embeds: [embed],
      content: `📥 New topup order — ID: \`${id}\``,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5, // link button
              label: '✅ Setuju',
              url: approveUrl
            },
            {
              type: 2,
              style: 5,
              label: '❌ Tolak',
              url: rejectUrl
            }
          ]
        }
      ]
    };

    if (!DISCORD_WEBHOOK) {
      console.log('ORDER (no webhook):', orders[id]);
    } else {
      await axios.post(DISCORD_WEBHOOK, payload).catch(err => {
        console.error('Discord webhook error:', err?.response?.data || err.message);
      });
    }

    // Return order id to client
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint untuk status polling
app.get('/api/order/:id/status', (req, res) => {
  const id = req.params.id;
  const order = orders[id];
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ status: order.status });
});

// Admin clicked approve link -> update status and notify channel
app.get('/order/:id/approve', async (req, res) => {
  const id = req.params.id;
  const order = orders[id];
  if (!order) return res.status(404).send('Order not found');

  if (order.status !== 'pending') {
    return res.send(`Order already processed: ${order.status}`);
  }

  order.status = 'approved';
  order.processedAt = Date.now();

  // Notify Discord that order approved (send followup)
  const msg = {
    content: `✅ Order \`${id}\` approved by admin.`,
    embeds: [
      {
        title: `Order ${id} — Approved`,
        description: `Produk: **${order.product}**\nHarga: **${order.price}**\nNama: **${order.buyerName}**\nWA: **${order.buyerPhone}**`,
        color: 3066993,
        timestamp: new Date().toISOString()
      }
    ]
  };

  if (DISCORD_WEBHOOK) {
    await axios.post(DISCORD_WEBHOOK, msg).catch(err => console.error('Discord notify error:', err?.message));
  }

  // respond with simple page admin sees
  res.send(`<h2>Order ${id} approved</h2><p>User will be notified on website (if open).</p>`);
});

// Admin clicked reject link
app.get('/order/:id/reject', async (req, res) => {
  const id = req.params.id;
  const order = orders[id];
  if (!order) return res.status(404).send('Order not found');

  if (order.status !== 'pending') {
    return res.send(`Order already processed: ${order.status}`);
  }

  order.status = 'rejected';
  order.processedAt = Date.now();

  const msg = {
    content: `❌ Order \`${id}\` rejected by admin.`,
    embeds: [
      {
        title: `Order ${id} — Rejected`,
        description: `Produk: **${order.product}**\nHarga: **${order.price}**\nNama: **${order.buyerName}**\nWA: **${order.buyerPhone}**`,
        color: 15158332,
        timestamp: new Date().toISOString()
      }
    ]
  };

  if (DISCORD_WEBHOOK) {
    await axios.post(DISCORD_WEBHOOK, msg).catch(err => console.error('Discord notify error:', err?.message));
  }

  res.send(`<h2>Order ${id} rejected</h2><p>User will be notified on website (if open).</p>`);
});

// Basic health
app.get('/ping', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});