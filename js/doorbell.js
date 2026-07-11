(() => {
  const screenSelector = [
    ".kiosk-screen",
    ".visitor-screen",
    ".delivery-screen",
    ".lunch-screen",
    ".emergency-screen",
    ".employee-screen",
    ".attendance-screen",
    ".health-screen",
    ".schedule-screen"
  ].join(",");

  function getScreen() {
    return document.querySelector(screenSelector) || document.body;
  }

  function ensureDoorbell() {
    let feedback = document.getElementById("doorbellFeedback");
    if (feedback) return feedback;

    feedback = document.createElement("section");
    feedback.className = "doorbell-feedback";
    feedback.id = "doorbellFeedback";
    feedback.hidden = true;
    feedback.setAttribute("aria-hidden", "true");
    feedback.innerHTML = `
      <article class="doorbell-card" role="dialog" aria-modal="true" aria-labelledby="doorbellTitle">
        <div class="doorbell-ring" aria-hidden="true">
          <img src="images/使用者附件 (6).png" alt="">
        </div>
        <span>FRONT DESK NOTIFIED</span>
        <h2 id="doorbellTitle">已通知櫃檯</h2>
        <p>櫃檯人員將盡快協助，請稍候。</p>
        <button id="doorbellClose" type="button">完成</button>
      </article>
    `;
    getScreen().appendChild(feedback);
    return feedback;
  }

  function openDoorbell() {
    const feedback = ensureDoorbell();
    feedback.hidden = false;
    requestAnimationFrame(() => {
      feedback.classList.add("is-open");
      feedback.setAttribute("aria-hidden", "false");
      feedback.querySelector("#doorbellClose")?.focus({ preventScroll: true });
    });
  }

  function closeDoorbell() {
    const feedback = document.getElementById("doorbellFeedback");
    if (!feedback) return;
    feedback.classList.remove("is-open");
    feedback.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!feedback.classList.contains("is-open")) feedback.hidden = true;
    }, 180);
  }

  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-action='doorbell'], [data-doorbell]");
    if (trigger) {
      event.preventDefault();
      openDoorbell();
      return;
    }

    const feedback = event.target.closest(".doorbell-feedback");
    if (!feedback) return;
    if (event.target === feedback || event.target.closest("#doorbellClose")) {
      closeDoorbell();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeDoorbell();
  });

  window.openDoorbellFeedback = openDoorbell;
  window.closeDoorbellFeedback = closeDoorbell;
})();
