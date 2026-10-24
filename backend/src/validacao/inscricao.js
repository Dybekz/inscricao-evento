const TIPOS_DE_INGRESSO = ['estudante', 'profissional'];
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARACTERES_DE_TELEFONE = /^[\d\s()-]+$/;

function aparar(valor) {
  return typeof valor === 'string' ? valor.trim() : valor;
}

// 11 dígitos → (DD) NNNNN-NNNN; 10 dígitos → (DD) NNNN-NNNN
function formatarTelefone(digitos) {
  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const corte = numero.length - 4;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

function telefoneValido(telefone) {
  if (typeof telefone !== 'string' || !CARACTERES_DE_TELEFONE.test(telefone)) {
    return false;
  }
  const digitos = telefone.replace(/\D/g, '');
  return digitos.length === 10 || digitos.length === 11;
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

  // Telefone é opcional: só é validado e formatado quando informado
  if (dados.telefone !== '') {
    if (telefoneValido(dados.telefone)) {
      dados.telefone = formatarTelefone(dados.telefone.replace(/\D/g, ''));
    } else {
      campos.telefone = 'Informe um telefone com DDD (10 ou 11 dígitos)';
    }
  }

  if (!TIPOS_DE_INGRESSO.includes(dados.tipoIngresso)) {
    campos.tipoIngresso = 'O tipo de ingresso deve ser "estudante" ou "profissional"';
  }

  if (Object.keys(campos).length > 0) {
    return { valido: false, campos };
  }

  return { valido: true, dados };
}
