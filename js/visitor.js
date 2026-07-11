(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];
  const visitorTime = document.getElementById("visitorTime");
  const visitorDate = document.getElementById("visitorDate");
  const visitorForm = document.getElementById("visitorForm");
  const countButtons = Array.from(document.querySelectorAll(".count-options button"));
  const customSelects = Array.from(document.querySelectorAll(".custom-select"));
  const feedback = document.getElementById("visitorFeedback");
  const feedbackClose = document.getElementById("feedbackClose");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const requiredMessages = {
    visitorName: "請輸入訪客姓名",
    visitorPhone: "請輸入聯絡電話",
    visitorTarget: "請選擇來訪對象",
    visitReason: "請選擇來訪事由",
    leaveTime: "請選擇預計離開時間"
  };

  function closeAllSelects(except = null) {
    customSelects.forEach(select => {
      if (select !== except) {
        select.classList.remove("is-open");
      }
    });
  }

  customSelects.forEach(select => {
    const trigger = select.querySelector(".select-trigger");
    const triggerText = trigger.querySelector("span");
    const menuItems = Array.from(select.querySelectorAll(".select-menu li"));
    const hiddenInput = select.querySelector("input[type='hidden']");

    trigger.addEventListener("click", event => {
      event.stopPropagation();

      const willOpen = !select.classList.contains("is-open");
      closeAllSelects();

      if (willOpen) {
        select.classList.add("is-open");
      }
    });

    menuItems.forEach(item => {
      item.addEventListener("click", event => {
        event.stopPropagation();

        const value = item.dataset.value;

        triggerText.textContent = value;
        hiddenInput.value = value;
        clearFieldError(hiddenInput);

        menuItems.forEach(option => option.classList.remove("is-selected"));
        item.classList.add("is-selected");

        select.classList.remove("is-open");
      });
    });
  });

  document.addEventListener("click", () => {
    closeAllSelects();
  });

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateClock() {
    const now = new Date();
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const day = weekdayShort[now.getDay()];

    visitorTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    visitorDate.textContent = `${month}/${date} (${day})`;
  }

  function selectCount(button) {
    countButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("is-selected", active);
      item.setAttribute("aria-pressed", String(active));
    });
  }

  function getFieldControl(name) {
    return visitorForm.elements[name];
  }

  function getFieldRoot(control) {
    return control?.closest(".field");
  }

  function ensureErrorNode(root) {
    let node = root.querySelector(".field-error");
    if (!node) {
      node = document.createElement("p");
      node.className = "field-error";
      root.append(node);
    }
    return node;
  }

  function setFieldError(control, message) {
    const root = getFieldRoot(control);
    if (!root) return;
    root.classList.add("has-error");
    ensureErrorNode(root).textContent = message;
  }

  function clearFieldError(control) {
    const root = getFieldRoot(control);
    if (!root) return;
    root.classList.remove("has-error");
    const node = root.querySelector(".field-error");
    if (node) node.textContent = "";
  }

  function validateForm() {
    let firstInvalid = null;

    Object.keys(requiredMessages).forEach(name => {
      const control = getFieldControl(name);
      if (!control) return;
      const value = String(control.value || "").trim();
      if (!value) {
        setFieldError(control, requiredMessages[name]);
        firstInvalid ||= control;
      } else {
        clearFieldError(control);
      }
    });

    const phone = getFieldControl("visitorPhone");
    const phoneValue = String(phone?.value || "").trim();
    if (phoneValue && !/^09\d{8}$/.test(phoneValue)) {
      setFieldError(phone, "手機號碼需為 09 開頭，共 10 位數字");
      firstInvalid ||= phone;
    }

    if (firstInvalid) {
      const root = getFieldRoot(firstInvalid);
      root?.animate?.(
        [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
        { duration: 260, easing: "ease-out" }
      );
      root?.scrollIntoView?.({ block: "center", behavior: "smooth" });
    }

    return !firstInvalid;
  }

  function showFeedback() {
    const name = getFieldControl("visitorName")?.value.trim() || "訪客";
    feedbackMessage.textContent = `${name} 已完成訪客登記，請至櫃台領取訪客證。`;
    feedback.hidden = false;
    requestAnimationFrame(() => {
      feedback.classList.add("is-open");
      feedback.setAttribute("aria-hidden", "false");
    });
  }

  function hideFeedback() {
    feedback.classList.remove("is-open");
    feedback.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!feedback.classList.contains("is-open")) feedback.hidden = true;
    }, 180);
  }

  countButtons.forEach(button => {
    button.addEventListener("click", () => selectCount(button));
  });

  visitorForm.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      if (input.name === "visitorPhone") {
        input.value = input.value.replace(/\D/g, "").slice(0, 10);
      }
      clearFieldError(input);
    });
  });

  visitorForm.addEventListener("reset", () => {
    setTimeout(() => {
      selectCount(countButtons[0]);

      customSelects.forEach(select => {
        const triggerText = select.querySelector(".select-trigger span");
        const hiddenInput = select.querySelector("input[type='hidden']");
        const selectedItems = select.querySelectorAll(".select-menu li.is-selected");

        selectedItems.forEach(item => item.classList.remove("is-selected"));
        hiddenInput.value = "";

        if (select.dataset.name === "visitorTarget") {
          triggerText.textContent = "請選擇來訪對象";
        }

        if (select.dataset.name === "visitReason") {
          triggerText.textContent = "請選擇來訪事由";
        }

        if (select.dataset.name === "leaveTime") {
          triggerText.textContent = "請選擇預計離開時間";
        }

        select.classList.remove("is-open");
      });
      visitorForm.querySelectorAll(".field").forEach(field => {
        field.classList.remove("has-error");
        field.querySelector(".field-error")?.remove();
      });
    }, 0);
  });

  visitorForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateForm()) return;
    const submitButton = visitorForm.querySelector(".submit-button");
    submitButton.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-2px) scale(.985)" },
        { transform: "translateY(0)" }
      ],
      { duration: 220, easing: "ease-out" }
    );
    showFeedback();
  });
  feedbackClose?.addEventListener("click", hideFeedback);

  updateClock();
  window.setInterval(updateClock, 1000 * 20);
})();
