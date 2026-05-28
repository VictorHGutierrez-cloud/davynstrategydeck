const fs = require("fs");
const path = require("path");

const MASTER_ROOT = path.join(process.cwd(), "site", "assets", "master-files-splitted");

function readTextSafe(relativePath) {
  try {
    const full = path.join(MASTER_ROOT, relativePath.replace(/^assets\/master-files-splitted\//, ""));
    if (!full.startsWith(MASTER_ROOT)) return "";
    return fs.readFileSync(full, "utf8");
  } catch {
    return "";
  }
}

function excerptFromMarkdown(md, maxLen = 1200) {
  if (!md) return "";
  const cleaned = md
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (t.startsWith("#")) return false;
      if (t.startsWith("- Component ID:")) return false;
      if (t.startsWith("- Page range:")) return false;
      if (t.startsWith("- Total pages:")) return false;
      if (t.startsWith("- Tags:")) return false;
      if (t.startsWith("## Why this component")) return false;
      if (t.startsWith("## AE actions")) return false;
      if (t.startsWith("## Source pages")) return false;
      if (t.startsWith("- `pages/")) return false;
      if (t.includes("REMEMBER! You you are meant to edit")) return false;
      if (t.includes("Pick only the slides relevant")) return false;
      if (t.includes("make a copy of the")) return false;
      return true;
    })
    .join("\n")
    .trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).trim() + "…";
}

function enrichComponentWithSources(component) {
  const componentRel = (component.component_path || "").replace(/^assets\/master-files-splitted\//, "");
  const componentMd = readTextSafe(componentRel);
  const pagePaths =
    component.source_page_paths ||
    (component.source_files || []).map((p) => `pages/${String(p || "").replace(/^pages\//, "")}`) ||
    [];
  let pageExcerpt = "";
  for (const pagePath of pagePaths) {
    const rel = pagePath.replace(/^assets\/master-files-splitted\//, "");
    const pageMd = readTextSafe(rel);
    const ex = excerptFromMarkdown(pageMd, 800);
    if (ex) {
      pageExcerpt = ex;
      break;
    }
  }
  return {
    ...component,
    component_excerpt: excerptFromMarkdown(componentMd, 600),
    page_excerpt: pageExcerpt || excerptFromMarkdown(componentMd, 900),
  };
}

module.exports = {
  readTextSafe,
  excerptFromMarkdown,
  enrichComponentWithSources,
};
