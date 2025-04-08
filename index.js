const express = require('express');
const cors = require('cors');
// const redemptionsRouter = require('./redemptions'); // Descomente quando for usar

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Rota raiz
app.get('/', (req, res) => {
  res.send('✅ BIGFOOT API está online!');
});

// ✅ Dados mockados
let newsData = [
  {
    id: "1",
    date: "2025-02-12",
    title: "BIGFOOT participa do campeonato Forja do Ornn",
    author: "por apu apustaja",
    details: "BIGFOOT se prepara para o maior evento do ano, buscando alavancar sua participação no campeonato."
  },
  {
    id: "2",
    date: "2025-02-13",
    title: "BIGFOOT e seu primeiro app",
    author: "por apu apustaja",
    details: "O time BIGFOOT apresenta seu primeiro aplicativo, uma ferramenta para conectar fãs e jogadores."
  },
  {
    id: "3",
    date: "2025-02-14",
    title: "BIGFOOT busca novos patrocinadores",
    author: "por apu apustaja",
    details: "A organização BIGFOOT está em busca de novos parceiros e patrocinadores para expandir sua presença."
  }
];

let upcomingGames = [
  {
    id: "1",
    teams: "BIGFOOT Esports x ALPHA Esports",
    date: "2025-02-20",
    time: "18:00",
    championship: "Liga Nacional",
    twitchLink: "https://www.twitch.tv/bigfootesports"
  },
  {
    id: "2",
    teams: "BIGFOOT Esports x BETA Esports",
    date: "2025-02-25",
    time: "20:00",
    championship: "Liga Internacional",
    twitchLink: "https://www.twitch.tv/bigfootesports"
  },
  {
    id: "3",
    teams: "BIGFOOT Esports x GAMMA Esports",
    date: "2025-02-28",
    time: "21:00",
    championship: "Copa do Mundo de Esports",
    twitchLink: "https://www.twitch.tv/bigfootesports"
  }
];

// ✅ Rotas de notícias
app.get('/news', (req, res) => {
  res.json(newsData);
});

app.post('/news', (req, res) => {
  const { id, date, title, author, details } = req.body;
  if (!id || !date || !title || !author || !details) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  const newNews = { id, date, title, author, details };
  newsData.push(newNews);
  res.status(201).json(newNews);
});

// ✅ Rotas de jogos
app.get('/upcoming-games', (req, res) => {
  res.json(upcomingGames);
});

app.post('/upcoming-games', (req, res) => {
  const { id, teams, date, time, championship, twitchLink } = req.body;
  if (!id || !teams || !date || !time || !championship || !twitchLink) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  const newGame = { id, teams, date, time, championship, twitchLink };
  upcomingGames.push(newGame);
  res.status(201).json(newGame);
});

// 🔒 (Descomentável) Controle de resgates com Vercel KV
// app.use('/redemptions', redemptionsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando na porta ${PORT}`);
});

module.exports = app;
