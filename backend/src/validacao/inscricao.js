const TIPOS_DE_INGRESSO = ['estudante', 'profissional'];
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function aparar(valor) {
  return typeof valor === 'string' ? valor.trim() : valor;
}

function textoPreenchido(valor) {
  return typeof valor === 'string' && valor !== '';
}

// Recebe o corpo da requisição e devolve só os campos do modelo, já normalizados,
// ou todos os campos inválidos com a mensagem de cada um
export function validarInscricao(corpo) {
  const email = aparar(corpo.email);

  const dados = {
    nome: aparar(corpo.nome),
    email: typeof email === 'string' ? email.toLowerCase() : email,
    telefone: aparar(corpo.telefone) ?? '',
    tipoIngresso: corpo.tipoIngresso,
  };

  const campos = {};

  if (!textoPreenchido(dados.nome)) {
    campos.nome = 'O nome é obrigatório';
  }

  if (!textoPreenchido(dados.email)) {
    campos.email = 'O e-mail é obrigatório';
  } else if (!FORMATO_EMAIL.test(dados.email)) {
    campos.email = 'Informe um e-mail válido';
  }

  if (!TIPOS_DE_INGRESSO.includes(dados.tipoIngresso)) {
    campos.tipoIngresso = 'O tipo de ingresso deve ser "estudante" ou "profissional"';
  }

  if (Object.keys(campos).length > 0) {
    return { valido: false, campos };
  }

  return { valido: true, dados };
}
