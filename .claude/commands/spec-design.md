---
description: Fase 2 do SDD. Exige requisitos aprovados. Preenche o design.md de uma feature
argument-hint: <feature>  (ex: 01-api-inscricoes)
---

Feature: **$ARGUMENTS**

Você está na fase de **Design** do fluxo SDD (ver `CLAUDE.md`, seção 4). Nesta fase **não** se escrevem tarefas nem código.

## 0. Verificações (pare se alguma falhar)

1. Se `$ARGUMENTS` estiver vazio, ou `specs/$ARGUMENTS/` não existir, liste as features disponíveis e pare.
2. Leia o cabeçalho de `specs/$ARGUMENTS/requirements.md`. **Se não for `Status: aprovado`, recuse**: diga que os requisitos precisam ser aprovados antes e sugira `/spec-requisitos $ARGUMENTS`. Pare.
3. Se o `design.md` já estiver `aprovado`, avise que alterá-lo fará ele (e o `tasks.md`) voltar para `rascunho`, e pergunte se ela quer reabrir. Pare até ela responder.

## 1. Preparação

1. Leia o `CLAUDE.md` (stack, estrutura do monorepo, convenções, testes).
2. Leia por inteiro o `requirements.md` aprovado desta feature.
3. Leia os `design.md` já aprovados de outras features. Contratos já definidos (ex: o formato do JSON de erro da API, a porta do backend) **devem ser reaproveitados**, não redefinidos.
4. Se uma escolha de design tiver alternativas com impacto real (ex: SQLite vs. memória, uma biblioteca de CSS, como configurar a URL da API), apresente as opções com a sua recomendação e **pergunte antes de decidir**. Nas escolhas menores, decida e registre a justificativa.

## 2. Preencher o `design.md`

Siga a estrutura do template, removendo os comentários de instrução:

- **Arquitetura** e estrutura de pastas e arquivos afetados.
- **Contratos da API**: para cada endpoint, request, response, status de sucesso e de erro, com exemplos JSON, incluindo o **formato padrão do JSON de erro**. Para o frontend, os contratos que ele consome.
- **Modelo de dados**: campos, tipos, validações, geração de id, unicidade.
- **Componentes e rotas do front** (quando se aplicar).
- **Decisões técnicas** no formato DT-NN, com contexto, opções, decisão e justificativa.
- **Estratégia de testes**, com o mapa requisito → teste previsto.

Regras:
- Todo `REQ-*` do `requirements.md` precisa estar coberto por alguma parte do design. Cite os IDs.
- **Não introduza comportamento novo.** Se perceber que falta um requisito, pare e proponha a alteração no `requirements.md` (o que o fará voltar para `rascunho`).
- Seções que não se aplicam: "Não se aplica: <motivo>".
- Mantenha `Status: rascunho`.

## 3. PARE e peça aprovação

Mostre um resumo das decisões principais e confirme que todos os requisitos foram cobertos (se algum não foi, liste com o motivo). Pergunte se ela aprova o design.

Só com aprovação explícita: mude para `Status: aprovado`, preencha `Aprovado em:`, sugira o commit `docs(specs): aprova design de $ARGUMENTS` e diga que o próximo passo é `/spec-tarefas $ARGUMENTS`. **Não crie as tarefas.**
