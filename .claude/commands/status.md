---
description: Mostra em que fase do SDD cada feature está e a próxima ação
---

Você vai relatar o estado do fluxo SDD deste repositório. **Não altere nenhum arquivo.**

## Passos

1. Leia o `CLAUDE.md` (seções 4 e 10) para lembrar as regras do fluxo e a ordem das features.
2. Para cada pasta em `specs/` (em ordem numérica), leia o cabeçalho de `requirements.md`, `design.md` e `tasks.md`:
   - `Status:` (`rascunho` | `aprovado`)
   - `Aprovado em:`
   - em `tasks.md`, também `Revisão:` (`pendente` | `aprovada`)
3. Para distinguir "template vazio" de "rascunho em andamento": um documento está **vazio** se, fora dos comentários `<!-- -->`, ele não tem conteúdo além dos títulos.
4. Em um `tasks.md` aprovado, conte os checkboxes `- [x]` e `- [ ]` das tarefas.
5. Em `requirements.md`, conte as dúvidas em aberto não resolvidas.
6. Determine a fase de cada feature:

   | Situação                                          | Fase                              | Próxima ação                           |
   | ------------------------------------------------- | --------------------------------- | -------------------------------------- |
   | requirements vazio                                | Requisitos (não iniciada)         | `/spec-requisitos <feature>`           |
   | requirements com conteúdo, rascunho               | Requisitos (aguardando aprovação) | revisar e aprovar os requisitos        |
   | requirements aprovado, design vazio ou rascunho   | Design                            | `/spec-design <feature>` ou aprovar    |
   | design aprovado, tasks vazio ou rascunho          | Tarefas                           | `/spec-tarefas <feature>` ou aprovar   |
   | tasks aprovado, ainda há tarefas `[ ]`            | Implementação (x/y)               | `/implementar <feature> <próxima Tnn>` |
   | todas as tarefas `[x]`, `Revisão: pendente`       | Revisão                           | `/revisar <feature>`                   |
   | `Revisão: aprovada`                               | Concluída                         | nenhuma                                |

   Na Implementação, a próxima tarefa é a primeira `[ ]` cujas dependências estão todas `[x]`.

7. Procure inconsistências e reporte-as como alertas, por exemplo:
   - documento `aprovado` depois de um anterior ainda em `rascunho`;
   - requisitos aprovados com dúvidas em aberto;
   - código em `backend/` ou `frontend/` sem um `tasks.md` aprovado correspondente;
   - feature começada antes de a anterior estar concluída (ordem: 01 → 02 → 03).

## Saída

Uma tabela curta:

| Feature | Requisitos | Design | Tarefas | Implementação | Revisão | Fase atual |

Depois, os alertas (se houver) e **uma** linha com a próxima ação recomendada para o projeto como um todo, respeitando a ordem das features.
