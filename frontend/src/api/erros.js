// Ficam num módulo separado para que os testes de página possam simular a API
// sem perder as classes de erro reais (DT-04, DT-10)

export const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';

// A API respondeu, mas com status de erro
export class ErroDaApi extends Error {
  constructor(status, mensagem, campos) {
    super(mensagem);
    this.name = 'ErroDaApi';
    this.status = status;
    this.campos = campos;
  }
}

// A API não respondeu (desligada ou sem rede)
export class ErroDeConexao extends Error {
  constructor() {
    super(MENSAGEM_SEM_CONEXAO);
    this.name = 'ErroDeConexao';
  }
}
