import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { criar, resetar } from '../src/repositorio/inscricoes.js';

describe('GET /inscricoes', () => {
  beforeEach(() => {
    resetar();
  });

  it('REQ-BE-01: lista todas as inscrições em ordem de criação, com status 200', async () => {
    criar({ nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999', tipoIngresso: 'estudante' });
    criar({ nome: 'João Souza', email: 'joao@email.com', telefone: '', tipoIngresso: 'profissional' });

    const res = await request(app).get('/inscricoes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999', tipoIngresso: 'estudante' },
      { id: 2, nome: 'João Souza', email: 'joao@email.com', telefone: '', tipoIngresso: 'profissional' },
    ]);
  });

  it('REQ-BE-02: retorna 200 e um array vazio quando não há inscrições', async () => {
    const res = await request(app).get('/inscricoes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
