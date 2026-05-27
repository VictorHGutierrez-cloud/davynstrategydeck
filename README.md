# Davyn × Factorial — Partner hub & downloads

English-first **partner hub** (GitHub Pages) plus **binary assets** your partner can download: PDF one-pagers, vertical guides, Introw decks, PNG competitive maps, and CSV baselines.

Live site: [https://victorhgutierrez-cloud.github.io/davynstrategydeck/](https://victorhgutierrez-cloud.github.io/davynstrategydeck/)

---

## What’s in this repo

| Path | Description |
|------|-------------|
| [`site/index.html`](site/index.html) | English landing page — **Downloads** section lists every file. |
| [`site/assets/downloads/`](site/assets/downloads/) | **PDF / PPTX / PNG / CSV** for partners. |
| [`site/assets/PARTNER_PLAYBOOK_DAVYN_EN.md`](site/assets/PARTNER_PLAYBOOK_DAVYN_EN.md) | Full conversion playbook (English). |
| [`site/assets/ASSET_INDEX_EN.md`](site/assets/ASSET_INDEX_EN.md) | Inventory of all downloadable files. |
| [`PARTNER_PLAYBOOK_DAVYN_EN.md`](PARTNER_PLAYBOOK_DAVYN_EN.md) | Same playbook at repo root for quick GitHub viewing. |
| [`archive/portuguese/`](archive/portuguese/) | Older Portuguese copies (reference only). |

---

## GitHub Pages

1. **Settings → Pages → Source:** GitHub Actions.  
2. Workflow: [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publishes folder [`site/`](site/).  
3. After each push to `main`, wait for the **Deploy GitHub Pages** workflow to finish.

### Updating files

1. Drop new PDF/PPTX into [`site/assets/downloads/`](site/assets/downloads/) (use subfolders; avoid spaces in filenames).  
2. Add a row to the **Downloads** section in [`site/index.html`](site/index.html) (or regenerate from a manifest later).  
3. Update [`site/assets/ASSET_INDEX_EN.md`](site/assets/ASSET_INDEX_EN.md) when you add categories.  
4. `git add`, `git commit`, `git push`.

If you regenerate the playbook, update **both** `site/assets/PARTNER_PLAYBOOK_DAVYN_EN.md` and root `PARTNER_PLAYBOOK_DAVYN_EN.md` (or symlink — Git does not symlink well cross-platform).

---

## Local copies on this Mac

If you mirror the project under **Documents › PAE Frameworks › Davyn**, refresh the **`recursos_assets`** folder after pulls so BD/comms always has offline copies:

`Documents / PAE Frameworks / Davyn / recursos_assets /`

*(We’ll keep mirroring downloads there when you sync from Cursor — you can also `git clone` the repo anywhere.)*

---

## Remote

- [VictorHGutierrez-cloud/davynstrategydeck](https://github.com/VictorHGutierrez-cloud/davynstrategydeck)
