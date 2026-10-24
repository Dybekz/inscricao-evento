# CLAUDE.md — Constituição do projeto

Este arquivo define as regras do projeto. Ele vale mais que qualquer preferência implícita. Em caso de conflito entre uma spec e este arquivo, **este arquivo vence**. Em caso de conflito entre uma spec e o enunciado, **o enunciado vence**, e a spec deve ser corrigida.

---

## 1. Visão geral

**Site de Evento com Inscrições**: uma aplicação para divulgar um evento fictício de tecnologia e receber inscrições.

### Stack

| Camada       | Tecnologia                                                  |
| ------------ | ----------------------------------------------------------- |
| Backend      | Node.js + Express                                           |
| Persistência | SQLite **ou** em memória (array no Node). Sem banco externo |
| Frontend     | React + Vite + React Router                                 |
| Estilização  | Livre                                                       |
| Testes (BE)  | Vitest + Supertest                                          |
| Testes (FE)  | Vitest + React Testing Library                              |

---

## 2. Enunciado original (fonte da verdade)

> Não altere esta seção. Toda spec deriva dela.

**Site de Evento com Inscrições**: uma aplicação para divulgar um evento fictício de tecnologia e receber inscrições.

**Stack:**
- Backend: Node.js + Express
- Persistência: SQLite ou em memória (array no Node). Sem banco externo.
- Frontend: React + React Router
- Estilização: livre

**Backend, endpoints:**
- `GET /inscricoes`: lista todas as inscrições
- `POST /inscricoes`: cria uma inscrição
- `DELETE /inscricoes/:id`: remove uma inscrição

**Modelo:**
```json
{ "id": 1, "nome": "Maria Silva", "email": "maria@email.com", "telefone": "(11) 99999-9999", "tipoIngresso": "estudante" }
```
O campo `tipoIngresso` aceita `"estudante"` ou `"profissional"`.

**Regras:**
- Não permitir dois cadastros com o mesmo e-mail. Nesse caso, retornar 400 com mensagem de erro.
- Validar os campos obrigatórios: nome, e-mail e tipoIngresso.

**Frontend, 3 telas:**
1. **Tela principal:** divulga o evento com nome, data, local, texto sobre o evento, palestrantes e um botão "Inscreva-se" que leva à tela de inscrição. Os dados podem ser fixos no front.
2. **Tela de inscrição:** formulário com nome, e-mail, telefone (opcional) e tipo de ingresso (estudante/profissional).
3. **Tela de inscritos:** lista todos os inscritos com opção de excluir. Não precisa de login.

**Requisitos obrigatórios:**
- As 3 telas funcionando e navegáveis pelo React Router
- Página do evento responsiva
- README com instruções para rodar backend e frontend
- Entrega em repositório público no GitHub

---

## 3. Estrutura do monorepo

```
inscricao-evento/
├── CLAUDE.md                 # esta constituição
├── README.md                 # instruções para rodar (feature 03)
├── .claude/
│   └── commands/             # comandos do fluxo SDD
├── specs/
│   ├── 01-api-inscricoes/    # requirements.md, design.md, tasks.md
│   ├── 02-frontend-telas/
│   └── 03-entrega/
├── backend/                  # Node.js + Express (criado na implementação)
└── frontend/                 # React + Vite + React Router (criado na implementação)
```

`backend/` e `frontend/` só passam a existir quando uma tarefa aprovada mandar criá-los.

---

## 4. Fluxo SDD obrigatório

```
Requisitos  →  Design  →  Tarefas  →  Implementação  →  Revisão
```

1. **Requisitos** (`requirements.md`): o quê e por quê. Histórias de usuário e critérios de aceite em EARS.
2. **Design** (`design.md`): como. Arquitetura, contratos, modelo de dados, componentes e decisões.
3. **Tarefas** (`tasks.md`): passos pequenos, ordenados e rastreáveis.
4. **Implementação**: uma tarefa por vez, com testes.
5. **Revisão**: conferir o código contra a spec.

### Regras do fluxo

- **Nenhuma fase começa sem aprovação explícita da anterior.** Aprovação explícita é a usuária dizer no chat algo como "aprovado", "pode seguir" ou "aprovo os requisitos". Silêncio, ou uma resposta ambígua, **não** conta como aprovação.
- **Ao terminar cada fase, PARE** e peça aprovação. Não emende a fase seguinte na mesma resposta.
- Só o Claude altera o cabeçalho `Status:` de `rascunho` para `aprovado`, e **só** depois da aprovação explícita. Junto com isso, preencha `Aprovado em:` com a data.
- Se um documento já aprovado precisar mudar, ele volta para `Status: rascunho` e precisa ser aprovado de novo. As fases seguintes que dependem dele também voltam a `rascunho` se a mudança as afetar.
- Dúvidas em aberto bloqueiam a aprovação: um `requirements.md` com itens não resolvidos em "Dúvidas em aberto" não pode ser aprovado.

### Cabeçalho de status

Todo arquivo de spec começa com:

```markdown
> **Feature:** 01-api-inscricoes
> **Documento:** requisitos | design | tarefas
> **Status:** rascunho | aprovado
> **Aprovado em:** AAAA-MM-DD (vazio enquanto rascunho)
```

O `tasks.md` tem também `> **Revisão:** pendente | aprovada`, atualizado ao final da fase de Revisão.

### Ordem das features

```
01-api-inscricoes  →  02-frontend-telas  →  03-entrega
```

A feature seguinte só começa a fase de Requisitos quando a anterior estiver com a revisão aprovada, a não ser que a usuária autorize explicitamente o paralelismo.

---

## 5. Regra de ouro

> **Código só é escrito para tarefas que existem em um `tasks.md` aprovado.**

- Se, durante a implementação, surgir algo que não está na spec (um caso de borda, uma dependência, um arquivo extra, uma mudança de contrato), **pare** e proponha uma atualização da spec antes de codar.
- Não faça "melhorias de passagem" fora do escopo da tarefa atual.
- Configuração e scaffolding (package.json, vite.config, etc.) também são código: precisam de uma tarefa.

---

## 6. Rastreabilidade

- Cada requisito tem um ID único e estável:
  - `REQ-BE-NN`: backend (feature 01)
  - `REQ-FE-NN`: frontend (feature 02)
  - `REQ-EN-NN`: entrega (feature 03)
- IDs nunca são reaproveitados. Um requisito removido fica riscado (`~~REQ-BE-04~~`) com o motivo.
- Cada tarefa em `tasks.md` lista os IDs dos requisitos que atende.
- Cada teste cita o requisito que valida, no nome do teste:
  ```js
  it('REQ-BE-03: retorna 400 quando o e-mail já está cadastrado', ...)
  ```
- Todo requisito testável precisa de pelo menos um teste. Requisitos não testáveis automaticamente (ex: "repositório público") são verificados manualmente na revisão, e isso fica registrado.

---

## 7. Convenções

### Idioma e nomes
- Código, nomes de domínio, rotas e campos em **português**, conforme o enunciado: `inscricoes`, `nome`, `email`, `telefone`, `tipoIngresso`.
- Termos técnicos padrão do ecossistema ficam em inglês (`app`, `router`, `req`, `res`, `useEffect`).
- Specs, comentários e mensagens de erro para o usuário em português.

### Commits
- **Commits pequenos, um por tarefa**, no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
  ```
  <tipo>(<escopo>): <descrição curta no imperativo>

  Tarefa: 01-api-inscricoes#T03
  Requisitos: REQ-BE-02, REQ-BE-03
  ```
- Tipos: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`, `style`.
- Escopos: `backend`, `frontend`, `specs`, `docs`.
- Mudanças em spec usam `docs(specs): ...`.
- O Claude **sugere** a mensagem de commit e só faz o commit se a usuária pedir.

---

## 8. Definição de pronto (tarefa)

Uma tarefa só está pronta quando **todos** os itens abaixo são verdadeiros:

- [ ] Implementada conforme a descrição e os arquivos listados na tarefa
- [ ] Testes escritos para os requisitos da tarefa, e **toda** a suíte do pacote passando
- [ ] Critério de pronto da tarefa verificado (e mostrado à usuária)
- [ ] Checkbox marcado no `tasks.md`

---

## 9. Testes

- **Backend:** Vitest + Supertest. Testar os endpoints via HTTP (`request(app)`), sem subir porta. O `app` Express deve ser exportado separado do `listen` para isso funcionar.
- **Frontend:** Vitest + React Testing Library (+ jsdom). Cobertura mínima obrigatória:
  - o **formulário de inscrição** (validação, envio, exibição de erro da API);
  - a **lista de inscritos** (renderização e exclusão).
- Chamadas à API nos testes de frontend são mockadas.
- Cada teste cita o ID do requisito no nome (ver seção 6).

---

## 10. Comandos do fluxo

| Comando                               | O que faz                                                          |
| ------------------------------------- | ------------------------------------------------------------------ |
| `/status`                             | Mostra a fase de cada feature e a próxima ação                     |
| `/spec-requisitos <feature>`          | Levanta dúvidas, pergunta, preenche `requirements.md` e para       |
| `/spec-design <feature>`              | Exige requisitos aprovados. Preenche `design.md` e para            |
| `/spec-tarefas <feature>`             | Exige design aprovado. Preenche `tasks.md` e para                  |
| `/implementar <feature> <n>`          | Exige tarefas aprovadas. Implementa UMA tarefa, testa, marca e para |
| `/revisar <feature>`                  | Confere código vs. spec e lista lacunas                            |

`<feature>` é o nome da pasta em `specs/`, ex: `01-api-inscricoes`.
