(() => {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const timeEl = document.getElementById("scheduleTime");
  const dateEl = document.getElementById("scheduleDate");
  const todayText = document.getElementById("todayText");
  const employeeInput = document.getElementById("employeeShiftId");
  const queryButton = document.getElementById("queryShiftButton");
  const queryResult = document.getElementById("queryResult");
  const filter = document.getElementById("departmentFilter");
  const tableBody = document.getElementById("shiftTableBody");
  const showMoreButton = document.getElementById("showMoreRows");
  const screen = document.querySelector(".schedule-screen");
  const scheduleNavButtons = document.querySelectorAll("[data-view]");
  const schedulePanels = document.querySelectorAll("[data-view-panel]");
  const scheduleViewButtons = document.querySelectorAll("[data-view-button]");
  const scheduleScroll = document.querySelector(".schedule-scroll");
  const scheduleBackView = document.getElementById("scheduleBackView");
  const authInputs = document.querySelectorAll(".employee-auth-input");
  const faceButtons = document.querySelectorAll(".face-verify-button");
  const demoSubmitButtons = document.querySelectorAll(".demo-submit");
  const modalCloseButtons = document.querySelectorAll(".modal-close");
  const textareas = document.querySelectorAll("textarea[maxlength]");
  


  const rows = [
    { date: "07/07（二）", dept: "行政部", shift: "早班", time: "09:00 – 18:00", note: "—" },
    { date: "07/07（二）", dept: "客服部", shift: "中班", time: "12:00 – 21:00", note: "—" },
    { date: "07/07（二）", dept: "門市部", shift: "晚班", time: "15:00 – 24:00", note: "—" },
    { date: "07/07（二）", dept: "倉儲部", shift: "早班", time: "09:00 – 18:00", note: "支援早班" },
    { date: "07/07（二）", dept: "財務部", shift: "早班", time: "09:00 – 18:00", note: "—" },
    { date: "07/08（三）", dept: "客服部", shift: "中班", time: "12:00 – 21:00", note: "異動" },
    { date: "07/08（三）", dept: "門市部", shift: "早班", time: "09:00 – 18:00", note: "—" },
    { date: "07/09（四）", dept: "行政部", shift: "早班", time: "09:00 – 18:00", note: "—" }
  ];

  const personalWeekDates = [
    { label: "07/14（一）", value: "2026-07-14" },
    { label: "07/15（二）", value: "2026-07-15" },
    { label: "07/16（三）", value: "2026-07-16" },
    { label: "07/17（四）", value: "2026-07-17" },
    { label: "07/18（五）", value: "2026-07-18" },
    { label: "07/19（六）", value: "2026-07-19" },
    { label: "07/20（日）", value: "2026-07-20" }
  ];

  const shiftInfo = {
    "早班": { time: "09:00 - 18:00", note: "—" },
    "中班": { time: "12:00 - 21:00", note: "—" },
    "晚班": { time: "15:00 - 24:00", note: "—" },
    "休息": { time: "—", note: "休息" }
  };

  let expanded = false;
  let toastTimer = null;
  let activeViewName = "weekly";
  const viewHistory = [];

  function fitSchedule() {
    window.fitKioskCanvas?.();
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateClock() {
    const now = new Date();
    const date = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}（${weekdays[now.getDay()]}）`;
    timeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    dateEl.textContent = date;
    todayText.textContent = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}（${weekdays[now.getDay()]}）`;
  }

  function renderTable() {
    const dept = filter.value;
    const filtered = rows.filter(row => dept === "all" || row.dept === dept);
    const visibleRows = expanded ? filtered : filtered.slice(0, 5);
    tableBody.innerHTML = visibleRows.map(row => `
      <tr>
        <td>${row.date}</td>
        <td>${row.dept}</td>
        <td>${row.shift}</td>
        <td>${row.time}</td>
        <td>${row.note}</td>
      </tr>
    `).join("");
    showMoreButton.hidden = filtered.length <= 5;
    showMoreButton.textContent = expanded ? "收合⌃" : "顯示更多⌄";
  }
  function showScheduleView(viewName, options = {}) {
    if (viewName === activeViewName) return;
    if (!options.fromBack && activeViewName) {
      viewHistory.push(activeViewName);
    }
    activeViewName = viewName;

    schedulePanels.forEach(panel => {
      const active = panel.dataset.viewPanel === viewName;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
      if (active && viewName === "leave") {
        panel.classList.remove("is-modal-closed");
      }
    });

    scheduleNavButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.view === viewName);
    });

    if (scheduleBackView) {
      scheduleBackView.hidden = viewHistory.length === 0;
    }

    if (scheduleScroll) {
      scheduleScroll.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  function toast(message) {
    let node = document.querySelector(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      screen.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
  }

  function getEmployeeWeek(employee) {
    const week = employee?.schedule?.week || [];
    return personalWeekDates.map((day, index) => {
      const shift = week[index] || "休息";
      const info = shiftInfo[shift] || shiftInfo["休息"];
      return {
        ...day,
        shift,
        time: info.time,
        location: shift === "休息" ? "休息" : employee.dept,
        note: shift === "休息" ? "—" : (index === 2 ? "支援早班" : info.note)
      };
    });
  }

  function personalScheduleTable(employee, { selectable = false, target = "" } = {}) {
    const days = getEmployeeWeek(employee);
    const cell = (day) => selectable && day.shift !== "休息"
      ? `<button class="schedule-select-cell" type="button" data-schedule-pick="${target}" data-date="${day.value}" data-label="${day.label}" data-shift="${day.shift}" data-time="${day.time}"><span>□</span>${day.shift}</button>`
      : `<span class="${day.shift === "休息" ? "" : "brown-text"}">${day.shift}</span>`;
    return `
      <section class="personal-schedule-result">
        <div class="personal-schedule-head">
          <strong>${employee.name} 的個人班表</strong>
          <span>${employee.id}｜${employee.dept}｜${employee.role}</span>
        </div>
        <table class="weekly-pre-table personal-week-table">
          <tbody>
            <tr><th>日期</th>${days.map((day) => `<th>${day.label}</th>`).join("")}</tr>
            <tr><th>班別</th>${days.map((day) => `<td>${cell(day)}</td>`).join("")}</tr>
            <tr><th>時間</th>${days.map((day) => `<td>${day.time}</td>`).join("")}</tr>
            <tr><th>地點</th>${days.map((day) => `<td>${day.location}</td>`).join("")}</tr>
            <tr><th>備註</th>${days.map((day) => `<td>${day.note}</td>`).join("")}</tr>
          </tbody>
        </table>
        ${selectable ? `<p class="selection-hint">請勾選要交換的日期，再從下方班別欄位確認時段。</p>` : ""}
      </section>
    `;
  }

  function ensureResultAfter(anchor, className) {
    let node = anchor?.nextElementSibling;
    if (!node || !node.classList.contains(className)) {
      node = document.createElement("div");
      node.className = className;
      anchor?.insertAdjacentElement("afterend", node);
    }
    return node;
  }

  function renderPersonalSchedule(anchor, employee, options = {}) {
    const result = ensureResultAfter(anchor, options.wrapperClass || "query-schedule-output");
    result.innerHTML = personalScheduleTable(employee, options);
    result.querySelectorAll("[data-schedule-pick]").forEach((button) => {
      button.addEventListener("click", () => pickScheduleSlot(button));
    });
    return result;
  }

  function setDateInputValue(input, value) {
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setSelectToShift(select, shift, time) {
    if (!select) return;
    const normalized = `${shift}　${time}`;
    const option = [...select.options].find((item) => item.textContent.includes(shift)) || select.options[0];
    if (option) {
      select.value = option.value;
      option.textContent = normalized;
    }
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function pickScheduleSlot(button) {
    const target = button.dataset.schedulePick;
    const view = button.closest(".schedule-view");
    view?.querySelectorAll(`[data-schedule-pick="${target}"]`).forEach((item) => {
      item.classList.remove("selected");
      item.querySelector("span").textContent = "□";
    });
    button.classList.add("selected");
    button.querySelector("span").textContent = "✓";

    const swapPairs = [...document.querySelectorAll('[data-view-panel="swap"] .swap-pair')];
    if (target === "self") {
      const fields = swapPairs[0]?.querySelectorAll("div");
      setDateInputValue(fields?.[0]?.querySelector("input"), button.dataset.date);
      setSelectToShift(fields?.[0]?.querySelector("select"), button.dataset.shift, button.dataset.time);
    }
    if (target === "partner") {
      const fields = swapPairs[1]?.querySelectorAll("div");
      setDateInputValue(fields?.[0]?.querySelector("input"), button.dataset.date);
      setSelectToShift(fields?.[0]?.querySelector("select"), button.dataset.shift, button.dataset.time);
      const myFields = swapPairs[0]?.querySelectorAll("div");
      setDateInputValue(fields?.[1]?.querySelector("input"), myFields?.[0]?.querySelector("input")?.value || "");
      fields?.[1]?.querySelector("select") && setSelectToShift(fields[1].querySelector("select"), myFields?.[0]?.querySelector("select")?.textContent?.trim() || "中班", "");
    }
    toast("已帶入選取的班表日期與時段");
  }

  function ensureSubmitModal() {
    let modal = document.getElementById("scheduleSubmitModal");
    if (modal) return modal;
    modal = document.createElement("section");
    modal.id = "scheduleSubmitModal";
    modal.className = "schedule-submit-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="submit-modal-backdrop"></div>
      <article class="submit-modal-card" role="dialog" aria-modal="true">
        <div class="submit-check">✓</div>
        <small>REQUEST SENT</small>
        <h2>申請已送出</h2>
        <p id="scheduleSubmitText">已送出申請，狀態：待主管審核。</p>
        <button type="button" id="scheduleSubmitClose">完成</button>
      </article>
    `;
    screen.appendChild(modal);
    modal.querySelector("#scheduleSubmitClose").addEventListener("click", () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    });
    return modal;
  }

  function showSubmitModal(message) {
    const modal = ensureSubmitModal();
    modal.querySelector("#scheduleSubmitText").textContent = message;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }, 2800);
  }

  function shake(element) {
    element?.animate?.([
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(0)" }
    ], { duration: 220, easing: "ease-out" });
  }

  function normalizeEmployeeInput(input) {
    input.value = input.value.replace(/\D/g, "").slice(0, 8);
  }

  function getAuthArea(node) {
    return node.closest(".identity-strip, .query-card, .swap-card, .schedule-view");
  }

  let scheduleFaceStream = null;
  let scheduleFaceTimer = null;

  function stopScheduleFaceCamera() {
    window.clearTimeout(scheduleFaceTimer);
    scheduleFaceTimer = null;
    if (scheduleFaceStream) {
      scheduleFaceStream.getTracks().forEach(track => track.stop());
      scheduleFaceStream = null;
    }
    const video = document.getElementById("scheduleFaceVideo");
    if (video) video.srcObject = null;
  }

  function ensureFaceModal() {
    let modal = document.getElementById("scheduleFaceModal");
    if (modal) return modal;
    modal = document.createElement("section");
    modal.id = "scheduleFaceModal";
    modal.className = "schedule-face-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="schedule-face-backdrop" data-face-close></div>
      <article class="schedule-face-card" role="dialog" aria-modal="true">
        <button class="schedule-face-close" type="button" data-face-close>×</button>
        <small>FACE CHECK</small>
        <h2>人臉辨識</h2>
        <p id="scheduleFaceHint">請允許相機，並將臉部置於框線中央。</p>
        <div class="schedule-face-camera">
          <video id="scheduleFaceVideo" autoplay playsinline muted></video>
          <span class="schedule-face-frame"><i></i><i></i><i></i><i></i></span>
        </div>
        <div class="schedule-face-actions">
          <button type="button" data-face-close>返回</button>
          <button type="button" id="scheduleFaceConfirm">辨識完成</button>
        </div>
      </article>
    `;
    screen.appendChild(modal);
    modal.querySelectorAll("[data-face-close]").forEach(button => {
      button.addEventListener("click", () => {
        stopScheduleFaceCamera();
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
      });
    });
    return modal;
  }

  async function startScheduleFaceCamera() {
    const video = document.getElementById("scheduleFaceVideo");
    const hint = document.getElementById("scheduleFaceHint");
    if (!navigator.mediaDevices?.getUserMedia || !video) {
      if (hint) hint.textContent = "此瀏覽器不支援相機，仍可按下辨識完成繼續 demo 流程。";
      return;
    }
    try {
      stopScheduleFaceCamera();
      if (hint) hint.textContent = "正在開啟相機，請允許瀏覽器使用攝影機。";
      scheduleFaceStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      video.srcObject = scheduleFaceStream;
      await video.play().catch(() => {});
      if (hint) hint.textContent = "請將臉部置於框線中央，確認清楚後按辨識完成。";
    } catch (error) {
      console.warn("排班公告相機開啟失敗", error);
      if (hint) hint.textContent = "相機權限尚未開啟，仍可按下辨識完成繼續 demo 流程。";
    }
  }

  function completeFaceVerification(button, employee) {
    const area = getAuthArea(button);
    const status = area?.querySelector(".auth-status");
    if (status) {
      status.textContent = `${employee.name}（${employee.dept}）已完成工號與人臉辨識`;
      status.classList.add("verified");
    }
    button.textContent = "已完成辨識";
    if (button.closest('[data-view-panel="swap"]')) {
      renderPersonalSchedule(button.closest(".swap-card"), employee, {
        selectable: true,
        target: "self",
        wrapperClass: "swap-schedule-output"
      });
    }
    toast("身分驗證完成");
  }

  function openFaceModal(button, employee) {
    const modal = ensureFaceModal();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    const confirm = modal.querySelector("#scheduleFaceConfirm");
    const finish = () => {
      stopScheduleFaceCamera();
      confirm.disabled = false;
      confirm.textContent = "辨識完成";
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      completeFaceVerification(button, employee);
    };
    confirm.disabled = true;
    confirm.textContent = "辨識中";
    confirm.onclick = finish;
    startScheduleFaceCamera().finally(() => {
      scheduleFaceTimer = window.setTimeout(finish, 3000);
    });
  }

  function verifyFace(button) {
    const area = getAuthArea(button);
    const input = area?.querySelector(".employee-auth-input");
    const status = area?.querySelector(".auth-status");
    const value = input?.value.trim() || "";

    if (!/^\d{4,8}$/.test(value)) {
      if (status) {
        status.textContent = "請先輸入 4 到 8 位數字工號";
        status.classList.remove("verified");
      }
      input?.focus();
      shake(input || button);
      return false;
    }

    const employee = window.MockEmployees?.find(value);
    if (!employee) {
      if (status) {
        status.textContent = "查無此員工工號，請重新輸入";
        status.classList.remove("verified");
      }
      input?.focus();
      shake(input || button);
      return false;
    }

    openFaceModal(button, employee);
    return true;
  }

  function requiresAuth(button) {
    const view = button.closest(".schedule-view");
    return Boolean(view?.querySelector(".identity-strip"));
  }

  function submitDemo(button) {
    const view = button.closest(".schedule-view");
    if (requiresAuth(button)) {
      const verified = view.querySelector(".auth-status.verified");
      const firstAuthButton = view.querySelector(".face-verify-button");
      if (!verified) {
        toast("請先輸入員工工號並完成人臉辨識");
        shake(firstAuthButton);
        return;
      }
      const employeeId = view.querySelector(".employee-auth-input")?.value.trim();
      if (employeeId) {
        window.MockEmployees?.update(employeeId, employee => ({
          scheduleRequests: [
            {
              type: view.querySelector("h1")?.textContent?.trim() || "排班申請",
              status: "待主管審核",
              time: new Date().toLocaleString("zh-TW", { hour12: false })
            },
            ...(employee.scheduleRequests || [])
          ].slice(0, 10)
        }));
      }
    }
    showSubmitModal("已送出申請，狀態：待主管審核。");
  }

  employeeInput?.addEventListener("input", () => {
    employeeInput.value = employeeInput.value.replace(/\D/g, "").slice(0, 8);
    queryResult.textContent = "";
  });

  queryButton?.addEventListener("click", () => {
    const value = employeeInput.value.trim();
    if (!/^\d{4,8}$/.test(value)) {
      queryResult.textContent = "請輸入 4 到 8 位數字工號";
      employeeInput.focus();
      shake(employeeInput);
      return;
    }
    const employee = window.MockEmployees?.find(value);
    if (!employee) {
      queryResult.textContent = "查無此員工工號，請重新輸入";
      shake(employeeInput);
      return;
    }
    queryResult.textContent = `${employee.name}：今日 ${employee.schedule.today}，下次 ${employee.schedule.next}。`;
    renderPersonalSchedule(document.querySelector(".summary-grid"), employee, {
      wrapperClass: "weekly-personal-output"
    });
    toast("已查詢個人班表");
  });

  filter?.addEventListener("change", () => {
    expanded = false;
    renderTable();
  });

  showMoreButton?.addEventListener("click", () => {
    expanded = !expanded;
    renderTable();
  });
  scheduleNavButtons.forEach(button => {
    button.addEventListener("click", () => {
      showScheduleView(button.dataset.view);
    });
  });

  scheduleViewButtons.forEach(button => {
    button.addEventListener("click", () => {
      showScheduleView(button.dataset.viewButton);
    });
  });

  scheduleBackView?.addEventListener("click", () => {
    const previous = viewHistory.pop() || "weekly";
    showScheduleView(previous, { fromBack: true });
  });

  faceButtons.forEach(button => {
    button.dataset.authLabel = button.textContent.trim();
  });

  authInputs.forEach(input => {
    input.addEventListener("input", () => {
      normalizeEmployeeInput(input);
      const area = getAuthArea(input);
      const status = area?.querySelector(".auth-status");
      const button = area?.querySelector(".face-verify-button");
      status?.classList.remove("verified");
      if (status) status.textContent = input.value ? "工號已輸入，請進行人臉辨識" : "尚未完成身分驗證";
      if (button) button.textContent = button.dataset.authLabel || "人臉辨識";
    });
  });

  faceButtons.forEach(button => {
    button.addEventListener("click", () => verifyFace(button));
  });

  demoSubmitButtons.forEach(button => {
    button.addEventListener("click", () => submitDemo(button));
  });

  document.querySelector('[data-view-panel="swap"] .partner-search button')?.addEventListener("click", (event) => {
    const search = event.currentTarget.closest(".partner-search");
    const value = search?.querySelector("input")?.value.trim() || "";
    const employee = /^\d+$/.test(value)
      ? window.MockEmployees?.find(value)
      : window.MockEmployees?.all?.().find((item) => item.name.includes(value));
    if (!employee) {
      toast("查無換班對象，請輸入 1111 - 1120 或員工姓名");
      shake(search?.querySelector("input"));
      return;
    }
    renderPersonalSchedule(search, employee, {
      selectable: true,
      target: "partner",
      wrapperClass: "swap-schedule-output"
    });
    toast(`已載入 ${employee.name} 的個人班表`);
  });

  document.querySelectorAll(".form-reset-button").forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.closest(".panel, .swap-layout, .schedule-view");
      panel?.querySelectorAll("input").forEach(input => {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      panel?.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      panel?.querySelectorAll("textarea").forEach(textarea => {
        textarea.value = "";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      });
      panel?.querySelectorAll(".auth-status").forEach(status => {
        status.classList.remove("verified");
        status.textContent = "尚未完成身分驗證";
      });
      panel?.querySelectorAll(".swap-schedule-output, .query-schedule-output").forEach(node => node.remove());
      toast("已清空表單，可重新填寫");
    });
  });

  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.addEventListener("pointerdown", () => {
      try {
        input.showPicker?.();
      } catch (_) {
        /* Native date inputs still open normally on click when showPicker is blocked. */
      }
    });
  });

  modalCloseButtons.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".leave-view")?.classList.add("is-modal-closed");
      toast("已關閉請假提醒");
    });
  });

  textareas.forEach(textarea => {
    const counter = textarea.parentElement?.querySelector("small");
    const updateCounter = () => {
      if (counter) counter.textContent = `${textarea.value.length}/${textarea.maxLength}`;
    };
    textarea.addEventListener("input", updateCounter);
    updateCounter();
  });

  document.querySelectorAll(".apply-type-card button:not([data-view-button])").forEach(button => {
    button.addEventListener("click", () => {
      toast(`已帶入「${button.firstChild.textContent.trim()}」申請類型`);
    });
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || button === queryButton || button === showMoreButton) return;
    button.animate?.([
      { transform: "scale(1)" },
      { transform: "scale(.985)" },
      { transform: "scale(1)" }
    ], { duration: 160, easing: "ease-out" });
  });

  fitSchedule();
  updateClock();
  renderTable();
  window.setInterval(updateClock, 1000 * 20);
  window.addEventListener("resize", fitSchedule);
})();
