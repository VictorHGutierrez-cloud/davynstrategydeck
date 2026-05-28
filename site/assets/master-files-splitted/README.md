# Master Files Splitted

This folder is the source of truth used to build Davyn AE proposals from the `master_en.pdf` deck.

## Structure

- `pages/`: one markdown file per source page extracted from the master PDF.
- `components/`: proposal-ready components grouped by topic, each mapping to one or more pages.
- `manifest.json`: machine-readable map of components, ranges, tags, and source files.
- `manifest.schema.json`: JSON schema for validation and automation.
- `page-previews.txt` / `page-previews.json`: quick page index for browsing.

## How to use (AE workflow)

1. Open `manifest.json` and pick components by `tags` and `ae_actions`.
2. Read the selected `components/*.md` files to understand what to use in proposal.
3. Pull exact source language from the linked `pages/page-###.md` files.
4. Build proposal modules in this order:
   - executive context
   - pains and outcomes
   - scoped modules
   - implementation and support
   - security/commercial/next step

## Naming conventions

- Page file: `pages/page-001.md`
- Component file: `components/01-company-overview.md`

## Notes

- Some topics intentionally span multiple slides and are grouped as one component.
- Keep this folder English-first to match public site language.
