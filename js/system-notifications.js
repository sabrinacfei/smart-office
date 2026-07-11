(() => {
  const STORAGE_KEY = "wohours.homeNotifications.v1";
  const BELL_SELECTOR = ".notify-button, .employee-bell, .notice-bell, .lunch-bell, .delivery-bell, .health-bell, .visitor-bell, .emergency-bell";
  const EXCLUDED_BANNER_PAGES = new Set(["attendance.html", "visitor.html", "emergency.html"]);
  const KIOSK_WIDTH = 2140;
  const KIOSK_HEIGHT = 1350;
  const PANEL_BASE_WIDTH = 520;
  const PANEL_BASE_MAX_HEIGHT = 620;
  const EDGE_GAP = 16;
  const templates = [
    {
      title: "健康檢查預約提醒",
      text: "年度健檢尚有可預約時段，請先查詢個人狀態。",
      href: "health.html",
      tag: "健康檢查"
    },
    {
      title: "員工旅遊報名開放",
      text: "宜蘭兩天一夜員工旅遊開放報名中。",
      href: "employee.html#eventsView",
      tag: "福利公告"
    },
    {
      title: "排班公告更新",
      text: "本週班表已更新，請確認自己的值班時段。",
      href: "schedule.html",
      tag: "排班公告"
    },
    {
      title: "員工電影優惠",
      text: "本月合作影城優惠票可於員工專區購買。",
      href: "employee.html#moviesView",
      tag: "電影優惠"
    },
    {
      title: "申報維修進度提醒",
      text: "若設備或門禁異常，可至員工專區回報。",
      href: "employee.html#repairView",
      tag: "申報維修"
    }
  ];

  let panel;
  let list;
  let empty;
  let clearButton;
  let banner;
  let bannerTimer;
  let started = false;
  let activeBell = null;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function timeLabel(date = new Date()) {
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function currentPageName() {
    return (location.pathname.split("/").pop() || "homepage-ui.html").toLowerCase();
  }

  function bannerAllowed() {
    if (EXCLUDED_BANNER_PAGES.has(currentPageName())) return false;
    return !document.querySelector(".doorbell-feedback.is-open:not([hidden])");
  }

  function getNotificationScale() {
    const declared = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--kiosk-scale"));
    const fallback = Math.min(window.innerWidth / KIOSK_WIDTH, window.innerHeight / KIOSK_HEIGHT);
    const scale = Number.isFinite(declared) && declared > 0 ? declared : fallback;
    return Math.min(1, Math.max(0.68, scale || 1));
  }

  function syncScale() {
    const scale = getNotificationScale();
    document.documentElement.style.setProperty("--wohours-notification-scale", String(scale));
    return scale;
  }

  function positionPanel(anchor = activeBell || document.querySelector(BELL_SELECTOR)) {
    ensurePanel();
    const scale = syncScale();
    const rect = anchor?.getBoundingClientRect?.();
    const maxBaseWidth = Math.max(320, (window.innerWidth - EDGE_GAP * 2) / scale);
    const baseWidth = Math.min(PANEL_BASE_WIDTH, maxBaseWidth);
    const visualWidth = baseWidth * scale;
    const visualGap = 12 * scale;
    const top = rect
      ? Math.min(rect.bottom + visualGap, window.innerHeight - 96 * scale)
      : Math.max(EDGE_GAP, 72 * scale);
    const rawLeft = rect
      ? rect.right - visualWidth
      : window.innerWidth - visualWidth - EDGE_GAP;
    const left = Math.min(
      Math.max(EDGE_GAP, rawLeft),
      Math.max(EDGE_GAP, window.innerWidth - visualWidth - EDGE_GAP)
    );
    const availableVisualHeight = Math.max(260 * scale, window.innerHeight - top - EDGE_GAP);
    const baseMaxHeight = Math.min(PANEL_BASE_MAX_HEIGHT, availableVisualHeight / scale);

    panel.style.setProperty("left", `${left}px`, "important");
    panel.style.setProperty("right", "auto", "important");
    panel.style.setProperty("top", `${top}px`, "important");
    panel.style.setProperty("width", `${baseWidth}px`, "important");
    panel.style.setProperty("max-height", `${baseMaxHeight}px`, "important");
    panel.style.setProperty("transform", `scale(${scale})`, "important");
    panel.style.setProperty("transform-origin", "top left", "important");
    if (list) {
      list.style.setProperty("max-height", `${Math.max(180, baseMaxHeight - 120)}px`, "important");
    }
  }

  function makeNotification(template) {
    const source = template || templates[read().length % templates.length];
    return {
      id: `notice-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: source.title,
      text: source.text,
      href: source.href,
      tag: source.tag,
      time: timeLabel()
    };
  }

  function route(item) {
    if (!item?.href) return;
    window.location.href = item.href;
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("section");
    panel.className = "wohours-notification-panel";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <header>
        <div>
          <strong>通知</strong>
          <span>辦公室訊息與系統提醒</span>
        </div>
        <button class="wohours-notification-clear" type="button">全部清除</button>
      </header>
      <div class="wohours-notification-list"></div>
      <p class="wohours-notification-empty">目前沒有通知</p>
    `;
    document.body.appendChild(panel);
    list = panel.querySelector(".wohours-notification-list");
    empty = panel.querySelector(".wohours-notification-empty");
    clearButton = panel.querySelector(".wohours-notification-clear");

    clearButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      save([]);
      render();
    });

    panel.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-notification-delete]");
      if (deleteButton) {
        event.preventDefault();
        event.stopPropagation();
        save(read().filter(item => item.id !== deleteButton.dataset.notificationDelete));
        render();
        return;
      }
      const itemButton = event.target.closest("[data-notification-open]");
      if (!itemButton) return;
      const item = read().find(entry => entry.id === itemButton.dataset.notificationOpen);
      route(item);
    });

    document.addEventListener("click", (event) => {
      if (!panel.classList.contains("is-open")) return;
      if (event.target.closest(".wohours-notification-panel") || event.target.closest(BELL_SELECTOR)) return;
      closePanel();
    });

    return panel;
  }

  function ensureBanner() {
    if (banner) return banner;
    banner = document.createElement("section");
    banner.className = "wohours-notification-banner";
    banner.setAttribute("aria-hidden", "true");
    banner.innerHTML = `
      <i>!</i>
      <div><strong></strong><small></small></div>
      <button type="button" aria-label="關閉通知">×</button>
    `;
    document.body.appendChild(banner);
    banner.querySelector("button").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      hideBanner();
    });
    banner.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      const item = read().find(entry => entry.id === banner.dataset.notificationId);
      route(item);
    });
    return banner;
  }

  function updateBadges() {
    const count = read().length;
    document.querySelectorAll(BELL_SELECTOR).forEach((button) => {
      button.classList.add("wohours-notification-bell");
      let badge = button.querySelector(".wohours-notification-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "wohours-notification-badge";
        button.appendChild(badge);
      }
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.classList.toggle("is-hidden", count === 0);
      button.setAttribute("aria-label", count ? `通知，${count} 則訊息` : "通知");
    });
  }

  function render() {
    ensurePanel();
    const items = read();
    list.innerHTML = "";
    empty.hidden = items.length > 0;
    clearButton.disabled = items.length === 0;

    items.forEach((item) => {
      const button = document.createElement("article");
      button.className = "wohours-notification-item";
      button.dataset.notificationOpen = item.id;
      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");
      button.innerHTML = `
        <span>${item.tag || "系統通知"}</span>
        <strong>${item.title}</strong>
        <small>${item.text}</small>
        <time>${item.time}</time>
        <button class="wohours-notification-delete" type="button" data-notification-delete="${item.id}" aria-label="刪除此通知">×</button>
      `;
      list.appendChild(button);
    });
    updateBadges();
  }

  function openPanel(anchor) {
    render();
    if (anchor) activeBell = anchor;
    positionPanel(activeBell);
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  function hideBanner() {
    if (!banner) return;
    window.clearTimeout(bannerTimer);
    banner.classList.remove("is-visible");
    banner.setAttribute("aria-hidden", "true");
  }

  function showBanner(item) {
    if (!item || !bannerAllowed()) return;
    ensureBanner();
    banner.dataset.notificationId = item.id;
    banner.querySelector("strong").textContent = item.title;
    banner.querySelector("small").textContent = item.text;
    banner.classList.add("is-visible");
    banner.setAttribute("aria-hidden", "false");
    window.clearTimeout(bannerTimer);
    bannerTimer = window.setTimeout(hideBanner, 5000);
  }

  function add(template, { banner: shouldShowBanner = true } = {}) {
    const item = makeNotification(template);
    save([item, ...read()].slice(0, 20));
    render();
    if (shouldShowBanner) showBanner(item);
    return item;
  }

  function init() {
    if (started) {
      render();
      return;
    }
    started = true;
    syncScale();
    ensurePanel();
    ensureBanner();
    if (!read().length) {
      add(templates[0], { banner: false });
    } else {
      render();
    }

    document.addEventListener("click", (event) => {
      const bell = event.target.closest(BELL_SELECTOR);
      if (!bell) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (panel?.classList.contains("is-open")) closePanel();
      else openPanel(bell);
    }, true);

    window.setInterval(() => add(), 1000 * 60 * 5);
    window.addEventListener("resize", () => {
      syncScale();
      if (panel?.classList.contains("is-open")) positionPanel(activeBell);
    });
    window.addEventListener("scroll", () => {
      if (panel?.classList.contains("is-open")) positionPanel(activeBell);
    }, true);
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) render();
    });
  }

  window.WohoursNotifications = { init, add, render, openPanel, closePanel, read };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
