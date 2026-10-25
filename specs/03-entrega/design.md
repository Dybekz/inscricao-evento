> **Feature:** 03-entrega
> **Documento:** design
> **Status:** aprovado
> **Aprovado em:** 2026-10-25

# Design — 03-entrega

## Visão geral e arquitetura

Esta feature não muda a arquitetura nem o código da aplicação. Ela produz um documento (o `README.md`) e um roteiro de verificação da entrega.

```
README.md  ──descreve──>  backend/ (Express :3001)  <──HTTP/JSON──  frontend/ (Vite :5173)
                                  │
Clone limpo numa pasta temporária ──segue o README──> instala, sobe, usa e testa (REQ-EN-12)
                                  │
GitHub (Dybekz/inscricao-evento, público) <──push── main local (REQ-EN-13, REQ-EN-14)
```

### Arquivos que esta feature cria ou altera

```
inscricao-evento/
└── README.md        # reescrito (hoje só tem o título)
```

Nenhum arquivo de `backend/`, `frontend/` ou das specs das features 01 e 02 é alterado (Fora de escopo; D-05).

### Estrutura do README

Versão enxuta, pensada para leitura rápida (revisão de 2026-10-25, a pedido da usuária, depois de uma prévia num branch de teste). Seções na ordem abaixo. O conteúdo sai das specs já aprovadas e do código, para que o README não contradiga a aplicação. Os comandos ficam em linhas separadas, sem `&&`, porque o PowerShell 5.1 (padrão do Windows) não aceita esse operador.

| #  | Seção        | Conteúdo                                                                                                                                                                                                                                         | Fonte do conteúdo                                   | Requisitos                       |
| -- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------------------------------- |
| 1  | Cabeçalho    | Título `# Site Inscrição de Eventos`. Parágrafo: "Site para divulgação de eventos e recebimento de inscrições. São três telas: a página do evento (com data, local, descrição e palestrantes), o formulário de inscrição e a lista de inscritos, com opção de excluir. O frontend conversa com uma API própria, que guarda as inscrições." (texto da usuária). Linha **Stack:** Node.js + Express 5 · React 19 + Vite + React Router · Vitest, Supertest e React Testing Library. | texto da usuária; `package.json` dos dois pacotes   | REQ-EN-01, REQ-EN-02             |
| 2  | Organização  | Uma frase: o projeto foi feito a partir de specs; em `specs/`, cada parte (API, telas e entrega) tem requisitos, design e tarefas, aprovados antes do código, seguindo as regras do projeto. Sem citar o nome do arquivo de regras nem ferramentas (DT-04). | D-04, D-05                                          | REQ-EN-11                        |
| 3  | Como rodar   | Pré-requisitos numa linha: Node.js 22.22+ ou 24.15+ (testado no 24.22.1), npm e Git (DT-01). Bloco de clone (`git clone https://github.com/Dybekz/inscricao-evento.git`, `cd inscricao-evento`). **Terminal 1, API** (`http://localhost:3001`): `cd backend`, `npm install`, `npm run dev`. **Terminal 2, site** (`http://localhost:5173`), com a API rodando: `cd frontend`, `npm install`, `npm run dev`. Linha de testes: `npm test` dentro de `backend/` ou `frontend/`. Nota em citação (`>`): dados em memória somem quando a API reinicia; o site precisa rodar na porta `5173`, a única liberada pelo CORS; `PORT` (padrão `3001`) muda a porta da API e `VITE_API_URL` (padrão `http://localhost:3001`) aponta o site para ela (DT-03). | DT-01; DT-07 de 01; DT-09 de 02; REQ-BE-19, REQ-BE-20, REQ-FE-29, REQ-FE-30 | REQ-EN-03, REQ-EN-04, REQ-EN-05, REQ-EN-06, REQ-EN-07, REQ-EN-08, REQ-EN-10 |
| 4  | API          | Tabela dos 3 endpoints (método, rota, descrição, status de sucesso `200`, `201`, `204`). Exemplo do modelo em JSON. Uma frase de regras: `nome`, `email` e `tipoIngresso` (`"estudante"` ou `"profissional"`) obrigatórios; `telefone` opcional; campo inválido → `400` com `{ "erro": "Dados inválidos", "campos": { ... } }`; e-mail já cadastrado → `400` com `{ "erro": "E-mail já cadastrado" }`. | Contratos de 01 (ver abaixo)                        | REQ-EN-09                        |

## Contratos da API

Não se aplica: esta feature não cria nem altera endpoints. O README **reproduz** os contratos aprovados em `specs/01-api-inscricoes/design.md`, sem redefini-los:

| Método   | Rota              | O que faz               | Sucesso | Erros citados no README                                          |
| -------- | ----------------- | ----------------------- | ------- | ---------------------------------------------------------------- |
| `GET`    | `/inscricoes`     | lista todas, em ordem de criação | `200` | —                                                         |
| `POST`   | `/inscricoes`     | cria uma inscrição      | `201`   | `400` (campos inválidos, com `campos`; e-mail já cadastrado)     |
| `DELETE` | `/inscricoes/:id` | remove uma inscrição    | `204`   | `404` (inscrição não encontrada)                                 |

Formato de erro reproduzido no README:

```json
{ "erro": "Dados inválidos", "campos": { "email": "Informe um e-mail válido" } }
```

```json
{ "erro": "E-mail já cadastrado" }
```

## Modelo de dados

Não se aplica: o modelo é o de `01-api-inscricoes`. O README mostra o exemplo do enunciado:

```json
{ "id": 1, "nome": "Maria Silva", "email": "maria@email.com", "telefone": "(11) 99999-9999", "tipoIngresso": "estudante" }
```

## Componentes e rotas do frontend

Não se aplica: nenhum componente ou rota é criado ou alterado. A responsividade da tela do evento já foi implementada e verificada em `02-frontend-telas` (REQ-FE-31); aqui ela só é reconferida na versão final (REQ-EN-16, roteiro abaixo).

## Decisões técnicas

### DT-01: Versão mínima do Node.js
- **Contexto:** D-03 pede a versão mínima exigida pelas dependências.
- **Opções consideradas:** (a) a menor versão que roda só a aplicação; (b) a menor versão que roda a aplicação **e** os testes.
- **Decisão:** (b). Os campos `engines` das dependências instaladas são: `react-router` `>=22.22.0`; `jsdom` `^22.22.2 || ^24.15.0 || >=26.0.0`; `vitest` `^22.12.0 || ^24.0.0 || >=26.0.0`; `vite` e `@vitejs/plugin-react` `^20.19.0 || >=22.12.0`; `express` `>=18`. A interseção é **Node.js 22.22.2+ na linha 22 ou 24.15+ na linha 24**. As linhas 23 e 25 ficam de fora (o `vitest` e o `jsdom` não as aceitam).
- **Justificativa:** o README manda rodar os testes (REQ-EN-07), então a versão indicada precisa servir para tudo.
- **Consequências:** o README cita as duas linhas LTS e a versão testada (24.22.1). Não se cria campo `engines` nos `package.json` (seria mudança de código, fora de escopo).
- **Requisitos relacionados:** REQ-EN-03.

### DT-02: Um único README na raiz
- **Contexto:** o enunciado pede instruções para o backend e o frontend.
- **Opções consideradas:** (a) um README na raiz; (b) um README na raiz e um em cada pacote.
- **Decisão:** (a).
- **Justificativa:** o projeto é pequeno e os passos cabem numa página; um só arquivo evita instruções duplicadas e divergentes.
- **Requisitos relacionados:** REQ-EN-01, REQ-EN-05, REQ-EN-06.

### DT-03: Variáveis de ambiente citadas, sem arquivo `.env`
- **Contexto:** REQ-EN-08 pede explicar `PORT` e `VITE_API_URL`. Quem avalia pode usar Linux, macOS ou Windows.
- **Opções consideradas:** (a) sugerir um arquivo `.env`/`.env.local`; (b) mostrar a variável na linha de comando, em bash e em PowerShell; (c) só citar as variáveis e os padrões, sem exemplos.
- **Decisão:** nenhum arquivo `.env` é sugerido. Na versão enxuta do README, as variáveis aparecem só na nota da seção "Como rodar", com o nome, para que servem e o padrão, sem exemplos de comando por shell.
- **Justificativa:** os `.gitignore` atuais não ignoram `.env`; sugerir criar um arquivo desses arriscaria um `.env` versionado, contra o REQ-EN-15. A linha de comando não deixa arquivo nenhum.
- **Requisitos relacionados:** REQ-EN-08, REQ-EN-15.

### DT-04: O que o README não cita
- **Decisão:** o README não cita o nome do arquivo de regras do projeto nem ferramentas usadas no desenvolvimento; quando precisar mencionar as regras, usa "regras do projeto". Também não traz capturas de tela (D-10) nem estrutura de pastas detalhada (D-02, opção (b)).
- **Verificação:** uma busca no `README.md`, sem diferenciar maiúsculas, pelo nome do arquivo de regras e das ferramentas usadas no desenvolvimento não encontra nada.
- **Requisitos relacionados:** REQ-EN-11.

### DT-05: Verificação do README num clone do repositório local
- **Contexto:** REQ-EN-12 pede seguir só o README num clone limpo. Clonar do GitHub exigiria publicar o README antes de verificá-lo.
- **Opções consideradas:** (a) clonar do GitHub depois do push; (b) clonar o repositório **local** (já com o README commitado) numa pasta temporária, e só depois fazer o push.
- **Decisão:** (b). O clone local tem exatamente os arquivos versionados, sem `node_modules` nem nada fora do Git, o que reproduz o que um avaliador recebe. O único passo que muda é a URL do `git clone`; o comando do README em si é conferido na verificação do repositório público (REQ-EN-13).
- **Justificativa:** um erro no README é corrigido antes de chegar ao GitHub.
- **Consequências:** o README precisa estar commitado antes da verificação. As portas `3001` e `5173` precisam estar livres (servidores de desenvolvimento do projeto original parados).
- **Requisitos relacionados:** REQ-EN-12, REQ-EN-14.

### DT-06: Divisão da verificação manual entre terminal e navegador
- **Decisão:** os passos de terminal são executados e têm as saídas registradas (clonar, instalar, subir a API e o site, rodar os testes, conferir o Git e o GitHub). A usuária faz no navegador o que exige olhar a tela: o fluxo de inscrever, ver na lista e excluir no clone (REQ-EN-12) e a conferência de responsividade com o DevTools (REQ-EN-16), como foi feito na feature 02.
- **Requisitos relacionados:** REQ-EN-12, REQ-EN-16.

## Estratégia de testes

Não há testes automatizados novos: a feature não muda código. As suítes existentes do backend e do frontend precisam continuar passando (Definição de Pronto) e são rodadas no clone limpo (REQ-EN-12). Todos os requisitos são verificados manualmente, e o resultado fica registrado no `tasks.md`.

### Mapa requisito → verificação prevista

| Requisito | Como verificar                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| REQ-EN-01 | `README.md` existe na raiz e está em português (leitura).                                                                                                                       |
| REQ-EN-02 | Leitura: cabeçalho com título, descrição e linha de stack. |
| REQ-EN-03 | Leitura: linha de pré-requisitos em "Como rodar" com as duas linhas do Node (DT-01), npm, Git e a versão testada. |
| REQ-EN-04 | Leitura: comando `git clone` com a URL exata; conferido de verdade em REQ-EN-13.                                                                                                |
| REQ-EN-05 | No clone limpo: os comandos do "Terminal 1" instalam e sobem a API; a saída mostra `API rodando em http://localhost:3001` e `GET /inscricoes` responde `200`. |
| REQ-EN-06 | No clone limpo: os comandos do "Terminal 2" instalam e sobem o site; `http://localhost:5173` responde `200`. |
| REQ-EN-07 | No clone limpo: `npm test` passa em `backend/` e em `frontend/`.                                                                                                                |
| REQ-EN-08 | Leitura: nota de "Como rodar" com as duas variáveis, os padrões e o aviso da porta `5173`; valores conferidos contra `server.js`, `vite.config.js` e `api/inscricoes.js`. |
| REQ-EN-09 | Leitura: seção API confere com os contratos de `01-api-inscricoes` (rotas, status, mensagens). |
| REQ-EN-10 | Leitura: aviso da memória presente na nota de "Como rodar". |
| REQ-EN-11 | Leitura da seção Organização e a busca do DT-04 sem resultado. |
| REQ-EN-12 | Clone limpo (DT-05) seguindo só o README: instalação, API e site no ar, suítes passando; a usuária cria uma inscrição, vê na lista e exclui pelo navegador (DT-06).             |
| REQ-EN-13 | Consulta anônima `https://api.github.com/repos/Dybekz/inscricao-evento` com `"visibility": "public"`, e `git clone` da URL do README numa pasta temporária funcionando sem login. |
| REQ-EN-14 | Depois do push: `git status -sb` mostra `main...origin/main` sem `ahead`, e `git rev-parse main` igual a `git rev-parse origin/main`.                                            |
| REQ-EN-15 | `git ls-files` sem nenhum caminho com `node_modules/`, `dist/` ou `.env`.                                                                                                       |
| REQ-EN-16 | A usuária abre a tela do evento (no clone) em 360, 640, 960 e 1280px no DevTools: palestrantes em 1, 2, 4 e 4 colunas e `document.documentElement.scrollWidth > document.documentElement.clientWidth` → `false`. |

## Riscos e pontos de atenção

- **README desatualizado em relação ao código:** cada valor citado (portas, mensagens, comandos) é conferido contra o código atual, não só contra as specs.
- **Portas ocupadas na verificação:** com o `strictPort`, o Vite do clone não sobe se a `5173` estiver em uso. Parar os servidores do projeto original antes (DT-05).
- **`.env` não ignorado:** hoje nenhum `.env` está versionado, mas os `.gitignore` não o ignoram. O DT-03 evita sugerir esses arquivos; incluir `.env` nos `.gitignore` ficaria para outra mudança, fora deste escopo.
- **Push é ação da usuária:** REQ-EN-13 e REQ-EN-14 só fecham depois de um push, que só acontece quando ela pedir.
