(() => {
  const HOME = "homepage-ui.html";
  const IDLE_MS = 10000;
  const current = (location.pathname.split("/").pop() || HOME).toLowerCase();
  if (current === HOME || current === "index.html") return;

  let timer = null;

  function goHome() {
    window.location.href = HOME;
  }

  function resetIdleTimer() {
    window.clearTimeout(timer);
    timer = window.setTimeout(goHome, IDLE_MS);
  }

  ["click", "pointerdown", "keydown", "touchstart", "mousemove", "input", "wheel"].forEach((eventName) => {
    document.addEventListener(eventName, resetIdleTimer, { passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.clearTimeout(timer);
    else resetIdleTimer();
  });

  resetIdleTimer();
})();
