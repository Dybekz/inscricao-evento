> **Feature:** 03-entrega
> **Documento:** requisitos
> **Status:** aprovado
> **Aprovado em:** 2026-10-25

# Requisitos — 03-entrega

## Contexto

Esta feature cobre a parte de entrega do enunciado: o README com instruções para rodar o backend e o frontend, a página do evento responsiva e a entrega num repositório público no GitHub. O código das features `01-api-inscricoes` e `02-frontend-telas` já está pronto e revisado. Aqui o objetivo é que qualquer pessoa consiga clonar, rodar e entender o projeto só com o README, e que a versão publicada no GitHub seja a versão final.

## Histórias de usuário

### HU-01: Rodar o projeto a partir do README
**Como** avaliadora do projeto, **quero** instruções claras para instalar e rodar o backend e o frontend, **para** executar a aplicação sem precisar de ajuda nem ler o código.

Critérios de aceite: REQ-EN-01, REQ-EN-02, REQ-EN-03, REQ-EN-04, REQ-EN-05, REQ-EN-06, REQ-EN-07, REQ-EN-08, REQ-EN-12.

### HU-02: Entender o projeto pelo README
**Como** avaliadora do projeto, **quero** um resumo da API, das configurações e da organização das specs, **para** entender o que foi feito e como foi planejado.

Critérios de aceite: REQ-EN-09, REQ-EN-10, REQ-EN-11.

### HU-03: Acessar o código no GitHub
**Como** avaliadora do projeto, **quero** acessar o código num repositório público com a versão final, **para** clonar e avaliar a entrega.

Critérios de aceite: REQ-EN-13, REQ-EN-14, REQ-EN-15.

### HU-04: Ver a página do evento em qualquer tela
**Como** visitante do site, **quero** que a página do evento se adapte ao celular e ao computador na versão entregue, **para** ler sobre o evento em qualquer dispositivo.

Critérios de aceite: REQ-EN-16.

## Critérios de aceite (EARS)

### README

| ID        | Critério (EARS)                                                                                                                                                                                                                       | Origem                                                    | Verificação |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| REQ-EN-01 | O SISTEMA DEVE ter um arquivo `README.md` na raiz do repositório, escrito em português.                                                                                                                                               | Enunciado: "README com instruções"; decisão (D-01)        | manual      |
| REQ-EN-02 | O README DEVE descrever em poucas frases o que é o projeto e qual a stack usada no backend e no frontend.                                                                                                                              | Decisão (D-02)                                            | manual      |
| REQ-EN-03 | O README DEVE informar os pré-requisitos para rodar o projeto: Node.js na versão mínima exigida pelas dependências, npm e Git, e a versão do Node.js em que o projeto foi testado (24).                                                 | Decisão (D-03)                                            | manual      |
| REQ-EN-04 | O README DEVE trazer o comando para clonar o repositório (`git clone https://github.com/Dybekz/inscricao-evento.git`) e entrar na pasta dele.                                                                                           | Decisão (D-09)                                            | manual      |
| REQ-EN-05 | O README DEVE trazer os comandos para instalar as dependências e rodar o backend, e informar o endereço em que a API fica disponível (`http://localhost:3001`).                                                                         | Enunciado: "instruções para rodar backend"                | manual      |
| REQ-EN-06 | O README DEVE trazer os comandos para instalar as dependências e rodar o frontend, informar o endereço do site (`http://localhost:5173`) e avisar que o backend precisa estar rodando ao mesmo tempo, em outro terminal.                | Enunciado: "instruções para rodar [...] frontend"         | manual      |
| REQ-EN-07 | O README DEVE trazer o comando para rodar os testes de cada pacote (backend e frontend).                                                                                                                                              | Decisão (D-02)                                            | manual      |
| REQ-EN-08 | O README DEVE explicar as variáveis de ambiente `PORT` (porta da API, padrão `3001`) e `VITE_API_URL` (endereço da API usado pelo front, padrão `http://localhost:3001`), e avisar que o front precisa rodar na porta `5173`, a única liberada pelo CORS da API. | Decisão (D-02); REQ-BE-19, REQ-BE-20, REQ-FE-29, REQ-FE-30 | manual      |
| REQ-EN-09 | O README DEVE resumir os 3 endpoints (`GET /inscricoes`, `POST /inscricoes`, `DELETE /inscricoes/:id`), o modelo da inscrição, os valores aceitos em `tipoIngresso`, os campos obrigatórios e a regra de e-mail duplicado (resposta `400`). | Enunciado: endpoints, modelo e regras; decisão (D-02)     | manual      |
| REQ-EN-10 | O README DEVE avisar que as inscrições ficam guardadas em memória e somem quando a API é reiniciada.                                                                                                                                  | Decisão (D-02); decisão D-01 de `01-api-inscricoes`       | manual      |
| REQ-EN-11 | O README DEVE ter uma seção curta explicando que a pasta `specs/` guarda os requisitos, o design e as tarefas de cada parte do projeto, chamando o documento de regras de "regras do projeto", sem citar o nome desse arquivo nem ferramentas usadas no desenvolvimento. | Decisão (D-04, D-05)                                      | manual      |

### Verificação do README

| ID        | Critério (EARS)                                                                                                                                                                                                                                                      | Origem         | Verificação |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| REQ-EN-12 | QUANDO alguém clonar o repositório numa pasta vazia e seguir apenas o README, O SISTEMA DEVE permitir instalar as dependências, subir a API e o site, criar uma inscrição, vê-la na lista de inscritos e excluí-la, e as suítes de testes do backend e do frontend DEVEM passar. | Decisão (D-06) | manual      |

### Repositório

| ID        | Critério (EARS)                                                                                                                                    | Origem                                              | Verificação |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| REQ-EN-13 | O SISTEMA DEVE estar num repositório público no GitHub, em `https://github.com/Dybekz/inscricao-evento`, acessível sem login.                       | Enunciado: "Entrega em repositório público no GitHub"; decisão (D-08) | manual      |
| REQ-EN-14 | O branch `main` do repositório remoto DEVE conter o último commit da entrega, sem commits locais pendentes de envio.                                | Decisão (D-08)                                      | manual      |
| REQ-EN-15 | O repositório NÃO DEVE conter pastas `node_modules`, arquivos `.env` nem arquivos gerados pelo build (como `dist/`).                                 | Decisão (D-08)                                      | manual      |

## Requisitos não funcionais

| ID        | Critério (EARS)                                                                                                                                                                                                             | Origem                                               | Verificação |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| REQ-EN-16 | Na versão entregue, a tela do evento DEVE continuar atendendo ao REQ-FE-31: legível e sem rolagem horizontal da página de 360px até telas de computador. A conferência é manual, feita na revisão desta feature.            | Enunciado: "Página do evento responsiva"; decisão (D-07) | manual      |

## Fora de escopo

- Alterar as specs das features `01-api-inscricoes` e `02-frontend-telas`, inclusive as referências ao documento de regras (D-05).
- Reescrever ou limpar o histórico do Git.
- README em outro idioma além do português.
- Capturas de tela no README (D-10).
- Descrição, tópicos ou outras configurações da página do repositório no GitHub.
- Comando único na raiz para subir os dois pacotes; cada pacote roda no seu terminal.
- Deploy, CI (GitHub Actions), Docker e licença.
- Mudanças de código no backend ou no frontend.

## Dúvidas em aberto

| ID   | Dúvida                                              | Opções                                                                                                   | Decisão                                                                                                                                                                                                                                         | Resolvida? |
| ---- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-01 | Idioma do README                                    | (a) português; (b) inglês; (c) os dois                                                                   | (a) Português.                                                                                                                                                                                                                                  | sim        |
| D-02 | O que o README cobre                                | (a) o mínimo para rodar; (b) o mínimo, mais descrição, testes, variáveis, endpoints e aviso da memória; (c) (b) mais estrutura e decisões | (b).                                                                                                                                                                                                                                            | sim        |
| D-03 | Versão do Node.js                                   | (a) versão mínima exigida pelas dependências; (b) só a versão testada                                    | (a), confirmada no design, citando também que foi testado no Node 24.                                                                                                                                                                           | sim        |
| D-04 | Citar as specs no README                            | (a) não citar; (b) seção curta sobre `specs/`, sem citar ferramentas                                     | (b).                                                                                                                                                                                                                                            | sim        |
| D-05 | Referências ao documento de regras                  | (a) deixar como está; (b) reescrever nas specs; (c) (b) e limpar o histórico                             | No README, o documento de regras é chamado de "regras do projeto", sem citar o nome do arquivo. O resto do projeto (specs das features 01 e 02, histórico) fica como está.                                                                       | sim        |
| D-06 | Como verificar que o README funciona                | (a) ler e conferir; (b) clonar numa pasta temporária e seguir o README passo a passo                     | (b).                                                                                                                                                                                                                                            | sim        |
| D-07 | Responsividade na entrega                           | (a) reconferir o REQ-FE-31 na versão final; (b) requisitos novos                                         | (a).                                                                                                                                                                                                                                            | sim        |
| D-08 | O que conta como "entregue no GitHub"               | —                                                                                                        | Repositório público, `main` do remoto com o último commit, sem `node_modules`, `.env` nem build, e README na raiz. O push é feito só quando a usuária pedir.                                                                                     | sim        |
| D-09 | Comando de clone no README                          | (a) sim, com a URL; (b) não                                                                              | (a).                                                                                                                                                                                                                                            | sim        |
| D-10 | Capturas de tela no README                          | (a) não; (b) 1 a 3 imagens                                                                               | (a).                                                                                                                                                                                                                                            | sim        |
| D-11 | Fora de escopo                                      | —                                                                                                        | Conforme a seção "Fora de escopo".                                                                                                                                                                                                              | sim        |
