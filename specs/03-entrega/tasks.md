> **Feature:** 03-entrega
> **Documento:** tarefas
> **Status:** aprovado
> **Aprovado em:** 2026-10-25
> **Revisão:** pendente

# Tarefas — 03-entrega

## Tarefas

- [x] **T01: Escrever o README**
  - **Descrição:** reescrever o `README.md` da raiz com as 11 seções da tabela "Estrutura do README" do design, em português: título e descrição, tecnologias, pré-requisitos (DT-01), clonar, rodar o backend, rodar o frontend, testes, configuração (`PORT` e `VITE_API_URL`, com exemplos em bash e PowerShell, DT-03), API (3 endpoints, modelo, regras e formato de erro, copiados dos contratos de `01-api-inscricoes`), aviso de dados em memória e como o projeto foi organizado (`specs/`, chamando as regras de "regras do projeto", DT-04). Conferir cada valor citado (portas, comandos, mensagens, saída do servidor) contra o código atual: `backend/package.json`, `backend/src/server.js`, `backend/src/app.js`, `frontend/package.json`, `frontend/vite.config.js` e `frontend/src/api/inscricoes.js`.
  - **Requisitos:** REQ-EN-01, REQ-EN-02, REQ-EN-03, REQ-EN-04, REQ-EN-05, REQ-EN-06, REQ-EN-07, REQ-EN-08, REQ-EN-09, REQ-EN-10, REQ-EN-11
  - **Arquivos:** `README.md` (alterar)
  - **Critério de pronto:** o README tem as 11 seções, em português; os valores conferem com o código (mostrar a conferência); a busca do DT-04 no README não encontra nada; nenhum arquivo fora do `README.md` foi alterado (`git status`).
  - **Depende de:** —
  - **Commit sugerido:** `docs/docs - instruções para rodar o projeto`

- [x] **T02: Verificar o README num clone limpo**
  - **Descrição:** com o README commitado e as portas `3001` e `5173` livres, clonar o repositório local numa pasta temporária (DT-05) e seguir só o README: `npm install` e `npm test` em `backend/` e em `frontend/`; subir a API (`npm run dev`) e conferir a saída `API rodando em http://localhost:3001` e `GET /inscricoes` → `200`; subir o site (`npm run dev`) e conferir `http://localhost:5173` → `200`. A usuária, no navegador, cria uma inscrição, vê na lista e exclui, e confere a tela do evento no DevTools em 360, 640, 960 e 1280px (DT-06). Registrar os resultados na matriz. Se algum passo do README falhar, parar, corrigir o README e repetir a verificação. Ao final, parar os servidores e apagar a pasta temporária.
  - **Requisitos:** REQ-EN-05, REQ-EN-06, REQ-EN-07, REQ-EN-12, REQ-EN-16
  - **Arquivos:** `specs/03-entrega/tasks.md` (alterar: registro da verificação); `README.md` (alterar, só se a verificação apontar erro)
  - **Critério de pronto:** as duas suítes passam no clone; a API e o site sobem com os comandos do README; a usuária confirma o fluxo de inscrever, listar e excluir e a tela do evento com palestrantes em 1, 2, 4 e 4 colunas e sem rolagem horizontal; resultados registrados na matriz com a data.
  - **Depende de:** T01
  - **Commit sugerido:** `docs/specs - verifica o README num clone limpo`

- [x] **T03: Conferir e publicar o repositório**
  - **Descrição:** conferir que `git ls-files` não lista nenhum caminho com `node_modules/`, `dist/` ou `.env` (REQ-EN-15). Registrar o resultado na matriz e commitar. Quando a usuária pedir, fazer o push do `main`. Depois do push: conferir `git status -sb` sem `ahead` e `git rev-parse main` igual a `git rev-parse origin/main` (REQ-EN-14); consultar `https://api.github.com/repos/Dybekz/inscricao-evento` sem login e ver `"visibility": "public"`, e rodar o `git clone` exatamente como está no README numa pasta temporária, que deve funcionar sem login e trazer o `README.md` novo (REQ-EN-13, REQ-EN-04). Apagar a pasta temporária.
  - **Requisitos:** REQ-EN-04 (comando real), REQ-EN-13, REQ-EN-14, REQ-EN-15
  - **Arquivos:** `specs/03-entrega/tasks.md` (alterar: registro da verificação)
  - **Critério de pronto:** `git ls-files` sem os caminhos proibidos; depois do push, local e remoto no mesmo commit; repositório público; o clone pela URL do README funciona sem login e traz o README novo. Resultados mostrados à usuária e registrados na matriz. A igualdade entre local e remoto é conferida de novo depois do commit da revisão (`/revisar`).
  - **Depende de:** T02
  - **Commit sugerido:** `docs/specs - confere o repositório da entrega`

- [x] **T04: Enxugar o README**
  - **Descrição:** trazer para o `main` o `README.md` enxuto do branch `teste-readme` (prévia aprovada pela usuária em 2026-10-25), que segue a nova tabela "Estrutura do README" do design: cabeçalho, Organização, Como rodar e API. Conferir que os comandos de clonar, instalar, rodar e testar são idênticos aos verificados na T02 (só mudou o texto em volta), que os valores citados (portas, variáveis, status e mensagens) conferem com o código e que a busca do DT-04 não encontra nada. Depois, apagar o branch `teste-readme` no local e no GitHub.
  - **Requisitos:** REQ-EN-01, REQ-EN-02, REQ-EN-03, REQ-EN-04, REQ-EN-05, REQ-EN-06, REQ-EN-07, REQ-EN-08, REQ-EN-09, REQ-EN-10, REQ-EN-11
  - **Arquivos:** `README.md` (alterar)
  - **Critério de pronto:** o README do `main` é igual ao do `teste-readme`; os comandos batem com os da T02 (mostrar a comparação); valores conferidos; busca do DT-04 sem resultado; o branch `teste-readme` não existe mais no local nem no remoto (`git branch -a`).
  - **Depende de:** T03
  - **Commit sugerido:** `docs/docs - README enxuto`

- [ ] **T05: Corrigir a versão mínima do Node no README**
  - **Descrição:** no `README.md`, trocar "Node.js 22.22+" por "Node.js 22.22.2+" na linha de pré-requisitos, para bater com o DT-01 (o `jsdom` exige `^22.22.2` na linha 22). Lacuna encontrada na revisão de 2026-10-25.
  - **Requisitos:** REQ-EN-03
  - **Arquivos:** `README.md` (alterar)
  - **Critério de pronto:** a linha de pré-requisitos diz "Node.js 22.22.2+ ou 24.15+ (testado no 24.22.1), npm e Git"; nenhum outro trecho do README mudou (`git diff`); busca do DT-04 sem resultado.
  - **Depende de:** T04
  - **Commit sugerido:** `fix/docs - versão mínima do Node no README`

## Matriz de rastreabilidade

Todos os requisitos desta feature são de verificação manual (não há código novo). A coluna "Verificação prevista" segue o mapa do design.

| Requisito | Tarefa(s) | Verificação prevista                                                                                       | Status   |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| REQ-EN-01 | T01, T04   | `README.md` na raiz, em português                                                                           | conforme (revisão 2026-10-25); implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-02 | T01, T04   | título, descrição e linha de stack presentes                                                         | conforme (revisão 2026-10-25); implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-03 | T01, T04, T05  | pré-requisitos com Node 22.22.2+ ou 24.15+, npm, Git e a versão testada                                     | divergente na revisão de 2026-10-25: README diz "22.22+", o mínimo é 22.22.2 (DT-01); correção em T05. implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-04 | T01, T03, T04 | comando `git clone` com a URL; clone real pela URL em T03                                                   | conforme (revisão 2026-10-25); verificado em 2026-10-25: `git clone https://github.com/Dybekz/inscricao-evento.git`, copiado do README, clonou sem credenciais e trouxe o README novo (mesmo blob `60b4e85` do commit local); README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-05 | T01, T02, T04 | comandos do backend; no clone, a API sobe com a saída esperada e `GET /inscricoes` → `200`                  | conforme (revisão 2026-10-25); verificado em 2026-10-25: no clone limpo, `npm install` e `npm run dev` em `backend/` imprimiram `API rodando em http://localhost:3001` e `GET /inscricoes` → `200` (`[]`); README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-06 | T01, T02, T04 | comandos do frontend; no clone, `http://localhost:5173` → `200`                                             | conforme (revisão 2026-10-25); verificado em 2026-10-25: no clone limpo, `npm install` e `npm run dev` em `frontend/` subiram o Vite em `http://localhost:5173` → `200`; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-07 | T01, T02, T04 | comando de testes; no clone, `npm test` passa nos dois pacotes                                              | conforme (revisão 2026-10-25); verificado em 2026-10-25: no clone limpo, `npm test` passou no backend (26/26) e no frontend (50/50); README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-08 | T01, T04   | `PORT` e `VITE_API_URL` com padrões e aviso da porta `5173`, conferidos no código | conforme (revisão 2026-10-25); implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-09 | T01, T04   | endpoints, modelo, regras e formato de erro conferidos com os contratos de `01-api-inscricoes`              | conforme (revisão 2026-10-25); implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-10 | T01, T04   | aviso de dados em memória presente                                                                          | conforme (revisão 2026-10-25); implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-11 | T01, T04   | seção sobre `specs/` e busca do DT-04 sem resultado                                                         | conforme (revisão 2026-10-25); implementado; README enxuto (T04) conferido em 2026-10-25: mesmos comandos da T02, valores conferidos com o código, busca do DT-04 sem resultado |
| REQ-EN-12 | T02             | clone limpo seguindo só o README; fluxo de inscrever, listar e excluir feito pela usuária                   | conforme (revisão 2026-10-25); verificado em 2026-10-25: clone do repositório local numa pasta temporária seguindo só o README; instalação, testes, API e site ok; a usuária criou, listou e excluiu uma inscrição pelo navegador |
| REQ-EN-13 | T03             | API do GitHub sem login com `"visibility": "public"`; clone pela URL sem login                              | conforme (revisão 2026-10-25); verificado em 2026-10-25: `api.github.com/repos/Dybekz/inscricao-evento` sem login → `"visibility": "public"`, `"private": false`; clone pela URL sem credenciais funcionou |
| REQ-EN-14 | T03             | depois do push, `main` local igual a `origin/main`                                                          | conforme (revisão 2026-10-25); verificado em 2026-10-25: depois do push, `git status -sb` → `main...origin/main` sem `ahead`; `main` e `origin/main` em `6a910e1`; a API do GitHub mostra o mesmo commit no `main`. Reconferir depois do commit da revisão |
| REQ-EN-15 | T03             | `git ls-files` sem `node_modules/`, `dist/` ou `.env`                                                       | conforme (revisão 2026-10-25); verificado em 2026-10-25: `git ls-files` (53 arquivos) sem nenhum caminho com `node_modules/`, `dist/` ou `.env` |
| REQ-EN-16 | T02             | DevTools em 360, 640, 960 e 1280px: 1, 2, 4 e 4 colunas, sem rolagem horizontal                             | conforme (revisão 2026-10-25); verificado em 2026-10-25 (usuária, DevTools, no clone): palestrantes em 1, 2, 4 e 4 colunas em 360, 640, 960 e 1280px, sem rolagem horizontal |

## Registro de revisão

### 2026-10-25

- **Testes:** backend 26/26 e frontend 50/50 passando. Nenhum código de `backend/` ou `frontend/` mudou nesta feature (`git diff 88ff7a8 HEAD -- backend frontend` vazio); só `README.md` e as specs da 03.
- **Repositório:** público (`"visibility": "public"`); `main` local e `origin/main` em `8f2146c`; só o branch `main` existe (o `teste-readme` foi apagado); `git ls-files` sem `node_modules/`, `dist/` ou `.env`; nenhuma menção ao arquivo de regras ou a ferramentas no README nem nas specs da 03.
- **Requisitos:** 15 de 16 conformes. REQ-EN-16 continua valendo pela verificação da T02, já que o frontend não mudou desde então.
- **Lacuna (divergência):** REQ-EN-03 pede a versão mínima exigida pelas dependências. O README (linha 13) diz "Node.js 22.22+", mas o mínimo na linha 22 é 22.22.2 (`jsdom` `^22.22.2`, DT-01). A linha 3 da tabela "Estrutura do README" do design tinha o mesmo erro e foi corrigida. Correção do README na T05.
- **Escopo extra e convenções:** nenhum escopo extra; commits no formato do projeto; textos em português.
- **Resultado:** revisão não aprovada até a T05. Depois do commit da revisão final, reconferir REQ-EN-14 (local igual ao remoto) com o push.
