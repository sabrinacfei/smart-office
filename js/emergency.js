(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];
  const views = {
    choice: document.getElementById("choiceView"),
    pin: document.getElementById("pinView"),
    face: document.getElementById("faceView"),
    call: document.getElementById("callView"),
    done: document.getElementById("doneView")
  };
  const emergencyTime = document.getElementById("emergencyTime");
  const emergencyDate = document.getElementById("emergencyDate");
  const doneTime = document.getElementById("doneTime");
  const pinDots = Array.from(document.querySelectorAll("#pinDots i"));
  const pinError = document.getElementById("pinError");
  const pinTitle = document.getElementById("pinTitle");
  const pinKicker = document.getElementById("pinKicker");
  const doneTitle = document.getElementById("doneTitle");
  const doneStatus = document.getElementById("doneStatus");
  const doneIcon = document.getElementById("doneIcon");
  const faceStart = document.getElementById("faceStart");
  const faceVideo = document.getElementById("emergencyFaceVideo");
  const faceHint = document.getElementById("emergencyFaceHint");
  const lockIcon = '<svg viewBox="0 0 64 64"><path d="M18 29v-8c0-8 6-14 14-14s14 6 14 14v8"/><rect x="13" y="29" width="38" height="27" rx="6"/><path d="M32 40v7"/></svg>';
  const unlockIcon = '<svg viewBox="0 0 64 64"><path d="M18 29v-7c0-8 6-14 14-14 6 0 11 4 13 9"/><rect x="13" y="29" width="38" height="27" rx="6"/><path d="M32 40v7"/></svg>';
  let action = "lock";
  let pin = "";
  let faceStream = null;
  let faceTimer = null;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateClock() {
    const now = new Date();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const day = weekdayShort[now.getDay()];
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    emergencyTime.textContent = time;
    emergencyDate.textContent = `${month}/${date}（${day}）`;
    doneTime.textContent = time;
  }

  function show(name) {
    if (name !== "face") stopFaceCamera();
    Object.entries(views).forEach(([key, view]) => {
      const active = key === name;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", String(!active));
    });
  }

  function stopFaceCamera() {
    window.clearTimeout(faceTimer);
    faceTimer = null;
    if (faceStream) {
      faceStream.getTracks().forEach(track => track.stop());
      faceStream = null;
    }
    if (faceVideo) faceVideo.srcObject = null;
  }

  function completeDoorAction() {
    stopFaceCamera();
    const isLock = action === "lock";
    doneTitle.textContent = isLock ? "大門已上鎖" : "大門已解鎖";
    doneStatus.textContent = isLock ? "上鎖完成" : "解鎖完成";
    doneIcon.classList.toggle("locked", isLock);
    doneIcon.classList.toggle("unlocked", !isLock);
    doneIcon.innerHTML = isLock ? lockIcon : unlockIcon;
    updateClock();
    show("done");
  }

  async function startFaceVerification() {
    if (faceStart) {
      faceStart.disabled = true;
      faceStart.textContent = "辨識中";
    }
    if (faceHint) faceHint.textContent = "正在開啟 IP Cam，請允許瀏覽器使用攝影機。";
    try {
      if (navigator.mediaDevices?.getUserMedia && faceVideo) {
        stopFaceCamera();
        faceStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        faceVideo.srcObject = faceStream;
        await faceVideo.play().catch(() => {});
      }
      if (faceHint) faceHint.textContent = "IP Cam 已開啟，正在比對人臉資料。";
    } catch (error) {
      console.warn("緊急門禁人臉辨識相機開啟失敗", error);
      if (faceHint) faceHint.textContent = "相機權限未開啟，仍以 demo 流程進行認證。";
    }
    window.clearTimeout(faceTimer);
    faceTimer = window.setTimeout(completeDoorAction, 3000);
  }

  function renderPin() {
    pinDots.forEach((dot, index) => dot.classList.toggle("filled", index < pin.length));
    pinError.textContent = "";
  }

  document.querySelectorAll(".emergency-card").forEach(card => {
    card.addEventListener("click", () => {
      action = card.dataset.action;
      card.animate?.(
        [{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }, { transform: "translateY(0)" }],
        { duration: 220, easing: "ease-out" }
      );
      if (action === "call") {
        show("call");
        return;
      }
      pin = "";
      renderPin();
      const isLock = action === "lock";
      pinTitle.textContent = isLock ? "輸入上鎖授權碼" : "輸入解鎖授權碼";
      pinKicker.textContent = isLock ? "SECURITY LOCK" : "SECURITY UNLOCK";
      show("pin");
    });
  });

  document.querySelectorAll(".section-back").forEach(button => {
    button.addEventListener("click", () => show(button.dataset.back));
  });

  document.getElementById("pinPad").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const buttonAction = button.dataset.action;
    if (buttonAction === "clear") pin = "";
    else if (buttonAction === "delete") pin = pin.slice(0, -1);
    else pin = (pin + button.textContent.trim()).replace(/\D/g, "").slice(0, 6);
    button.animate?.([{ transform: "scale(1)" }, { transform: "scale(.92)" }, { transform: "scale(1)" }], { duration: 150 });
    renderPin();
  });

  document.getElementById("pinConfirm").addEventListener("click", () => {
    if (pin.length !== 6) {
      pinError.textContent = "請輸入 6 碼授權碼";
      document.querySelector(".pin-card")?.animate?.(
        [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
        { duration: 260, easing: "ease-out" }
      );
      return;
    }
    show("face");
    startFaceVerification();
  });

  faceStart?.addEventListener("click", startFaceVerification);

  document.getElementById("endCall").addEventListener("click", () => show("choice"));

  updateClock();
  doneIcon.innerHTML = lockIcon;
  window.setInterval(updateClock, 1000 * 20);
  window.addEventListener("beforeunload", stopFaceCamera);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopFaceCamera();
  });
})();
