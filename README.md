# Davyn × Factorial — strategy deck e landing

Repositório com **material em português** para aumentar conversão com o parceiro **Davyn** (Caribe).

## Documentos principais

| Ficheiro | Descrição |
|----------|-----------|
| [`PAE_DAVYN_CONVERSAO.md`](PAE_DAVYN_CONVERSAO.md) | Playbook para PAE — plano comercial, checklists, “battlecards”, métricas e leitura dos exports CRM (2026-05-27). |
| [`LANDING_PAGE_WIREFRAME.md`](LANDING_PAGE_WIREFRAME.md) | Esboço da página (secções e formulário) — referência de desenho. |

## Sítio web (GitHub Pages)

- **Site público (centro de recursos do parceiro):**  
  [https://victorhgutierrez-cloud.github.io/davynstrategydeck/](https://victorhgutierrez-cloud.github.io/davynstrategydeck/)

- **Ficheiros em `assets/` (descarga a partir do sítio):**  
  [https://github.com/VictorHGutierrez-cloud/davynstrategydeck/tree/main/site/assets](https://github.com/VictorHGutierrez-cloud/davynstrategydeck/tree/main/site/assets)

- **Configuração:** no GitHub, em **Settings → Pages**, a origem deve ser **GitHub Actions**.

- **Workflow:** [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica o conteúdo da pasta [`site/`](site/) (incluindo `site/assets/`).

### Alterar o sítio ou os recursos

1. Edita `site/index.html`, `site/styles.css` ou ficheiros em `site/assets/`.  
2. Se mudares o guia na raíz (`PAE_DAVYN_CONVERSAO.md`), volta a copiar para `site/assets/PAE_DAVYN_CONVERSAO.md` para o parceiro ver a mesma versão no hub.  
3. Faz `git push`.  
4. Espera o workflow “Deploy GitHub Pages” ficar verde nos **Actions**.

## Cópia local recomendada (Mac)

Para teres os `.md` ao lado dos outros materiais Factorial:

- Pasta: **`Documentos / PAE Frameworks / Davyn /`**
- Ficheiro guia: **`LEIA-ME.md`** (indica onde está cada coisa neste disco)

## Repo remoto

- [VictorHGutierrez-cloud/davynstrategydeck](https://github.com/VictorHGutierrez-cloud/davynstrategydeck)
