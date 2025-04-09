const express = require('express');
const cors = require('cors');
const { createClient } = require('@vercel/kv');
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Configuração do Vercel KV
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

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

// ✅ Rotas para comentários de notícias com Vercel KV
app.get('/news/:newsId/comments', async (req, res) => {
  const { newsId } = req.params;
  const newsExists = newsData.some(news => news.id === newsId);
  if (!newsExists) {
    return res.status(404).json({ error: 'Notícia não encontrada' });
  }

  try {
    // Recupera todos os comentários da chave `comments:${newsId}`
    const comments = await kv.lrange(`comments:${newsId}`, 0, -1);
    // Desserializa os comentários de strings JSON para objetos
    const parsedComments = comments.map(comment => JSON.parse(comment));
    res.json(parsedComments);
  } catch (error) {
    console.error('Erro ao recuperar comentários:', error);
    res.status(500).json({ error: 'Erro interno ao carregar comentários' });
  }
});

app.post('/news/:newsId/comments', async (req, res) => {
  const { newsId } = req.params;
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).json({ error: 'Texto e autor são obrigatórios' });
  }

  const newsExists = newsData.some(news => news.id === newsId);
  if (!newsExists) {
    return res.status(404).json({ error: 'Notícia não encontrada' });
  }

  try {
    // Gera um ID único para o comentário (usando contador global no KV)
    const commentCount = await kv.incr('comment:counter');
    const newComment = {
      id: String(commentCount),
      text,
      author,
      newsId,
      createdAt: new Date().toISOString(),
    };

    // Adiciona o comentário à lista no Vercel KV como string JSON
    await kv.lpush(`comments:${newsId}`, JSON.stringify(newComment));
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Erro ao salvar comentário:', error);
    res.status(500).json({ error: 'Erro interno ao salvar comentário' });
  }
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
