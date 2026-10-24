import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderizar } from './renderizar.jsx';
import { listarInscricoes, removerInscricao } from '../src/api/inscricoes.js';
import { ErroDaApi, ErroDeConexao, MENSAGEM_SEM_CONEXAO } from '../src/api/erros.js';

// A API é simulada: nenhum teste de tela faz requisição de verdade (DT-10)
vi.mock('../src/api/inscricoes.js');

const maria = { id: 1, nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999', tipoIngresso: 'estudante' };
const joao = { id: 2, nome: 'João Souza', email: 'joao@email.com', telefone: '', tipoIngresso: 'profissional' };

// Linhas do corpo da tabela, sem o cabeçalho
async function linhasDaTabela() {
  const tabela = await screen.findByRole('table');
  return within(tabela).getAllByRole('row').slice(1);
}

describe('tela de inscritos', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('REQ-FE-20: busca as inscrições ao abrir e mostra a tabela na ordem recebida, com tipo legível e "—" sem telefone', async () => {
    listarInscricoes.mockResolvedValue([maria, joao]);
    renderizar('/inscritos');

    const linhas = await linhasDaTabela();

    expect(listarInscricoes).toHaveBeenCalledTimes(1);
    expect(linhas).toHaveLength(2);

    const celulasMaria = within(linhas[0]).getAllByRole('cell').map((celula) => celula.textContent);
    expect(celulasMaria).toEqual(['Maria Silva', 'maria@email.com', '(11) 99999-9999', 'Estudante', 'Excluir']);

    const celulasJoao = within(linhas[1]).getAllByRole('cell').map((celula) => celula.textContent);
    expect(celulasJoao).toEqual(['João Souza', 'joao@email.com', '—', 'Profissional', 'Excluir']);

    const cabecalhos = screen.getAllByRole('columnheader').map((cabecalho) => cabecalho.textContent);
    expect(cabecalhos).toEqual(['Nome', 'E-mail', 'Telefone', 'Tipo de ingresso', 'Ações']);
  });

  it('REQ-FE-21: mostra a quantidade total de inscrições', async () => {
    listarInscricoes.mockResolvedValue([maria, joao]);
    const { unmount } = renderizar('/inscritos');

    expect(await screen.findByText('2 inscritos')).toBeInTheDocument();
    unmount();

    listarInscricoes.mockResolvedValue([maria]);
    renderizar('/inscritos');

    expect(await screen.findByText('1 inscrito')).toBeInTheDocument();
  });

  it('REQ-FE-22: mostra "Carregando inscrições…" enquanto a lista não chega', async () => {
    let responder;
    listarInscricoes.mockReturnValue(new Promise((resolver) => (responder = resolver)));
    renderizar('/inscritos');

    expect(screen.getByRole('status')).toHaveTextContent('Carregando inscrições…');

    responder([maria]);

    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.queryByText('Carregando inscrições…')).not.toBeInTheDocument();
  });

  it('REQ-FE-23: lista vazia mostra "Nenhuma inscrição ainda" com link para a inscrição', async () => {
    listarInscricoes.mockResolvedValue([]);
    renderizar('/inscritos');

    expect(await screen.findByText('Nenhuma inscrição ainda')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Inscreva-se' })).toHaveAttribute('href', '/inscricao');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d+ inscritos?$/)).not.toBeInTheDocument();
  });

  it('REQ-FE-24: falha ao carregar mostra o erro e "Tentar de novo" busca a lista outra vez', async () => {
    listarInscricoes.mockRejectedValueOnce(new ErroDaApi(500, 'Erro interno do servidor')).mockResolvedValueOnce([maria]);
    const { usuario } = renderizar('/inscritos');

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar as inscrições.');

    await usuario.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    expect(await linhasDaTabela()).toHaveLength(1);
    expect(listarInscricoes).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('REQ-FE-24: sem conexão com a API, mostra a mensagem de servidor fora do ar', async () => {
    listarInscricoes.mockRejectedValue(new ErroDeConexao());
    renderizar('/inscritos');

    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGEM_SEM_CONEXAO);
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
  });

  describe('exclusão', () => {
    let confirmar;

    beforeEach(() => {
      listarInscricoes.mockResolvedValue([maria, joao]);
      // O jsdom não tem uma caixa de confirmação de verdade, então ela é sempre simulada (DT-08)
      confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    afterEach(() => {
      confirmar.mockRestore();
    });

    // Abre a tela, espera a tabela e clica em "Excluir" na linha da pessoa pedida
    async function clicarEmExcluir(nome) {
      const { usuario } = renderizar('/inscritos');
      const linhas = await linhasDaTabela();
      const linha = linhas.find((item) => within(item).queryByText(nome));

      await usuario.click(within(linha).getByRole('button', { name: 'Excluir' }));
      return usuario;
    }

    function nomesNaTabela() {
      const tabela = screen.queryByRole('table');
      if (!tabela) {
        return [];
      }
      return within(tabela)
        .getAllByRole('row')
        .slice(1)
        .map((linha) => within(linha).getAllByRole('cell')[0].textContent);
    }

    it('REQ-FE-25: pede confirmação com o nome e, se cancelar, não chama a API nem muda a tabela', async () => {
      confirmar.mockReturnValue(false);

      await clicarEmExcluir('Maria Silva');

      expect(confirmar).toHaveBeenCalledWith('Excluir a inscrição de Maria Silva?');
      expect(removerInscricao).not.toHaveBeenCalled();
      expect(nomesNaTabela()).toEqual(['Maria Silva', 'João Souza']);
      expect(screen.getByText('2 inscritos')).toBeInTheDocument();
    });

    it('REQ-FE-26: ao confirmar, remove a linha sem recarregar e atualiza o contador', async () => {
      removerInscricao.mockResolvedValue(undefined);

      await clicarEmExcluir('Maria Silva');

      expect(removerInscricao).toHaveBeenCalledWith(1);
      expect(await screen.findByText('1 inscrito')).toBeInTheDocument();
      expect(nomesNaTabela()).toEqual(['João Souza']);
      expect(listarInscricoes).toHaveBeenCalledTimes(1);
    });

    it('REQ-FE-26: ao excluir a última inscrição, mostra o estado de lista vazia', async () => {
      listarInscricoes.mockResolvedValue([maria]);
      removerInscricao.mockResolvedValue(undefined);

      await clicarEmExcluir('Maria Silva');

      expect(await screen.findByText('Nenhuma inscrição ainda')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('REQ-FE-27: se a API responder 404, remove a linha e avisa que ela já tinha sido excluída', async () => {
      removerInscricao.mockRejectedValue(new ErroDaApi(404, 'Inscrição não encontrada'));

      await clicarEmExcluir('João Souza');

      expect(await screen.findByRole('status')).toHaveTextContent('Essa inscrição já tinha sido excluída.');
      expect(nomesNaTabela()).toEqual(['Maria Silva']);
      expect(screen.getByText('1 inscrito')).toBeInTheDocument();
    });

    it('REQ-FE-28: outro erro da API mostra a mensagem e mantém a tabela como estava', async () => {
      removerInscricao.mockRejectedValue(new ErroDaApi(500, 'Erro interno do servidor'));

      await clicarEmExcluir('Maria Silva');

      expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível excluir a inscrição. Tente de novo.');
      expect(nomesNaTabela()).toEqual(['Maria Silva', 'João Souza']);
      expect(screen.getByText('2 inscritos')).toBeInTheDocument();
    });

    it('REQ-FE-28: sem conexão com a API, mostra a mensagem de servidor fora do ar e mantém a tabela', async () => {
      removerInscricao.mockRejectedValue(new ErroDeConexao());

      await clicarEmExcluir('Maria Silva');

      expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGEM_SEM_CONEXAO);
      expect(nomesNaTabela()).toEqual(['Maria Silva', 'João Souza']);
    });

    it('REQ-FE-28: a mensagem de uma exclusão anterior some na próxima tentativa', async () => {
      removerInscricao.mockRejectedValueOnce(new ErroDeConexao()).mockResolvedValueOnce(undefined);

      const usuario = await clicarEmExcluir('Maria Silva');
      expect(await screen.findByRole('alert')).toBeInTheDocument();

      const linha = (await linhasDaTabela()).find((item) => within(item).queryByText('Maria Silva'));
      await usuario.click(within(linha).getByRole('button', { name: 'Excluir' }));

      expect(await screen.findByText('1 inscrito')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
