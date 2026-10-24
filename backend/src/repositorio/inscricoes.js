// Persistência em memória: os dados somem quando o servidor reinicia (DT-01)
let inscricoes = [];
let proximoId = 1;

export function listar() {
  return [...inscricoes];
}

export function criar(dados) {
  const inscricao = { id: proximoId++, ...dados };
  inscricoes.push(inscricao);
  return inscricao;
}

export function buscarPorEmail(email) {
  return inscricoes.find((inscricao) => inscricao.email === email);
}

export function remover(id) {
  const indice = inscricoes.findIndex((inscricao) => inscricao.id === id);
  if (indice === -1) {
    return false;
  }
  inscricoes.splice(indice, 1);
  return true;
}

// Usado nos testes para começar cada caso do zero (DT-06)
export function resetar() {
  inscricoes = [];
  proximoId = 1;
}
