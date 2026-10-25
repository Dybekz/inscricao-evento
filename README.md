# Conecta Tech 2027 — Site de evento com inscrições

Site que divulga um evento fictício de tecnologia, o **Conecta Tech 2027**, e recebe inscrições. São três telas: a página do evento (com data, local, descrição e palestrantes), o formulário de inscrição e a lista de inscritos, com opção de excluir. O frontend conversa com uma API própria, que guarda as inscrições.

## Tecnologias

- **Backend:** Node.js + Express 5, com os dados guardados em memória.
- **Frontend:** React 19 + Vite + React Router, com CSS puro.
- **Testes:** Vitest e Supertest no backend; Vitest e React Testing Library no frontend.

## Pré-requisitos

- [Node.js](https://nodejs.org/) **22** (22.22.2 ou mais nova) ou **24** (24.15 ou mais nova). As versões 23 e 25 não são compatíveis com as ferramentas de teste.
- npm (já vem com o Node.js).
- Git.

Testado com Node.js 24.22.1 e npm 11.19.1.

## Como rodar

O backend e o frontend rodam ao mesmo tempo, cada um no seu terminal.

### 1. Clonar o repositório

```bash
git clone https://github.com/Dybekz/inscricao-evento.git
cd inscricao-evento
```

### 2. Backend (terminal 1)

```bash
cd backend
npm install
npm run dev
```

A API fica disponível em `http://localhost:3001`. No terminal aparece:

```
API rodando em http://localhost:3001
```

`npm run dev` reinicia a API quando um arquivo muda. Para rodar sem isso, use `npm start`.

### 3. Frontend (terminal 2)

Com o backend ainda rodando, abra outro terminal na pasta do projeto:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador.

Se a API não estiver rodando, as telas de inscrição e de inscritos mostram uma mensagem avisando que o servidor está fora do ar.

## Testes

Em cada pasta, `backend/` e `frontend/`:

```bash
npm test
```

Os testes não precisam da API nem do site rodando: no backend, as requisições são feitas direto no app Express; no frontend, as chamadas à API são simuladas.

## Configuração

| Variável       | Onde       | Para que serve                         | Padrão                  |
| -------------- | ---------- | -------------------------------------- | ----------------------- |
| `PORT`         | `backend`  | Porta em que a API escuta              | `3001`                  |
| `VITE_API_URL` | `frontend` | Endereço da API usado pelo site        | `http://localhost:3001` |

Exemplo, subindo a API na porta 4000 e apontando o site para ela:

```bash
# bash (Linux, macOS, Git Bash)
PORT=4000 npm run dev                            # em backend/
VITE_API_URL=http://localhost:4000 npm run dev   # em frontend/
```

```powershell
# PowerShell (Windows)
$env:PORT=4000; npm run dev                              # em backend/
$env:VITE_API_URL="http://localhost:4000"; npm run dev   # em frontend/
```

**Atenção:** o site precisa rodar na porta `5173`, porque é a única que a API libera no CORS. Se essa porta estiver ocupada, o Vite para com erro em vez de subir em outra porta.

## API

| Método   | Rota              | O que faz                                  | Sucesso          |
| -------- | ----------------- | ------------------------------------------ | ---------------- |
| `GET`    | `/inscricoes`     | Lista todas as inscrições, em ordem de criação | `200`        |
| `POST`   | `/inscricoes`     | Cria uma inscrição                         | `201`            |
| `DELETE` | `/inscricoes/:id` | Remove uma inscrição                       | `204` (sem corpo) |

Modelo de uma inscrição:

```json
{ "id": 1, "nome": "Maria Silva", "email": "maria@email.com", "telefone": "(11) 99999-9999", "tipoIngresso": "estudante" }
```

Regras:

- `nome`, `email` e `tipoIngresso` são obrigatórios. O `telefone` é opcional.
- `tipoIngresso` aceita `"estudante"` ou `"profissional"`.
- O `email` precisa ter um formato válido e não pode se repetir. Um e-mail já cadastrado é recusado com `400`:
  ```json
  { "erro": "E-mail já cadastrado" }
  ```
- Campos inválidos também voltam com `400`, com a mensagem de cada campo em `campos`:
  ```json
  { "erro": "Dados inválidos", "campos": { "email": "Informe um e-mail válido" } }
  ```
- Excluir um `id` que não existe devolve `404` com `{ "erro": "Inscrição não encontrada" }`.

**Os dados ficam em memória:** as inscrições são guardadas num array dentro da API e somem quando ela é reiniciada.

## Como o projeto foi organizado

O projeto foi desenvolvido a partir de especificações, em três partes: `01-api-inscricoes`, `02-frontend-telas` e `03-entrega`. Cada parte tem uma pasta em `specs/` com os requisitos (`requirements.md`), o design (`design.md`) e as tarefas (`tasks.md`), escritos e aprovados antes do código, seguindo as regras do projeto.
