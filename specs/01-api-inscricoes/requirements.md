> **Feature:** 01-api-inscricoes
> **Documento:** requisitos
> **Status:** aprovado
> **Aprovado em:** 2026-10-24

# Requisitos — 01-api-inscricoes

## Contexto

Esta feature cobre o backend do enunciado: a API REST que lista, cria e remove inscrições no evento. Ela define o modelo da inscrição, as regras de validação e de e-mail único, o formato das respostas e a persistência em memória. O objetivo é entregar um contrato estável e testado, que a feature `02-frontend-telas` vai consumir.

## Histórias de usuário

### HU-01: Listar inscrições
**Como** organizador do evento, **quero** ver todas as inscrições feitas, **para** saber quem vai participar.

Critérios de aceite: REQ-BE-01, REQ-BE-02.

### HU-02: Criar inscrição
**Como** participante, **quero** me inscrever informando nome, e-mail, telefone (opcional) e tipo de ingresso, **para** garantir minha vaga no evento.

Critérios de aceite: REQ-BE-03, REQ-BE-04, REQ-BE-05, REQ-BE-06, REQ-BE-07, REQ-BE-08, REQ-BE-09, REQ-BE-10, REQ-BE-11, REQ-BE-12, REQ-BE-13, REQ-BE-14, REQ-BE-18, REQ-BE-23.

### HU-03: Remover inscrição
**Como** organizador do evento, **quero** excluir uma inscrição, **para** manter a lista de inscritos correta.

Critérios de aceite: REQ-BE-15, REQ-BE-16, REQ-BE-17.

### HU-04: Consumir a API pelo frontend
**Como** desenvolvedora do frontend, **quero** chamar a API a partir da aplicação React e receber erros sempre em JSON, **para** mostrar ao usuário mensagens claras em cada tela.

Critérios de aceite: REQ-BE-18, REQ-BE-19, REQ-BE-20, REQ-BE-22.

## Critérios de aceite (EARS)

Modelo da inscrição (enunciado): `{ "id", "nome", "email", "telefone", "tipoIngresso" }`.

Formato de erro de validação (D-10): `400` com `{ "erro": "Dados inválidos", "campos": { "<campo>": "<mensagem>" } }`. Os demais erros usam `{ "erro": "<mensagem>" }`.

### Listagem

| ID        | Critério (EARS)                                                                                                                                                                          | Origem                                                    | Verificação |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| REQ-BE-01 | QUANDO receber `GET /inscricoes`, O SISTEMA DEVE responder `200` com um array de todas as inscrições, em ordem de criação (da mais antiga para a mais nova).                              | Enunciado: "lista todas as inscrições"; decisão (D-11)    | automática  |
| REQ-BE-02 | SE não houver inscrições, ENTÃO O SISTEMA DEVE responder `GET /inscricoes` com `200` e um array vazio.                                                                                   | Enunciado: "lista todas as inscrições"; decisão (D-09)    | automática  |

### Criação

| ID        | Critério (EARS)                                                                                                                                                                                                                                           | Origem                                                                     | Verificação |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| REQ-BE-03 | QUANDO receber `POST /inscricoes` com dados válidos, O SISTEMA DEVE criar a inscrição e responder `201` com o objeto criado, contendo exatamente os campos `id`, `nome`, `email`, `telefone` e `tipoIngresso`.                                               | Enunciado: "cria uma inscrição", "Modelo"; decisão (D-09)                  | automática  |
| REQ-BE-04 | QUANDO criar uma inscrição, O SISTEMA DEVE atribuir a ela um `id` inteiro, maior que todos os já atribuídos, que nunca é reaproveitado, mesmo depois de exclusões.                                                                                       | Enunciado: modelo com `"id": 1`; decisão (D-02)                            | automática  |
| REQ-BE-05 | QUANDO criar uma inscrição, O SISTEMA DEVE remover espaços do início e do fim de `nome`, `email` e `telefone`, e guardar o `email` em letras minúsculas.                                                                                                   | Decisão (D-04)                                                             | automática  |
| REQ-BE-06 | SE o `email` informado, depois da normalização de REQ-BE-05, já pertencer a uma inscrição existente, ENTÃO O SISTEMA DEVE responder `400` com `{ "erro": "E-mail já cadastrado" }` e não criar a inscrição.                                              | Enunciado: "Não permitir dois cadastros com o mesmo e-mail... retornar 400"; decisão (D-04, D-10) | automática  |
| REQ-BE-07 | SE `nome` estiver ausente, não for texto ou ficar vazio depois de remover os espaços, ENTÃO O SISTEMA DEVE responder `400` no formato de erro de validação, com uma mensagem em `campos.nome`.                                                            | Enunciado: "Validar os campos obrigatórios: nome..."; decisão (D-04, D-10) | automática  |
| REQ-BE-08 | SE `email` estiver ausente, não for texto ou ficar vazio depois de remover os espaços, ENTÃO O SISTEMA DEVE responder `400` no formato de erro de validação, com uma mensagem em `campos.email`.                                                          | Enunciado: "Validar os campos obrigatórios: ... e-mail..."; decisão (D-10) | automática  |
| REQ-BE-09 | SE `email` estiver preenchido mas não seguir o formato `texto@texto.texto` (sem espaços), ENTÃO O SISTEMA DEVE responder `400` no formato de erro de validação, com uma mensagem em `campos.email`.                                                       | Decisão (D-03)                                                             | automática  |
| REQ-BE-10 | SE `tipoIngresso` estiver ausente ou for diferente de exatamente `"estudante"` ou `"profissional"` (considerando maiúsculas), ENTÃO O SISTEMA DEVE responder `400` no formato de erro de validação, com uma mensagem em `campos.tipoIngresso`.            | Enunciado: "aceita estudante ou profissional", "Validar os campos obrigatórios: ... tipoIngresso"; decisão (D-06) | automática  |
| REQ-BE-11 | SE `telefone` estiver ausente, for `null` ou ficar vazio depois de remover os espaços, ENTÃO O SISTEMA DEVE aceitar a inscrição e guardar `telefone` como `""`.                                                                                          | Enunciado: "telefone (opcional)"; decisão (D-05)                           | automática  |
| REQ-BE-12 | SE `telefone` estiver preenchido e contiver caracteres além de dígitos, espaços, parênteses e hífens, ou não tiver exatamente 10 ou 11 dígitos, ENTÃO O SISTEMA DEVE responder `400` no formato de erro de validação, com uma mensagem em `campos.telefone`.   | Enunciado: modelo com `"(11) 99999-9999"`; decisão (D-05)                  | automática  |
| REQ-BE-23 | QUANDO criar uma inscrição com `telefone` válido, O SISTEMA DEVE guardá-lo no formato `(DD) NNNNN-NNNN` se tiver 11 dígitos, ou `(DD) NNNN-NNNN` se tiver 10 dígitos, independentemente de como foi digitado (ex: `49999692146` → `(49) 99969-2146`). | Enunciado: modelo com `"(11) 99999-9999"`; decisão (D-05)                  | automática  |
| REQ-BE-13 | SE mais de um campo for inválido na mesma requisição, ENTÃO O SISTEMA DEVE informar todos eles em `campos` na mesma resposta `400`, e não criar a inscrição.                                                                                              | Decisão (D-10)                                                             | automática  |
| REQ-BE-14 | QUANDO receber `POST /inscricoes` com campos além dos do modelo, O SISTEMA DEVE ignorá-los e não incluí-los na inscrição criada.                                                                                                                         | Decisão (D-08)                                                             | automática  |
| REQ-BE-18 | SE o corpo do `POST /inscricoes` não for um JSON válido, ENTÃO O SISTEMA DEVE responder `400` com `{ "erro": "<mensagem>" }` em JSON, e não criar a inscrição.                                                                                           | Decisão (D-12)                                                             | automática  |

### Remoção

| ID        | Critério (EARS)                                                                                                                                                        | Origem                                                     | Verificação |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| REQ-BE-15 | QUANDO receber `DELETE /inscricoes/:id` com o `id` de uma inscrição existente, O SISTEMA DEVE removê-la e responder `204` sem corpo; ela não deve mais aparecer em `GET /inscricoes`. | Enunciado: "remove uma inscrição"; decisão (D-09)          | automática  |
| REQ-BE-16 | SE o `id` for um inteiro que não corresponde a nenhuma inscrição, ENTÃO O SISTEMA DEVE responder `404` com `{ "erro": "<mensagem>" }`.                                    | Decisão (D-09, D-10)                                       | automática  |
| REQ-BE-17 | SE o `id` não for um número inteiro positivo (ex: `abc`, `1.5`, `-1`), ENTÃO O SISTEMA DEVE responder `400` com `{ "erro": "<mensagem>" }`.                            | Decisão (D-09, D-10)                                       | automática  |

### Integração

| ID        | Critério (EARS)                                                                                                                                 | Origem          | Verificação |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| REQ-BE-19 | O SISTEMA DEVE permitir requisições de outra origem (CORS) vindas do frontend em desenvolvimento (`http://localhost:5173`).                       | Decisão (D-13)  | automática  |
| REQ-BE-20 | O SISTEMA DEVE escutar na porta definida pela variável de ambiente `PORT` e, se ela não estiver definida, na porta `3001`.                        | Decisão (D-13)  | manual      |

## Requisitos não funcionais

| ID        | Critério (EARS)                                                                                                                                       | Origem                                                    | Verificação |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| REQ-BE-21 | O SISTEMA DEVE guardar as inscrições apenas em memória, sem banco externo; ao reiniciar o servidor, a lista volta a ficar vazia e os `id`s recomeçam em 1. | Enunciado: "SQLite ou em memória... Sem banco externo"; decisão (D-01) | manual      |
| REQ-BE-22 | O SISTEMA DEVE responder todos os erros (`400`, `404`) em JSON, com as mensagens em português.                                                        | CLAUDE.md, seção 7; decisão (D-10, D-12)                  | automática  |

## Fora de escopo

- Edição de inscrição (`PUT` / `PATCH`).
- Consulta de uma inscrição por id (`GET /inscricoes/:id`).
- Autenticação e autorização (o enunciado diz "não precisa de login").
- Paginação, filtros, busca e ordenação configurável da listagem.
- Persistência entre reinícios do servidor (SQLite ou arquivo).
- Limite de tamanho do `nome` e de requisições (rate limiting).
- Normalização de `tipoIngresso` (ex: aceitar `"Estudante"`).
- Deploy da API.

## Dúvidas em aberto

| ID   | Dúvida                                                       | Opções                                                                     | Decisão                                                                                                                                                  | Resolvida? |
| ---- | ------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-01 | Onde guardar os dados?                                       | (a) array em memória; (b) SQLite                                           | (a) Em memória. Os dados somem ao reiniciar o servidor.                                                                                                  | sim        |
| D-02 | Como gerar o `id`?                                           | (a) inteiro incremental; (b) UUID                                          | (a) Inteiro incremental, nunca reaproveitado.                                                                                                            | sim        |
| D-03 | Validar o formato do e-mail?                                 | (a) só presença; (b) formato básico `texto@texto.texto`                    | (b) Formato básico.                                                                                                                                      | sim        |
| D-04 | Espaços e maiúsculas                                         | (a) remover espaços das pontas e guardar e-mail em minúsculas; (b) guardar como veio | (a) Normalizar. O e-mail duplicado é comparado depois da normalização.                                                                                   | sim        |
| D-05 | Validar o telefone?                                          | (a) qualquer texto; (b) formato `(11) 99999-9999`; (c) 10 a 11 dígitos     | (b), na variante flexível: a API aceita o telefone digitado de qualquer forma com dígitos, espaços, parênteses e hífens, exige 10 (fixo) ou 11 (celular) dígitos e guarda sempre formatado como `(DD) NNNNN-NNNN` ou `(DD) NNNN-NNNN`. Ausente ou vazio continua permitido. | sim        |
| D-06 | `tipoIngresso` com maiúsculas                                | (a) rejeitar; (b) converter e aceitar                                      | (a) Rejeitar. Só valem `estudante` e `profissional`, exatamente assim.                                                                                   | sim        |
| D-07 | Tamanho máximo do nome                                       | (a) sem limite; (b) até 100 caracteres                                     | (a) Sem limite.                                                                                                                                          | sim        |
| D-08 | Campos extras no corpo                                       | (a) ignorar; (b) rejeitar com 400                                          | (a) Ignorar.                                                                                                                                             | sim        |
| D-09 | Códigos de status                                            | `POST` 201; `GET` 200; `DELETE` 204 ou 200; id inexistente 404; id inválido 400 ou 404 | `POST` 201, `GET` 200, `DELETE` 204 sem corpo, id inexistente 404, id não numérico 400.                                                                  | sim        |
| D-10 | Formato do erro                                              | (a) `{ erro }`; (b) `{ erro, campos }`                                     | (b) Validação: `{ "erro": "Dados inválidos", "campos": {...} }`. Demais erros: `{ "erro": "..." }`. E-mail duplicado: `{ "erro": "E-mail já cadastrado" }`. | sim        |
| D-11 | Ordem da listagem                                            | (a) ordem de criação; (b) mais nova primeiro                               | (a) Ordem de criação.                                                                                                                                    | sim        |
| D-12 | JSON malformado ou corpo vazio                               | 400 em JSON vs. erro HTML padrão do Express                                | 400 com `{ "erro": "..." }`. Corpo vazio cai na validação dos campos obrigatórios.                                                                       | sim        |
| D-13 | CORS e porta                                                 | —                                                                          | CORS liberado para `http://localhost:5173`. Porta `3001`, configurável por `PORT`.                                                                        | sim        |
| D-14 | Fora de escopo                                               | —                                                                          | Conforme a seção "Fora de escopo".                                                                                                                      | sim        |
