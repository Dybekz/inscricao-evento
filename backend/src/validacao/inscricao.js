function aparar(valor) {
  return typeof valor === 'string' ? valor.trim() : valor;
}

// Recebe o corpo da requisição e devolve só os campos do modelo, já normalizados
export function validarInscricao(corpo) {
  const email = aparar(corpo.email);

  const dados = {
    nome: aparar(corpo.nome),
    email: typeof email === 'string' ? email.toLowerCase() : email,
    telefone: aparar(corpo.telefone) ?? '',
    tipoIngresso: corpo.tipoIngresso,
  };

  return { valido: true, dados };
}
