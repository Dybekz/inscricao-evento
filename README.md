# Site Inscrição de Eventos

Site para divulgação de eventos e recebimento de inscrições. São três telas: a página do evento (com data, local, descrição e palestrantes), o formulário de inscrição e a lista de inscritos, com opção de excluir. O frontend conversa com uma API própria, que guarda as inscrições.

**Stack:** Node.js + Express 5 · React 19 + Vite + React Router · Vitest, Supertest e React Testing Library

## Organização

O projeto foi feito a partir de specs: em `specs/`, cada parte (API, telas e entrega) tem requisitos, design e tarefas, aprovados antes do código, seguindo as regras do projeto.

## Como rodar

Pré-requisitos: Node.js 22.22+ ou 24.15+ (testado no 24.22.1), npm e Git.

```bash
git clone https://github.com/Dybekz/inscricao-evento.git
cd inscricao-evento
```

**Terminal 1, API** (`http://localhost:3001`):

```bash
cd backend
npm install
npm run dev
```

**Terminal 2, site** (`http://localhost:5173`), com a API rodando:

```bash
cd frontend
npm install
npm run dev
```

Testes: `npm test` dentro de `backend/` ou `frontend/`.

> As inscrições ficam em memória e somem quando a API reinicia.
> O site precisa rodar na porta `5173`, a única liberada pelo CORS da API.
> A porta da API muda com `PORT` (padrão `3001`), e o site aponta para ela com `VITE_API_URL` (padrão `http://localhost:3001`).

## API

| Método   | Rota              | Descrição            | Sucesso |
| -------- | ----------------- | -------------------- | ------- |
| `GET`    | `/inscricoes`     | Lista as inscrições  | `200`   |
| `POST`   | `/inscricoes`     | Cria uma inscrição   | `201`   |
| `DELETE` | `/inscricoes/:id` | Remove uma inscrição | `204`   |

```json
{ "id": 1, "nome": "Maria Silva", "email": "maria@email.com", "telefone": "(11) 99999-9999", "tipoIngresso": "estudante" }
```

`nome`, `email` e `tipoIngresso` (`"estudante"` ou `"profissional"`) são obrigatórios; `telefone` é opcional. Campo inválido → `400` com `{ "erro": "Dados inválidos", "campos": { ... } }`; e-mail já cadastrado → `400` com `{ "erro": "E-mail já cadastrado" }`.
