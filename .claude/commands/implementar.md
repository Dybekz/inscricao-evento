---
description: Fase 4 do SDD. Implementa UMA tarefa de um tasks.md aprovado, roda os testes e marca o checkbox
argument-hint: <feature> <n-da-tarefa>  (ex: 01-api-inscricoes T01, ou 01-api-inscricoes 1)
---

Argumentos: **$ARGUMENTS**

O primeiro argumento é a feature (pasta em `specs/`). O segundo é a tarefa: aceite `T01`, `t1`, `01` ou `1`, normalizando para `Tnn`.

Você está na fase de **Implementação** do fluxo SDD. Siga a **regra de ouro** do `CLAUDE.md` (seção 5): só se escreve código para a tarefa pedida, e só se ela estiver num `tasks.md` aprovado.

## 0. Verificações (pare se alguma falhar)

1. Se faltar algum argumento, ou a feature não existir, explique o uso e pare. Se faltar só a tarefa, mostre as tarefas pendentes da feature e pare.
2. `specs/<feature>/tasks.md` precisa estar com `Status: aprovado`. **Se não estiver, recuse** e sugira `/spec-tarefas <feature>`. Pare.
3. A tarefa precisa existir no `tasks.md`. Se não existir, diga isso e pare. **Não invente a tarefa.**
4. Se a tarefa já estiver `[x]`, avise e pergunte se é para refazer. Pare até ela responder.
5. Todas as tarefas listadas em **Depende de** precisam estar `[x]`. Se não estiverem, liste as pendentes e pare.

## 1. Preparação

1. Leia o `CLAUDE.md` (convenções, definição de pronto, testes).
2. Leia a tarefa inteira, os `REQ-*` que ela referencia no `requirements.md` e as seções correspondentes do `design.md`.
3. Leia o código que já existe nos arquivos afetados.

## 2. Implementar

- Faça **só** o que a tarefa descreve, nos arquivos listados.
- Escreva ou atualize os testes dos requisitos da tarefa. **O nome de cada teste começa com o ID do requisito**, ex: `it('REQ-BE-03: retorna 400 quando o e-mail já existe', ...)`.
- Código e nomes de domínio em português (`inscricoes`, `tipoIngresso`).
- **Se surgir algo que não está na spec** (um arquivo não listado que precisa mudar, uma dependência nova não prevista, um caso de borda sem requisito, um contrato que não fecha): **PARE antes de codar isso**, explique o problema e proponha a atualização da spec (`requirements.md`, `design.md` ou `tasks.md`). Só continue depois da aprovação dela.

## 3. Verificar

1. Rode a suíte de testes **inteira** do pacote afetado (`npm test` em `backend/` e/ou `frontend/`) e mostre o resultado.
2. Se algum teste falhar, corrija dentro do escopo da tarefa e rode de novo. Se a correção sair do escopo, pare e reporte.
3. Verifique um por um os itens do **Critério de pronto** da tarefa e mostre a evidência (saída dos testes, comando executado).

## 4. Fechar a tarefa

Só se a Definição de Pronto (`CLAUDE.md`, seção 8) estiver cumprida:

1. Marque o checkbox da tarefa no `tasks.md` (`- [ ]` → `- [x]`).
2. Atualize na **Matriz de rastreabilidade** as linhas dos requisitos da tarefa (testes reais e status `implementado`).
3. Sugira a mensagem de commit, no padrão do `CLAUDE.md`:
   ```
   <tipo>/<escopo> - <o que foi feito>
   ```
   Faça o commit **só** se ela pedir.

## 5. PARE

Mostre um resumo curto: arquivos criados ou alterados, testes (passaram/total), critério de pronto verificado e qual é a próxima tarefa disponível. **Não comece a próxima tarefa.**
