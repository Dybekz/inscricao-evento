> **Feature:** 01-api-inscricoes
> **Documento:** tarefas
> **Status:** aprovado
> **Aprovado em:** 2026-10-24
> **Revisão:** pendente

# Tarefas — 01-api-inscricoes

## Tarefas

- [x] **T01: Scaffolding do backend**
  - **Descrição:** criar a pasta `backend/` com o `package.json` (`"type": "module"`, scripts `dev`, `start` e `test` conforme DT-07, dependências `express@5` e `cors`, e de desenvolvimento `vitest` e `supertest`), o `vitest.config.js` (ambiente `node`, `passWithNoTests: true` para a suíte vazia não falhar) e o `.gitignore` ignorando `node_modules/`. Rodar `npm install`.
  - **Requisitos:** infraestrutura. Habilita todos os REQ-BE com verificação automática.
  - **Arquivos:** `backend/package.json` (criar), `backend/package-lock.json` (gerado), `backend/vitest.config.js` (criar), `backend/.gitignore` (criar)
  - **Critério de pronto:** `npm install` termina sem erro e `npm test` roda o Vitest e sai com código 0. `git status` não mostra `node_modules/`.
  - **Depende de:** —
  - **Commit sugerido:** `chore(backend): estrutura inicial do backend`

- [ ] **T02: App Express, servidor e tratamento de erros**
  - **Descrição:** criar o `app.js` com `cors({ origin: 'http://localhost:5173' })`, `express.json()`, o handler de rota inexistente (`404` em JSON) e o middleware de erro (JSON malformado → `400`, demais → `500`, sempre em JSON), conforme DT-04 e DT-05. Exportar o `app` sem `listen`. Criar o `server.js`, que importa o `app` e escuta em `process.env.PORT || 3001`, com um log da porta. Criar `tests/geral.test.js`.
  - **Requisitos:** REQ-BE-18, REQ-BE-19, REQ-BE-20, REQ-BE-22
  - **Arquivos:** `backend/src/app.js` (criar), `backend/src/server.js` (criar), `backend/tests/geral.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo os testes "REQ-BE-18: ..." (corpo malformado → 400 em JSON), "REQ-BE-19: ..." (cabeçalho `Access-Control-Allow-Origin` para `http://localhost:5173`) e "REQ-BE-22: ..." (rota inexistente → 404 em JSON com `erro` em português). `npm run dev` sobe e mostra a porta 3001 no log.
  - **Depende de:** T01
  - **Commit sugerido:** `feat(backend): app express com cors e erros em json`

- [ ] **T03: Repositório em memória e listagem**
  - **Descrição:** criar o repositório com `listar`, `criar`, `buscarPorEmail`, `remover` e `resetar`, guardando as inscrições num array e o contador `proximoId` (DT-01, seção "Forma em memória" do design). Criar o router `routes/inscricoes.js` com `GET /inscricoes` e registrá-lo no `app.js`. Criar `tests/listar.test.js`, usando `resetar()` no `beforeEach` (DT-06) e `criar()` do repositório para preparar os dados.
  - **Requisitos:** REQ-BE-01, REQ-BE-02, REQ-BE-21
  - **Arquivos:** `backend/src/repositorio/inscricoes.js` (criar), `backend/src/routes/inscricoes.js` (criar), `backend/src/app.js` (alterar), `backend/tests/listar.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-01: ..." (200 com todas, em ordem de criação) e "REQ-BE-02: ..." (200 com `[]`).
  - **Depende de:** T02
  - **Commit sugerido:** `feat(backend): lista as inscrições`

- [ ] **T04: Criação de inscrição válida com normalização**
  - **Descrição:** criar `validacao/inscricao.js` com `validarInscricao(corpo)`, que por enquanto normaliza (`trim` em nome/email/telefone, e-mail em minúsculas, telefone ausente/`null`/vazio → `""`) e devolve só os campos do modelo. Adicionar `POST /inscricoes`, que trata corpo vazio ou não-objeto como `{}`, chama a validação, cria no repositório e responde `201`. Criar `tests/criar.test.js` com os casos de sucesso.
  - **Requisitos:** REQ-BE-03, REQ-BE-04 (ids crescentes), REQ-BE-05, REQ-BE-11, REQ-BE-14
  - **Arquivos:** `backend/src/validacao/inscricao.js` (criar), `backend/src/routes/inscricoes.js` (alterar), `backend/tests/criar.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-03: ...", "REQ-BE-04: ... ids crescentes", "REQ-BE-05: ...", "REQ-BE-11: ..." e "REQ-BE-14: ...".
  - **Depende de:** T03
  - **Commit sugerido:** `feat(backend): cria inscrição`

- [ ] **T05: Validação dos campos obrigatórios e do e-mail**
  - **Descrição:** completar `validarInscricao` com as regras de `nome`, `email` (presença e formato `^[^\s@]+@[^\s@]+\.[^\s@]+$`) e `tipoIngresso`, com as mensagens da tabela do design, reunindo **todos** os erros em `campos`. No `POST`, responder `400` com `{ "erro": "Dados inválidos", "campos": {...} }` quando inválido.
  - **Requisitos:** REQ-BE-07, REQ-BE-08, REQ-BE-09, REQ-BE-10, REQ-BE-13
  - **Arquivos:** `backend/src/validacao/inscricao.js` (alterar), `backend/src/routes/inscricoes.js` (alterar), `backend/tests/criar.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-07: ...", "REQ-BE-08: ...", "REQ-BE-09: ...", "REQ-BE-10: ..." e "REQ-BE-13: ...", e confirmando que nada é criado nos casos inválidos.
  - **Depende de:** T04
  - **Commit sugerido:** `feat(backend): valida os campos da inscrição`

- [ ] **T06: Validação e formatação do telefone**
  - **Descrição:** em `validarInscricao`, quando o telefone for informado: recusar se não for string, se tiver caracteres fora de `^[\d\s()-]+$` ou se não tiver 10 ou 11 dígitos; caso válido, formatar como `(DD) NNNNN-NNNN` ou `(DD) NNNN-NNNN` (seção "Formatação do telefone" do design).
  - **Requisitos:** REQ-BE-12, REQ-BE-23
  - **Arquivos:** `backend/src/validacao/inscricao.js` (alterar), `backend/tests/criar.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-12: ..." (letras, símbolos, número não-texto, dígitos a mais ou a menos) e "REQ-BE-23: ..." (`49999692146`, `(49)99969-2146` e `49 99969 2146` → `(49) 99969-2146`; `4933334444` → `(49) 3333-4444`).
  - **Depende de:** T05
  - **Commit sugerido:** `feat(backend): valida e formata o telefone`

- [ ] **T07: Bloqueio de e-mail duplicado**
  - **Descrição:** no `POST`, depois da validação dos campos, usar `buscarPorEmail` com o e-mail normalizado e responder `400` com `{ "erro": "E-mail já cadastrado" }` se já existir.
  - **Requisitos:** REQ-BE-06
  - **Arquivos:** `backend/src/routes/inscricoes.js` (alterar), `backend/tests/criar.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-06: ..." com e-mail idêntico e com variação de maiúsculas e espaços, confirmando que o GET continua com uma inscrição só.
  - **Depende de:** T05
  - **Commit sugerido:** `feat(backend): bloqueia e-mail repetido`

- [ ] **T08: Remoção de inscrição**
  - **Descrição:** adicionar `DELETE /inscricoes/:id`: validar `:id` com `^[1-9]\d*$` (`400` se inválido), chamar `remover` (`404` se não existir) e responder `204` sem corpo. Criar `tests/remover.test.js`, incluindo o caso de `id` não reaproveitado depois de uma exclusão.
  - **Requisitos:** REQ-BE-04 (id não reaproveitado), REQ-BE-15, REQ-BE-16, REQ-BE-17
  - **Arquivos:** `backend/src/routes/inscricoes.js` (alterar), `backend/tests/remover.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-04: ... não reaproveita o id", "REQ-BE-15: ...", "REQ-BE-16: ..." e "REQ-BE-17: ..." (`abc`, `1.5`, `-1`, `0`).
  - **Depende de:** T04
  - **Commit sugerido:** `feat(backend): remove inscrição`

- [ ] **T09: Formato dos erros e verificação manual**
  - **Descrição:** acrescentar em `tests/geral.test.js` um teste que percorre os erros dos endpoints (validação, e-mail duplicado, id inválido, id inexistente) e confere que todos vêm em JSON, com `erro` em português. Depois, verificar manualmente REQ-BE-20 (subir com e sem `PORT`) e REQ-BE-21 (criar inscrição, reiniciar o servidor e ver o GET voltar `[]`), registrando o resultado na matriz.
  - **Requisitos:** REQ-BE-20, REQ-BE-21, REQ-BE-22
  - **Arquivos:** `backend/tests/geral.test.js` (alterar), `specs/01-api-inscricoes/tasks.md` (alterar)
  - **Critério de pronto:** `npm test` passa com toda a suíte, incluindo "REQ-BE-22: erros dos endpoints ...". Verificações manuais de REQ-BE-20 e REQ-BE-21 feitas, mostradas à usuária e registradas na matriz.
  - **Depende de:** T06, T07, T08
  - **Commit sugerido:** `test(backend): confere erros em json e testa porta e memória`

## Matriz de rastreabilidade

| Requisito | Tarefa(s) | Teste(s)                                                       | Status   |
| --------- | --------- | -------------------------------------------------------------- | -------- |
| REQ-BE-01 | T03       | `listar.test.js` › "REQ-BE-01: lista todas em ordem de criação" | pendente |
| REQ-BE-02 | T03       | `listar.test.js` › "REQ-BE-02: retorna array vazio"            | pendente |
| REQ-BE-03 | T04       | `criar.test.js` › "REQ-BE-03: cria e retorna 201"              | pendente |
| REQ-BE-04 | T04, T08  | `criar.test.js` › "REQ-BE-04: ids crescentes"; `remover.test.js` › "REQ-BE-04: não reaproveita o id" | pendente |
| REQ-BE-05 | T04       | `criar.test.js` › "REQ-BE-05: normaliza espaços e e-mail"      | pendente |
| REQ-BE-06 | T07       | `criar.test.js` › "REQ-BE-06: e-mail já cadastrado"            | pendente |
| REQ-BE-07 | T05       | `criar.test.js` › "REQ-BE-07: nome obrigatório"                | pendente |
| REQ-BE-08 | T05       | `criar.test.js` › "REQ-BE-08: e-mail obrigatório"              | pendente |
| REQ-BE-09 | T05       | `criar.test.js` › "REQ-BE-09: formato do e-mail"               | pendente |
| REQ-BE-10 | T05       | `criar.test.js` › "REQ-BE-10: tipoIngresso inválido"           | pendente |
| REQ-BE-11 | T04       | `criar.test.js` › "REQ-BE-11: telefone opcional"               | pendente |
| REQ-BE-12 | T06       | `criar.test.js` › "REQ-BE-12: telefone inválido"               | pendente |
| REQ-BE-13 | T05       | `criar.test.js` › "REQ-BE-13: lista todos os campos inválidos" | pendente |
| REQ-BE-14 | T04       | `criar.test.js` › "REQ-BE-14: ignora campos extras"            | pendente |
| REQ-BE-15 | T08       | `remover.test.js` › "REQ-BE-15: remove e retorna 204"          | pendente |
| REQ-BE-16 | T08       | `remover.test.js` › "REQ-BE-16: id inexistente → 404"          | pendente |
| REQ-BE-17 | T08       | `remover.test.js` › "REQ-BE-17: id inválido → 400"             | pendente |
| REQ-BE-18 | T02       | `geral.test.js` › "REQ-BE-18: JSON malformado → 400"           | pendente |
| REQ-BE-19 | T02       | `geral.test.js` › "REQ-BE-19: CORS para localhost:5173"        | pendente |
| REQ-BE-20 | T02, T09  | manual (T09)                                                   | pendente |
| REQ-BE-21 | T03, T09  | manual (T09)                                                   | pendente |
| REQ-BE-22 | T02, T09  | `geral.test.js` › "REQ-BE-22: rota inexistente → 404 em JSON"; "REQ-BE-22: erros dos endpoints em JSON" | pendente |
| REQ-BE-23 | T06       | `criar.test.js` › "REQ-BE-23: formata o telefone"              | pendente |

## Registro de revisão

Ainda não revisado.
