// redemptions.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, 'redemptions.json');

// Garante que o arquivo de dados exista
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Função para ler os dados
function readRedemptions() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Função para salvar os dados
function writeRedemptions(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/redemptions - lista todas as trocas
router.get('/', (req, res) => {
  const redemptions = readRedemptions();
  res.json(redemptions);
});

// POST /api/redemptions - registra uma nova troca
router.post('/', (req, res) => {
  const { userId, product, date } = req.body;

  if (!userId || !product || !date) {
    return res.status(400).json({ message: 'Campos obrigatórios: userId, product, date' });
  }

  const redemptions = readRedemptions();

  // Verifica se já foi feita uma troca do mesmo produto no mesmo dia por este usuário
  const alreadyRedeemed = redemptions.find(
    (r) => r.userId === userId && r.product === product && r.date === date
  );

  if (alreadyRedeemed) {
    return res.status(409).json({ message: 'Produto já resgatado por este usuário na mesma data.' });
  }

  const newRedemption = { userId, product, date };
  redemptions.push(newRedemption);
  writeRedemptions(redemptions);

  res.status(201).json(newRedemption);
});

module.exports = router;
