(() => {
  const keyboard = document.getElementById("attendanceTouchKeyboard");
  if (!keyboard) return;

  const keyboardTitle = document.getElementById("attendanceKeyboardTitle");
  const keyboardKeys = document.getElementById("attendanceKeyboardKeys");
  const candidateRow = document.getElementById("attendanceCandidateRow");
  const zhuyinCompose = document.getElementById("attendanceZhuyinCompose");
  const modeButtons = [...document.querySelectorAll("[data-attendance-kb-mode]")];

  let keyboardTarget = null;
  let keyboardMode = "zhuyin";
  let zhuyinBuffer = "";
  let zhuyinParts = { initial: "", medial: "", final: "", tone: "" };
  let capsLock = false;

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

  function showKeyboardFor(input, mode = "zhuyin") {
    if (!input || input.disabled || input.readOnly || input.id !== "overtimeNote") return;
    const sameInput = !keyboard.hidden && keyboardTarget === input;
    keyboardTarget = input;
    if (!sameInput) {
      keyboardMode = mode === "english" ? "english" : "zhuyin";
      resetZhuyin();
    }
    keyboard.hidden = false;
    document.body.classList.add("attendance-keyboard-open");
    renderKeyboard();
    window.setTimeout(() => input.scrollIntoView({ block: "nearest", behavior: "smooth" }), 40);
  }

  function hideKeyboard() {
    keyboard.hidden = true;
    document.body.classList.remove("attendance-keyboard-open");
    resetZhuyin();
    updateZhuyinCandidates();
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

  function renderKeyboard() {
    modeButtons.forEach(button => button.classList.toggle("active", button.dataset.attendanceKbMode === keyboardMode));
    keyboard.classList.toggle("is-zhuyin", keyboardMode === "zhuyin");
    keyboard.classList.toggle("is-english", keyboardMode === "english");
    if (keyboardTitle) keyboardTitle.textContent = "觸控鍵盤";
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
    updateZhuyinCandidates();
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

  function dispatchInputEvents() {
    keyboardTarget.dispatchEvent(new Event("input", { bubbles: true }));
    keyboardTarget.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function insertText(text) {
    if (!keyboardTarget) return;
    const start = keyboardTarget.selectionStart ?? keyboardTarget.value.length;
    const end = keyboardTarget.selectionEnd ?? keyboardTarget.value.length;
    const maxLength = keyboardTarget.maxLength > -1 ? keyboardTarget.maxLength : Infinity;
    const available = maxLength - (keyboardTarget.value.length - (end - start));
    if (available <= 0) return;
    const nextText = String(text).slice(0, available);
    keyboardTarget.value = keyboardTarget.value.slice(0, start) + nextText + keyboardTarget.value.slice(end);
    const next = start + nextText.length;
    keyboardTarget.focus();
    keyboardTarget.setSelectionRange?.(next, next);
    dispatchInputEvents();
  }

  function backspace() {
    if (!keyboardTarget) return;
    if (keyboardMode === "zhuyin" && zhuyinBuffer) {
      if (zhuyinParts.tone) zhuyinParts.tone = "";
      else if (zhuyinParts.final) zhuyinParts.final = "";
      else if (zhuyinParts.medial) zhuyinParts.medial = "";
      else if (zhuyinParts.initial) zhuyinParts.initial = "";
      zhuyinBuffer = rebuildBuffer();
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
    dispatchInputEvents();
  }

  function pressKey(button) {
    const action = button.dataset.action;
    if (action === "toggleLang") {
      keyboardMode = keyboardMode === "english" ? "zhuyin" : "english";
      resetZhuyin();
      renderKeyboard();
      return;
    }
    if (action === "caps") {
      capsLock = !capsLock;
      renderKeyboard();
      return;
    }
    if (action === "backspace") {
      backspace();
      return;
    }
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

  keyboard.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) event.preventDefault();
  });

  keyboard.addEventListener("click", event => {
    const hide = event.target.closest("[data-attendance-kb-hide]");
    if (hide) {
      hideKeyboard();
      return;
    }

    const modeButton = event.target.closest("[data-attendance-kb-mode]");
    if (modeButton) {
      keyboardMode = modeButton.dataset.attendanceKbMode === "english" ? "english" : "zhuyin";
      resetZhuyin();
      renderKeyboard();
      return;
    }

    const key = event.target.closest(".keyboard-keys button");
    if (key) pressKey(key);
  });

  document.addEventListener("focusin", event => {
    if (event.target?.matches?.("#overtimeNote[data-attendance-keyboard]")) {
      showKeyboardFor(event.target, event.target.dataset.attendanceKeyboard);
    }
  });

  document.addEventListener("click", event => {
    if (event.target?.matches?.("#overtimeNote[data-attendance-keyboard]")) {
      showKeyboardFor(event.target, event.target.dataset.attendanceKeyboard);
      return;
    }
    if (!keyboard.hidden && !event.target.closest("#attendanceTouchKeyboard")) hideKeyboard();
  });

  window.addEventListener("bpmf-dictionary-ready", () => {
    if (!keyboard.hidden) renderKeyboard();
  });
})();
