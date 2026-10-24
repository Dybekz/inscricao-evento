import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('comportamento geral da API', () => {
  it('REQ-BE-18: retorna 400 em JSON quando o corpo não é um JSON válido', async () => {
    const res = await request(app)
      .post('/inscricoes')
      .set('Content-Type', 'application/json')
      .send('{ "nome": "Maria", ');

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ erro: 'O corpo da requisição não é um JSON válido' });
  });

  it('REQ-BE-19: libera CORS para o frontend em http://localhost:5173', async () => {
    const res = await request(app)
      .get('/inscricoes')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('REQ-BE-19: responde ao preflight com os métodos GET, POST e DELETE', async () => {
    const res = await request(app)
      .options('/inscricoes/1')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'DELETE');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-methods']).toBe('GET,POST,DELETE');
  });

  it('REQ-BE-22: retorna 404 em JSON, em português, para rota inexistente', async () => {
    const res = await request(app).get('/rota-que-nao-existe');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ erro: 'Rota não encontrada' });
  });
});
