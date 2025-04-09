const express = require('express');
const router = express.Router();
const REDEMPTIONS_KEY = 'redemptions';

// Função segura para importar o Vercel KV dinamicamente
async function getKV() {
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    return require('@vercel/kv');
  } catch (err) {
    console.error('❌ Falha ao carregar @vercel/kv:', err);
    throw new Error('KV não está disponível.');
  }
}

// GET /redemptions - Lista todos os resgates
router.get('/', async (req, res) => {
  try {
    const kv = await getKV();
    const data = await kv.get(REDEMPTIONS_KEY) || [];
    res.json(data);
  } catch (error) {
    console.error('❌ Erro ao obter resgates:', error);
    res.status(500).json({ message: 'Erro ao obter resgates.' });
  }
});

// POST /redemptions - Cria um novo resgate
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
    console.error('❌ Erro ao criar resgate:', error);
    res.status(500).json({ message: 'Erro ao criar resgate.' });
  }
});

module.exports = router;
