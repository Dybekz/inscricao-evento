import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { listarInscricoes, criarInscricao, removerInscricao } from '../src/api/inscricoes.js';
import { ErroDaApi, ErroDeConexao, MENSAGEM_SEM_CONEXAO } from '../src/api/erros.js';

const inscricao = { id: 1, nome: 'Maria Silva', email: 'maria@email.com', telefone: '', tipoIngresso: 'estudante' };

function respostaJson(status, corpo) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Executa a chamada e devolve o erro lançado, para conferir os detalhes dele
async function erroDe(chamada) {
  try {
    await chamada();
  } catch (erro) {
    return erro;
  }
  throw new Error('a chamada deveria ter lançado um erro');
}

describe('camada de acesso à API', () => {
  let fetchSimulado;

  beforeEach(() => {
    fetchSimulado = vi.fn();
    vi.stubGlobal('fetch', fetchSimulado);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('REQ-FE-29: sem VITE_API_URL, as chamadas vão para http://localhost:3001', async () => {
    fetchSimulado.mockResolvedValue(respostaJson(200, []));

    await listarInscricoes();

    expect(fetchSimulado.mock.calls[0][0]).toBe('http://localhost:3001/inscricoes');
  });

  it('REQ-FE-20: listarInscricoes faz GET /inscricoes e devolve o array recebido', async () => {
    fetchSimulado.mockResolvedValue(respostaJson(200, [inscricao]));

    const lista = await listarInscricoes();

    const [url, opcoes] = fetchSimulado.mock.calls[0];
    expect(url).toBe('http://localhost:3001/inscricoes');
    expect(opcoes?.method ?? 'GET').toBe('GET');
    expect(lista).toEqual([inscricao]);
  });

  it('REQ-FE-14: criarInscricao envia POST /inscricoes em JSON com os 4 campos e devolve a inscrição criada', async () => {
    fetchSimulado.mockResolvedValue(respostaJson(201, inscricao));

    const criada = await criarInscricao({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '',
      tipoIngresso: 'estudante',
      extra: 'não deve ir',
    });

    const [url, opcoes] = fetchSimulado.mock.calls[0];
    expect(url).toBe('http://localhost:3001/inscricoes');
    expect(opcoes.method).toBe('POST');
    expect(opcoes.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(opcoes.body)).toEqual({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '',
      tipoIngresso: 'estudante',
    });
    expect(criada).toEqual(inscricao);
  });

  it('REQ-FE-26: removerInscricao faz DELETE /inscricoes/:id', async () => {
    fetchSimulado.mockResolvedValue(new Response(null, { status: 204 }));

    await removerInscricao(7);

    const [url, opcoes] = fetchSimulado.mock.calls[0];
    expect(url).toBe('http://localhost:3001/inscricoes/7');
    expect(opcoes.method).toBe('DELETE');
  });

  it('REQ-FE-27: status de erro vira ErroDaApi com status, mensagem e campos', async () => {
    fetchSimulado.mockResolvedValueOnce(respostaJson(404, { erro: 'Inscrição não encontrada' }));
    const naoEncontrada = await erroDe(() => removerInscricao(99));

    expect(naoEncontrada).toBeInstanceOf(ErroDaApi);
    expect(naoEncontrada.status).toBe(404);
    expect(naoEncontrada.message).toBe('Inscrição não encontrada');
    expect(naoEncontrada.campos).toBeUndefined();

    const campos = { nome: 'O nome é obrigatório' };
    fetchSimulado.mockResolvedValueOnce(respostaJson(400, { erro: 'Dados inválidos', campos }));
    const invalida = await erroDe(() => criarInscricao({ nome: '', email: 'a@a.com', telefone: '', tipoIngresso: 'estudante' }));

    expect(invalida).toBeInstanceOf(ErroDaApi);
    expect(invalida.status).toBe(400);
    expect(invalida.message).toBe('Dados inválidos');
    expect(invalida.campos).toEqual(campos);
  });

  it('REQ-FE-27: status de erro com corpo que não é JSON vira "Erro inesperado do servidor"', async () => {
    fetchSimulado.mockResolvedValue(new Response('<h1>Erro</h1>', { status: 500 }));

    const erro = await erroDe(() => listarInscricoes());

    expect(erro).toBeInstanceOf(ErroDaApi);
    expect(erro.status).toBe(500);
    expect(erro.message).toBe('Erro inesperado do servidor');
  });

  it('REQ-FE-19: falha de conexão vira ErroDeConexao com a mensagem de servidor fora do ar', async () => {
    fetchSimulado.mockRejectedValue(new TypeError('Failed to fetch'));

    for (const chamada of [
      () => listarInscricoes(),
      () => criarInscricao({ nome: 'Maria', email: 'a@a.com', telefone: '', tipoIngresso: 'estudante' }),
      () => removerInscricao(1),
    ]) {
      const erro = await erroDe(chamada);

      expect(erro).toBeInstanceOf(ErroDeConexao);
      expect(erro.message).toBe(MENSAGEM_SEM_CONEXAO);
    }
  });
});
