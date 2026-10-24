---
description: Fase 1 do SDD. Levanta dúvidas, pergunta e preenche o requirements.md de uma feature
argument-hint: <feature>  (ex: 01-api-inscricoes)
---

Feature: **$ARGUMENTS**

Você está na fase de **Requisitos** do fluxo SDD (ver `CLAUDE.md`, seção 4). Nesta fase **não** se escreve design, tarefas nem código.

## 0. Verificações (pare se alguma falhar)

1. Se `$ARGUMENTS` estiver vazio, ou `specs/$ARGUMENTS/` não existir, liste as features disponíveis em `specs/` e pare.
2. Leia `specs/$ARGUMENTS/requirements.md`. Se o `Status:` for `aprovado`, avise que os requisitos já estão aprovados e que alterá-los fará o documento (e o design e as tarefas dependentes) voltar para `rascunho`. Pergunte se a usuária quer reabrir e pare até ela responder.
3. Verifique a ordem das features (`01 → 02 → 03`). Se uma feature anterior não estiver com `Revisão: aprovada` no `tasks.md` dela, avise e pergunte se a usuária quer seguir mesmo assim. Pare até ela responder. (`01-api-inscricoes` não tem anterior.)

## 1. Análise (sem escrever no arquivo ainda)

1. Leia o `CLAUDE.md` inteiro, em especial a seção 2 (**enunciado, a fonte da verdade**).
2. Se existirem, leia os `requirements.md` já aprovados de outras features, para manter consistência de IDs e decisões.
3. Recorte do enunciado o que pertence a esta feature:
   - `01-api-inscricoes`: endpoints, modelo, regras de validação e de unicidade, persistência.
   - `02-frontend-telas`: as 3 telas, navegação com React Router, integração com a API.
   - `03-entrega`: README, responsividade da página do evento, repositório público no GitHub.
4. Levante as **ambiguidades e lacunas**. Pense em: formatos e validações (e-mail, telefone, tamanho do nome), espaços e maiúsculas, código de status de cada caso (sucesso, não encontrado, validação), formato da mensagem de erro, ordem da listagem, o que acontece ao reiniciar o servidor, casos de borda (id inexistente, id não numérico, corpo vazio, `tipoIngresso` inválido) e o que fica fora de escopo.

## 2. Perguntas à usuária, e PARE

Apresente as dúvidas numeradas (`D-01`, `D-02`...). Para cada uma, dê a pergunta, as opções e a sua **recomendação** com uma frase de justificativa. Agrupe por tema e seja objetiva: priorize o que muda comportamento observável.

**Pare aqui e espere as respostas.** Não preencha o arquivo nesta resposta.

## 3. Preencher o `requirements.md` (depois das respostas)

1. Siga a estrutura e as instruções do template em `specs/$ARGUMENTS/requirements.md`, removendo os comentários de instrução.
2. Escreva as histórias de usuário (`HU-NN`) e os critérios de aceite em **EARS**, com IDs únicos (`REQ-BE-NN`, `REQ-FE-NN` ou `REQ-EN-NN`, conforme a feature). Cada critério deve ser verificável e indicar a origem (trecho do enunciado ou dúvida `D-NN`).
3. Registre as respostas na tabela "Dúvidas em aberto", como resolvidas. Se alguma ficou sem resposta, mantenha-a como não resolvida.
4. Preencha "Fora de escopo".
5. Mantenha `Status: rascunho`.

## 4. PARE e peça aprovação

Mostre um resumo: quantas histórias, a lista de IDs com uma linha cada, o que ficou fora de escopo e as dúvidas que ainda estão abertas (se houver). Pergunte se ela aprova os requisitos.

Só depois de uma aprovação explícita: mude o cabeçalho para `Status: aprovado`, preencha `Aprovado em:` com a data de hoje, sugira o commit `docs/specs - aprova requisitos de $ARGUMENTS` e diga que o próximo passo é `/spec-design $ARGUMENTS`. **Não comece o design.**
