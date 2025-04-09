const express = require('express');
const router = express.Router();

const REDEMPTIONS_KEY = 'redemptions';

// Função para importar dinamicamente o Vercel KV (modo compatível com CommonJS)
async function getKV() {
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch (err) {
    console.error('❌ Falha ao importar @vercel/kv:', err);
    throw new Error('Módulo @vercel/kv não disponível.');
  }
}

// GET /redemptions - Lista todos os resgates
router.get('/', async (req, res) => {
  try {
    const kv = await getKV();
    const data = await kv.get(REDEMPTIONS_KEY) || [];
    res.json(data);
  } catch (error) {
    console.error('❌ Erro ao obter resgates:', error.message);
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
      return res.status(409).json({ message: 'Produto já resgatado por este usuário nesta data.' });
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
