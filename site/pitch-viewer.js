/**
 * In-browser PPTX viewer for Product Pitches (PptxViewJS + JSZip via CDN).
 */
(function () {
  let viewer = null;
  let libsPromise = null;
  let activePitch = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });
  }

  function ensureLibs() {
    if (window.PptxViewJS) return Promise.resolve();
    if (!libsPromise) {
      libsPromise = (async () => {
        await loadScript("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/pptxviewjs/dist/PptxViewJS.min.js");
      })();
    }
    return libsPromise;
  }

  function getCanvas() {
    return document.getElementById("pitch-canvas");
  }

  function setStatus(msg) {
    const el = document.getElementById("pitch-viewer-status");
    if (el) el.textContent = msg;
  }

  function updateCounter() {
    const el = document.getElementById("pitch-slide-counter");
    if (!el || !viewer) return;
    const idx = typeof viewer.getCurrentSlideIndex === "function" ? viewer.getCurrentSlideIndex() : 0;
    const total = typeof viewer.getSlideCount === "function" ? viewer.getSlideCount() : "?";
    el.textContent = "Slide " + (idx + 1) + " of " + total;
    const prev = document.getElementById("pitch-prev");
    const next = document.getElementById("pitch-next");
    if (prev) prev.disabled = idx <= 0;
    if (next) next.disabled = total !== "?" && idx >= total - 1;
  }

  function bindControls() {
    const prev = document.getElementById("pitch-prev");
    const next = document.getElementById("pitch-next");
    const wrap = document.getElementById("pitch-viewer-wrap");

    if (prev && !prev.dataset.bound) {
      prev.dataset.bound = "1";
      prev.addEventListener("click", () => navigate("prev"));
    }
    if (next && !next.dataset.bound) {
      next.dataset.bound = "1";
      next.addEventListener("click", () => navigate("next"));
    }
    if (wrap && !wrap.dataset.bound) {
      wrap.dataset.bound = "1";
      wrap.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          navigate("prev");
        }
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          navigate("next");
        }
      });
    }
  }

  async function navigate(dir) {
    const canvas = getCanvas();
    if (!viewer || !canvas) return;
    try {
      if (dir === "prev" && viewer.previousSlide) await viewer.previousSlide(canvas);
      if (dir === "next" && viewer.nextSlide) await viewer.nextSlide(canvas);
      updateCounter();
    } catch (err) {
      console.error(err);
    }
  }

  async function loadPitch(pitch) {
    if (!pitch) return;
    activePitch = pitch;
    bindControls();

    const shell = document.getElementById("pitch-viewer-shell");
    if (shell) shell.hidden = false;

    setStatus("Loading " + pitch.title + "… Large decks may take 15–30 seconds.");
    updateCounter();

    try {
      await ensureLibs();
      const canvas = getCanvas();
      if (!canvas) throw new Error("Canvas not found");

      if (!viewer) {
        viewer = new PptxViewJS.PPTXViewer({ canvas: canvas, autoExposeGlobals: true });
        viewer.on("loadComplete", () => {
          setStatus("Ready — use arrows or keyboard ← → to navigate.");
          updateCounter();
          viewer.render(canvas);
        });
        viewer.on("slideChanged", () => updateCounter());
        viewer.on("renderComplete", () => updateCounter());
      }

      await viewer.loadFromUrl(pitch.path);
    } catch (err) {
      console.error(err);
      setStatus("Could not render in browser. Download the .pptx and open in PowerPoint.");
    }
  }

  function destroy() {
    viewer = null;
    activePitch = null;
  }

  window.DavynPitchViewer = {
    loadPitch,
    navigate,
    destroy,
    getActivePitch: () => activePitch,
  };
})();
