---
description: Fase 5 do SDD. Confere o código contra a spec de uma feature e lista as lacunas
argument-hint: <feature>  (ex: 01-api-inscricoes)
---

Feature: **$ARGUMENTS**

Você está na fase de **Revisão** do fluxo SDD. O objetivo é **conferir**, não consertar: não altere código nesta fase.

## 0. Verificações

1. Se `$ARGUMENTS` estiver vazio, ou a feature não existir, liste as features disponíveis e pare.
2. Confirme que `requirements.md`, `design.md` e `tasks.md` estão `aprovado`. Se algum não estiver, diga qual e pare.
3. Se houver tarefas `[ ]` no `tasks.md`, diga quais são e pergunte se ela quer uma revisão parcial. Pare até ela responder.

## 1. Levantamento

1. Leia o `CLAUDE.md` e o `requirements.md`, o `design.md` e o `tasks.md` da feature.
2. Leia o código da feature (`backend/` e/ou `frontend/`) e os testes.
3. Rode a suíte de testes do(s) pacote(s) e guarde o resultado.

## 2. Conferência por requisito

Para **cada** `REQ-*` do `requirements.md`, determine:

- **Implementado?** Onde (`arquivo:linha`).
- **Testado?** Qual teste cita o ID no nome, e se ele passa. Nos requisitos de verificação manual, faça a verificação (ou diga como ela deve ser feita) e registre.
- **Conforme?** O comportamento bate com o critério EARS e com o contrato do `design.md` (status HTTP, formato do JSON de erro, nomes de campos, rotas)?

Confira também:
- código que **não corresponde a nenhuma tarefa ou requisito** (escopo extra);
- tarefas marcadas `[x]` cujo critério de pronto não se sustenta;
- desvios das convenções do `CLAUDE.md` (nomes em português, testes com ID, estrutura de pastas).

## 3. Relatório

Apresente:

1. **Resultado dos testes** (passaram/total).
2. **Tabela por requisito:** `| REQ | Implementado | Teste | Conforme | Observação |`
3. **Lacunas**, em três listas:
   - requisitos **sem implementação**;
   - requisitos **sem teste** (ou com teste falhando);
   - requisitos **implementados de forma divergente** da spec (o que diz a spec, o que o código faz, `arquivo:linha`).
4. **Escopo extra** e desvios de convenção, se houver.
5. Para cada lacuna, a ação sugerida: corrigir o código (nova tarefa no `tasks.md`) **ou** corrigir a spec, se era a spec que estava errada.

## 4. Registrar e PARE

- Anote o resultado em "Registro de revisão" no `tasks.md` (data, testes, lacunas) e atualize a coluna Status da matriz de rastreabilidade.
- Se não houver lacunas, pergunte se ela aprova a revisão. Só com aprovação explícita, mude `Revisão: pendente` para `Revisão: aprovada` e indique a próxima feature na ordem (`01 → 02 → 03`).
- Se houver lacunas, **não** aprove: proponha as tarefas de correção (elas entram no `tasks.md`, que volta para `rascunho` até ela aprovar) e pare.
