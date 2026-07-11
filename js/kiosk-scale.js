(() => {
  const CANVAS_WIDTH = 2140;
  const CANVAS_HEIGHT = 1350;
  const SCREEN_SELECTORS = [
    ".kiosk-screen",
    ".visitor-screen",
    ".delivery-screen",
    ".lunch-screen",
    ".emergency-screen",
    ".employee-screen",
    ".attendance-screen",
    ".health-screen",
    ".schedule-screen"
  ].join(",");

  function getScreen() {
    return document.querySelector(SCREEN_SELECTORS);
  }

  function fitKioskCanvas() {
    const screen = getScreen();
    if (!screen) return;

    const stage = screen.closest("main") || screen.parentElement;
    const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
    const scaledWidth = CANVAS_WIDTH * scale;
    const scaledHeight = CANVAS_HEIGHT * scale;
    const left = Math.max(0, (window.innerWidth - scaledWidth) / 2);
    const top = Math.max(0, (window.innerHeight - scaledHeight) / 2);
    const moviePage = document.querySelector("#moviesView.active");
    const isMovieMode = screen.classList.contains("employee-screen") && moviePage;
    const canvasHeight = isMovieMode ? Math.max(CANVAS_HEIGHT, moviePage.scrollHeight) : CANVAS_HEIGHT;
    const canvasTop = isMovieMode ? Math.max(0, top) : top;

    document.documentElement.style.setProperty("--kiosk-scale", String(scale));
    document.documentElement.style.setProperty("--kiosk-screen-width", `${scaledWidth}px`);
    document.documentElement.style.setProperty("--kiosk-screen-height", `${scaledHeight}px`);
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.overflow = isMovieMode ? "auto" : "hidden";
    document.body.style.overflowX = "hidden";

    if (stage) {
      stage.style.position = "relative";
      stage.style.width = "100vw";
      stage.style.height = isMovieMode ? `${Math.ceil(canvasTop + canvasHeight * scale)}px` : "100vh";
      stage.style.minHeight = isMovieMode ? "100vh" : "";
      stage.style.overflow = isMovieMode ? "visible" : "hidden";
    }

    screen.style.position = "absolute";
    screen.style.left = `${left}px`;
    screen.style.top = `${canvasTop}px`;
    screen.style.width = `${CANVAS_WIDTH}px`;
    screen.style.height = `${canvasHeight}px`;
    screen.style.minWidth = `${CANVAS_WIDTH}px`;
    screen.style.minHeight = `${canvasHeight}px`;
    screen.style.maxWidth = `${CANVAS_WIDTH}px`;
    screen.style.maxHeight = isMovieMode ? "none" : `${CANVAS_HEIGHT}px`;
    screen.style.overflow = isMovieMode ? "visible" : "hidden";
    screen.style.transform = `scale(${scale})`;
    screen.style.transformOrigin = "top left";
    screen.dataset.kioskScreenFit = "viewport";
  }

  window.fitKioskCanvas = fitKioskCanvas;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fitKioskCanvas, { once: true });
  } else {
    fitKioskCanvas();
  }

  window.addEventListener("resize", fitKioskCanvas);
  window.addEventListener("orientationchange", fitKioskCanvas);
  window.addEventListener("pageshow", fitKioskCanvas);
})();
