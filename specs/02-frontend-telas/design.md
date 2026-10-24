> **Feature:** 02-frontend-telas
> **Documento:** design
> **Status:** rascunho
> **Aprovado em:**

# Design — 02-frontend-telas

<!--
INSTRUÇÕES (remover os comentários ao preencher)

- Pré-condição: requirements.md desta feature com Status: aprovado.
- Este documento descreve COMO atender os requisitos. Toda decisão deve citar
  os REQ-FE-NN que atende.
- Não introduza comportamento que não esteja nos requisitos. Se precisar,
  proponha a mudança no requirements.md primeiro.
- Seções que não se aplicam a esta feature: manter o título e escrever
  "Não se aplica: <motivo>".
-->

## Visão geral e arquitetura

<!--
Como as peças se encaixam. Um diagrama simples em texto ajuda, ex:

  [React (Vite :5173)] --HTTP/JSON--> [Express (:3000)] --> [repositório] --> [SQLite | array]

Estrutura de pastas/arquivos que esta feature cria ou altera.
-->

## Contratos da API

<!--
Para CADA endpoint:

### <MÉTODO> <rota>
- **Requisitos:** REQ-...
- **Request:** headers, params, body (com exemplo JSON)
- **Respostas de sucesso:** status + exemplo JSON
- **Respostas de erro:** status + exemplo JSON + quando ocorre

Formato padrão do JSON de erro (definir UM formato e usar em todos os erros), ex:
  { "erro": "mensagem legível", "campos": { "email": "..." } }

Inclua também: CORS, Content-Type, comportamento para rota inexistente e JSON malformado.
-->

## Modelo de dados

<!--
- Entidade(s), campos, tipos, obrigatoriedade, regras de validação.
- Como o id é gerado e se pode ser reaproveitado.
- Restrições (ex: unicidade de e-mail, comparação case-sensitive ou não).
- Esquema SQL ou forma do array, conforme a decisão de persistência.
-->

## Componentes e rotas do frontend

<!--
- Tabela de rotas do React Router: caminho → componente → requisito.
- Árvore de componentes e responsabilidade de cada um.
- Estado: onde mora, como é carregado, estados de carregamento/erro/vazio.
- Camada de acesso à API (ex: src/api/inscricoes.js) e URL base.
- Estratégia de responsividade (breakpoints, mobile-first etc.).
-->

## Decisões técnicas

<!--
Cada decisão no formato ADR curto:

### DT-01: <título>  (ex: SQLite vs. memória)
- **Contexto:** ...
- **Opções consideradas:** ...
- **Decisão:** ...
- **Justificativa:** ...
- **Consequências:** ...
- **Requisitos relacionados:** REQ-...
-->

## Estratégia de testes

<!--
- O que será testado, com qual ferramenta e em qual nível.
- Mapa requisito → teste(s) previsto(s).
- Como isolar estado entre testes (ex: resetar o repositório em memória).
-->

## Riscos e pontos de atenção

<!-- Opcional. -->
