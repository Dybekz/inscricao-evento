import { describe, it, expect } from 'vitest';
import { validarFormulario } from '../src/validacao/inscricao.js';

const valoresValidos = {
  nome: 'Maria Silva',
  email: 'maria@email.com',
  telefone: '',
  tipoIngresso: 'estudante',
};

describe('validarFormulario', () => {
  it('REQ-FE-09: aceita valores válidos, inclusive sem telefone, devolvendo objeto vazio', () => {
    expect(validarFormulario(valoresValidos)).toEqual({});
    expect(validarFormulario({ ...valoresValidos, tipoIngresso: 'profissional', telefone: '(49) 99969-2146' })).toEqual({});
  });

  it('REQ-FE-09: nome vazio ou só com espaços gera "O nome é obrigatório"', () => {
    for (const nome of ['', '   ']) {
      expect(validarFormulario({ ...valoresValidos, nome })).toEqual({ nome: 'O nome é obrigatório' });
    }
  });

  it('REQ-FE-09: e-mail vazio ou só com espaços gera "O e-mail é obrigatório"', () => {
    for (const email of ['', '   ']) {
      expect(validarFormulario({ ...valoresValidos, email })).toEqual({ email: 'O e-mail é obrigatório' });
    }
  });

  it('REQ-FE-09: tipo de ingresso não escolhido gera "Escolha o tipo de ingresso"', () => {
    expect(validarFormulario({ ...valoresValidos, tipoIngresso: '' })).toEqual({
      tipoIngresso: 'Escolha o tipo de ingresso',
    });
  });

  it('REQ-FE-09: devolve todos os campos obrigatórios de uma vez', () => {
    expect(validarFormulario({ nome: ' ', email: '', telefone: '', tipoIngresso: '' })).toEqual({
      nome: 'O nome é obrigatório',
      email: 'O e-mail é obrigatório',
      tipoIngresso: 'Escolha o tipo de ingresso',
    });
  });

  it('REQ-FE-10: e-mail fora do formato texto@texto.texto gera "Informe um e-mail válido"', () => {
    for (const email of ['maria', 'maria@', 'maria@email', '@email.com', 'maria silva@email.com', 'maria@@email.com']) {
      expect(validarFormulario({ ...valoresValidos, email })).toEqual({ email: 'Informe um e-mail válido' });
    }
  });

  it('REQ-FE-10: aceita e-mail com espaços nas pontas', () => {
    expect(validarFormulario({ ...valoresValidos, email: '  maria@email.com ' })).toEqual({});
  });

  it('REQ-FE-11: telefone com letras, símbolos ou quantidade errada de dígitos gera mensagem', () => {
    const mensagem = 'Informe um telefone com DDD (10 ou 11 dígitos)';

    for (const telefone of ['abc', '4999-abcd', '+55 49 99969-2146', '49.99969.2146', '499996921', '554999692146']) {
      expect(validarFormulario({ ...valoresValidos, telefone })).toEqual({ telefone: mensagem });
    }
  });

  it('REQ-FE-11: aceita telefone vazio, só com espaços ou com 10 e 11 dígitos em qualquer formato', () => {
    for (const telefone of ['', '   ', '49999692146', '(49)99969-2146', '49 99969 2146', '4933334444']) {
      expect(validarFormulario({ ...valoresValidos, telefone })).toEqual({});
    }
  });
});
