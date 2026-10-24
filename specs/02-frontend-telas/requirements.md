> **Feature:** 02-frontend-telas
> **Documento:** requisitos
> **Status:** aprovado
> **Aprovado em:** 2026-10-24

# Requisitos — 02-frontend-telas

## Contexto

Esta feature cobre o frontend do enunciado: as 3 telas (evento, inscrição e inscritos), navegáveis pelo React Router, e a integração com a API da feature `01-api-inscricoes`. O objetivo é que um participante conheça o evento e se inscreva, e que o organizador veja e exclua inscrições, com mensagens claras em cada situação. A responsividade da página do evento é implementada aqui; a feature `03-entrega` apenas a confere (D-03).

## Histórias de usuário

### HU-01: Navegar entre as telas
**Como** visitante do site, **quero** ir de uma tela para outra por um menu, **para** encontrar o que procuro sem digitar endereços.

Critérios de aceite: REQ-FE-01, REQ-FE-02, REQ-FE-03.

### HU-02: Conhecer o evento
**Como** possível participante, **quero** ver nome, data, local, descrição e palestrantes do evento, **para** decidir se quero participar.

Critérios de aceite: REQ-FE-04, REQ-FE-05, REQ-FE-06, REQ-FE-31.

### HU-03: Me inscrever no evento
**Como** participante, **quero** preencher um formulário com meus dados e receber uma confirmação, **para** garantir minha vaga.

Critérios de aceite: REQ-FE-07, REQ-FE-08, REQ-FE-09, REQ-FE-10, REQ-FE-11, REQ-FE-12, REQ-FE-13, REQ-FE-14, REQ-FE-15.

### HU-04: Entender o que deu errado na inscrição
**Como** participante, **quero** ver mensagens claras quando algum dado estiver errado ou o servidor falhar, **para** corrigir e tentar de novo sem perder o que digitei.

Critérios de aceite: REQ-FE-16, REQ-FE-17, REQ-FE-18, REQ-FE-19.

### HU-05: Ver os inscritos
**Como** organizador do evento, **quero** ver a lista de todos os inscritos, **para** saber quem vai participar.

Critérios de aceite: REQ-FE-20, REQ-FE-21, REQ-FE-22, REQ-FE-23, REQ-FE-24.

### HU-06: Excluir um inscrito
**Como** organizador do evento, **quero** excluir uma inscrição com uma confirmação antes, **para** manter a lista correta sem apagar ninguém por engano.

Critérios de aceite: REQ-FE-25, REQ-FE-26, REQ-FE-27, REQ-FE-28.

### HU-07: Rodar o front junto com a API
**Como** desenvolvedora, **quero** que o front saiba onde está a API e rode na porta que a API aceita, **para** que as chamadas funcionem sem configuração manual.

Critérios de aceite: REQ-FE-29, REQ-FE-30.

## Critérios de aceite (EARS)

### Navegação

| ID        | Critério (EARS)                                                                                                                                                       | Origem                                                                  | Verificação |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| REQ-FE-01 | O SISTEMA DEVE oferecer a tela do evento em `/`, a tela de inscrição em `/inscricao` e a tela de inscritos em `/inscritos`, trocando de tela pelo React Router, sem recarregar a página. | Enunciado: "As 3 telas funcionando e navegáveis pelo React Router"; decisão (D-04) | automática  |
| REQ-FE-02 | O SISTEMA DEVE exibir, em todas as telas, um cabeçalho com links para as 3 telas.                                                                                     | Enunciado: "Tela de inscritos... Não precisa de login"; decisão (D-04)  | automática  |
| REQ-FE-03 | SE o endereço acessado não corresponder a nenhuma tela, ENTÃO O SISTEMA DEVE exibir uma página "Página não encontrada" com um link para a tela do evento.            | Decisão (D-05)                                                          | automática  |

### Tela do evento

| ID        | Critério (EARS)                                                                                                                                         | Origem                                                                                                  | Verificação |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------- |
| REQ-FE-04 | O SISTEMA DEVE exibir, na tela do evento, o nome, a data, o local e um texto sobre o evento, com dados fixos no front.                                  | Enunciado: "divulga o evento com nome, data, local, texto sobre o evento... Os dados podem ser fixos no front"; decisão (D-01) | automática  |
| REQ-FE-05 | O SISTEMA DEVE exibir, na tela do evento, os palestrantes, cada um com nome, cargo e empresa, tema da palestra e um círculo com as iniciais do nome.      | Enunciado: "palestrantes"; decisão (D-02)                                                               | automática  |
| REQ-FE-06 | QUANDO a pessoa clicar no botão "Inscreva-se" da tela do evento, O SISTEMA DEVE levá-la à tela de inscrição.                                            | Enunciado: "um botão 'Inscreva-se' que leva à tela de inscrição"                                        | automática  |

### Formulário de inscrição

| ID        | Critério (EARS)                                                                                                                                                                                                                                         | Origem                                                                                         | Verificação |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| REQ-FE-07 | O SISTEMA DEVE exibir, na tela de inscrição, um formulário com os campos nome, e-mail, telefone (marcado como opcional, com um exemplo de formato e sem máscara) e tipo de ingresso, cada um com seu rótulo visível.                                    | Enunciado: "formulário com nome, e-mail, telefone (opcional) e tipo de ingresso"; decisão (D-09) | automática  |
| REQ-FE-08 | O SISTEMA DEVE apresentar o tipo de ingresso como duas opções exclusivas, "Estudante" e "Profissional", sem nenhuma marcada ao abrir a tela, enviando à API o valor `estudante` ou `profissional`.                                                     | Enunciado: "tipo de ingresso (estudante/profissional)"; decisão (D-10)                         | automática  |
| REQ-FE-09 | SE a pessoa enviar o formulário com o nome vazio (ou só com espaços), o e-mail vazio (ou só com espaços) ou sem escolher o tipo de ingresso, ENTÃO O SISTEMA DEVE exibir uma mensagem de erro junto a cada campo com problema e não chamar a API.      | Enunciado: "Validar os campos obrigatórios: nome, e-mail e tipoIngresso"; decisão (D-06, D-07) | automática  |
| REQ-FE-10 | SE a pessoa enviar o formulário com um e-mail preenchido que não siga o formato `texto@texto.texto` (sem espaços), ENTÃO O SISTEMA DEVE exibir uma mensagem de erro junto ao campo e-mail e não chamar a API.                                          | Decisão (D-06), espelhando REQ-BE-09                                                           | automática  |
| REQ-FE-11 | SE a pessoa enviar o formulário com um telefone preenchido que contenha caracteres além de dígitos, espaços, parênteses e hífens, ou que não tenha 10 ou 11 dígitos, ENTÃO O SISTEMA DEVE exibir uma mensagem de erro junto ao campo telefone e não chamar a API. | Decisão (D-06), espelhando REQ-BE-12                                                           | automática  |
| REQ-FE-12 | SE mais de um campo estiver inválido no envio, ENTÃO O SISTEMA DEVE exibir as mensagens de todos eles ao mesmo tempo.                                                                                                                                  | Decisão (D-06, D-07)                                                                           | automática  |
| REQ-FE-13 | QUANDO a pessoa alterar um campo que está com mensagem de erro, O SISTEMA DEVE remover a mensagem desse campo.                                                                                                                                          | Decisão (D-07)                                                                                 | automática  |
| REQ-FE-14 | QUANDO a pessoa enviar o formulário com todos os campos válidos, O SISTEMA DEVE enviar `POST /inscricoes` com `nome`, `email`, `telefone` e `tipoIngresso`, e, ENQUANTO a resposta não chegar, manter o botão de envio desabilitado com o texto "Enviando…". | Enunciado: "POST /inscricoes: cria uma inscrição"; decisão (D-12)                              | automática  |
| REQ-FE-15 | QUANDO a API responder `201`, O SISTEMA DEVE exibir uma mensagem de sucesso com o nome da pessoa inscrita e um link para a tela de inscritos, e limpar o formulário.                                                                                   | Decisão (D-11)                                                                                 | automática  |
| REQ-FE-16 | SE a API responder `400` com erros por campo (`campos`), ENTÃO O SISTEMA DEVE exibir cada mensagem recebida junto ao campo correspondente, mantendo os dados digitados.                                                                                | Decisão (D-08); contrato de REQ-BE-07 a REQ-BE-13                                              | automática  |
| REQ-FE-17 | SE a API responder `400` com `{ "erro": "E-mail já cadastrado" }`, ENTÃO O SISTEMA DEVE exibir essa mensagem junto ao campo e-mail, mantendo os dados digitados.                                                                                       | Enunciado: "Não permitir dois cadastros com o mesmo e-mail... retornar 400 com mensagem de erro"; decisão (D-08) | automática  |
| REQ-FE-18 | SE a API responder com outro erro, sem erros por campo, ENTÃO O SISTEMA DEVE exibir a mensagem de erro recebida numa área geral acima do botão de envio, mantendo os dados digitados.                                                                | Decisão (D-08)                                                                                 | automática  |
| REQ-FE-19 | SE não for possível conectar à API ao enviar o formulário, ENTÃO O SISTEMA DEVE exibir "Não foi possível conectar ao servidor. Verifique se a API está rodando." numa área geral, mantendo os dados digitados.                                        | Decisão (D-19)                                                                                 | automática  |

### Tela de inscritos

| ID        | Critério (EARS)                                                                                                                                                                                                                                            | Origem                                                                     | Verificação |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| REQ-FE-20 | QUANDO a tela de inscritos for aberta, O SISTEMA DEVE buscar `GET /inscricoes` e exibir as inscrições numa tabela com nome, e-mail, telefone e tipo de ingresso, na ordem recebida, mostrando o tipo como "Estudante" ou "Profissional" e o telefone vazio como "—". | Enunciado: "lista todos os inscritos"; decisão (D-13)                      | automática  |
| REQ-FE-21 | O SISTEMA DEVE exibir, na tela de inscritos, a quantidade total de inscrições exibidas (ex: "3 inscritos").                                                                                                                                               | Decisão (D-13)                                                             | automática  |
| REQ-FE-22 | ENQUANTO a lista estiver sendo carregada, O SISTEMA DEVE exibir "Carregando inscrições…".                                                                                                                                                                   | Decisão (D-16)                                                             | automática  |
| REQ-FE-23 | SE a API devolver uma lista vazia, ENTÃO O SISTEMA DEVE exibir "Nenhuma inscrição ainda" com um link para a tela de inscrição.                                                                                                                            | Decisão (D-16)                                                             | automática  |
| REQ-FE-24 | SE não for possível carregar a lista (erro da API ou falha de conexão), ENTÃO O SISTEMA DEVE exibir uma mensagem de erro e um botão "Tentar de novo" que repete a busca.                                                                                  | Decisão (D-16, D-19)                                                       | automática  |
| REQ-FE-25 | QUANDO a pessoa clicar em "Excluir" numa inscrição, O SISTEMA DEVE pedir confirmação com o nome do inscrito (ex: "Excluir a inscrição de Maria Silva?") e, SE ela cancelar, não chamar a API nem alterar a lista.                                       | Enunciado: "opção de excluir"; decisão (D-14)                              | automática  |
| REQ-FE-26 | QUANDO a pessoa confirmar a exclusão e a API responder `204` ao `DELETE /inscricoes/:id`, O SISTEMA DEVE remover a inscrição da tabela sem recarregar a página e atualizar a quantidade total.                                                          | Enunciado: "DELETE /inscricoes/:id: remove uma inscrição"; decisão (D-15)  | automática  |
| REQ-FE-27 | SE a API responder `404` à exclusão, ENTÃO O SISTEMA DEVE remover a inscrição da tabela e avisar que ela já tinha sido excluída.                                                                                                                         | Decisão (D-15); contrato de REQ-BE-16                                      | automática  |
| REQ-FE-28 | SE a exclusão falhar com outro erro ou por falha de conexão, ENTÃO O SISTEMA DEVE exibir uma mensagem de erro e manter a tabela como estava.                                                                                                             | Decisão (D-15, D-19)                                                       | automática  |

### Integração

| ID        | Critério (EARS)                                                                                                                                                            | Origem         | Verificação |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| REQ-FE-29 | O SISTEMA DEVE usar como endereço da API o valor da variável de ambiente `VITE_API_URL` e, se ela não estiver definida, `http://localhost:3001`.                             | Decisão (D-17) | manual      |
| REQ-FE-30 | O SISTEMA DEVE rodar em desenvolvimento sempre na porta `5173` e, SE ela estiver ocupada, ENTÃO O SISTEMA DEVE parar com erro em vez de usar outra porta.                     | Decisão (D-18); CORS de REQ-BE-19 | manual      |

## Requisitos não funcionais

| ID        | Critério (EARS)                                                                                                                                                                  | Origem                                                    | Verificação |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| REQ-FE-31 | O SISTEMA DEVE exibir a tela do evento de forma legível e sem rolagem horizontal da página em larguras de 360px até telas de computador, reorganizando o conteúdo conforme a largura. | Enunciado: "Página do evento responsiva"; decisão (D-03) | manual      |
| REQ-FE-32 | O SISTEMA DEVE manter as telas de inscrição e de inscritos usáveis a partir de 360px de largura, sem rolagem horizontal da página; em telas estreitas, a tabela de inscritos rola para os lados dentro da própria área. | Decisão (D-03, D-13)                                      | manual      |
| REQ-FE-33 | O SISTEMA DEVE exibir todos os textos da interface em português.                                                                                                                 | CLAUDE.md, seção 7                                        | manual      |

## Fora de escopo

- Login, autenticação e permissões (o enunciado diz "não precisa de login").
- Edição de inscrição.
- Busca, filtro, ordenação e paginação da lista de inscritos.
- Controle de vagas ou contagem de vagas restantes.
- Página de detalhes de palestrante e fotos dos palestrantes.
- Máscara de telefone enquanto se digita.
- Tradução para outros idiomas.
- Testes de ponta a ponta com navegador real (e2e).
- Publicação (deploy) do site.
- README e repositório público no GitHub (feature `03-entrega`).

## Dúvidas em aberto

| ID   | Dúvida                                  | Opções                                                                                   | Decisão                                                                                                                                                         | Resolvida? |
| ---- | --------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-01 | Conteúdo do evento                      | (a) inventado pelo Claude; (b) fornecido pela usuária                                    | (a) Evento fictício proposto pelo Claude, ajustável depois.                                                                                                     | sim        |
| D-02 | Dados dos palestrantes                  | (a) só nome; (b) nome, cargo/empresa e tema; (c) (b) com foto                            | (b) Com 3 ou 4 palestrantes e um círculo com as iniciais no lugar da foto.                                                                                      | sim        |
| D-03 | Onde fica a responsividade              | (a) implementada na 02, conferida na 03; (b) toda na 03                                  | (a) Página do evento responsiva a partir de 360px; as outras telas usáveis no celular.                                                                          | sim        |
| D-04 | Rotas e menu                            | —                                                                                        | Rotas `/`, `/inscricao` e `/inscritos`, com cabeçalho com links para as 3 telas em todas elas.                                                                  | sim        |
| D-05 | Rota inexistente                        | (a) página "não encontrada"; (b) redirecionar para `/`                                   | (a) Página "Página não encontrada" com link para o início.                                                                                                      | sim        |
| D-06 | Validação no front                      | (a) só a API valida; (b) o front repete as regras da API                                 | (b) Obrigatórios, formato do e-mail e telefone com 10 ou 11 dígitos, e os erros da API também são exibidos.                                                     | sim        |
| D-07 | Quando mostrar os erros                 | (a) ao enviar; (b) ao sair do campo; (c) ao digitar                                      | (a) Ao enviar; o erro de um campo some quando ele é alterado.                                                                                                   | sim        |
| D-08 | Onde mostrar os erros da API            | e-mail duplicado: (a) junto ao campo; (b) mensagem geral                                 | Erros em `campos` junto ao campo; "E-mail já cadastrado" junto ao campo e-mail (a); demais erros numa área geral acima do botão.                                 | sim        |
| D-09 | Telefone                                | (a) sem máscara, com exemplo; (b) máscara ao digitar                                     | (a) Sem máscara, com exemplo `(11) 99999-9999`; a API formata ao salvar.                                                                                        | sim        |
| D-10 | Tipo de ingresso                        | (a) radio sem padrão; (b) select; (c) radio com "estudante" marcado                      | (a) Duas opções de marcar, nenhuma marcada no início.                                                                                                           | sim        |
| D-11 | Depois de inscrever com sucesso         | (a) mensagem na tela, formulário limpo e link para inscritos; (b) ir para inscritos      | (a)                                                                                                                                                             | sim        |
| D-12 | Durante o envio                         | —                                                                                        | Botão desabilitado com o texto "Enviando…".                                                                                                                     | sim        |
| D-13 | Formato da lista                        | (a) tabela; (b) cartões                                                                  | (a) Tabela com nome, e-mail, telefone e tipo ("Estudante"/"Profissional"), telefone vazio como "—", rolagem horizontal em telas estreitas e contador de inscritos. | sim        |
| D-14 | Confirmar antes de excluir              | (a) sim, com o nome; (b) não                                                             | (a) Confirmação do navegador com o nome do inscrito.                                                                                                            | sim        |
| D-15 | Depois de excluir                       | —                                                                                        | `204`: remove da tabela na hora. `404`: remove e avisa que já tinha sido excluída. Outros erros: mensagem e tabela inalterada.                                   | sim        |
| D-16 | Estados da tela de inscritos            | —                                                                                        | Carregando, lista vazia (com link para inscrição) e falha ao carregar (com "Tentar de novo").                                                                   | sim        |
| D-17 | Endereço da API                         | (a) fixo; (b) `VITE_API_URL` com padrão                                                  | (b) `VITE_API_URL`, com padrão `http://localhost:3001`.                                                                                                        | sim        |
| D-18 | Porta do front                          | —                                                                                        | Sempre `5173`; se ocupada, para com erro, porque a API só libera CORS para essa origem.                                                                        | sim        |
| D-19 | API desligada                           | —                                                                                        | Mensagem "Não foi possível conectar ao servidor. Verifique se a API está rodando." no formulário e na lista.                                                     | sim        |
| D-20 | Fora de escopo                          | —                                                                                        | Conforme a seção "Fora de escopo".                                                                                                                             | sim        |
