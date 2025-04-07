const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, 'redemptions.json');

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function readRedemptions() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function writeRedemptions(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const redemptions = readRedemptions();
  res.json(redemptions);
});

router.post('/', (req, res) => {
  const { userId, product, date } = req.body;

  if (!userId || !product || !date) {
    return res.status(400).json({ message: 'Campos obrigatórios: userId, product, date' });
  }

  const redemptions = readRedemptions();

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
