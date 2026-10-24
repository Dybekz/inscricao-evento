import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { criar, resetar } from '../src/repositorio/inscricoes.js';

function criarInscricao(email) {
  return criar({ nome: 'Maria Silva', email, telefone: '', tipoIngresso: 'estudante' });
}

describe('DELETE /inscricoes/:id', () => {
  beforeEach(() => {
    resetar();
  });

  it('REQ-BE-15: remove a inscrição existente, retorna 204 sem corpo e ela some do GET', async () => {
    criarInscricao('a@email.com');
    criarInscricao('b@email.com');

    const res = await request(app).delete('/inscricoes/1');

    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    const lista = await request(app).get('/inscricoes');
    expect(lista.body.map((inscricao) => inscricao.id)).toEqual([2]);
  });

  it('REQ-BE-16: retorna 404 em JSON para id inteiro que não existe', async () => {
    criarInscricao('a@email.com');

    const res = await request(app).delete('/inscricoes/99');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: 'Inscrição não encontrada' });

    const lista = await request(app).get('/inscricoes');
    expect(lista.body).toHaveLength(1);
  });

  it('REQ-BE-17: retorna 400 em JSON para id que não é inteiro positivo', async () => {
    criarInscricao('a@email.com');

    for (const id of ['abc', '1.5', '-1', '0']) {
      const res = await request(app).delete(`/inscricoes/${id}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ erro: 'O id deve ser um número inteiro positivo' });
    }

    const lista = await request(app).get('/inscricoes');
    expect(lista.body).toHaveLength(1);
  });

  it('REQ-BE-04: não reaproveita o id depois de uma exclusão', async () => {
    await request(app)
      .post('/inscricoes')
      .send({ nome: 'Maria Silva', email: 'a@email.com', tipoIngresso: 'estudante' });
    await request(app).delete('/inscricoes/1');

    const res = await request(app)
      .post('/inscricoes')
      .send({ nome: 'João Souza', email: 'b@email.com', tipoIngresso: 'profissional' });

    expect(res.body.id).toBe(2);
  });
});
