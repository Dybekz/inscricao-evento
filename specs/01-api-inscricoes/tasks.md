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

- [x] **T02: App Express, servidor e tratamento de erros**
  - **Descrição:** criar o `app.js` com `cors({ origin: 'http://localhost:5173' })`, `express.json()`, o handler de rota inexistente (`404` em JSON) e o middleware de erro (JSON malformado → `400`, demais → `500`, sempre em JSON), conforme DT-04 e DT-05. Exportar o `app` sem `listen`. Criar o `server.js`, que importa o `app` e escuta em `process.env.PORT || 3001`, com um log da porta. Criar `tests/geral.test.js`.
  - **Requisitos:** REQ-BE-18, REQ-BE-19, REQ-BE-20, REQ-BE-22
  - **Arquivos:** `backend/src/app.js` (criar), `backend/src/server.js` (criar), `backend/tests/geral.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo os testes "REQ-BE-18: ..." (corpo malformado → 400 em JSON), "REQ-BE-19: ..." (cabeçalho `Access-Control-Allow-Origin` para `http://localhost:5173`) e "REQ-BE-22: ..." (rota inexistente → 404 em JSON com `erro` em português). `npm run dev` sobe e mostra a porta 3001 no log.
  - **Depende de:** T01
  - **Commit sugerido:** `feat(backend): app express com cors e erros em json`

- [x] **T03: Repositório em memória e listagem**
  - **Descrição:** criar o repositório com `listar`, `criar`, `buscarPorEmail`, `remover` e `resetar`, guardando as inscrições num array e o contador `proximoId` (DT-01, seção "Forma em memória" do design). Criar o router `routes/inscricoes.js` com `GET /inscricoes` e registrá-lo no `app.js`. Criar `tests/listar.test.js`, usando `resetar()` no `beforeEach` (DT-06) e `criar()` do repositório para preparar os dados.
  - **Requisitos:** REQ-BE-01, REQ-BE-02, REQ-BE-21
  - **Arquivos:** `backend/src/repositorio/inscricoes.js` (criar), `backend/src/routes/inscricoes.js` (criar), `backend/src/app.js` (alterar), `backend/tests/listar.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-01: ..." (200 com todas, em ordem de criação) e "REQ-BE-02: ..." (200 com `[]`).
  - **Depende de:** T02
  - **Commit sugerido:** `feat(backend): lista as inscrições`

- [x] **T04: Criação de inscrição válida com normalização**
  - **Descrição:** criar `validacao/inscricao.js` com `validarInscricao(corpo)`, que por enquanto normaliza (`trim` em nome/email/telefone, e-mail em minúsculas, telefone ausente/`null`/vazio → `""`) e devolve só os campos do modelo. Adicionar `POST /inscricoes`, que trata corpo vazio ou não-objeto como `{}`, chama a validação, cria no repositório e responde `201`. Criar `tests/criar.test.js` com os casos de sucesso.
  - **Requisitos:** REQ-BE-03, REQ-BE-04 (ids crescentes), REQ-BE-05, REQ-BE-11, REQ-BE-14
  - **Arquivos:** `backend/src/validacao/inscricao.js` (criar), `backend/src/routes/inscricoes.js` (alterar), `backend/tests/criar.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-03: ...", "REQ-BE-04: ... ids crescentes", "REQ-BE-05: ...", "REQ-BE-11: ..." e "REQ-BE-14: ...".
  - **Depende de:** T03
  - **Commit sugerido:** `feat(backend): cria inscrição`

- [x] **T05: Validação dos campos obrigatórios e do e-mail**
  - **Descrição:** completar `validarInscricao` com as regras de `nome`, `email` (presença e formato `^[^\s@]+@[^\s@]+\.[^\s@]+$`) e `tipoIngresso`, com as mensagens da tabela do design, reunindo **todos** os erros em `campos`. No `POST`, responder `400` com `{ "erro": "Dados inválidos", "campos": {...} }` quando inválido.
  - **Requisitos:** REQ-BE-07, REQ-BE-08, REQ-BE-09, REQ-BE-10, REQ-BE-13
  - **Arquivos:** `backend/src/validacao/inscricao.js` (alterar), `backend/src/routes/inscricoes.js` (alterar), `backend/tests/criar.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-07: ...", "REQ-BE-08: ...", "REQ-BE-09: ...", "REQ-BE-10: ..." e "REQ-BE-13: ...", e confirmando que nada é criado nos casos inválidos.
  - **Depende de:** T04
  - **Commit sugerido:** `feat(backend): valida os campos da inscrição`

- [x] **T06: Validação e formatação do telefone**
  - **Descrição:** em `validarInscricao`, quando o telefone for informado: recusar se não for string, se tiver caracteres fora de `^[\d\s()-]+$` ou se não tiver 10 ou 11 dígitos; caso válido, formatar como `(DD) NNNNN-NNNN` ou `(DD) NNNN-NNNN` (seção "Formatação do telefone" do design).
  - **Requisitos:** REQ-BE-12, REQ-BE-23
  - **Arquivos:** `backend/src/validacao/inscricao.js` (alterar), `backend/tests/criar.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-12: ..." (letras, símbolos, número não-texto, dígitos a mais ou a menos) e "REQ-BE-23: ..." (`49999692146`, `(49)99969-2146` e `49 99969 2146` → `(49) 99969-2146`; `4933334444` → `(49) 3333-4444`).
  - **Depende de:** T05
  - **Commit sugerido:** `feat(backend): valida e formata o telefone`

- [x] **T07: Bloqueio de e-mail duplicado**
  - **Descrição:** no `POST`, depois da validação dos campos, usar `buscarPorEmail` com o e-mail normalizado e responder `400` com `{ "erro": "E-mail já cadastrado" }` se já existir.
  - **Requisitos:** REQ-BE-06
  - **Arquivos:** `backend/src/routes/inscricoes.js` (alterar), `backend/tests/criar.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-06: ..." com e-mail idêntico e com variação de maiúsculas e espaços, confirmando que o GET continua com uma inscrição só.
  - **Depende de:** T05
  - **Commit sugerido:** `feat(backend): bloqueia e-mail repetido`

- [x] **T08: Remoção de inscrição**
  - **Descrição:** adicionar `DELETE /inscricoes/:id`: validar `:id` com `^[1-9]\d*$` (`400` se inválido), chamar `remover` (`404` se não existir) e responder `204` sem corpo. Criar `tests/remover.test.js`, incluindo o caso de `id` não reaproveitado depois de uma exclusão.
  - **Requisitos:** REQ-BE-04 (id não reaproveitado), REQ-BE-15, REQ-BE-16, REQ-BE-17
  - **Arquivos:** `backend/src/routes/inscricoes.js` (alterar), `backend/tests/remover.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-BE-04: ... não reaproveita o id", "REQ-BE-15: ...", "REQ-BE-16: ..." e "REQ-BE-17: ..." (`abc`, `1.5`, `-1`, `0`).
  - **Depende de:** T04
  - **Commit sugerido:** `feat(backend): remove inscrição`

- [x] **T09: Formato dos erros e verificação manual**
  - **Descrição:** acrescentar em `tests/geral.test.js` um teste que percorre os erros dos endpoints (validação, e-mail duplicado, id inválido, id inexistente) e confere que todos vêm em JSON, com `erro` em português. Depois, verificar manualmente REQ-BE-20 (subir com e sem `PORT`) e REQ-BE-21 (criar inscrição, reiniciar o servidor e ver o GET voltar `[]`), registrando o resultado na matriz.
  - **Requisitos:** REQ-BE-20, REQ-BE-21, REQ-BE-22
  - **Arquivos:** `backend/tests/geral.test.js` (alterar), `specs/01-api-inscricoes/tasks.md` (alterar)
  - **Critério de pronto:** `npm test` passa com toda a suíte, incluindo "REQ-BE-22: erros dos endpoints ...". Verificações manuais de REQ-BE-20 e REQ-BE-21 feitas, mostradas à usuária e registradas na matriz.
  - **Depende de:** T06, T07, T08
  - **Commit sugerido:** `test(backend): confere erros em json e testa porta e memória`

- [x] **T10: Correções da revisão (corpo JSON que não é objeto)**
  - **Descrição:** o `express.json()` está no modo estrito padrão e recusa corpos que são JSON válido mas primitivos (`"abc"`, `123`, `null`) como "não é um JSON válido", enquanto o design manda tratar todo JSON válido que não é objeto como `{}` e cair na validação dos obrigatórios. Trocar para `express.json({ strict: false })`. Em `tests/geral.test.js`, acrescentar um teste para esses corpos e completar o teste de REQ-BE-18 conferindo que o GET continua `[]` depois do corpo malformado.
  - **Requisitos:** REQ-BE-18, REQ-BE-13
  - **Arquivos:** `backend/src/app.js` (alterar), `backend/tests/geral.test.js` (alterar)
  - **Critério de pronto:** `npm test` passa com toda a suíte, incluindo "REQ-BE-18: ... não cria a inscrição" e "REQ-BE-13: corpo JSON que não é objeto cai na validação dos campos" (`[1,2]`, `"abc"`, `123`, `null` → 400 com `campos.nome`, `campos.email` e `campos.tipoIngresso`).
  - **Depende de:** T09
  - **Commit sugerido:** `fix/backend - trata corpo json que não é objeto`

## Matriz de rastreabilidade

| Requisito | Tarefa(s) | Teste(s)                                                       | Status   |
| --------- | --------- | -------------------------------------------------------------- | -------- |
| REQ-BE-01 | T03       | `listar.test.js` › "REQ-BE-01: lista todas as inscrições em ordem de criação, com status 200" | conforme |
| REQ-BE-02 | T03       | `listar.test.js` › "REQ-BE-02: retorna 200 e um array vazio quando não há inscrições" | conforme |
| REQ-BE-03 | T04       | `criar.test.js` › "REQ-BE-03: cria inscrição válida e retorna 201 com exatamente os campos do modelo" | conforme |
| REQ-BE-04 | T04, T08  | `criar.test.js` › "REQ-BE-04: gera ids inteiros crescentes"; `remover.test.js` › "REQ-BE-04: não reaproveita o id depois de uma exclusão" | conforme |
| REQ-BE-05 | T04       | `criar.test.js` › "REQ-BE-05: remove espaços das pontas de nome, e-mail e telefone e guarda o e-mail em minúsculas" | conforme |
| REQ-BE-06 | T07       | `criar.test.js` › "REQ-BE-06: retorna 400 com \"E-mail já cadastrado\" para e-mail repetido, mesmo com maiúsculas e espaços" | conforme |
| REQ-BE-07 | T05       | `criar.test.js` › "REQ-BE-07: retorna 400 com campos.nome para nome ausente, vazio, só espaços ou não-texto" | conforme |
| REQ-BE-08 | T05       | `criar.test.js` › "REQ-BE-08: retorna 400 com campos.email para e-mail ausente, vazio ou não-texto" | conforme |
| REQ-BE-09 | T05       | `criar.test.js` › "REQ-BE-09: retorna 400 com campos.email para e-mail fora do formato texto@texto.texto" | conforme |
| REQ-BE-10 | T05       | `criar.test.js` › "REQ-BE-10: retorna 400 com campos.tipoIngresso para ausente, valor fora da lista ou com maiúsculas" | conforme |
| REQ-BE-11 | T04       | `criar.test.js` › "REQ-BE-11: aceita telefone ausente, null ou só com espaços e guarda \"\"" | conforme |
| REQ-BE-12 | T06       | `criar.test.js` › "REQ-BE-12: retorna 400 com campos.telefone para letras, símbolos, número não-texto e quantidade errada de dígitos" | conforme |
| REQ-BE-13 | T05, T10  | `criar.test.js` › "REQ-BE-13: informa todos os campos inválidos na mesma resposta e não cria a inscrição"; "REQ-BE-13: corpo vazio retorna os três campos obrigatórios"; `geral.test.js` › "REQ-BE-13: corpo JSON que não é objeto cai na validação dos campos" | conforme |
| REQ-BE-14 | T04       | `criar.test.js` › "REQ-BE-14: ignora campos extras enviados no corpo" | conforme |
| REQ-BE-15 | T08       | `remover.test.js` › "REQ-BE-15: remove a inscrição existente, retorna 204 sem corpo e ela some do GET" | conforme |
| REQ-BE-16 | T08       | `remover.test.js` › "REQ-BE-16: retorna 404 em JSON para id inteiro que não existe" | conforme |
| REQ-BE-17 | T08       | `remover.test.js` › "REQ-BE-17: retorna 400 em JSON para id que não é inteiro positivo" | conforme |
| REQ-BE-18 | T02, T10  | `geral.test.js` › "REQ-BE-18: retorna 400 em JSON quando o corpo não é um JSON válido e não cria a inscrição" | conforme |
| REQ-BE-19 | T02       | `geral.test.js` › "REQ-BE-19: libera CORS para o frontend em http://localhost:5173"; "REQ-BE-19: responde ao preflight com os métodos GET, POST e DELETE" | conforme |
| REQ-BE-20 | T02, T09  | manual em 2026-10-24: sem `PORT` → log "API rodando em http://localhost:3001" e GET respondeu `[]`; com `PORT=4000` → respondeu na 4000 e a 3001 ficou sem resposta | verificado |
| REQ-BE-21 | T03, T09  | manual em 2026-10-24: POST criou id 1 e GET listou; servidor reiniciado → GET `[]` e novo POST recebeu id 1 | verificado |
| REQ-BE-22 | T02, T09  | `geral.test.js` › "REQ-BE-22: retorna 404 em JSON, em português, para rota inexistente"; "REQ-BE-22: erros dos endpoints vêm em JSON, com a mensagem em português" | conforme |
| REQ-BE-23 | T06       | `criar.test.js` › "REQ-BE-23: guarda o telefone formatado, independentemente de como foi digitado" | conforme |

## Registro de revisão

### 2026-10-24

- **Testes:** 25/25 passando (4 arquivos). Verificações manuais repetidas: REQ-BE-20 (sem `PORT` → 3001; `PORT=4000` → 4000) e REQ-BE-21 (inscrição criada some depois do reinício) conformes.
- **Resultado:** 21 de 23 requisitos conformes. Revisão **não aprovada**.
- **Lacunas:**
  - Divergente do design: corpo JSON válido primitivo (`"abc"`, `123`, `null`) recebe `400 "O corpo da requisição não é um JSON válido"` em vez de cair na validação dos obrigatórios (design, POST › "Corpo que é JSON válido mas não é objeto"). Causa: `express.json()` em modo estrito (`backend/src/app.js:8`). Arrays já se comportam como o design manda. Correção: T10.
  - Teste incompleto: o teste de REQ-BE-18 não confere que a inscrição não foi criada, como o critério EARS pede. O comportamento está certo (conferido à mão), falta a asserção. Correção: T10.
- **Desvio de convenção (só documento):** as linhas "Commit sugerido" de T01 a T09 ainda usam o formato antigo `tipo(escopo): ...`. Os commits reais seguem `tipo/escopo - ...`, exceto `344e26f` e os de spec, anteriores à mudança do padrão (`93afa01`).
- **Escopo extra:** nenhum.
