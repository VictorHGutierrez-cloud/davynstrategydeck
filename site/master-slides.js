/**
 * Master deck slide registry (JPG slides + labels).
 */
(function () {
  const INDEX_PATH = "assets/master-slides.json";
  let indexPromise = null;

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(INDEX_PATH)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load master slides index.");
          return r.json();
        })
        .catch((e) => {
          indexPromise = null;
          throw e;
        });
    }
    return indexPromise;
  }

  function getComponentById(index, id) {
    return (index.components || []).find((c) => c.id === id);
  }

  function placeholderDataUrl(label, page) {
    const text = (label || `Slide ${page}`).replace(/"/g, "'");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
      <rect fill="#f1f5f9" width="400" height="225"/>
      <text x="200" y="100" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="#64748b">Slide ${page}</text>
      <text x="200" y="128" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">${text.slice(0, 48)}</text>
      <text x="200" y="155" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#cbd5e1">JPG not uploaded yet</text>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function slideSrc(pageDetail) {
    if (pageDetail && pageDetail.image) return pageDetail.image;
    return placeholderDataUrl(pageDetail && pageDetail.label, pageDetail && pageDetail.page);
  }

  function componentThumbSrc(component) {
    if (component.thumb) return component.thumb;
    const first = (component.pages || [])[0];
    return slideSrc(first);
  }

  window.DavynMasterSlides = {
    loadIndex,
    getComponentById,
    slideSrc,
    componentThumbSrc,
    placeholderDataUrl,
  };
})();
