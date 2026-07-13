(() => {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const employees = {
    "0001": { name: "林佳穎", role: "櫃檯人員", shift: "早班 09:00 - 18:00", next: "明日 09:00" },
    "0002": { name: "張志明", role: "營運主管", shift: "中班 12:00 - 21:00", next: "明日 12:00" },
    "0003": { name: "王小美", role: "行政人員", shift: "早班 09:00 - 18:00", next: "明日 09:00" },
    "0004": { name: "李承翰", role: "設備支援", shift: "晚班 15:00 - 24:00", next: "明日 15:00" }
  };
  const moodOptions = [
    { label: "開心", image: "images/開心.png", color: "#f5a8b3" },
    { label: "平靜安穩", image: "images/平靜安穩.png", color: "#b9aef3" },
    { label: "無奈", image: "images/無奈.png", color: "#f1c879" },
    { label: "煩躁", image: "images/煩躁.png", color: "#a9d88d" },
    { label: "難過", image: "images/難過.png", color: "#9dcae9" },
    { label: "生氣", image: "images/生氣.png", color: "#f27667" }
  ];

  const headerDate = document.getElementById("headerDate");
  const headerTime = document.getElementById("headerTime");
  const attendanceDate = document.getElementById("attendanceDate");
  const attendanceTime = document.getElementById("attendanceTime");
  const entryView = document.getElementById("entryView");
  const backButton = document.getElementById("backButton");
  const modeSwitch = document.getElementById("modeSwitch");
  const employeeId = document.getElementById("employeeId");
  const employeeError = document.getElementById("employeeError");
  const keypad = document.getElementById("keypad");
  const attendanceSubmit = document.getElementById("attendanceSubmit");
  const faceLayer = document.getElementById("faceLayer");
  const faceVideo = document.getElementById("faceVideo");
  const faceHint = document.getElementById("faceHint");
  const faceBack = document.getElementById("faceBack");
  const faceConfirm = document.getElementById("faceConfirm");
  const reviewLayer = document.getElementById("reviewLayer");
  const reviewMode = document.getElementById("reviewMode");
  const reviewEmployeeName = document.getElementById("reviewEmployeeName");
  const reviewEmployee = document.getElementById("reviewEmployee");
  const reviewTime = document.getElementById("reviewTime");
  const reviewEdit = document.getElementById("reviewEdit");
  const reviewSubmit = document.getElementById("reviewSubmit");
  const successLayer = document.getElementById("successLayer");
  const successKicker = document.getElementById("successKicker");
  const successTitle = document.getElementById("successTitle");
  const successMessage = document.getElementById("successMessage");
  const successEmployeeName = document.getElementById("successEmployeeName");
  const successTime = document.getElementById("successTime");
  const successDate = document.getElementById("successDate");
  const successMode = document.getElementById("successMode");
  const successTopDate = document.getElementById("successTopDate");
  const successTopTime = document.getElementById("successTopTime");
  const clockoutNote = document.getElementById("clockoutNote");
  const autoReturnSeconds = document.getElementById("autoReturnSeconds");
  const successBack = document.getElementById("successBack");
  const successBackTop = document.getElementById("successBackTop");
  const overtimeEntry = document.getElementById("overtimeEntry");

  let currentMode = "上班打卡";
  let cameraStream = null;
  let faceTimer = null;
  let overtimeStream = null;
  let overtimeTimer = null;
  let returnTimer = null;
  let returnSeconds = 10;
  const overtimeState = {
    employee: null,
    employeeId: "",
    flow: "in",
    reason: "專案趕工",
    note: "",
    plannedStart: "18:45",
    plannedEnd: "21:30",
    clockInTime: ""
  };
  const overtimeStartOptions = ["18:00", "18:15", "18:30", "18:45", "19:00", "19:30", "20:00"];
  const overtimeEndOptions = ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"];

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function getEmployee() {
    const id = employeeId.value.trim();
    const mock = window.MockEmployees?.find(id);
    if (mock) {
      return {
        id,
        name: mock.name,
        role: mock.role,
        shift: mock.schedule.today,
        next: mock.schedule.next,
        dept: mock.dept,
        birthday: mock.birthday
      };
    }
    return employees[id] || { id, name: "員工 " + id, role: "辦公室人員", shift: "今日班別", next: "依班表公告" };
  }

  function formatDate(now) {
    return `${now.getFullYear()} / ${pad(now.getMonth() + 1)} / ${pad(now.getDate())}　星期${weekdays[now.getDay()]}`;
  }

  function formatTime(now = new Date()) {
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function storageDateKey(now = new Date()) {
    return `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
  }

  function normalizeRecordDate(value) {
    return String(value || "").replace(/\s+/g, "").replace(/[年月]/g, "/").replace(/日.*/, "");
  }

  function hasClockedToday(id, mode, now = new Date()) {
    const employee = window.MockEmployees?.find(id);
    if (!employee) return false;
    const today = storageDateKey(now).replaceAll("/", "");
    return (employee.attendance || []).some(record => {
      const recordDate = normalizeRecordDate(record.date).replaceAll("/", "");
      return record.mode === mode && recordDate.includes(today);
    });
  }

  function updateClock() {
    const now = new Date();
    const dateText = formatDate(now);
    const timeText = formatTime(now);
    if (headerDate) headerDate.textContent = dateText.replace(`${now.getFullYear()} / `, "");
    if (headerTime) headerTime.textContent = timeText;
    if (attendanceDate) attendanceDate.textContent = dateText;
    if (attendanceTime) attendanceTime.textContent = timeText;
    if (successTopDate) successTopDate.textContent = dateText;
    if (successTopTime) successTopTime.textContent = timeText;
  }

  function goHome() {
    stopCamera();
    window.location.href = "homepage-ui.html";
  }

  function setLayer(layer, open) {
    layer.classList.toggle("open", open);
    layer.setAttribute("aria-hidden", String(!open));
  }

  function validateEmployeeId() {
    const value = employeeId.value.trim();
    if (!/^\d{4,8}$/.test(value)) {
      employeeError.textContent = "請輸入 4 到 8 位數字員工號";
      employeeId.focus();
      employeeId.animate?.(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 220, easing: "ease-out" }
      );
      return false;
    }
    employeeError.textContent = "";
    return true;
  }

  function stopCamera() {
    window.clearTimeout(faceTimer);
    faceTimer = null;
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (faceVideo) faceVideo.srcObject = null;
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      faceHint.textContent = "此瀏覽器不支援相機，仍可按下確認繼續 demo 流程。";
      return;
    }

    try {
      stopCamera();
      faceHint.textContent = "正在開啟相機，請允許瀏覽器使用攝影機。";
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      faceVideo.srcObject = cameraStream;
      await faceVideo.play().catch(() => {});
      faceHint.textContent = `員工號 ${employeeId.value.trim()}，請將臉部置於框線中央。`;
    } catch (error) {
      console.warn("人臉辨識相機開啟失敗", error);
      faceHint.textContent = "相機權限尚未開啟，仍可按下確認繼續 demo 流程。";
    }
  }

  async function openFaceCheck() {
    if (!validateEmployeeId()) return;
    const id = employeeId.value.trim();
    if (hasClockedToday(id, currentMode)) {
      employeeError.textContent = `今天已完成${currentMode}，不能重複打卡`;
      employeeId.animate?.(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 220, easing: "ease-out" }
      );
      return;
    }
    setLayer(faceLayer, true);
    if (faceConfirm) {
      faceConfirm.disabled = true;
      faceConfirm.textContent = "辨識中";
    }
    await startCamera();
    window.clearTimeout(faceTimer);
    faceTimer = window.setTimeout(openReview, 3000);
  }

  function openReview() {
    const employee = getEmployee();
    window.clearTimeout(faceTimer);
    faceTimer = null;
    if (faceConfirm) {
      faceConfirm.disabled = false;
      faceConfirm.textContent = "辨識完成，確認資料";
    }
    stopCamera();
    setLayer(faceLayer, false);
    reviewMode.textContent = currentMode;
    reviewEmployeeName.textContent = `${employee.name}（${employee.role}）`;
    reviewEmployee.textContent = employeeId.value.trim();
    reviewTime.textContent = formatTime();
    setLayer(reviewLayer, true);
  }

  function startAutoReturn() {
    window.clearInterval(returnTimer);
    returnSeconds = 3;
    autoReturnSeconds.textContent = String(returnSeconds);
    returnTimer = window.setInterval(() => {
      returnSeconds -= 1;
      autoReturnSeconds.textContent = String(Math.max(0, returnSeconds));
      if (returnSeconds <= 0) goHome();
    }, 1000);
  }

  function isBirthdayToday(employee, now = new Date()) {
    if (!employee?.birthday) return false;
    const today = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
    return employee.birthday === today;
  }

  function showBirthdayCelebration(employee) {
    let overlay = document.getElementById("birthdayClockInOverlay");
    if (!overlay) {
      overlay = document.createElement("section");
      overlay.id = "birthdayClockInOverlay";
      overlay.className = "birthday-clockin-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = `
        <div class="birthday-clockin-sparkles" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        <article class="birthday-clockin-card" role="dialog" aria-modal="true">
          <img src="images/生日.png" alt="生日蛋糕">
          <small>HAPPY BIRTHDAY</small>
          <h2 id="birthdayClockInTitle">生日快樂！</h2>
          <p id="birthdayClockInText">今天是您的生日，別忘了領取生日禮卡。</p>
          <div>
            <button type="button" id="birthdayClockInLater">稍後再說</button>
            <button type="button" id="birthdayClockInGo">前往生日禮卡</button>
          </div>
        </article>
      `;
      document.querySelector(".attendance-canvas")?.appendChild(overlay);
      overlay.querySelector("#birthdayClockInLater").addEventListener("click", () => {
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        startAutoReturn();
      });
      overlay.querySelector("#birthdayClockInGo").addEventListener("click", () => {
        localStorage.setItem("wohours.pendingBirthdayEmployee", employee.id || employeeId.value.trim());
        window.location.href = "employee.html#birthdayView";
      });
    }
    overlay.querySelector("#birthdayClockInTitle").textContent = `${employee.name}，生日快樂！`;
    overlay.querySelector("#birthdayClockInText").textContent = "今天上班第一件好事：您的生日禮卡已經可以查看與領取。";
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
  }

  function finishAttendance() {
    const employee = getEmployee();
    const isClockOut = currentMode === "下班打卡";
    const now = new Date();
    const time = formatTime(now);
    const date = formatDate(now);

    setLayer(reviewLayer, false);
    entryView.hidden = true;
    successLayer.classList.toggle("is-clock-out", isClockOut);
    successTitle.textContent = "打卡成功！";
    successMessage.textContent = isClockOut ? "下班打卡已完成" : "上班打卡已完成";
    successEmployeeName.textContent = `${employeeId.value.trim()} ${employee.name}`;
    successTime.textContent = time;
    successDate.textContent = date;
    successMode.textContent = isClockOut ? "下班打卡" : "上班打卡";
    window.MockEmployees?.addAttendance(employeeId.value.trim(), {
      date: storageDateKey(now),
      mode: successMode.textContent,
      time
    });
    clockoutNote.hidden = !isClockOut;
    setLayer(successLayer, true);
    if (!isClockOut && isBirthdayToday(employee, now)) {
      showBirthdayCelebration(employee);
    } else {
      startAutoReturn();
    }
  }

  function minutesFromTime(value) {
    const [hour, minute] = String(value || "00:00").split(":").map(Number);
    return hour * 60 + minute;
  }

  function overtimeDuration(start = overtimeState.plannedStart, end = overtimeState.plannedEnd) {
    let minutes = minutesFromTime(end) - minutesFromTime(start);
    if (minutes < 0) minutes += 24 * 60;
    return `${Math.floor(minutes / 60)} 小時 ${minutes % 60} 分鐘`;
  }

  function overtimeTimePicker(kind, label, value, options) {
    return `
      <div class="overtime-time-picker" data-time-picker="${kind}">
        <span>${label}</span>
        <button class="overtime-time-value" type="button" data-time-toggle>
          <strong>${value}</strong><b>⌄</b>
        </button>
        <div class="overtime-time-menu">
          ${options.map(time => `
            <button class="${time === value ? "selected" : ""}" type="button" data-time-option="${time}">
              ${time}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function closeOvertimeTimePickers(except = null) {
    document.querySelectorAll(".overtime-time-picker.open").forEach(picker => {
      if (picker !== except) picker.classList.remove("open");
    });
  }

  function shortDate(now = new Date()) {
    return `${now.getFullYear()} / ${pad(now.getMonth() + 1)} / ${pad(now.getDate())}`;
  }

  function todayLabel(now = new Date()) {
    return `${shortDate(now)}（星期${weekdays[now.getDay()]}）`;
  }

  function getMockEmployeeById(id) {
    return window.MockEmployees?.find(String(id || "").trim()) || null;
  }

  function getTodayAttendance(id, mode) {
    const employee = getMockEmployeeById(id);
    if (!employee) return null;
    const today = storageDateKey().replaceAll("/", "");
    return (employee.attendance || []).find(record => {
      const recordDate = normalizeRecordDate(record.date).replaceAll("/", "");
      return record.mode === mode && recordDate.includes(today);
    }) || null;
  }

  function getTodayOvertime(id) {
    const employee = getMockEmployeeById(id);
    if (!employee) return null;
    const today = storageDateKey();
    return (employee.overtimeRecords || []).find(record => record.date === today) || null;
  }

  function saveTodayOvertime(id, patch) {
    return window.MockEmployees?.update(id, employee => {
      const today = storageDateKey();
      const records = [...(employee.overtimeRecords || [])];
      const index = records.findIndex(record => record.date === today);
      const current = index >= 0 ? records[index] : { date: today };
      const next = { ...current, ...patch };
      if (index >= 0) records[index] = next;
      else records.unshift(next);
      return { overtimeRecords: records.slice(0, 12) };
    });
  }

  function stopOvertimeCamera() {
    window.clearTimeout(overtimeTimer);
    overtimeTimer = null;
    if (overtimeStream) {
      overtimeStream.getTracks().forEach(track => track.stop());
      overtimeStream = null;
    }
    const video = document.getElementById("overtimeFaceVideo");
    if (video) video.srcObject = null;
  }

  function ensureOvertimeLayer() {
    let layer = document.getElementById("overtimeLayer");
    if (layer) return layer;
    layer = document.createElement("section");
    layer.id = "overtimeLayer";
    layer.className = "overtime-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <div class="overtime-backdrop" data-overtime-close></div>
      <article class="overtime-dialog" role="dialog" aria-modal="true">
        <button class="overtime-close" type="button" data-overtime-close>×</button>
        <header class="overtime-head">
          <button class="overtime-home" type="button" data-overtime-close>‹ 返回首頁</button>
          <div>
            <small>OVERTIME CLOCK</small>
            <h2>加班打卡系統</h2>
          </div>
          <time id="overtimeNow">${formatTime()}</time>
        </header>
        <div class="overtime-steps" id="overtimeSteps"></div>
        <main class="overtime-body" id="overtimeBody"></main>
      </article>
    `;
    document.querySelector(".attendance-canvas")?.appendChild(layer);
    layer.addEventListener("click", handleOvertimeClick);
    layer.addEventListener("input", handleOvertimeInput);
    layer.addEventListener("change", handleOvertimeChange);
    return layer;
  }

  function overtimeSteps(flow = overtimeState.flow, active = 1) {
    const steps = flow === "out"
      ? ["輸入工號", "打加班下班卡", "確認完成"]
      : ["輸入工號", "選擇加班原因", "加班須知", "確認打卡"];
    return steps.map((label, index) => `
      <span class="${index + 1 <= active ? "active" : ""}">
        <b>${index + 1}</b>
        <em>${label}</em>
      </span>
    `).join("");
  }

  function showOvertimeStep(name) {
    const layer = ensureOvertimeLayer();
    const body = layer.querySelector("#overtimeBody");
    const steps = layer.querySelector("#overtimeSteps");
    const currentRecord = getTodayOvertime(overtimeState.employeeId);
    layer.querySelector("#overtimeNow").textContent = formatTime();
    stopOvertimeCamera();

    if (name === "input") {
      overtimeState.flow = "in";
      steps.innerHTML = overtimeSteps("in", 1);
      body.innerHTML = `
        <section class="overtime-card overtime-input-card">
          <img class="overtime-step-icon" src="images/輸入公號拷貝.png" alt="">
          <h3>請輸入您的員工工號</h3>
          <p>系統會依今天打卡狀態判斷可進行加班上班或加班下班。</p>
          <input id="overtimeEmployeeId" inputmode="numeric" maxlength="8" placeholder="請輸入員工工號" value="${overtimeState.employeeId}">
          <div class="overtime-keypad" id="overtimeKeypad">
            ${["1","2","3","4","5","6","7","8","9","清除","0","⌫"].map(key => `<button type="button" data-ot-key="${key}">${key}</button>`).join("")}
          </div>
          <span class="overtime-error" id="overtimeError"></span>
          <button class="overtime-primary" type="button" data-overtime-action="check-employee">下一步 <b>›</b></button>
        </section>
      `;
      return;
    }

    if (name === "guide-clockout") {
      steps.innerHTML = overtimeSteps("in", 1);
      body.innerHTML = `
        <section class="overtime-card overtime-guide-card">
          <span class="overtime-icon">!</span>
          <h3>請先完成下班打卡</h3>
          <p>員工 ${overtimeState.employeeId} 今天已有上班卡，但尚未打下班卡。請先打下班卡，再回來打加班上班卡。</p>
          <button class="overtime-primary" type="button" data-overtime-action="go-clockout">前往下班打卡</button>
        </section>
      `;
      return;
    }

    if (name === "already-done") {
      steps.innerHTML = overtimeSteps("out", 3);
      body.innerHTML = `
        <section class="overtime-card overtime-guide-card">
          <span class="overtime-check">✓</span>
          <h3>今日加班打卡已完成</h3>
          <p>員工 ${overtimeState.employeeId} 今天已完成加班上班卡與加班下班卡，不可重複打卡。</p>
          <button class="overtime-primary" type="button" data-overtime-close>返回首頁</button>
        </section>
      `;
      return;
    }

    if (name === "reason") {
      steps.innerHTML = overtimeSteps("in", 2);
      const reasons = [
        ["專案趕工", "因專案進度需求，需延長工作時間"],
        ["臨時任務", "臨時交辦或突發任務處理"],
        ["會議延後", "會議或討論延後，需持續處理"],
        ["系統維護", "系統維護或異常排除作業"],
        ["其他原因", "其他特殊原因，請備註說明"]
      ];
      body.innerHTML = `
        <section class="overtime-card overtime-reason-card">
          <h3>請選擇加班原因</h3>
          <p>請選擇本次加班的原因類型。</p>
          <div class="overtime-reason-grid">
            ${reasons.map(([title, desc]) => `
              <button class="${overtimeState.reason === title ? "selected" : ""}" type="button" data-overtime-reason="${title}">
                <strong>${title}</strong><span>${desc}</span><i></i>
              </button>
            `).join("")}
            <label class="overtime-note">
              <textarea id="overtimeNote" data-attendance-keyboard="zhuyin" maxlength="100" placeholder="如選擇其他原因，請簡要說明">${overtimeState.note}</textarea>
              <small><span id="overtimeNoteCount">${overtimeState.note.length}</span> / 100</small>
            </label>
          </div>
          <span class="overtime-error" id="overtimeError"></span>
          <button class="overtime-primary" type="button" data-overtime-action="open-time">選擇加班時間 <b>›</b></button>
        </section>
      `;
      return;
    }

    if (name === "time") {
      steps.innerHTML = overtimeSteps("in", 2);
      body.innerHTML = `
        <section class="overtime-time-shell">
          <article class="overtime-time-dialog">
            <h3>預計加班時間</h3>
            <div class="overtime-time-selects">
              ${overtimeTimePicker("start", "預計開始時間", overtimeState.plannedStart, overtimeStartOptions)}
              <span>~</span>
              ${overtimeTimePicker("end", "預計結束時間", overtimeState.plannedEnd, overtimeEndOptions)}
            </div>
            <div class="overtime-duration">
              <span>預計加班時數</span>
              <strong id="overtimeDuration">${overtimeDuration()}</strong>
            </div>
            <div class="overtime-actions">
              <button type="button" data-overtime-action="reason-back">返回上一步</button>
              <button class="overtime-primary" type="button" data-overtime-action="notice">下一步</button>
            </div>
          </article>
        </section>
      `;
      return;
    }

    if (name === "notice") {
      steps.innerHTML = overtimeSteps("in", 3);
      body.innerHTML = `
        <section class="overtime-card overtime-notice-card">
          <h3>加班須知</h3>
          <p>請詳閱以下注意事項。</p>
          <div class="overtime-notice-box">
            <article><strong>加班時間認定</strong><span>加班認定以實際打卡時間為準，請確實依規定時間進行打卡。</span></article>
            <article><strong>加班時數計算</strong><span>加班時數將依公司規定計算並繼續納入薪資或補休統計。</span></article>
            <article><strong>加班申請紀錄</strong><span>系統將自動記錄加班班原因與時數，供主管審核及薪資結算使用。</span></article>
            <article><strong>注意事項</strong><span>如有異動請洽人資部門，請勿虛報或不實登錄加班。</span></article>
          </div>
          <label class="overtime-read-check"><input id="overtimeReadNotice" type="checkbox"> 我已詳閱並同意以上加班須知</label>
          <span class="overtime-error" id="overtimeError"></span>
          <div class="overtime-actions">
            <button type="button" data-overtime-action="time-back">返回上一步</button>
            <button class="overtime-primary is-disabled" type="button" data-overtime-action="review-in" disabled>我已了解，下一步</button>
          </div>
        </section>
      `;
      return;
    }

    if (name === "review-in") {
      steps.innerHTML = overtimeSteps("in", 4);
      body.innerHTML = `
        <section class="overtime-card overtime-review-card">
          <h3>確認打卡資訊</h3>
          <p>請確認以下資訊是否正確。</p>
          ${overtimeInfoTable([
            ["員工工號", overtimeState.employeeId],
            ["加班原因", overtimeState.reason],
            ["加班日期", todayLabel()],
            ["預計加班時間", `${overtimeState.plannedStart} ~ ${overtimeState.plannedEnd}`],
            ["備註", overtimeState.note || "-"]
          ])}
          <div class="overtime-reminder"><strong>提醒您</strong><span>確認打卡後，系統將自動記錄您的加班時間。</span></div>
          <div class="overtime-actions">
            <button type="button" data-overtime-action="notice-back">返回上一步</button>
            <button class="overtime-primary" type="button" data-overtime-action="face-in">確認上班打卡</button>
          </div>
        </section>
      `;
      return;
    }

    if (name === "face") {
      steps.innerHTML = overtimeSteps("in", 4);
      body.innerHTML = `
        <section class="overtime-face-card">
          <div class="overtime-face-frame">
            <video id="overtimeFaceVideo" autoplay playsinline muted></video>
            <span></span><i></i>
            <p id="overtimeFaceHint">請將臉部對準螢幕中央並保持自然表情</p>
          </div>
          <div>
            <h3>準備進行人臉辨識</h3>
            <p>請保持臉部在畫面中，系統正在開啟 IP Cam 進行身分確認。</p>
            <button class="overtime-primary" id="overtimeFaceStart" type="button" data-overtime-action="start-face">開始辨識</button>
          </div>
        </section>
      `;
      return;
    }

    if (name === "review-out") {
      overtimeState.flow = "out";
      steps.innerHTML = overtimeSteps("out", 2);
      const record = currentRecord || {};
      body.innerHTML = `
        <section class="overtime-card overtime-review-card">
          <h3>打加班下班卡</h3>
          <p>請確認以下資訊，並進行打卡。</p>
          ${overtimeInfoTable([
            ["員工工號", overtimeState.employeeId],
            ["加班原因", record.reason || overtimeState.reason],
            ["加班上班時間", `${shortDate()}　${record.clockInTime || "-"}`],
            ["預計結束時間", `${shortDate()}　${record.plannedEnd || overtimeState.plannedEnd}`],
            ["目前時間", `${shortDate()}　${formatTime()}`]
          ])}
          <button class="overtime-primary" type="button" data-overtime-action="clock-out">確認打卡</button>
          <div class="overtime-reminder"><strong>提醒您</strong><span>打卡後系統將記錄您的加班結束時間。</span></div>
        </section>
      `;
      return;
    }

    if (name === "success-in" || name === "success-out") {
      const isOut = name === "success-out";
      overtimeState.flow = isOut ? "out" : "in";
      steps.innerHTML = overtimeSteps(overtimeState.flow, isOut ? 3 : 4);
      const record = getTodayOvertime(overtimeState.employeeId) || {};
      body.innerHTML = `
        <section class="overtime-card overtime-success-card">
          <span class="overtime-check">✓</span>
          <h3>${isOut ? "確認完成！" : "加班上班卡打卡成功！"}</h3>
          <p>${isOut ? "您的加班下班卡已成功紀錄" : "感謝您的辛勤付出"}</p>
          ${overtimeInfoTable(isOut ? [
            ["員工工號", overtimeState.employeeId],
            ["加班原因", record.reason || overtimeState.reason],
            ["加班上班時間", `${shortDate()}　${record.clockInTime || "-"}`],
            ["加班下班時間", `${shortDate()}　${record.clockOutTime || formatTime()}`],
            ["實際加班時數", record.actualDuration || overtimeDuration(record.clockInTime, record.clockOutTime || formatTime())],
            ["打卡時間", `${shortDate()}　${record.clockOutTime || formatTime()}`]
          ] : [
            ["打卡類型", "加班上班卡"],
            ["打卡時間", `${shortDate()}　${record.clockInTime || formatTime()}`],
            ["員工工號", overtimeState.employeeId],
            ["加班原因", record.reason || overtimeState.reason]
          ])}
          <p class="overtime-auto-text">系統將於 10 秒後自動返回首頁</p>
          <button class="overtime-primary" type="button" data-overtime-close>返回首頁</button>
        </section>
      `;
      window.clearTimeout(overtimeTimer);
      overtimeTimer = window.setTimeout(goHome, 10000);
    }
  }

  function overtimeInfoTable(rows) {
    return `<dl class="overtime-table">${rows.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join("")}</dl>`;
  }

  async function startOvertimeFace() {
    const button = document.getElementById("overtimeFaceStart");
    const hint = document.getElementById("overtimeFaceHint");
    const video = document.getElementById("overtimeFaceVideo");
    if (button) {
      button.disabled = true;
      button.textContent = "辨識中";
    }
    if (hint) hint.textContent = "正在開啟 IP Cam，請允許瀏覽器使用攝影機。";
    try {
      if (navigator.mediaDevices?.getUserMedia && video) {
        stopOvertimeCamera();
        overtimeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        video.srcObject = overtimeStream;
        await video.play().catch(() => {});
      }
      if (hint) hint.textContent = "IP Cam 已開啟，正在比對人臉資料。";
    } catch (error) {
      console.warn("加班人臉辨識相機開啟失敗", error);
      if (hint) hint.textContent = "相機權限未開啟，仍以 demo 流程進行認證。";
    }
    window.clearTimeout(overtimeTimer);
    overtimeTimer = window.setTimeout(() => {
      const now = new Date();
      const time = formatTime(now);
      saveTodayOvertime(overtimeState.employeeId, {
        employeeId: overtimeState.employeeId,
        reason: overtimeState.reason,
        note: overtimeState.note,
        plannedStart: overtimeState.plannedStart,
        plannedEnd: overtimeState.plannedEnd,
        clockInTime: time,
        status: "加班中"
      });
      stopOvertimeCamera();
      showOvertimeStep("success-in");
    }, 3000);
  }

  function openOvertime() {
    const layer = ensureOvertimeLayer();
    stopCamera();
    overtimeState.employee = null;
    overtimeState.employeeId = "";
    overtimeState.flow = "in";
    overtimeState.reason = "專案趕工";
    overtimeState.note = "";
    overtimeState.plannedStart = "18:45";
    overtimeState.plannedEnd = "21:30";
    overtimeState.clockInTime = "";
    showOvertimeStep("input");
    layer.classList.add("open");
    layer.setAttribute("aria-hidden", "false");
  }

  function closeOvertime() {
    const layer = document.getElementById("overtimeLayer");
    stopOvertimeCamera();
    if (!layer) return;
    layer.classList.remove("open");
    layer.setAttribute("aria-hidden", "true");
  }

  function checkOvertimeEmployee() {
    const input = document.getElementById("overtimeEmployeeId");
    const error = document.getElementById("overtimeError");
    const id = (input?.value || "").trim();
    if (!/^\d{4,8}$/.test(id)) {
      if (error) error.textContent = "請輸入 4 到 8 位數字工號";
      input?.focus();
      return;
    }
    const employee = getMockEmployeeById(id);
    if (!employee) {
      if (error) error.textContent = "查無此員工工號，請輸入系統內員工";
      return;
    }
    overtimeState.employee = employee;
    overtimeState.employeeId = employee.id;

    if (!getTodayAttendance(employee.id, "上班打卡")) {
      if (error) error.textContent = "請先完成上班打卡後，再申請加班。";
      return;
    }
    if (!getTodayAttendance(employee.id, "下班打卡")) {
      showOvertimeStep("guide-clockout");
      return;
    }

    const overtime = getTodayOvertime(employee.id);
    if (overtime?.clockOutTime) {
      showOvertimeStep("already-done");
      return;
    }
    if (overtime?.clockInTime) {
      overtimeState.flow = "out";
      overtimeState.reason = overtime.reason || overtimeState.reason;
      overtimeState.note = overtime.note || "";
      overtimeState.plannedStart = overtime.plannedStart || overtimeState.plannedStart;
      overtimeState.plannedEnd = overtime.plannedEnd || overtimeState.plannedEnd;
      overtimeState.clockInTime = overtime.clockInTime;
      showOvertimeStep("review-out");
      return;
    }
    overtimeState.flow = "in";
    showOvertimeStep("reason");
  }

  function goClockOutFromOvertime() {
    closeOvertime();
    currentMode = "下班打卡";
    modeSwitch?.querySelectorAll("button").forEach(button => {
      button.classList.toggle("selected", button.dataset.mode === currentMode);
    });
    employeeId.value = overtimeState.employeeId;
    employeeError.textContent = "請先完成下班打卡，再回來打加班上班卡。";
    employeeId.focus();
  }

  function validateOvertimeReason() {
    const note = (document.getElementById("overtimeNote")?.value || "").trim();
    overtimeState.note = note;
    const error = document.getElementById("overtimeError");
    if (overtimeState.reason === "其他原因" && !note) {
      if (error) error.textContent = "選擇其他原因時，請先填寫說明。";
      document.getElementById("overtimeNote")?.focus();
      return false;
    }
    if (error) error.textContent = "";
    return true;
  }

  function finishOvertimeOut() {
    const overtime = getTodayOvertime(overtimeState.employeeId);
    if (!overtime?.clockInTime) {
      showOvertimeStep("input");
      return;
    }
    const time = formatTime();
    saveTodayOvertime(overtimeState.employeeId, {
      clockOutTime: time,
      actualDuration: overtimeDuration(overtime.clockInTime, time),
      status: "已完成"
    });
    showOvertimeStep("success-out");
  }

  function handleOvertimeClick(event) {
    const closeButton = event.target.closest("[data-overtime-close]");
    if (closeButton) {
      event.preventDefault();
      closeOvertime();
      return;
    }

    const reasonButton = event.target.closest("[data-overtime-reason]");
    if (reasonButton) {
      overtimeState.reason = reasonButton.dataset.overtimeReason;
      document.querySelectorAll("[data-overtime-reason]").forEach(button => {
        button.classList.toggle("selected", button === reasonButton);
      });
      document.getElementById("overtimeError").textContent = "";
      return;
    }

    const keyButton = event.target.closest("[data-ot-key]");
    if (keyButton) {
      const input = document.getElementById("overtimeEmployeeId");
      if (!input) return;
      const key = keyButton.dataset.otKey;
      if (key === "清除") input.value = "";
      else if (key === "⌫") input.value = input.value.slice(0, -1);
      else input.value = (input.value + key).replace(/\D/g, "").slice(0, 8);
      document.getElementById("overtimeError").textContent = "";
      input.focus();
      return;
    }

    const timeToggle = event.target.closest("[data-time-toggle]");
    if (timeToggle) {
      const picker = timeToggle.closest("[data-time-picker]");
      if (!picker) return;
      const shouldOpen = !picker.classList.contains("open");
      closeOvertimeTimePickers(picker);
      picker.classList.toggle("open", shouldOpen);
      return;
    }

    const timeOption = event.target.closest("[data-time-option]");
    if (timeOption) {
      const picker = timeOption.closest("[data-time-picker]");
      const kind = picker?.dataset.timePicker;
      if (kind === "start") overtimeState.plannedStart = timeOption.dataset.timeOption;
      if (kind === "end") overtimeState.plannedEnd = timeOption.dataset.timeOption;
      closeOvertimeTimePickers();
      showOvertimeStep("time");
      return;
    }

    if (!event.target.closest(".overtime-time-picker")) closeOvertimeTimePickers();

    const actionButton = event.target.closest("[data-overtime-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.overtimeAction;
    if (action === "check-employee") checkOvertimeEmployee();
    if (action === "go-clockout") goClockOutFromOvertime();
    if (action === "open-time" && validateOvertimeReason()) showOvertimeStep("time");
    if (action === "reason-back") showOvertimeStep("reason");
    if (action === "notice") showOvertimeStep("notice");
    if (action === "time-back") showOvertimeStep("time");
    if (action === "notice-back") showOvertimeStep("notice");
    if (action === "review-in") {
      if (document.getElementById("overtimeReadNotice")?.checked) showOvertimeStep("review-in");
      else document.getElementById("overtimeError").textContent = "請先勾選已詳閱加班須知。";
    }
    if (action === "face-in") showOvertimeStep("face");
    if (action === "start-face") startOvertimeFace();
    if (action === "clock-out") finishOvertimeOut();
  }

  function handleOvertimeInput(event) {
    if (event.target.id === "overtimeEmployeeId") {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 8);
      const error = document.getElementById("overtimeError");
      if (error) error.textContent = "";
    }
    if (event.target.id === "overtimeNote") {
      overtimeState.note = event.target.value.trim();
      const count = document.getElementById("overtimeNoteCount");
      if (count) count.textContent = String(event.target.value.length);
    }
  }

  function handleOvertimeChange(event) {
    if (event.target.id === "overtimeReadNotice") {
      const button = document.querySelector('[data-overtime-action="review-in"]');
      const checked = event.target.checked;
      if (button) {
        button.disabled = !checked;
        button.classList.toggle("is-disabled", !checked);
      }
      const error = document.getElementById("overtimeError");
      if (checked && error) error.textContent = "";
    }
  }

  modeSwitch?.addEventListener("click", event => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    currentMode = button.dataset.mode;
    modeSwitch.querySelectorAll("button").forEach(item => item.classList.toggle("selected", item === button));
  });

  employeeId?.addEventListener("input", () => {
    employeeId.value = employeeId.value.replace(/\D/g, "").slice(0, 8);
    employeeError.textContent = "";
  });

  keypad?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "clear") {
      employeeId.value = "";
    } else if (action === "delete") {
      employeeId.value = employeeId.value.slice(0, -1);
    } else if (/^\d$/.test(button.textContent.trim()) && employeeId.value.length < 8) {
      employeeId.value += button.textContent.trim();
    }
    employeeError.textContent = "";
    employeeId.focus();
  });

  attendanceSubmit?.addEventListener("click", openFaceCheck);
  faceBack?.addEventListener("click", () => {
    stopCamera();
    if (faceConfirm) {
      faceConfirm.disabled = false;
      faceConfirm.textContent = "辨識完成，確認資料";
    }
    setLayer(faceLayer, false);
  });
  faceConfirm?.addEventListener("click", openReview);
  reviewEdit?.addEventListener("click", () => setLayer(reviewLayer, false));
  reviewSubmit?.addEventListener("click", finishAttendance);
  overtimeEntry?.addEventListener("click", openOvertime);
  backButton?.addEventListener("click", goHome);
  successBack?.addEventListener("click", goHome);
  successBackTop?.addEventListener("click", goHome);

  updateClock();
  window.setInterval(updateClock, 1000 * 20);
  window.addEventListener("beforeunload", stopCamera);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCamera();
  });
})();
