(() => {
  const screen = document.querySelector(".employee-screen");
  const main = document.querySelector(".employee-main");
  const views = [...document.querySelectorAll(".employee-view")];
  const navButtons = [...document.querySelectorAll("[data-view]")];
  const timeEl = document.getElementById("employeeTime");
  const dateEl = document.getElementById("employeeDate");
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  let toastTimer = null;
  let authStream = null;
  let faceStream = null;
  let healthStream = null;
  let pendingAuth = null;
  let partnerQrTimer = null;
  let currentPartner = "starbucks";
  let currentMovie = "passenger";
  const fullscreenEventViews = new Set([
    "eventHealthView",
    "eventHealthSignupView",
    "eventHealthSuccessView",
    "eventTripSignupView",
    "eventTripSuccessView"
  ]);

  const partners = {
    starbucks: {
      logo: "images/partner-starbucks.png",
      hero: "images/partner-starbucks-hero.png",
      title: "Starbucks",
      offer: "全飲品 85 折",
      content: "員工出示優惠 QR Code，手作飲品享 85 折。",
      stores: "全台指定門市",
      date: "2026/07/01 - 2026/12/31"
    },
    uniqlo: {
      logo: "images/partner-uniqlo.png",
      hero: "images/partner-uniqlo-product.png",
      title: "UNIQLO",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 UNIQLO 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    mcdonalds: {
      logo: "images/partner-mcdonalds.png",
      hero: "images/partner-mcdonalds.png",
      title: "麥當勞",
      offer: "指定套餐優惠",
      content: "早餐與午餐指定套餐享員工優惠價。",
      stores: "辦公室周邊合作門市",
      date: "2026/07/01 - 2026/09/30"
    },
    nike: {
      logo: "images/partner-nike.png",
      hero: "images/partner-nike-hero.png",
      title: "Nike",
      offer: "指定商品 9 折",
      content: "指定鞋款與運動服飾結帳享 9 折優惠。",
      stores: "全台指定 Nike 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    cosmed: {
      logo: "images/partner-cosmed.jpg",
      hero: "images/partner-cosmed-hero.png",
      title: "康是美",
      offer: "指定商品優惠",
      content: "保健、美妝與日用品指定商品享優惠。",
      stores: "全台康是美門市",
      date: "2026/07/01 - 2026/10/31"
    },
    formosa: {
      logo: "images/partner-formosa.png",
      hero: "images/partner-formosa.png",
      title: "鬍鬚張",
      offer: "指定套餐 9 折",
      content: "招牌便當與指定套餐享員工價。",
      stores: "台北市指定門市",
      date: "2026/07/01 - 2026/08/31"
    },
    gu: {
      logo: "images/partner-gu.png",
      hero: "images/partner-gu.png",
      title: "GU",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 GU 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    net: {
      logo: "images/partner-net.jpg",
      hero: "images/partner-net-hero.png",
      title: "NET",
      offer: "指定商品 9 折",
      content: "員工購買指定服飾商品享 9 折優惠。",
      stores: "全台 NET 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    movie: {
      logo: "images/partner-movie-ticket.png",
      hero: "images/PASSENGER拷貝2.jpg",
      title: "員工電影票",
      offer: "每月員工票券優惠",
      content: "每月可購買指定場次員工優惠票。",
      stores: "合作影城與線上購票",
      date: "2026/07/01 - 2026/07/31"
    }
  };

  const movies = {
    passenger: {
      title: "鬼上車",
      english: "PASSENGER",
      image: "images/PASSENGER拷貝2.jpg",
      tag: "口碑推薦",
      price: "$180",
      meta: ["★ 8.3", "劇情・懸疑", "116 分鐘"]
    },
    spiderman: {
      title: "蜘蛛人",
      english: "SPIDER-MAN",
      image: "images/SpiderManBrandNewDay拷貝2.jpg",
      tag: "熱映強片",
      price: "$180",
      meta: ["★ 8.1", "動作・冒險", "128 分鐘"]
    },
    sorrybaby: {
      title: "Sorry Baby",
      english: "SORRY BABY",
      image: "images/SorryBaby拷貝.jpg",
      tag: "影展選片",
      price: "$160",
      meta: ["★ 8.0", "劇情", "103 分鐘"]
    },
    hokum: {
      title: "Hokum",
      english: "HOKUM",
      image: "images/Hokum拷貝.png",
      tag: "驚悚選片",
      price: "$180",
      meta: ["★ 7.8", "恐怖・懸疑", "109 分鐘"]
    },
    minions: {
      title: "小小兵",
      english: "MINIONS",
      image: "images/MINIONSMONSTE拷貝.jpg",
      tag: "親子首選",
      price: "$180",
      meta: ["★ 7.7", "動畫・喜劇", "96 分鐘"]
    },
    realm: {
      title: "感官世界",
      english: "IN THE REALM",
      image: "images/InTheRealmOfTheSenses拷貝.jpg",
      tag: "經典重映",
      price: "$180",
      meta: ["★ 7.9", "劇情", "104 分鐘"]
    }
  };

  function fitKiosk() {
    window.fitKioskCanvas?.();
  }

  function updateClock() {
    const now = new Date();
    timeEl.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    dateEl.textContent = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}（${weekdays[now.getDay()]}）`;
  }

  function showView(id) {
    views.forEach((view) => {
      const active = view.id === id;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });
    main.classList.toggle("is-detail", id !== "hubView");
    if (fullscreenEventViews.has(id)) {
      screen?.classList.remove("is-event-sidebar-open");
    } else {
      screen?.classList.remove("is-event-sidebar-open");
    }
    main.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
    navButtons.forEach((button) => {
      if (button.closest(".employee-sidebar")) {
        const hasExactSidebarItem = document.querySelector(`.employee-sidebar [data-view="${id}"]`);
        button.classList.toggle(
          "active",
          button.dataset.view === id || (id !== "hubView" && button.dataset.view === "hubView" && !hasExactSidebarItem)
        );
      }
    });
    stopAuthCamera();
    if (id !== "eventHealthSignupView") stopHealthCamera();
  }

  window.WohoursShowEmployeeView = showView;

  function toast(message) {
    let node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      screen.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("visible"), 2600);
  }

  function lookupEmployee(value) {
    const raw = String(value || "").trim().toUpperCase();
    const digits = raw.replace(/\D/g, "");
    return window.MockEmployees?.find?.(digits || raw) || null;
  }

  function lookupEmployeeId(value) {
    return lookupEmployee(value)?.id || "";
  }

  function employeeNotFoundMessage() {
    return "查無此員工工號，請依員工資料輸入，例如 1111 - 1120。";
  }

  window.WohoursEmployeeLookup = {
    find: lookupEmployee,
    id: lookupEmployeeId,
    message: employeeNotFoundMessage
  };

  function closePartnerQrModal({ returnToHub = false } = {}) {
    const modal = document.getElementById("partnerQrModal");
    clearTimeout(partnerQrTimer);
    partnerQrTimer = null;
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
    if (returnToHub) {
      showView("hubView");
    }
  }

  function ensurePartnerQrModal() {
    let modal = document.getElementById("partnerQrModal");
    if (modal) return modal;

    modal = document.createElement("section");
    modal.id = "partnerQrModal";
    modal.className = "partner-qr-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="partner-qr-backdrop" data-close-partner-qr></div>
      <article class="partner-qr-dialog" role="dialog" aria-modal="true" aria-labelledby="partnerQrTitle">
        <button class="partner-qr-close" type="button" data-close-partner-qr>×</button>
        <div class="partner-qr-brand">
          <img id="partnerQrLogo" src="" alt="">
          <div>
            <small>PARTNER QR CODE</small>
            <strong id="partnerQrTitle">合作商家</strong>
          </div>
        </div>
        <p class="partner-qr-offer" id="partnerQrOffer">員工優惠</p>
        <div class="partner-qr-code">
          <img src="images/partner-qrcode.png" alt="優惠 QR Code">
        </div>
        <p class="partner-qr-note" id="partnerQrNote">請將此畫面出示給合作商家掃描，10 秒後自動返回員工專區。</p>
      </article>
    `;

    (screen || document.body).appendChild(modal);
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-partner-qr]")) {
        closePartnerQrModal({ returnToHub: true });
      }
    });

    return modal;
  }

  function showPartnerQrModal(employeeId) {
    const data = partners[currentPartner] || partners.starbucks;
    const modal = ensurePartnerQrModal();
    const logo = modal.querySelector("#partnerQrLogo");
    logo.src = data.logo;
    logo.alt = data.title;
    modal.querySelector("#partnerQrTitle").textContent = data.title;
    modal.querySelector("#partnerQrOffer").textContent = data.offer;
    modal.querySelector("#partnerQrNote").textContent =
      `員工 ${employeeId} 已完成驗證，請出示 QR Code 給店員掃描。10 秒後自動返回員工專區。`;

    clearTimeout(partnerQrTimer);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    partnerQrTimer = setTimeout(() => {
      closePartnerQrModal({ returnToHub: true });
    }, 10000);
  }

  function setPartner(id) {
    currentPartner = id;
    const data = partners[id];
    if (!data) return;
    document.getElementById("partnerCouponLogo").src = data.logo;
    document.getElementById("partnerCouponHero").src = data.hero;
    document.getElementById("partnerCouponTitle").textContent = data.title;
    document.getElementById("partnerCouponOffer").textContent = data.offer;
    document.getElementById("partnerCouponContent").textContent = data.content;
    document.getElementById("partnerCouponStores").textContent = data.stores;
    document.getElementById("partnerCouponDate").textContent = data.date;
    document.getElementById("partnerQrRow").hidden = true;
    document.getElementById("partnerVerifiedPhoto").hidden = true;
    closePartnerQrModal();
    const button = document.getElementById("partnerGetQrButton");
    button.disabled = false;
    button.textContent = "取得優惠 QR Code";
    showView("partnerCouponView");
  }

  function filterPartners(category) {
    document.querySelectorAll(".partner-tabs button").forEach((button) => {
      button.classList.toggle("active", button.dataset.category === category);
    });
    document.querySelectorAll(".partner-directory [data-partner]").forEach((button) => {
      button.hidden = category !== "all" && button.dataset.category !== category;
    });
  }

  function setMovie(id) {
    currentMovie = id;
    const data = movies[id] || movies.passenger;
    document.getElementById("movieDetailImage").src = data.image;
    document.getElementById("movieDetailTag").textContent = data.tag;
    document.getElementById("movieDetailTitle").textContent = data.title;
    document.getElementById("movieDetailEnglish").textContent = data.english;
    document.querySelector(".movie-meta-line").innerHTML = data.meta.map((item) => `<span>${item}</span>`).join("");
    document.getElementById("movieBuyButton").textContent = `確認員工票 ${data.price}`;
    document.getElementById("movieBuyMessage").textContent = "";
    showView("movieDetailView");
  }

  function openAuth({ title = "員工身分確認", text = "請輸入員工工號，下一步會開啟相機做身分核對。", onVerified }) {
    pendingAuth = onVerified;
    document.getElementById("authTitle").textContent = title;
    document.getElementById("authText").textContent = text;
    document.getElementById("authEmployeeId").value = "";
    document.getElementById("authMessage").textContent = "";
    document.getElementById("authFaceSnapshot").hidden = true;
    document.getElementById("authIdStep").classList.add("active");
    document.getElementById("authFaceStep").classList.remove("active");
    document.getElementById("employeeAuthModal").classList.add("active");
    document.getElementById("employeeAuthModal").setAttribute("aria-hidden", "false");
    setTimeout(() => document.getElementById("authEmployeeId").focus(), 80);
  }

  function closeAuth() {
    document.getElementById("employeeAuthModal").classList.remove("active");
    document.getElementById("employeeAuthModal").setAttribute("aria-hidden", "true");
    stopAuthCamera();
    pendingAuth = null;
  }

  async function startAuthCamera() {
    stopAuthCamera();
    const video = document.getElementById("authFaceVideo");
    try {
      authStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      video.srcObject = authStream;
      await video.play();
    } catch (error) {
      document.getElementById("authMessage").textContent = "無法開啟相機，請確認瀏覽器權限。";
    }
  }

  function stopAuthCamera() {
    if (authStream) {
      authStream.getTracks().forEach((track) => track.stop());
      authStream = null;
    }
    const video = document.getElementById("authFaceVideo");
    if (video) video.srcObject = null;
  }

  async function startHealthCamera() {
    stopHealthCamera();
    const video = document.getElementById("healthFaceVideo");
    if (!video || !navigator.mediaDevices?.getUserMedia) {
      throw new Error("camera-unavailable");
    }
    healthStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    video.srcObject = healthStream;
    await video.play();
  }

  function stopHealthCamera() {
    if (healthStream) {
      healthStream.getTracks().forEach((track) => track.stop());
      healthStream = null;
    }
    const video = document.getElementById("healthFaceVideo");
    if (video) video.srcObject = null;
  }

  function captureVideo(video) {
    if (!video || !video.videoWidth) return "";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.86);
  }

  function handleAuthAction(action) {
    const messages = {
      birthday: ["生日禮資格確認", "請輸入員工工號，驗證後可查看本月生日禮。"],
      movieDay: ["員工電影日報名", "請完成員工身分確認，即可登記活動資格。"],
      traffic: ["交通補助申請", "請完成員工身分確認，即可送出補助申請。"],
      phone: ["通訊補助申請", "請完成員工身分確認，即可送出補助申請。"],
      health: ["健康檢查預約", "請完成員工身分確認，即可預約健檢時段。"],
      trip: ["員工旅遊報名", "請完成員工身分確認，即可報名員工旅遊。"],
      stretch: ["工作坊報名", "請完成員工身分確認，即可報名伸展工作坊。"],
      parentDay: ["志工報名", "請完成員工身分確認，即可登記親子日志工。"]
    };
    const [title, text] = messages[action] || messages.movieDay;
    openAuth({
      title,
      text,
      onVerified: (employeeId) => {
        const resultText = `員工 ${employeeId} 已完成工號與人臉驗證。`;
        if (action === "birthday") {
          document.getElementById("birthdayResult").hidden = false;
          document.getElementById("birthdayEmployeeText").textContent = resultText;
          toast("生日禮資格已確認");
          return;
        }
        const target = {
          movieDay: "movieDayResult",
          traffic: "perksResult",
          phone: "perksResult",
          health: "healthResult",
          trip: "tripResult",
          stretch: "stretchResult",
          parentDay: "parentDayResult"
        }[action];
        if (target) document.getElementById(target).textContent = resultText;
        toast("驗證完成，已送出申請");
      }
    });
  }

  function initWelfareEvents() {
    const list = document.getElementById("welfareList");
    const records = document.getElementById("welfareRecords");
    if (!list || !records) return;

    const eventMeta = {
      trip: {
        title: "2026 宜蘭兩天一夜員工旅遊",
        peopleLabel: "報名人數",
        maxPeople: 2,
        date: "2026/08/10 — 2026/08/11",
        successView: "eventTripSuccessView",
        signupView: "eventTripSignupView"
      },
      health: {
        title: "年度健康講座：久坐與肩頸保健",
        peopleLabel: "報名人數",
        maxPeople: 1,
        date: "2026/07/25 13:30–16:30",
        successView: "eventHealthSuccessView",
        signupView: "eventHealthSignupView"
      },
      parentDay: { title: "親子日活動｜小小烘焙師體驗營", peopleLabel: "參加人數", maxPeople: 4, date: "2026/07/18 09:00–12:00" },
      gift: { title: "中秋禮盒領取提醒", peopleLabel: "領取份數", maxPeople: 1, date: "2026/09/01 — 2026/09/10" }
    };
    let signupDraft = { action: "trip", employeeId: "", people: 1 };
    let healthFaceVerified = false;
    const recordStorageKey = "wohoursWelfareSignupRecords";

    const formatSignupTime = () => {
      const now = new Date();
      return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };

    const loadWelfareRecords = () => {
      try {
        return JSON.parse(localStorage.getItem(recordStorageKey) || "[]");
      } catch (error) {
        return [];
      }
    };

    const saveWelfareRecords = (items) => {
      localStorage.setItem(recordStorageKey, JSON.stringify(items));
    };

    const normalizeEmployeeId = (value) => String(value || "").trim().toUpperCase();

    const hasActiveWelfareRecord = (action, employeeId) => {
      const id = normalizeEmployeeId(employeeId);
      if (!id) return false;
      return loadWelfareRecords().some(item =>
        item.action === action &&
        normalizeEmployeeId(item.employeeId) === id &&
        !/取消|作廢/.test(item.status || "")
      );
    };

    const syncEmployeeBenefitActivity = (action, employeeId, status) => {
      const id = normalizeEmployeeId(employeeId).replace(/\D/g, "");
      if (!id) return;
      const label = action === "trip"
        ? `員工旅遊${status}`
        : `${(eventMeta[action] || eventMeta.trip).title}${status}`;
      window.MockEmployees?.update?.(id, employee => ({
        benefits: { ...(employee.benefits || {}), activity: label }
      }));
    };

    const renderWelfareRecords = () => {
      const items = loadWelfareRecords();
      records.innerHTML = "";
      if (!items.length) {
        const empty = document.createElement("article");
        empty.className = "welfare-record-empty";
        empty.innerHTML = `<strong>尚無報名紀錄</strong><p>完成活動報名後，系統會記住報名活動、活動時間、報名時間與狀態。</p>`;
        records.appendChild(empty);
        return;
      }

      items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "welfare-record-card";
        card.innerHTML = `
          <div class="record-status">${item.status}</div>
          <strong>${item.title}</strong>
          <dl>
            <div><dt>活動時間</dt><dd>${item.eventDate}</dd></div>
            <div><dt>報名時間</dt><dd>${item.signupTime}</dd></div>
            <div><dt>員工工號</dt><dd>${item.employeeId}</dd></div>
            <div><dt>${item.peopleLabel}</dt><dd>${item.people}</dd></div>
          </dl>
        `;
        records.appendChild(card);
      });
    };

    const addWelfareRecord = ({ action, employeeId = "", people = 1, status = "已報名", signupTime = formatSignupTime() }) => {
      const data = eventMeta[action] || eventMeta.trip;
      const items = loadWelfareRecords();
      const normalizedId = normalizeEmployeeId(employeeId);
      const duplicate = items.find(item =>
        item.action === action &&
        normalizeEmployeeId(item.employeeId) === normalizedId &&
        !/取消|作廢/.test(item.status || "")
      );
      if (duplicate) {
        duplicate.signupTime = duplicate.signupTime || signupTime;
        duplicate.status = duplicate.status || status;
        saveWelfareRecords(items);
        renderWelfareRecords();
        return duplicate;
      }
      items.unshift({
        id: `${action}-${Date.now()}`,
        action,
        title: data.title,
        eventDate: data.date,
        employeeId: normalizedId,
        people,
        peopleLabel: data.peopleLabel,
        signupTime,
        status
      });
      saveWelfareRecords(items);
      syncEmployeeBenefitActivity(action, normalizedId, status);
      renderWelfareRecords();
      return items[0];
    };

    const ensureSignupModal = () => {
      let modal = document.getElementById("welfareSignupModal");
      if (modal) return modal;

      modal = document.createElement("section");
      modal.id = "welfareSignupModal";
      modal.className = "welfare-signup-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="welfare-signup-backdrop" data-welfare-signup-close></div>
        <article class="welfare-signup-dialog" role="dialog" aria-modal="true">
          <button class="welfare-signup-close" type="button" data-welfare-signup-close>×</button>
          <small>REGISTRATION</small>
          <h2 id="welfareSignupTitle">活動報名</h2>
          <p id="welfareSignupText">已完成員工身分驗證，請確認報名資料。</p>
          <dl>
            <div><dt>員工工號</dt><dd id="welfareSignupEmployee">1111</dd></div>
            <div><dt id="welfareSignupPeopleLabel">報名人數</dt><dd><button type="button" data-welfare-people-minus>−</button><strong id="welfareSignupPeople">1</strong><button type="button" data-welfare-people-plus>＋</button></dd></div>
          </dl>
          <label>
            <span>備註</span>
            <input id="welfareSignupNote" maxlength="30" placeholder="例如：素食、攜眷姓名、特殊需求">
          </label>
          <button class="welfare-signup-submit" type="button" id="welfareSignupSubmit">送出報名</button>
          <p id="welfareSignupMessage" aria-live="polite"></p>
        </article>
      `;
      (screen || document.body).appendChild(modal);

      modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-welfare-signup-close]")) {
          modal.classList.remove("active");
          modal.setAttribute("aria-hidden", "true");
        }
      });

      modal.querySelector("[data-welfare-people-minus]").addEventListener("click", () => {
        signupDraft.people = Math.max(1, signupDraft.people - 1);
        modal.querySelector("#welfareSignupPeople").textContent = String(signupDraft.people);
      });

      modal.querySelector("[data-welfare-people-plus]").addEventListener("click", () => {
        const maxPeople = eventMeta[signupDraft.action]?.maxPeople || 1;
        signupDraft.people = Math.min(maxPeople, signupDraft.people + 1);
        modal.querySelector("#welfareSignupPeople").textContent = String(signupDraft.people);
      });

      modal.querySelector("#welfareSignupSubmit").addEventListener("click", () => {
        const data = eventMeta[signupDraft.action] || eventMeta.trip;
        if (hasActiveWelfareRecord(signupDraft.action, signupDraft.employeeId)) {
          modal.querySelector("#welfareSignupMessage").textContent = "系統已記錄此員工報名過，不能重複報名。";
          toast("已報名過，請查看我的報名紀錄");
          setTimeout(() => {
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            showWelfareRecords();
          }, 900);
          return;
        }
        addWelfareRecord({
          action: signupDraft.action,
          employeeId: signupDraft.employeeId,
          people: signupDraft.people,
          status: "待人資確認"
        });
        modal.querySelector("#welfareSignupMessage").textContent = "已送出報名，請至我的報名紀錄查看。";
        toast("報名已送出");
        setTimeout(() => {
          modal.classList.remove("active");
          modal.setAttribute("aria-hidden", "true");
        }, 900);
      });

      return modal;
    };

    const openSignupModal = (action, employeeId) => {
      const data = eventMeta[action] || eventMeta.trip;
      signupDraft = { action, employeeId, people: 1 };
      const modal = ensureSignupModal();
      modal.querySelector("#welfareSignupTitle").textContent = data.title;
      modal.querySelector("#welfareSignupText").textContent = "已完成工號與人臉驗證，請確認報名人數。";
      modal.querySelector("#welfareSignupEmployee").textContent = employeeId;
      modal.querySelector("#welfareSignupPeopleLabel").textContent = data.peopleLabel;
      modal.querySelector("#welfareSignupPeople").textContent = "1";
      modal.querySelector("#welfareSignupNote").value = "";
      modal.querySelector("#welfareSignupMessage").textContent = "";
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
    };

    const openEventSignupPage = (action) => {
      const data = eventMeta[action] || eventMeta.trip;
      if (action === "health") {
        const input = document.getElementById("healthSignupId");
        const status = document.getElementById("healthIdStatus");
        const faceCard = document.querySelector(".health-verify-card:nth-child(2)");
        const faceStatus = document.getElementById("healthFaceStatus");
        const faceButton = document.getElementById("healthFaceButton");
        const submit = document.getElementById("healthSignupSubmit");
        healthFaceVerified = false;
        stopHealthCamera();
        if (input) input.value = "";
        if (status) status.textContent = "請輸入員工工號";
        faceCard?.classList.remove("is-verified");
        if (faceStatus) faceStatus.textContent = "請將臉部置於取景框內";
        if (faceButton) faceButton.textContent = "開始辨識";
        if (submit) submit.disabled = true;
      }
      showView(data.signupView || "eventsView");
    };

    const showWelfareRecords = () => {
      showView("eventsView");
      requestAnimationFrame(() => {
        document.querySelector('#eventsView [data-welfare-tab="records"]')?.click();
      });
    };

    document.querySelectorAll("[data-welfare-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.welfareFilter;
        document.querySelectorAll("[data-welfare-filter]").forEach((item) => item.classList.toggle("active", item === button));
        list.querySelectorAll(".welfare-list-row").forEach((row) => {
          const categories = row.dataset.welfareCategory || "";
          row.hidden = filter !== "all" && !categories.split(" ").includes(filter);
        });
      });
    });

    document.querySelectorAll("[data-welfare-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const showRecords = button.dataset.welfareTab === "records";
        document.querySelectorAll("[data-welfare-tab]").forEach((item) => item.classList.toggle("active", item === button));
        list.hidden = showRecords;
        records.hidden = !showRecords;
      });
    });

    document.querySelectorAll("[data-welfare-signup]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const action = button.dataset.welfareSignup;
        const data = eventMeta[action] || eventMeta.trip;
        openAuth({
          title: data.title,
          text: "請先輸入工號並完成拍照驗證，再確認報名人數。",
          onVerified: (employeeId) => openSignupModal(action, employeeId)
        });
      });
    });

    document.querySelectorAll("[data-event-signup]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openEventSignupPage(button.dataset.eventSignup);
      });
    });

    document.getElementById("tripRegisterForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const employeeId = document.getElementById("tripEmployeeId")?.value.trim().toUpperCase() || "";
      const employee = window.WohoursEmployeeLookup?.find?.(employeeId);
      if (!employee) {
        toast(window.WohoursEmployeeLookup?.message?.() || "查無此員工工號");
        document.getElementById("tripEmployeeId")?.focus();
        return;
      }
      if (hasActiveWelfareRecord("trip", employeeId)) {
        toast("此員工已報名員工旅遊，不能重複報名");
        showWelfareRecords();
        return;
      }
      addWelfareRecord({ action: "trip", employeeId: employee.id, people: 1, status: "已報名" });
      toast("員工旅遊報名成功");
      showView("eventTripSuccessView");
    });

    const healthInput = document.getElementById("healthSignupId");
    const healthStatus = document.getElementById("healthIdStatus");
    const healthFaceCard = document.querySelector(".health-verify-card:nth-child(2)");
    const healthFaceStatus = document.getElementById("healthFaceStatus");
    const healthFaceButton = document.getElementById("healthFaceButton");
    const healthSubmit = document.getElementById("healthSignupSubmit");

    const syncHealthSubmit = () => {
      if (!healthSubmit || !healthInput) return;
      healthSubmit.disabled = !window.WohoursEmployeeLookup?.find?.(healthInput.value.trim()) || !healthFaceVerified;
    };

    healthInput?.addEventListener("input", () => {
      healthFaceVerified = false;
      stopHealthCamera();
      healthFaceCard?.classList.remove("is-verified");
      if (healthFaceButton) healthFaceButton.textContent = "開始辨識";
      if (healthFaceStatus) healthFaceStatus.textContent = "請將臉部置於取景框內";
      const employee = window.WohoursEmployeeLookup?.find?.(healthInput.value.trim());
      if (healthStatus) healthStatus.textContent = employee ? `已找到 ${employee.name}｜${employee.dept}` : "請輸入系統內員工工號";
      syncHealthSubmit();
    });

    healthFaceButton?.addEventListener("click", async () => {
      const employee = window.WohoursEmployeeLookup?.find?.(healthInput?.value.trim());
      if (!healthInput || !employee) {
        if (healthStatus) healthStatus.textContent = window.WohoursEmployeeLookup?.message?.() || "請先輸入正確員工工號";
        syncHealthSubmit();
        return;
      }
      healthFaceButton.disabled = true;
      healthFaceButton.textContent = "開啟鏡頭中...";
      if (healthFaceStatus) healthFaceStatus.textContent = "正在開啟鏡頭，請允許瀏覽器使用相機。";
      try {
        await startHealthCamera();
        healthFaceButton.textContent = "辨識中...";
        if (healthFaceStatus) healthFaceStatus.textContent = "鏡頭已開啟，正在比對人臉資料...";
        setTimeout(() => {
          healthFaceVerified = true;
          healthFaceButton.disabled = false;
          healthFaceButton.textContent = "辨識完成";
          healthFaceCard?.classList.add("is-verified");
          if (healthFaceStatus) healthFaceStatus.textContent = "人臉辨識已完成";
          syncHealthSubmit();
        }, 850);
      } catch (error) {
        healthFaceVerified = false;
        healthFaceButton.disabled = false;
        healthFaceButton.textContent = "重新開啟鏡頭";
        if (healthFaceStatus) healthFaceStatus.textContent = "無法開啟鏡頭，請確認瀏覽器相機權限。";
        syncHealthSubmit();
      }
    });

    healthSubmit?.addEventListener("click", () => {
      if (healthSubmit.disabled || !healthInput) return;
      const employee = window.WohoursEmployeeLookup?.find?.(healthInput.value.trim());
      if (!employee) {
        if (healthStatus) healthStatus.textContent = window.WohoursEmployeeLookup?.message?.() || "查無此員工工號";
        syncHealthSubmit();
        return;
      }
      const signupTime = formatSignupTime();
      if (hasActiveWelfareRecord("health", employee.id)) {
        toast("此員工已報名健康講座，不能重複報名");
        stopHealthCamera();
        showWelfareRecords();
        return;
      }
      document.getElementById("healthSignupTime").textContent = signupTime;
      document.getElementById("healthSignupNo").textContent = `EV20260725${String(Math.floor(Math.random() * 90) + 10)}18`;
      addWelfareRecord({ action: "health", employeeId: employee.id, people: 1, status: "已報名", signupTime });
      stopHealthCamera();
      toast("健康講座報名成功");
      showView("eventHealthSuccessView");
    });

    document.querySelectorAll("[data-show-welfare-records]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        showWelfareRecords();
      });
    });

    renderWelfareRecords();
  }

  function startFaceCamera() {
    const video = document.getElementById("faceVideo");
    const status = document.getElementById("faceCameraStatus");
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = "此瀏覽器不支援相機";
      return;
    }
    if (faceStream) faceStream.getTracks().forEach((track) => track.stop());
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        faceStream = stream;
        video.srcObject = stream;
        status.textContent = "相機已開啟，請對準取景框";
        return video.play();
      })
      .catch(() => {
        status.textContent = "無法開啟相機，請確認權限";
      });
  }

  function stopFaceCamera() {
    if (faceStream) {
      faceStream.getTracks().forEach((track) => track.stop());
      faceStream = null;
    }
    const video = document.getElementById("faceVideo");
    if (video) video.srcObject = null;
  }

  function initFaceRegistration() {
    if (document.querySelector("#faceView .face-register-card")) return;

    const page = document.getElementById("faceView");
    const card = page?.querySelector(".face-register-card");
    const wheel = page?.querySelector(".face-wheel");
    const employeeId = document.getElementById("faceEmployeeId");
    const idError = document.getElementById("faceError");
    const consentInput = document.getElementById("agreeFace");
    const consentError = document.getElementById("faceConsentError");
    const consentButton = document.getElementById("openFaceCamera");
    const cameraButton = document.getElementById("completeFace");
    const cameraTitle = document.getElementById("faceCameraTitle");
    const cameraHint = document.getElementById("faceCameraHint");
    const cameraStatus = document.getElementById("faceCameraStatus");
    const checks = [...document.querySelectorAll("#faceCaptureChecks li")];
    const successText = document.getElementById("faceSuccessText");
    let faceStep = 1;
    let faceScanTimer = null;
    let faceAutoTimer = null;

    if (!page || !card || !wheel || !employeeId || !cameraButton) return;

    const setMessage = (node, text = "") => {
      if (node) node.textContent = text;
    };

    const pulseError = (target, text, messageNode) => {
      setMessage(messageNode, text);
      card.classList.add("is-error");
      target?.classList.remove("shake");
      void target?.offsetWidth;
      target?.classList.add("shake");
      setTimeout(() => {
        card.classList.remove("is-error");
        target?.classList.remove("shake");
      }, 1500);
    };

    const resetCaptureState = () => {
      clearTimeout(faceScanTimer);
      checks.forEach((item) => item.classList.remove("done"));
      card.classList.remove("is-scanning", "is-capture-success", "is-face-warning", "is-light-warning");
      cameraButton.disabled = false;
      cameraButton.textContent = "開始拍攝";
      cameraTitle.textContent = "準備拍攝";
      cameraHint.textContent = "請將臉部置於取景框中央";
      setMessage(cameraStatus, "等待相機權限");
    };

    const setStep = (step, { animated = true } = {}) => {
      faceStep = step;
      clearTimeout(faceAutoTimer);
      card.dataset.faceStep = String(step);
      wheel.style.setProperty("--face-progress-angle", `${step * 90}deg`);
      card.classList.toggle("is-transitioning", animated);
      setTimeout(() => card.classList.remove("is-transitioning"), 620);

      page.querySelectorAll("[data-face-panel]").forEach((panel) => {
        const panelStep = Number(panel.dataset.facePanel);
        const active = panelStep === step;
        panel.classList.toggle("active", active);
        panel.setAttribute("aria-hidden", active ? "false" : "true");
      });

      page.querySelectorAll("[data-wheel-marker], [data-face-progress], [data-face-bottom]").forEach((item) => {
        const itemStep = Number(item.dataset.wheelMarker || item.dataset.faceProgress || item.dataset.faceBottom);
        item.classList.toggle("active", itemStep === step);
        item.classList.toggle("done", itemStep < step);
      });

      if (step === 3) {
        resetCaptureState();
      }

      if (step === 4) {
        stopFaceCamera();
        card.classList.add("is-capture-success");
        successText.innerHTML = `員工 ${employeeId.value.trim()}<br>人臉註冊已完成`;
        faceAutoTimer = setTimeout(() => showView("hubView"), 3000);
      }
    };

    const resetFaceFlow = () => {
      clearTimeout(faceScanTimer);
      clearTimeout(faceAutoTimer);
      stopFaceCamera();
      employeeId.value = "";
      consentInput.checked = false;
      consentButton.disabled = true;
      setMessage(idError);
      setMessage(consentError);
      resetCaptureState();
      card.classList.remove("is-error", "is-scanning", "is-capture-success", "is-face-warning", "is-light-warning");
      card.classList.add("is-entering");
      setStep(1, { animated: false });
      setTimeout(() => card.classList.remove("is-entering"), 1400);
    };

    document.getElementById("startConsent")?.addEventListener("click", () => {
      const value = employeeId.value.trim();
      if (!/^\d{4,8}$/.test(value) || value === "0000") {
        pulseError(employeeId.closest(".face-id-field"), value === "0000" ? "查無此員工工號，請重新輸入" : "請輸入 4 到 8 位數工號", idError);
        return;
      }
      const employee = window.WohoursEmployeeLookup?.find?.(value);
      if (!employee) {
        pulseError(employeeId.closest(".face-id-field"), window.WohoursEmployeeLookup?.message?.() || "查無此員工工號，請重新輸入", idError);
        return;
      }
      employeeId.value = employee.id;
      setMessage(idError);
      setStep(2);
    });

    employeeId.addEventListener("input", () => {
      employeeId.closest(".face-id-field")?.classList.toggle("has-value", employeeId.value.trim().length > 0);
      setMessage(idError);
    });

    consentInput.addEventListener("change", (event) => {
      consentButton.disabled = !event.target.checked;
      setMessage(consentError);
      document.getElementById("faceConsentCheck")?.classList.toggle("checked", event.target.checked);
    });

    consentButton.addEventListener("click", async () => {
      if (!consentInput.checked) {
        pulseError(document.getElementById("faceConsentCheck"), "請先勾選同意後再繼續", consentError);
        return;
      }
      setStep(3);
      await startFaceCamera();
      setMessage(cameraStatus, "相機已就緒，請正視鏡頭");
    });

    cameraButton.addEventListener("click", () => {
      if (card.classList.contains("is-scanning")) return;
      const value = employeeId.value.trim();

      if (value.endsWith("9")) {
        card.classList.add("is-face-warning");
        setMessage(cameraStatus, "請將臉部置於取景框中央");
        setTimeout(() => card.classList.remove("is-face-warning"), 1800);
        return;
      }

      if (value.endsWith("8")) {
        card.classList.add("is-light-warning");
        setMessage(cameraStatus, "目前光線不足，請移至明亮處");
        setTimeout(() => card.classList.remove("is-light-warning"), 1800);
        return;
      }

      card.classList.add("is-scanning");
      cameraButton.disabled = true;
      cameraButton.textContent = "辨識中...";
      cameraTitle.textContent = "拍攝中，請保持不動";
      cameraHint.textContent = "正在擷取人臉資料...";
      setMessage(cameraStatus, "掃描中，請維持臉部置中");

      checks.forEach((item, index) => {
        setTimeout(() => item.classList.add("done"), 520 + index * 520);
      });

      faceScanTimer = setTimeout(() => {
        card.classList.remove("is-scanning");
        card.classList.add("is-capture-success");
        setMessage(cameraStatus, "人臉資料已擷取");
        setStep(4);
      }, 2800);
    });

    document.querySelectorAll('[data-view="faceView"]').forEach((button) => {
      button.addEventListener("click", () => setTimeout(resetFaceFlow, 80));
    });

    document.querySelector("[data-face-return]")?.addEventListener("click", () => {
      clearTimeout(faceAutoTimer);
      stopFaceCamera();
    });

    resetFaceFlow();
  }

  function initRepair() {
    const categorySelect = document.getElementById("repairCategory");
    const locationSelect = document.getElementById("repairLocation");
    const descriptionInput = document.getElementById("repairDescription");
    const descriptionCount = document.getElementById("repairDescriptionCount");
    const employeeIdInput = document.getElementById("repairEmployeeId");
    const message = document.getElementById("repairMessage");

    if (!categorySelect || !locationSelect || !descriptionInput || !employeeIdInput) return;

    const closeRepairSelects = (except = null) => {
      document.querySelectorAll(".repair-custom-select.is-open").forEach((select) => {
        if (select === except) return;
        select.classList.remove("is-open");
        select.querySelector(".repair-select-trigger")?.setAttribute("aria-expanded", "false");
      });
    };

    const syncRepairSelect = (nativeSelect) => {
      const customSelect = document.querySelector(`[data-repair-select="${nativeSelect.id}"]`);
      if (!customSelect) return;
      const trigger = customSelect.querySelector(".repair-select-trigger");
      const label = trigger?.querySelector("span");
      const selectedOption = nativeSelect.selectedOptions?.[0];
      const selectedText = selectedOption?.textContent?.trim() || nativeSelect.options[0]?.textContent?.trim() || "";

      customSelect.querySelectorAll("[role='option']").forEach((option) => {
        const selected = option.dataset.value === nativeSelect.value;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-selected", selected ? "true" : "false");
      });

      if (label) label.textContent = selectedText;
      trigger?.classList.toggle("is-placeholder", !nativeSelect.value);
    };

    const bindRepairSelect = (nativeSelect) => {
      const customSelect = document.querySelector(`[data-repair-select="${nativeSelect.id}"]`);
      if (!customSelect) return;
      const trigger = customSelect.querySelector(".repair-select-trigger");

      trigger?.addEventListener("click", (event) => {
        event.preventDefault();
        const willOpen = !customSelect.classList.contains("is-open");
        closeRepairSelects(customSelect);
        customSelect.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      customSelect.querySelectorAll("[role='option']").forEach((option) => {
        option.addEventListener("click", (event) => {
          event.preventDefault();
          nativeSelect.value = option.dataset.value || "";
          nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
          syncRepairSelect(nativeSelect);
          closeRepairSelects();
        });
      });

      nativeSelect.addEventListener("change", () => syncRepairSelect(nativeSelect));
      syncRepairSelect(nativeSelect);
    };

    bindRepairSelect(categorySelect);
    bindRepairSelect(locationSelect);

    document.addEventListener("click", (event) => {
      if (event.target.closest(".repair-custom-select")) return;
      closeRepairSelects();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeRepairSelects();
    });

    document.querySelectorAll("[data-repair-category]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-repair-category]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        categorySelect.value = button.dataset.repairCategory;
        syncRepairSelect(categorySelect);
      });
    });

    descriptionInput.addEventListener("input", () => {
      descriptionCount.textContent = String(descriptionInput.value.length);
    });

    document.getElementById("repairSubmit").addEventListener("click", () => {
      const category = categorySelect.value;
      const location = locationSelect.value;
      const description = descriptionInput.value.trim();
      const employeeId = employeeIdInput.value.trim();
      const urgency = document.querySelector("input[name='repairUrgency']:checked")?.value || "中";

      if (!category) {
        message.textContent = "請選擇問題類型";
        return;
      }
      if (!location) {
        message.textContent = "請選擇報修位置";
        return;
      }
      if (!description) {
        message.textContent = "請填寫問題描述";
        return;
      }
      if (!/^\d{4,8}$/.test(employeeId)) {
        message.textContent = "請輸入 4 到 8 位數工號";
        return;
      }
      const employee = window.WohoursEmployeeLookup?.find?.(employeeId);
      if (!employee) {
        message.textContent = window.WohoursEmployeeLookup?.message?.() || "查無此員工工號";
        employeeIdInput.focus();
        return;
      }

      const tbody = document.querySelector(".repair-records tbody");
      const now = new Date();
      const categoryName = category.split("：")[0];
      const submittedAt = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      if (tbody) {
        const row = document.createElement("tr");
        row.innerHTML = `<td><span class="badge gray">待處理</span></td><td>${categoryName}</td><td>${location}</td><td>${submittedAt}</td><td><span class="progress gray">待處理</span></td>`;
        tbody.prepend(row);
      }

      message.textContent = `${employee.name}（${employee.id}）已送出 ${urgency} 緊急程度的維修申請，行政人員將協助安排處理。`;
      toast(`${categoryName} 維修申請已送出`);
      categorySelect.value = "";
      locationSelect.value = "";
      descriptionInput.value = "";
      employeeIdInput.value = "";
      descriptionCount.textContent = "0";
      syncRepairSelect(categorySelect);
      syncRepairSelect(locationSelect);
      document.querySelector("input[name='repairUrgency'][value='中']").checked = true;
    });
  }

  function bindEvents() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = button.dataset.view;
        if (!id) return;
        event.preventDefault();
        showView(id);
      });
    });

    document.querySelectorAll("[data-href]").forEach((button) => {
      button.addEventListener("click", () => {
        const href = button.dataset.href;
        if (href) window.location.href = href;
      });
    });

    document.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => filterPartners(button.dataset.category));
    });

    document.querySelectorAll("[data-partner]").forEach((button) => {
      button.addEventListener("click", () => setPartner(button.dataset.partner));
    });

    document.querySelectorAll("[data-movie]").forEach((button) => {
      button.addEventListener("click", () => setMovie(button.dataset.movie));
    });

    document.querySelectorAll(".employee-sessions button").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".employee-sessions button").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
      });
    });

    document.querySelectorAll("[data-auth-action]").forEach((button) => {
      button.addEventListener("click", () => handleAuthAction(button.dataset.authAction));
    });

    document.getElementById("partnerGetQrButton").addEventListener("click", () => {
      const data = partners[currentPartner];
      openAuth({
        title: "取得優惠 QR Code",
        text: `請完成員工工號與人臉驗證，即可取得 ${data.title} 優惠 QR Code。`,
        onVerified: (employeeId, photo) => {
          const qrRow = document.getElementById("partnerQrRow");
          const photoEl = document.getElementById("partnerVerifiedPhoto");
          qrRow.hidden = false;
          document.getElementById("partnerQrText").textContent = `員工 ${employeeId} 已完成驗證，請出示 QR Code 給店員掃描。`;
          if (photo) {
            photoEl.src = photo;
            photoEl.hidden = false;
          }
          const button = document.getElementById("partnerGetQrButton");
          button.textContent = "已產生優惠 QR Code";
          button.disabled = true;
          toast("優惠 QR Code 已產生");
          showPartnerQrModal(employeeId);
        }
      });
    });

    document.getElementById("movieBuyButton")?.addEventListener("click", () => {
      const data = movies[currentMovie];
      openAuth({
        title: "確認員工電影票",
        text: `請完成員工工號與人臉驗證，即可購買 ${data.title} 員工票。`,
        onVerified: (employeeId) => {
          document.getElementById("movieBuyMessage").textContent = `員工 ${employeeId} 已完成驗證，${data.title} 員工票已保留。`;
          toast("員工票已完成保留");
        }
      });
    });

    document.getElementById("authConfirmId").addEventListener("click", async () => {
      const input = document.getElementById("authEmployeeId");
      const message = document.getElementById("authMessage");
      if (!/^\d{4,8}$/.test(input.value.trim())) {
        message.textContent = "請輸入 4 到 8 位數工號";
        return;
      }
      const employee = window.WohoursEmployeeLookup?.find?.(input.value.trim());
      if (!employee) {
        message.textContent = window.WohoursEmployeeLookup?.message?.() || "查無此員工工號";
        return;
      }
      input.value = employee.id;
      message.textContent = "";
      document.getElementById("authIdStep").classList.remove("active");
      document.getElementById("authFaceStep").classList.add("active");
      await startAuthCamera();
    });

    document.getElementById("authCaptureFace").addEventListener("click", () => {
      const employeeId = document.getElementById("authEmployeeId").value.trim();
      const photo = captureVideo(document.getElementById("authFaceVideo"));
      if (photo) {
        const snapshot = document.getElementById("authFaceSnapshot");
        snapshot.src = photo;
        snapshot.hidden = false;
      }
      const modal = document.getElementById("employeeAuthModal");
      if (modal?.dataset.partnerQrMode === "true") {
        modal.dataset.partnerQrMode = "false";
        closeAuth();
        window.WohoursOpenPartnerQrModal?.(employeeId);
        return;
      }
      const callback = pendingAuth;
      closeAuth();
      if (callback) callback(employeeId, photo);
    });

    document.querySelectorAll("[data-auth-close]").forEach((button) => {
      button.addEventListener("click", closeAuth);
    });

    document.querySelector(".employee-bell")?.addEventListener("click", () => {
      toast("目前有 3 則新通知：快遞、訪客與福利提醒");
    });

    document.querySelectorAll("[data-health-sidebar-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        screen?.classList.add("is-event-sidebar-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.getElementById("partnerQrModal")?.classList.contains("active")) {
        closePartnerQrModal({ returnToHub: true });
      }
    });
  }

  fitKiosk();
  updateClock();
  bindEvents();
  const initialView = location.hash.replace("#", "");
  if (initialView && document.getElementById(initialView)?.classList.contains("employee-view")) {
    showView(initialView);
  }
  initWelfareEvents();
  initFaceRegistration();
  initRepair();
  filterPartners("all");
  setInterval(updateClock, 1000);
  window.addEventListener("resize", fitKiosk);
  window.addEventListener("beforeunload", () => {
    stopAuthCamera();
    stopFaceCamera();
    stopHealthCamera();
  });
})();

/* ===============================
   員工電影優惠完整流程
   片單 → 詳情 → 工號與張數 → 場次 → 座位 → 餐點 → 付款 → 完成
   =============================== */
(() => {
  const page = document.getElementById("moviesView");
  if (!page) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const money = (value) => `$${Number(value || 0).toLocaleString("zh-TW")}`;
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  const movies = [
    {
      id: "toy5",
      title: "玩具總動員 5",
      en: "TOY STORY 5",
      poster: "images/ToyStory5_Poster.jpg",
      genre: "動畫・喜劇",
      minutes: 105,
      release: "2025.06.17（二）全台上映",
      synopsis: "老朋友們面對新世代玩具與科技挑戰，展開一場關於陪伴、勇氣與回家的冒險。"
    },
    {
      id: "supergirl",
      title: "超少女",
      en: "SUPERGIRL",
      poster: "images/Supergirl＿poster.jpg",
      genre: "動作・冒險・科幻",
      minutes: 126,
      release: "2025.06.24（二）全台上映",
      synopsis: "卡拉・佐・艾爾從小在地球長大，身為氪星人的她，在尋找自己身分與力量的同時，也必須學會成為象徵希望的英雄。"
    },
    {
      id: "spiderman",
      title: "蜘蛛人：重生日",
      en: "SPIDER-MAN: BRAND NEW DAY",
      poster: "images/SpiderManBrandNewDay_Poster.jpg",
      genre: "動作・科幻",
      minutes: 138,
      release: "2025.06.20 IMAX 同步上映",
      synopsis: "彼得帕克在失去一切後重新出發，面對新的敵人與重新定義自己的英雄道路。"
    },
    {
      id: "sorrybaby",
      title: "寶貝，對不起",
      en: "SORRY, BABY",
      poster: "images/SorryBaby_Poster.jpg",
      genre: "劇情・溫情",
      minutes: 104,
      release: "2025.06.05 溫柔上映",
      synopsis: "一段關於道歉、療癒與重新理解親密關係的故事，在日常裂縫裡看見重新開始的可能。"
    },
    {
      id: "passenger",
      title: "鬼上車",
      en: "PASSENGER",
      poster: "images/PASSENGER＿Poster.jpg",
      genre: "驚悚・懸疑",
      minutes: 112,
      release: "2025.06.18（三）你敢了嗎",
      synopsis: "夜班公車駛入陌生路線，乘客們逐漸發現車上多了一位不該存在的人。"
    },
    {
      id: "minions",
      title: "小小兵＆大怪獸",
      en: "MINIONS & MONSTERS",
      poster: "images/MINIONSMONSTE＿poster.jpg",
      genre: "動畫・冒險",
      minutes: 98,
      release: "2025.06.30 歡樂登場",
      synopsis: "小小兵意外喚醒城市地下的大怪獸，只好用最混亂也最可愛的方式拯救世界。"
    },
    {
      id: "realm",
      title: "感官世界",
      en: "IN THE REALM OF THE SENSES",
      poster: "images/InTheRealmOfTheSenses_Poster.jpg",
      genre: "經典・劇情",
      minutes: 109,
      release: "2025.06.18 武營鉅獻",
      synopsis: "經典重映，以壓抑時代裡的慾望與選擇，描繪人性難以迴避的矛盾。"
    },
    {
      id: "hokum",
      title: "陰魂旅社",
      en: "HOKUM",
      poster: "images/Hokum_Poster.jpg",
      genre: "恐怖・懸疑",
      minutes: 116,
      release: "2025.06.17（二）不宜久留",
      synopsis: "荒郊旅社每到午夜就會出現不存在的住客，所有房門背後都藏著一段未竟的怨念。"
    },
    {
      id: "conan",
      title: "名偵探柯南：萬眾仰望的英雄",
      en: "DETECTIVE CONAN",
      poster: "images/DetectiveConantheMovieFallenAngelof_Poster.jpg",
      genre: "動畫・推理",
      minutes: 110,
      release: "2025.05.24 全台上映",
      synopsis: "柯南與夥伴們追查城市大型活動中的連續預告案，真相指向被遺忘的英雄傳說。"
    }
  ];

  const dates = [
    { id: "20250528", label: "今天", date: "05/28", weekday: "（三）" },
    { id: "20250529", label: "明天", date: "05/29", weekday: "（四）" },
    { id: "20250530", label: "後天", date: "05/30", weekday: "（五）" },
    { id: "20250531", label: "", date: "05/31", weekday: "（六）" },
    { id: "20250601", label: "", date: "06/01", weekday: "（日）" },
    { id: "20250602", label: "", date: "06/02", weekday: "（一）" },
    { id: "20250603", label: "", date: "06/03", weekday: "（二）" }
  ];
  const formats = ["2D", "IMAX 2D", "IMAX", "4DX", "VIP"];
  const sessions = [
    { id: "d1-1030", date: "20250529", day: "明天 05/29（四）", time: "10:30", hall: "國賓影城 8 廳", type: "2D", seats: 36 },
    { id: "d1-1320", date: "20250529", day: "明天 05/29（四）", time: "13:20", hall: "國賓影城 5 廳", type: "2D", seats: 22 },
    { id: "d1-1545", date: "20250529", day: "明天 05/29（四）", time: "15:45", hall: "國賓影城 IMAX 廳", type: "IMAX 2D", seats: 18 },
    { id: "d1-1810", date: "20250529", day: "明天 05/29（四）", time: "18:10", hall: "國賓影城 3 廳", type: "2D", seats: 30 },
    { id: "d1-2040", date: "20250529", day: "明天 05/29（四）", time: "20:40", hall: "國賓影城 8 廳", type: "2D", seats: 16 },
    { id: "d1-2130", date: "20250529", day: "明天 05/29（四）", time: "21:30", hall: "國賓影城 IMAX 廳", type: "IMAX 2D", seats: 9 },
    { id: "d1-2215", date: "20250529", day: "明天 05/29（四）", time: "22:15", hall: "國賓影城 1 廳", type: "2D", seats: 14 },
    { id: "d0-1930", date: "20250528", day: "今天 05/28（三）", time: "19:30", hall: "國賓影城 8 廳", type: "IMAX 2D", seats: 12 },
    { id: "d2-1430", date: "20250530", day: "後天 05/30（五）", time: "14:30", hall: "國賓影城 6 廳", type: "4DX", seats: 10 },
    { id: "d3-2000", date: "20250531", day: "05/31（六）", time: "20:00", hall: "國賓影城 VIP 廳", type: "VIP", seats: 6 },
    { id: "d4-1830", date: "20250601", day: "06/01（日）", time: "18:30", hall: "國賓影城 2 廳", type: "IMAX", seats: 19 },
    { id: "d5-1910", date: "20250602", day: "06/02（一）", time: "19:10", hall: "國賓影城 8 廳", type: "2D", seats: 24 },
    { id: "d6-2030", date: "20250603", day: "06/03（二）", time: "20:30", hall: "國賓影城 5 廳", type: "2D", seats: 21 }
  ];
  const snacks = [
    { id: "popcorn-set", name: "爆米花套餐", image: "images/爆米花套餐.png", icon: "images/爆米花標示.png", basePrice: 120, desc: "中份爆米花 + 中杯飲料" },
    { id: "drink-set", name: "吉拿棒套餐", image: "images/飲料套餐.png", icon: "images/可樂標示.png", basePrice: 80, desc: "中杯飲料 + 吉拿棒" },
    { id: "couple-set", name: "雙人套餐", image: "images/雙人套餐.png", icon: "images/雙人套餐標示.png", basePrice: 220, desc: "大份爆米花 + 2 杯飲料 + 熱狗堡 + 吉拿棒", badge: "最受歡迎" },
    { id: "hotdog-set", name: "熱狗堡套餐", image: "images/熱狗堡套餐.png", icon: "images/熱狗標示.png", basePrice: 110, desc: "熱狗堡 + 中杯飲料" }
  ];

  let step = "list";
  let selectedMovie = movies[0];
  let selectedDate = "20250529";
  let selectedFormat = "2D";
  let selectedSession = sessions[0];
  let people = 1;
  let employeeId = "";
  let selectedSeats = new Set();
  let snackDraft = {};
  let snackOrders = {};
  let snackDrawerOpen = false;
  let paymentMethod = "信用卡付款";
  let invoiceType = "捐贈發票";

  function updateClock() {
    const now = new Date();
    $("#staffMovieTime").textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    $("#staffMovieDate").textContent = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}（${weekdays[now.getDay()]}）`;
  }

  function showMoviesPage() {
    $$(".employee-view").forEach((view) => {
      const active = view.id === "moviesView";
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });
    $(".employee-main")?.classList.add("is-detail");
    $(".employee-main")?.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => window.fitKioskCanvas?.());
  }

  function returnHub() {
    $$(".employee-view").forEach((view) => {
      const active = view.id === "hubView";
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });
    $(".employee-main")?.classList.remove("is-detail");
    $(".employee-main")?.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => window.fitKioskCanvas?.());
  }

  function setStep(next) {
    step = next;
    page.scrollTo({ top: 0, behavior: "smooth" });
    $(".employee-main")?.scrollTo({ top: 0, behavior: "smooth" });
    $$("[data-staff-movie-step]", page).forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.staffMovieStep === next);
    });

    const order = ["list", "verify", "schedule", "seats", "snacks", "payment", "done"];
    const index = order.indexOf(next);
    $$("#staffMovieProgress [data-staff-step]").forEach((item) => {
      const itemIndex = order.indexOf(item.dataset.staffStep);
      item.classList.toggle("active", itemIndex === index);
      item.classList.toggle("done", itemIndex >= 0 && itemIndex < index);
    });

    const titles = {
      list: ["正在上映電影", "享受員工專屬優惠票價 $180"],
      detail: ["電影介紹", "確認電影資訊與員工票價"],
      verify: ["輸入工號與選擇張數", "驗證員工資格，每日限購 2 張"],
      schedule: ["選擇日期、場次", "挑選觀影日期與放映廳"],
      seats: ["選擇座位", "金色是目前選擇，紅色是已售座位"],
      snacks: ["加購餐點", "可按下一步略過餐點加購"],
      payment: ["員工電影優惠", "STAFF MOVIE BENEFIT"],
      done: ["取票完成", "請憑 QR Code 至影城取票"]
    };
    $("#staffMoviePageTitle").textContent = titles[next]?.[0] || "員工電影優惠";
    $("#staffMoviePageSubtitle").textContent = titles[next]?.[1] || "STAFF MOVIE BENEFIT";
    $("#staffMovieBack").textContent = next === "list" ? "‹ 返回員工專區" : "‹ 返回上一步";
    requestAnimationFrame(() => window.fitKioskCanvas?.());
  }

  function goBack() {
    if (step === "list") returnHub();
    else if (step === "detail") setStep("list");
    else if (step === "verify") setStep("detail");
    else if (step === "schedule") setStep("verify");
    else if (step === "seats") {
      renderSchedule();
      setStep("schedule");
    } else if (step === "snacks") {
      renderSeats();
      setStep("seats");
    } else if (step === "payment") {
      renderSnacks();
      setStep("snacks");
    } else returnHub();
  }

  function renderList() {
    const order = ["toy5", "supergirl", "spiderman", "sorrybaby", "passenger", "minions", "realm", "hokum", "conan"];
    $("#staffMoviePosterGrid").innerHTML = order
      .map((id) => movies.find((movie) => movie.id === id))
      .filter(Boolean)
      .map((movie) => `
        <button class="staff-movie-poster-card" type="button" data-staff-movie-open="${movie.id}">
          <span><img src="${movie.poster}" alt="${movie.title}"></span>
          <strong>${movie.title}</strong>
        </button>
      `).join("");

    $$("[data-staff-movie-open]", page).forEach((button) => {
      button.addEventListener("click", () => openDetail(button.dataset.staffMovieOpen));
    });
  }

  function resetOrder() {
    selectedDate = "20250529";
    selectedFormat = "2D";
    selectedSession = sessions[0];
    people = 1;
    employeeId = "";
    selectedSeats = new Set();
    snackDraft = {};
    snackOrders = {};
    snackDrawerOpen = false;
    paymentMethod = "信用卡付款";
    invoiceType = "捐贈發票";
    $("#staffMovieEmployeeId").value = "";
    $("#staffMovieVerifyError").textContent = "";
  }

  function openDetail(id) {
    selectedMovie = movies.find((movie) => movie.id === id) || movies[0];
    resetOrder();
    $("#staffMovieDetailPoster").src = selectedMovie.poster;
    $("#staffMovieDetailPoster").alt = selectedMovie.title;
    $("#staffMovieDetailEn").textContent = selectedMovie.en;
    $("#staffMovieDetailTitle").textContent = selectedMovie.title;
    $("#staffMovieDetailDate").textContent = selectedMovie.release;
    $("#staffMovieDetailSynopsis").textContent = selectedMovie.synopsis;
    $("#staffMovieDetailTags").innerHTML = [
      `${selectedMovie.minutes} 分鐘`,
      "保護級",
      selectedMovie.genre,
      "IMAX 2D / 3D"
    ].map((tag) => `<span>${tag}</span>`).join("");
    showMoviesPage();
    setStep("detail");
  }

  function renderVerify() {
    $("#staffPeopleCount").textContent = people;
    $("#staffMovieEmployeeId").value = employeeId;
  }

  function hasSessionForDate(dateId) {
    return sessions.some((session) => session.date === dateId && session.seats > 0);
  }

  function renderSchedule() {
    if (!hasSessionForDate(selectedDate)) {
      selectedDate = dates.find((date) => hasSessionForDate(date.id))?.id || selectedDate;
    }
    const dateSessions = sessions.filter((session) => session.date === selectedDate && session.seats > 0);
    if (!dateSessions.some((session) => session.id === selectedSession.id)) {
      selectedSession = dateSessions[0] || selectedSession;
      selectedFormat = selectedSession.type;
    }

    $("#staffDateGrid").innerHTML = dates.map((date) => {
      const unavailable = !hasSessionForDate(date.id);
      return `
        <button class="${date.id === selectedDate ? "selected" : ""} ${unavailable ? "unavailable" : ""}" type="button" data-date="${date.id}" ${unavailable ? "disabled" : ""}>
          <span>${date.label || "&nbsp;"}</span>
          <strong>${date.date}</strong>
          <small>${date.weekday}</small>
        </button>
      `;
    }).join("");
    $$("#staffDateGrid [data-date]:not(.unavailable)").forEach((button) => {
      button.addEventListener("click", () => {
        selectedDate = button.dataset.date;
        const first = sessions.find((session) => session.date === selectedDate && session.seats > 0);
        if (first) {
          selectedSession = first;
          selectedFormat = first.type;
        }
        renderSchedule();
      });
    });

    $("#staffFormatTabs").innerHTML = formats.map((format) => {
      const unavailable = !sessions.some((session) => session.date === selectedDate && session.type === format && session.seats > 0);
      return `<button class="${format === selectedFormat ? "selected" : ""} ${unavailable ? "unavailable" : ""}" type="button" data-format="${format}" ${unavailable ? "disabled" : ""}>${format}</button>`;
    }).join("");
    $$("#staffFormatTabs [data-format]:not(.unavailable)").forEach((button) => {
      button.addEventListener("click", () => {
        selectedFormat = button.dataset.format;
        selectedSession = sessions.find((session) => session.date === selectedDate && session.type === selectedFormat && session.seats > 0) || selectedSession;
        renderSchedule();
      });
    });

    $("#staffSessionGrid").innerHTML = dateSessions.map((session) => `
      <button class="${session.id === selectedSession.id ? "selected" : ""} ${session.type !== selectedFormat ? "format-dim" : ""}" type="button" data-session="${session.id}">
        ${session.id === selectedSession.id ? "<em>✓</em>" : ""}
        <strong>${session.time}</strong>
        <span>${session.type}</span>
        <small>${session.hall}</small>
        <b>剩餘 ${session.seats} 位</b>
      </button>
    `).join("");
    $$("#staffSessionGrid [data-session]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedSession = sessions.find((session) => session.id === button.dataset.session) || selectedSession;
        selectedFormat = selectedSession.type;
        renderSchedule();
      });
    });

    $("#staffSchedulePreview").innerHTML = `
      <div class="staff-preview-movie">
        <img src="${selectedMovie.poster}" alt="${selectedMovie.title}">
        <div>
          <strong>${selectedMovie.title}</strong>
          <span>${selectedSession.day}</span>
          <span>${selectedSession.time}</span>
          <span>${selectedSession.hall}</span>
          <b>${selectedSession.type}</b>
        </div>
      </div>
      <div><span>訂票人數</span><strong>${people} 張</strong></div>
      <div><span>座位</span><strong>尚未選擇</strong></div>
      <div><span>員工優惠票價</span><strong>${money(180)} / 張</strong></div>
      <div class="summary-total"><span>總計</span><strong>${money(people * 180)}</strong></div>
    `;
  }

  function sortedSeats() {
    return Array.from(selectedSeats).sort((a, b) => {
      if (a[0] !== b[0]) return a.localeCompare(b, "en", { sensitivity: "base" });
      return Number(a.slice(1)) - Number(b.slice(1));
    });
  }

  function getSoldSeats() {
    const base = ["B4", "B6", "C12", "D9", "D13", "D15", "E11", "E13", "F10", "F12", "F13", "F14", "G4", "G6", "H14", "K15"];
    const seed = movies.findIndex((movie) => movie.id === selectedMovie.id);
    return new Set(base.map((seat, index) => {
      const row = seat[0];
      const number = ((Number(seat.slice(1)) + seed + index) % 16) + 1;
      return `${row}${number}`;
    }));
  }

  function renderSeats() {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
    const sold = getSoldSeats();
    $("#staffSeatLimit").textContent = people;
    $("#staffSeatCount").textContent = selectedSeats.size;
    $("#staffSeatGrid").innerHTML = rows.map((row) => `
      <div class="staff-seat-row">
        <span>${row}</span>
        ${Array.from({ length: 16 }, (_, index) => {
          const number = index + 1;
          const label = `${row}${number}`;
          const accessible = row === "K" && (number <= 2 || number >= 15);
          const status = sold.has(label) ? "sold" : selectedSeats.has(label) ? "selected" : "available";
          return `<button class="${status} ${accessible ? "accessible" : ""}" type="button" data-seat="${label}" ${status === "sold" ? "disabled" : ""}>${accessible ? "♿" : number}</button>`;
        }).join("")}
        <span>${row}</span>
      </div>
    `).join("");
    $$("#staffSeatGrid [data-seat]:not(:disabled)").forEach((button) => {
      button.addEventListener("click", () => {
        const seat = button.dataset.seat;
        if (selectedSeats.has(seat)) selectedSeats.delete(seat);
        else if (selectedSeats.size < people) selectedSeats.add(seat);
        renderSeats();
      });
    });
    $("#staffSeatPreview").innerHTML = `
      <h2>已選擇座位</h2>
      <div class="staff-summary-list">
        <div><span>電影</span><strong>${selectedMovie.title}</strong></div>
        <div><span>場次</span><strong>${selectedSession.day} ${selectedSession.time}</strong></div>
        <div><span>張數</span><strong>${people} 張</strong></div>
        <div><span>座位</span><strong>${selectedSeats.size ? sortedSeats().join("、") : "尚未選擇"}</strong></div>
        <div><span>票價</span><strong>${money(180)} / 張</strong></div>
        <div class="summary-total"><span>總計</span><strong>${money(people * 180)}</strong></div>
      </div>
      <button class="staff-primary-action" type="button" data-seat-next>下一步：加購餐點 <span>→</span></button>
    `;
    $("[data-seat-next]", page)?.addEventListener("click", confirmSeats);
  }

  function renderSnacks() {
    $("#staffSnackGrid").innerHTML = snacks.map((snack) => {
      const qty = snackDraft[snack.id]?.qty || 0;
      return `
        <article class="staff-snack-card" data-snack="${snack.id}">
          ${snack.badge ? `<b>${snack.badge}</b>` : ""}
          <img src="${snack.image}" alt="${snack.name}">
          <div>
            <h3><span style="--snack-icon: url('${snack.icon}')"></span>${snack.name}</h3>
            <p>${snack.desc}</p>
            <strong>${money(snack.basePrice)}</strong>
            <div class="staff-snack-actions">
              <div>
                <button type="button" data-snack-qty="-1">−</button>
                <span>${qty}</span>
                <button type="button" data-snack-qty="1">＋</button>
              </div>
              <button type="button" data-snack-add>加入購物車</button>
            </div>
          </div>
        </article>
      `;
    }).join("");
    $$(".staff-snack-card", page).forEach((card) => {
      const snack = snacks.find((item) => item.id === card.dataset.snack);
      $$("[data-snack-qty]", card).forEach((button) => {
        button.addEventListener("click", () => {
          const next = Math.max(0, (snackDraft[snack.id]?.qty || 0) + Number(button.dataset.snackQty));
          if (next) snackDraft[snack.id] = { ...snack, qty: next };
          else delete snackDraft[snack.id];
          renderSnacks();
        });
      });
      $("[data-snack-add]", card).addEventListener("click", () => {
        const qty = snackDraft[snack.id]?.qty || 0;
        if (!qty) {
          card.animate?.([{ transform: "scale(1)" }, { transform: "scale(1.025)" }, { transform: "scale(1)" }], { duration: 260 });
          return;
        }
        snackOrders[snack.id] = { ...snack, qty: (snackOrders[snack.id]?.qty || 0) + qty };
        delete snackDraft[snack.id];
        snackDrawerOpen = false;
        renderSnacks();
      });
    });
    renderSnackSummary();
  }

  function renderSnackSummary() {
    const orders = Object.values(snackOrders).filter((item) => item.qty > 0);
    const target = $("#staffSnackSummary");
    if (!orders.length) {
      target.textContent = "尚未選擇餐食";
      renderSnackDrawer([]);
      return;
    }
    const total = orders.reduce((sum, item) => sum + item.basePrice * item.qty, 0);
    const totalQty = orders.reduce((sum, item) => sum + item.qty, 0);
    const main = orders[0];
    target.innerHTML = `
      <button class="staff-snack-summary-card" type="button" data-open-snack-drawer>
        <span><img src="${main.image}" alt="${main.name}"><em>${totalQty}</em></span>
        <span><strong>${orders.map((item) => `${item.name} × ${item.qty}`).join("、")}</strong><small>${orders.length === 1 ? main.desc : `共 ${totalQty} 份餐點`}</small></span>
        <b>${money(total)}</b>
      </button>
    `;
    $("[data-open-snack-drawer]", target).addEventListener("click", () => {
      snackDrawerOpen = true;
      renderSnackDrawer(orders);
    });
    renderSnackDrawer(orders);
  }

  function renderSnackDrawer(orders) {
    const drawer = $("#staffSnackDrawer");
    if (!snackDrawerOpen || !orders.length) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      drawer.innerHTML = "";
      return;
    }
    const total = orders.reduce((sum, item) => sum + item.basePrice * item.qty, 0);
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.innerHTML = `
      <div data-close-snack-drawer></div>
      <section>
        <header><h2>購物車</h2><button type="button" data-close-snack-drawer>×</button></header>
        ${orders.map((item) => `
          <div class="staff-drawer-row">
            <img src="${item.image}" alt="${item.name}">
            <div><strong>${item.name}</strong><small>${item.desc}</small></div>
            <span>x${item.qty}</span>
            <button type="button" data-drawer-snack="${item.id}" data-drawer-qty="-1">−</button>
            <button type="button" data-drawer-snack="${item.id}" data-drawer-qty="1">＋</button>
            <b>${money(item.basePrice)}</b>
          </div>
        `).join("")}
        <footer><span>總金額：</span><strong>${money(total)}</strong></footer>
      </section>
    `;
    $$("[data-close-snack-drawer]", drawer).forEach((button) => {
      button.addEventListener("click", () => {
        snackDrawerOpen = false;
        renderSnackDrawer([]);
      });
    });
    $$("[data-drawer-snack]", drawer).forEach((button) => {
      button.addEventListener("click", () => {
        const snack = snacks.find((item) => item.id === button.dataset.drawerSnack);
        const next = Math.max(0, (snackOrders[snack.id]?.qty || 0) + Number(button.dataset.drawerQty));
        if (next) snackOrders[snack.id] = { ...snack, qty: next };
        else delete snackOrders[snack.id];
        snackDrawerOpen = Object.keys(snackOrders).length > 0;
        renderSnacks();
      });
    });
  }

  function total() {
    return people * 180 + Object.values(snackOrders).reduce((sum, item) => sum + item.basePrice * item.qty, 0);
  }

  function renderPayment() {
    const orderedSnacks = Object.values(snackOrders).filter((item) => item.qty > 0);
    const ticketTotal = people * 180;
    const snackTotal = orderedSnacks.reduce((sum, item) => sum + item.basePrice * item.qty, 0);
    $("#staffPaymentSummary").innerHTML = `
      <article class="staff-checkout-movie">
        <img src="${selectedMovie.poster}" alt="${selectedMovie.title}">
        <div><h3>${selectedMovie.title}</h3><em>${selectedSession.type}</em><span>${selectedSession.day} ${selectedSession.time}</span><span>${selectedSession.hall}</span></div>
      </article>
      <div><span>座位</span><strong>${sortedSeats().join("、")}</strong></div>
      <div><span>取票人數</span><strong>${people} 張</strong></div>
      <div><span>餐點</span><strong>${orderedSnacks.length ? orderedSnacks.map((item) => `${item.name} × ${item.qty}`).join("、") : "未加購餐點"}</strong></div>
      <div><span>票價</span><small>$180 × ${people}</small><strong>${money(ticketTotal)}</strong></div>
      <div><span>餐點</span><small>${orderedSnacks.length ? `${orderedSnacks.length} 種餐點` : "未加購"}</small><strong>${money(snackTotal)}</strong></div>
      <div><span>手續費</span><small>${paymentMethod}</small><strong>$0</strong></div>
      <div class="summary-total"><span>總計</span><small>${invoiceType}</small><strong>${money(ticketTotal + snackTotal)}</strong></div>
    `;
  }

  function confirmSeats() {
    if (selectedSeats.size !== people) {
      $("#staffSeatCount").animate?.([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 280 });
      return;
    }
    renderSnacks();
    setStep("snacks");
  }

  function finishPayment() {
    $("#staffDoneSummary").innerHTML = `${selectedMovie.title}｜${selectedSession.day} ${selectedSession.time}<br>${sortedSeats().join("、")}｜${paymentMethod}｜${invoiceType}｜${money(total())}`;
    $("#staffQrText").textContent = `員工 ${employeeId}，請於開演前 20 分鐘完成取票。`;
    setStep("done");
  }

  function bindKeypad() {
    $("#staffMovieKeypad").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "清除", "0", "確認"].map((key) => `<button class="${key === "確認" ? "confirm" : ""}" type="button" data-key="${key}">${key}</button>`).join("");
    $$("#staffMovieKeypad [data-key]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = $("#staffMovieEmployeeId");
        const key = button.dataset.key;
        if (key === "清除") {
          input.value = "";
          employeeId = "";
          $("#staffMovieVerifyError").textContent = "";
          return;
        }
        if (key === "確認") {
          if (!/^\d{3,6}$/.test(input.value.trim())) {
            $("#staffMovieVerifyError").textContent = "請輸入 3 至 6 碼工號。";
            return;
          }
          const employee = window.WohoursEmployeeLookup?.find?.(input.value.trim());
          if (!employee) {
            $("#staffMovieVerifyError").textContent = window.WohoursEmployeeLookup?.message?.() || "查無此員工工號。";
            return;
          }
          employeeId = employee.id;
          input.value = employee.id;
          $("#staffMovieVerifyError").textContent = `${employee.name}｜${employee.dept}，請選擇人數後按下一步。`;
          return;
        }
        if (input.value.length < 6) input.value += key;
        employeeId = input.value.trim();
      });
    });
  }

  function bindEvents() {
    $("#staffMovieBack").addEventListener("click", goBack);
    $("#staffMovieListBack")?.addEventListener("click", returnHub);
    $("#staffMovieHubBack")?.addEventListener("click", returnHub);
    $$("[data-staff-back]", page).forEach((button) => button.addEventListener("click", goBack));
    $("#staffStartBooking").addEventListener("click", () => {
      renderVerify();
      setStep("verify");
    });
    $("#staffMovieIdClear").addEventListener("click", () => {
      $("#staffMovieEmployeeId").value = "";
      employeeId = "";
      $("#staffMovieVerifyError").textContent = "";
    });
    $("#staffPeopleMinus").addEventListener("click", () => {
      people = Math.max(1, people - 1);
      selectedSeats = new Set(Array.from(selectedSeats).slice(0, people));
      renderVerify();
    });
    $("#staffPeoplePlus").addEventListener("click", () => {
      people = Math.min(2, people + 1);
      renderVerify();
    });
    $("#staffConfirmPeople").addEventListener("click", () => {
      const value = $("#staffMovieEmployeeId").value.trim();
      if (!/^\d{3,6}$/.test(value)) {
        $("#staffMovieVerifyError").textContent = "請輸入 3 至 6 碼工號。";
        return;
      }
      const employee = window.WohoursEmployeeLookup?.find?.(value);
      if (!employee) {
        $("#staffMovieVerifyError").textContent = window.WohoursEmployeeLookup?.message?.() || "查無此員工工號。";
        return;
      }
      employeeId = employee.id;
      $("#staffMovieEmployeeId").value = employee.id;
      selectedSeats = new Set();
      renderSchedule();
      setStep("schedule");
    });
    $("#staffConfirmSchedule").addEventListener("click", () => {
      selectedSeats = new Set();
      renderSeats();
      setStep("seats");
    });
    $("#staffConfirmSeats")?.addEventListener("click", confirmSeats);
    $("#staffSkipSnacks").addEventListener("click", () => {
      snackDraft = {};
      snackOrders = {};
      renderPayment();
      setStep("payment");
    });
    $("#staffConfirmSnacks").addEventListener("click", () => {
      snackDraft = {};
      renderPayment();
      setStep("payment");
    });
    $$("#staffPaymentOptions [data-staff-pay]").forEach((button) => {
      button.addEventListener("click", () => {
        $$("#staffPaymentOptions [data-staff-pay]").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
        paymentMethod = button.dataset.staffPay;
        renderPayment();
      });
    });
    $$("#staffInvoiceOptions [data-staff-invoice]").forEach((button) => {
      button.addEventListener("click", () => {
        $$("#staffInvoiceOptions [data-staff-invoice]").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
        invoiceType = button.dataset.staffInvoice;
        renderPayment();
      });
    });
    $("#staffMoviePay").addEventListener("click", finishPayment);
    $("#staffFinishMovie").addEventListener("click", returnHub);
    $$('[data-view="moviesView"]').forEach((button) => {
      button.addEventListener("click", () => {
        resetOrder();
        setStep("list");
      });
    });
    $$("[data-staff-movie]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openDetail(button.dataset.staffMovie);
      });
    });
  }

  renderList();
  bindKeypad();
  bindEvents();
  updateClock();
  const pendingMovie = localStorage.getItem("wohours.pendingStaffMovie");
  if (pendingMovie && movies.some((movie) => movie.id === pendingMovie)) {
    localStorage.removeItem("wohours.pendingStaffMovie");
    openDetail(pendingMovie);
  }
  setInterval(updateClock, 1000);
})();
/* ===============================
   側邊欄最上方：返回員工專區
   =============================== */
(() => {
  const nav = document.querySelector(".employee-sidebar nav");
  if (!nav) return;

  /* 清掉之前加錯位置的返回按鈕 */
  document.querySelectorAll(".employee-global-back").forEach((button) => {
    button.remove();
  });

  const back = document.createElement("button");
  back.type = "button";
  back.className = "employee-global-back";
  back.innerHTML = `<span class="back-arrow">‹</span><span>返回員工專區</span>`;

  /* 插在側邊欄第一個，也就是首頁上方 */
  nav.insertBefore(back, nav.firstElementChild);

  back.addEventListener("click", () => {
    document.querySelectorAll(".employee-view").forEach((view) => {
      view.classList.remove("active");
      view.setAttribute("aria-hidden", "true");
    });

    const hubView = document.getElementById("hubView");
    if (hubView) {
      hubView.classList.add("active");
      hubView.setAttribute("aria-hidden", "false");
    }

    const main = document.querySelector(".employee-main");
    if (main) {
      main.classList.remove("is-detail");
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
})();

/* ===============================
   生日禮卡完整流程
   查詢資格 → 拍照驗證 → 查詢成功 → 領取 → 完成 → 合作商家
   =============================== */
(() => {
  const panels = [
    "birthdayQueryPanel",
    "birthdaySuccessPanel",
    "birthdayClaimPanel",
    "birthdayDonePanel",
    "birthdayPartnerListPanel",
    "birthdayPartnerDetailPanel"
  ].map(id => document.getElementById(id)).filter(Boolean);

  const input = document.getElementById("birthdayEmployeeNo");
  const queryButton = document.getElementById("birthdayQueryButton");
  const error = document.getElementById("birthdayError");

  const successName = document.getElementById("birthdaySuccessName");
  const confirmId = document.getElementById("birthdayConfirmId");
  const startClaim = document.getElementById("birthdayStartClaim");
  const confirmClaim = document.getElementById("birthdayConfirmClaim");
  const openPartners = document.getElementById("birthdayOpenPartners");
  const openPartnersDone = document.getElementById("birthdayOpenPartnersDone");

  const modal = document.getElementById("birthdayVerifyModal");
  const closeButton = document.getElementById("birthdayModalClose");
  const video = document.getElementById("birthdayVerifyVideo");
  const snapshot = document.getElementById("birthdaySnapshot");
  const status = document.getElementById("birthdayCameraStatus");
  const captureButton = document.getElementById("birthdayCaptureButton");
  const retakeButton = document.getElementById("birthdayRetakeButton");
  const modalActions = document.querySelector(".birthday-modal-actions");

  const partnerName = document.getElementById("birthdayPartnerName");
  const partnerType = document.getElementById("birthdayPartnerType");
  const partnerLogo = document.getElementById("birthdayPartnerLogo");
  const partnerUse = document.getElementById("birthdayPartnerUse");
  const partnerRangeTitle = document.getElementById("birthdayPartnerRangeTitle");
  const partnerRange = document.getElementById("birthdayPartnerRange");
  const partnerAction = document.getElementById("birthdayPartnerAction");

  if (!input || !queryButton || !modal) return;

  let stream = null;
  let currentEmployeeNo = "";
  let currentBirthdayEmployee = null;
  let capturedPhoto = "";

  const partners = {
    starbucks: {
      name: "Starbucks",
      type: "餐飲",
      logo: "★",
      logoClass: "green",
      use: "結帳時出示員工號並選擇生日禮金 QR Code 即可折抵。",
      rangeTitle: "適用門市",
      range: "全台 Starbucks 門市，不包含部分機場門市。",
      action: "查看附近門市"
    },
    momo: {
      name: "MOMO 購物網",
      type: "線上平台",
      logo: "momo",
      logoClass: "pink",
      use: "結帳時選擇「員工生日禮金」即可折抵訂單金額。",
      rangeTitle: "適用範圍",
      range: "全站商品，部分特殊商品除外。",
      action: "前往購物"
    },
    eslite: {
      name: "誠品線上",
      type: "線上購物平台",
      logo: "誠",
      logoClass: "",
      use: "結帳時輸入員工帳號並選擇生日禮金折抵。",
      rangeTitle: "適用範圍",
      range: "誠品線上大部分商品，部分特價商品除外。",
      action: "前往官網"
    },
    carrefour: {
      name: "家樂福線上購物",
      type: "生活用品",
      logo: "C",
      logoClass: "blue",
      use: "結帳時選擇員工生日禮金，即可折抵符合資格的商品。",
      rangeTitle: "適用範圍",
      range: "生活用品與指定商品，部分商品不可折抵。",
      action: "前往購物"
    }
  };

  function showPanel(id) {
    panels.forEach(panel => {
      const active = panel.id === id;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });

    document.querySelector(".employee-main")?.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function normalizeEmployeeNo(value) {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8);
  }

  function isValidEmployeeNo(value) {
    return /^(E\d{7}|\d{4,8})$/.test(value);
  }

  function showError(message) {
    error.textContent = message;

    input.closest(".birthday-input-wrap")?.animate?.(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(0)" }
      ],
      {
        duration: 260,
        easing: "ease-out"
      }
    );
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }

    if (video) {
      video.srcObject = null;
    }
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = "此瀏覽器不支援相機，請改用 Chrome 或 Safari 測試。";
      captureButton.textContent = "略過拍照並確認";
      return;
    }

    try {
      stopCamera();

      status.textContent = "正在開啟相機，請允許瀏覽器使用攝影機。";

      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      video.srcObject = stream;
      await video.play().catch(() => {});

      status.textContent = `工號 ${currentEmployeeNo}，請將臉部置於框線中央。`;
    } catch (err) {
      console.warn("生日禮卡相機開啟失敗", err);
      status.textContent = "無法開啟相機，可先按下方按鈕完成畫面流程。";
      captureButton.textContent = "略過拍照並確認";
    }
  }

  function openVerifyModal() {
    capturedPhoto = "";

    snapshot.hidden = true;
    snapshot.src = "";
    video.hidden = false;

    retakeButton.hidden = true;
    modalActions.classList.remove("has-snapshot");

      captureButton.textContent = "拍照";
    captureButton.disabled = false;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    startCamera();
  }

  function closeVerifyModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    stopCamera();
  }

  function capturePhoto() {
    if (!video || !video.videoWidth) {
      closeVerifyModal();
      showPanel("birthdaySuccessPanel");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    capturedPhoto = canvas.toDataURL("image/jpeg", 0.86);

    snapshot.src = capturedPhoto;
    snapshot.hidden = false;
    video.hidden = true;

    stopCamera();

    retakeButton.hidden = false;
    modalActions.classList.add("has-snapshot");

    captureButton.textContent = "確認使用照片";
    status.textContent = "照片已擷取，請確認是否使用此照片完成驗證。";
  }

  function finishVerification() {
    closeVerifyModal();

    if (confirmId) {
      confirmId.textContent = currentEmployeeNo;
    }
    if (successName && currentBirthdayEmployee) {
      successName.textContent = currentBirthdayEmployee.name;
    }

    showPanel("birthdaySuccessPanel");
  }

  queryButton.addEventListener("click", () => {
    const employeeNo = normalizeEmployeeNo(input.value);
    input.value = employeeNo;

    if (!isValidEmployeeNo(employeeNo)) {
      showError("請輸入正確工號，例如 E2025001 或 4 到 8 位數字工號");
      input.focus();
      return;
    }

    const employee = window.MockEmployees?.find(employeeNo);
    if (!employee) {
      showError("查無此員工工號，請輸入 1111 - 1120 測試");
      input.focus();
      return;
    }

    currentEmployeeNo = employeeNo;
    currentBirthdayEmployee = employee;
    error.textContent = "";

    openVerifyModal();
  });

  input.addEventListener("input", () => {
    input.value = normalizeEmployeeNo(input.value);
    error.textContent = "";
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      queryButton.click();
    }
  });

  captureButton.addEventListener("click", () => {
    if (!capturedPhoto && video && video.videoWidth) {
      capturePhoto();
      return;
    }

    finishVerification();
  });

  retakeButton.addEventListener("click", () => {
    capturedPhoto = "";

    snapshot.hidden = true;
    snapshot.src = "";
    video.hidden = false;

    retakeButton.hidden = true;
    modalActions.classList.remove("has-snapshot");

      captureButton.textContent = "拍照";
    startCamera();
  });

  closeButton.addEventListener("click", closeVerifyModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeVerifyModal();
    }
  });

  startClaim?.addEventListener("click", () => {
    showPanel("birthdayClaimPanel");
  });

    let birthdayAutoBackTimer = null;
    let birthdayAutoBackCountTimer = null;

    function backToEmployeeHubAfterClaim() {
      window.clearTimeout(birthdayAutoBackTimer);
      window.clearInterval(birthdayAutoBackCountTimer);

      let count = 10;
      const countNode = document.getElementById("birthdayAutoBackCount");

      if (countNode) {
        countNode.textContent = count;
      }

      birthdayAutoBackCountTimer = window.setInterval(() => {
        count -= 1;

        if (countNode) {
          countNode.textContent = count;
        }

        if (count <= 0) {
          window.clearInterval(birthdayAutoBackCountTimer);
        }
      }, 1000);

      birthdayAutoBackTimer = window.setTimeout(() => {
        window.clearInterval(birthdayAutoBackCountTimer);

        document.querySelectorAll(".employee-view").forEach((view) => {
          view.classList.remove("active");
          view.setAttribute("aria-hidden", "true");
        });

        const hubView = document.getElementById("hubView");
        if (hubView) {
          hubView.classList.add("active");
          hubView.setAttribute("aria-hidden", "false");
        }

        const main = document.querySelector(".employee-main");
        if (main) {
          main.classList.remove("is-detail");
          main.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 10000);
    }

    confirmClaim?.addEventListener("click", () => {
      if (currentEmployeeNo) {
        currentBirthdayEmployee = window.MockEmployees?.claimBirthday(currentEmployeeNo) || currentBirthdayEmployee;
      }
      showPanel("birthdayDonePanel");
      backToEmployeeHubAfterClaim();
    });

  openPartners?.addEventListener("click", () => {
    showPanel("birthdayPartnerListPanel");
  });

  openPartnersDone?.addEventListener("click", () => {
    showPanel("birthdayPartnerListPanel");
  });

  document.querySelectorAll("[data-birthday-back]").forEach(button => {
    button.addEventListener("click", () => {
      showPanel(button.dataset.birthdayBack);
    });
  });

  document.querySelectorAll("[data-birthday-partner]").forEach(button => {
    button.addEventListener("click", () => {
      const data = partners[button.dataset.birthdayPartner];
      if (!data) return;

      partnerName.textContent = data.name;
      partnerType.textContent = data.type;
      partnerLogo.textContent = data.logo;
      partnerLogo.className = `partner-logo-box ${data.logoClass || ""}`;
      partnerUse.textContent = data.use;
      partnerRangeTitle.textContent = data.rangeTitle;
      partnerRange.textContent = data.range;
      partnerAction.textContent = data.action;

      showPanel("birthdayPartnerDetailPanel");
    });
  });

  window.addEventListener("beforeunload", stopCamera);

  const pendingBirthdayEmployee = localStorage.getItem("wohours.pendingBirthdayEmployee");
  if (pendingBirthdayEmployee) {
    localStorage.removeItem("wohours.pendingBirthdayEmployee");
    input.value = pendingBirthdayEmployee;
    error.textContent = "";
  }
})();
/* ===============================
   側邊欄最上方：返回員工專區
   並移除主內容所有重複返回按鈕
   =============================== */
(() => {
  const nav = document.querySelector(".employee-sidebar nav, .side-nav nav");
  if (!nav) return;

  function removeMainBackButtons() {
    document.querySelectorAll("button, a").forEach((el) => {
      const text = (el.textContent || "").trim();

      const isBackButton =
        text.includes("返回員工福利") ||
        text.includes("返回員工專區");

      const isInsideSidebar =
        el.closest(".employee-sidebar nav") ||
        el.closest(".side-nav nav");
      const isStaffMovieHubBack = el.id === "staffMovieHubBack";

      if (isBackButton && !isInsideSidebar && !isStaffMovieHubBack) {
        el.remove();
      }
    });
  }

  document.querySelectorAll(".employee-global-back").forEach((button) => {
    button.remove();
  });

  const back = document.createElement("button");
  back.type = "button";
  back.className = "employee-global-back";
  back.innerHTML = `
    <span class="nav-icon-text">‹</span>
    <span>返回員工專區</span>
  `;

  nav.insertBefore(back, nav.firstElementChild);

  back.addEventListener("click", () => {
    document.querySelectorAll(".employee-view").forEach((view) => {
      view.classList.remove("active");
      view.setAttribute("aria-hidden", "true");
    });

    const hubView = document.getElementById("hubView");
    if (hubView) {
      hubView.classList.add("active");
      hubView.setAttribute("aria-hidden", "false");
    }

    const main = document.querySelector(".employee-main");
    if (main) {
      main.classList.remove("is-detail");
      main.scrollTo({ top: 0, behavior: "smooth" });
    }

    removeMainBackButtons();
  });

  removeMainBackButtons();

  const observer = new MutationObserver(() => {
    removeMainBackButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
if (false) {
/* =========================================================
   合作商家詳細頁：右側大圖改成素材圖
   ========================================================= */
(() => {
  const partnerHeroImages = {
    "鬍鬚張": "images/鬍鬚張拷貝.png",
    "麥當勞": "images/麥當勞拷貝.png",
    "GU": "images/衣服拷貝.png",
    "UNIQLO": "images/衣服拷貝.png",
    "Nike": "images/衣服拷貝.png",
    "NET": "images/衣服拷貝.png"
  };

  function updatePartnerHeroImage() {
    const view = document.querySelector("#partnerCouponView");
    if (!view) return;

    const titleEl =
      view.querySelector("h1") ||
      view.querySelector("h2") ||
      view.querySelector(".partner-benefit-title") ||
      view.querySelector(".coupon-title") ||
      view.querySelector("strong");

    if (!titleEl) return;

    const title = titleEl.textContent.trim();
    const imgPath = partnerHeroImages[title];

    if (!imgPath) return;

    const images = view.querySelectorAll("img");
    if (!images.length) return;

    /* 找右側最大張圖片 */
    let heroImg = images[images.length - 1];

    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const heroRect = heroImg.getBoundingClientRect();

      if (rect.width * rect.height > heroRect.width * heroRect.height) {
        heroImg = img;
      }
    });

    if (heroImg.getAttribute("src") !== imgPath) {
      heroImg.src = imgPath;
    }
    if (heroImg.alt !== title) {
      heroImg.alt = title;
    }
    if (!heroImg.classList.contains("partner-hero-material")) {
      heroImg.classList.add("partner-hero-material");
    }
  }

  document.addEventListener("click", () => {
    setTimeout(updatePartnerHeroImage, 80);
    setTimeout(updatePartnerHeroImage, 250);
  });

  const observer = new MutationObserver(() => {
    updatePartnerHeroImage();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  updatePartnerHeroImage();
})();
/* =========================================================
   合作商家修正版
   正確流程：
   1. 分類按鈕可以切換
   2. 點店家進店家詳情頁 partnerCouponView
   3. 在詳情頁按「取得優惠 QR Code」
   4. 先跳身份驗證
   5. 驗證完成才跳 QR Code 彈窗
   ========================================================= */
(() => {
  const partnerData = {
    starbucks: {
      logo: "images/partner-starbucks.png",
      hero: "images/partner-starbucks-hero.png",
      title: "Starbucks",
      offer: "全飲品 85 折",
      content: "員工出示優惠 QR Code，手作飲品享 85 折。",
      stores: "全台指定門市",
      date: "2026/07/01 - 2026/12/31"
    },
    uniqlo: {
      logo: "images/partner-uniqlo.png",
      hero: "images/衣服拷貝.png",
      title: "UNIQLO",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 UNIQLO 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    mcdonalds: {
      logo: "images/partner-mcdonalds.png",
      hero: "images/麥當勞拷貝.png",
      title: "麥當勞",
      offer: "指定套餐優惠",
      content: "早餐與午餐指定套餐享員工優惠價。",
      stores: "辦公室周邊合作門市",
      date: "2026/07/01 - 2026/09/30"
    },
    nike: {
      logo: "images/partner-nike.png",
      hero: "images/衣服拷貝.png",
      title: "Nike",
      offer: "指定商品 9 折",
      content: "指定鞋款與運動服飾結帳享 9 折優惠。",
      stores: "全台指定 Nike 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    cosmed: {
      logo: "images/partner-cosmed.jpg",
      hero: "images/partner-cosmed-hero.png",
      title: "康是美",
      offer: "指定商品優惠",
      content: "保健、美妝與日用品指定商品享優惠。",
      stores: "全台康是美門市",
      date: "2026/07/01 - 2026/10/31"
    },
    formosa: {
      logo: "images/partner-formosa.png",
      hero: "images/鬍鬚張拷貝.png",
      title: "鬍鬚張",
      offer: "指定套餐 9 折",
      content: "招牌便當與指定套餐享員工價。",
      stores: "台北市指定門市",
      date: "2026/07/01 - 2026/08/31"
    },
    gu: {
      logo: "images/partner-gu.png",
      hero: "images/衣服拷貝.png",
      title: "GU",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 GU 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    net: {
      logo: "images/partner-net.jpg",
      hero: "images/衣服拷貝.png",
      title: "NET",
      offer: "指定商品 9 折",
      content: "員工購買指定服飾商品享 9 折優惠。",
      stores: "全台 NET 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    movie: {
      logo: "images/partner-movie-ticket.png",
      hero: "images/partner-movie-ticket.png",
      title: "員工電影票",
      offer: "每月票券優惠",
      content: "每月可購買指定場次員工優惠票。",
      stores: "合作影城與線上購票",
      date: "2026/07/01 - 2026/07/31"
    }
  };

  let activePartnerId = "starbucks";

  function showEmployeeView(id) {
    const main = document.querySelector(".employee-main");

    document.querySelectorAll(".employee-view").forEach((view) => {
      const active = view.id === id;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });

    if (main) {
      main.classList.toggle("is-detail", id !== "hubView");
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function resetOldPartnerEvents() {
    /*
      你前面貼過的舊 JS 用 document capture 攔截 data-partner / data-category，
      所以這裡把屬性改名，避免舊攔截器繼續吃掉事件。
    */

    document.querySelectorAll("#partnersView .partner-tabs button[data-category]").forEach((oldButton) => {
      const clone = oldButton.cloneNode(true);
      clone.dataset.fixedCategory = oldButton.dataset.category;
      clone.removeAttribute("data-category");
      oldButton.replaceWith(clone);
    });

    document.querySelectorAll("#partnersView .partner-directory button[data-partner]").forEach((oldCard) => {
      const clone = oldCard.cloneNode(true);
      clone.dataset.fixedPartner = oldCard.dataset.partner;
      clone.dataset.fixedCategory = oldCard.dataset.category;
      clone.removeAttribute("data-partner");
      clone.removeAttribute("data-category");
      oldCard.replaceWith(clone);
    });

    const oldQrButton = document.getElementById("partnerGetQrButton");
    if (oldQrButton) {
      const cloneQr = oldQrButton.cloneNode(true);
      oldQrButton.replaceWith(cloneQr);
    }
  }

  function filterPartners(category) {
    const tabs = document.querySelectorAll("#partnersView .partner-tabs button[data-fixed-category]");
    const cards = document.querySelectorAll("#partnersView .partner-directory button[data-fixed-partner]");

    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.fixedCategory === category);
    });

    cards.forEach((card) => {
      const show = category === "all" || card.dataset.fixedCategory === category;

      card.hidden = !show;
      card.style.display = show ? "grid" : "none";
    });
  }

  function openPartnerDetail(partnerId) {
    const data = partnerData[partnerId];
    if (!data) return;

    activePartnerId = partnerId;

    const logo = document.getElementById("partnerCouponLogo");
    const hero = document.getElementById("partnerCouponHero");
    const title = document.getElementById("partnerCouponTitle");
    const offer = document.getElementById("partnerCouponOffer");
    const content = document.getElementById("partnerCouponContent");
    const stores = document.getElementById("partnerCouponStores");
    const date = document.getElementById("partnerCouponDate");
    const qrRow = document.getElementById("partnerQrRow");
    const photo = document.getElementById("partnerVerifiedPhoto");
    const qrButton = document.getElementById("partnerGetQrButton");

    if (logo) logo.src = data.logo;
    if (hero) hero.src = data.hero;
    if (title) title.textContent = data.title;
    if (offer) offer.textContent = data.offer;
    if (content) content.textContent = data.content;
    if (stores) stores.textContent = data.stores;
    if (date) date.textContent = data.date;

    if (qrRow) qrRow.hidden = true;
    if (photo) photo.hidden = true;

    if (qrButton) {
      qrButton.disabled = false;
      qrButton.textContent = "取得優惠 QR Code";
    }

    showEmployeeView("partnerCouponView");
  }

  function ensurePartnerAuthModal() {
    let modal = document.getElementById("partnerAuthModal");
    if (modal) return modal;

    const screen = document.querySelector(".employee-screen") || document.body;

    modal = document.createElement("div");
    modal.id = "partnerAuthModal";
    modal.className = "partner-auth-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="partner-auth-backdrop" data-close-partner-auth></div>

      <section class="partner-auth-dialog" role="dialog" aria-modal="true">
        <button class="partner-auth-close" type="button" data-close-partner-auth>×</button>

        <small>EMPLOYEE VERIFICATION</small>
        <h3>員工身份驗證</h3>
        <p id="partnerAuthText">請先輸入員工工號，驗證完成後才能產生 QR Code。</p>

        <label class="partner-auth-field">
          <span>員工工號</span>
          <input id="partnerAuthInput" type="text" inputmode="numeric" maxlength="8" placeholder="請輸入工號">
        </label>

        <p class="partner-auth-error" id="partnerAuthError"></p>

        <button class="partner-auth-submit" id="partnerAuthSubmit" type="button">
          完成驗證並產生 QR Code
        </button>
      </section>
    `;

    screen.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-partner-auth]")) {
        closePartnerAuthModal();
      }
    });

    modal.querySelector("#partnerAuthSubmit").addEventListener("click", () => {
      const input = modal.querySelector("#partnerAuthInput");
      const error = modal.querySelector("#partnerAuthError");
      const employeeNo = input.value.trim();

      if (!/^\d{4,8}$/.test(employeeNo)) {
        error.textContent = "請輸入 4 到 8 位數工號";
        input.focus();
        return;
      }

      error.textContent = "";
      closePartnerAuthModal();
      openPartnerQrModal(employeeNo);
    });

    return modal;
  }

  function openPartnerAuthModal() {
    const data = partnerData[activePartnerId];
    const modal = ensurePartnerAuthModal();

    modal.querySelector("#partnerAuthText").textContent =
      `請先完成員工身份驗證，才能產生 ${data.title} 的優惠 QR Code。`;

    modal.querySelector("#partnerAuthInput").value = "";
    modal.querySelector("#partnerAuthError").textContent = "";

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      modal.querySelector("#partnerAuthInput").focus();
    }, 80);
  }

  function closePartnerAuthModal() {
    const modal = document.getElementById("partnerAuthModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  function ensurePartnerQrModal() {
    let modal = document.getElementById("partnerQrModal");
    if (modal) return modal;

    const screen = document.querySelector(".employee-screen") || document.body;

    modal = document.createElement("div");
    modal.id = "partnerQrModal";
    modal.className = "partner-qr-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="partner-qr-backdrop" data-close-partner-qr></div>

      <section class="partner-qr-dialog" role="dialog" aria-modal="true">
        <button class="partner-qr-close" type="button" data-close-partner-qr>×</button>

        <div class="partner-qr-top">
          <img id="partnerQrLogo" src="" alt="">
          <div>
            <small>PARTNER QR CODE</small>
            <h3 id="partnerQrName">合作商家</h3>
            <p id="partnerQrOffer">員工優惠</p>
          </div>
        </div>

        <p class="partner-qr-note" id="partnerQrNote">
          員工已完成驗證，請出示 QR Code 給店員掃描。
        </p>

        <img class="partner-qr-code" id="partnerQrCode" src="images/QRCode拷貝.png" alt="QR Code">

        <p class="partner-qr-bottom">請將此畫面出示給合作商家掃描</p>
      </section>
    `;

    screen.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-partner-qr]")) {
        closePartnerQrModal();
      }
    });

    return modal;
  }

  function openPartnerQrModal(employeeNo) {
    const data = partnerData[activePartnerId];
    const modal = ensurePartnerQrModal();

    modal.querySelector("#partnerQrLogo").src = data.logo;
    modal.querySelector("#partnerQrLogo").alt = data.title;
    modal.querySelector("#partnerQrName").textContent = data.title;
    modal.querySelector("#partnerQrOffer").textContent = data.offer;
    modal.querySelector("#partnerQrNote").textContent =
      `員工 ${employeeNo} 已完成驗證，請出示 QR Code 給店員掃描。`;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    const qrButton = document.getElementById("partnerGetQrButton");
    if (qrButton) {
      qrButton.textContent = "已產生優惠 QR Code";
    }
  }

  function closePartnerQrModal() {
    const modal = document.getElementById("partnerQrModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  function bindFixedPartnerEvents() {
    document.querySelectorAll("#partnersView .partner-tabs button[data-fixed-category]").forEach((button) => {
      button.addEventListener("click", () => {
        filterPartners(button.dataset.fixedCategory);
      });
    });

    document.querySelectorAll("#partnersView .partner-directory button[data-fixed-partner]").forEach((card) => {
      card.addEventListener("click", () => {
        openPartnerDetail(card.dataset.fixedPartner);
      });
    });

    const qrButton = document.getElementById("partnerGetQrButton");
    if (qrButton) {
      qrButton.addEventListener("click", () => {
        openPartnerAuthModal();
      });
    }
  }

  resetOldPartnerEvents();
  bindFixedPartnerEvents();
  filterPartners("all");

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePartnerAuthModal();
      closePartnerQrModal();
    }
  });
})();
/* =========================================================
   合作商家白屏修正
   點店家 → 詳情頁 → 取得 QR Code → 驗證 → QR 彈窗
   ========================================================= */
(() => {
  const partnerData = {
    starbucks: {
      category: "food",
      logo: "images/partner-starbucks.png",
      hero: "images/partner-starbucks-hero.png",
      title: "Starbucks",
      offer: "全飲品 85 折",
      content: "員工出示優惠 QR Code，手作飲品享 85 折。",
      stores: "全台 Starbucks 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    uniqlo: {
      category: "shopping",
      logo: "images/partner-uniqlo.png",
      hero: "images/衣服拷貝.png",
      title: "UNIQLO",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 UNIQLO 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    mcdonalds: {
      category: "food",
      logo: "images/partner-mcdonalds.png",
      hero: "images/麥當勞拷貝.png",
      title: "麥當勞",
      offer: "指定套餐優惠",
      content: "早餐與午餐指定套餐享員工優惠價。",
      stores: "辦公室周邊合作門市",
      date: "2026/07/01 - 2026/09/30"
    },
    nike: {
      category: "shopping",
      logo: "images/partner-nike.png",
      hero: "images/衣服拷貝.png",
      title: "Nike",
      offer: "指定商品 9 折",
      content: "指定鞋款與運動服飾結帳享 9 折優惠。",
      stores: "全台指定 Nike 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    cosmed: {
      category: "life",
      logo: "images/partner-cosmed.jpg",
      hero: "images/partner-cosmed-hero.png",
      title: "康是美",
      offer: "指定商品優惠",
      content: "保健、美妝與日用品指定商品享優惠。",
      stores: "全台康是美門市",
      date: "2026/07/01 - 2026/10/31"
    },
    formosa: {
      category: "food",
      logo: "images/partner-formosa.png",
      hero: "images/鬍鬚張拷貝.png",
      title: "鬍鬚張",
      offer: "指定套餐 9 折",
      content: "招牌便當與指定套餐享員工價。",
      stores: "台北市指定門市",
      date: "2026/07/01 - 2026/08/31"
    },
    gu: {
      category: "shopping",
      logo: "images/partner-gu.png",
      hero: "images/衣服拷貝.png",
      title: "GU",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 GU 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    net: {
      category: "shopping",
      logo: "images/partner-net.jpg",
      hero: "images/衣服拷貝.png",
      title: "NET",
      offer: "指定商品 9 折",
      content: "員工購買指定服飾商品享 9 折優惠。",
      stores: "全台 NET 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    movie: {
      category: "entertainment",
      logo: "images/partner-movie-ticket.png",
      hero: "images/partner-movie-ticket.png",
      title: "員工電影票",
      offer: "每月票券優惠",
      content: "每月可購買指定場次員工優惠票。",
      stores: "合作影城與線上購票",
      date: "2026/07/01 - 2026/07/31"
    }
  };

  let activePartnerId = "starbucks";

  function showViewOnly(viewId) {
    const main = document.querySelector(".employee-main");

    document.querySelectorAll(".employee-view").forEach((view) => {
      const active = view.id === viewId;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });

    if (main) {
      main.classList.toggle("is-detail", viewId !== "hubView");
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function normalizePartnerCards() {
    const textToCategory = {
      "全部": "all",
      "餐飲": "food",
      "生活": "life",
      "購物": "shopping",
      "娛樂": "entertainment"
    };

    document.querySelectorAll("#partnersView .partner-tabs button").forEach((button) => {
      const text = button.textContent.trim();
      const category =
        button.dataset.category ||
        button.dataset.fixedCategory ||
        button.dataset.empCategory ||
        textToCategory[text] ||
        "all";

      button.dataset.finalCategory = category;
      button.removeAttribute("data-category");
      button.removeAttribute("data-fixed-category");
      button.removeAttribute("data-emp-category");
    });

    document.querySelectorAll("#partnersView .partner-directory button").forEach((card) => {
      const partnerId =
        card.dataset.partner ||
        card.dataset.fixedPartner ||
        card.dataset.empPartner ||
        card.dataset.finalPartner;

      if (!partnerId || !partnerData[partnerId]) return;

      card.dataset.finalPartner = partnerId;
      card.dataset.finalCategory = partnerData[partnerId].category;

      card.removeAttribute("data-partner");
      card.removeAttribute("data-fixed-partner");
      card.removeAttribute("data-emp-partner");
      card.removeAttribute("data-category");
      card.removeAttribute("data-fixed-category");
      card.removeAttribute("data-emp-category");
    });
  }

  function filterPartners(category) {
    document.querySelectorAll("#partnersView .partner-tabs button[data-final-category]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.finalCategory === category);
    });

    document.querySelectorAll("#partnersView .partner-directory button[data-final-partner]").forEach((card) => {
      const show = category === "all" || card.dataset.finalCategory === category;
      card.hidden = !show;
      card.style.display = show ? "grid" : "none";
    });
  }

  function openPartnerDetail(partnerId) {
    const data = partnerData[partnerId];
    if (!data) return;

    activePartnerId = partnerId;

    const logo = document.getElementById("partnerCouponLogo");
    const hero = document.getElementById("partnerCouponHero");
    const title = document.getElementById("partnerCouponTitle");
    const offer = document.getElementById("partnerCouponOffer");
    const content = document.getElementById("partnerCouponContent");
    const stores = document.getElementById("partnerCouponStores");
    const date = document.getElementById("partnerCouponDate");
    const qrRow = document.getElementById("partnerQrRow");
    const photo = document.getElementById("partnerVerifiedPhoto");
    const button = document.getElementById("partnerGetQrButton");

    if (logo) logo.src = data.logo;
    if (hero) hero.src = data.hero;
    if (title) title.textContent = data.title;
    if (offer) offer.textContent = data.offer;
    if (content) content.textContent = data.content;
    if (stores) stores.textContent = data.stores;
    if (date) date.textContent = data.date;

    if (qrRow) qrRow.hidden = true;
    if (photo) photo.hidden = true;

    if (button) {
      button.disabled = false;
      button.textContent = "取得優惠 QR Code";
    }

    showViewOnly("partnerCouponView");
  }

  function ensureQrModal() {
    let modal = document.getElementById("finalPartnerQrModal");
    if (modal) return modal;

    const screen = document.querySelector(".employee-screen") || document.body;

    modal = document.createElement("div");
    modal.id = "finalPartnerQrModal";
    modal.className = "partner-qr-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="partner-qr-backdrop" data-close-final-partner-qr></div>

      <section class="partner-qr-dialog" role="dialog" aria-modal="true">
        <button class="partner-qr-close" type="button" data-close-final-partner-qr>×</button>

        <div class="partner-qr-top">
          <img id="finalPartnerQrLogo" src="" alt="">
          <div>
            <small>PARTNER QR CODE</small>
            <h3 id="finalPartnerQrTitle">合作商家</h3>
            <p id="finalPartnerQrOffer">員工優惠</p>
          </div>
        </div>

        <p class="partner-qr-note" id="finalPartnerQrNote">
          員工已完成驗證，請出示 QR Code 給店員掃描。
        </p>

        <img class="partner-qr-code" src="images/QRCode拷貝.png" alt="QR Code">

        <p class="partner-qr-bottom">請將此畫面出示給合作商家掃描</p>
      </section>
    `;

    screen.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-final-partner-qr]")) {
        closeQrModal();
      }
    });

    return modal;
  }

  function openQrModal(employeeNo) {
    const data = partnerData[activePartnerId];
    const modal = ensureQrModal();

    modal.querySelector("#finalPartnerQrLogo").src = data.logo;
    modal.querySelector("#finalPartnerQrLogo").alt = data.title;
    modal.querySelector("#finalPartnerQrTitle").textContent = data.title;
    modal.querySelector("#finalPartnerQrOffer").textContent = data.offer;
    modal.querySelector("#finalPartnerQrNote").textContent =
      `員工 ${employeeNo} 已完成驗證，請出示 QR Code 給店員掃描。`;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeQrModal() {
    const modal = document.getElementById("finalPartnerQrModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  function openVerifyThenQr() {
    const data = partnerData[activePartnerId];

    const employeeNo = prompt(`請輸入員工工號，完成驗證後產生 ${data.title} 優惠 QR Code`);

    if (!employeeNo) return;

    if (!/^\d{4,8}$/.test(employeeNo.trim())) {
      alert("請輸入 4 到 8 位數工號");
      return;
    }

    openQrModal(employeeNo.trim());
  }

  function bindFinalEvents() {
    normalizePartnerCards();

    document.querySelectorAll("#partnersView .partner-tabs button[data-final-category]").forEach((button) => {
      button.onclick = null;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        filterPartners(button.dataset.finalCategory);
      });
    });

    document.querySelectorAll("#partnersView .partner-directory button[data-final-partner]").forEach((card) => {
      card.onclick = null;
      card.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openPartnerDetail(card.dataset.finalPartner);
      });
    });

    const qrButton = document.getElementById("partnerGetQrButton");
    if (qrButton) {
      qrButton.onclick = null;
      qrButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openVerifyThenQr();
      });
    }

    filterPartners("all");
  }

  bindFinalEvents();

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeQrModal();
    }
  });
})();
/* =========================================================
   合作商家最終修正：全部店家可點、可分類、不白屏
   流程：
   1. 分類按鈕切換
   2. 點店家 → 進詳情頁
   3. 詳情頁按「取得優惠 QR Code」→ 驗證
   4. 驗證完成 → QR Code 彈窗
   ========================================================= */
(() => {
  const partnerData = {
    starbucks: {
      category: "food",
      logo: "images/partner-starbucks.png",
      hero: "images/partner-starbucks-hero.png",
      title: "Starbucks",
      offer: "全飲品 85 折",
      content: "員工出示優惠 QR Code，手作飲品享 85 折。",
      stores: "全台 Starbucks 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    uniqlo: {
      category: "shopping",
      logo: "images/partner-uniqlo.png",
      hero: "images/衣服拷貝.png",
      title: "UNIQLO",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 UNIQLO 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    mcdonalds: {
      category: "food",
      logo: "images/partner-mcdonalds.png",
      hero: "images/麥當勞拷貝.png",
      title: "麥當勞",
      offer: "指定套餐優惠",
      content: "早餐與午餐指定套餐享員工優惠價。",
      stores: "辦公室周邊合作門市",
      date: "2026/07/01 - 2026/09/30"
    },
    nike: {
      category: "shopping",
      logo: "images/partner-nike.png",
      hero: "images/衣服拷貝.png",
      title: "Nike",
      offer: "指定商品 9 折",
      content: "指定鞋款與運動服飾結帳享 9 折優惠。",
      stores: "全台指定 Nike 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    cosmed: {
      category: "life",
      logo: "images/partner-cosmed.jpg",
      hero: "images/partner-cosmed-hero.png",
      title: "康是美",
      offer: "指定商品優惠",
      content: "保健、美妝與日用品指定商品享優惠。",
      stores: "全台康是美門市",
      date: "2026/07/01 - 2026/10/31"
    },
    formosa: {
      category: "food",
      logo: "images/partner-formosa.png",
      hero: "images/鬍鬚張拷貝.png",
      title: "鬍鬚張",
      offer: "指定套餐 9 折",
      content: "招牌便當與指定套餐享員工價。",
      stores: "台北市指定門市",
      date: "2026/07/01 - 2026/08/31"
    },
    gu: {
      category: "shopping",
      logo: "images/partner-gu.png",
      hero: "images/衣服拷貝.png",
      title: "GU",
      offer: "全館商品 95 折",
      content: "正價商品結帳享 95 折優惠。",
      stores: "全台 GU 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    net: {
      category: "shopping",
      logo: "images/partner-net.jpg",
      hero: "images/衣服拷貝.png",
      title: "NET",
      offer: "指定商品 9 折",
      content: "員工購買指定服飾商品享 9 折優惠。",
      stores: "全台 NET 門市",
      date: "2026/07/01 - 2026/12/31"
    },
    movie: {
      category: "entertainment",
      logo: "images/partner-movie-ticket.png",
      hero: "images/partner-movie-ticket.png",
      title: "員工電影票",
      offer: "每月票券優惠",
      content: "每月可購買指定場次員工優惠票。",
      stores: "合作影城與線上購票",
      date: "2026/07/01 - 2026/07/31"
    }
  };

  const titleToId = {
    "Starbucks": "starbucks",
    "UNIQLO": "uniqlo",
    "麥當勞": "mcdonalds",
    "Nike": "nike",
    "康是美": "cosmed",
    "鬍鬚張": "formosa",
    "GU": "gu",
    "NET": "net",
    "員工電影票": "movie"
  };

  const categoryTextToId = {
    "全部": "all",
    "餐飲": "food",
    "生活": "life",
    "購物": "shopping",
    "娛樂": "entertainment"
  };

  let currentPartnerId = "starbucks";

  function showEmployeeView(viewId) {
    const main = document.querySelector(".employee-main");

    document.querySelectorAll(".employee-view").forEach((view) => {
      const active = view.id === viewId;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });

    if (main) {
      main.classList.toggle("is-detail", viewId !== "hubView");
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function getPartnerIdFromCard(card) {
    if (!card) return "";

    const fromDataset =
      card.dataset.partner ||
      card.dataset.finalPartner ||
      card.dataset.empPartner ||
      card.dataset.fixedPartner;

    if (fromDataset && partnerData[fromDataset]) return fromDataset;

    const title = card.querySelector("strong")?.textContent?.trim();
    if (title && titleToId[title]) return titleToId[title];

    return "";
  }

  function getCategoryFromTab(tab) {
    if (!tab) return "all";

    return (
      tab.dataset.category ||
      tab.dataset.finalCategory ||
      tab.dataset.empCategory ||
      tab.dataset.fixedCategory ||
      categoryTextToId[tab.textContent.trim()] ||
      "all"
    );
  }

  function normalizePartnerDom() {
    document.querySelectorAll("#partnersView .partner-directory button").forEach((card) => {
      const partnerId = getPartnerIdFromCard(card);
      if (!partnerId || !partnerData[partnerId]) return;

      card.dataset.partnerIdFinal = partnerId;
      card.dataset.categoryFinal = partnerData[partnerId].category;

      card.hidden = false;
      card.style.display = "grid";
    });

    document.querySelectorAll("#partnersView .partner-tabs button").forEach((tab) => {
      const category = getCategoryFromTab(tab);
      tab.dataset.categoryFinal = category;
    });
  }

  function filterPartnerCards(category) {
    normalizePartnerDom();

    document.querySelectorAll("#partnersView .partner-tabs button").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.categoryFinal === category);
    });

    document.querySelectorAll("#partnersView .partner-directory button").forEach((card) => {
      const cardCategory = card.dataset.categoryFinal;
      const show = category === "all" || cardCategory === category;

      card.hidden = !show;
      card.style.display = show ? "grid" : "none";
    });
  }

  function openPartnerDetail(partnerId) {
    const data = partnerData[partnerId];
    if (!data) return;

    currentPartnerId = partnerId;

    const logo = document.getElementById("partnerCouponLogo");
    const hero = document.getElementById("partnerCouponHero");
    const title = document.getElementById("partnerCouponTitle");
    const offer = document.getElementById("partnerCouponOffer");
    const content = document.getElementById("partnerCouponContent");
    const stores = document.getElementById("partnerCouponStores");
    const date = document.getElementById("partnerCouponDate");
    const qrRow = document.getElementById("partnerQrRow");
    const photo = document.getElementById("partnerVerifiedPhoto");
    const qrButton = document.getElementById("partnerGetQrButton");

    if (logo) {
      logo.src = data.logo;
      logo.alt = data.title;
    }

    if (hero) {
      hero.src = data.hero;
      hero.alt = data.title;
      hero.onerror = () => {
        hero.src = data.logo;
      };
    }

    if (title) title.textContent = data.title;
    if (offer) offer.textContent = data.offer;
    if (content) content.textContent = data.content;
    if (stores) stores.textContent = data.stores;
    if (date) date.textContent = data.date;

    if (qrRow) qrRow.hidden = true;
    if (photo) photo.hidden = true;

    if (qrButton) {
      qrButton.disabled = false;
      qrButton.textContent = "取得優惠 QR Code";
    }

    showEmployeeView("partnerCouponView");
  }

  function openEmployeeAuthForPartner() {
    const data = partnerData[currentPartnerId];

    const modal = document.getElementById("employeeAuthModal");
    const title = document.getElementById("authTitle");
    const text = document.getElementById("authText");
    const input = document.getElementById("authEmployeeId");
    const message = document.getElementById("authMessage");
    const idStep = document.getElementById("authIdStep");
    const faceStep = document.getElementById("authFaceStep");
    const snapshot = document.getElementById("authFaceSnapshot");

    if (!modal || !title || !text || !input) {
      openPartnerQrModal("1111");
      return;
    }

    title.textContent = "取得優惠 QR Code";
    text.textContent = `請完成員工工號與人臉驗證，即可取得 ${data.title} 優惠 QR Code。`;
    input.value = "";
    if (message) message.textContent = "";
    if (snapshot) {
      snapshot.hidden = true;
      snapshot.src = "";
    }

    idStep?.classList.add("active");
    faceStep?.classList.remove("active");

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    modal.dataset.partnerQrMode = "true";

    setTimeout(() => input.focus(), 80);
  }

  function ensurePartnerQrModal() {
    let modal = document.getElementById("partnerFinalQrModal");
    if (modal) return modal;

    const screen = document.querySelector(".employee-screen") || document.body;

    modal = document.createElement("div");
    modal.id = "partnerFinalQrModal";
    modal.className = "partner-qr-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="partner-qr-backdrop" data-close-partner-final-qr></div>

      <section class="partner-qr-dialog" role="dialog" aria-modal="true">
        <button class="partner-qr-close" type="button" data-close-partner-final-qr>×</button>

        <div class="partner-qr-top">
          <img id="partnerFinalQrLogo" src="" alt="">
          <div>
            <small>PARTNER QR CODE</small>
            <h3 id="partnerFinalQrTitle">合作商家</h3>
            <p id="partnerFinalQrOffer">員工優惠</p>
          </div>
        </div>

        <p class="partner-qr-note" id="partnerFinalQrNote">
          員工已完成驗證，請出示 QR Code 給店員掃描。
        </p>

        <img class="partner-qr-code" src="images/QRCode拷貝.png" alt="QR Code">

        <p class="partner-qr-bottom">請將此畫面出示給合作商家掃描</p>
      </section>
    `;

    screen.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-partner-final-qr]")) {
        closePartnerQrModal();
      }
    });

    return modal;
  }

  function openPartnerQrModal(employeeId) {
    const data = partnerData[currentPartnerId];
    const modal = ensurePartnerQrModal();

    modal.querySelector("#partnerFinalQrLogo").src = data.logo;
    modal.querySelector("#partnerFinalQrLogo").alt = data.title;
    modal.querySelector("#partnerFinalQrTitle").textContent = data.title;
    modal.querySelector("#partnerFinalQrOffer").textContent = data.offer;
    modal.querySelector("#partnerFinalQrNote").textContent =
      `員工 ${employeeId} 已完成驗證，請出示 QR Code 給店員掃描。`;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    const qrButton = document.getElementById("partnerGetQrButton");
    if (qrButton) {
      qrButton.textContent = "已產生優惠 QR Code";
      qrButton.disabled = true;
    }
  }

  function closePartnerQrModal() {
    const modal = document.getElementById("partnerFinalQrModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  function patchAuthCaptureForPartnerQr() {
    window.WohoursOpenPartnerQrModal = openPartnerQrModal;
  }

  normalizePartnerDom();
  filterPartnerCards("all");
  patchAuthCaptureForPartnerQr();

  /* 用捕獲階段攔截，避免前面舊的重複 JS 又把事件吃掉 */
  document.addEventListener(
    "click",
    (event) => {
      const tab = event.target.closest("#partnersView .partner-tabs button");
      if (tab) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const category = getCategoryFromTab(tab);
        filterPartnerCards(category);
        return;
      }

      const card = event.target.closest("#partnersView .partner-directory button");
      if (card) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const partnerId = getPartnerIdFromCard(card);
        openPartnerDetail(partnerId);
        return;
      }

      const qrButton = event.target.closest("#partnerGetQrButton");
      if (qrButton) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        openEmployeeAuthForPartner();
      }
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePartnerQrModal();
    }
  });
})();
}

/* ===============================
   人臉註冊轉盤流程
   =============================== */
(() => {
  const page = document.getElementById("faceView");
  const card = page?.querySelector(".face-register-card");
  if (!page || !card) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const progressAngles = {
    1: 90,
    2: 180,
    3: 270,
    4: 360
  };

  let currentStep = 1;
  let employeeNo = "";
  let localFaceStream = null;
  let captureTimers = [];
  let captureFrame = null;
  let autoBackTimer = null;
  let autoBackRemaining = 10;

  function clearCaptureTimers() {
    captureTimers.forEach((timer) => clearTimeout(timer));
    captureTimers = [];
    if (captureFrame) {
      cancelAnimationFrame(captureFrame);
      captureFrame = null;
    }
  }

  function stopLocalCamera() {
    if (localFaceStream) {
      localFaceStream.getTracks().forEach((track) => track.stop());
      localFaceStream = null;
    }

    const video = $("#faceVideo");
    if (video) video.srcObject = null;
  }

  function clearAutoBack() {
    clearInterval(autoBackTimer);
    autoBackTimer = null;
  }

  function setProgressAngle(angle) {
    card.querySelector(".face-wheel")?.style.setProperty("--face-progress-angle", `${angle}deg`);
  }

  function pulseTurn() {
    card.classList.remove("is-turning");
    void card.offsetWidth;
    card.classList.add("is-turning");
    captureTimers.push(setTimeout(() => card.classList.remove("is-turning"), 680));
  }

  function setStep(nextStep, { turning = true } = {}) {
    currentStep = nextStep;
    card.dataset.faceStep = String(nextStep);
    card.classList.remove("is-error", "is-capturing", "capture-success", "face-center-error", "face-light-error");
    setProgressAngle(progressAngles[nextStep]);
    if (turning) pulseTurn();

    $$("[data-face-panel]", card).forEach((panel) => {
      const active = Number(panel.dataset.facePanel) === nextStep;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });

    $$("[data-wheel-marker]", card).forEach((marker) => {
      const step = Number(marker.dataset.wheelMarker);
      marker.classList.toggle("done", step < nextStep || nextStep === 4);
      marker.classList.toggle("active", step === nextStep && nextStep !== 4);
    });

    $$("[data-face-progress]", card).forEach((item) => {
      const step = Number(item.dataset.faceProgress);
      item.classList.toggle("done", step < nextStep || nextStep === 4);
      item.classList.toggle("active", step === nextStep && nextStep !== 4);
    });

    $$("[data-face-bottom]", card).forEach((item) => {
      const step = Number(item.dataset.faceBottom);
      item.classList.toggle("done", step < nextStep || nextStep === 4);
      item.classList.toggle("active", step === nextStep && nextStep !== 4);
    });

    if (nextStep !== 3) stopLocalCamera();
    if (nextStep !== 4) clearAutoBack();
  }

  function showError(message, targets = []) {
    $("#faceError").textContent = "";
    $("#faceConsentError").textContent = "";
    const errorNode = currentStep === 2 ? $("#faceConsentError") : $("#faceError");
    if (errorNode) errorNode.textContent = message;

    card.classList.add("is-error", "shake");
    targets.forEach((target) => target?.classList.add("shake"));

    captureTimers.push(setTimeout(() => {
      card.classList.remove("shake");
      targets.forEach((target) => target?.classList.remove("shake"));
    }, 380));

    captureTimers.push(setTimeout(() => {
      card.classList.remove("is-error");
      if (errorNode) errorNode.textContent = "";
    }, 1500));
  }

  function isValidEmployeeNo(value) {
    return /^\d{4,8}$/.test(value) && !/^0+$/.test(value);
  }

  function confirmEmployee() {
    const input = $("#faceEmployeeId");
    const value = input.value.trim();
    input.value = value;

    if (!isValidEmployeeNo(value)) {
      showError("查無此員工工號，請重新輸入", [$(".face-id-field")]);
      return;
    }

    const employee = window.WohoursEmployeeLookup?.find?.(value);
    if (!employee) {
      showError(window.WohoursEmployeeLookup?.message?.() || "查無此員工工號，請重新輸入", [$(".face-id-field")]);
      return;
    }

    employeeNo = employee.id;
    input.value = employee.id;
    $("#faceError").textContent = "";
    setStep(2);
  }

  function updateEmployeeInputState() {
    const input = $("#faceEmployeeId");
    const hasValue = input.value.trim().length > 0;
    card.classList.toggle("has-id", hasValue);
    $("#startConsent").disabled = !hasValue;
  }

  function updateConsentState() {
    const checked = $("#agreeFace").checked;
    $("#openFaceCamera").disabled = false;
    $("#openFaceCamera").classList.toggle("is-disabled", !checked);
    $("#openFaceCamera").setAttribute("aria-disabled", checked ? "false" : "true");
    card.classList.toggle("has-consent", checked);
    if (checked) $("#faceConsentError").textContent = "";
  }

  function requestCamera() {
    const video = $("#faceVideo");
    const status = $("#faceCameraStatus");
    if (!video || !status) return;

    status.textContent = "正在開啟鏡頭...";

    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = "目前使用模擬鏡頭，請將臉部置於取景框中央";
      return;
    }

    stopLocalCamera();
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        localFaceStream = stream;
        video.srcObject = stream;
        status.textContent = "相機已開啟，請正視鏡頭";
        return video.play();
      })
      .catch(() => {
        status.textContent = "無法開啟相機，已切換為模擬鏡頭";
      });
  }

  function openCameraStep() {
    if (!$("#agreeFace").checked) {
      showError("請先勾選同意後再繼續", [$("#faceConsentCheck")]);
      return;
    }

    setStep(3);
    $("#faceCameraTitle").textContent = "準備拍攝";
    $("#faceCameraHint").textContent = "保持光線充足，正視鏡頭";
    $("#completeFace").textContent = "開始拍攝";
    $("#completeFace").disabled = false;
    $$("#faceCaptureChecks li").forEach((item) => item.classList.remove("is-active"));
    requestCamera();
  }

  function setCaptureProgress(fromAngle, toAngle, duration) {
    const startedAt = performance.now();

    function frame(now) {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgressAngle(fromAngle + (toAngle - fromAngle) * eased);

      if (elapsed < 1) {
        captureFrame = requestAnimationFrame(frame);
      }
    }

    captureFrame = requestAnimationFrame(frame);
  }

  function finishCapture() {
    card.classList.remove("is-capturing");
    card.classList.add("capture-success");
    setProgressAngle(270);
    $("#faceCameraTitle").textContent = "人臉資料已擷取";
    $("#faceCameraHint").textContent = "擷取成功，正在完成註冊";

    captureTimers.push(setTimeout(() => {
      employeeNo = $("#faceEmployeeId").value.trim() || employeeNo;
      $("#faceSuccessText").innerHTML = `員工 ${employeeNo}<br>人臉註冊已完成`;
      setStep(4);
      setProgressAngle(360);
      startAutoBack();
    }, 520));
  }

  function startCapture() {
    if (currentStep !== 3 || card.classList.contains("is-capturing")) return;

    clearCaptureTimers();
    card.classList.add("is-capturing");
    $("#faceCameraTitle").textContent = "拍攝中，請保持不動";
    $("#faceCameraHint").textContent = "正在擷取人臉資料...";
    $("#faceCameraStatus").textContent = "辨識中...";
    $("#completeFace").textContent = "辨識中...";
    $("#completeFace").disabled = true;
    $$("#faceCaptureChecks li").forEach((item) => item.classList.remove("is-active"));

    setCaptureProgress(270, 324, 2500);
    ["center", "light", "front"].forEach((name, index) => {
      captureTimers.push(setTimeout(() => {
        $(`#faceCaptureChecks [data-check="${name}"]`)?.classList.add("is-active");
      }, 500 + index * 500));
    });
    captureTimers.push(setTimeout(finishCapture, 2700));
  }

  function returnToHub() {
    clearAutoBack();
    clearCaptureTimers();
    stopLocalCamera();

    document.querySelectorAll(".employee-view").forEach((view) => {
      const active = view.id === "hubView";
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });

    document.querySelector(".employee-main")?.classList.remove("is-detail");
    document.querySelector(".employee-main")?.scrollTo({ top: 0, behavior: "smooth" });

    document.querySelectorAll(".employee-sidebar [data-view]").forEach((item) => {
      item.classList.toggle("active", item.dataset.view === "hubView");
    });

    window.fitKioskCanvas?.();
  }

  function startAutoBack() {
    clearAutoBack();

    autoBackRemaining = 10;

    const text = $("#faceAutoBackText");
    if (text) text.textContent = `${autoBackRemaining} 秒後自動返回員工專區...`;

    autoBackTimer = setInterval(() => {
      autoBackRemaining -= 1;

      if (text) {
        text.textContent = `${Math.max(autoBackRemaining, 0)} 秒後自動返回員工專區...`;
      }

      if (autoBackRemaining <= 0) {
        clearAutoBack();
        returnToHub();
      }
    }, 1000);
  }

  function resetFaceFlow() {
    clearCaptureTimers();
    clearAutoBack();
    stopLocalCamera();

    $("#faceEmployeeId").value = "";
    $("#agreeFace").checked = false;
    $("#faceError").textContent = "";
    $("#faceConsentError").textContent = "";
    $("#faceCameraStatus").textContent = "等待相機權限";
    $("#faceCameraTitle").textContent = "準備拍攝";
    $("#faceCameraHint").textContent = "請將臉部置於取景框中央";
    $("#completeFace").textContent = "開始拍攝";
    $("#completeFace").disabled = false;
    $$("#faceCaptureChecks li").forEach((item) => item.classList.remove("is-active"));
    updateEmployeeInputState();
    updateConsentState();
    setStep(1, { turning: false });
  }

  function bindFaceRotary() {
    $("#faceEmployeeId")?.addEventListener("input", () => {
      $("#faceError").textContent = "";
      updateEmployeeInputState();
    });

    $("#agreeFace")?.addEventListener("change", updateConsentState);

    document.addEventListener(
      "click",
      (event) => {
        const confirmButton = event.target.closest("#startConsent");
        const consentButton = event.target.closest("#openFaceCamera");
        const captureButton = event.target.closest("#completeFace");
        const returnButton = event.target.closest("[data-face-return]");

        if (!confirmButton && !consentButton && !captureButton && !returnButton) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (confirmButton) confirmEmployee();
        if (consentButton) openCameraStep();
        if (captureButton) startCapture();
        if (returnButton) returnToHub();
      },
      true
    );

    const observer = new MutationObserver(() => {
      if (page.classList.contains("active") && page.getAttribute("aria-hidden") === "false") {
        resetFaceFlow();
      } else {
        clearCaptureTimers();
        clearAutoBack();
        stopLocalCamera();
      }
    });

    observer.observe(page, { attributes: true, attributeFilter: ["class", "aria-hidden"] });
    window.addEventListener("beforeunload", stopLocalCamera);
  }

  resetFaceFlow();
  bindFaceRotary();
})();

/* ===============================
   Context sidebars for employee views
   =============================== */
(() => {
  const sidebar = document.querySelector(".employee-sidebar");
  const screen = document.querySelector(".employee-screen");
  const main = document.querySelector(".employee-main");
  const views = Array.from(document.querySelectorAll(".employee-view"));
  if (!sidebar || !main || !views.length) return;

  const birthdayViews = new Set(["birthdayView"]);
  const partnerViews = new Set(["partnersView", "partnerCouponView"]);
  const welfareViews = new Set([
    "eventsView",
    "eventsNoticeListView",
    "eventsDeadlineView",
    "eventMovieDayView",
    "eventHealthView",
    "eventHealthSignupView",
    "eventHealthSuccessView",
    "eventTripView",
    "eventTripSignupView",
    "eventTripSuccessView",
    "eventFireDrillView",
    "eventUniformView",
    "eventStretchView",
    "eventParentDayView",
    "eventsPerksView",
    "eventsCalendarView"
  ]);
  const fullscreenEventViews = new Set([
    "eventHealthView",
    "eventHealthSignupView",
    "eventHealthSuccessView",
    "eventTripSignupView",
    "eventTripSuccessView"
  ]);
  let partnerSidebarCollapsed = false;
  let wasPartnerMode = false;
  let movieSidebarCollapsed = false;
  let wasMovieMode = false;

  function activeViewId() {
    return views.find((view) => view.classList.contains("active"))?.id || "hubView";
  }

  function setView(id) {
    const target = document.getElementById(id);
    if (!target?.classList.contains("employee-view")) return;

    views.forEach((view) => {
      const active = view === target;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });

    main.classList.toggle("is-detail", id !== "hubView");
    if (fullscreenEventViews.has(id)) {
      screen?.classList.remove("is-event-sidebar-open");
    } else {
      screen?.classList.remove("is-event-sidebar-open");
    }
    main.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", id === "hubView" ? location.pathname : `#${id}`);
    renderSidebar(id);
  }

  function showBirthdayPanel(id) {
    document.querySelectorAll("#birthdayView .birthday-flow-panel").forEach((panel) => {
      const active = panel.id === id;
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
    setView("birthdayView");
  }

  function applyWelfareFilter(filter) {
    setView("eventsView");
    requestAnimationFrame(() => {
      document.querySelector(`#eventsView [data-welfare-filter="${filter}"]`)?.click();
    });
  }

  function navItem(label, attrs = "") {
    return `<button class="employee-side-item" type="button" ${attrs}>${label}</button>`;
  }

  function navLink(label, href, extraClass = "") {
    return `<a class="employee-side-item ${extraClass}" href="${href}">${label}</a>`;
  }

  function sidebarLogo() {
    return `<a class="employee-side-logo" href="homepage-ui.html" aria-label="WOHOURS 首頁"><img src="images/logo.png" alt="WOHOURS"></a>`;
  }

  function returnButton(label, view = "hubView") {
    return `<button class="employee-side-return" type="button" data-sidebar-view="${view}"><span>‹</span>${label}</button>`;
  }

  function employeeCoreLinks(exclude = "") {
    const items = [
      ["員工福利", 'data-sidebar-view="benefitsView"', "benefitsView"],
      ["員工電影優惠", 'data-sidebar-view="moviesView"', "moviesView"],
      ["排班公告", "href=\"schedule.html\"", "schedule"],
      ["申報維修", 'data-sidebar-view="repairView"', "repairView"],
      ["註冊人臉", 'data-sidebar-view="faceView"', "faceView"]
    ];
    return items
      .filter(([, , key]) => key !== exclude)
      .map(([label, attrs]) => attrs.startsWith("href")
        ? `<a class="employee-side-item" ${attrs}>${label}</a>`
        : navItem(label, attrs))
      .join("");
  }

  function welfareRelatedLinks(exclude = "") {
    const items = [
      ["合作商家", 'data-sidebar-view="partnersView"', "partnersView"],
      ["生日禮物", 'data-sidebar-view="birthdayView"', "birthdayView"],
      ["福利公告／活動", 'data-sidebar-view="eventsView"', "eventsView"],
      ["健康檢查", "href=\"health.html\"", "health"]
    ];
    return items
      .filter(([, , key]) => key !== exclude)
      .map(([label, attrs]) => attrs.startsWith("href")
        ? `<a class="employee-side-item" ${attrs}>${label}</a>`
        : navItem(label, attrs))
      .join("");
  }

  function renderHubSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-hub-menu" aria-label="員工專區側邊選單">
        ${sidebarLogo()}
        <a class="employee-side-return" href="homepage-ui.html"><span>‹</span>返回首頁</a>

        <section class="employee-side-group employee-hub-links">
          ${navItem("員工專區", 'data-sidebar-view="hubView"')}
          ${navLink("訪客登記", "visitor.html")}
          ${navLink("出勤打卡", "attendance.html")}
          ${navLink("健康檢查", "health.html")}
          ${navLink("午餐訂購", "lunch.html")}
          ${navLink("包裹領取", "delivery.html")}
          ${navLink("緊急聯繫", "emergency.html")}
        </section>
      </nav>
    `;
  }

  function renderBenefitsSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-detail-menu" aria-label="員工福利側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工專區")}
        <section class="employee-side-group">
          ${employeeCoreLinks("benefitsView")}
        </section>
      </nav>
    `;
  }

  function renderPartnerSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-detail-menu" aria-label="合作商家卡側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工福利", "benefitsView")}
        <section class="employee-side-group">
          <h2>相關功能</h2>
          ${welfareRelatedLinks("partnersView")}
        </section>
      </nav>
    `;
  }

  function ensurePartnerSidebarToggle() {
    if (sidebar.querySelector(".partner-sidebar-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "partner-sidebar-toggle";
    button.setAttribute("aria-label", "展開側邊欄");
    button.innerHTML = "<span>‹</span>";
    sidebar.appendChild(button);
  }

  function syncPartnerSidebar(id) {
    const screen = document.querySelector(".employee-screen");
    const isPartnerMode = partnerViews.has(id);
    screen?.classList.toggle("partner-sidebar-mode", isPartnerMode);

    if (isPartnerMode && !wasPartnerMode) {
      partnerSidebarCollapsed = true;
    }
    if (!isPartnerMode) {
      partnerSidebarCollapsed = false;
    }
    wasPartnerMode = isPartnerMode;

    sidebar.classList.toggle("is-partner-collapsed", isPartnerMode && partnerSidebarCollapsed);
    sidebar.classList.toggle("is-partner-expanded", isPartnerMode && !partnerSidebarCollapsed);
    screen?.classList.toggle("partner-sidebar-collapsed", isPartnerMode && partnerSidebarCollapsed);
    screen?.classList.toggle("partner-sidebar-expanded", isPartnerMode && !partnerSidebarCollapsed);
    if (isPartnerMode) ensurePartnerSidebarToggle();
  }

  function renderMovieSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-movie-menu" aria-label="員工電影優惠側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工專區")}
        <section class="employee-side-group">
          ${employeeCoreLinks("moviesView")}
        </section>
      </nav>
    `;
  }

  function ensureMovieSidebarToggle() {
    if (sidebar.querySelector(".movie-sidebar-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "movie-sidebar-toggle";
    button.setAttribute("aria-label", "收合或展開側邊欄");
    button.innerHTML = "<span>‹</span>";
    sidebar.appendChild(button);
  }

  function syncMovieSidebar(id) {
    const screen = document.querySelector(".employee-screen");
    const isMovieMode = id === "moviesView";
    screen?.classList.toggle("movie-sidebar-mode", isMovieMode);

    if (isMovieMode && !wasMovieMode) {
      movieSidebarCollapsed = true;
    }
    if (!isMovieMode) {
      movieSidebarCollapsed = false;
    }
    wasMovieMode = isMovieMode;

    sidebar.classList.toggle("is-movie-collapsed", isMovieMode && movieSidebarCollapsed);
    sidebar.classList.toggle("is-movie-expanded", isMovieMode && !movieSidebarCollapsed);
    screen?.classList.toggle("movie-sidebar-collapsed", isMovieMode && movieSidebarCollapsed);
    screen?.classList.toggle("movie-sidebar-expanded", isMovieMode && !movieSidebarCollapsed);
    if (isMovieMode) ensureMovieSidebarToggle();
  }

  function renderBirthdaySidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-detail-menu" aria-label="生日禮金側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工福利", "benefitsView")}
        <section class="employee-side-group">
          <h2>領取流程</h2>
          ${navItem("<b>01</b>輸入員工工號", 'data-birthday-panel="birthdayQueryPanel"')}
          ${navItem("<b>02</b>查詢資格", 'data-birthday-panel="birthdayQueryPanel"')}
          ${navItem("<b>03</b>確認生日月份", 'data-birthday-panel="birthdaySuccessPanel"')}
          ${navItem("<b>04</b>立即領取", 'data-birthday-panel="birthdayClaimPanel"')}
        </section>

        <section class="employee-side-group">
          <h2>相關功能</h2>
          ${welfareRelatedLinks("birthdayView")}
        </section>
      </nav>
    `;
  }

  function renderWelfareSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-detail-menu" aria-label="福利公告側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工福利", "benefitsView")}
        <section class="employee-side-group">
          <h2>公告分類</h2>
          ${navItem("員工旅遊", 'data-welfare-sidebar-filter="travel"')}
          ${navItem("活動報名", 'data-welfare-sidebar-filter="activity"')}
          ${navItem("補助資訊", 'data-sidebar-view="eventsPerksView"')}
          ${navItem("節慶福利", 'data-welfare-sidebar-filter="notice"')}
          ${navItem("公司公告", 'data-sidebar-view="eventsNoticeListView"')}
        </section>

        <section class="employee-side-group">
          <h2>相關功能</h2>
          ${welfareRelatedLinks("eventsView")}
        </section>
      </nav>
    `;
  }

  function renderRepairSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-detail-menu" aria-label="申報維修側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工專區")}
        <section class="employee-side-group">
          ${employeeCoreLinks("repairView")}
        </section>
      </nav>
    `;
  }

  function renderFaceSidebar() {
    sidebar.innerHTML = `
      <nav class="employee-sidebar-menu employee-detail-menu" aria-label="人臉註冊側邊選單">
        ${sidebarLogo()}
        ${returnButton("返回員工專區")}
        <section class="employee-side-group">
          ${employeeCoreLinks("faceView")}
        </section>
      </nav>
    `;
  }

  function renderSidebar(id = activeViewId()) {
    if (id === "benefitsView") {
      sidebar.dataset.context = "benefits";
      renderBenefitsSidebar();
    } else if (partnerViews.has(id)) {
      sidebar.dataset.context = "partners";
      renderPartnerSidebar();
    } else if (birthdayViews.has(id)) {
      sidebar.dataset.context = "birthday";
      renderBirthdaySidebar();
    } else if (welfareViews.has(id)) {
      sidebar.dataset.context = "welfare";
      renderWelfareSidebar();
    } else if (id === "moviesView") {
      sidebar.dataset.context = "movie";
      renderMovieSidebar();
    } else if (id === "repairView") {
      sidebar.dataset.context = "repair";
      renderRepairSidebar();
    } else if (id === "faceView") {
      sidebar.dataset.context = "face";
      renderFaceSidebar();
    } else {
      sidebar.dataset.context = "hub";
      renderHubSidebar();
    }

    sidebar.querySelectorAll("[data-sidebar-view]").forEach((item) => {
      item.classList.toggle("active", item.dataset.sidebarView === id);
    });
    syncPartnerSidebar(id);
    syncMovieSidebar(id);
  }

  function ensureFaceCornerBack() {
    const page = document.getElementById("faceView");
    if (!page || page.querySelector(".face-corner-back")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "face-corner-back";
    button.setAttribute("aria-label", "返回員工專區");
    button.dataset.faceCornerBack = "true";
    button.innerHTML = "<span>‹</span>";
    page.appendChild(button);
  }

  sidebar.addEventListener("click", (event) => {
    const screen = document.querySelector(".employee-screen");
    const clickedSidebarBlank = event.target === sidebar || (
      Boolean(event.target.closest(".employee-sidebar-menu")) &&
      !event.target.closest("button, a")
    );
    const movieMode = screen?.classList.contains("movie-sidebar-mode");
    const movieToggle = event.target.closest(".movie-sidebar-toggle");
    const clickedMovieBlank = movieMode && clickedSidebarBlank;

    if (movieMode && (movieToggle || clickedMovieBlank)) {
      event.preventDefault();
      event.stopPropagation();
      movieSidebarCollapsed = !movieSidebarCollapsed;
      syncMovieSidebar(activeViewId());
      return;
    }

    const partnerMode = screen?.classList.contains("partner-sidebar-mode");
    const partnerToggle = event.target.closest(".partner-sidebar-toggle");
    const clickedPartnerBlank = partnerMode && clickedSidebarBlank;

    if (partnerMode && (partnerToggle || clickedPartnerBlank)) {
      event.preventDefault();
      event.stopPropagation();
      partnerSidebarCollapsed = !partnerSidebarCollapsed;
      syncPartnerSidebar(activeViewId());
      return;
    }

    const viewButton = event.target.closest("[data-sidebar-view]");
    if (viewButton) {
      event.preventDefault();
      setView(viewButton.dataset.sidebarView);
      return;
    }

    const birthdayButton = event.target.closest("[data-birthday-panel]");
    if (birthdayButton) {
      event.preventDefault();
      showBirthdayPanel(birthdayButton.dataset.birthdayPanel);
      return;
    }

    const welfareButton = event.target.closest("[data-welfare-sidebar-filter]");
    if (welfareButton) {
      event.preventDefault();
      applyWelfareFilter(welfareButton.dataset.welfareSidebarFilter);
    }
  });

  document.addEventListener("click", (event) => {
    const faceBack = event.target.closest("[data-face-corner-back]");
    if (!faceBack) return;
    event.preventDefault();
    event.stopPropagation();
    setView("hubView");
  }, true);

  const observer = new MutationObserver(() => renderSidebar(activeViewId()));
  views.forEach((view) => observer.observe(view, { attributes: true, attributeFilter: ["class"] }));

  ensureFaceCornerBack();
  renderSidebar(activeViewId());
})();

/* ===============================
   員工專區首頁合作商家輪播與外部入口
   =============================== */
(() => {
  const partners = [
    { id: "starbucks", title: "Starbucks", offer: "全飲品 85 折", image: "images/partner-starbucks-hero.png" },
    { id: "nike", title: "Nike", offer: "指定商品 9 折", image: "images/partner-nike-hero.png" },
    { id: "gu", title: "GU", offer: "全館商品 95 折", image: "images/partner-gu.png" },
    { id: "uniqlo", title: "UNIQLO", offer: "全館商品 95 折", image: "images/partner-uniqlo-product.png" },
    { id: "mcdonalds", title: "麥當勞", offer: "指定套餐優惠", image: "images/麥當勞拷貝.png" },
    { id: "cosmed", title: "康是美", offer: "指定商品優惠", image: "images/partner-cosmed-hero.png" },
    { id: "formosa", title: "鬍鬚張", offer: "指定套餐 9 折", image: "images/鬍鬚張拷貝.png" },
    { id: "net", title: "NET", offer: "指定商品 9 折", image: "images/partner-net-hero.png" },
    { id: "movie", title: "員工電影票", offer: "每月票券優惠", image: "images/partner-movie-ticket.png" }
  ];

  const titleToId = Object.fromEntries(partners.map(item => [item.title, item.id]));
  const carousel = document.getElementById("hubPartnerCarousel");
  let startIndex = 0;

  function showView(viewId) {
    if (typeof window.WohoursShowEmployeeView === "function") {
      window.WohoursShowEmployeeView(viewId);
      return;
    }
    document.querySelectorAll(".employee-view").forEach(view => {
      const active = view.id === viewId;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", active ? "false" : "true");
    });
    document.querySelector(".employee-main")?.classList.toggle("is-detail", viewId !== "hubView");
  }

  function partnerIdFromCard(card) {
    const datasetValues = [
      card.dataset.partner,
      card.dataset.fixedPartner,
      card.dataset.finalPartner,
      card.dataset.partnerIdFinal,
      card.dataset.empPartner
    ];
    const found = datasetValues.find(value => value && partners.some(item => item.id === value));
    if (found) return found;
    const title = card.querySelector("strong")?.textContent?.trim();
    return titleToId[title] || "";
  }

  function findPartnerCard(partnerId) {
    return [...document.querySelectorAll("#partnersView .partner-directory button")]
      .find(card => partnerIdFromCard(card) === partnerId);
  }

  function openPartner(partnerId) {
    if (!partnerId) return;
    showView("partnersView");
    requestAnimationFrame(() => {
      const card = findPartnerCard(partnerId);
      if (card) {
        card.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      }
    });
  }

  function renderCarousel() {
    if (!carousel) return;
    const cards = [...carousel.querySelectorAll("button")];
    cards.forEach((button, index) => {
      const partner = partners[(startIndex + index) % partners.length];
      const image = button.querySelector("img");
      const title = button.querySelector("span");
      const offer = button.querySelector("b");
      button.dataset.homePartner = partner.id;
      if (image) {
        image.src = partner.image;
        image.alt = partner.title;
      }
      if (title) title.textContent = partner.title;
      if (offer) offer.textContent = partner.offer;
    });
  }

  carousel?.addEventListener("click", event => {
    const card = event.target.closest("[data-home-partner]");
    if (!card) return;
    event.preventDefault();
    openPartner(card.dataset.homePartner);
  });

  renderCarousel();
  if (carousel) {
    window.setInterval(() => {
      startIndex = (startIndex + 3) % partners.length;
      renderCarousel();
    }, 1000 * 7);
  }

  const pendingPartner = localStorage.getItem("wohours.pendingPartner");
  if (pendingPartner) {
    localStorage.removeItem("wohours.pendingPartner");
    window.setTimeout(() => openPartner(pendingPartner), 120);
  }
})();

/* ===============================
   常駐福利詳情與繳交時段
   =============================== */
(() => {
  const benefitData = {
    traffic: {
      title: "交通補助",
      dept: "人資部",
      content: "補助員工每月通勤與外勤交通支出，依出勤紀錄、外勤紀錄與有效單據核發。",
      docs: ["員工工號", "當月交通票證或電子發票", "外勤申請單或出勤紀錄截圖", "本人薪轉帳戶資料"],
      note: "每月 25 日前送件，逾期併入下月審核。"
    },
    phone: {
      title: "通訊補助",
      dept: "行政部",
      content: "提供業務、值班與需公務通訊同仁每月手機通話與網路費補助。",
      docs: ["員工工號", "當月電信帳單", "主管核准紀錄", "公務通訊用途說明"],
      note: "帳單姓名需與員工本人一致，若為家人門號需附關係證明。"
    },
    health: {
      title: "健康檢查",
      dept: "人資部",
      content: "年度健檢採公司全額補助，可於健康檢查頁查詢資格、預約院所與時段。",
      docs: ["員工工號", "健保卡", "身分證件", "預約成功畫面"],
      note: "若需更改時段，請於檢查前 24 小時於系統更新。"
    },
    insurance: {
      title: "健保補給",
      dept: "人資部",
      content: "協助健保異動、眷屬加退保、補充保費資料確認與自付額補助申請。",
      docs: ["員工工號", "健保卡影本", "眷屬身分證明文件", "戶口名簿或關係證明"],
      note: "眷屬加保需於生效日前 5 個工作天提出。"
    },
    parenting: {
      title: "育嬰補給",
      dept: "人資部",
      content: "提供育嬰留停、托育補助、復職安排與相關津貼申請諮詢。",
      docs: ["員工工號", "子女出生證明", "托育或保母收據", "育嬰留停申請書"],
      note: "托育補助採月結審核，請保留完整收據。"
    },
    learning: {
      title: "進修補助",
      dept: "財務部",
      content: "補助與職務相關課程、證照考試、語言學習與專業研習費用。",
      docs: ["員工工號", "課程或考試簡章", "付款證明", "完課證明或成績單", "主管核准紀錄"],
      note: "需先申請核准，再於完課後檢附憑證核銷。"
    },
    meal: {
      title: "餐飲補助",
      dept: "行政部",
      content: "符合加班、特殊班別或支援任務者，可申請餐費補助。",
      docs: ["員工工號", "加班或支援紀錄", "餐費發票或收據", "主管確認紀錄"],
      note: "同日同餐別不可重複申請。"
    },
    equipment: {
      title: "設備補助",
      dept: "資訊部",
      content: "補助工作必要設備與人體工學器材，例如鍵盤、滑鼠、螢幕支架與筆電周邊。",
      docs: ["員工工號", "設備需求說明", "主管核准紀錄", "採購估價或發票"],
      note: "資訊部會先確認是否有庫存設備可調撥。"
    }
  };

  const deptShiftMap = {
    人資部: "早班 09:00 - 18:00",
    行政部: "早班 09:00 - 18:00",
    財務部: "早班 09:00 - 18:00",
    資訊部: "早班 09:00 - 18:00"
  };
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function upcomingSubmitTimes(dept) {
    const now = new Date();
    const items = [];
    for (let offset = 0; items.length < 3 && offset < 10; offset += 1) {
      const day = new Date(now);
      day.setDate(now.getDate() + offset);
      if (day.getDay() === 0 || day.getDay() === 6) continue;
      const dateText = `${pad(day.getMonth() + 1)}/${pad(day.getDate())}（${weekdays[day.getDay()]}）`;
      const shift = deptShiftMap[dept] || "早班 09:00 - 18:00";
      items.push(`${dateText} ${shift}，建議 10:00 - 12:00 或 14:00 - 17:00 送至${dept}`);
    }
    return items;
  }

  function ensureBenefitModal() {
    let modal = document.getElementById("regularBenefitDetailModal");
    if (modal) return modal;
    modal = document.createElement("section");
    modal.id = "regularBenefitDetailModal";
    modal.className = "regular-benefit-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="regular-benefit-backdrop" data-close-benefit-detail></div>
      <article class="regular-benefit-dialog" role="dialog" aria-modal="true">
        <button class="regular-benefit-close" type="button" data-close-benefit-detail>×</button>
        <small>BENEFIT DETAIL</small>
        <h2 id="regularBenefitTitle">福利詳情</h2>
        <p id="regularBenefitContent"></p>
        <div class="regular-benefit-columns">
          <section>
            <h3>需準備資料</h3>
            <ul id="regularBenefitDocs"></ul>
          </section>
          <section>
            <h3>繳交時段</h3>
            <ul id="regularBenefitTimes"></ul>
          </section>
        </div>
        <p class="regular-benefit-note" id="regularBenefitNote"></p>
      </article>
    `;
    (document.querySelector(".employee-screen") || document.body).appendChild(modal);
    modal.addEventListener("click", event => {
      if (!event.target.closest("[data-close-benefit-detail]")) return;
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    });
    return modal;
  }

  function openBenefitDetail(id) {
    const data = benefitData[id];
    if (!data) return;
    const modal = ensureBenefitModal();
    modal.querySelector("#regularBenefitTitle").textContent = `${data.title}｜${data.dept}申請`;
    modal.querySelector("#regularBenefitContent").textContent = data.content;
    modal.querySelector("#regularBenefitDocs").innerHTML = data.docs.map(item => `<li>${item}</li>`).join("");
    modal.querySelector("#regularBenefitTimes").innerHTML = upcomingSubmitTimes(data.dept).map(item => `<li>${item}</li>`).join("");
    modal.querySelector("#regularBenefitNote").textContent = data.note;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-benefit-detail]");
    if (!button) return;
    event.preventDefault();
    openBenefitDetail(button.dataset.benefitDetail);
  });
})();
