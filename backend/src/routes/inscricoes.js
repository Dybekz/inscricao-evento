import { Router } from 'express';
import * as repositorio from '../repositorio/inscricoes.js';
import { validarInscricao } from '../validacao/inscricao.js';

const router = Router();

function ehObjeto(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

router.get('/', (req, res) => {
  res.json(repositorio.listar());
});

router.post('/', (req, res) => {
  // Corpo vazio, ausente ou que não é objeto é tratado como {} (D-12)
  const corpo = ehObjeto(req.body) ? req.body : {};
  const resultado = validarInscricao(corpo);

  if (!resultado.valido) {
    return res.status(400).json({ erro: 'Dados inválidos', campos: resultado.campos });
  }

  // O e-mail já vem normalizado (sem espaços e em minúsculas) da validação
  if (repositorio.buscarPorEmail(resultado.dados.email)) {
    return res.status(400).json({ erro: 'E-mail já cadastrado' });
  }

  const inscricao = repositorio.criar(resultado.dados);
  res.status(201).json(inscricao);
});

export default router;
