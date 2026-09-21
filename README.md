# Sugar Ecchi History API

API REST para o catálogo do front-end SugarEcchi. Ela mantém o catálogo, a área administrativa e favoritos por visitante no MongoDB.

## Iniciar

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

O MongoDB precisa estar disponível antes de iniciar a API. Com Docker, execute `docker compose up -d mongodb`; sem Docker, instale/inicie o MongoDB localmente ou substitua `MONGODB_URI` no `.env` por uma URI do MongoDB Atlas.

A API estará em `http://localhost:3000`. A documentação interativa dos contratos está em `GET /api/v1` e o health check em `GET /health`.

Após iniciar a API, a documentação Swagger está disponível em `http://localhost:3000/api-docs`. O contrato OpenAPI em JSON pode ser consumido em `http://localhost:3000/api-docs.json`.

Configure `MONGODB_URI` para seu MongoDB (local ou Atlas) e `FRONTEND_ORIGIN` com a URL do site. Antes de publicar, defina um `JWT_SECRET` longo e altere as credenciais de administração. Na primeira inicialização, o catálogo de exemplo é inserido automaticamente.

## Rotas principais

- `POST /api/v1/auth/login` (corpo: `{ "password": "..." }`; `email` é opcional)
- `GET /api/v1/catalog` e `GET /api/v1/packs`
- `GET /api/v1/animes|characters|collections|tags/:slug`
- `GET/POST /api/v1/wishlist` (envie `X-Visitor-Id`)
- CRUD administrativo em `/api/v1/admin/packs`, `/admin/characters` e `/admin/tags` com `Authorization: Bearer <token>`.

Os dados são persistidos no MongoDB. O projeto usa Mongoose, pois Sequelize é um ORM exclusivo para bancos relacionais e não suporta MongoDB.

## Arquitetura

O código segue MVC: `routes/` declara os endpoints, `controllers/` processa as requisições, `models/` concentra o acesso aos dados, e `middlewares/` trata autenticação e erros. `app.ts` configura o Express e `server.ts` inicializa a conexão MongoDB e o servidor.

## Testes

```bash
npm test
```

Os testes de integração usam Jest e Supertest e cobrem health check, especificação OpenAPI, login JWT e proteção de rotas administrativas. Eles não dependem de uma instância MongoDB.
