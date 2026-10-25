> **Feature:** 02-frontend-telas
> **Documento:** design
> **Status:** aprovado
> **Aprovado em:** 2026-10-25

# Design — 02-frontend-telas

## Visão geral e arquitetura

```
[Navegador]
   │
   ▼
[React (Vite :5173)]
   ├── React Router ──► páginas: Evento, Inscricao, Inscritos, NaoEncontrada
   ├── dados/evento.js          (conteúdo fixo do evento)
   ├── validacao/inscricao.js   (regras do formulário, função pura)
   └── api/inscricoes.js ──HTTP/JSON──► [Express :3001] (feature 01)
```

O front tem quatro camadas simples:

1. **Páginas** (`paginas/`): uma por rota. Guardam o próprio estado (`useState`) e chamam a camada de API.
2. **Componentes** (`componentes/`): peças reaproveitadas entre páginas (layout, cabeçalho, cartão de palestrante).
3. **Validação** (`validacao/inscricao.js`): função pura que recebe os valores do formulário e devolve os erros por campo. Não sabe nada de React.
4. **API** (`api/`): única parte que conhece a URL da API e o `fetch`. Transforma as respostas de erro em exceções com a mensagem pronta para exibir.

O `App` monta as rotas **sem** o `BrowserRouter`. Quem envolve o `App` no `BrowserRouter` é o `main.jsx`. Nos testes, o `App` é envolvido num `MemoryRouter`, o que permite abrir qualquer rota sem navegador (DT-02).

### Estrutura de arquivos criada por esta feature

```
frontend/
├── .gitignore                     # node_modules/ e dist/
├── package.json                   # "type": "module", scripts dev/build/test
├── vite.config.js                 # porta 5173 fixa + configuração do Vitest (jsdom)
├── index.html                     # lang="pt-BR", título do evento
├── src/
│   ├── main.jsx                   # BrowserRouter + App + estilos globais
│   ├── App.jsx                    # tabela de rotas
│   ├── api/
│   │   ├── erros.js               # ErroDaApi, ErroDeConexao, MENSAGEM_SEM_CONEXAO
│   │   └── inscricoes.js          # listarInscricoes, criarInscricao, removerInscricao
│   ├── dados/
│   │   └── evento.js              # nome, data, local, descrição, palestrantes
│   ├── validacao/
│   │   └── inscricao.js           # validarFormulario(valores)
│   ├── componentes/
│   │   ├── Layout.jsx             # Cabecalho + <Outlet />
│   │   ├── Cabecalho.jsx          # nome do evento + links para as 3 telas
│   │   └── CartaoPalestrante.jsx  # iniciais, nome, cargo/empresa, tema
│   ├── paginas/
│   │   ├── Evento.jsx
│   │   ├── Inscricao.jsx
│   │   ├── Inscritos.jsx
│   │   └── NaoEncontrada.jsx
│   └── estilos/
│       ├── global.css             # variáveis, base, layout, cabeçalho, botões, mensagens
│       ├── evento.css
│       ├── inscricao.css
│       └── inscritos.css
└── tests/
    ├── setup.js                   # jest-dom e limpeza entre testes
    ├── renderizar.jsx             # helper: renderiza <App /> num MemoryRouter na rota pedida
    ├── navegacao.test.jsx
    ├── evento.test.jsx
    ├── validacao.test.js
    ├── api.test.js
    ├── inscricao.test.jsx
    └── inscritos.test.jsx
```

Nenhum arquivo do `backend/` é alterado.

## Contratos da API

Não se define contrato novo: o front consome exatamente os contratos aprovados em `specs/01-api-inscricoes/design.md`. Resumo do que é usado:

- **URL base:** `import.meta.env.VITE_API_URL` ou, se não definida, `http://localhost:3001` (REQ-FE-29).
- **CORS:** a API só libera `http://localhost:5173`, por isso a porta do front é fixa (REQ-FE-30, REQ-BE-19).
- **Formato de erro (D-10 da feature 01):** validação → `{ "erro": "Dados inválidos", "campos": { "<campo>": "<mensagem>" } }`; demais → `{ "erro": "<mensagem>" }`.

| Função da camada de API      | Chamada                     | Sucesso                         | Erros tratados pelo front                                                                                          | Requisitos                                  |
| ---------------------------- | --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `listarInscricoes()`         | `GET /inscricoes`           | `200` → array de `Inscricao`    | qualquer status ≠ 2xx; falha de conexão                                                                            | REQ-FE-20, REQ-FE-22 a REQ-FE-24            |
| `criarInscricao(dados)`      | `POST /inscricoes` (JSON)   | `201` → `Inscricao` criada      | `400` com `campos`; `400` "E-mail já cadastrado"; outros status; falha de conexão                                   | REQ-FE-14 a REQ-FE-19                       |
| `removerInscricao(id)`       | `DELETE /inscricoes/:id`    | `204` → sem corpo               | `404` "Inscrição não encontrada"; outros status; falha de conexão                                                  | REQ-FE-26 a REQ-FE-28                       |

### Como a camada de API devolve os erros (DT-04)

| Situação                                           | O que a função faz                                                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `fetch` rejeita (API desligada, rede)              | lança `ErroDeConexao`, com `message` = `MENSAGEM_SEM_CONEXAO`                                          |
| resposta com status fora de 2xx e corpo JSON       | lança `ErroDaApi` com `status`, `message` = `corpo.erro` e `campos` = `corpo.campos` (ou `undefined`)  |
| resposta com status fora de 2xx e corpo não-JSON   | lança `ErroDaApi` com `status` e `message` = `"Erro inesperado do servidor"`                           |

`MENSAGEM_SEM_CONEXAO` = `"Não foi possível conectar ao servidor. Verifique se a API está rodando."` (REQ-FE-19, D-19).

Exemplo de corpo enviado por `criarInscricao` (REQ-FE-14):

```json
{ "nome": "Maria Silva", "email": "maria@email.com", "telefone": "", "tipoIngresso": "estudante" }
```

Os valores vão como foram digitados: a API já remove espaços, põe o e-mail em minúsculas e formata o telefone (REQ-BE-05, REQ-BE-23). Telefone em branco vai como `""`.

## Modelo de dados

O front não guarda dados de forma persistente. Ele trabalha com três formas:

### `Inscricao` (vem da API)

Igual ao modelo da feature 01: `{ id: number, nome: string, email: string, telefone: string, tipoIngresso: "estudante" | "profissional" }`. O `telefone` já vem formatado ou como `""`.

### Valores do formulário (estado de `Inscricao.jsx`)

```js
{ nome: '', email: '', telefone: '', tipoIngresso: '' }   // tipoIngresso '' = nenhuma opção marcada (REQ-FE-08)
```

### Conteúdo do evento (`dados/evento.js`, REQ-FE-04, REQ-FE-05, D-01, D-02)

Dados fictícios, fixos no front:

```js
export const evento = {
  nome: 'Conecta Tech 2027',
  data: 'Sábado, 15 de maio de 2027, das 9h às 18h',
  local: 'Centro de eventos, Concórdia (SC)',
  descricao: 'Um dia inteiro de palestras sobre desenvolvimento web, dados, inteligência artificial e segurança, feito para estudantes e profissionais que querem aprender com quem está construindo tecnologia no dia a dia.',
  palestrantes: [
    { nome: 'Ana Ribeiro',     cargo: 'Engenheira de Software Sênior', empresa: 'Nuvem Austral',  tema: 'Arquiteturas que crescem sem dor' },
    { nome: 'Carlos Mendes',   cargo: 'Tech Lead',                     empresa: 'Ponto Pixel',    tema: 'React além do básico' },
    { nome: 'Juliana Costa',   cargo: 'Cientista de Dados',            empresa: 'Dados em Rede',  tema: 'IA no dia a dia de quem programa' },
    { nome: 'Rafael Oliveira', cargo: 'Especialista em Segurança',     empresa: 'Cofre Digital',  tema: 'Segurança desde a primeira linha de código' },
  ],
};
```

As **iniciais** do círculo são a primeira letra do primeiro e do último nome, em maiúsculas (`Ana Ribeiro` → `AR`; um nome só → uma letra).

### Regras de validação do formulário (`validarFormulario`, REQ-FE-09 a REQ-FE-12, D-06)

Espelham as regras da API (mesmas expressões regulares da feature 01). Devolvem um objeto `{ <campo>: <mensagem> }` com **todos** os campos inválidos; objeto vazio significa válido.

| Campo          | Regra (aplicada depois de `trim()`)                                                                | Mensagem                                         | Requisito  |
| -------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------- |
| `nome`         | não pode ficar vazio                                                                               | `O nome é obrigatório`                           | REQ-FE-09  |
| `email`        | não pode ficar vazio                                                                               | `O e-mail é obrigatório`                         | REQ-FE-09  |
| `email`        | se preenchido, deve casar com `^[^\s@]+@[^\s@]+\.[^\s@]+$`                                          | `Informe um e-mail válido`                       | REQ-FE-10  |
| `telefone`     | se preenchido, deve casar com `^[\d\s()-]+$` e ter 10 ou 11 dígitos                                | `Informe um telefone com DDD (10 ou 11 dígitos)` | REQ-FE-11  |
| `tipoIngresso` | deve ser `estudante` ou `profissional`                                                             | `Escolha o tipo de ingresso`                     | REQ-FE-09  |

As mensagens de nome, e-mail e telefone são as mesmas da API, para a pessoa ver o mesmo texto venha o erro do front ou do servidor.

## Componentes e rotas do frontend

### Rotas (React Router, REQ-FE-01)

Todas as rotas ficam dentro de uma rota de layout, que renderiza o cabeçalho e a página da vez (`<Outlet />`).

| Caminho      | Componente      | Requisitos                                      |
| ------------ | --------------- | ----------------------------------------------- |
| `/`          | `Evento`        | REQ-FE-04, REQ-FE-05, REQ-FE-06, REQ-FE-31      |
| `/inscricao` | `Inscricao`     | REQ-FE-07 a REQ-FE-19, REQ-FE-32                |
| `/inscritos` | `Inscritos`     | REQ-FE-20 a REQ-FE-28, REQ-FE-32                |
| `*`          | `NaoEncontrada` | REQ-FE-03                                       |

### Árvore de componentes

```
App
└── Layout
    ├── Cabecalho          links: "Evento" (/), "Inscrição" (/inscricao), "Inscritos" (/inscritos)
    └── <Outlet />
        ├── Evento         hero (nome, data, local, descrição, botão "Inscreva-se") + grade de CartaoPalestrante
        ├── Inscricao      formulário + mensagens
        ├── Inscritos      contador + tabela + mensagens
        └── NaoEncontrada  "Página não encontrada" + link "Voltar para o início"
```

| Componente          | Responsabilidade                                                                                                    | Requisitos                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `Layout`            | Renderiza o `Cabecalho` e a página da rota atual, para o cabeçalho aparecer em todas as telas.                       | REQ-FE-02                     |
| `Cabecalho`         | Nome do evento e três `NavLink`s; o link da tela atual recebe destaque visual.                                       | REQ-FE-01, REQ-FE-02          |
| `Evento`            | Mostra os dados de `dados/evento.js`. O botão "Inscreva-se" é um `Link` para `/inscricao`.                            | REQ-FE-04 a REQ-FE-06         |
| `CartaoPalestrante` | Círculo com as iniciais, nome, "cargo · empresa" e tema.                                                             | REQ-FE-05                     |
| `Inscricao`         | Formulário controlado, validação no envio, chamada à API e exibição de sucesso e erros.                               | REQ-FE-07 a REQ-FE-19         |
| `Inscritos`         | Carrega a lista ao abrir, exibe estados, exclui com confirmação.                                                      | REQ-FE-20 a REQ-FE-28         |
| `NaoEncontrada`     | Mensagem e `Link` para `/`.                                                                                          | REQ-FE-03                     |

### Tela de inscrição (`Inscricao.jsx`)

**Estado:**

| Estado        | Valor inicial      | Uso                                                                  |
| ------------- | ------------------ | -------------------------------------------------------------------- |
| `valores`     | todos `''`         | campos do formulário                                                 |
| `erros`       | `{}`               | mensagens por campo (do front ou da API)                             |
| `erroGeral`   | `''`               | mensagem acima do botão (REQ-FE-18, REQ-FE-19)                       |
| `enviando`    | `false`            | desabilita o botão e troca o texto (REQ-FE-14)                       |
| `inscritoComo`| `''`               | nome exibido na mensagem de sucesso (REQ-FE-15)                      |

**Campos (REQ-FE-07, REQ-FE-08):**

- `nome`: `<input type="text">`, rótulo "Nome".
- `email`: `<input type="email">`, rótulo "E-mail". O `<form noValidate>` desliga a validação nativa do navegador, para valerem só as mensagens em português de REQ-FE-09 a REQ-FE-11.
- `telefone`: `<input type="tel">`, rótulo "Telefone (opcional)", `placeholder="(11) 99999-9999"`, sem máscara (D-09).
- `tipoIngresso`: `<fieldset>` com `<legend>` "Tipo de ingresso" e dois `<input type="radio" name="tipoIngresso">`, valores `estudante` e `profissional`, rótulos "Estudante" e "Profissional", nenhum marcado no início.
- Cada mensagem de erro fica logo abaixo do seu campo, ligada a ele por `aria-describedby`, e o campo recebe `aria-invalid="true"`.

**Fluxo de envio:**

1. Ao enviar, limpa `erroGeral` e `inscritoComo` e roda `validarFormulario(valores)`. Se houver erros, guarda em `erros` e **não** chama a API (REQ-FE-09 a REQ-FE-12).
2. Se não houver erros, liga `enviando` (botão desabilitado, texto "Enviando…") e chama `criarInscricao(valores)` (REQ-FE-14).
3. **Sucesso (`201`):** guarda `inscritoComo` com o `nome` devolvido pela API, volta `valores` ao estado inicial e limpa `erros`. A mensagem exibida é "Inscrição confirmada, {nome}!" com o link "Ver inscritos" para `/inscritos` (REQ-FE-15).
4. **`ErroDaApi` com `campos`:** `erros = campos` (REQ-FE-16).
5. **`ErroDaApi` com `status` 400 e mensagem `E-mail já cadastrado`:** `erros = { email: mensagem }` (REQ-FE-17, DT-07).
6. **Outra `ErroDaApi`:** `erroGeral = mensagem` (REQ-FE-18).
7. **`ErroDeConexao`:** `erroGeral = MENSAGEM_SEM_CONEXAO` (REQ-FE-19).
8. Em todos os casos de erro, `valores` não muda. No fim, desliga `enviando`.

**Ao alterar um campo:** atualiza `valores` e remove a chave desse campo de `erros` (REQ-FE-13). Os outros erros continuam.

O botão de envio tem o texto "Enviar inscrição" (ou "Enviando…" durante o envio). A mensagem de sucesso usa `role="status"` e a área de erro geral usa `role="alert"`.

### Tela de inscritos (`Inscritos.jsx`)

**Estado:**

| Estado         | Valor inicial    | Uso                                                                   |
| -------------- | ---------------- | --------------------------------------------------------------------- |
| `situacao`     | `'carregando'`   | `'carregando'` \| `'erro'` \| `'pronto'` (REQ-FE-22 a REQ-FE-24)      |
| `inscricoes`   | `[]`             | lista exibida                                                         |
| `erroCarregar` | `''`             | mensagem da falha ao carregar                                         |
| `aviso`        | `''`             | aviso de inscrição já excluída (REQ-FE-27)                            |
| `erroExcluir`  | `''`             | mensagem de falha na exclusão (REQ-FE-28)                             |

**Carregamento** (`carregar()`, chamado num `useEffect` ao abrir e pelo botão "Tentar de novo"):

- Põe `situacao = 'carregando'` e exibe "Carregando inscrições…" (REQ-FE-22).
- Sucesso: guarda a lista na ordem recebida e põe `situacao = 'pronto'` (REQ-FE-20).
- Falha: `situacao = 'erro'`; `erroCarregar` = `MENSAGEM_SEM_CONEXAO` se for `ErroDeConexao`, ou `"Não foi possível carregar as inscrições."` nos demais casos. Exibe a mensagem e o botão "Tentar de novo" (REQ-FE-24).

**Exibição com `situacao = 'pronto'`:**

- Lista vazia: "Nenhuma inscrição ainda" e o link "Inscreva-se" para `/inscricao` (REQ-FE-23). O contador não aparece.
- Lista com itens: contador "1 inscrito" ou "N inscritos" (REQ-FE-21) e uma `<table>` com as colunas Nome, E-mail, Telefone, Tipo de ingresso e uma coluna de ações com o botão "Excluir" (REQ-FE-20).
  - Tipo: `estudante` → "Estudante", `profissional` → "Profissional".
  - Telefone `""` → "—".

**Exclusão** (`excluir(inscricao)`):

1. Limpa `aviso` e `erroExcluir`.
2. `window.confirm("Excluir a inscrição de {nome}?")`. Se cancelar, para aqui (REQ-FE-25).
3. Chama `removerInscricao(id)`.
   - Sucesso: remove o item de `inscricoes`; o contador é derivado do tamanho da lista e se atualiza junto (REQ-FE-26).
   - `ErroDaApi` com `status` 404: remove o item e põe `aviso = "Essa inscrição já tinha sido excluída."` (REQ-FE-27).
   - Outros erros: `erroExcluir` = `MENSAGEM_SEM_CONEXAO` se for `ErroDeConexao`, ou `"Não foi possível excluir a inscrição. Tente de novo."`; a lista não muda (REQ-FE-28).

Se a lista ficar vazia depois de uma exclusão, a tela passa a mostrar o estado de lista vazia (REQ-FE-23).

### Responsividade (REQ-FE-31, REQ-FE-32, D-03)

Abordagem **mobile-first** em CSS puro (DT-03): os estilos base valem para 360px, e media queries de largura mínima ampliam o layout.

| Largura      | Cabeçalho                                  | Tela do evento                                        | Inscrição               | Inscritos                                  |
| ------------ | ------------------------------------------ | ----------------------------------------------------- | ----------------------- | ------------------------------------------ |
| base (≥360px)| nome em cima, links embaixo, quebrando linha | hero em coluna; palestrantes em 1 coluna             | formulário em largura total | tabela dentro de um contêiner com `overflow-x: auto` |
| ≥ 640px      | nome à esquerda, links à direita           | palestrantes em 2 colunas                             | formulário com `max-width: 560px`, centralizado | —                    |
| ≥ 960px      | —                                          | palestrantes em 4 colunas; título maior              | —                       | —                                          |

Outros cuidados: conteúdo num contêiner de até `1080px` com `16px` de margem lateral, `box-sizing: border-box` global, textos longos (como e-mails) com `overflow-wrap: anywhere` fora da tabela e `<meta name="viewport">` no `index.html`. Sem fontes externas: pilha de fontes do sistema.

## Decisões técnicas

### DT-01: Vite + React em JavaScript
- **Contexto:** o CLAUDE.md fixa React + Vite; falta escolher a linguagem.
- **Opções consideradas:** (a) JavaScript; (b) TypeScript.
- **Decisão:** (a) JavaScript com JSX, ESM (`"type": "module"`), nas versões estáveis atuais de React, Vite e React Router no momento do scaffolding.
- **Justificativa:** igual ao backend, sem etapa de tipos para aprender, e o projeto é pequeno.
- **Consequências:** sem checagem de tipos; os testes cobrem os contratos.
- **Requisitos relacionados:** todos.

### DT-02: React Router no modo declarativo, com rota de layout
- **Contexto:** 3 telas, cabeçalho comum e página de rota inexistente.
- **Opções consideradas:** (a) `BrowserRouter` + `<Routes>`; (b) `createBrowserRouter` com loaders (modo de dados).
- **Decisão:** (a). Uma rota de layout (`Layout` com `<Outlet />`) envolve as 4 rotas; `path="*"` atende a rota inexistente. O `BrowserRouter` fica no `main.jsx`, e os testes usam `MemoryRouter`.
- **Justificativa:** é o modo mais simples, e os carregamentos são poucos e cabem num `useEffect`. Separar o router do `App` permite testar qualquer rota.
- **Requisitos relacionados:** REQ-FE-01, REQ-FE-02, REQ-FE-03, REQ-FE-06.

### DT-03: CSS puro com variáveis, mobile-first
- **Contexto:** a estilização é livre no enunciado.
- **Opções consideradas:** (a) CSS puro; (b) CSS Modules; (c) Tailwind.
- **Decisão:** (a), escolhida pela usuária. Um `global.css` com variáveis (`:root`: cores, espaçamentos, raio) e estilos comuns, e um arquivo por tela, importado pela própria página. Classes com prefixo da tela (ex: `.evento-hero`, `.inscritos-tabela`) para não colidirem.
- **Justificativa:** nenhuma dependência extra e é o mais fácil de ler e alterar.
- **Consequências:** a organização dos nomes de classe depende da convenção de prefixos.
- **Requisitos relacionados:** REQ-FE-31, REQ-FE-32.

### DT-04: `fetch` nativo com erros tipados
- **Contexto:** 3 chamadas HTTP e vários tipos de erro a distinguir.
- **Opções consideradas:** (a) `fetch` nativo; (b) `axios`.
- **Decisão:** (a). As funções de `api/inscricoes.js` lançam `ErroDaApi` (`status`, `message`, `campos`) ou `ErroDeConexao`, definidos em `api/erros.js`.
- **Justificativa:** sem dependência extra. As páginas só olham para o tipo do erro, sem lidar com `Response` nem com JSON.
- **Consequências:** as classes de erro ficam num módulo separado, para que os testes de página possam simular a API sem perder as classes reais (DT-10).
- **Requisitos relacionados:** REQ-FE-14 a REQ-FE-20, REQ-FE-24, REQ-FE-26 a REQ-FE-28.

### DT-05: Estado local nas páginas
- **Contexto:** cada tela tem estado próprio; nada é compartilhado entre telas.
- **Opções consideradas:** (a) `useState`/`useEffect`; (b) Context; (c) React Query / Redux.
- **Decisão:** (a).
- **Justificativa:** a tela de inscritos busca a lista ao abrir, então sempre mostra os dados atuais, mesmo depois de uma inscrição nova. Não há o que compartilhar.
- **Requisitos relacionados:** REQ-FE-13 a REQ-FE-28.

### DT-06: Validação própria espelhando a API
- **Contexto:** o front repete as regras da API (D-06).
- **Opções consideradas:** (a) função própria; (b) biblioteca de formulários (`react-hook-form`, `zod`).
- **Decisão:** (a) `validarFormulario(valores)` em `validacao/inscricao.js`, com as mesmas expressões regulares da feature 01.
- **Justificativa:** mesmo motivo de DT-03 da feature 01: poucas regras e mensagens em português sob controle.
- **Consequências:** as regras existem em dois lugares (front e back). Se uma mudar, a outra precisa mudar junto; o servidor continua sendo a validação final.
- **Requisitos relacionados:** REQ-FE-09 a REQ-FE-12.

### DT-07: Reconhecer o e-mail duplicado pela mensagem
- **Contexto:** a API responde `400` com `{ "erro": "E-mail já cadastrado" }`, sem `campos` (REQ-BE-06), mas o front deve mostrar o erro junto ao e-mail (REQ-FE-17).
- **Opções consideradas:** (a) comparar a mensagem com o texto do contrato; (b) mudar a API para devolver `campos.email`.
- **Decisão:** (a), com o texto numa constante.
- **Justificativa:** o contrato da feature 01 já foi aprovado e revisado; mudá-lo reabriria a feature 01 por um ganho pequeno.
- **Consequências:** se a mensagem da API mudar, o erro passa a aparecer na área geral (ainda visível, só em outro lugar). O teste de REQ-FE-17 usa o texto exato do contrato.
- **Requisitos relacionados:** REQ-FE-17.

### DT-08: Confirmação com `window.confirm`
- **Contexto:** pedir confirmação antes de excluir (D-14).
- **Opções consideradas:** (a) `window.confirm`; (b) modal próprio.
- **Decisão:** (a).
- **Justificativa:** é o que foi decidido em D-14, já é acessível e não exige componente novo. Nos testes, `window.confirm` é simulado com `vi.spyOn`.
- **Requisitos relacionados:** REQ-FE-25.

### DT-09: Porta fixa e URL da API configurável
- **Decisão:** no `vite.config.js`, `server: { port: 5173, strictPort: true }`. Em `api/inscricoes.js`, `const URL_DA_API = import.meta.env.VITE_API_URL || 'http://localhost:3001'`.
- **Justificativa:** D-17 e D-18. Com `strictPort`, o Vite para com erro se a 5173 estiver ocupada, em vez de subir numa porta que a API não aceita.
- **Requisitos relacionados:** REQ-FE-29, REQ-FE-30.

### DT-10: Testes com o módulo de API simulado
- **Contexto:** o CLAUDE.md exige chamadas à API mockadas nos testes de front.
- **Opções consideradas:** (a) `vi.mock` do módulo `api/inscricoes.js`; (b) simular o `fetch` em todos os testes; (c) MSW.
- **Decisão:** (a) nos testes de página e (b) só em `api.test.js`, que testa a própria camada de API.
- **Justificativa:** os testes de página ficam curtos e focados no comportamento da tela; a tradução de respostas HTTP em erros é testada uma vez, no lugar certo. Sem dependência extra.
- **Requisitos relacionados:** todos os automáticos.

### Dependências

| Pacote                        | Tipo | Uso                                       |
| ----------------------------- | ---- | ----------------------------------------- |
| `react`, `react-dom`          | prod | interface                                 |
| `react-router`                | prod | rotas                                     |
| `vite`, `@vitejs/plugin-react`| dev  | servidor de desenvolvimento e build       |
| `vitest`                      | dev  | testes (mesma versão principal do backend)|
| `jsdom`                       | dev  | DOM nos testes                            |
| `@testing-library/react`      | dev  | renderização nos testes                   |
| `@testing-library/user-event` | dev  | simular digitação e cliques               |
| `@testing-library/jest-dom`   | dev  | asserções como `toBeInTheDocument`        |

Scripts: `npm run dev` → `vite`; `npm run build` → `vite build`; `npm test` → `vitest run`.

## Estratégia de testes

- **Ferramentas:** Vitest + React Testing Library + `user-event` + `jest-dom`, ambiente `jsdom` (configurado no `vite.config.js`, com `tests/setup.js`).
- **Nível:** testes de componente pela interface, como a pessoa usaria: encontrar campos pelo rótulo, digitar, clicar e conferir o texto na tela. As páginas são renderizadas pelo `App` dentro de um `MemoryRouter` (helper `renderizar(caminho)`), para cobrir também as rotas.
- **Isolamento:** `vi.mock('../src/api/inscricoes.js')` nos testes de página, com `vi.resetAllMocks()` no `beforeEach`; o RTL limpa o DOM depois de cada teste (`setup.js`).
- **Nome dos testes:** sempre começa com o ID do requisito (CLAUDE.md, seção 6).
- **Cobertura mínima do CLAUDE.md:** formulário (validação, envio, erro da API) em `inscricao.test.jsx`; lista (renderização e exclusão) em `inscritos.test.jsx`.

### Mapa requisito → teste previsto

| Requisito | Arquivo               | Teste previsto                                                                                                           |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| REQ-FE-01 | `navegacao.test.jsx`  | cada caminho (`/`, `/inscricao`, `/inscritos`) mostra a sua tela; clicar nos links do cabeçalho troca de tela             |
| REQ-FE-02 | `navegacao.test.jsx`  | o cabeçalho com os 3 links aparece nas 3 telas                                                                            |
| REQ-FE-03 | `navegacao.test.jsx`  | caminho desconhecido mostra "Página não encontrada"; o link volta para a tela do evento                                    |
| REQ-FE-04 | `evento.test.jsx`     | mostra nome, data, local e descrição de `dados/evento.js`                                                                 |
| REQ-FE-05 | `evento.test.jsx`     | mostra cada palestrante com nome, cargo/empresa, tema e iniciais                                                          |
| REQ-FE-06 | `evento.test.jsx`     | clicar em "Inscreva-se" leva ao formulário de inscrição                                                                   |
| REQ-FE-07 | `inscricao.test.jsx`  | campos encontrados pelos rótulos; telefone marcado como opcional, com o exemplo `(11) 99999-9999`                          |
| REQ-FE-08 | `inscricao.test.jsx`  | duas opções "Estudante" e "Profissional", nenhuma marcada; marcar uma desmarca a outra                                     |
| REQ-FE-09 | `validacao.test.js`, `inscricao.test.jsx` | obrigatórios vazios ou só espaços geram mensagem; no formulário, a mensagem aparece e a API não é chamada |
| REQ-FE-10 | `validacao.test.js`, `inscricao.test.jsx` | e-mails fora do formato geram "Informe um e-mail válido"; a API não é chamada                       |
| REQ-FE-11 | `validacao.test.js`, `inscricao.test.jsx` | telefones com letras, símbolos ou quantidade errada de dígitos geram mensagem; vazio é aceito       |
| REQ-FE-12 | `inscricao.test.jsx`  | enviar o formulário vazio mostra as 3 mensagens de uma vez                                                                |
| REQ-FE-13 | `inscricao.test.jsx`  | digitar no campo com erro remove só a mensagem dele                                                                       |
| REQ-FE-14 | `inscricao.test.jsx`  | dados válidos chamam `criarInscricao` com os 4 campos; durante a espera, o botão está desabilitado com "Enviando…"         |
| REQ-FE-15 | `inscricao.test.jsx`  | após o sucesso, mostra "Inscrição confirmada, Maria Silva!", o link para inscritos e o formulário limpo                     |
| REQ-FE-16 | `inscricao.test.jsx`  | `ErroDaApi` com `campos` mostra cada mensagem junto ao campo e mantém os valores                                          |
| REQ-FE-17 | `inscricao.test.jsx`  | "E-mail já cadastrado" aparece junto ao campo e-mail e os valores ficam                                                   |
| REQ-FE-18 | `inscricao.test.jsx`  | outro `ErroDaApi` mostra a mensagem na área geral e os valores ficam                                                      |
| REQ-FE-19 | `inscricao.test.jsx`, `api.test.js` | `ErroDeConexao` mostra a mensagem de conexão; a camada de API lança `ErroDeConexao` quando o `fetch` rejeita |
| REQ-FE-20 | `inscritos.test.jsx`, `api.test.js` | tabela com os dados na ordem recebida, "Estudante"/"Profissional" e "—" para telefone vazio; `listarInscricoes` chama `GET /inscricoes` |
| REQ-FE-21 | `inscritos.test.jsx`  | mostra "2 inscritos" e "1 inscrito"                                                                                       |
| REQ-FE-22 | `inscritos.test.jsx`  | mostra "Carregando inscrições…" enquanto a promessa não resolve                                                           |
| REQ-FE-23 | `inscritos.test.jsx`  | lista vazia mostra "Nenhuma inscrição ainda" e o link para a inscrição                                                    |
| REQ-FE-24 | `inscritos.test.jsx`  | falha ao carregar mostra o erro e "Tentar de novo"; clicar busca de novo e mostra a lista                                  |
| REQ-FE-25 | `inscritos.test.jsx`  | "Excluir" pede confirmação com o nome; cancelar não chama `removerInscricao` nem muda a tabela                             |
| REQ-FE-26 | `inscritos.test.jsx`, `api.test.js` | confirmar remove a linha e atualiza o contador; `removerInscricao` chama `DELETE /inscricoes/:id`          |
| REQ-FE-27 | `inscritos.test.jsx`, `api.test.js` | `ErroDaApi` 404 remove a linha e mostra o aviso; a camada de API lança `ErroDaApi` com status e mensagem    |
| REQ-FE-28 | `inscritos.test.jsx`  | outro erro mostra a mensagem e a linha continua                                                                           |
| REQ-FE-29 | `api.test.js` + manual | **automático:** sem `VITE_API_URL`, as chamadas vão para `http://localhost:3001`. **Manual:** subir com `VITE_API_URL` definida e conferir na aba Rede do navegador |
| REQ-FE-30 | —                     | **manual:** com a porta 5173 ocupada, `npm run dev` para com erro                                                         |
| REQ-FE-31 | —                     | **manual:** ferramentas de desenvolvedor do navegador em 360px, 640px, 960px e 1280px, sem rolagem horizontal da página    |
| REQ-FE-32 | —                     | **manual:** inscrição e inscritos em 360px, com a tabela rolando dentro da própria área                                    |
| REQ-FE-33 | —                     | **manual:** percorrer as telas e estados conferindo que todos os textos estão em português                                 |

## Riscos e pontos de atenção

- **Regras duplicadas:** a validação existe no front e na API (DT-06). Se divergirem, o servidor continua barrando os dados errados, e o erro aparece pelo caminho de REQ-FE-16.
- **Mensagem de e-mail duplicado como contrato:** DT-07 depende do texto exato `E-mail já cadastrado`.
- **Porta da API:** se o backend subir em outra porta (`PORT`), o front precisa de `VITE_API_URL` apontando para ela; isso vai para o README na feature 03.
- **`window.confirm` no jsdom:** não existe uma implementação real; os testes sempre o simulam.
- **Teste visual:** a responsividade não é verificada automaticamente; depende da conferência manual de REQ-FE-31 e REQ-FE-32.
