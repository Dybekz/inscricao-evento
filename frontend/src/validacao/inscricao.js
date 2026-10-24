// Mesmas regras e expressões regulares da API (backend/src/validacao/inscricao.js, DT-06).
// Se uma regra mudar lá, precisa mudar aqui também.
const TIPOS_DE_INGRESSO = ['estudante', 'profissional'];
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARACTERES_DE_TELEFONE = /^[\d\s()-]+$/;

function telefoneValido(telefone) {
  if (!CARACTERES_DE_TELEFONE.test(telefone)) {
    return false;
  }
  const digitos = telefone.replace(/\D/g, '');
  return digitos.length === 10 || digitos.length === 11;
}

// Recebe os valores do formulário e devolve { <campo>: <mensagem> } com todos os campos
// inválidos; um objeto vazio significa que está tudo certo
export function validarFormulario(valores) {
  const nome = valores.nome.trim();
  const email = valores.email.trim();
  const telefone = valores.telefone.trim();

  const erros = {};

  if (nome === '') {
    erros.nome = 'O nome é obrigatório';
  }

  if (email === '') {
    erros.email = 'O e-mail é obrigatório';
  } else if (!FORMATO_EMAIL.test(email)) {
    erros.email = 'Informe um e-mail válido';
  }

  // Telefone é opcional: só é validado quando preenchido
  if (telefone !== '' && !telefoneValido(telefone)) {
    erros.telefone = 'Informe um telefone com DDD (10 ou 11 dígitos)';
  }

  if (!TIPOS_DE_INGRESSO.includes(valores.tipoIngresso)) {
    erros.tipoIngresso = 'Escolha o tipo de ingresso';
  }

  return erros;
}
