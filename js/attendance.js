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

  let currentMode = "上班打卡";
  let cameraStream = null;
  let returnTimer = null;
  let returnSeconds = 10;

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

  function openFaceCheck() {
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
    startCamera();
  }

  function openReview() {
    const employee = getEmployee();
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
    setLayer(faceLayer, false);
  });
  faceConfirm?.addEventListener("click", openReview);
  reviewEdit?.addEventListener("click", () => setLayer(reviewLayer, false));
  reviewSubmit?.addEventListener("click", finishAttendance);
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
