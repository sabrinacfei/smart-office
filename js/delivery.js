(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];

  const deliveryTime = document.getElementById("deliveryTime");
  const deliveryDate = document.getElementById("deliveryDate");
  const parcelRows = document.getElementById("parcelRows");
  const parcelCount = document.getElementById("parcelCount");
  const parcelSearch = document.getElementById("parcelSearch");

  const filterButtons = Array.from(document.querySelectorAll(".delivery-tabs button"));
  const summaryCards = Array.from(document.querySelectorAll(".summary-card"));

  const openModal = document.getElementById("openParcelModal");
  const modal = document.getElementById("parcelModal");
  const closeModal = document.getElementById("closeParcelModal");
  const cancelParcel = document.getElementById("cancelParcel");

  const scannerModal = document.getElementById("scannerModal");
  const openScanModal = document.getElementById("openScanModal");
  const closeScanModal = document.getElementById("closeScanModal");
  const scannerVideo = document.getElementById("scannerVideo");

  const parcelForm = document.getElementById("parcelForm");
  const modeButtons = Array.from(document.querySelectorAll(".parcel-mode button"));
  const formPages = Array.from(document.querySelectorAll(".parcel-form-page"));
  const confirmButton = parcelForm?.querySelector(".confirm");
  const choiceTriggers = Array.from(document.querySelectorAll(".choice-trigger"));

  const parcels = [
    {
      no: "TW1234567890",
      person: "林佳穎",
      dept: "行政部",
      source: "黑貓宅急便",
      status: "待領取",
      time: "2026/07/06 09:30",
      action: "通知收件人"
    },
    {
      no: "TW0987654321",
      person: "張志明",
      dept: "業務部",
      source: "7-11 交貨便",
      status: "運送中",
      time: "2026/07/06 14:20",
      action: "查看詳情"
    },
    {
      no: "TW1122334455",
      person: "王小美",
      dept: "行銷部",
      source: "新竹物流",
      status: "待領取",
      time: "2026/07/05 16:45",
      action: "通知收件人"
    },
    {
      no: "TW6677889900",
      person: "李承翰",
      dept: "資訊部",
      source: "順豐速運",
      status: "已領取",
      time: "2026/07/04 11:10",
      action: "查看詳情"
    },
    {
      no: "TW5566778899",
      person: "陳雅婷",
      dept: "財務部",
      source: "黑貓宅急便",
      status: "逾期未領",
      time: "2026/07/02 10:00",
      action: "通知收件人"
    }
  ];

  const mockParcels = window.MockEmployees?.all().flatMap(employee =>
    (employee.parcels || []).map(parcel => ({
      no: parcel.no,
      person: employee.name,
      employeeId: employee.id,
      dept: employee.dept,
      source: parcel.source,
      status: parcel.status,
      time: parcel.time,
      action: parcel.status === "待領取" || parcel.status === "逾期未領" ? "通知收件人" : "查看詳情"
    }))
  ) || [];

  if (mockParcels.length) {
    parcels.splice(0, parcels.length, ...mockParcels);
  }

  const pickerOptions = {
    dept: ["行政部", "業務部", "資訊部", "財務部"],
    source: ["黑貓宅急便", "7-11 交貨便", "新竹物流", "順豐速運"]
  };

  let activeFilter = "all";
  let activeMode = "receive";
  let activePicker = null;
  let scannerTimer = null;
  let scannerStream = null;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateClock() {
    const now = new Date();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const day = weekdayShort[now.getDay()];

    deliveryTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    deliveryDate.textContent = `${month}/${date} (${day})`;
  }

  function formatDateTime(date, time) {
    if (!date || !time) return "";
    return `${date.replaceAll("-", "/")} ${time}`;
  }

  function statusClass(status) {
    return status === "逾期未領" ? "danger" : "";
  }

  function getVisibleParcels() {
    const keyword = String(parcelSearch?.value || "").trim().toLowerCase();

    return parcels.filter(parcel => {
      const matchFilter = activeFilter === "all" || parcel.status === activeFilter;
      const searchable = `${parcel.no} ${parcel.employeeId || ""} ${parcel.person} ${parcel.dept} ${parcel.source} ${parcel.status}`.toLowerCase();

      return matchFilter && (!keyword || searchable.includes(keyword));
    });
  }

  function renderParcels() {
    const visible = getVisibleParcels();
    const counts = parcels.reduce((acc, parcel) => {
      acc[parcel.status] = (acc[parcel.status] || 0) + 1;
      return acc;
    }, {});

    summaryCards.forEach(card => {
      const number = card.querySelector("strong");
      if (number) number.innerHTML = `${counts[card.dataset.filter] || 0}<small>件</small>`;
    });

    parcelRows.innerHTML = visible.map(parcel => `
      <article class="parcel-row">
        <span class="parcel-id">
          <img src="images/包裹.png" alt="">
          ${parcel.no}
        </span>
        <span class="person">
          <strong>${parcel.person}</strong>
          <small>${parcel.employeeId ? `${parcel.employeeId}｜` : ""}${parcel.dept}</small>
        </span>
        <span>${parcel.source}</span>
        <span>
          <b class="badge ${statusClass(parcel.status)}">${parcel.status}</b>
        </span>
        <span>${parcel.time}</span>
        <span>
          <button class="row-action" type="button">${parcel.action}</button>
          <i class="more">⋮</i>
        </span>
      </article>
    `).join("");

    parcelCount.textContent = `共 ${visible.length} 筆資料`;
  }

  function setFilter(filter) {
    activeFilter = filter;

    filterButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.filter === filter);
    });

    summaryCards.forEach(card => {
      card.classList.toggle("active", card.dataset.filter === filter);
    });

    renderParcels();
  }

  function setMode(mode) {
    activeMode = mode;

    modeButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.mode === mode);
    });

    formPages.forEach(page => {
      page.classList.toggle("active", page.dataset.page === mode);
    });

    if (confirmButton) {
      confirmButton.textContent = mode === "send" ? "確認送件" : "確認登記";
    }

    closePicker();
  }

  function setCurrentArrivalTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const hour = pad(now.getHours());
    const minute = pad(now.getMinutes());

    if (parcelForm?.elements.arrivalDate) {
      parcelForm.elements.arrivalDate.value = `${year}/${month}/${date}`;
    }

    if (parcelForm?.elements.arrivalTime) {
      parcelForm.elements.arrivalTime.value = `${hour}:${minute}`;
    }
  }

  function showModal() {
    setCurrentArrivalTime();

    modal.hidden = false;

    requestAnimationFrame(() => {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  }

  function hideModal() {
    closePicker();

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      if (!modal.classList.contains("open")) {
        modal.hidden = true;
      }
    }, 180);
  }

  function clearErrors() {
    parcelForm.querySelectorAll(".field-error").forEach(node => node.remove());
    parcelForm.querySelectorAll(".parcel-field.has-error").forEach(node => {
      node.classList.remove("has-error");
    });
  }

  function setError(control, message) {
    const field = control.closest(".parcel-field");
    if (!field) return;

    field.classList.add("has-error");

    let error = field.querySelector(".field-error");

    if (!error) {
      error = document.createElement("small");
      error.className = "field-error";
      field.append(error);
    }

    error.textContent = message;
  }

  function validateActivePage() {
    clearErrors();

    const page = formPages.find(item => item.dataset.page === activeMode);
    let firstInvalid = null;

    page.querySelectorAll("input, textarea").forEach(control => {
      const label = control.closest(".parcel-field")?.querySelector("span");
      const required = Boolean(label?.querySelector("b"));

      if (required && !String(control.value || "").trim()) {
        setError(control, "此欄位必填");
        firstInvalid ||= control;
      }
    });

    const phone = parcelForm.elements.sendReceiverPhone;

    if (activeMode === "send" && phone.value && !/^09\d{8}$/.test(phone.value)) {
      setError(phone, "電話需為 09 開頭，共 10 位數字");
      firstInvalid ||= phone;
    }

    if (firstInvalid) {
      firstInvalid.closest(".parcel-field")?.animate?.(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-7px)" },
          { transform: "translateX(7px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 250, easing: "ease-out" }
      );
    }

    return !firstInvalid;
  }

  function addReceiveParcel() {
    parcels.unshift({
      no: parcelForm.elements.parcelNo.value.trim(),
      person: parcelForm.elements.receiverName.value.trim(),
      dept: parcelForm.elements.receiverDept.value,
      source: parcelForm.elements.parcelSource.value,
      status: "待領取",
      time: formatDateTime(parcelForm.elements.arrivalDate.value, parcelForm.elements.arrivalTime.value),
      action: "通知收件人"
    });
  }

  function addSendParcel() {
    parcels.unshift({
      no: `OUT${String(Date.now()).slice(-8)}`,
      person: parcelForm.elements.sendReceiverName.value.trim(),
      dept: parcelForm.elements.senderDept.value,
      source: parcelForm.elements.shipMethod.value,
      status: "運送中",
      time: formatDateTime(parcelForm.elements.sendDate.value, parcelForm.elements.sendTime.value),
      action: "查看詳情"
    });
  }

  function removeActivePicker() {
    if (activePicker) {
      activePicker.remove();
      activePicker = null;
    }

    choiceTriggers.forEach(trigger => {
      trigger.classList.remove("open");
    });
  }

  function closePicker() {
    removeActivePicker();
  }

  function setChoiceValue(trigger, value) {
    const targetName = trigger.dataset.target;
    const input = parcelForm.elements[targetName];

    if (!input) return;

    input.value = value;

    const label = trigger.querySelector("em");
    if (label) label.textContent = displayChoiceValue(trigger.dataset.picker, value);

    trigger.classList.add("has-value");
    trigger.closest(".parcel-field")?.classList.remove("has-error");
    trigger.closest(".parcel-field")?.querySelector(".field-error")?.remove();

    closePicker();
  }

  function displayChoiceValue(type, value) {
    if (type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-");
      return `${year}/${month}/${day}`;
    }

    return value;
  }

  function createPickerShell(trigger, className) {
    closePicker();

    const picker = document.createElement("div");
    picker.className = `custom-picker ${className}`;

    const field = trigger.closest(".parcel-field");
    field.append(picker);

    trigger.classList.add("open");
    activePicker = picker;

    return picker;
  }

  function openListPicker(trigger, options) {
    const picker = createPickerShell(trigger, "list-picker");

    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;

      button.addEventListener("click", () => {
        setChoiceValue(trigger, option);
      });

      picker.append(button);
    });
  }

  function getMonthMatrix(year, monthIndex) {
    const firstDay = new Date(year, monthIndex, 1);
    const startDay = firstDay.getDay();
    const start = new Date(year, monthIndex, 1 - startDay);

    const days = [];

    for (let i = 0; i < 42; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }

    return days;
  }

  function openDatePicker(trigger) {
    const picker = createPickerShell(trigger, "date-picker");

    const input = parcelForm.elements[trigger.dataset.target];
    const base = input?.value ? new Date(input.value) : new Date();

    let viewYear = base.getFullYear();
    let viewMonth = base.getMonth();

    function renderCalendar() {
      picker.innerHTML = "";

      const header = document.createElement("div");
      header.className = "picker-header";

      const title = document.createElement("strong");
      title.textContent = `${viewYear}年${pad(viewMonth + 1)}月`;

      const controls = document.createElement("div");

      const prev = document.createElement("button");
      prev.type = "button";
      prev.textContent = "‹";

      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "›";

      controls.append(prev, next);
      header.append(title, controls);
      picker.append(header);

      const week = document.createElement("div");
      week.className = "picker-week";
      ["日", "一", "二", "三", "四", "五", "六"].forEach(day => {
        const span = document.createElement("span");
        span.textContent = day;
        week.append(span);
      });
      picker.append(week);

      const grid = document.createElement("div");
      grid.className = "picker-days";

      const today = new Date();
      const selectedValue = input?.value || "";

      getMonthMatrix(viewYear, viewMonth).forEach(date => {
        const button = document.createElement("button");
        button.type = "button";

        const value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        button.textContent = date.getDate();
        button.dataset.value = value;

        if (date.getMonth() !== viewMonth) {
          button.classList.add("muted");
        }

        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        ) {
          button.classList.add("today");
        }

        if (selectedValue === value) {
          button.classList.add("selected");
        }

        button.addEventListener("click", () => {
          setChoiceValue(trigger, value);
        });

        grid.append(button);
      });

      picker.append(grid);

      const footer = document.createElement("div");
      footer.className = "picker-footer";

      const clear = document.createElement("button");
      clear.type = "button";
      clear.textContent = "清除";

      const todayButton = document.createElement("button");
      todayButton.type = "button";
      todayButton.textContent = "今天";

      clear.addEventListener("click", () => {
        const targetName = trigger.dataset.target;
        const hiddenInput = parcelForm.elements[targetName];

        if (hiddenInput) hiddenInput.value = "";
        trigger.querySelector("em").textContent = "請選擇日期";
        trigger.classList.remove("has-value");
        closePicker();
      });

      todayButton.addEventListener("click", () => {
        const now = new Date();
        const value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        setChoiceValue(trigger, value);
      });

      footer.append(clear, todayButton);
      picker.append(footer);

      prev.addEventListener("click", () => {
        viewMonth -= 1;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear -= 1;
        }
        renderCalendar();
      });

      next.addEventListener("click", () => {
        viewMonth += 1;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear += 1;
        }
        renderCalendar();
      });
    }

    renderCalendar();
  }

  function openTimePicker(trigger) {
    const picker = createPickerShell(trigger, "time-picker");

    const times = [];
    for (let hour = 8; hour <= 19; hour += 1) {
      times.push(`${pad(hour)}:00`);
      times.push(`${pad(hour)}:30`);
    }

    times.forEach(time => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = time;

      button.addEventListener("click", () => {
        setChoiceValue(trigger, time);
      });

      picker.append(button);
    });
  }

  function openPicker(trigger) {
    const type = trigger.dataset.picker;

    if (type === "dept") {
      openListPicker(trigger, pickerOptions.dept);
      return;
    }

    if (type === "source") {
      openListPicker(trigger, pickerOptions.source);
      return;
    }

    if (type === "date") {
      openDatePicker(trigger);
      return;
    }

    if (type === "time") {
      openTimePicker(trigger);
    }
  }

  function stopScannerCamera() {
    if (scannerStream) {
      scannerStream.getTracks().forEach(track => track.stop());
      scannerStream = null;
    }

    if (scannerVideo) {
      scannerVideo.srcObject = null;
    }
  }

  async function startScannerCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    try {
      scannerStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment"
        },
        audio: false
      });

      scannerVideo.srcObject = scannerStream;
    } catch (error) {
      const hint = document.getElementById("scannerHint");
      if (hint) {
        hint.textContent = "無法開啟攝影機，請確認瀏覽器權限";
      }
    }
  }

  function showScannerModal() {
    closePicker();

    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      modal.hidden = true;
    }

    scannerModal.hidden = false;

    requestAnimationFrame(() => {
      scannerModal.classList.add("open");
      scannerModal.setAttribute("aria-hidden", "false");
    });

    startScannerCamera();

    window.clearTimeout(scannerTimer);
    scannerTimer = window.setTimeout(() => {
      hideScannerModal();
    }, 6000);
  }

  function hideScannerModal() {
    window.clearTimeout(scannerTimer);
    stopScannerCamera();

    scannerModal.classList.remove("open");
    scannerModal.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      if (!scannerModal.classList.contains("open")) {
        scannerModal.hidden = true;
      }

      showModal();
    }, 180);
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.filter);
    });
  });

  summaryCards.forEach(card => {
    card.addEventListener("click", () => {
      setFilter(card.dataset.filter);
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setFilter(card.dataset.filter);
      }
    });
  });

  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
    });
  });

  choiceTriggers.forEach(trigger => {
    trigger.addEventListener("click", event => {
      event.preventDefault();
      openPicker(trigger);
    });
  });

  document.addEventListener("click", event => {
    if (
      activePicker &&
      !activePicker.contains(event.target) &&
      !event.target.closest(".choice-trigger")
    ) {
      closePicker();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closePicker();

      if (scannerModal && !scannerModal.hidden) {
        hideScannerModal();
      }
    }
  });

  parcelSearch?.addEventListener("input", renderParcels);

  openModal?.addEventListener("click", showModal);
  closeModal?.addEventListener("click", hideModal);
  cancelParcel?.addEventListener("click", hideModal);

  openScanModal?.addEventListener("click", showScannerModal);
  closeScanModal?.addEventListener("click", hideScannerModal);

  modal?.addEventListener("click", event => {
    if (event.target === modal) hideModal();
  });

  scannerModal?.addEventListener("click", event => {
    if (event.target === scannerModal) hideScannerModal();
  });

  parcelForm?.addEventListener("input", event => {
    if (event.target.name === "sendReceiverPhone") {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
    }

    event.target.closest(".parcel-field")?.classList.remove("has-error");
    event.target.closest(".parcel-field")?.querySelector(".field-error")?.remove();
  });

  parcelForm?.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateActivePage()) return;

    if (activeMode === "send") {
      addSendParcel();
    } else {
      addReceiveParcel();
    }

    parcelForm.reset();
    clearErrors();
    closePicker();
    hideModal();

    choiceTriggers.forEach(trigger => {
      const type = trigger.dataset.picker;
      const label = trigger.querySelector("em");

      trigger.classList.remove("has-value");

      if (!label) return;

      if (type === "dept") label.textContent = "請選擇部門";
      if (type === "source" && trigger.dataset.target === "shipMethod") label.textContent = "請選擇物流方式";
      if (type === "source" && trigger.dataset.target !== "shipMethod") label.textContent = "請選擇包裹來源";
      if (type === "date") label.textContent = "請選擇日期";
      if (type === "time") label.textContent = "請選擇時間";
    });

    setFilter(activeFilter);

    document.querySelector(".parcel-table")?.animate?.(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-5px)" },
        { transform: "translateY(0)" }
      ],
      { duration: 260, easing: "ease-out" }
    );
  });

  updateClock();
  setMode("receive");
  setFilter("all");

  window.setInterval(updateClock, 1000 * 20);
})();
