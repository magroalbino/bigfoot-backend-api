const express = require('express');
const router = express.Router();

const REDEMPTIONS_KEY = 'redemptions';
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function getKV() {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error('Variáveis de ambiente KV_REST_API_URL ou KV_REST_API_TOKEN não estão definidas.');
  }

  return {
    async get(key) {
      const res = await fetch(`${KV_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
      });
      if (!res.ok) throw new Error(`Erro ao acessar KV: ${await res.text()}`);
      return await res.json();
    },
    async set(key, value) {
      const res = await fetch(`${KV_URL}/set/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });
      if (!res.ok) throw new Error(`Erro ao salvar no KV: ${await res.text()}`);
      return await res.json();
    },
  };
}

// GET /redemptions
router.get('/', async (req, res) => {
  try {
    const kv = await getKV();
    const data = await kv.get(REDEMPTIONS_KEY);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Erro ao obter resgates:', error.message);
    res.status(500).json({ message: 'Erro ao obter resgates.' });
  }
});

// POST /redemptions
router.post('/', async (req, res) => {
  const { userId, product, date } = req.body;
  if (!userId || !product || !date) {
    return res.status(400).json({ message: 'Campos obrigatórios: userId, product, date' });
  }

  try {
    const kv = await getKV();
    const redemptions = await kv.get(REDEMPTIONS_KEY) || [];

    const alreadyRedeemed = redemptions.find(
      (r) => r.userId === userId && r.product === product && r.date === date
    );

    if (alreadyRedeemed) {
      return res.status(409).json({ message: 'Produto já foi resgatado por este usuário nesta data.' });
    }

    const newRedemption = { userId, product, date };
    redemptions.push(newRedemption);

    await kv.set(REDEMPTIONS_KEY, redemptions);
    res.status(201).json(newRedemption);
  } catch (error) {
    console.error('❌ Erro ao criar resgate:', error.message);
    res.status(500).json({ message: 'Erro ao criar resgate.' });
  }
});

module.exports = router;
