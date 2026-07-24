(() => {
  const CANVAS_WIDTH = 2140;
  const CANVAS_HEIGHT = 1350;
  const ORIENTATION_STORAGE_KEY = "wohours:kiosk-orientation";
  const LANDSCAPE_MODE = "landscape";
  const PORTRAIT_MODE = "portrait";
  const TOGGLE_ID = "kioskOrientationToggle";
  const STYLE_ID = "kioskOrientationStyles";
  const PORTRAIT_LAYOUT_ATTR = "kioskPortraitLayout";
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

  function readOrientationMode() {
    try {
      return window.localStorage.getItem(ORIENTATION_STORAGE_KEY) === PORTRAIT_MODE ? PORTRAIT_MODE : LANDSCAPE_MODE;
    } catch (error) {
      return LANDSCAPE_MODE;
    }
  }

  function saveOrientationMode(mode) {
    try {
      window.localStorage.setItem(ORIENTATION_STORAGE_KEY, mode);
    } catch (error) {
      // Ignore storage errors in private or embedded browser modes.
    }
  }

  function setToggleState(button, mode) {
    button.dataset.orientation = mode;
    button.setAttribute("aria-pressed", mode === PORTRAIT_MODE ? "true" : "false");
  }

  function ensureOrientationStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .kiosk-orientation-toggle {
        position: absolute;
        left: 36px;
        bottom: 36px;
        z-index: 120;
        width: 76px;
        height: 76px;
        display: grid;
        place-items: center;
        border: 2px solid rgba(95, 66, 45, .34);
        border-radius: 50%;
        padding: 0;
        background: rgba(95, 66, 45, .12);
        color: rgba(95, 66, 45, .78);
        box-shadow: none;
        opacity: .36;
        cursor: pointer;
        transition: opacity .18s ease, transform .18s ease, background .18s ease, box-shadow .18s ease;
        -webkit-tap-highlight-color: transparent;
      }

      .kiosk-orientation-toggle:hover,
      .kiosk-orientation-toggle:focus-visible {
        opacity: .88;
        transform: translateY(-2px);
        background: rgba(95, 66, 45, .2);
        box-shadow: 0 14px 34px rgba(95, 66, 45, .18);
        outline: none;
      }

      .kiosk-orientation-toggle:active {
        transform: scale(.94);
      }

      .kiosk-orientation-toggle svg {
        width: 42px;
        height: 42px;
        display: block;
        fill: none;
        stroke: currentColor;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      html[data-kiosk-orientation="portrait"] .kiosk-orientation-toggle {
        opacity: .46;
      }

      @media (pointer: coarse) {
        .kiosk-orientation-toggle {
          width: 82px;
          height: 82px;
          opacity: .34;
        }

        .kiosk-orientation-toggle:active {
          opacity: .72;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureOrientationToggle(screen) {
    if (!document.body || !screen) return;

    ensureOrientationStyles();

    let button = document.getElementById(TOGGLE_ID);
    if (!button) {
      button = document.createElement("button");
      button.id = TOGGLE_ID;
      button.className = "kiosk-orientation-toggle";
      button.type = "button";
      button.setAttribute("aria-label", "切換畫面方向");
      button.title = "切換畫面方向";
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M3 7v6h6"/>
          <path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>
        </svg>
      `;
      button.addEventListener("click", () => {
        const nextMode = readOrientationMode() === PORTRAIT_MODE ? LANDSCAPE_MODE : PORTRAIT_MODE;
        saveOrientationMode(nextMode);
        setToggleState(button, nextMode);
        fitKioskCanvas();
        window.dispatchEvent(new CustomEvent("kioskorientationchange", { detail: { orientation: nextMode } }));
      });
    }

    if (button.parentElement !== screen) {
      screen.appendChild(button);
    }

    setToggleState(button, readOrientationMode());
  }

  function fitKioskCanvas() {
    const screen = getScreen();
    if (!screen) return;

    const stage = screen.closest("main") || screen.parentElement;
    const moviePage = document.querySelector("#moviesView.active");
    const isMovieMode = screen.classList.contains("employee-screen") && moviePage;
    const canvasHeight = isMovieMode ? Math.max(CANVAS_HEIGHT, moviePage.scrollHeight) : CANVAS_HEIGHT;
    const orientationMode = readOrientationMode();
    const isPortrait = orientationMode === PORTRAIT_MODE;
    const usesPortraitLayout = isPortrait && screen.dataset[PORTRAIT_LAYOUT_ATTR] === "true";
    const layoutWidth = usesPortraitLayout ? CANVAS_HEIGHT : CANVAS_WIDTH;
    const layoutHeight = usesPortraitLayout ? CANVAS_WIDTH : canvasHeight;
    const visualBaseWidth = layoutWidth;
    const visualBaseHeight = layoutHeight;
    const scale = Math.min(window.innerWidth / visualBaseWidth, window.innerHeight / visualBaseHeight);
    const scaledWidth = visualBaseWidth * scale;
    const scaledHeight = visualBaseHeight * scale;
    const left = Math.max(0, (window.innerWidth - scaledWidth) / 2);
    const top = Math.max(0, (window.innerHeight - scaledHeight) / 2);
    const canvasTop = isMovieMode ? Math.max(0, top) : top;
    const transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`;

    document.documentElement.style.setProperty("--kiosk-scale", String(scale));
    document.documentElement.style.setProperty("--kiosk-screen-width", `${scaledWidth}px`);
    document.documentElement.style.setProperty("--kiosk-screen-height", `${scaledHeight}px`);
    document.documentElement.dataset.kioskOrientation = orientationMode;
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.minHeight = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = isMovieMode ? "auto" : "hidden";
    document.body.style.overflowX = "hidden";

    if (stage) {
      stage.style.position = "relative";
      stage.style.width = "100vw";
      stage.style.height = isMovieMode ? `${Math.ceil(canvasTop + scaledHeight)}px` : "100vh";
      stage.style.minHeight = isMovieMode ? "100vh" : "";
      stage.style.overflow = isMovieMode ? "visible" : "hidden";
      stage.dataset.kioskOrientation = orientationMode;
    }

    screen.style.position = "absolute";
    screen.style.left = `${left}px`;
    screen.style.top = `${canvasTop}px`;
    screen.style.width = `${layoutWidth}px`;
    screen.style.height = `${layoutHeight}px`;
    screen.style.minWidth = `${layoutWidth}px`;
    screen.style.minHeight = `${layoutHeight}px`;
    screen.style.maxWidth = `${layoutWidth}px`;
    screen.style.maxHeight = isMovieMode ? "none" : `${layoutHeight}px`;
    screen.style.overflow = isMovieMode ? "visible" : "hidden";
    screen.style.transform = transform;
    screen.style.transformOrigin = "top left";
    screen.dataset.kioskOrientation = orientationMode;
    screen.dataset.kioskLayout = usesPortraitLayout ? "portrait" : "landscape";
    screen.dataset.kioskScreenFit = "viewport";

    ensureOrientationToggle(screen);
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
