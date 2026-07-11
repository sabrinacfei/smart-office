(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];
  const views = {
    choice: document.getElementById("choiceView"),
    pin: document.getElementById("pinView"),
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
  const lockIcon = '<svg viewBox="0 0 64 64"><path d="M18 29v-8c0-8 6-14 14-14s14 6 14 14v8"/><rect x="13" y="29" width="38" height="27" rx="6"/><path d="M32 40v7"/></svg>';
  const unlockIcon = '<svg viewBox="0 0 64 64"><path d="M18 29v-7c0-8 6-14 14-14 6 0 11 4 13 9"/><rect x="13" y="29" width="38" height="27" rx="6"/><path d="M32 40v7"/></svg>';
  let action = "lock";
  let pin = "";

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
    Object.entries(views).forEach(([key, view]) => {
      const active = key === name;
      view.classList.toggle("active", active);
      view.setAttribute("aria-hidden", String(!active));
    });
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
    const isLock = action === "lock";
    doneTitle.textContent = isLock ? "大門已上鎖" : "大門已解鎖";
    doneStatus.textContent = isLock ? "上鎖完成" : "解鎖完成";
    doneIcon.classList.toggle("locked", isLock);
    doneIcon.classList.toggle("unlocked", !isLock);
    doneIcon.innerHTML = isLock ? lockIcon : unlockIcon;
    updateClock();
    show("done");
  });

  document.getElementById("endCall").addEventListener("click", () => show("choice"));

  updateClock();
  doneIcon.innerHTML = lockIcon;
  window.setInterval(updateClock, 1000 * 20);
})();
