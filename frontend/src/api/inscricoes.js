import { ErroDaApi, ErroDeConexao } from './erros.js';

const URL_DA_API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MENSAGEM_ERRO_INESPERADO = 'Erro inesperado do servidor';

// Lê o corpo de erro da API ({ erro, campos }); se não for o JSON esperado, usa uma mensagem genérica
async function erroDaResposta(resposta) {
  try {
    const corpo = await resposta.json();
    if (typeof corpo?.erro === 'string') {
      return new ErroDaApi(resposta.status, corpo.erro, corpo.campos);
    }
  } catch {
    // corpo vazio ou que não é JSON: cai na mensagem genérica
  }
  return new ErroDaApi(resposta.status, MENSAGEM_ERRO_INESPERADO);
}

async function requisitar(caminho, opcoes) {
  let resposta;
  try {
    resposta = await fetch(`${URL_DA_API}${caminho}`, opcoes);
  } catch {
    throw new ErroDeConexao();
  }

  if (!resposta.ok) {
    throw await erroDaResposta(resposta);
  }
  return resposta;
}

export async function listarInscricoes() {
  const resposta = await requisitar('/inscricoes');
  return resposta.json();
}

// Os valores vão como foram digitados: a API remove espaços e formata o telefone
export async function criarInscricao({ nome, email, telefone, tipoIngresso }) {
  const resposta = await requisitar('/inscricoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, telefone, tipoIngresso }),
  });
  return resposta.json();
}

export async function removerInscricao(id) {
  await requisitar(`/inscricoes/${id}`, { method: 'DELETE' });
}
