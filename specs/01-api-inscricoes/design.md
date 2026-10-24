> **Feature:** 01-api-inscricoes
> **Documento:** design
> **Status:** aprovado
> **Aprovado em:** 2026-10-24

# Design — 01-api-inscricoes

## Visão geral e arquitetura

```
[React (Vite :5173)] --HTTP/JSON--> [Express (:3001)] --> [rotas] --> [validação] --> [repositório em memória (array)]
```

A API é um app Express com três camadas simples:

1. **Rotas** (`routes/inscricoes.js`): recebem a requisição, chamam a validação e o repositório e montam a resposta HTTP.
2. **Validação** (`validacao/inscricao.js`): função pura que recebe o corpo e devolve os dados normalizados ou os erros por campo. Não sabe nada de HTTP.
3. **Repositório** (`repositorio/inscricoes.js`): guarda as inscrições num array em memória e controla o próximo `id`.

O `app` é criado em `app.js` e exportado sem chamar `listen`. Só o `server.js` sobe a porta. Assim os testes usam `request(app)` sem abrir porta (CLAUDE.md, seção 9).

### Estrutura de arquivos criada por esta feature

```
backend/
├── package.json                  # "type": "module", scripts dev/start/test
├── vitest.config.js              # ambiente node
├── src/
│   ├── app.js                    # cria e exporta o app (CORS, JSON, rotas, erros)
│   ├── server.js                 # app.listen(PORT || 3001)
│   ├── routes/
│   │   └── inscricoes.js         # GET, POST, DELETE /inscricoes
│   ├── validacao/
│   │   └── inscricao.js          # validarInscricao(corpo)
│   └── repositorio/
│       └── inscricoes.js         # listar, criar, buscarPorEmail, remover, resetar
└── tests/
    ├── listar.test.js
    ├── criar.test.js
    ├── remover.test.js
    └── geral.test.js             # CORS, JSON malformado, formato dos erros
```

## Contratos da API

### Convenções gerais

- **Content-Type:** todas as respostas com corpo são `application/json; charset=utf-8`. O `POST` espera `Content-Type: application/json`.
- **CORS (REQ-BE-19):** origem permitida `http://localhost:5173`, métodos `GET`, `POST`, `DELETE`. Requisições preflight (`OPTIONS`) são respondidas pelo middleware `cors`.
- **Formato padrão de erro (REQ-BE-22, D-10):**
  - Erro de validação dos campos:
    ```json
    { "erro": "Dados inválidos", "campos": { "email": "Informe um e-mail válido" } }
    ```
  - Qualquer outro erro:
    ```json
    { "erro": "mensagem em português" }
    ```
- **Rota inexistente (REQ-BE-22):** `404` com `{ "erro": "Rota não encontrada" }`.
- **Erro inesperado (REQ-BE-22):** `500` com `{ "erro": "Erro interno do servidor" }`. Nenhum detalhe interno (stack) vai para o cliente.

### Mensagens de erro

| Situação                                  | Status | Onde aparece          | Mensagem                                                    | Requisito  |
| ----------------------------------------- | ------ | --------------------- | ----------------------------------------------------------- | ---------- |
| `nome` ausente, não-texto ou vazio        | 400    | `campos.nome`         | `O nome é obrigatório`                                      | REQ-BE-07  |
| `email` ausente, não-texto ou vazio       | 400    | `campos.email`        | `O e-mail é obrigatório`                                    | REQ-BE-08  |
| `email` com formato inválido              | 400    | `campos.email`        | `Informe um e-mail válido`                                  | REQ-BE-09  |
| `tipoIngresso` ausente ou inválido        | 400    | `campos.tipoIngresso` | `O tipo de ingresso deve ser "estudante" ou "profissional"` | REQ-BE-10  |
| `telefone` inválido                       | 400    | `campos.telefone`     | `Informe um telefone com DDD (10 ou 11 dígitos)`            | REQ-BE-12  |
| e-mail já cadastrado                      | 400    | `erro`                | `E-mail já cadastrado`                                      | REQ-BE-06  |
| corpo não é JSON válido                   | 400    | `erro`                | `O corpo da requisição não é um JSON válido`                | REQ-BE-18  |
| `:id` não é inteiro positivo              | 400    | `erro`                | `O id deve ser um número inteiro positivo`                  | REQ-BE-17  |
| `:id` não existe                          | 404    | `erro`                | `Inscrição não encontrada`                                  | REQ-BE-16  |
| rota inexistente                          | 404    | `erro`                | `Rota não encontrada`                                       | REQ-BE-22  |
| erro inesperado                           | 500    | `erro`                | `Erro interno do servidor`                                  | REQ-BE-22  |

### GET /inscricoes
- **Requisitos:** REQ-BE-01, REQ-BE-02
- **Request:** sem parâmetros nem corpo.
- **Resposta de sucesso:** `200` com o array de inscrições em ordem de criação (ordem de inserção no array).
  ```json
  [
    { "id": 1, "nome": "Maria Silva", "email": "maria@email.com", "telefone": "(11) 99999-9999", "tipoIngresso": "estudante" },
    { "id": 2, "nome": "João Souza", "email": "joao@email.com", "telefone": "", "tipoIngresso": "profissional" }
  ]
  ```
  Sem inscrições: `200` com `[]`.
- **Respostas de erro:** nenhuma prevista além do `500` genérico.

### POST /inscricoes
- **Requisitos:** REQ-BE-03 a REQ-BE-14, REQ-BE-18, REQ-BE-23
- **Request:**
  ```json
  { "nome": "  Maria Silva ", "email": "Maria@Email.com", "telefone": "11999999999", "tipoIngresso": "estudante" }
  ```
- **Resposta de sucesso:** `201` com a inscrição criada, já normalizada (REQ-BE-05, REQ-BE-23) e só com os campos do modelo (REQ-BE-03, REQ-BE-14):
  ```json
  { "id": 1, "nome": "Maria Silva", "email": "maria@email.com", "telefone": "(11) 99999-9999", "tipoIngresso": "estudante" }
  ```
- **Respostas de erro:**
  - `400` de validação, com **todos** os campos inválidos em `campos` (REQ-BE-07 a REQ-BE-10, REQ-BE-12, REQ-BE-13):
    ```json
    {
      "erro": "Dados inválidos",
      "campos": {
        "nome": "O nome é obrigatório",
        "email": "Informe um e-mail válido",
        "tipoIngresso": "O tipo de ingresso deve ser \"estudante\" ou \"profissional\""
      }
    }
    ```
  - `400` de e-mail duplicado (REQ-BE-06): `{ "erro": "E-mail já cadastrado" }`
  - `400` de JSON malformado (REQ-BE-18): `{ "erro": "O corpo da requisição não é um JSON válido" }`
- **Ordem das verificações:** (1) JSON válido → (2) validação de todos os campos → (3) e-mail duplicado → (4) criação. A checagem de duplicado só roda quando todos os campos são válidos, usando o e-mail já normalizado.
- **Corpo vazio, ausente ou sem `Content-Type: application/json`:** tratado como `{}`, e cai na validação dos obrigatórios (D-12).
- **Corpo que é JSON válido mas não é objeto** (ex: um array): tratado como `{}`, e cai na validação dos obrigatórios.

### DELETE /inscricoes/:id
- **Requisitos:** REQ-BE-15, REQ-BE-16, REQ-BE-17
- **Request:** `:id` na URL. Só é aceito se casar com `^[1-9]\d*$` (inteiro positivo, sem sinal, sem casas decimais, sem zeros à esquerda).
- **Resposta de sucesso:** `204` sem corpo.
- **Respostas de erro:**
  - `400` se `:id` não for inteiro positivo (ex: `abc`, `1.5`, `-1`, `0`): `{ "erro": "O id deve ser um número inteiro positivo" }`
  - `404` se não existir inscrição com esse `id`: `{ "erro": "Inscrição não encontrada" }`

## Modelo de dados

### Entidade `Inscricao`

| Campo          | Tipo   | Obrigatório | Regras                                                                                                                                                     | Requisito                         |
| -------------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `id`           | number | gerado      | Inteiro gerado pelo repositório. Nunca vem do cliente.                                                                                                     | REQ-BE-04                         |
| `nome`         | string | sim         | Precisa ser string. Aplicado `trim()`. Não pode ficar vazio. Sem limite de tamanho (D-07).                                                                  | REQ-BE-05, REQ-BE-07              |
| `email`        | string | sim         | Precisa ser string. Aplicado `trim()` e `toLowerCase()`. Não pode ficar vazio. Deve casar com `^[^\s@]+@[^\s@]+\.[^\s@]+$`. Único entre as inscrições.       | REQ-BE-05, REQ-BE-06, REQ-BE-08, REQ-BE-09 |
| `telefone`     | string | não         | Ausente, `null` ou vazio após `trim()` → `""`. Se informado: precisa ser string, só pode ter dígitos, espaços, `(`, `)` e `-` (`^[\d\s()-]+$`), e precisa ter 10 ou 11 dígitos. Guardado formatado. | REQ-BE-05, REQ-BE-11, REQ-BE-12, REQ-BE-23 |
| `tipoIngresso` | string | sim         | Exatamente `"estudante"` ou `"profissional"`, sem normalização (D-06).                                                                                    | REQ-BE-10                         |

### Formatação do telefone (REQ-BE-23)

1. Extrai só os dígitos (`replace(/\D/g, '')`).
2. Com 11 dígitos: `(DD) NNNNN-NNNN`. Ex: `49999692146` → `(49) 99969-2146`.
3. Com 10 dígitos: `(DD) NNNN-NNNN`. Ex: `4933334444` → `(49) 3333-4444`.

Um `telefone` que não é string nem `null` (ex: o número `11999999999`) é tratado como inválido, com a mensagem de REQ-BE-12.

### Geração do `id` (REQ-BE-04, REQ-BE-21)

O repositório mantém um contador `proximoId`, que começa em `1` e só é incrementado. Excluir uma inscrição não diminui o contador, então um `id` nunca é reaproveitado. Ao reiniciar o processo, o array e o contador voltam ao estado inicial.

### Unicidade do e-mail (REQ-BE-06)

Como o e-mail já é guardado em minúsculas e sem espaços, a comparação é uma igualdade simples entre o e-mail normalizado e os já guardados.

### Forma em memória (REQ-BE-21)

```js
let inscricoes = [];   // Inscricao[], em ordem de criação
let proximoId = 1;
```

Interface do repositório:

| Função                  | Retorno                                     |
| ----------------------- | ------------------------------------------- |
| `listar()`              | cópia do array, em ordem de criação         |
| `criar(dados)`          | inscrição criada, com `id`                  |
| `buscarPorEmail(email)` | inscrição ou `undefined`                    |
| `remover(id)`           | `true` se removeu, `false` se não existia   |
| `resetar()`             | limpa o array e volta `proximoId` para `1` (uso nos testes) |

### Validação

`validarInscricao(corpo)` devolve:
- `{ valido: true, dados: { nome, email, telefone, tipoIngresso } }`, com os dados já normalizados e **só** os campos do modelo (REQ-BE-14); ou
- `{ valido: false, campos: { <campo>: <mensagem>, ... } }`, com **todos** os campos inválidos (REQ-BE-13).

## Componentes e rotas do frontend

Não se aplica: esta feature é só o backend. O frontend é a feature `02-frontend-telas`, que consome os contratos acima.

## Decisões técnicas

### DT-01: Persistência em memória
- **Contexto:** o enunciado permite SQLite ou array em memória.
- **Opções consideradas:** (a) array em memória; (b) SQLite (`better-sqlite3`).
- **Decisão:** (a) array em memória.
- **Justificativa:** decidido em D-01. Sem dependência nativa (que costuma dar problema de instalação no Windows) e fácil de zerar entre testes.
- **Consequências:** dados perdidos ao reiniciar o servidor. Isolar o repositório num módulo próprio permite trocar por SQLite no futuro sem mexer nas rotas.
- **Requisitos relacionados:** REQ-BE-04, REQ-BE-21.

### DT-02: Express 5 com ES Modules
- **Contexto:** precisamos escolher a versão do Express e o sistema de módulos.
- **Opções consideradas:** Express 4 ou 5; CommonJS (`require`) ou ESM (`import`).
- **Decisão:** Express 5 e ESM (`"type": "module"` no `package.json`).
- **Justificativa:** o Express 5 é a versão estável atual e repassa erros de handlers `async` ao middleware de erro sozinho. ESM é o padrão do Vitest e o mesmo que o frontend com Vite vai usar.
- **Consequências:** imports com extensão `.js` explícita.
- **Requisitos relacionados:** todos.

### DT-03: Validação manual, sem biblioteca
- **Contexto:** há 4 campos com regras simples.
- **Opções consideradas:** (a) funções próprias; (b) `zod`; (c) `express-validator`.
- **Decisão:** (a) funções próprias em `validacao/inscricao.js`.
- **Justificativa:** as regras cabem em poucas linhas, as mensagens em português ficam sob controle total, e não há dependência extra para aprender.
- **Consequências:** a validação é uma função pura, testável de forma isolada.
- **Requisitos relacionados:** REQ-BE-05, REQ-BE-07 a REQ-BE-14, REQ-BE-23.

### DT-04: CORS com o pacote `cors`
- **Contexto:** o frontend roda em outra origem (`localhost:5173`).
- **Opções consideradas:** (a) pacote `cors`; (b) cabeçalhos escritos à mão; (c) proxy do Vite.
- **Decisão:** (a) `cors({ origin: 'http://localhost:5173' })`.
- **Justificativa:** é o padrão do ecossistema e trata o preflight `OPTIONS` sozinho. O proxy do Vite esconderia o problema em desenvolvimento, mas não cumpriria REQ-BE-19.
- **Consequências:** outras origens não recebem o cabeçalho `Access-Control-Allow-Origin`.
- **Requisitos relacionados:** REQ-BE-19.

### DT-05: JSON malformado tratado no middleware de erro
- **Contexto:** por padrão, o `express.json()` gera um erro que o Express responde em HTML.
- **Decisão:** um middleware de erro no fim do `app.js` reconhece o erro de parse (`err.type === 'entity.parse.failed'`) e responde `400` em JSON. Qualquer outro erro vira `500` em JSON. Um handler antes dele responde `404` em JSON para rotas inexistentes.
- **Justificativa:** garante que o frontend sempre recebe JSON (D-12).
- **Requisitos relacionados:** REQ-BE-18, REQ-BE-22.

### DT-06: Isolamento de estado nos testes com `resetar()`
- **Contexto:** o repositório é um módulo com estado. Testes não podem depender da ordem de execução.
- **Opções consideradas:** (a) função `resetar()` chamada em `beforeEach`; (b) fábrica `criarApp()` que recebe um repositório novo a cada teste.
- **Decisão:** (a) `resetar()`.
- **Justificativa:** mantém o código de produção mais simples. O Vitest já isola cada arquivo de teste num processo próprio, então só é preciso limpar entre os testes do mesmo arquivo.
- **Requisitos relacionados:** todos os automáticos.

### DT-07: Scripts e execução
- **Decisão:** `npm run dev` → `node --watch src/server.js`; `npm start` → `node src/server.js`; `npm test` → `vitest run`.
- **Justificativa:** o `--watch` nativo do Node dispensa o `nodemon`.
- **Requisitos relacionados:** REQ-BE-20.

### Dependências

| Pacote      | Tipo | Uso                       |
| ----------- | ---- | ------------------------- |
| `express`   | prod | servidor HTTP (v5)        |
| `cors`      | prod | CORS                      |
| `vitest`    | dev  | testes                    |
| `supertest` | dev  | requisições HTTP no teste |

## Estratégia de testes

- **Ferramentas:** Vitest + Supertest, ambiente `node`.
- **Nível:** testes de integração HTTP com `request(app)`, sem subir porta. Eles cobrem rotas, validação e repositório juntos, que é o que os requisitos descrevem (comportamento observável da API).
- **Isolamento:** `beforeEach(() => resetar())` em todos os arquivos de teste.
- **Nome dos testes:** sempre começa com o ID do requisito (CLAUDE.md, seção 6).

### Mapa requisito → teste previsto

| Requisito | Arquivo           | Teste previsto                                                                                                     |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| REQ-BE-01 | `listar.test.js`  | lista todas as inscrições em ordem de criação, com status 200                                                      |
| REQ-BE-02 | `listar.test.js`  | retorna 200 e array vazio quando não há inscrições                                                                 |
| REQ-BE-03 | `criar.test.js`   | cria inscrição válida e retorna 201 com exatamente os campos do modelo                                            |
| REQ-BE-04 | `criar.test.js`   | gera ids crescentes; não reaproveita o id depois de uma exclusão                                                   |
| REQ-BE-05 | `criar.test.js`   | remove espaços das pontas de nome/email/telefone e guarda o e-mail em minúsculas                                   |
| REQ-BE-06 | `criar.test.js`   | retorna 400 com "E-mail já cadastrado" para e-mail repetido, inclusive com maiúsculas e espaços; não cria          |
| REQ-BE-07 | `criar.test.js`   | retorna 400 com `campos.nome` para nome ausente, vazio, só espaços ou não-texto                                    |
| REQ-BE-08 | `criar.test.js`   | retorna 400 com `campos.email` para e-mail ausente, vazio ou não-texto                                             |
| REQ-BE-09 | `criar.test.js`   | retorna 400 com `campos.email` para e-mails sem `@`, sem domínio ou com espaços                                    |
| REQ-BE-10 | `criar.test.js`   | retorna 400 com `campos.tipoIngresso` para ausente, valor fora da lista e `"Estudante"`                            |
| REQ-BE-11 | `criar.test.js`   | aceita telefone ausente, `null` ou só espaços e guarda `""`                                                        |
| REQ-BE-12 | `criar.test.js`   | retorna 400 com `campos.telefone` para letras, símbolos, número (não-texto) e quantidade errada de dígitos         |
| REQ-BE-13 | `criar.test.js`   | lista todos os campos inválidos na mesma resposta e não cria a inscrição                                           |
| REQ-BE-14 | `criar.test.js`   | ignora campos extras (ex: `admin`, `id`) no corpo                                                                  |
| REQ-BE-15 | `remover.test.js` | remove inscrição existente com 204 sem corpo; ela some do GET                                                      |
| REQ-BE-16 | `remover.test.js` | retorna 404 para id inteiro inexistente                                                                            |
| REQ-BE-17 | `remover.test.js` | retorna 400 para `abc`, `1.5`, `-1` e `0`                                                                          |
| REQ-BE-18 | `geral.test.js`   | retorna 400 em JSON para corpo malformado e não cria                                                               |
| REQ-BE-19 | `geral.test.js`   | responde com `Access-Control-Allow-Origin: http://localhost:5173` para essa origem                                 |
| REQ-BE-20 | —                 | **manual:** subir com e sem `PORT` e conferir a porta no log                                                       |
| REQ-BE-21 | —                 | **manual:** criar inscrição, reiniciar o servidor e conferir que o GET volta `[]`                                  |
| REQ-BE-22 | `geral.test.js`   | erros 400 e 404 (incluindo rota inexistente) vêm em JSON com `erro` em português                                   |
| REQ-BE-23 | `criar.test.js`   | formata `49999692146`, `(49)99969-2146` e `49 99969 2146` como `(49) 99969-2146`, e `4933334444` como `(49) 3333-4444` |

## Riscos e pontos de atenção

- **Validação de e-mail simples:** a regex aceita alguns e-mails tecnicamente inválidos (ex: `a@b.c`). É intencional (D-03, "formato básico").
- **Telefone sem checagem de DDD real:** `(00) 00000-0000` passa, porque REQ-BE-12 só exige a quantidade de dígitos.
- **Porta e CORS fixos para desenvolvimento:** se o Vite subir em outra porta (por exemplo, quando a 5173 estiver ocupada), o navegador vai bloquear as chamadas. A feature 02 deve usar a porta padrão do Vite.
