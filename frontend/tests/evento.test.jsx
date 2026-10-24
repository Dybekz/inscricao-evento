import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderizar } from './renderizar.jsx';
import { evento } from '../src/dados/evento.js';

describe('tela do evento', () => {
  it('REQ-FE-04: mostra nome, data, local e descrição do evento', () => {
    renderizar('/');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(evento.nome);
    expect(screen.getByText(evento.data)).toBeInTheDocument();
    expect(screen.getByText(evento.local)).toBeInTheDocument();
    expect(screen.getByText(evento.descricao)).toBeInTheDocument();
  });

  it('REQ-FE-05: mostra cada palestrante com nome, cargo e empresa, tema e iniciais', () => {
    renderizar('/');
    const secao = screen.getByRole('region', { name: 'Palestrantes' });
    const cartoes = within(secao).getAllByRole('article');

    expect(cartoes).toHaveLength(evento.palestrantes.length);

    evento.palestrantes.forEach((palestrante, indice) => {
      const cartao = within(cartoes[indice]);
      expect(cartao.getByRole('heading', { name: palestrante.nome })).toBeInTheDocument();
      expect(cartao.getByText(`${palestrante.cargo} · ${palestrante.empresa}`)).toBeInTheDocument();
      expect(cartao.getByText(palestrante.tema)).toBeInTheDocument();
    });

    expect(within(cartoes[0]).getByText('AR')).toBeInTheDocument();
    expect(within(cartoes[3]).getByText('RO')).toBeInTheDocument();
  });

  it('REQ-FE-06: o botão "Inscreva-se" leva à tela de inscrição', async () => {
    const { usuario } = renderizar('/');

    await usuario.click(screen.getByRole('link', { name: 'Inscreva-se' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Inscrição');
  });
});
