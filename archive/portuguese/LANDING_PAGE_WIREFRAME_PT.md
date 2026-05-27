# Wireframe — Landing pública (Davyn / Caribe)

**Objetivo da página:** gerar **pedidos de diagnóstico** (lead qualificado) e posicionar a Davyn como **parceira de transformação operacional regional**, não como “mais um revendedor de software”.

**Público:** decisores (CEO/COO/CFO), HR leadership, IT/Security, Procurement.

**Tom:** confiança, clareza, regional; evitar jargão vazio.

---

## Estrutura da página (blocos de cima a baixo)

### 1) Hero (above the fold)

| Elemento | Conteúdo (placeholder) |
|----------|-------------------------|
| **Headline** | “Operações de pessoas resilientes no Caribe — com governança e execução previsível.” |
| **Subheadline** | “Menos fragmentação entre ilhas, menos risco operacional e mais controlo para RH e liderança — com um método comprovado de implantação.” |
| **CTA primário** | Botão: **“Agendar diagnóstico (30 min)”** → link `#contacto` ou Calendly (URL TBD). |
| **CTA secundário** | Link texto: “Ver como funciona (3 passos)” → âncora `#como-funciona`. |
| **Prova social** | Faixa de logos (clientes Davyn) OU texto: “Apoiamos operações em [X] ilhas / sectores” (números reais TBD). |
| **Visual** | Foto/ilustração: equipa caribenha + mapa leve (sem prometer soberania legal). |

**Notas de UX:** headline máx. 2 linhas no mobile; CTA sempre visível (sticky no mobile).

---

### 2) Secção “Problema” (`#problema`)

**Título:** “O que está a travar a decisão (e a implantação)”

**Bullets curtos (4–6):**

- Operações **multi-ilha** com processos e ferramentas desligadas.  
- **Pressão de dados e auditoria** — perguntas de Legal/IT que param o projeto.  
- **Escassez de talento** para operar e sustentar mudanças.  
- **Continuidade operacional** (dependências críticas e risco de paragem).  
- **Complexidade financeira** em compras internacionais / serviços digitais (quando aplicável ao cliente).  

**Micro-CTA:** “Se isto soa familiar, o diagnóstico de 30 min normalmente já traz um plano de 90 dias.”

---

### 3) Secção “Outcome” (`#resultados`)

**Título:** “O que muda quando o método está certo”

**3 colunas (cards):**

| Card | Título | Texto (1–2 linhas) |
|------|--------|---------------------|
| A | Menos caos operacional | Processos e dados de RH mais claros entre equipas e locais. |
| B | Mais governança | Papéis, permissões e rastreabilidade alinhados com auditoria. |
| C | Execução mais rápida | Onboarding e mudanças com cadência semanal e donos definidos. |

---

### 4) Secção “Como funciona” (`#como-funciona`)

**Título:** “Três passos — simples de explicar ao conselho”

1. **Diagnóstico (30 min):** mapa de stakeholders + riscos + “o que está a falhar hoje”.  
2. **Blueprint (1–2 semanas):** desenho do rollout por fases, critérios de sucesso, plano de mitigação (dados/talento/financeiro).  
3. **Implementação:** execução com checkpoints semanais e métricas de adoção.

**CTA:** “Quero o blueprint” → formulário.

---

### 5) Secção “Verticais” (`#verticais`)

**Título:** “Onde a Davyn costuma ganhar mais rápido”

**3 cards:**

- **Hospedagem & operações sazonais** — turnover, horários, multi-property.  
- **Finanças & operações reguladas** — auditoria, permissões, rastreio.  
- **Grupos multi-ilha** — consistência de políticas e reporting para sede.

Cada card: 2 bullets + link “Falar com especialista”.

---

### 6) Secção “Objeções tratadas” (`#objeccoes`)

**Título:** “Perguntas difíceis — respostas directas”

| Objeção (cliente) | Resposta (1 linha) | Link |
|-------------------|-------------------|------|
| “Não queremos dados fora da região” | “Trabalhamos com governança e requisitos claros; Legal/TI entram cedo.” | “Ver mais” → modal ou página filha |
| “Não temos equipa técnica” | “Implantação assistida + rituais semanais + donos no teu lado.” | … |
| “É caro” | “Comparamos custo total vs ferramentas + retrabalho + risco.” | … |

**Disclaimer pequeno:** “Cada caso tem requisitos legais próprios — ajustamos com os teus assessores.”

---

### 7) Secção “Prova / casos” (`#casos`)

- 2–3 **cards de case** (logo + resultado + sector).  
- Se não houver case público: “Resultados internos sob NDA” + pedido de call.

---

### 8) Formulário de contacto (`#contacto`)

**Título:** “Agendar diagnóstico (30 min)”

**Campos recomendados:**

- Nome completo  
- Email corporativo (bloquear domínios genéricos no front, opcional)  
- Empresa  
- País / ilha principal de operação  
- Sector (dropdown)  
- Número aproximado de colaboradores (faixas)  
- “O que queres resolver nos próximos 90 dias?” (textarea)  
- Consentimento LGPD/GDPR (checkbox + link política privacidade)

**Após submit:** mensagem “Obrigado — resposta em 1 dia útil” + opcional redirect Calendly.

---

### 9) Rodapé

- Links: Privacidade, Termos, LinkedIn Davyn.  
- Nota curta **Trust:** “Segurança e dados são tratados com requisitos do teu contexto; detalhes técnicos na fase de discovery.”

---

## Wireframe ASCII (mobile-first)

```
┌─────────────────────────────┐
│ [Logo]          [Agendar]   │
├─────────────────────────────┤
│ HEADLINE (2 linhas max)     │
│ subheadline                 │
│ [CTA primário] [CTA sec]    │
│ [hero image]                │
├─────────────────────────────┤
│ Problema (bullets)          │
├─────────────────────────────┤
│ 3 cards outcome             │
├─────────────────────────────┤
│ 3 passos                    │
├─────────────────────────────┤
│ 3 cards verticais           │
├─────────────────────────────┤
│ tabela objeções             │
├─────────────────────────────┤
│ casos (carousel)            │
├─────────────────────────────┤
│ formulário contacto         │
├─────────────────────────────┤
│ rodapé                      │
└─────────────────────────────┘
```

---

## Próximos passos de conteúdo (Davyn preencher)

- [ ] Headline final + prova social real  
- [ ] URLs Calendly / Typeform / Hubspot  
- [ ] Política de privacidade alojada  
- [ ] 2 cases com permissão de publicação

Implementação estática inicial: pasta `site/` neste repo (GitHub Pages).
