---
description: Fase 3 do SDD. Exige design aprovado. Quebra a feature em tarefas no tasks.md
argument-hint: <feature>  (ex: 01-api-inscricoes)
---

Feature: **$ARGUMENTS**

Você está na fase de **Tarefas** do fluxo SDD (ver `CLAUDE.md`, seção 4). Nesta fase **não** se escreve código.

## 0. Verificações (pare se alguma falhar)

1. Se `$ARGUMENTS` estiver vazio, ou `specs/$ARGUMENTS/` não existir, liste as features disponíveis e pare.
2. Confirme que `requirements.md` **e** `design.md` estão com `Status: aprovado`. **Se o design não estiver aprovado, recuse** e sugira `/spec-design $ARGUMENTS`. Pare.
3. Se o `tasks.md` já estiver `aprovado`, avise que alterá-lo exige nova aprovação e pergunte se ela quer reabrir. Pare até ela responder. Nunca desmarque checkboxes já marcados sem que ela peça.

## 1. Preparação

Leia o `CLAUDE.md` (seções 5 a 9), e o `requirements.md` e o `design.md` aprovados desta feature.

## 2. Preencher o `tasks.md`

Siga o template, removendo os comentários de instrução:

- Tarefas **pequenas** (um commit cada), **ordenadas** e numeradas `T01`, `T02`...
- Cada tarefa tem: **Descrição**, **Requisitos** (IDs), **Arquivos** (criar ou alterar), **Critério de pronto** verificável, **Depende de** e **Commit sugerido** (Conventional Commits).
- A primeira tarefa costuma ser o scaffolding do pacote (package.json, configuração do Vitest, script `npm test`), já que scaffolding também é código e precisa de uma tarefa.
- Prefira colocar o teste de um requisito **na mesma tarefa** que o implementa.
- **Todo** `REQ-*` do `requirements.md` aparece em pelo menos uma tarefa. Requisitos de verificação manual ganham uma tarefa de verificação.
- Não crie tarefa para nada que não esteja no design. Se faltar algo no design, pare e proponha a alteração no `design.md`.
- Preencha a **Matriz de rastreabilidade** (requisito → tarefas → testes previstos → `pendente`).
- Mantenha `Status: rascunho` e `Revisão: pendente`.

## 3. PARE e peça aprovação

Mostre a lista de tarefas, uma linha cada (`Tnn: título (REQs)`), e confirme que a matriz cobre todos os requisitos. Pergunte se ela aprova as tarefas.

Só com aprovação explícita: mude para `Status: aprovado`, preencha `Aprovado em:`, sugira o commit `docs(specs): aprova tarefas de $ARGUMENTS` e diga que o próximo passo é `/implementar $ARGUMENTS T01`. **Não comece a implementar.**
