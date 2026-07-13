(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];
  const weatherIcons = {
    cloudySunny: "images/weather cloudy to sunny拷貝.png",
    sunny: "images/sunny拷貝.png",
    rain: "images/rain拷貝.png",
    cloudy: "images/cloudy拷貝.png",
    clearNight: "images/clear night拷貝.png",
    thunder: "images/Afternoon thundershowers拷貝.png"
  };
  const weatherState = {
    location: "台北市 信義區",
    cwaStation: "臺北",
    text: "多雲時晴",
    temp: "28",
    high: "30",
    low: "25"
  };
  const homeTime = document.getElementById("homeTime");
  const homeDate = document.getElementById("homeDate");
  const fullDate = document.getElementById("fullDate");
  const weatherIcon = document.getElementById("weatherIcon");
  const weatherTemp = document.getElementById("weatherTemp");
  const weatherText = document.getElementById("weatherText");
  const weatherRange = document.getElementById("weatherRange");
  const weatherLocation = document.getElementById("weatherLocation");
  const spotlightCard = document.getElementById("spotlightCard");
  const spotlightImage = document.getElementById("spotlightImage");
  const spotlightTag = document.getElementById("spotlightTag");
  const spotlightTitle = document.getElementById("spotlightTitle");
  const spotlightEnglish = document.getElementById("spotlightEnglish");
  const spotlightMeta = document.getElementById("spotlightMeta");
  const spotlightDescription = document.getElementById("spotlightDescription");
  const spotlightAction = document.getElementById("spotlightAction");
  const spotlightPrev = document.getElementById("spotlightPrev");
  const spotlightNext = document.getElementById("spotlightNext");
  const pager = document.getElementById("noticePager");
  const notifyButton = document.querySelector(".notify-button");
  const notificationPanel = document.getElementById("homeNotificationPanel");
  const notificationList = document.getElementById("homeNotificationList");
  const notificationEmpty = document.getElementById("homeNotificationEmpty");
  const clearNotifications = document.getElementById("homeClearNotifications");
  const notificationDot = notifyButton?.querySelector("i");
  const intercomOverlay = document.getElementById("intercomOverlay");
  const intercomBackdrop = document.getElementById("intercomBackdrop");
  const intercomClose = document.getElementById("intercomClose");
  const intercomDisplay = document.getElementById("intercomDisplay");
  const intercomDelete = document.getElementById("intercomDelete");
  const intercomCall = document.getElementById("intercomCall");
  const intercomHangup = document.getElementById("intercomHangup");
  const intercomSearch = document.getElementById("intercomSearch");
  const intercomTime = document.getElementById("intercomTime");
  const intercomDate = document.getElementById("intercomDate");
  const intercomCallStatus = document.getElementById("intercomCallStatus");
  const intercomCallState = document.getElementById("intercomCallState");
  const intercomCallTimer = document.getElementById("intercomCallTimer");
  const intercomRight = document.querySelector(".intercom-right");
  const intercomActions = document.querySelector(".intercom-actions");
  const todaySlides = Array.from(document.querySelectorAll("[data-today-slide]"));
  const todaySlideDots = document.getElementById("todaySlideDots");

  const movies = [
    {
      image: "images/PASSENGER拷貝2.jpg",
      title: "鬼上車",
      english: "PASSENGER",
      id: "passenger",
      tag: "口碑推薦",
      meta: "★ 8.3 ｜ 劇情・懸疑 ｜ 116 分鐘",
      description: "旅程的終點，藏著意想不到的答案。"
    },
    {
      image: "images/SpiderManBrandNewDay拷貝2.jpg",
      title: "蜘蛛人：重生日",
      english: "SPIDER-MAN",
      id: "spiderman",
      tag: "熱映強片",
      meta: "★ 8.9 ｜ 動作・科幻 ｜ 138 分鐘",
      description: "每一次選擇，都將寫下嶄新的一頁。"
    },
    {
      image: "images/MINIONSMONSTE拷貝.jpg",
      title: "小小兵",
      english: "MINIONS MONSTER",
      id: "minions",
      tag: "歡樂首選",
      meta: "★ 8.6 ｜ 動畫・冒險 ｜ 98 分鐘",
      description: "午休前後都適合的輕鬆放映選擇。"
    },
    {
      image: "images/InTheRealmOfTheSenses拷貝.jpg",
      title: "感官世界",
      english: "IN THE REALM",
      id: "realm",
      tag: "經典重映",
      meta: "★ 8.1 ｜ 劇情 ｜ 109 分鐘",
      description: "經典作品回到片單，適合下班後慢慢觀看。"
    },
    {
      image: "images/Hokum拷貝.png",
      title: "HOKUM",
      english: "HOKUM",
      id: "hokum",
      tag: "編輯精選",
      meta: "★ 8.2 ｜ 懸疑・劇情 ｜ 112 分鐘",
      description: "真相與謊言，只隔著一場表演。"
    },
    {
      image: "images/SorryBaby拷貝.jpg",
      title: "寶貝，對不起",
      english: "SORRY, BABY",
      id: "sorrybaby",
      tag: "影展選片",
      meta: "★ 8.5 ｜ 劇情 ｜ 103 分鐘",
      description: "有些傷口，會在陪伴中慢慢癒合。"
    }
  ];

  const mealStores = [
    {
      id: "hanabi",
      image: "images/Japanese Donburi拷貝.jpg",
      title: "花火丼飯",
      english: "MEAL BOOKING",
      meta: "日式丼飯・現做取餐",
      description: "醬汁濃郁的日式丼飯，適合午餐快速取餐。"
    },
    {
      id: "lao-zhang",
      image: "images/bento拷貝.jpg",
      title: "老張便當",
      english: "MEAL BOOKING",
      meta: "經典台式便當・11:00 截止",
      description: "家常便當與滷香主菜，今天午餐穩穩吃。"
    },
    {
      id: "qinghe",
      image: "images/vegetarian.jpg.webp",
      title: "青禾蔬食",
      english: "MEAL BOOKING",
      meta: "蔬食料理・清爽午餐",
      description: "蔬菜、豆包與輕盈餐盒，午後更舒服。"
    },
    {
      id: "spicy-lab",
      image: "images/Spicy拷貝.jpg",
      title: "辣味研究所",
      english: "MEAL BOOKING",
      meta: "香麻辣味・午餐提神",
      description: "紅油、椒麻與辣炒料理，想吃點辣就選它。"
    },
    {
      id: "island-light",
      image: "images/Western_style.jpg",
      title: "小島輕食",
      english: "MEAL BOOKING",
      meta: "西式輕食・沙拉飯麵",
      description: "三明治、沙拉與飯麵組合，今天吃清爽一點。"
    }
  ];

  const slides = movies.flatMap((movie, index) => [
    { ...movie, type: "movie", action: "立即購票" },
    { ...mealStores[index % mealStores.length], type: "meal", tag: "便當店家", action: "立即點餐" }
  ]);

  let activeSlide = 0;
  let activeTodaySlide = 0;

  function fitKiosk() {
    window.fitKioskCanvas?.();
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const day = weekdayShort[now.getDay()];

    homeTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    homeDate.textContent = `${month}/${date} (${day})`;
    fullDate.textContent = `${year}/${month}/${date} (${day})`;
  }

  function isNightTime(date = new Date()) {
    const hour = date.getHours();
    return hour >= 18 || hour < 6;
  }

  function pickWeatherIcon(text) {
    const value = String(text || "");
    if (/雷|閃電/.test(value)) return weatherIcons.thunder;
    if (/雨|陣雨/.test(value)) return weatherIcons.rain;
    if (/晴/.test(value) && isNightTime()) return weatherIcons.clearNight;
    if (/晴/.test(value) && /雲/.test(value)) return weatherIcons.cloudySunny;
    if (/晴/.test(value)) return weatherIcons.sunny;
    if (/陰|雲/.test(value)) return weatherIcons.cloudy;
    return weatherIcons.cloudySunny;
  }

  function renderWeather() {
    if (weatherIcon) {
      weatherIcon.src = pickWeatherIcon(weatherState.text);
      weatherIcon.alt = weatherState.text;
    }
    if (weatherTemp) weatherTemp.textContent = `${Math.round(Number(weatherState.temp) || 28)}°C`;
    if (weatherText) weatherText.textContent = weatherState.text;
    if (weatherRange) weatherRange.textContent = `${weatherState.low}°C - ${weatherState.high}°C`;
    if (weatherLocation) weatherLocation.textContent = weatherState.location;
  }

  function readCwaValue(elements, names) {
    const list = Array.isArray(elements) ? elements : [];
    const found = list.find(item => names.includes(item.ElementName || item.elementName));
    return found?.ElementValue || found?.elementValue || found?.Now?.Precipitation || "";
  }

  async function refreshWeatherFromCwa() {
    const key = window.CWA_API_KEY || localStorage.getItem("CWA_API_KEY") || localStorage.getItem("cwaApiKey");
    if (!key) {
      renderWeather();
      return;
    }

    try {
      const url = new URL("https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001");
      url.searchParams.set("Authorization", key);
      url.searchParams.set("format", "JSON");
      url.searchParams.set("StationName", weatherState.cwaStation);
      const response = await fetch(url.href, { cache: "no-store" });
      if (!response.ok) throw new Error(`CWA ${response.status}`);
      const data = await response.json();
      const stations = data.records?.Station || data.records?.location || [];
      const station = stations[0];
      const elements = station?.WeatherElement || station?.weatherElement || [];
      const weather = readCwaValue(elements, ["Weather", "天氣"]) || station?.Weather || weatherState.text;
      const temp = readCwaValue(elements, ["AirTemperature", "TEMP", "氣溫"]) || station?.AirTemperature || weatherState.temp;
      weatherState.text = String(weather || weatherState.text).replace("無資料", "多雲時晴");
      weatherState.temp = String(temp || weatherState.temp);
      weatherState.location = "台北市 信義區";
    } catch (error) {
      console.warn("中央氣象署天氣更新失敗，使用本機備援資料。", error);
    } finally {
      renderWeather();
    }
  }

  function setSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    const slide = slides[activeSlide];

    spotlightCard.classList.add("is-changing");
    spotlightCard.classList.toggle("is-meal", slide.type === "meal");
    window.setTimeout(() => spotlightCard.classList.remove("is-changing"), 180);

    spotlightImage.src = slide.image;
    spotlightImage.alt = slide.title;
    spotlightTag.textContent = slide.tag;
    spotlightTitle.textContent = slide.title;
    spotlightEnglish.textContent = slide.english;
    spotlightMeta.textContent = slide.meta;
    spotlightDescription.textContent = slide.description;
    spotlightAction.textContent = slide.action;
    spotlightAction.setAttribute("aria-label", slide.action);
    spotlightAction.href = slide.type === "movie" ? "employee.html#moviesView" : `lunch.html?store=${encodeURIComponent(slide.id)}`;
    spotlightAction.dataset.href = spotlightAction.href;
    spotlightAction.dataset.movieId = slide.type === "movie" ? slide.id : "";
    spotlightAction.dataset.storeId = slide.type === "meal" ? slide.id : "";

    Array.from(pager.children).forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === activeSlide);
      button.setAttribute("aria-pressed", String(buttonIndex === activeSlide));
    });
  }

  function buildPager() {
    slides.forEach((slide, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `第 ${index + 1} 則輪播`);
      button.addEventListener("click", () => setSlide(index));
      pager.append(button);
    });
    setSlide(0);
  }

  function setTodaySlide(index) {
    if (!todaySlides.length) return;
    activeTodaySlide = (index + todaySlides.length) % todaySlides.length;

    todaySlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeTodaySlide;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    Array.from(todaySlideDots?.children || []).forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === activeTodaySlide);
      button.setAttribute("aria-pressed", String(buttonIndex === activeTodaySlide));
    });
  }

  function initTodayCarousel() {
    if (!todaySlides.length || !todaySlideDots) return;
    todaySlideDots.innerHTML = "";

    todaySlides.forEach((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `第 ${index + 1} 則今日資訊`);
      button.addEventListener("click", () => setTodaySlide(index));
      todaySlideDots.append(button);
    });

    setTodaySlide(0);
  }

  const notificationStorageKey = "wohours.homeNotifications.v1";
  const notificationTemplates = [
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

  function readNotifications() {
    try {
      return JSON.parse(localStorage.getItem(notificationStorageKey) || "[]");
    } catch (_) {
      return [];
    }
  }

  function saveNotifications(items) {
    localStorage.setItem(notificationStorageKey, JSON.stringify(items));
  }

  function formatNotificationTime(date = new Date()) {
    return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function routeNotification(item) {
    if (!item?.href) return;
    window.location.href = item.href;
  }

  function renderNotifications() {
    if (!notificationList || !notificationEmpty) return;
    const items = readNotifications();
    notificationList.innerHTML = "";
    notificationEmpty.hidden = items.length > 0;
    clearNotifications?.toggleAttribute("disabled", items.length === 0);
    notificationDot?.classList.toggle("is-hidden", items.length === 0);

    items.forEach(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "notification-item";
      button.dataset.notificationId = item.id;
      button.innerHTML = `
        <span>${item.tag || "系統通知"}</span>
        <strong>${item.title}</strong>
        <small>${item.text}</small>
        <time>${item.time}</time>
        <i type="button" role="button" aria-label="刪除此通知" data-delete-notification="${item.id}">×</i>
      `;
      button.addEventListener("click", () => routeNotification(item));
      notificationList.append(button);
    });
  }

  function addSystemNotification(template) {
    const items = readNotifications();
    const source = template || notificationTemplates[items.length % notificationTemplates.length];
    const next = {
      id: `notice-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: source.title,
      text: source.text,
      href: source.href,
      tag: source.tag,
      time: formatNotificationTime()
    };
    saveNotifications([next, ...items].slice(0, 12));
    renderNotifications();
  }

  function initNotifications() {
    if (window.WohoursNotifications) {
      window.WohoursNotifications.init();
      return;
    }
    if (!notifyButton || !notificationPanel) return;
    if (!readNotifications().length) {
      addSystemNotification(notificationTemplates[0]);
    } else {
      renderNotifications();
    }

    notifyButton.addEventListener("click", event => {
      event.stopPropagation();
      const willOpen = notificationPanel.hidden;
      notificationPanel.hidden = !willOpen;
      notificationPanel.setAttribute("aria-hidden", String(!willOpen));
      notifyButton.classList.toggle("is-open", willOpen);
    });

    notificationPanel.addEventListener("click", event => {
      const deleteButton = event.target.closest("[data-delete-notification]");
      if (!deleteButton) return;
      event.preventDefault();
      event.stopPropagation();
      saveNotifications(readNotifications().filter(item => item.id !== deleteButton.dataset.deleteNotification));
      renderNotifications();
    });

    clearNotifications?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      saveNotifications([]);
      renderNotifications();
    });

    document.addEventListener("click", event => {
      if (event.target.closest(".status-area")) return;
      notificationPanel.hidden = true;
      notificationPanel.setAttribute("aria-hidden", "true");
      notifyButton.classList.remove("is-open");
    });

    window.setInterval(() => addSystemNotification(), 1000 * 60 * 5);
  }
  let intercomNumber = "";
  let callTimer = null;
  let callSeconds = 0;
  let callConnectTimer = null;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isMouseDragging = false;

  function renderIntercomNumber() {
    if (!intercomDisplay) return;
    intercomDisplay.textContent = intercomNumber ? `${intercomNumber}_` : "_";
  }

  function updateIntercomClock() {
    const now = new Date();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const day = weekdayShort[now.getDay()];

    if (intercomTime) {
      intercomTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    if (intercomDate) {
      intercomDate.textContent = `${month}/${date}（${day}）`;
    }
  }
  function formatCallTime(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${pad(minute)}:${pad(second)}`;
  }

  function resetCallState() {
    window.clearInterval(callTimer);
    window.clearTimeout(callConnectTimer);

    callTimer = null;
    callConnectTimer = null;
    callSeconds = 0;

    if (intercomCallStatus) intercomCallStatus.hidden = true;
    if (intercomCallState) intercomCallState.textContent = "撥打中";
    if (intercomCallTimer) intercomCallTimer.textContent = "00:00";

    intercomRight?.classList.remove("is-calling");
    intercomActions?.classList.remove("is-talking");

    intercomCall?.classList.remove("is-calling", "is-connected");
    intercomHangup?.classList.remove("is-active");

    if (intercomHangup) {
      intercomHangup.hidden = true;
      intercomHangup.textContent = "掛斷";
    }

    if (intercomDelete) {
      intercomDelete.hidden = false;
    }

    if (intercomCall) {
      intercomCall.hidden = false;
      intercomCall.textContent = "撥打";
      intercomCall.disabled = false;
    }
  }

  function startCallTimer() {
    callSeconds = 0;

    if (intercomCallTimer) {
      intercomCallTimer.textContent = "00:00";
    }

    callTimer = window.setInterval(() => {
      callSeconds += 1;

      if (intercomCallTimer) {
        intercomCallTimer.textContent = formatCallTime(callSeconds);
      }
    }, 1000);
  }

  function startCallingAnimation() {
    if (!intercomNumber) return;

    window.clearInterval(callTimer);
    window.clearTimeout(callConnectTimer);

    callSeconds = 0;

    if (intercomCallStatus) intercomCallStatus.hidden = false;
    if (intercomCallState) intercomCallState.textContent = `正在撥打 #${intercomNumber}`;
    if (intercomCallTimer) intercomCallTimer.textContent = "等待接聽";

    intercomRight?.classList.add("is-calling");
    intercomActions?.classList.add("is-talking");

    if (intercomDelete) {
      intercomDelete.hidden = true;
    }

    if (intercomHangup) {
      intercomHangup.hidden = false;
      intercomHangup.classList.add("is-active");
    }

    if (intercomCall) {
      intercomCall.textContent = "撥打中...";
      intercomCall.disabled = true;
      intercomCall.classList.add("is-calling");
    }

    callConnectTimer = window.setTimeout(() => {
      if (intercomCallState) intercomCallState.textContent = `已接通 #${intercomNumber}`;

      if (intercomCall) {
        intercomCall.hidden = true;
        intercomCall.classList.remove("is-calling");
        intercomCall.classList.add("is-connected");
      }

      if (intercomHangup) {
        intercomHangup.textContent = "掛斷";
        intercomHangup.classList.add("is-active");
      }

      startCallTimer();
    }, 1800);
  }

  function openIntercom() {
    if (!intercomOverlay) return;

    updateIntercomClock();
    renderIntercomNumber();

    intercomOverlay.hidden = false;

    requestAnimationFrame(() => {
      intercomOverlay.classList.add("is-open");
      intercomOverlay.setAttribute("aria-hidden", "false");
    });
  }

  function closeIntercom() {
    if (!intercomOverlay) return;

    resetCallState();

    intercomOverlay.classList.remove("is-open");
    intercomOverlay.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      intercomOverlay.hidden = true;
    }, 480);
  }

  function isLeftBottomToRightTopSwipe(startX, startY, endX, endY) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const moveX = endX - startX;
    const moveY = endY - startY;

    const startFromLeftBottom =
      startX < screenWidth * 0.28 &&
      startY > screenHeight * 0.62;

    const moveToRightTop =
      moveX > 160 &&
      moveY < -130;

    const diagonalEnough =
      Math.abs(moveX) > 120 &&
      Math.abs(moveY) > 100;

    return startFromLeftBottom && moveToRightTop && diagonalEnough;
  }

  intercomClose?.addEventListener("click", closeIntercom);
  intercomBackdrop?.addEventListener("click", closeIntercom);

  document.querySelectorAll(".intercom-keypad button").forEach(button => {
    button.addEventListener("click", () => {
      resetCallState();
      if (intercomNumber.length >= 8) return;
      intercomNumber += button.dataset.key || "";
      renderIntercomNumber();
    });
  });

  document.querySelectorAll(".intercom-contact").forEach(button => {
    button.addEventListener("click", () => {
      resetCallState();
      intercomNumber = button.dataset.ext || "";
      renderIntercomNumber();
    });
  });

  intercomDelete?.addEventListener("click", () => {
    resetCallState();
    intercomNumber = intercomNumber.slice(0, -1);
    renderIntercomNumber();
  });

  intercomCall?.addEventListener("click", () => {
    if (!intercomNumber) return;
    startCallingAnimation();
  });
  intercomHangup?.addEventListener("click", () => {
    if (intercomCallState) intercomCallState.textContent = "通話已結束";
    if (intercomCallTimer) intercomCallTimer.textContent = formatCallTime(callSeconds);

    window.clearInterval(callTimer);
    window.clearTimeout(callConnectTimer);

    intercomHangup.textContent = "已掛斷";
    intercomHangup.classList.remove("is-active");

    window.setTimeout(() => {
      resetCallState();
    }, 900);
  });

  intercomSearch?.addEventListener("input", () => {
    const keyword = intercomSearch.value.trim().toLowerCase();

    document.querySelectorAll(".intercom-contact").forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(keyword) ? "grid" : "none";
    });
  });

  document.addEventListener("touchstart", event => {
    if (intercomOverlay?.classList.contains("is-open")) return;

    const touch = event.touches[0];
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
  }, { passive: true });

  document.addEventListener("touchend", event => {
    if (intercomOverlay?.classList.contains("is-open")) return;

    const touch = event.changedTouches[0];

    if (
      isLeftBottomToRightTopSwipe(
        swipeStartX,
        swipeStartY,
        touch.clientX,
        touch.clientY
      )
    ) {
      openIntercom();
    }
  }, { passive: true });

  document.addEventListener("mousedown", event => {
    if (intercomOverlay?.classList.contains("is-open")) return;

    mouseStartX = event.clientX;
    mouseStartY = event.clientY;
    isMouseDragging = true;
  });

  document.addEventListener("mouseup", event => {
    if (!isMouseDragging) return;
    if (intercomOverlay?.classList.contains("is-open")) return;

    isMouseDragging = false;

    if (
      isLeftBottomToRightTopSwipe(
        mouseStartX,
        mouseStartY,
        event.clientX,
        event.clientY
      )
    ) {
      openIntercom();
    }
  });

  renderIntercomNumber();
  updateIntercomClock();

  spotlightPrev.addEventListener("click", () => setSlide(activeSlide - 1));
  spotlightNext.addEventListener("click", () => setSlide(activeSlide + 1));
  spotlightAction.addEventListener("click", event => {
    const slide = slides[activeSlide];
    if (slide?.type === "movie" && slide.id) {
      localStorage.setItem("wohours.pendingStaffMovie", slide.id);
    }
    if (slide?.type === "meal" && slide.id) {
      localStorage.setItem("wohours.pendingLunchStore", slide.id);
    }
  });

  document.querySelectorAll(".feature-card, .spotlight-action").forEach(button => {
    button.addEventListener("click", event => {
      if (button.classList.contains("spotlight-action")) event.preventDefault();
      button.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(.985)" },
          { transform: "scale(1)" }
        ],
        { duration: 180, easing: "ease-out" }
      );
      if (button.dataset.href) {
        window.setTimeout(() => {
          window.location.href = button.dataset.href;
        }, 110);
      }
    });
  });

  const longPressTarget = document.getElementById("homeLogo");
  if (longPressTarget) {
    const href = longPressTarget.dataset.longpressHref || "attendance.html";
    let longPressTimer = null;
    let longPressTriggered = false;

    const clearLongPress = () => {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    };

    const startLongPress = () => {
      clearLongPress();
      longPressTriggered = false;
      longPressTimer = window.setTimeout(() => {
        longPressTriggered = true;
        longPressTarget.classList.add("is-long-pressing");
        window.location.href = href;
      }, 1000);
    };

    longPressTarget.addEventListener("pointerdown", startLongPress);
    longPressTarget.addEventListener("pointerup", clearLongPress);
    longPressTarget.addEventListener("pointerleave", clearLongPress);
    longPressTarget.addEventListener("pointercancel", clearLongPress);
    longPressTarget.addEventListener("click", event => {
      if (!longPressTriggered) event.preventDefault();
    });
    longPressTarget.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = href;
      }
    });
  }

  fitKiosk();
  updateClock();
  renderWeather();
  refreshWeatherFromCwa();
  initTodayCarousel();
  buildPager();
  initNotifications();
  window.addEventListener("resize", fitKiosk);
  window.setInterval(updateClock, 1000 * 20);
  window.setInterval(refreshWeatherFromCwa, 1000 * 60 * 10);
  window.setInterval(() => setTodaySlide(activeTodaySlide + 1), 1000 * 5);
  window.setInterval(() => setSlide(activeSlide + 1), 1000 * 5);
})();
