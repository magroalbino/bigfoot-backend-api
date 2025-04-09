const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Rota raiz
app.get('/', (req, res) => {
  res.send('✅ BIGFOOT API está online!');
});

// ✅ Dados mockados para notícias
const newsData = [
  {
    id: '1',
    date: '12-02-2025',
    title: 'BIGFOOT participa do campeonato Forja do Ornn',
    author: 'apu apustaja',
    details: 'BIGFOOT se prepara para o maior evento do ano, buscando alavancar sua participação no campeonato.',
  },
  {
    id: '2',
    date: '13-02-2025',
    title: 'BIGFOOT e seu primeiro app',
    author: 'apu apustaja',
    details: 'O time BIGFOOT apresenta seu primeiro aplicativo, uma ferramenta para conectar fãs e jogadores.',
  },
  {
    id: '3',
    date: '14-02-2025',
    title: 'BIGFOOT busca novos patrocinadores',
    author: 'apu apustaja',
    details: 'A organização BIGFOOT está em busca de novos parceiros e patrocinadores para expandir sua presença.',
  }
];

// ✅ Dados mockados para próximos jogos
const upcomingGames = [
  {
    id: '1',
    teams: 'BIGFOOT Esports x ALPHA Esports',
    date: '20-02-2025',
    time: '18:00',
    championship: 'Liga Nacional',
    twitchLink: 'https://www.twitch.tv/bigfootesports',
  },
  {
    id: '2',
    teams: 'BIGFOOT Esports x BETA Esports',
    date: '25-02-2025',
    time: '20:00',
    championship: 'Liga Internacional',
    twitchLink: 'https://www.twitch.tv/bigfootesports',
  },
  {
    id: '3',
    teams: 'BIGFOOT Esports x GAMMA Esports',
    date: '28-02-2025',
    time: '21:00',
    championship: 'Copa do Mundo de Esports',
    twitchLink: 'https://www.twitch.tv/bigfootesports',
  }
];

// ✅ Rotas para notícias
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

// ✅ Rotas para próximos jogos
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

// ✅ Rota de controle de resgates (condicional ao Vercel KV)
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  try {
    const redemptionsRouter = require('./redemptions');
    app.use('/redemptions', redemptionsRouter);
    console.log('✅ Rota /redemptions carregada com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao carregar redemptions:', err.message);
  }
} else {
  console.warn('⚠️ Variáveis KV_REST_API_URL e/ou KV_REST_API_TOKEN não configuradas. Rota /redemptions não ativada.');
}

// ✅ Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});

module.exports = app;
