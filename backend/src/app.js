import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', methods: ['GET', 'POST', 'DELETE'] }));
app.use(express.json());

// Nenhuma rota respondeu: devolve 404 em JSON em vez do HTML padrão do Express
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Middleware de erro: precisa dos 4 parâmetros para o Express reconhecê-lo
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'O corpo da requisição não é um JSON válido' });
  }

  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

export default app;
