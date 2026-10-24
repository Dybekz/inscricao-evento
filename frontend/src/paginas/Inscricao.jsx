import { useState } from 'react';
import { Link } from 'react-router';
import { criarInscricao } from '../api/inscricoes.js';
import { ErroDaApi, ErroDeConexao, MENSAGEM_SEM_CONEXAO } from '../api/erros.js';
import { validarFormulario } from '../validacao/inscricao.js';
import '../estilos/inscricao.css';

// tipoIngresso '' = nenhuma opção marcada (REQ-FE-08)
const VALORES_INICIAIS = { nome: '', email: '', telefone: '', tipoIngresso: '' };

// Texto exato do contrato da API (REQ-BE-06); é por ele que o erro vai para junto do e-mail (DT-07)
const MENSAGEM_EMAIL_DUPLICADO = 'E-mail já cadastrado';

function MensagemDeErro({ campo, erros }) {
  if (!erros[campo]) {
    return null;
  }
  return (
    <p id={`erro-${campo}`} className="inscricao-erro">
      {erros[campo]}
    </p>
  );
}

// Liga o campo à sua mensagem de erro, para leitores de tela anunciarem o problema
function atributosDeErro(campo, erros) {
  return erros[campo] ? { 'aria-invalid': true, 'aria-describedby': `erro-${campo}` } : {};
}

export default function Inscricao() {
  const [valores, setValores] = useState(VALORES_INICIAIS);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [inscritoComo, setInscritoComo] = useState('');
  const [erroGeral, setErroGeral] = useState('');

  function alterar(evento) {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));

    // Ao alterar um campo, some só a mensagem dele (REQ-FE-13)
    setErros((anteriores) => {
      if (!(name in anteriores)) {
        return anteriores;
      }
      const { [name]: _removido, ...restantes } = anteriores;
      return restantes;
    });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setInscritoComo('');
    setErroGeral('');

    const errosEncontrados = validarFormulario(valores);
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      const inscricao = await criarInscricao(valores);
      setInscritoComo(inscricao.nome);
      setValores(VALORES_INICIAIS);
    } catch (erro) {
      // Em todos os casos de erro, os valores digitados continuam no formulário
      if (erro instanceof ErroDaApi && erro.campos) {
        setErros(erro.campos);
      } else if (erro instanceof ErroDaApi && erro.status === 400 && erro.message === MENSAGEM_EMAIL_DUPLICADO) {
        setErros({ email: erro.message });
      } else if (erro instanceof ErroDaApi) {
        setErroGeral(erro.message);
      } else if (erro instanceof ErroDeConexao) {
        setErroGeral(MENSAGEM_SEM_CONEXAO);
      } else {
        throw erro;
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="inscricao">
      <h1>Inscrição</h1>
      <p className="inscricao-introducao">Preencha seus dados para garantir sua vaga no evento.</p>

      {inscritoComo && (
        <div role="status" className="mensagem mensagem-sucesso">
          <p className="inscricao-sucesso-texto">Inscrição confirmada, {inscritoComo}!</p>
          <Link to="/inscritos">Ver inscritos</Link>
        </div>
      )}

      {/* noValidate: valem só as nossas mensagens em português, não as do navegador */}
      <form className="inscricao-formulario" onSubmit={enviar} noValidate>
        <div className="inscricao-campo">
          <label htmlFor="campo-nome">Nome</label>
          <input
            id="campo-nome"
            name="nome"
            type="text"
            autoComplete="name"
            value={valores.nome}
            onChange={alterar}
            {...atributosDeErro('nome', erros)}
          />
          <MensagemDeErro campo="nome" erros={erros} />
        </div>

        <div className="inscricao-campo">
          <label htmlFor="campo-email">E-mail</label>
          <input
            id="campo-email"
            name="email"
            type="email"
            autoComplete="email"
            value={valores.email}
            onChange={alterar}
            {...atributosDeErro('email', erros)}
          />
          <MensagemDeErro campo="email" erros={erros} />
        </div>

        <div className="inscricao-campo">
          <label htmlFor="campo-telefone">
            Telefone <span className="inscricao-opcional">(opcional)</span>
          </label>
          <input
            id="campo-telefone"
            name="telefone"
            type="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            value={valores.telefone}
            onChange={alterar}
            {...atributosDeErro('telefone', erros)}
          />
          <MensagemDeErro campo="telefone" erros={erros} />
        </div>

        <fieldset className="inscricao-campo inscricao-tipos" {...atributosDeErro('tipoIngresso', erros)}>
          <legend>Tipo de ingresso</legend>
          <div className="inscricao-opcoes">
            <label className="inscricao-opcao">
              <input
                type="radio"
                name="tipoIngresso"
                value="estudante"
                checked={valores.tipoIngresso === 'estudante'}
                onChange={alterar}
              />
              Estudante
            </label>
            <label className="inscricao-opcao">
              <input
                type="radio"
                name="tipoIngresso"
                value="profissional"
                checked={valores.tipoIngresso === 'profissional'}
                onChange={alterar}
              />
              Profissional
            </label>
          </div>
          <MensagemDeErro campo="tipoIngresso" erros={erros} />
        </fieldset>

        {erroGeral && (
          <p role="alert" className="mensagem mensagem-erro">
            {erroGeral}
          </p>
        )}

        {/* Desabilitado durante o envio, para um clique duplo não criar duas inscrições */}
        <button type="submit" className="botao inscricao-botao" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar inscrição'}
        </button>
      </form>
    </section>
  );
}
