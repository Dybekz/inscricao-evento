import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderizar } from './renderizar.jsx';
import { criarInscricao } from '../src/api/inscricoes.js';

// A API é simulada: nenhum teste de tela faz requisição de verdade (DT-10)
vi.mock('../src/api/inscricoes.js');

function campos() {
  return {
    nome: screen.getByLabelText('Nome'),
    email: screen.getByLabelText('E-mail'),
    telefone: screen.getByLabelText('Telefone (opcional)'),
    estudante: screen.getByRole('radio', { name: 'Estudante' }),
    profissional: screen.getByRole('radio', { name: 'Profissional' }),
    enviar: screen.getByRole('button', { name: 'Enviar inscrição' }),
  };
}

// Preenche o formulário com dados válidos, trocando só o que for passado
async function preencher(usuario, valores = {}) {
  const { nome = 'Maria Silva', email = 'maria@email.com', telefone = '', tipo = 'Estudante' } = valores;
  const formulario = campos();

  if (nome) await usuario.type(formulario.nome, nome);
  if (email) await usuario.type(formulario.email, email);
  if (telefone) await usuario.type(formulario.telefone, telefone);
  if (tipo) await usuario.click(screen.getByRole('radio', { name: tipo }));
}

describe('formulário de inscrição', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('REQ-FE-07: mostra os campos com rótulo e o telefone opcional com exemplo de formato', () => {
    renderizar('/inscricao');
    const formulario = campos();

    expect(formulario.nome).toHaveAttribute('type', 'text');
    expect(formulario.email).toHaveAttribute('type', 'email');
    expect(formulario.telefone).toHaveAttribute('placeholder', '(11) 99999-9999');
    expect(screen.getByRole('group', { name: 'Tipo de ingresso' })).toBeInTheDocument();
  });

  it('REQ-FE-08: tipo de ingresso tem duas opções exclusivas, nenhuma marcada no início', async () => {
    const { usuario } = renderizar('/inscricao');
    const { estudante, profissional } = campos();

    expect(estudante).toHaveAttribute('value', 'estudante');
    expect(profissional).toHaveAttribute('value', 'profissional');
    expect(estudante).not.toBeChecked();
    expect(profissional).not.toBeChecked();

    await usuario.click(estudante);
    expect(estudante).toBeChecked();

    await usuario.click(profissional);
    expect(profissional).toBeChecked();
    expect(estudante).not.toBeChecked();
  });

  it('REQ-FE-09: obrigatório vazio ou só com espaços mostra a mensagem junto ao campo e não chama a API', async () => {
    const { usuario } = renderizar('/inscricao');

    await preencher(usuario, { nome: '   ', tipo: null });
    await usuario.click(campos().enviar);

    expect(campos().nome).toHaveAccessibleDescription('O nome é obrigatório');
    expect(screen.getByRole('group', { name: 'Tipo de ingresso' })).toHaveAccessibleDescription(
      'Escolha o tipo de ingresso',
    );
    expect(criarInscricao).not.toHaveBeenCalled();
  });

  it('REQ-FE-10: e-mail fora do formato mostra "Informe um e-mail válido" e não chama a API', async () => {
    const { usuario } = renderizar('/inscricao');

    await preencher(usuario, { email: 'maria@email' });
    await usuario.click(campos().enviar);

    expect(campos().email).toHaveAccessibleDescription('Informe um e-mail válido');
    expect(criarInscricao).not.toHaveBeenCalled();
  });

  it('REQ-FE-11: telefone inválido mostra a mensagem junto ao campo e não chama a API', async () => {
    const { usuario } = renderizar('/inscricao');

    await preencher(usuario, { telefone: '4999-abcd' });
    await usuario.click(campos().enviar);

    expect(campos().telefone).toHaveAccessibleDescription('Informe um telefone com DDD (10 ou 11 dígitos)');
    expect(criarInscricao).not.toHaveBeenCalled();
  });

  it('REQ-FE-12: enviar o formulário vazio mostra as 3 mensagens de uma vez', async () => {
    const { usuario } = renderizar('/inscricao');

    await usuario.click(campos().enviar);

    expect(screen.getByText('O nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('O e-mail é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Escolha o tipo de ingresso')).toBeInTheDocument();
    expect(criarInscricao).not.toHaveBeenCalled();
  });

  it('REQ-FE-13: alterar um campo com erro remove só a mensagem dele', async () => {
    const { usuario } = renderizar('/inscricao');

    await usuario.click(campos().enviar);
    await usuario.type(campos().nome, 'M');

    expect(screen.queryByText('O nome é obrigatório')).not.toBeInTheDocument();
    expect(campos().nome).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('O e-mail é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Escolha o tipo de ingresso')).toBeInTheDocument();

    await usuario.click(campos().profissional);
    expect(screen.queryByText('Escolha o tipo de ingresso')).not.toBeInTheDocument();
  });

  it('REQ-FE-14: envia os 4 campos à API e, enquanto espera, deixa o botão desabilitado com "Enviando…"', async () => {
    // Promessa controlada pelo teste, para observar a tela no meio do envio
    let responder;
    criarInscricao.mockReturnValue(new Promise((resolver) => (responder = resolver)));
    const { usuario } = renderizar('/inscricao');

    await preencher(usuario, { telefone: '49999692146', tipo: 'Profissional' });
    await usuario.click(campos().enviar);

    expect(criarInscricao).toHaveBeenCalledTimes(1);
    expect(criarInscricao).toHaveBeenCalledWith({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '49999692146',
      tipoIngresso: 'profissional',
    });

    const botao = screen.getByRole('button', { name: 'Enviando…' });
    expect(botao).toBeDisabled();

    responder({ id: 1, nome: 'Maria Silva', email: 'maria@email.com', telefone: '(49) 99969-2146', tipoIngresso: 'profissional' });

    expect(await screen.findByRole('button', { name: 'Enviar inscrição' })).toBeEnabled();
  });

  it('REQ-FE-15: depois do sucesso, mostra a confirmação com o nome e o link para inscritos e limpa o formulário', async () => {
    criarInscricao.mockResolvedValue({
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '',
      tipoIngresso: 'estudante',
    });
    const { usuario } = renderizar('/inscricao');

    await preencher(usuario);
    await usuario.click(campos().enviar);

    const confirmacao = await screen.findByRole('status');
    expect(confirmacao).toHaveTextContent('Inscrição confirmada, Maria Silva!');
    expect(screen.getByRole('link', { name: 'Ver inscritos' })).toHaveAttribute('href', '/inscritos');

    const formulario = campos();
    expect(formulario.nome).toHaveValue('');
    expect(formulario.email).toHaveValue('');
    expect(formulario.telefone).toHaveValue('');
    expect(formulario.estudante).not.toBeChecked();
    expect(formulario.profissional).not.toBeChecked();
  });
});
