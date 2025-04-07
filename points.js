let userPoints = {}; // Em produção, isso viria de um banco de dados

export default function handler(req, res) {
  const { method } = req;
  const userId = req.query.userId || 'default_user'; // você pode passar o userId via query

  switch (method) {
    case 'GET':
      // Retorna os pontos do usuário
      res.status(200).json({ points: userPoints[userId] || 0 });
      break;

    case 'POST':
      // Adiciona pontos diários
      userPoints[userId] = (userPoints[userId] || 0) + 10;
      res.status(200).json({ message: '10 pontos adicionados!', points: userPoints[userId] });
      break;

    case 'DELETE':
      // Reseta ou remove pontos (ex: após resgate)
      userPoints[userId] = 0;
      res.status(200).json({ message: 'Pontos resetados.', points: 0 });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
