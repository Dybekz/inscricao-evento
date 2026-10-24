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

// Envia o corpo e confere que a API recusou com a mensagem esperada no campo e não criou nada
async function esperarErroNoCampo(corpo, campo, mensagem) {
  const res = await request(app).post('/inscricoes').send(corpo);

  expect(res.status).toBe(400);
  expect(res.body.erro).toBe('Dados inválidos');
  expect(res.body.campos[campo]).toBe(mensagem);

  const lista = await request(app).get('/inscricoes');
  expect(lista.body).toEqual([]);
}

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

  it('REQ-BE-07: retorna 400 com campos.nome para nome ausente, vazio, só espaços ou não-texto', async () => {
    const { nome, ...semNome } = inscricaoValida;

    for (const corpo of [semNome, { ...semNome, nome: '' }, { ...semNome, nome: '   ' }, { ...semNome, nome: 123 }]) {
      await esperarErroNoCampo(corpo, 'nome', 'O nome é obrigatório');
    }
  });

  it('REQ-BE-08: retorna 400 com campos.email para e-mail ausente, vazio ou não-texto', async () => {
    const { email, ...semEmail } = inscricaoValida;

    for (const corpo of [semEmail, { ...semEmail, email: '' }, { ...semEmail, email: '  ' }, { ...semEmail, email: 42 }]) {
      await esperarErroNoCampo(corpo, 'email', 'O e-mail é obrigatório');
    }
  });

  it('REQ-BE-09: retorna 400 com campos.email para e-mail fora do formato texto@texto.texto', async () => {
    for (const email of ['maria', 'maria@', 'maria@email', '@email.com', 'maria silva@email.com', 'maria@@email.com']) {
      await esperarErroNoCampo({ ...inscricaoValida, email }, 'email', 'Informe um e-mail válido');
    }
  });

  it('REQ-BE-10: retorna 400 com campos.tipoIngresso para ausente, valor fora da lista ou com maiúsculas', async () => {
    const { tipoIngresso, ...semTipo } = inscricaoValida;
    const mensagem = 'O tipo de ingresso deve ser "estudante" ou "profissional"';

    for (const corpo of [semTipo, { ...semTipo, tipoIngresso: 'vip' }, { ...semTipo, tipoIngresso: 'Estudante' }, { ...semTipo, tipoIngresso: '' }]) {
      await esperarErroNoCampo(corpo, 'tipoIngresso', mensagem);
    }
  });

  it('REQ-BE-13: informa todos os campos inválidos na mesma resposta e não cria a inscrição', async () => {
    const res = await request(app).post('/inscricoes').send({ email: 'invalido', tipoIngresso: 'vip' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      erro: 'Dados inválidos',
      campos: {
        nome: 'O nome é obrigatório',
        email: 'Informe um e-mail válido',
        tipoIngresso: 'O tipo de ingresso deve ser "estudante" ou "profissional"',
      },
    });

    const lista = await request(app).get('/inscricoes');
    expect(lista.body).toEqual([]);
  });

  it('REQ-BE-13: corpo vazio retorna os três campos obrigatórios', async () => {
    const res = await request(app).post('/inscricoes');

    expect(res.status).toBe(400);
    expect(Object.keys(res.body.campos)).toEqual(['nome', 'email', 'tipoIngresso']);
  });
});
