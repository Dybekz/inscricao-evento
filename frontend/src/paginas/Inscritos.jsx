import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { listarInscricoes, removerInscricao } from '../api/inscricoes.js';
import { ErroDaApi, ErroDeConexao, MENSAGEM_SEM_CONEXAO } from '../api/erros.js';
import '../estilos/inscritos.css';

const NOMES_DOS_TIPOS = { estudante: 'Estudante', profissional: 'Profissional' };

export default function Inscritos() {
  // situacao: 'carregando' | 'erro' | 'pronto'
  const [situacao, setSituacao] = useState('carregando');
  const [inscricoes, setInscricoes] = useState([]);
  const [erroCarregar, setErroCarregar] = useState('');
  const [aviso, setAviso] = useState('');
  const [erroExcluir, setErroExcluir] = useState('');

  async function carregar() {
    setSituacao('carregando');
    try {
      setInscricoes(await listarInscricoes());
      setSituacao('pronto');
    } catch (erro) {
      setErroCarregar(erro instanceof ErroDeConexao ? MENSAGEM_SEM_CONEXAO : 'Não foi possível carregar as inscrições.');
      setSituacao('erro');
    }
  }

  async function excluir(inscricao) {
    setAviso('');
    setErroExcluir('');

    if (!window.confirm(`Excluir a inscrição de ${inscricao.nome}?`)) {
      return;
    }

    // O contador é derivado do tamanho da lista, então se atualiza junto
    const tirarDaLista = () => setInscricoes((anteriores) => anteriores.filter((item) => item.id !== inscricao.id));

    try {
      await removerInscricao(inscricao.id);
      tirarDaLista();
    } catch (erro) {
      if (erro instanceof ErroDaApi && erro.status === 404) {
        // Já tinha sido excluída (por exemplo, em outra aba): some da lista do mesmo jeito
        tirarDaLista();
        setAviso('Essa inscrição já tinha sido excluída.');
      } else {
        setErroExcluir(
          erro instanceof ErroDeConexao ? MENSAGEM_SEM_CONEXAO : 'Não foi possível excluir a inscrição. Tente de novo.',
        );
      }
    }
  }

  // Busca a lista sempre que a tela abre, para mostrar os dados atuais (DT-05)
  useEffect(() => {
    carregar();
  }, []);

  return (
    <section className="inscritos">
      <h1>Inscritos</h1>

      {situacao === 'carregando' && <p role="status">Carregando inscrições…</p>}

      {situacao === 'erro' && (
        <div className="inscritos-falha">
          <p role="alert" className="mensagem mensagem-erro">
            {erroCarregar}
          </p>
          <button type="button" className="botao botao-secundario" onClick={carregar}>
            Tentar de novo
          </button>
        </div>
      )}

      {situacao === 'pronto' && aviso && (
        <p role="status" className="mensagem mensagem-aviso">
          {aviso}
        </p>
      )}

      {situacao === 'pronto' && erroExcluir && (
        <p role="alert" className="mensagem mensagem-erro">
          {erroExcluir}
        </p>
      )}

      {situacao === 'pronto' && inscricoes.length === 0 && (
        <div className="inscritos-vazio">
          <p>Nenhuma inscrição ainda</p>
          <Link to="/inscricao" className="botao">
            Inscreva-se
          </Link>
        </div>
      )}

      {situacao === 'pronto' && inscricoes.length > 0 && (
        <>
          <p className="inscritos-contador">
            {inscricoes.length} {inscricoes.length === 1 ? 'inscrito' : 'inscritos'}
          </p>

          {/* Em telas estreitas, a tabela rola para os lados dentro desta área (REQ-FE-32) */}
          <div className="inscritos-rolagem" role="region" aria-label="Tabela de inscritos" tabIndex={0}>
            <table className="inscritos-tabela">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Tipo de ingresso</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inscricoes.map((inscricao) => (
                  <tr key={inscricao.id}>
                    <td>{inscricao.nome}</td>
                    <td>{inscricao.email}</td>
                    <td>{inscricao.telefone || '—'}</td>
                    <td>{NOMES_DOS_TIPOS[inscricao.tipoIngresso] ?? inscricao.tipoIngresso}</td>
                    <td>
                      <button type="button" className="inscritos-excluir" onClick={() => excluir(inscricao)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
