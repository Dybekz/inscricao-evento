> **Feature:** 02-frontend-telas
> **Documento:** tarefas
> **Status:** aprovado
> **Aprovado em:** 2026-10-24
> **Revisão:** aprovada

# Tarefas — 02-frontend-telas

## Tarefas

- [x] **T01: Scaffolding do frontend**
  - **Descrição:** criar a pasta `frontend/` com o `package.json` (`"type": "module"`, scripts `dev`, `build` e `test` conforme o design; dependências `react`, `react-dom` e `react-router`; de desenvolvimento `vite`, `@vitejs/plugin-react`, `vitest` na mesma versão principal do backend, `jsdom`, `@testing-library/react`, `@testing-library/user-event` e `@testing-library/jest-dom`). Criar o `vite.config.js` com o plugin do React, `server: { port: 5173, strictPort: true }` (DT-09) e o bloco `test` (ambiente `jsdom`, `setupFiles: './tests/setup.js'`, `passWithNoTests: true`). Criar o `tests/setup.js` (jest-dom e limpeza do DOM depois de cada teste), o `index.html` (`lang="pt-BR"`, `<meta name="viewport">`, título "Conecta Tech 2027"), o `.gitignore` (`node_modules/` e `dist/`) e um `src/main.jsx` mínimo, que renderiza o `App`, e um `src/App.jsx` provisório com o título do evento. Rodar `npm install`.
  - **Requisitos:** infraestrutura. Habilita todos os REQ-FE automáticos; prepara REQ-FE-30 (porta fixa), conferido em T11.
  - **Arquivos:** `frontend/package.json` (criar), `frontend/package-lock.json` (gerado), `frontend/vite.config.js` (criar), `frontend/index.html` (criar), `frontend/.gitignore` (criar), `frontend/tests/setup.js` (criar), `frontend/src/main.jsx` (criar), `frontend/src/App.jsx` (criar)
  - **Critério de pronto:** `npm install` termina sem erro; `npm test` roda o Vitest e sai com código 0; `npm run dev` sobe em `http://localhost:5173` e mostra o título do evento; `git status` não mostra `node_modules/`.
  - **Depende de:** —
  - **Commit sugerido:** `chore/frontend - estrutura inicial do frontend`

- [x] **T02: Rotas, layout, cabeçalho e página não encontrada**
  - **Descrição:** no `App.jsx`, montar as rotas do design (DT-02) dentro de uma rota de `Layout` (`Cabecalho` + `<Outlet />`): `/` → `Evento`, `/inscricao` → `Inscricao`, `/inscritos` → `Inscritos`, `*` → `NaoEncontrada`. Envolver o `App` no `BrowserRouter` no `main.jsx` e importar o `global.css` (variáveis, base, contêiner, cabeçalho mobile-first, botões e mensagens). Criar o `Cabecalho` com os três `NavLink`s ("Evento", "Inscrição", "Inscritos") e a `NaoEncontrada` com "Página não encontrada" e o link "Voltar para o início". As páginas `Evento`, `Inscricao` e `Inscritos` são criadas só com o título de cada tela, e ganham conteúdo nas próximas tarefas. Criar o helper `tests/renderizar.jsx` (renderiza o `App` num `MemoryRouter` na rota pedida) e `tests/navegacao.test.jsx`.
  - **Requisitos:** REQ-FE-01, REQ-FE-02, REQ-FE-03
  - **Arquivos:** `frontend/src/App.jsx` (alterar), `frontend/src/main.jsx` (alterar), `frontend/src/componentes/Layout.jsx` (criar), `frontend/src/componentes/Cabecalho.jsx` (criar), `frontend/src/paginas/Evento.jsx` (criar), `frontend/src/paginas/Inscricao.jsx` (criar), `frontend/src/paginas/Inscritos.jsx` (criar), `frontend/src/paginas/NaoEncontrada.jsx` (criar), `frontend/src/estilos/global.css` (criar), `frontend/tests/renderizar.jsx` (criar), `frontend/tests/navegacao.test.jsx` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-01: ..." (cada caminho mostra sua tela e os links do cabeçalho trocam de tela), "REQ-FE-02: ..." (cabeçalho nas 3 telas) e "REQ-FE-03: ..." (caminho desconhecido mostra "Página não encontrada" e o link volta ao evento). No navegador, os links do cabeçalho trocam de tela sem recarregar.
  - **Depende de:** T01
  - **Commit sugerido:** `feat/frontend - rotas e cabeçalho`

- [x] **T03: Tela do evento**
  - **Descrição:** criar `dados/evento.js` com o conteúdo do design, o `CartaoPalestrante` (círculo com as iniciais, nome, "cargo · empresa" e tema) e completar a página `Evento`: hero com nome, data, local, descrição e o botão "Inscreva-se" (`Link` para `/inscricao`), seguido da grade de palestrantes. Criar o `evento.css` mobile-first (palestrantes em 1, 2 e 4 colunas em base, ≥640px e ≥960px), conforme a seção de responsividade do design. Criar `tests/evento.test.jsx`.
  - **Requisitos:** REQ-FE-04, REQ-FE-05, REQ-FE-06, REQ-FE-31 (implementação; verificação em T11)
  - **Arquivos:** `frontend/src/dados/evento.js` (criar), `frontend/src/componentes/CartaoPalestrante.jsx` (criar), `frontend/src/paginas/Evento.jsx` (alterar), `frontend/src/estilos/evento.css` (criar), `frontend/tests/evento.test.jsx` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-04: ...", "REQ-FE-05: ..." (inclusive as iniciais) e "REQ-FE-06: ..." (o botão leva ao formulário). No navegador, a tela do evento aparece com o conteúdo e o estilo do design.
  - **Depende de:** T02
  - **Commit sugerido:** `feat/frontend - tela do evento`

- [x] **T04: Camada de acesso à API**
  - **Descrição:** criar `api/erros.js` com `ErroDaApi` (`status`, `message`, `campos`), `ErroDeConexao` e `MENSAGEM_SEM_CONEXAO`, e `api/inscricoes.js` com `listarInscricoes`, `criarInscricao` e `removerInscricao`, usando `fetch` e `URL_DA_API = import.meta.env.VITE_API_URL || 'http://localhost:3001'` (DT-04, DT-09). Seguir a tabela "Como a camada de API devolve os erros" do design. Criar `tests/api.test.js`, simulando o `fetch` com `vi.stubGlobal`.
  - **Requisitos:** REQ-FE-19 (lança `ErroDeConexao`), REQ-FE-20 (`GET /inscricoes`), REQ-FE-26 (`DELETE /inscricoes/:id`), REQ-FE-27 (lança `ErroDaApi` com status e mensagem), REQ-FE-29 (URL padrão)
  - **Arquivos:** `frontend/src/api/erros.js` (criar), `frontend/src/api/inscricoes.js` (criar), `frontend/tests/api.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-29: ..." (sem `VITE_API_URL`, as chamadas vão para `http://localhost:3001`), "REQ-FE-20: ...", "REQ-FE-26: ...", "REQ-FE-27: ..." (status ≠ 2xx vira `ErroDaApi` com `status`, `message` e `campos`; corpo não-JSON vira "Erro inesperado do servidor") e "REQ-FE-19: ..." (`fetch` rejeitado vira `ErroDeConexao`). O `POST` envia `Content-Type: application/json` e o corpo com os 4 campos.
  - **Depende de:** T01
  - **Commit sugerido:** `feat/frontend - camada de acesso à api`

- [x] **T05: Regras de validação do formulário**
  - **Descrição:** criar `validacao/inscricao.js` com `validarFormulario(valores)`, conforme a tabela "Regras de validação do formulário" do design (mesmas expressões regulares da API, todas as mensagens de uma vez, objeto vazio quando válido). Criar `tests/validacao.test.js`.
  - **Requisitos:** REQ-FE-09, REQ-FE-10, REQ-FE-11
  - **Arquivos:** `frontend/src/validacao/inscricao.js` (criar), `frontend/tests/validacao.test.js` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-09: ..." (nome e e-mail vazios ou só espaços, tipo não escolhido), "REQ-FE-10: ..." (e-mails fora do formato) e "REQ-FE-11: ..." (telefone com letras, símbolos ou quantidade errada de dígitos; telefone vazio aceito).
  - **Depende de:** T01
  - **Commit sugerido:** `feat/frontend - regras de validação do formulário`

- [x] **T06: Formulário de inscrição e validação no envio**
  - **Descrição:** completar a página `Inscricao` com o formulário controlado do design (`<form noValidate>`, campos com rótulo, telefone "(opcional)" com o exemplo `(11) 99999-9999`, tipo de ingresso em `fieldset` com dois radios sem padrão, mensagens abaixo de cada campo com `aria-describedby` e `aria-invalid`). No envio, rodar `validarFormulario` e, havendo erros, exibi-los todos sem chamar a API. Ao alterar um campo, remover só o erro dele. Nesta tarefa, o envio de dados válidos ainda não chama a API. Criar o `inscricao.css` e `tests/inscricao.test.jsx`, já com `vi.mock` da camada de API (DT-10).
  - **Requisitos:** REQ-FE-07, REQ-FE-08, REQ-FE-09, REQ-FE-10, REQ-FE-11, REQ-FE-12, REQ-FE-13, REQ-FE-32 (formulário; verificação em T11)
  - **Arquivos:** `frontend/src/paginas/Inscricao.jsx` (alterar), `frontend/src/estilos/inscricao.css` (criar), `frontend/tests/inscricao.test.jsx` (criar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-07: ...", "REQ-FE-08: ...", "REQ-FE-09: ...", "REQ-FE-10: ...", "REQ-FE-11: ..." (mensagem aparece e `criarInscricao` não é chamada), "REQ-FE-12: ..." (3 mensagens de uma vez) e "REQ-FE-13: ..." (digitar remove só a mensagem do campo).
  - **Depende de:** T02, T05
  - **Commit sugerido:** `feat/frontend - formulário de inscrição com validação`

- [x] **T07: Envio da inscrição e mensagem de sucesso**
  - **Descrição:** no envio com dados válidos, ligar `enviando` (botão desabilitado com "Enviando…"), chamar `criarInscricao(valores)` e, no sucesso, exibir "Inscrição confirmada, {nome}!" com o link "Ver inscritos" e limpar o formulário (passos 1 a 3 do fluxo de envio do design).
  - **Requisitos:** REQ-FE-14, REQ-FE-15
  - **Arquivos:** `frontend/src/paginas/Inscricao.jsx` (alterar), `frontend/tests/inscricao.test.jsx` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-14: ..." (chama `criarInscricao` com os 4 campos; botão desabilitado com "Enviando…" enquanto a promessa não resolve) e "REQ-FE-15: ..." (mensagem com o nome, link para `/inscritos` e campos vazios).
  - **Depende de:** T04, T06
  - **Commit sugerido:** `feat/frontend - envia a inscrição`

- [x] **T08: Erros da API no formulário**
  - **Descrição:** tratar os erros de `criarInscricao` conforme os passos 4 a 8 do fluxo de envio do design: `campos` junto aos campos, "E-mail já cadastrado" junto ao e-mail (DT-07, texto numa constante), outros `ErroDaApi` e `ErroDeConexao` na área geral acima do botão (`role="alert"`), sempre mantendo os valores digitados.
  - **Requisitos:** REQ-FE-16, REQ-FE-17, REQ-FE-18, REQ-FE-19
  - **Arquivos:** `frontend/src/paginas/Inscricao.jsx` (alterar), `frontend/tests/inscricao.test.jsx` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-16: ...", "REQ-FE-17: ...", "REQ-FE-18: ..." e "REQ-FE-19: ...", cada um conferindo que os valores digitados continuam nos campos.
  - **Depende de:** T07
  - **Commit sugerido:** `feat/frontend - mostra os erros da api no formulário`

- [x] **T09: Lista de inscritos e estados da tela**
  - **Descrição:** completar a página `Inscritos` com o carregamento ao abrir (`carregar()` num `useEffect`), os estados "Carregando inscrições…", lista vazia (com link "Inscreva-se") e falha (mensagem e "Tentar de novo"), o contador ("1 inscrito" / "N inscritos") e a tabela com Nome, E-mail, Telefone, Tipo de ingresso e a coluna de ações com o botão "Excluir" (ainda sem ação). Tipo exibido como "Estudante"/"Profissional" e telefone vazio como "—". Criar o `inscritos.css` (tabela num contêiner com `overflow-x: auto`) e `tests/inscritos.test.jsx`, com `vi.mock` da camada de API. Simular a camada de API também em `tests/navegacao.test.jsx` (`listarInscricoes` devolvendo `[]`), já que a tela de inscritos passa a buscar a lista ao abrir.
  - **Requisitos:** REQ-FE-20, REQ-FE-21, REQ-FE-22, REQ-FE-23, REQ-FE-24, REQ-FE-32 (tabela; verificação em T11)
  - **Arquivos:** `frontend/src/paginas/Inscritos.jsx` (alterar), `frontend/src/estilos/inscritos.css` (criar), `frontend/tests/inscritos.test.jsx` (criar), `frontend/tests/navegacao.test.jsx` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-20: ...", "REQ-FE-21: ...", "REQ-FE-22: ...", "REQ-FE-23: ..." e "REQ-FE-24: ..." (clicar em "Tentar de novo" busca de novo e mostra a lista).
  - **Depende de:** T02, T04
  - **Commit sugerido:** `feat/frontend - lista os inscritos`

- [x] **T10: Exclusão de inscrito**
  - **Descrição:** ligar o botão "Excluir" ao fluxo de exclusão do design: limpar aviso e erro anteriores, `window.confirm("Excluir a inscrição de {nome}?")`, chamar `removerInscricao(id)` e tratar sucesso (remove a linha), `404` (remove e avisa "Essa inscrição já tinha sido excluída.") e outros erros (mensagem, lista inalterada). Se a lista ficar vazia, mostrar o estado de lista vazia.
  - **Requisitos:** REQ-FE-25, REQ-FE-26, REQ-FE-27, REQ-FE-28
  - **Arquivos:** `frontend/src/paginas/Inscritos.jsx` (alterar), `frontend/tests/inscritos.test.jsx` (alterar)
  - **Critério de pronto:** `npm test` passa, incluindo "REQ-FE-25: ..." (cancelar não chama `removerInscricao`), "REQ-FE-26: ..." (linha some e contador atualiza), "REQ-FE-27: ..." e "REQ-FE-28: ...".
  - **Depende de:** T09
  - **Commit sugerido:** `feat/frontend - exclui inscrito`

- [x] **T11: Verificações manuais com a API rodando**
  - **Descrição:** com o backend e o frontend rodando juntos, conferir manualmente: REQ-FE-29 (com `VITE_API_URL` apontando para o backend em outra porta, as chamadas vão para ela); REQ-FE-30 (com a 5173 ocupada, `npm run dev` para com erro); REQ-FE-31 (tela do evento em 360px, 640px, 960px e 1280px, sem rolagem horizontal); REQ-FE-32 (inscrição e inscritos em 360px, tabela rolando na própria área); REQ-FE-33 (textos em português em todas as telas e estados). Fazer também uma inscrição e uma exclusão de ponta a ponta. Registrar o resultado na matriz.
  - **Requisitos:** REQ-FE-29, REQ-FE-30, REQ-FE-31, REQ-FE-32, REQ-FE-33
  - **Arquivos:** `specs/02-frontend-telas/tasks.md` (alterar)
  - **Critério de pronto:** `npm test` passa com toda a suíte do frontend e do backend; as cinco verificações feitas, mostradas à usuária e registradas na matriz. Se alguma falhar, parar e propor uma tarefa de correção.
  - **Depende de:** T03, T08, T10
  - **Commit sugerido:** `docs/specs - registra as verificações manuais do front`

## Matriz de rastreabilidade

| Requisito | Tarefa(s)      | Teste(s) previsto(s)                                                                   | Status   |
| --------- | -------------- | -------------------------------------------------------------------------------------- | -------- |
| REQ-FE-01 | T02            | `navegacao.test.jsx` › "REQ-FE-01: cada caminho mostra a sua tela"; "REQ-FE-01: os links do cabeçalho trocam de tela" | conforme |
| REQ-FE-02 | T02            | `navegacao.test.jsx` › "REQ-FE-02: o cabeçalho com os links para as 3 telas aparece em todas elas" | conforme |
| REQ-FE-03 | T02            | `navegacao.test.jsx` › "REQ-FE-03: caminho desconhecido mostra \"Página não encontrada\" e o link volta para o evento" | conforme |
| REQ-FE-04 | T03            | `evento.test.jsx` › "REQ-FE-04: mostra nome, data, local e descrição do evento" | conforme |
| REQ-FE-05 | T03            | `evento.test.jsx` › "REQ-FE-05: mostra cada palestrante com nome, cargo e empresa, tema e iniciais" | conforme |
| REQ-FE-06 | T03            | `evento.test.jsx` › "REQ-FE-06: o botão \"Inscreva-se\" leva à tela de inscrição" | conforme |
| REQ-FE-07 | T06            | `inscricao.test.jsx` › "REQ-FE-07: mostra os campos com rótulo e o telefone opcional com exemplo de formato"                                                | conforme |
| REQ-FE-08 | T06            | `inscricao.test.jsx` › "REQ-FE-08: tipo de ingresso tem duas opções exclusivas, nenhuma marcada no início"                                                | conforme |
| REQ-FE-09 | T05, T06       | `validacao.test.js` › "REQ-FE-09: aceita valores válidos, inclusive sem telefone, devolvendo objeto vazio"; "REQ-FE-09: nome vazio ou só com espaços gera \"O nome é obrigatório\""; "REQ-FE-09: e-mail vazio ou só com espaços gera \"O e-mail é obrigatório\""; "REQ-FE-09: tipo de ingresso não escolhido gera \"Escolha o tipo de ingresso\""; "REQ-FE-09: devolve todos os campos obrigatórios de uma vez"; `inscricao.test.jsx` › "REQ-FE-09: obrigatório vazio ou só com espaços mostra a mensagem junto ao campo e não chama a API"        | conforme |
| REQ-FE-10 | T05, T06       | `validacao.test.js` › "REQ-FE-10: e-mail fora do formato texto@texto.texto gera \"Informe um e-mail válido\""; "REQ-FE-10: aceita e-mail com espaços nas pontas"; `inscricao.test.jsx` › "REQ-FE-10: e-mail fora do formato mostra \"Informe um e-mail válido\" e não chama a API"        | conforme |
| REQ-FE-11 | T05, T06       | `validacao.test.js` › "REQ-FE-11: telefone com letras, símbolos ou quantidade errada de dígitos gera mensagem"; "REQ-FE-11: aceita telefone vazio, só com espaços ou com 10 e 11 dígitos em qualquer formato"; `inscricao.test.jsx` › "REQ-FE-11: telefone inválido mostra a mensagem junto ao campo e não chama a API"        | conforme |
| REQ-FE-12 | T06            | `inscricao.test.jsx` › "REQ-FE-12: enviar o formulário vazio mostra as 3 mensagens de uma vez"                                                | conforme |
| REQ-FE-13 | T06            | `inscricao.test.jsx` › "REQ-FE-13: alterar um campo com erro remove só a mensagem dele"                                                | conforme |
| REQ-FE-14 | T04, T07       | `api.test.js` › "REQ-FE-14: criarInscricao envia POST /inscricoes em JSON com os 4 campos e devolve a inscrição criada"; `inscricao.test.jsx` › "REQ-FE-14: envia os 4 campos à API e, enquanto espera, deixa o botão desabilitado com \"Enviando…\"" | conforme |
| REQ-FE-15 | T07            | `inscricao.test.jsx` › "REQ-FE-15: depois do sucesso, mostra a confirmação com o nome e o link para inscritos e limpa o formulário"                                                | conforme |
| REQ-FE-16 | T08            | `inscricao.test.jsx` › "REQ-FE-16: erros por campo vindos da API aparecem junto a cada campo e os valores ficam"                                                | conforme |
| REQ-FE-17 | T08            | `inscricao.test.jsx` › "REQ-FE-17: \"E-mail já cadastrado\" aparece junto ao campo e-mail e os valores ficam"                                                | conforme |
| REQ-FE-18 | T08            | `inscricao.test.jsx` › "REQ-FE-18: outro erro da API aparece na área geral acima do botão e os valores ficam"; "REQ-FE-18: a mensagem geral some ao enviar de novo"                                                | conforme |
| REQ-FE-19 | T04, T08       | `api.test.js` › "REQ-FE-19: falha de conexão vira ErroDeConexao com a mensagem de servidor fora do ar"; `inscricao.test.jsx` › "REQ-FE-19: sem conexão com a API, mostra a mensagem de servidor fora do ar e os valores ficam"              | conforme |
| REQ-FE-20 | T04, T09       | `api.test.js` › "REQ-FE-20: listarInscricoes faz GET /inscricoes e devolve o array recebido"; `inscritos.test.jsx` › "REQ-FE-20: busca as inscrições ao abrir e mostra a tabela na ordem recebida, com tipo legível e \"—\" sem telefone"              | conforme |
| REQ-FE-21 | T09            | `inscritos.test.jsx` › "REQ-FE-21: mostra a quantidade total de inscrições"                                                | conforme |
| REQ-FE-22 | T09            | `inscritos.test.jsx` › "REQ-FE-22: mostra \"Carregando inscrições…\" enquanto a lista não chega"                                                | conforme |
| REQ-FE-23 | T09            | `inscritos.test.jsx` › "REQ-FE-23: lista vazia mostra \"Nenhuma inscrição ainda\" com link para a inscrição"                                                | conforme |
| REQ-FE-24 | T09            | `inscritos.test.jsx` › "REQ-FE-24: falha ao carregar mostra o erro e \"Tentar de novo\" busca a lista outra vez"; "REQ-FE-24: sem conexão com a API, mostra a mensagem de servidor fora do ar"                                                | conforme |
| REQ-FE-25 | T10            | `inscritos.test.jsx` › "REQ-FE-25: pede confirmação com o nome e, se cancelar, não chama a API nem muda a tabela"                                                | conforme |
| REQ-FE-26 | T04, T10       | `api.test.js` › "REQ-FE-26: removerInscricao faz DELETE /inscricoes/:id"; `inscritos.test.jsx` › "REQ-FE-26: ao confirmar, remove a linha sem recarregar e atualiza o contador"; "REQ-FE-26: ao excluir a última inscrição, mostra o estado de lista vazia"              | conforme |
| REQ-FE-27 | T04, T10       | `api.test.js` › "REQ-FE-27: status de erro vira ErroDaApi com status, mensagem e campos"; "REQ-FE-27: status de erro com corpo que não é JSON vira \"Erro inesperado do servidor\""; `inscritos.test.jsx` › "REQ-FE-27: se a API responder 404, remove a linha e avisa que ela já tinha sido excluída"              | conforme |
| REQ-FE-28 | T10            | `inscritos.test.jsx` › "REQ-FE-28: outro erro da API mostra a mensagem e mantém a tabela como estava"; "REQ-FE-28: sem conexão com a API, mostra a mensagem de servidor fora do ar e mantém a tabela"; "REQ-FE-28: a mensagem de uma exclusão anterior some na próxima tentativa"                                                | conforme |
| REQ-FE-29 | T04, T11       | `api.test.js` › "REQ-FE-29: sem VITE_API_URL, as chamadas vão para http://localhost:3001" (URL padrão); manual em 2026-10-24: com `VITE_API_URL=http://localhost:4000`, o Vite entregou `"VITE_API_URL": "http://localhost:4000"` ao navegador; sem a variável, o módulo usa `http://localhost:3001`                 | conforme (manual) |
| REQ-FE-30 | T01, T11       | manual em 2026-10-24: com a 5173 ocupada, `npx vite` parou com "Error: Port 5173 is already in use" (código 1), sem trocar de porta                                                                                 | conforme (manual) |
| REQ-FE-31 | T03, T11       | manual em 2026-10-24 (usuária, DevTools): tela do evento em 360, 640, 960 e 1280px com palestrantes em 1, 2, 4 e 4 colunas e sem rolagem horizontal (`scrollWidth > clientWidth` → `false`)                                                                                 | conforme (manual) |
| REQ-FE-32 | T06, T09, T11  | manual em 2026-10-24 (usuária, DevTools): inscrição e inscritos em 360px sem rolagem horizontal da página; a tabela rola dentro da própria área                                                                                 | conforme (manual) |
| REQ-FE-33 | T11            | manual em 2026-10-24: varredura dos textos do código sem nada em inglês; usuária percorreu as telas e estados e confirmou tudo em português (exceto "OK"/"Cancelar" da confirmação, que são do navegador)                                                                                 | conforme (manual) |

Verificação de ponta a ponta (T11, 2026-10-24): suítes do backend (26/26) e do frontend (50/50) passando. Pelo HTTP, com a origem do front: inscrição criada (201, telefone formatado), e-mail repetido recusado com "E-mail já cadastrado" (400), exclusão (204) e nova exclusão da mesma inscrição (404). Pela tela, confirmado pela usuária: confirmação de inscrição, "E-mail já cadastrado" junto ao campo e exclusão com confirmação.

## Registro de revisão

### 2026-10-24

- **Testes:** frontend 50/50 passando (6 arquivos); backend 26/26. Todos os 50 testes do front começam com o ID do requisito, e os 28 requisitos automáticos têm ao menos um teste. Os 5 manuais (REQ-FE-29 a REQ-FE-33) foram verificados na T11.
- **Resultado:** 33 de 33 requisitos conformes. Nenhuma lacuna, nenhum requisito sem teste e nenhuma divergência do design. Estrutura de arquivos idêntica à do design. Revisão aprovada pela usuária em 2026-10-24.
- **Observações, sem ação necessária:**
  - O nome do evento aparece fixo também no `Cabecalho.jsx` e no `index.html`, além de `dados/evento.js`. Se o nome mudar, os três lugares precisam mudar juntos.
  - Detalhes de implementação que não estão no design, mas não criam comportamento novo: atributos `autoComplete` nos campos, `role="region"` com `tabIndex` na área de rolagem da tabela (acessibilidade de REQ-FE-32), um parágrafo de introdução no formulário e na página não encontrada, e a mensagem "Erro inesperado do servidor" também quando o JSON de erro vem sem `erro`.
  - Erros inesperados (que não são `ErroDaApi` nem `ErroDeConexao`) no envio do formulário são relançados, sem mensagem na tela; não há requisito para esse caso.
  - Em desenvolvimento, o `StrictMode` faz a tela de inscritos buscar a lista duas vezes ao abrir; não afeta o comportamento nem o build.
