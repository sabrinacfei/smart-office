(() => {
  const editableSelector = "input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='date']):not([type='time']):not([type='month']):not([type='week']), textarea";

  const initials = new Set("ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ".split(""));
  const medials = new Set(["ㄧ", "ㄨ", "ㄩ"]);
  const finals = new Set(["ㄚ", "ㄛ", "ㄜ", "ㄝ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄢ", "ㄣ", "ㄤ", "ㄥ", "ㄦ"]);
  const toneKeys = { "2": "ˊ", "3": "ˇ", "4": "ˋ", "6": "ˊ", "7": "˙" };

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

  const englishKeyboardLayout = [
    [
      { en: "1", shift: "1", num: "1" },
      { en: "2", shift: "2", num: "2" },
      { en: "3", shift: "3", num: "3" },
      { en: "4", shift: "4", num: "4" },
      { en: "5", shift: "5", num: "5" },
      { en: "6", shift: "6", num: "6" },
      { en: "7", shift: "7", num: "7" },
      { en: "8", shift: "8", num: "8" },
      { en: "9", shift: "9", num: "9" },
      { en: "0", shift: "0", num: "0" },
      { action: "backspace", label: "⌫", special: true }
    ],
    [
      { en: "q", shift: "Q" },
      { en: "w", shift: "W" },
      { en: "e", shift: "E" },
      { en: "r", shift: "R" },
      { en: "t", shift: "T" },
      { en: "y", shift: "Y" },
      { en: "u", shift: "U" },
      { en: "i", shift: "I" },
      { en: "o", shift: "O" },
      { en: "p", shift: "P" }
    ],
    [
      { action: "caps", label: "Caps", special: true },
      { en: "a", shift: "A" },
      { en: "s", shift: "S" },
      { en: "d", shift: "D" },
      { en: "f", shift: "F" },
      { en: "g", shift: "G" },
      { en: "h", shift: "H" },
      { en: "j", shift: "J" },
      { en: "k", shift: "K" },
      { en: "l", shift: "L" }
    ],
    [
      { en: "z", shift: "Z" },
      { en: "x", shift: "X" },
      { en: "c", shift: "C" },
      { en: "v", shift: "V" },
      { en: "b", shift: "B" },
      { en: "n", shift: "N" },
      { en: "m", shift: "M" },
      { en: ".", shift: "." },
      { en: ",", shift: "," }
    ],
    [
      { action: "toggleLang", label: "中/英", special: true },
      { action: "space", label: "空白", special: true, space: true },
      { action: "done", label: "完成", special: true }
    ]
  ];

  let target = null;
  let keyboardMode = "zhuyin";
  let zhuyinBuffer = "";
  let zhuyinParts = { initial: "", medial: "", final: "", tone: "" };
  let capsLock = false;

  const keyboard = document.createElement("section");
  keyboard.className = "touch-keyboard is-zhuyin";
  keyboard.setAttribute("aria-label", "觸控鍵盤");
  keyboard.innerHTML = `
    <div class="keyboard-top">
      <strong class="keyboard-title">觸控鍵盤</strong>
      <div class="keyboard-mode-tabs">
        <button type="button" data-kb-mode="zhuyin">注音</button>
        <button type="button" data-kb-mode="english">英</button>
      </div>
      <button type="button" class="keyboard-hide" data-command="finish">收起</button>
    </div>
    <div class="zhuyin-compose"></div>
    <div class="candidate-row"></div>
    <div class="keyboard-keys"></div>
  `;
  document.body.append(keyboard);

  const keysNode = keyboard.querySelector(".keyboard-keys");
  const candidateRow = keyboard.querySelector(".candidate-row");
  const zhuyinCompose = keyboard.querySelector(".zhuyin-compose");
  const modeButtons = [...keyboard.querySelectorAll("[data-kb-mode]")];

  function activeKeyboardLayout() {
    return keyboardMode === "english" ? englishKeyboardLayout : zhuyinKeyboardLayout;
  }

  function normalizeBpmfKey(key) {
    return String(key || "")
      .replace(/\s+/g, "")
      .replace(/一/g, "ㄧ")
      .replace(/ˉ/g, "")
      .replace(/ā/g, "");
  }

  function getCandidates(buffer) {
    const dict = window.BPMF_DICTIONARY || Object.create(null);
    const exact = normalizeBpmfKey(buffer);
    const base = exact.replace(/[ˊˇˋ˙]/g, "");
    const list = [];

    if (dict[exact]) list.push(...dict[exact]);
    if (!/[ˊˇˋ˙]/.test(exact) && dict[base]) list.push(...dict[base]);
    if (!list.length) {
      Object.keys(dict).some(key => {
        if (normalizeBpmfKey(key).replace(/[ˊˇˋ˙]/g, "") === base) list.push(...dict[key]);
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

  function rebuildBuffer() {
    return `${zhuyinParts.initial}${zhuyinParts.medial}${zhuyinParts.final}${zhuyinParts.tone}`;
  }

  function resetZhuyin() {
    zhuyinParts = { initial: "", medial: "", final: "", tone: "" };
    zhuyinBuffer = "";
  }

  function isNumericTarget() {
    if (!target) return false;
    const key = `${target.type || ""} ${target.inputMode || ""} ${target.name || ""} ${target.id || ""} ${target.dataset.touchKeyboard || ""}`;
    return /tel|number|numeric|phone|time|date|id|no/i.test(key);
  }

  function preferredMode(input) {
    const explicit = input?.dataset?.keyboard || input?.dataset?.touchKeyboard || "";
    if (/number|numeric|english/i.test(explicit)) return "english";
    const key = `${input?.type || ""} ${input?.inputMode || ""} ${input?.name || ""} ${input?.id || ""}`;
    if (/tel|number|numeric|phone|time|date|id|no/i.test(key)) return "english";
    return "zhuyin";
  }

  function maxLength() {
    const length = Number(target?.maxLength || -1);
    return length > 0 ? length : Infinity;
  }

  function dispatchInput() {
    target?.dispatchEvent(new Event("input", { bubbles: true }));
    target?.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function insertText(text) {
    if (!target || !text) return;
    const value = String(text);
    if (isNumericTarget() && !/^\d+$/.test(value)) return;

    target.focus({ preventScroll: true });
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const available = maxLength() - (target.value.length - (end - start));
    if (available <= 0) return;
    const nextText = value.slice(0, available);
    target.value = target.value.slice(0, start) + nextText + target.value.slice(end);
    const caret = start + nextText.length;
    target.setSelectionRange?.(caret, caret);
    dispatchInput();
  }

  function updateZhuyinCandidates() {
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
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${index === 0 ? "1 " : ""}${word}`;
        button.addEventListener("pointerdown", event => event.preventDefault());
        button.addEventListener("click", () => commitCandidate(word));
        candidateRow.appendChild(button);
      });
    } else if (zhuyinBuffer) {
      const raw = document.createElement("button");
      raw.type = "button";
      raw.textContent = "送出注音";
      raw.addEventListener("pointerdown", event => event.preventDefault());
      raw.addEventListener("click", commitRawZhuyin);
      candidateRow.appendChild(raw);
    }
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
    commitCandidate(getCandidates(zhuyinBuffer)[0] || zhuyinBuffer);
  }

  function commitRawZhuyin() {
    if (!zhuyinBuffer) return;
    insertText(zhuyinBuffer);
    resetZhuyin();
    updateZhuyinCandidates();
  }

  function setZhuyinTone(tone) {
    if (!zhuyinBuffer) return;
    zhuyinParts.tone = tone;
    zhuyinBuffer = rebuildBuffer();
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
    zhuyinBuffer = rebuildBuffer();
    updateZhuyinCandidates();
  }

  function backspace() {
    if (!target) return;
    if (keyboardMode === "zhuyin" && zhuyinBuffer) {
      if (zhuyinParts.tone) zhuyinParts.tone = "";
      else if (zhuyinParts.final) zhuyinParts.final = "";
      else if (zhuyinParts.medial) zhuyinParts.medial = "";
      else if (zhuyinParts.initial) zhuyinParts.initial = "";
      zhuyinBuffer = rebuildBuffer();
      updateZhuyinCandidates();
      return;
    }

    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    if (start !== end) {
      target.value = target.value.slice(0, start) + target.value.slice(end);
      target.setSelectionRange?.(start, start);
    } else if (start > 0) {
      target.value = target.value.slice(0, start - 1) + target.value.slice(start);
      target.setSelectionRange?.(start - 1, start - 1);
    }
    dispatchInput();
  }

  function renderKeyContent(key) {
    if (key.special && key.action === "caps") return capsLock ? "CAPS" : key.label;
    if (key.special) return key.label;
    const en = capsLock ? (key.shift || key.en || "").toUpperCase() : (key.en || "");
    if (keyboardMode === "english") return `<span class="kb-en">${en}</span>`;
    return `
      <span class="kb-zh">${key.zh || ""}</span>
      <span class="kb-en">${key.en || ""}</span>
      ${key.num ? `<span class="kb-num">${key.num}</span>` : ""}
      ${key.tone ? `<span class="kb-tone">${key.tone}</span>` : ""}
    `;
  }

  function keyClass(key) {
    const classes = [];
    if (key.special) classes.push("kb-special");
    if (key.space) classes.push("kb-space");
    if (key.action === "caps" && capsLock) classes.push("active");
    return classes.join(" ");
  }

  function render() {
    modeButtons.forEach(button => button.classList.toggle("active", button.dataset.kbMode === keyboardMode));
    keyboard.classList.toggle("is-zhuyin", keyboardMode === "zhuyin");
    keyboard.classList.toggle("is-english", keyboardMode === "english");
    keysNode.innerHTML = activeKeyboardLayout().map((row, index) => `
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
    updateZhuyinCandidates();
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
    keyboard.style.width = `${Math.max(320, Math.min(620, rect.width - 32))}px`;
    keyboard.style.maxHeight = `${Math.max(220, Math.min(292, rect.height - 28))}px`;
  }

  function keepTargetVisible() {
    if (!target || !keyboard.classList.contains("is-open")) return;

    const targetRect = target.getBoundingClientRect();
    const keyboardRect = keyboard.getBoundingClientRect();
    const overlap = targetRect.bottom + 18 - keyboardRect.top;
    if (overlap <= 0) return;

    const scroller = target.closest(".schedule-scroll, .employee-screen, .visitor-screen, .delivery-screen, .lunch-screen, .emergency-screen, .attendance-screen, .health-screen");
    if (scroller && scroller.scrollHeight > scroller.clientHeight) {
      scroller.scrollTo({
        top: Math.min(scroller.scrollTop + overlap + 18, scroller.scrollHeight - scroller.clientHeight),
        behavior: "smooth"
      });
      return;
    }

    window.scrollBy({ top: overlap + 18, behavior: "smooth" });
  }

  function open(input) {
    if (input.readOnly && !input.dataset.touchKeyboard) return;
    const sameInput = keyboard.classList.contains("is-open") && target === input;
    target = input;
    if (!sameInput) {
      keyboardMode = preferredMode(input);
      resetZhuyin();
      capsLock = false;
    }
    render();
    updateKeyboardFrame();
    document.body.classList.add("touch-keyboard-open");
    keyboard.classList.add("is-open");
    window.setTimeout(keepTargetVisible, 40);
  }

  function close() {
    keyboard.classList.remove("is-open");
    document.body.classList.remove("touch-keyboard-open");
    resetZhuyin();
    updateZhuyinCandidates();
    target = null;
  }

  function pressKey(button) {
    const action = button.dataset.action;
    if (action === "toggleLang") {
      keyboardMode = keyboardMode === "english" ? "zhuyin" : "english";
      resetZhuyin();
      render();
      return;
    }
    if (action === "caps") {
      capsLock = !capsLock;
      render();
      return;
    }
    if (action === "backspace") {
      backspace();
      return;
    }
    if (action === "done") {
      if (keyboardMode === "zhuyin" && zhuyinBuffer) commitFirstCandidate();
      close();
      return;
    }
    if (action === "space") {
      if (keyboardMode === "zhuyin") commitFirstCandidate();
      else insertText(" ");
      return;
    }

    if (keyboardMode === "english") {
      insertText(capsLock ? (button.dataset.shift || button.dataset.en || "").toUpperCase() : (button.dataset.en || ""));
      return;
    }

    const num = button.dataset.num;
    if (zhuyinBuffer && num && toneKeys[num]) {
      setZhuyinTone(toneKeys[num]);
      return;
    }
    if (button.dataset.zh) addZhuyin(button.dataset.zh);
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

  keyboard.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) event.preventDefault();
  });

  keyboard.addEventListener("click", event => {
    const finish = event.target.closest("[data-command='finish']");
    if (finish) {
      close();
      return;
    }

    const modeButton = event.target.closest("[data-kb-mode]");
    if (modeButton) {
      keyboardMode = modeButton.dataset.kbMode === "english" ? "english" : "zhuyin";
      resetZhuyin();
      render();
      return;
    }

    const key = event.target.closest(".keyboard-keys button");
    if (key) pressKey(key);
  });

  window.addEventListener("resize", () => {
    updateKeyboardFrame();
    keepTargetVisible();
  });
  window.addEventListener("scroll", updateKeyboardFrame, true);
  window.addEventListener("bpmf-dictionary-ready", () => {
    if (keyboard.classList.contains("is-open")) render();
  });
})();
