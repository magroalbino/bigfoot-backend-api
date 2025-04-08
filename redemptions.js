const express = require('express');
const { kv } = require('@vercel/kv');

const router = express.Router();

const REDEMPTIONS_KEY = 'redemptions';

// GET /redemptions - lista todos os resgates
router.get('/', async (req, res) => {
  try {
    const redemptions = await kv.get(REDEMPTIONS_KEY) || [];
    res.json(redemptions);
  } catch (error) {
    console.error('Erro ao obter resgates:', error);
    res.status(500).json({ message: 'Erro ao obter resgates.' });
  }
});

// POST /redemptions - cria um novo resgate
router.post('/', async (req, res) => {
  const { userId, product, date } = req.body;

  if (!userId || !product || !date) {
    return res.status(400).json({ message: 'Campos obrigatórios: userId, product, date' });
  }

  try {
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
    console.error('Erro ao criar resgate:', error);
    res.status(500).json({ message: 'Erro ao criar resgate.' });
  }
});

module.exports = router;
