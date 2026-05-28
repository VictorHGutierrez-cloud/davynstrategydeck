/**
 * Build master-slides.json from manifest + page-previews + available JPG files.
 * Run: node scripts/build-master-slides-index.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const previewsPath = path.join(ROOT, "site/assets/master-files-splitted/page-previews.json");
const manifestPath = path.join(ROOT, "site/assets/master-files-splitted/manifest.json");
const slidesDir = path.join(ROOT, "site/assets/master-slides");
const outPath = path.join(ROOT, "site/assets/master-slides.json");

const previews = JSON.parse(fs.readFileSync(previewsPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const totalPages = manifest.total_pages || 94;

function pageLabel(pageNum) {
  const row = previews.find((p) => p.page === pageNum);
  if (!row || !row.preview || row.preview === "[no extractable text]") {
    return `Slide ${pageNum}`;
  }
  const bit = row.preview.split("|")[0].trim();
  return bit.length > 72 ? bit.slice(0, 69) + "…" : bit;
}

function imagePath(pageNum) {
  const rel = `assets/master-slides/page-${String(pageNum).padStart(3, "0")}.jpg`;
  const full = path.join(ROOT, "site", rel);
  return fs.existsSync(full) ? rel : null;
}

const pages = [];
for (let p = 1; p <= totalPages; p++) {
  pages.push({
    page: p,
    label: pageLabel(p),
    image: imagePath(p),
  });
}

const components = manifest.components.map((c) => {
  const pageDetails = (c.pages || []).map((p) => {
    const row = pages.find((x) => x.page === p);
    return {
      page: p,
      label: row ? row.label : `Slide ${p}`,
      image: row ? row.image : null,
    };
  });
  const thumb =
    pageDetails.find((p) => p.image)?.image ||
    pageDetails[0]?.image ||
    null;
  return {
    order: c.order,
    id: c.id,
    title: c.title,
    page_range: c.page_range,
    tags: c.tags || [],
    summary: c.summary || "",
    thumb,
    pages: pageDetails,
  };
});

const index = {
  generated_at: new Date().toISOString().slice(0, 10),
  total_pages: totalPages,
  images_available: pages.filter((p) => p.image).map((p) => p.page),
  pages,
  components,
};

fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(
  "Wrote",
  outPath,
  "—",
  index.images_available.length,
  "slide images,",
  components.length,
  "components"
);
