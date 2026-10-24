import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetar } from '../src/repositorio/inscricoes.js';

describe('comportamento geral da API', () => {
  beforeEach(() => {
    resetar();
  });

  it('REQ-BE-18: retorna 400 em JSON quando o corpo não é um JSON válido e não cria a inscrição', async () => {
    const res = await request(app)
      .post('/inscricoes')
      .set('Content-Type', 'application/json')
      .send('{ "nome": "Maria", ');

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ erro: 'O corpo da requisição não é um JSON válido' });

    const lista = await request(app).get('/inscricoes');
    expect(lista.body).toEqual([]);
  });

  it('REQ-BE-13: corpo JSON que não é objeto cai na validação dos campos', async () => {
    for (const corpo of ['[1,2]', '"abc"', '123', 'null']) {
      const res = await request(app)
        .post('/inscricoes')
        .set('Content-Type', 'application/json')
        .send(corpo);

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Dados inválidos');
      expect(Object.keys(res.body.campos)).toEqual(['nome', 'email', 'tipoIngresso']);
    }

    const lista = await request(app).get('/inscricoes');
    expect(lista.body).toEqual([]);
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

  it('REQ-BE-22: erros dos endpoints vêm em JSON, com a mensagem em português', async () => {
    const inscricao = { nome: 'Maria Silva', email: 'maria@email.com', tipoIngresso: 'estudante' };
    await request(app).post('/inscricoes').send(inscricao);

    const erros = [
      { requisicao: request(app).post('/inscricoes').send({}), status: 400, erro: 'Dados inválidos' },
      { requisicao: request(app).post('/inscricoes').send(inscricao), status: 400, erro: 'E-mail já cadastrado' },
      { requisicao: request(app).delete('/inscricoes/abc'), status: 400, erro: 'O id deve ser um número inteiro positivo' },
      { requisicao: request(app).delete('/inscricoes/99'), status: 404, erro: 'Inscrição não encontrada' },
    ];

    for (const { requisicao, status, erro } of erros) {
      const res = await requisicao;

      expect(res.status).toBe(status);
      expect(res.headers['content-type']).toMatch(/application\/json/);
      expect(res.body.erro).toBe(erro);
    }
  });
});
