const express = require('express');
const { kv } = require('@vercel/kv');
const router = express.Router();

// GET: Retorna todos os resgates
router.get('/', async (req, res) => {
  try {
    const keys = await kv.keys('redemption:*');
    const redemptions = await Promise.all(keys.map(async (key) => {
      const value = await kv.get(key);
      return value;
    }));

    res.json(redemptions);
  } catch (error) {
    console.error('Erro ao buscar resgates:', error);
    res.status(500).json({ message: 'Erro ao buscar resgates' });
  }
});

// POST: Cadastra um novo resgate
router.post('/', async (req, res) => {
  const { userId, product, date } = req.body;

  if (!userId || !product || !date) {
    return res.status(400).json({ message: 'Campos obrigatórios: userId, product, date' });
  }

  const key = `redemption:${userId}:${product}:${date}`;

  try {
    const existing = await kv.get(key);

    if (existing) {
      return res.status(409).json({ message: 'Produto já resgatado por este usuário na mesma data.' });
    }

    const newRedemption = { userId, product, date };
    await kv.set(key, newRedemption);

    res.status(201).json(newRedemption);
  } catch (error) {
    console.error('Erro ao salvar resgate:', error);
    res.status(500).json({ message: 'Erro ao salvar resgate' });
  }
});

module.exports = router;
