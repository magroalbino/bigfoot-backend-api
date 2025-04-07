# BIGFOOT Backend API

# 📌 Sobre

O BIGFOOT Backend API é a API responsável por fornecer dados e serviços para o aplicativo BIGFOOT LoL App. Ele gerencia informações sobre notícias, lineup, próximos jogos e contribuições, permitindo a integração entre o aplicativo e o servidor.

# 🚀 Tecnologias Utilizadas

Node.js com Express.js (Backend rápido e escalável)

MongoDB (Banco de dados NoSQL para armazenamento de dados)

JWT (JSON Web Token) para autenticação

CORS para permitir requisições entre domínios

Dotenv para gerenciamento de variáveis de ambiente

# 🔧 Instalação e Configuração

1️⃣ Clonar o repositório

git clone https://github.com/seu-usuario/bigfoot-backend-api.git
cd bigfoot-backend-api

2️⃣ Instalar as dependências

npm install

3️⃣ Criar um arquivo .env com as seguintes variáveis:

PORT=3000
MONGO_URI=mongodb://localhost:27017/bigfoot
JWT_SECRET=sua_chave_secreta

4️⃣ Rodar o servidor

npm start

O backend estará disponível em: http://localhost:3000

# 📡 Rotas da API

✅ Notícias

GET /news → Retorna todas as notícias

POST /news → Adiciona uma nova notícia (Requer autenticação)

✅ Lineup

GET /lineup → Retorna a escalação da equipe

✅ Próximos Jogos

GET /matches → Lista os próximos jogos da equipe

✅ Contribuições

POST /donate → Registra uma doação

# 🔒 Autenticação

Para realizar requisições protegidas, utilize JWT no header:

{
  "Authorization": "Bearer SEU_TOKEN"
}

# 📜 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para contribuir!

Desenvolvido com ❤️ pela equipe BIGFOOT Esports!
