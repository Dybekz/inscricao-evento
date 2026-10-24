import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { resetar } from '../src/repositorio/inscricoes.js';

const inscricaoValida = {
  nome: 'Maria Silva',
  email: 'maria@email.com',
  telefone: '(11) 99999-9999',
  tipoIngresso: 'estudante',
};

describe('POST /inscricoes', () => {
  beforeEach(() => {
    resetar();
  });

  it('REQ-BE-03: cria inscrição válida e retorna 201 com exatamente os campos do modelo', async () => {
    const res = await request(app).post('/inscricoes').send(inscricaoValida);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...inscricaoValida });

    const lista = await request(app).get('/inscricoes');
    expect(lista.body).toEqual([{ id: 1, ...inscricaoValida }]);
  });

  it('REQ-BE-04: gera ids inteiros crescentes', async () => {
    const ids = [];
    for (const email of ['a@email.com', 'b@email.com', 'c@email.com']) {
      const res = await request(app).post('/inscricoes').send({ ...inscricaoValida, email });
      ids.push(res.body.id);
    }

    expect(ids).toEqual([1, 2, 3]);
  });

  it('REQ-BE-05: remove espaços das pontas de nome, e-mail e telefone e guarda o e-mail em minúsculas', async () => {
    const res = await request(app).post('/inscricoes').send({
      nome: '  Maria Silva ',
      email: '  Maria@Email.COM ',
      telefone: ' (11) 99999-9999  ',
      tipoIngresso: 'estudante',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...inscricaoValida });
  });

  it('REQ-BE-11: aceita telefone ausente, null ou só com espaços e guarda ""', async () => {
    const semTelefone = { nome: 'Maria Silva', email: 'a@email.com', tipoIngresso: 'estudante' };
    const casos = [
      semTelefone,
      { ...semTelefone, email: 'b@email.com', telefone: null },
      { ...semTelefone, email: 'c@email.com', telefone: '   ' },
    ];

    for (const corpo of casos) {
      const res = await request(app).post('/inscricoes').send(corpo);

      expect(res.status).toBe(201);
      expect(res.body.telefone).toBe('');
    }
  });

  it('REQ-BE-14: ignora campos extras enviados no corpo', async () => {
    const res = await request(app)
      .post('/inscricoes')
      .send({ ...inscricaoValida, id: 99, admin: true });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...inscricaoValida });
  });
});
