(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];

  const healthTime = document.getElementById("healthTime");
  const healthDate = document.getElementById("healthDate");

  const healthEmployeeId = document.getElementById("healthEmployeeId");
  const healthEmployeeQuery = document.getElementById("healthEmployeeQuery");
  const healthEmployeeResult = document.getElementById("healthEmployeeResult");

  const healthStatus = document.getElementById("healthStatus");
  const healthReserveBadge = document.getElementById("healthReserveBadge");
  const healthReserveBtn = document.getElementById("healthReserveBtn");
  const healthYearText = document.getElementById("healthYearText");
  const healthYearMeta = document.getElementById("healthYearMeta");
  const healthHospitalMeta = document.getElementById("healthHospitalMeta");
  const healthSubsidyMeta = document.getElementById("healthSubsidyMeta");
  const healthDeadlineMeta = document.getElementById("healthDeadlineMeta");

  const healthSlots = document.getElementById("healthSlots");
  const slotTitleText = document.getElementById("slotTitleText");
  const slotList = document.getElementById("slotList");

  const bookingModal = document.getElementById("bookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const bookingPrev = document.getElementById("bookingPrev");
  const bookingNext = document.getElementById("bookingNext");
  const bookingStepTabs = [...document.querySelectorAll("[data-step-tab]")];
  const bookingSteps = [...document.querySelectorAll("[data-step]")];
  const bookingSlotSelect = document.getElementById("bookingSlotSelect");
  const modalSlotList = document.getElementById("modalSlotList");
  const bookingConfirmText = document.getElementById("bookingConfirmText");
  const bookingValidation = document.getElementById("bookingValidation");

  const touchKeyboard = document.getElementById("touchKeyboard");
  const keyboardTitle = document.getElementById("keyboardTitle");
  const keyboardKeys = document.getElementById("keyboardKeys");
  const candidateRow = document.getElementById("candidateRow");
  const zhuyinCompose = document.getElementById("zhuyinCompose");
  const keyboardModeBtns = [...document.querySelectorAll("[data-kb-mode]")];

  const availableSlots = [
    { id: "s1", date: "07 / 15（三）", time: "09:00 - 11:00", raw: "2026/07/15（三）09:00 - 11:00", left: 3 },
    { id: "s2", date: "07 / 18（六）", time: "13:30 - 15:30", raw: "2026/07/18（六）13:30 - 15:30", left: 5 },
    { id: "s3", date: "07 / 22（三）", time: "10:00 - 12:00", raw: "2026/07/22（三）10:00 - 12:00", left: 2 }
  ];

  const employeeHealth = {
    "1111": {
      id: "1111", name: "王小美", gender: "女性", birthday: "1998/05/12",
      idno: "A123456789", phone: "0912345678", email: "wang@example.com",
      dept: "行政部", title: "行政專員",
      status: "尚未預約", booked: false, slot: "",
      year: "2026", hospital: "XX 健康管理中心", subsidy: "公司全額補助", deadline: "2026 / 12 / 31"
    },
    "1112": {
      id: "1112", name: "李佳穎", gender: "女性", birthday: "1997/08/21",
      idno: "B223456789", phone: "0922333444", email: "lee@example.com",
      dept: "行政部", title: "行政助理",
      status: "已預約", booked: true, slot: "2026/07/18（六）13:30 - 15:30",
      year: "2026", hospital: "XX 健康管理中心", subsidy: "公司全額補助", deadline: "2026 / 12 / 31"
    },
    "1113": {
      id: "1113", name: "陳冠宇", gender: "男性", birthday: "1996/03/08",
      idno: "C123456789", phone: "0933555666", email: "chen@example.com",
      dept: "資訊部", title: "工程師",
      status: "尚未預約", booked: false, slot: "",
      year: "2026", hospital: "XX 健康管理中心", subsidy: "公司全額補助", deadline: "2026 / 12 / 31"
    },
    "1114": {
      id: "1114", name: "林怡君", gender: "女性", birthday: "1995/11/30",
      idno: "D223456789", phone: "0955777888", email: "lin@example.com",
      dept: "人資部", title: "人資專員",
      status: "已預約", booked: true, slot: "2026/07/22（三）10:00 - 12:00",
      year: "2026", hospital: "XX 健康管理中心", subsidy: "公司全額補助", deadline: "2026 / 12 / 31"
    }
  };

  let currentEmployee = null;
  let currentStep = 0;

  let keyboardTarget = null;
  let keyboardMode = "english";
  let zhuyinBuffer = "";
  let shiftOnce = false;
  let capsLock = false;
  let touchStartKey = null;
  let keyPreview = null;
  let longPressTimer = null;
  let longPressed = false;
  let spaceDragStartX = 0;
  let spaceDragStartCursor = 0;
  let spaceDragging = false;

  const initials = new Set("ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ".split(""));
  const medials = new Set(["ㄧ", "ㄨ", "ㄩ"]);
  const finals = new Set(["ㄚ", "ㄛ", "ㄜ", "ㄝ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄢ", "ㄣ", "ㄤ", "ㄥ", "ㄦ"]);
  const toneKeys = { "2": "ˊ", "3": "ˇ", "4": "ˋ", "6": "ˊ", "7": "˙" };

  // 注音鍵盤：只顯示注音，不顯示英文/數字/多餘功能鍵
  const zhuyinKeyboardLayout = [
    [
      { en: "1", zh: "ㄅ", num: "1" },
      { en: "2", zh: "ㄉ", num: "2" },
      { en: "3", zh: "ˇ", num: "3", tone: "ˇ" },
      { en: "4", zh: "ˋ", num: "4", tone: "ˋ" },
      { en: "5", zh: "ㄓ", num: "5" },
      { en: "6", zh: "ˊ", num: "6", tone: "ˊ" },
      { en: "7", zh: "˙", num: "7", tone: "˙" },
      { en: "8", zh: "ㄚ", num: "8" },
      { en: "9", zh: "ㄞ", num: "9" },
      { en: "0", zh: "ㄢ", num: "0" },
      { en: "-", zh: "ㄦ", num: "-" },
      { action: "backspace", label: "⌫", special: true }
    ],
    [
      { en: "q", zh: "ㄆ" },
      { en: "w", zh: "ㄊ" },
      { en: "e", zh: "ㄍ" },
      { en: "r", zh: "ㄐ" },
      { en: "t", zh: "ㄔ" },
      { en: "y", zh: "ㄗ" },
      { en: "u", zh: "ㄧ" },
      { en: "i", zh: "ㄛ" },
      { en: "o", zh: "ㄟ" },
      { en: "p", zh: "ㄣ" }
    ],
    [
      { en: "a", zh: "ㄇ" },
      { en: "s", zh: "ㄋ" },
      { en: "d", zh: "ㄎ" },
      { en: "f", zh: "ㄑ" },
      { en: "g", zh: "ㄕ" },
      { en: "h", zh: "ㄘ" },
      { en: "j", zh: "ㄨ" },
      { en: "k", zh: "ㄜ" },
      { en: "l", zh: "ㄠ" },
      { en: ";", zh: "ㄤ" }
    ],
    [
      { en: "z", zh: "ㄈ" },
      { en: "x", zh: "ㄌ" },
      { en: "c", zh: "ㄏ" },
      { en: "v", zh: "ㄒ" },
      { en: "b", zh: "ㄖ" },
      { en: "n", zh: "ㄙ" },
      { en: "m", zh: "ㄩ" },
      { en: ",", zh: "ㄝ" },
      { en: ".", zh: "ㄡ" },
      { en: "/", zh: "ㄥ" }
    ],
    [
      { action: "toggleLang", label: "中/英", special: true },
      { action: "space", label: "空白｜一聲", special: true, space: true },
      { action: "done", label: "完成", special: true }
    ]
  ];

  // 英文鍵盤：只保留會用到的數字與英文字母，不放特殊符號、tab、fn、control、option、command
  const englishKeyboardLayout = [
    [
      { en: "1", shift: "1", zh: "", num: "1" },
      { en: "2", shift: "2", zh: "", num: "2" },
      { en: "3", shift: "3", zh: "", num: "3" },
      { en: "4", shift: "4", zh: "", num: "4" },
      { en: "5", shift: "5", zh: "", num: "5" },
      { en: "6", shift: "6", zh: "", num: "6" },
      { en: "7", shift: "7", zh: "", num: "7" },
      { en: "8", shift: "8", zh: "", num: "8" },
      { en: "9", shift: "9", zh: "", num: "9" },
      { en: "0", shift: "0", zh: "", num: "0" },
      { action: "backspace", label: "⌫", special: true }
    ],
    [
      { en: "q", shift: "Q", zh: "" },
      { en: "w", shift: "W", zh: "" },
      { en: "e", shift: "E", zh: "" },
      { en: "r", shift: "R", zh: "" },
      { en: "t", shift: "T", zh: "" },
      { en: "y", shift: "Y", zh: "" },
      { en: "u", shift: "U", zh: "" },
      { en: "i", shift: "I", zh: "" },
      { en: "o", shift: "O", zh: "" },
      { en: "p", shift: "P", zh: "" }
    ],
    [
      { action: "caps", label: "Caps", special: true },
      { en: "a", shift: "A", zh: "" },
      { en: "s", shift: "S", zh: "" },
      { en: "d", shift: "D", zh: "" },
      { en: "f", shift: "F", zh: "" },
      { en: "g", shift: "G", zh: "" },
      { en: "h", shift: "H", zh: "" },
      { en: "j", shift: "J", zh: "" },
      { en: "k", shift: "K", zh: "" },
      { en: "l", shift: "L", zh: "" }
    ],
    [
      { en: "z", shift: "Z", zh: "" },
      { en: "x", shift: "X", zh: "" },
      { en: "c", shift: "C", zh: "" },
      { en: "v", shift: "V", zh: "" },
      { en: "b", shift: "B", zh: "" },
      { en: "n", shift: "N", zh: "" },
      { en: "m", shift: "M", zh: "" }
    ],
    [
      { action: "toggleLang", label: "中/英", special: true },
      { action: "space", label: "空白", special: true, space: true },
      { action: "done", label: "完成", special: true }
    ]
  ];

  function activeKeyboardLayout() {
    return keyboardMode === "english" ? englishKeyboardLayout : zhuyinKeyboardLayout;
  }

  function fitKiosk() { window.fitKioskCanvas?.(); }
  function pad(value) { return String(value).padStart(2, "0"); }

  function updateClock() {
    if (!healthTime || !healthDate) return;
    const now = new Date();
    healthTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    healthDate.textContent = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}（${weekdayShort[now.getDay()]}）`;
  }

  function normalizeSlotText(slot) {
    return String(slot || "")
      .replace(/^可預約\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function statusKind(status = "") {
    const text = String(status || "");
    if (/檢查完成|已完成/.test(text)) return "completed";
    if (/已預約|已經預約/.test(text)) return "booked";
    return "open";
  }

  function normalizedEmployeeFromMock(id) {
    const mock = window.MockEmployees?.find?.(id);
    if (!mock) return null;
    const health = mock.health || {};
    const kind = statusKind(health.status);
    const booking = health.booking || {};
    const slot = normalizeSlotText(booking.slot || health.slot || "");
    return {
      id: mock.id || id,
      name: booking.name || mock.name || "員工",
      gender: booking.gender || mock.gender || "",
      birthday: booking.birthday || mock.birthday || "",
      idno: booking.idno || mock.idno || "",
      phone: booking.phone || mock.phone || "",
      email: booking.email || mock.email || "",
      dept: mock.dept || "",
      title: mock.role || mock.title || mock.unit || "",
      status: kind === "completed" ? "檢查完成" : kind === "booked" ? "已預約" : "尚未預約",
      booked: kind === "booked",
      completed: kind === "completed",
      slot: kind === "booked" || kind === "completed" ? slot : "",
      year: health.year || "2026",
      hospital: booking.hospital || health.hospital || "XX 健康管理中心",
      subsidy: health.subsidy || "公司全額補助",
      deadline: health.deadline || "2026 / 12 / 31",
      booking
    };
  }

  function findEmployee(id) { return normalizedEmployeeFromMock(id) || employeeHealth[id]; }

  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = hidden;
    el.classList.toggle("health-hidden", hidden);
  }

  function setResultText(text) {
    if (healthEmployeeResult) healthEmployeeResult.textContent = text || "";
  }

  function renderStatus(employee) {
    if (!employee) return;

    setHidden(healthStatus, false);
    setHidden(healthSlots, false);
    setHidden(slotList, false);

    if (healthYearText) healthYearText.textContent = employee.year || "2026";
    if (healthYearMeta) healthYearMeta.textContent = employee.year || "2026";
    if (healthHospitalMeta) healthHospitalMeta.textContent = employee.hospital || "XX 健康管理中心";
    if (healthSubsidyMeta) healthSubsidyMeta.textContent = employee.subsidy || "公司全額補助";
    if (healthDeadlineMeta) healthDeadlineMeta.textContent = employee.deadline || "2026 / 12 / 31";

    if (employee.completed) {
      healthReserveBadge.textContent = "檢查完成";
      healthReserveBadge.classList.remove("is-booked", "is-open");
      healthReserveBadge.classList.add("is-completed");
      healthReserveBtn.textContent = "已完成";
      healthReserveBtn.disabled = true;
      healthReserveBtn.classList.add("is-disabled");
      slotTitleText.textContent = "已完成檢查";
      renderBookedSlot(employee, "已完成");
    } else if (employee.booked) {
      healthReserveBadge.textContent = "已經預約";
      healthReserveBadge.classList.remove("is-completed", "is-open");
      healthReserveBadge.classList.add("is-booked");
      healthReserveBtn.textContent = "更改預約資料";
      healthReserveBtn.disabled = false;
      healthReserveBtn.classList.remove("is-disabled");
      slotTitleText.textContent = "已預約時段";
      renderBookedSlot(employee);
    } else {
      healthReserveBadge.textContent = "尚未預約";
      healthReserveBadge.classList.remove("is-booked", "is-completed");
      healthReserveBadge.classList.add("is-open");
      healthReserveBtn.textContent = "立即預約";
      healthReserveBtn.disabled = false;
      healthReserveBtn.classList.remove("is-disabled");
      slotTitleText.textContent = "可預約時段";
      renderAvailableSlots();
    }

    const statusText = employee.completed ? "檢查完成" : employee.booked ? "已預約" : "尚未預約";
    setResultText(`${employee.id} ${employee.name}｜${employee.dept || "未填部門"}｜健檢狀態：${statusText}${employee.booked || employee.completed ? `｜${employee.slot}` : "｜可進行預約"}`);
  }

  function renderBookedSlot(employee, buttonText = "更改資料") {
    if (!slotList) return;
    const slot = normalizeSlotText(employee.slot);
    slotList.innerHTML = `
      <article class="slot-card booked-slot">
        <img src="images/日期.png" alt="">
        <strong>${slot?.split("）")[0] ? slot.split("）")[0] + "）" : "已預約"}</strong>
        <span>${slot?.includes("）") ? slot.split("）").slice(1).join("）").trim() : slot}</span>
        <mark>${employee.completed ? "已完成" : "已預約時段"}</mark>
        <button type="button" ${employee.completed ? "disabled" : "data-edit-booking"}>${buttonText}</button>
      </article>
    `;
    slotList.querySelector("[data-edit-booking]")?.addEventListener("click", () => openBookingModal());
  }

  function renderAvailableSlots() {
    if (!slotList) return;
    slotList.innerHTML = availableSlots.map(slot => `
      <article class="slot-card">
        <img src="images/日期.png" alt="">
        <strong>${slot.date}</strong>
        <span>${slot.time}</span>
        <mark>剩餘 ${slot.left} 位</mark>
        <button type="button" data-book-slot="${slot.id}">預約</button>
      </article>
    `).join("");

    slotList.querySelectorAll("[data-book-slot]").forEach(btn => {
      btn.addEventListener("click", () => openBookingModal(btn.dataset.bookSlot));
    });
  }

  function queryEmployee() {
    const id = (healthEmployeeId?.value || "").trim();
    const employee = findEmployee(id);

    if (id) hideKeyboard();

    if (!id) {
      setResultText("請先輸入員工工號。");
      healthEmployeeId?.focus();
      showKeyboardFor(healthEmployeeId, "english");
      return;
    }

    if (!employee) {
      currentEmployee = null;
      setHidden(healthStatus, true);
      setHidden(healthSlots, true);
      setHidden(slotList, true);
      setResultText("查無此員工工號，請輸入 1111 - 1114 測試。");
      healthEmployeeId?.focus();
      showKeyboardFor(healthEmployeeId, "english");
      return;
    }

    currentEmployee = employee;
    renderStatus(employee);
  }

  function fillBookingForm(employee) {
    if (!bookingForm || !employee) return;
    const set = (name, value) => {
      const field = bookingForm.elements[name];
      if (field && field.type !== "radio") field.value = value || "";
    };
    const booking = employee.booking || {};

    set("name", booking.name || employee.name);
    set("gender", booking.gender || employee.gender || "");
    set("birthday", booking.birthday || employee.birthday);
    set("idno", booking.idno || employee.idno);
    set("phone", booking.phone || employee.phone);
    set("email", booking.email || employee.email);
    set("employeeId", booking.employeeId || employee.id);
    set("dept", booking.dept || employee.dept);
    set("title", booking.title || employee.title);
    set("hospital", booking.hospital || employee.hospital || "");
    setRadioValue("plan", booking.plan || "");
    set("pregnant", booking.pregnant || "");
    set("chronic", booking.chronic || "");
    set("medicine", booking.medicine || "");
    set("allergy", booking.allergy || "");
    set("surgery", booking.surgery || "");
    set("emergencyName", booking.emergencyName || "");
    set("emergencyRelation", booking.emergencyRelation || "");
    set("emergencyPhone", booking.emergencyPhone || "");
    ["emptyStomach", "noAlcohol", "bringCard"].forEach(name => {
      const field = bookingForm.elements[name];
      if (field) field.checked = Boolean(booking[name]);
    });

    unlockEmployeeFields();

    if (bookingSlotSelect) {
      const bookedSlot = normalizeSlotText(booking.slot || employee.slot);
      const slotOptions = [...availableSlots];
      if (bookedSlot && !slotOptions.some(slot => slot.raw === bookedSlot)) {
        slotOptions.unshift({ id: "current", date: bookedSlot.split("）")[0] + "）", time: bookedSlot.split("）").slice(1).join("）").trim(), raw: bookedSlot, left: 1 });
      }
      bookingSlotSelect.innerHTML = `<option value="" selected disabled>請選擇日期與時段</option>` +
        slotOptions.map(slot => `<option value="${slot.raw}">${slot.raw}</option>`).join("");
      bookingSlotSelect.value = bookedSlot || "";
    }

    if (modalSlotList) {
      modalSlotList.innerHTML = availableSlots.map(slot => `
        <button class="modal-slot" type="button" data-modal-slot="${slot.raw}">
          <strong>${slot.date}</strong>
          <span>${slot.time}</span>
          <em>剩餘 ${slot.left} 位</em>
        </button>
      `).join("");
      modalSlotList.querySelectorAll("[data-modal-slot]").forEach(btn => {
        btn.addEventListener("click", () => {
          hideKeyboard();
          if (bookingSlotSelect) bookingSlotSelect.value = btn.dataset.modalSlot;
          clearValidation();
          goBookingStep(3);
        });
      });
    }
  }

  function unlockEmployeeFields() {
    if (!bookingForm) return;
    const lockedNames = ["name", "gender", "birthday", "idno", "phone", "email", "employeeId", "dept", "title"];
    lockedNames.forEach(name => {
      const field = bookingForm.elements[name];
      if (!field) return;
      field.classList.remove("employee-locked-field");
      delete field.dataset.employeeLocked;
      if (field.tagName === "SELECT") {
        field.disabled = false;
        field.removeAttribute("aria-disabled");
      } else {
        field.readOnly = false;
        field.removeAttribute("aria-readonly");
      }
      field.tabIndex = 0;
    });
  }

  function setRadioValue(name, value) {
    bookingForm?.querySelectorAll(`input[name="${name}"]`).forEach(input => {
      input.checked = input.value === value;
    });
  }

  function employeeValue(name, fallback = "") {
    if (!currentEmployee) return fallback;
    return currentEmployee[name] || fallback;
  }

  function openBookingModal(slotId) {
    if (!currentEmployee) {
      setResultText("請先查詢員工工號後再預約。");
      healthEmployeeId?.focus();
      return;
    }
    fillBookingForm(currentEmployee);

    const selected = availableSlots.find(slot => slot.id === slotId);
    if (selected && bookingSlotSelect) bookingSlotSelect.value = selected.raw;

    bookingModal.hidden = false;
    bookingModal.classList.toggle("is-editing", Boolean(currentEmployee.booked));
    if (bookingValidation) bookingValidation.textContent = "";
    goBookingStep(0);
    setTimeout(() => bookingNext?.focus(), 80);
  }

  function closeBookingModal() {
    bookingModal.hidden = true;
    hideKeyboard();
  }

  function goBookingStep(step) {
    currentStep = Math.max(0, Math.min(4, step));
    bookingSteps.forEach((section, index) => section.classList.toggle("active", index === currentStep));
    bookingStepTabs.forEach((btn, index) => btn.classList.toggle("active", index === currentStep));
    if (bookingPrev) bookingPrev.disabled = currentStep === 0;
    if (bookingNext) bookingNext.textContent = currentStep === 4 ? (currentEmployee?.booked ? "確認更改" : "確認預約") : "下一步";
    if (currentStep === 4) updateConfirmText();
  }

  function fieldLabel(field) {
    const label = field.closest("label");
    if (!label) return field.name || "欄位";
    const cloned = label.cloneNode(true);
    cloned.querySelectorAll("input, select, textarea, span, strong, small").forEach(node => {
      if (node === cloned.querySelector("span")) return;
      node.remove();
    });
    return (label.querySelector("span")?.textContent || cloned.textContent || field.name || "欄位").trim();
  }

  function clearValidation() {
    if (bookingValidation) bookingValidation.textContent = "";
    bookingSteps.forEach(step => step.querySelectorAll(".field-missing").forEach(el => el.classList.remove("field-missing")));
  }

  function showValidation(missing, firstField) {
    if (bookingValidation) {
      bookingValidation.textContent = `請先補齊：${missing.join("、")}。`;
    }
    firstField?.focus?.();
    const mode = firstField?.dataset?.keyboard || (firstField?.inputMode === "numeric" ? "english" : "zhuyin");
    if (firstField instanceof HTMLInputElement && mode) showKeyboardFor(firstField, mode);
  }

  function validateCurrentStep() {
    const section = bookingSteps[currentStep];
    if (!section) return true;
    clearValidation();

    const missing = [];
    let firstField = null;
    const requiredFields = [...section.querySelectorAll("input[required], select[required], textarea[required]")]
      .filter(field => !field.disabled && field.dataset.employeeLocked !== "true");
    const handledRadios = new Set();

    requiredFields.forEach(field => {
      let invalid = false;
      if (field.type === "radio") {
        if (handledRadios.has(field.name)) return;
        handledRadios.add(field.name);
        invalid = !section.querySelector(`input[type="radio"][name="${field.name}"]:checked`);
      } else if (field.type === "checkbox") {
        invalid = !field.checked;
      } else {
        invalid = !String(field.value || "").trim();
      }
      if (!invalid) return;
      field.closest("label")?.classList.add("field-missing");
      missing.push(fieldLabel(field));
      firstField ||= field;
    });

    if (!missing.length) return true;
    showValidation([...new Set(missing)], firstField);
    return false;
  }

  function selectedRadioValue(name) {
    return bookingForm?.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function updateConfirmText() {
    if (!bookingConfirmText || !bookingForm) return;
    const data = new FormData(bookingForm);
    bookingConfirmText.innerHTML = `
      <h3>確認預約資料</h3>
      <p><b>員工：</b>${employeeValue("id", data.get("employeeId") || "")} ${employeeValue("name", data.get("name") || "")}｜${employeeValue("dept", data.get("dept") || "")}｜${employeeValue("title", data.get("title") || "")}</p>
      <p><b>基本資料：</b>${employeeValue("gender", data.get("gender") || "")}｜生日 ${employeeValue("birthday", data.get("birthday") || "")}｜手機 ${employeeValue("phone", data.get("phone") || "")}｜Email ${employeeValue("email", data.get("email") || "")}</p>
      <p><b>健檢方案：</b>${selectedRadioValue("plan")}</p>
      <p><b>預約資訊：</b>${data.get("hospital") || ""}｜${data.get("slot") || ""}</p>
      <p><b>健康問卷：</b>懷孕 ${data.get("pregnant") || "否"}｜慢性病 ${data.get("chronic") || "否"}｜服藥 ${data.get("medicine") || "否"}｜過敏 ${data.get("allergy") || "否"}｜近期開刀住院 ${data.get("surgery") || "否"}</p>
      <p><b>緊急聯絡人：</b>${data.get("emergencyName") || ""}｜${data.get("emergencyRelation") || ""}｜${data.get("emergencyPhone") || ""}</p>
    `;
  }

  function completeBooking() {
    if (!currentEmployee || !bookingForm) return;
    const wasBooked = Boolean(currentEmployee.booked);
    const data = new FormData(bookingForm);
    const booking = {
      name: data.get("name") || "",
      gender: data.get("gender") || "",
      birthday: data.get("birthday") || "",
      idno: data.get("idno") || "",
      phone: data.get("phone") || "",
      email: data.get("email") || "",
      employeeId: data.get("employeeId") || currentEmployee.id,
      dept: data.get("dept") || "",
      title: data.get("title") || "",
      hospital: data.get("hospital") || "",
      slot: data.get("slot") || availableSlots[0].raw,
      plan: selectedRadioValue("plan"),
      pregnant: data.get("pregnant") || "",
      chronic: data.get("chronic") || "",
      medicine: data.get("medicine") || "",
      allergy: data.get("allergy") || "",
      surgery: data.get("surgery") || "",
      emptyStomach: data.get("emptyStomach") === "on",
      noAlcohol: data.get("noAlcohol") === "on",
      bringCard: data.get("bringCard") === "on",
      emergencyName: data.get("emergencyName") || "",
      emergencyRelation: data.get("emergencyRelation") || "",
      emergencyPhone: data.get("emergencyPhone") || ""
    };
    currentEmployee.booked = true;
    currentEmployee.completed = false;
    currentEmployee.status = "已預約";
    currentEmployee.slot = booking.slot;
    currentEmployee.hospital = booking.hospital || currentEmployee.hospital;
    currentEmployee.name = booking.name || currentEmployee.name;
    currentEmployee.gender = booking.gender;
    currentEmployee.birthday = booking.birthday;
    currentEmployee.idno = booking.idno;
    currentEmployee.phone = booking.phone;
    currentEmployee.email = booking.email;
    currentEmployee.dept = booking.dept || currentEmployee.dept;
    currentEmployee.title = booking.title || currentEmployee.title;
    currentEmployee.booking = booking;
    const stored = window.MockEmployees?.update?.(currentEmployee.id, employee => ({
      name: booking.name || employee.name,
      dept: booking.dept || employee.dept,
      role: booking.title || employee.role,
      gender: booking.gender,
      birthday: booking.birthday || employee.birthday,
      idno: booking.idno,
      phone: booking.phone,
      email: booking.email,
      health: {
        ...(employee.health || {}),
        eligible: true,
        status: "已預約",
        slot: booking.slot,
        hospital: booking.hospital,
        booking
      }
    }));
    if (stored) currentEmployee = findEmployee(currentEmployee.id) || currentEmployee;
    renderStatus(currentEmployee);
    closeBookingModal();
    setResultText(`${currentEmployee.id} ${currentEmployee.name}｜${wasBooked ? "預約資料已更新" : "預約成功"}｜${currentEmployee.slot}`);
  }

  /* ======================== WOHOURS 大千式觸控鍵盤 ======================== */

  function normalizeBpmfKey(key) {
    return String(key || "")
      .replace(/\s+/g, "")
      .replace(/一/g, "ㄧ")
      .replace(/ˉ/g, "")
      .replace(/ā/g, "");
  }

  function currentDictionary() {
    return window.BPMF_DICTIONARY || Object.create(null);
  }

  function getCandidates(buffer) {
    const dict = currentDictionary();
    const exact = normalizeBpmfKey(buffer);
    const base = exact.replace(/[ˊˇˋ˙]/g, "");
    const list = [];

    if (dict[exact]) list.push(...dict[exact]);
    if (!/[ˊˇˋ˙]/.test(exact) && dict[base]) list.push(...dict[base]);

    if (!list.length) {
      Object.keys(dict).some(key => {
        if (normalizeBpmfKey(key).replace(/[ˊˇˋ˙]/g, "") === base) {
          list.push(...dict[key]);
        }
        return list.length >= 16;
      });
    }

    return [...new Set(list)].slice(0, 16);
  }

  function keyType(zh) {
    if (initials.has(zh)) return "initial";
    if (medials.has(zh)) return "medial";
    if (finals.has(zh)) return "final";
    if (/[ˊˇˋ˙]/.test(zh)) return "tone";
    return "symbol";
  }

  function rebuildBufferFromParts(parts) {
    return `${parts.initial || ""}${parts.medial || ""}${parts.final || ""}${parts.tone || ""}`;
  }

  let zhuyinParts = { initial: "", medial: "", final: "", tone: "" };

  function resetZhuyin() {
    zhuyinParts = { initial: "", medial: "", final: "", tone: "" };
    zhuyinBuffer = "";
  }

  function setZhuyinTone(tone) {
    if (!zhuyinBuffer && !zhuyinParts.initial && !zhuyinParts.medial && !zhuyinParts.final) return;
    zhuyinParts.tone = tone;
    zhuyinBuffer = rebuildBufferFromParts(zhuyinParts);
    updateZhuyinCandidates();
  }

  function addZhuyin(symbol) {
    const type = keyType(symbol);
    if (type === "tone") {
      setZhuyinTone(symbol);
      return;
    }

    if (type === "initial") zhuyinParts.initial = symbol;
    else if (type === "medial") zhuyinParts.medial = symbol;
    else if (type === "final") zhuyinParts.final = symbol;
    else {
      if (zhuyinBuffer) commitRawZhuyin();
      insertText(symbol);
      return;
    }

    zhuyinParts.tone = "";
    zhuyinBuffer = rebuildBufferFromParts(zhuyinParts);
    updateZhuyinCandidates();
  }

  function commitCandidate(word) {
    if (!word) return;
    insertText(word);
    resetZhuyin();
    updateZhuyinCandidates();
  }

  function commitFirstCandidate() {
    if (!zhuyinBuffer) {
      insertText(" ");
      return;
    }
    const candidates = getCandidates(zhuyinBuffer);
    commitCandidate(candidates[0] || zhuyinBuffer);
  }

  function commitRawZhuyin() {
    if (!zhuyinBuffer) return;
    insertText(zhuyinBuffer);
    resetZhuyin();
    updateZhuyinCandidates();
  }

  function showKeyboardFor(input, mode) {
    if (!input || !touchKeyboard) return;
    if (input.disabled || input.readOnly || input.dataset.employeeLocked === "true") {
      hideKeyboard();
      return;
    }

    if (mode === "number") mode = "english";

    const sameInputStillOpen = !touchKeyboard.hidden && keyboardTarget === input;
    keyboardTarget = input;

    // 只有「第一次打開」或「切換到不同輸入框」才依照欄位預設模式。
    // 同一格繼續輸入時，不准自動跳回注音 / 英文 / 數字。
    if (!sameInputStillOpen) {
      keyboardMode = mode || input.dataset.keyboard || "zhuyin";
      resetZhuyin();
    }

    touchKeyboard.hidden = false;
    document.body.classList.add("keyboard-open");
    bookingModal?.classList.add("keyboard-open");
    renderKeyboard();
    touchKeyboard.scrollTop = 0;
    setTimeout(() => input.scrollIntoView({ block: "center", behavior: "smooth" }), 50);
  }

  function hideKeyboard() {
    if (!touchKeyboard) return;
    touchKeyboard.hidden = true;
    document.body.classList.remove("keyboard-open");
    bookingModal?.classList.remove("keyboard-open");
    resetZhuyin();
    updateZhuyinCandidates();
    removeKeyPreview();
  }

  function renderKeyContent(key) {
    if (key.special && key.action === "caps") return capsLock ? "CAPS" : key.label;
    if (key.special) return key.label;
    const en = (shiftOnce || capsLock) ? (key.shift || key.en || "").toUpperCase() : (key.en || "");
    const num = key.num || key.en || "";
    const zh = key.zh || "";
    const tone = key.tone || "";

    if (keyboardMode === "english") return `<span class="kb-en">${en}</span>`;
    return `
      <span class="kb-zh">${zh}</span>
      <span class="kb-en">${key.en || ""}</span>
      ${key.num ? `<span class="kb-num">${key.num}</span>` : ""}
      ${tone ? `<span class="kb-tone">${tone}</span>` : ""}
    `;
  }

  function keyClass(key) {
    const classes = [];
    if (key.special) classes.push("kb-special");
    if (key.space) classes.push("kb-space");
    if (key.action === "toggleLang" && keyboardMode === "english") classes.push("active");
    if (key.action === "num" && keyboardMode === "number") classes.push("active");
    if (key.action === "caps" && capsLock) classes.push("active");
    if (key.action === "shift" && (shiftOnce || capsLock)) classes.push("active");
    return classes.join(" ");
  }

  function renderKeyboard() {
    if (!keyboardKeys) return;

    keyboardModeBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.kbMode === keyboardMode));
    touchKeyboard.classList.toggle("is-zhuyin", keyboardMode === "zhuyin");
    touchKeyboard.classList.toggle("is-english", keyboardMode === "english");
    touchKeyboard.classList.remove("is-number");

    if (keyboardTitle) {
      keyboardTitle.textContent = "";
      keyboardTitle.hidden = true;
    }

    keyboardKeys.innerHTML = activeKeyboardLayout().map((row, index) => `
      <div class="key-row row-${index + 1}">
        ${row.map(key => `
          <button type="button"
            class="${keyClass(key)}"
            data-action="${key.action || ""}"
            data-en="${key.en || ""}"
            data-shift="${key.shift || ""}"
            data-zh="${key.zh || ""}"
            data-num="${key.num || ""}"
            data-tone="${key.tone || ""}">
            ${renderKeyContent(key)}
          </button>
        `).join("")}
      </div>
    `).join("");

    keyboardKeys.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("pointerdown", startTouchKey);
      btn.addEventListener("pointermove", moveTouchKey);
      btn.addEventListener("pointerup", endTouchKey);
      btn.addEventListener("pointercancel", cancelTouchKey);
      btn.addEventListener("click", event => event.preventDefault());
    });

    updateZhuyinCandidates();
  }

  function startTouchKey(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    touchStartKey = btn;
    longPressed = false;
    spaceDragging = false;

    const action = btn.dataset.action;
    if (action === "space") {
      spaceDragStartX = event.clientX;
      spaceDragStartCursor = keyboardTarget?.selectionStart ?? keyboardTarget?.value?.length ?? 0;
    }

    if (keyboardMode === "zhuyin" && btn.dataset.num) {
      longPressTimer = window.setTimeout(() => {
        longPressed = true;
        insertText(btn.dataset.num);
        navigator.vibrate?.(20);
      }, 500);
    }

    btn.classList.add("is-pressing");
    showKeyPreview(btn);
    navigator.vibrate?.(10);
  }

  function moveTouchKey(event) {
    if (!touchStartKey || !keyboardTarget) return;
    if (touchStartKey.dataset.action !== "space") return;
    const delta = event.clientX - spaceDragStartX;
    if (Math.abs(delta) < 18) return;
    spaceDragging = true;
    const move = Math.trunc(delta / 22);
    const next = Math.max(0, Math.min(keyboardTarget.value.length, spaceDragStartCursor + move));
    keyboardTarget.focus();
    keyboardTarget.setSelectionRange?.(next, next);
  }

  function endTouchKey(event) {
    event.preventDefault();
    window.clearTimeout(longPressTimer);
    removeKeyPreview();
    document.querySelectorAll(".keyboard-keys .is-pressing").forEach(el => el.classList.remove("is-pressing"));

    const btn = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".keyboard-keys button");
    const shouldPress = btn && touchStartKey && btn === touchStartKey && !longPressed && !spaceDragging;

    touchStartKey = null;
    if (spaceDragging) {
      spaceDragging = false;
      return;
    }
    if (shouldPress) pressKey(btn);
  }

  function cancelTouchKey() {
    window.clearTimeout(longPressTimer);
    removeKeyPreview();
    document.querySelectorAll(".keyboard-keys .is-pressing").forEach(el => el.classList.remove("is-pressing"));
    touchStartKey = null;
    longPressed = false;
    spaceDragging = false;
  }

  function showKeyPreview(btn) {
    removeKeyPreview();
    keyPreview = document.createElement("div");
    keyPreview.className = "key-preview-pop";
    keyPreview.textContent =
      btn.querySelector(".kb-zh")?.textContent ||
      btn.querySelector(".kb-en")?.textContent ||
      btn.querySelector(".kb-num")?.textContent ||
      btn.textContent.trim();
    document.body.appendChild(keyPreview);
    const rect = btn.getBoundingClientRect();
    keyPreview.style.left = `${rect.left + rect.width / 2}px`;
    keyPreview.style.top = `${rect.top - 10}px`;
  }

  function removeKeyPreview() {
    keyPreview?.remove();
    keyPreview = null;
  }

  function updateZhuyinCandidates() {
    if (!candidateRow || !zhuyinCompose) return;

    if (keyboardMode !== "zhuyin") {
      zhuyinCompose.textContent = "";
      candidateRow.innerHTML = "";
      return;
    }

    const candidates = zhuyinBuffer ? getCandidates(zhuyinBuffer) : [];
    zhuyinCompose.textContent = zhuyinBuffer
      ? `目前注音：${zhuyinBuffer}`
      : "請輸入注音，完整拼音會顯示候選字；空白鍵選第一個字。";

    candidateRow.innerHTML = "";

    if (candidates.length) {
      candidates.forEach((word, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = `${index === 0 ? "1 " : ""}${word}`;
        btn.addEventListener("pointerdown", event => event.preventDefault());
        btn.addEventListener("pointerup", () => commitCandidate(word));
        candidateRow.appendChild(btn);
      });
    } else if (zhuyinBuffer) {
      const raw = document.createElement("button");
      raw.type = "button";
      raw.textContent = "送出注音";
      raw.addEventListener("pointerdown", event => event.preventDefault());
      raw.addEventListener("pointerup", commitRawZhuyin);
      candidateRow.appendChild(raw);
    }
  }

  function insertText(text) {
    if (!keyboardTarget) return;
    const start = keyboardTarget.selectionStart ?? keyboardTarget.value.length;
    const end = keyboardTarget.selectionEnd ?? keyboardTarget.value.length;
    keyboardTarget.value = keyboardTarget.value.slice(0, start) + text + keyboardTarget.value.slice(end);
    const next = start + text.length;
    keyboardTarget.focus();
    keyboardTarget.setSelectionRange?.(next, next);
    keyboardTarget.dispatchEvent(new Event("input", { bubbles: true }));
    keyboardTarget.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function backspace() {
    if (!keyboardTarget) return;
    if (keyboardMode === "zhuyin" && zhuyinBuffer) {
      if (zhuyinParts.tone) zhuyinParts.tone = "";
      else if (zhuyinParts.final) zhuyinParts.final = "";
      else if (zhuyinParts.medial) zhuyinParts.medial = "";
      else if (zhuyinParts.initial) zhuyinParts.initial = "";
      zhuyinBuffer = `${zhuyinParts.initial}${zhuyinParts.medial}${zhuyinParts.final}${zhuyinParts.tone}`;
      updateZhuyinCandidates();
      return;
    }

    const start = keyboardTarget.selectionStart ?? keyboardTarget.value.length;
    const end = keyboardTarget.selectionEnd ?? keyboardTarget.value.length;
    if (start !== end) {
      keyboardTarget.value = keyboardTarget.value.slice(0, start) + keyboardTarget.value.slice(end);
      keyboardTarget.setSelectionRange?.(start, start);
    } else if (start > 0) {
      keyboardTarget.value = keyboardTarget.value.slice(0, start - 1) + keyboardTarget.value.slice(start);
      keyboardTarget.setSelectionRange?.(start - 1, start - 1);
    }
    keyboardTarget.dispatchEvent(new Event("input", { bubbles: true }));
    keyboardTarget.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function clearAction() {
    if (keyboardMode === "zhuyin" && zhuyinBuffer) {
      resetZhuyin();
      updateZhuyinCandidates();
      return;
    }
    if (!keyboardTarget) return;
    keyboardTarget.value = "";
    keyboardTarget.dispatchEvent(new Event("input", { bubbles: true }));
    keyboardTarget.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function pressKey(btn) {
    if (!keyboardTarget) return;
    const action = btn.dataset.action;

    if (action === "toggleLang") {
      keyboardMode = keyboardMode === "english" ? "zhuyin" : "english";
      resetZhuyin();
      shiftOnce = false;
      renderKeyboard();
      return;
    }
    if (action === "caps") {
      capsLock = !capsLock;
      shiftOnce = false;
      renderKeyboard();
      return;
    }
    if (action === "shift") {
      if (shiftOnce) {
        capsLock = !capsLock;
        shiftOnce = false;
      } else {
        shiftOnce = true;
      }
      renderKeyboard();
      return;
    }
    if (action === "noop") {
      return;
    }
    if (action === "tab") { insertText("  "); return; }
    if (action === "enter") {
      if (keyboardMode === "zhuyin" && zhuyinBuffer) commitRawZhuyin();
      else insertText("\n");
      return;
    }
    if (action === "backspace") { backspace(); return; }
    if (action === "clear") { clearAction(); return; }
    if (action === "done") {
      if (keyboardMode === "zhuyin" && zhuyinBuffer) commitFirstCandidate();
      hideKeyboard();
      return;
    }
    if (action === "space") {
      if (keyboardMode === "zhuyin") commitFirstCandidate();
      else insertText(" ");
      return;
    }

    if (keyboardMode === "english") {
      const en = btn.dataset.en || "";
      const shift = btn.dataset.shift || en.toUpperCase();
      let output = (shiftOnce || capsLock) ? shift : en;
      insertText(output);
      if (shiftOnce && !capsLock) {
        shiftOnce = false;
        renderKeyboard();
      }
      return;
    }

    const num = btn.dataset.num;
    const tone = btn.dataset.tone;
    const zh = btn.dataset.zh;

    if (zhuyinBuffer && num && toneKeys[num]) {
      setZhuyinTone(toneKeys[num]);
      return;
    }

    if (zh) addZhuyin(zh);
  }

  window.addEventListener("bpmf-dictionary-ready", () => {
    if (!touchKeyboard?.hidden) renderKeyboard();
  });

  /* ======================== Events ======================== */

  document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      button.animate?.([
        { transform: "scale(1)" },
        { transform: "scale(.985)" },
        { transform: "scale(1)" }
      ], { duration: 170, easing: "ease-out" });
    });
  });

  healthEmployeeId?.addEventListener("focus", () => showKeyboardFor(healthEmployeeId, "english"));
  healthEmployeeId?.addEventListener("click", () => showKeyboardFor(healthEmployeeId, "english"));
  healthEmployeeId?.addEventListener("input", () => {
    healthEmployeeId.value = healthEmployeeId.value.replace(/\D/g, "").slice(0, 8);
    setResultText("");
  });
  document.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name === "emergencyPhone") {
      target.value = target.value.replace(/\D/g, "").slice(0, 10);
    }
  });
  healthEmployeeQuery?.addEventListener("click", queryEmployee);
  healthEmployeeId?.addEventListener("keydown", event => {
    if (event.key === "Enter") queryEmployee();
  });

  healthReserveBtn?.addEventListener("click", () => {
    hideKeyboard();
    openBookingModal();
  });

  document.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", closeBookingModal);
  });

  bookingStepTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const step = Number(btn.dataset.stepTab);
      if (step <= currentStep || validateCurrentStep()) {
        hideKeyboard();
        goBookingStep(step);
      }
    });
  });

  bookingPrev?.addEventListener("click", () => {
    hideKeyboard();
    goBookingStep(currentStep - 1);
  });

  bookingNext?.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    hideKeyboard();
    if (currentStep < 4) goBookingStep(currentStep + 1);
    else completeBooking();
  });

  document.addEventListener("focusin", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.disabled || target.readOnly || target.dataset.employeeLocked === "true") {
      hideKeyboard();
      return;
    }
    const mode = target.dataset.keyboard;
    if (mode) showKeyboardFor(target, mode);
  });

  keyboardModeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      keyboardMode = btn.dataset.kbMode === "number" ? "english" : btn.dataset.kbMode;
      resetZhuyin();
      renderKeyboard();
    });
  });

  document.querySelector("[data-kb-hide]")?.addEventListener("click", hideKeyboard);

  bookingForm?.addEventListener("change", () => {
    if (currentStep === 4) updateConfirmText();
  });
  bookingForm?.addEventListener("input", () => {
    if (currentStep === 4) updateConfirmText();
  });

  setHidden(healthStatus, true);
  setHidden(healthSlots, true);
  setHidden(slotList, true);
  renderAvailableSlots();
  goBookingStep(0);
  fitKiosk();
  updateClock();
  window.addEventListener("resize", fitKiosk);
  window.setInterval(updateClock, 1000 * 20);
})();
