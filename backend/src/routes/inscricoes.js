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
  const { dados } = validarInscricao(corpo);

  const inscricao = repositorio.criar(dados);
  res.status(201).json(inscricao);
});

export default router;
