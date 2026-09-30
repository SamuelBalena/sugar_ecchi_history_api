import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase } from '../src/store.js';

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await connectDatabase();
  
  // Get admin token
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ password: process.env.ADMIN_PASSWORD });
  token = res.body.token;
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('CRUD de Pacotes (Packs)', () => {
  let packId: string;
  
  it('1. Create (Cadastrar pacote)', async () => {
    const newPack = {
      slug: "novo-pacote-teste",
      title: { en: "Test Pack", ja: "テストパック" },
      description: { en: "Test description", ja: "テストの説明" },
      contents: { en: "Test contents", ja: "テストの内容" },
      price: 15,
      fileCount: 10,
      format: "PNG",
      patreonUrl: "https://patreon.com/test",
      createdAt: "2026-09-30",
      isPublished: true
    };

    const res = await request(app)
      .post('/api/v1/admin/packs')
      .set('Authorization', `Bearer ${token}`)
      .send(newPack);
      
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe("novo-pacote-teste");
    expect(res.body.id).toBeDefined();
    packId = res.body.id;
  });

  it('2. Read (Pesquisar pacote criado)', async () => {
    // Verifica se ele aparece na listagem do admin
    const listRes = await request(app)
      .get('/api/v1/admin/packs')
      .set('Authorization', `Bearer ${token}`);
      
    expect(listRes.status).toBe(200);
    const foundPack = listRes.body.find((p: any) => p.id === packId);
    expect(foundPack).toBeDefined();
    expect(foundPack.price).toBe(15);

    // Verifica a busca pela rota pública (getPack)
    const publicRes = await request(app).get('/api/v1/packs/novo-pacote-teste');
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.id).toBe(packId);
  });

  it('3. Update (Atualizar pacote)', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/packs/${packId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 25, isPublished: true });
      
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(25);
    expect(res.body.isPublished).toBe(true);
  });

  it('4. Delete (Deletar pacote do banco)', async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/packs/${packId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(204);
  });

  it('5. Verify Deletion (Garantir que não existe mais)', async () => {
    const publicRes = await request(app).get('/api/v1/packs/novo-pacote-teste');
    expect(publicRes.status).toBe(404);
  });
});
