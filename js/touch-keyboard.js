(() => {
  const editableSelector = "input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='date']):not([type='time']):not([type='month']):not([type='week']), textarea";
  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Caps", "Z", "X", "C", "V", "B", "N", "M", ".", ","]
  ];

  let target = null;
  let draftText = "";
  let shiftOnce = false;

  const keyboard = document.createElement("section");
  keyboard.className = "touch-keyboard is-text";
  keyboard.setAttribute("aria-label", "觸控鍵盤");
  keyboard.innerHTML = `
    <div class="keyboard-head">
      <div class="keyboard-title">觸控鍵盤</div>
      <div class="keyboard-actions">
        <button type="button" data-command="finish">完成</button>
      </div>
    </div>
    <div class="keyboard-composer">
      <span>目前輸入</span>
      <strong id="keyboardComposition">請輸入英文或數字</strong>
    </div>
    <div class="keyboard-grid"></div>
  `;
  document.body.append(keyboard);

  const grid = keyboard.querySelector(".keyboard-grid");
  const compositionNode = keyboard.querySelector("#keyboardComposition");

  function dispatchInput() {
    target?.dispatchEvent(new Event("input", { bubbles: true }));
    target?.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function isNumericTarget() {
    if (!target) return false;
    const key = `${target.type || ""} ${target.inputMode || ""} ${target.name || ""} ${target.id || ""}`;
    return /tel|number|numeric|phone|time|date|id|no/i.test(key);
  }

  function maxLength() {
    const length = Number(target?.maxLength || -1);
    return length > 0 ? length : Infinity;
  }

  function insertIntoTarget(value) {
    if (!target || !value) return;
    target.focus({ preventScroll: true });
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const next = `${target.value.slice(0, start)}${value}${target.value.slice(end)}`;
    target.value = next.slice(0, maxLength());
    const caret = Math.min(start + value.length, target.value.length);
    target.setSelectionRange?.(caret, caret);
    dispatchInput();
  }

  function keyOutput(label) {
    if (label.length !== 1 || !/[A-Z]/.test(label)) return label;
    return shiftOnce ? label : label.toLowerCase();
  }

  function renderComposer() {
    compositionNode.textContent = draftText || "請輸入英文或數字";
    compositionNode.classList.toggle("is-empty", !draftText);
  }

  function appendDraft(value) {
    if (!value) return;
    if (isNumericTarget() && !/^\d+$/.test(value)) return;
    const allowed = maxLength() - (target?.value.length || 0);
    if (allowed <= 0) return;
    draftText += value.slice(0, allowed);
    renderComposer();
  }

  function removeDraft() {
    draftText = [...draftText].slice(0, -1).join("");
    renderComposer();
  }

  function clearDraft() {
    draftText = "";
    renderComposer();
  }

  function finishInput() {
    insertIntoTarget(draftText);
    draftText = "";
    close(false);
  }

  function makeKey(label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "keyboard-key";
    button.dataset.key = label;
    button.textContent = label;
    if (label === "空白") button.classList.add("is-space");
    if (["清除", "⌫", "Caps"].includes(label)) button.classList.add("is-muted");
    if (label === "Caps") button.classList.add("is-caps");
    if (label === "Caps" && shiftOnce) button.classList.add("is-active");
    return button;
  }

  function render() {
    grid.innerHTML = "";
    keyboard.classList.toggle("is-uppercase", shiftOnce);
    rows.forEach(row => {
      const wrapper = document.createElement("div");
      wrapper.className = "keyboard-row";
      wrapper.style.setProperty("--key-count", row.length);
      row.forEach(label => {
        const key = makeKey(label);
        if (label.length === 1 && /[A-Z]/.test(label)) key.textContent = shiftOnce ? label : label.toLowerCase();
        wrapper.append(key);
      });
      grid.append(wrapper);
    });

    const actions = document.createElement("div");
    actions.className = "keyboard-row action-row";
    actions.style.setProperty("--key-count", "6");
    ["清除", "空白", "⌫"].forEach(label => actions.append(makeKey(label)));
    grid.append(actions);
    renderComposer();
  }

  function updateKeyboardFrame() {
    const screen = target?.closest?.(".kiosk-screen, .visitor-screen, .delivery-screen, .employee-screen, .lunch-screen, .emergency-screen, .attendance-screen, .health-screen, .schedule-screen");
    const rect = screen?.getBoundingClientRect?.();
    if (!rect) {
      keyboard.style.left = "";
      keyboard.style.bottom = "";
      keyboard.style.width = "";
      keyboard.style.maxHeight = "";
      return;
    }

    keyboard.style.left = `${rect.left + rect.width / 2}px`;
    keyboard.style.bottom = `${Math.max(8, window.innerHeight - rect.bottom + 8)}px`;
    keyboard.style.width = `${Math.max(360, Math.min(760, rect.width - 24))}px`;
    keyboard.style.maxHeight = `${Math.max(240, Math.min(342, rect.height - 18))}px`;
  }

  function open(input) {
    if (input.readOnly && !input.dataset.touchKeyboard) return;
    target = input;
    draftText = "";
    shiftOnce = false;
    render();
    updateKeyboardFrame();
    keyboard.classList.add("is-open");
  }

  function close(clearDraftState = true) {
    keyboard.classList.remove("is-open");
    if (clearDraftState) clearDraft();
    target = null;
  }

  document.addEventListener("focusin", event => {
    const input = event.target.closest?.(editableSelector);
    if (!input || input.disabled) return;
    open(input);
  });

  document.addEventListener("pointerdown", event => {
    if (!keyboard.classList.contains("is-open")) return;
    if (event.target.closest(".touch-keyboard") || event.target.closest(editableSelector)) return;
    close();
  });

  keyboard.addEventListener("click", event => {
    if (event.target.closest("[data-command='finish']")) {
      finishInput();
      return;
    }

    const key = event.target.closest("[data-key]")?.dataset.key;
    if (!key) return;
    if (key === "⌫") removeDraft();
    else if (key === "清除") clearDraft();
    else if (key === "Caps") {
      shiftOnce = !shiftOnce;
      render();
    } else if (key === "空白") {
      appendDraft(" ");
    } else {
      appendDraft(keyOutput(key));
    }
  });

  window.addEventListener("resize", updateKeyboardFrame);
  window.addEventListener("scroll", updateKeyboardFrame, true);
})();
