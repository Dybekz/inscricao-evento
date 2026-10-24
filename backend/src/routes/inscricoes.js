import { Router } from 'express';
import * as repositorio from '../repositorio/inscricoes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(repositorio.listar());
});

export default router;
