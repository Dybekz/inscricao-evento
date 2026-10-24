import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderizar } from './renderizar.jsx';
import { listarInscricoes } from '../src/api/inscricoes.js';

// A tela de inscritos busca a lista ao abrir; aqui a API é simulada devolvendo uma lista vazia (DT-10)
vi.mock('../src/api/inscricoes.js');

const telas = [
  { caminho: '/', titulo: 'Conecta Tech 2027' },
  { caminho: '/inscricao', titulo: 'Inscrição' },
  { caminho: '/inscritos', titulo: 'Inscritos' },
];

function tituloDaTela() {
  return screen.getByRole('heading', { level: 1 });
}

function menu() {
  return screen.getByRole('navigation', { name: 'Navegação principal' });
}

describe('navegação', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    listarInscricoes.mockResolvedValue([]);
  });

  it('REQ-FE-01: cada caminho mostra a sua tela', () => {
    for (const { caminho, titulo } of telas) {
      const { unmount } = renderizar(caminho);

      expect(tituloDaTela()).toHaveTextContent(titulo);

      unmount();
    }
  });

  it('REQ-FE-01: os links do cabeçalho trocam de tela', async () => {
    const { usuario } = renderizar('/');

    await usuario.click(within(menu()).getByRole('link', { name: 'Inscrição' }));
    expect(tituloDaTela()).toHaveTextContent('Inscrição');

    await usuario.click(within(menu()).getByRole('link', { name: 'Inscritos' }));
    expect(tituloDaTela()).toHaveTextContent('Inscritos');

    await usuario.click(within(menu()).getByRole('link', { name: 'Evento' }));
    expect(tituloDaTela()).toHaveTextContent('Conecta Tech 2027');
  });

  it('REQ-FE-02: o cabeçalho com os links para as 3 telas aparece em todas elas', () => {
    for (const { caminho } of telas) {
      const { unmount } = renderizar(caminho);

      expect(within(menu()).getByRole('link', { name: 'Evento' })).toHaveAttribute('href', '/');
      expect(within(menu()).getByRole('link', { name: 'Inscrição' })).toHaveAttribute('href', '/inscricao');
      expect(within(menu()).getByRole('link', { name: 'Inscritos' })).toHaveAttribute('href', '/inscritos');

      unmount();
    }
  });

  it('REQ-FE-03: caminho desconhecido mostra "Página não encontrada" e o link volta para o evento', async () => {
    const { usuario } = renderizar('/caminho-que-nao-existe');

    expect(tituloDaTela()).toHaveTextContent('Página não encontrada');
    expect(menu()).toBeInTheDocument();

    await usuario.click(screen.getByRole('link', { name: 'Voltar para o início' }));
    expect(tituloDaTela()).toHaveTextContent('Conecta Tech 2027');
  });
});
