# Davyn — strategy deck & landing (rascunho)

Repositório para:

- **Playbook interno (PAE)** em Português: [`PAE_DAVYN_CONVERSAO.md`](PAE_DAVYN_CONVERSAO.md)
- **Wireframe da landing** pública: [`LANDING_PAGE_WIREFRAME.md`](LANDING_PAGE_WIREFRAME.md)
- **Site estático** (GitHub Pages): pasta [`site/`](site/)

## GitHub Pages (GitHub Actions)

1. No GitHub: **Settings → Pages → Build and deployment**  
   - **Source:** GitHub Actions (não “Deploy from a branch”).

2. Faz push da branch **`main`** (o workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica o conteúdo de `site/`).

3. Depois do primeiro deploy com sucesso, o site fica disponível em:

   `https://victorhgutierrez-cloud.github.io/davynstrategydeck/`

   (URL padrão para repositório público `VictorHGutierrez-cloud/davynstrategydeck`.)

## Desenvolvimento local

Abre `site/index.html` no browser (duplo clique) ou serve com qualquer servidor estático.

## Próximos passos de conteúdo

- Substituir placeholders no `site/index.html` (copy, logos, links Calendly/LinkedIn/privacidade).
- Ligar o formulário a HubSpot/Typeform ou endpoint seguro.
