(() => {
  const weekdayShort = ["日", "一", "二", "三", "四", "五", "六"];
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  const views = $$(".view");
  const lunchTime = $("#lunchTime");
  const lunchDate = $("#lunchDate");
  const vendorGrid = $("#vendorGrid");
  const menuList = $("#menuList");
  const cartList = $("#cartList");
  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");
  const submitOrder = $("#submitOrder");
  const orderNote = $("#orderNote");
  const stepItems = $$(".stepbar span");
  const lunchFaceVideo = $("#lunchFaceVideo");

  const stores = [
    {
      id: "hanabi",
      name: "花火丼飯",
      tag: "日式丼飯",
      image: "images/Japanese Donburi拷貝.jpg",
      description: "現做日式丼飯，醬汁濃郁，適合午餐快速取餐。",
      meals: [
        { id: "hanabi-pork-katsu", name: "炸豬排丼", description: "豬排、滑蛋、洋蔥", price: 135 },
        { id: "hanabi-oyakodon", name: "親子丼", description: "雞腿肉、滑蛋、洋蔥", price: 120 },
        { id: "hanabi-beef", name: "牛五花丼", description: "牛五花、溫泉蛋、青蔥", price: 145 },
        { id: "hanabi-teriyaki-chicken", name: "照燒雞腿丼", description: "炙燒雞腿、照燒醬", price: 130 },
        { id: "hanabi-salmon-floss", name: "鮭魚鬆丼", description: "鮭魚鬆、玉子燒、小菜", price: 150 },
        { id: "hanabi-karaage", name: "唐揚雞丼", description: "炸雞塊、海苔、柴魚", price: 128 },
        { id: "hanabi-curry-croquette", name: "咖哩可樂餅丼", description: "可樂餅、日式咖哩", price: 118 },
        { id: "hanabi-mentaiko-chicken", name: "明太子雞肉丼", description: "雞肉、明太子醬、蔥花", price: 160 }
      ]
    },
    {
      id: "lao-zhang",
      name: "老張便當",
      tag: "經典便當",
      image: "images/bento拷貝.jpg",
      description: "台式家常便當，今日菜單，截止時間 11:00。",
      meals: [
        { id: "lao-zhang-pork-belly", name: "控肉飯", description: "滷控肉、滷蛋、青菜", price: 95 },
        { id: "lao-zhang-fish", name: "魚排飯", description: "香煎魚排、季節配菜", price: 95 },
        { id: "lao-zhang-veggie", name: "素食便當", description: "蛋奶素可，清爽配菜", price: 80 },
        { id: "lao-zhang-chicken-leg", name: "滷雞腿飯", description: "滷香雞腿、青菜與滷蛋", price: 110 },
        { id: "lao-zhang-three-cup", name: "三杯雞飯", description: "九層塔、三杯醬、配菜", price: 105 },
        { id: "lao-zhang-beef", name: "蔥爆牛肉飯", description: "牛肉片、洋蔥、青蔥", price: 120 }
      ]
    },
    {
      id: "qinghe",
      name: "青禾蔬食",
      tag: "素食天地",
      image: "images/vegetarian.jpg.webp",
      description: "清爽蔬食與蔬菜料理，適合想吃輕盈一餐。",
      meals: [
        { id: "qinghe-mushroom-risotto", name: "菇菇燉飯", description: "綜合菇、奶油白醬", price: 125 },
        { id: "qinghe-salad", name: "能量沙拉盒", description: "鷹嘴豆、酪梨、堅果", price: 95 },
        { id: "qinghe-noodles", name: "蔬食拌麵", description: "胡麻醬、時蔬、豆包", price: 90 },
        { id: "qinghe-tomato-mushroom-rice", name: "番茄野菇飯", description: "番茄燉醬、杏鮑菇", price: 108 },
        { id: "qinghe-truffle-mushroom-rice", name: "松露菇菇飯", description: "菇類、松露香氣、溫蔬", price: 138 },
        { id: "qinghe-braised-tofu", name: "豆包滷味餐", description: "滷豆包、豆干、青菜", price: 98 }
      ]
    },
    {
      id: "spicy-lab",
      name: "辣味研究所",
      tag: "想吃點辣",
      image: "images/Spicy拷貝.jpg",
      description: "香麻、辣炒、椒香料理，適合想提神的午餐。",
      meals: [
        { id: "spicy-wonton-noodles", name: "紅油抄手麵", description: "紅油、抄手、細麵", price: 100 },
        { id: "spicy-kungpao-chicken", name: "宮保雞丁飯", description: "乾辣椒、花生、雞丁", price: 125 },
        { id: "spicy-mapo-tofu", name: "麻婆豆腐飯", description: "豆腐、辣豆瓣、白飯", price: 95 },
        { id: "spicy-peeled-chili-chicken", name: "剝皮辣椒雞飯", description: "微辣雞湯香、雞腿肉", price: 132 },
        { id: "spicy-pepper-chicken", name: "椒麻雞腿飯", description: "椒麻醬、酥炸雞腿", price: 128 },
        { id: "spicy-gaprao", name: "酸辣打拋飯", description: "打拋肉、檸檬、九層塔", price: 118 }
      ]
    },
    {
      id: "island-light",
      name: "小島輕食",
      tag: "西式輕食",
      image: "images/Western_style.jpg",
      description: "三明治、沙拉與飯麵組合，適合不想吃太重的人。",
      meals: [
        { id: "island-salmon-bagel", name: "煙燻鮭魚貝果", description: "鮭魚、奶油乳酪", price: 135 },
        { id: "island-tomato-pasta", name: "番茄肉醬筆管麵", description: "番茄肉醬、起司", price: 130 },
        { id: "island-soup-set", name: "濃湯輕食組", description: "玉米濃湯、烤吐司", price: 90 },
        { id: "island-caesar-wrap", name: "凱薩雞肉捲", description: "雞肉、生菜、凱薩醬", price: 105 },
        { id: "island-tuna-egg-salad", name: "鮪魚蛋沙拉盒", description: "鮪魚、雞蛋、馬鈴薯", price: 98 },
        { id: "island-focaccia", name: "烤蔬菜佛卡夏", description: "烤蔬菜、起司、香草", price: 112 }
      ]
    }
  ];

  let activeStoreId = stores[0].id;
  let cart = {};
  let paymentMethod = "";
  let lunchFaceStream = null;
  let selectedEmployee = null;

  function pad(value) { return String(value).padStart(2, "0"); }
  function todayText() {
    const now = new Date();
    return `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}（${weekdayShort[now.getDay()]}）`;
  }
  function updateClock() {
    const now = new Date();
    lunchTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    lunchDate.textContent = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}（${weekdayShort[now.getDay()]}）`;
  }
  function getStore(id = activeStoreId) { return stores.find(store => store.id === id) || stores[0]; }
  function currentItems() { return getStore().meals; }
  function getCartRows() { return currentItems().filter(item => cart[item.id] > 0).map(item => ({ ...item, qty: cart[item.id] })); }
  function cartTotalValue() { return getCartRows().reduce((sum, item) => sum + item.price * item.qty, 0); }
  function setStep(step) {
    const order = ["store", "meal", "checkout", "done"];
    stepItems.forEach(item => item.classList.toggle("active", order.indexOf(item.dataset.step) <= order.indexOf(step)));
  }
  function showView(id, step) {
    views.forEach(view => view.classList.toggle("active", view.id === id));
    if (step) setStep(step);
    if (id !== "faceVerifyView") stopLunchFaceCamera();
  }

  function stopLunchFaceCamera() {
    if (lunchFaceStream) {
      lunchFaceStream.getTracks().forEach(track => track.stop());
      lunchFaceStream = null;
    }
    if (lunchFaceVideo) lunchFaceVideo.srcObject = null;
  }

  async function startLunchFaceCamera() {
    if (!lunchFaceVideo) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      $("#faceEmployeeLabel").textContent = "此瀏覽器不支援相機，請改用人工確認";
      return;
    }
    try {
      stopLunchFaceCamera();
      $("#faceEmployeeLabel").textContent = "正在開啟相機，請允許瀏覽器權限";
      lunchFaceStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      lunchFaceVideo.srcObject = lunchFaceStream;
      await lunchFaceVideo.play().catch(() => {});
      const employeeInput = $("#employeeId");
      $("#faceEmployeeLabel").textContent = `工號 ${employeeInput.value}，請面向鏡頭`;
    } catch (error) {
      console.warn("便當付款相機開啟失敗", error);
      $("#faceEmployeeLabel").textContent = "相機權限未開啟，請允許 Chrome 使用相機";
    }
  }

  function renderVendors() {
    vendorGrid.innerHTML = stores.map(store => `
      <button class="vendor-card" type="button" data-store="${store.id}">
        <img src="${store.image}" alt="">
        <span>${store.tag}</span>
        <strong>${store.name}</strong>
        <p>${store.description}</p>
      </button>
    `).join("");
  }

  function showMealView(storeId) {
    activeStoreId = storeId;
    cart = {};
    $("#storeTag").textContent = getStore().tag;
    $("#storeName").textContent = getStore().name;
    $("#storeDesc").textContent = getStore().description;
    renderMenu();
    renderCart();
    showView("mealView", "meal");
  }

  function renderMenu() {
    menuList.innerHTML = currentItems().map(item => `
      <article class="menu-row" data-id="${item.id}">
        <div><strong>${item.name}</strong><small>${item.description}</small></div>
        <span class="menu-price">$${item.price}</span>
        <div class="qty-control">
          <button class="minus" type="button" data-action="minus" data-id="${item.id}">−</button>
          <span data-qty="${item.id}">0</span>
          <button class="plus" type="button" data-action="plus" data-id="${item.id}">＋</button>
        </div>
      </article>
    `).join("");
  }

  function renderCart() {
    const rows = getCartRows();
    const count = rows.reduce((sum, item) => sum + item.qty, 0);
    const total = cartTotalValue();
    cartCount.textContent = `${count} 項`;
    cartTotal.textContent = `$${total}`;
    submitOrder.disabled = count === 0;
    setStep(count > 0 ? "checkout" : "meal");
    currentItems().forEach(item => {
      const qtyNode = menuList.querySelector(`[data-qty="${item.id}"]`);
      if (qtyNode) qtyNode.textContent = cart[item.id] || 0;
    });
    cartList.innerHTML = rows.length ? rows.map(item => `
      <article class="cart-item"><div><strong>${item.name}</strong><small>$${item.price} × ${item.qty}</small></div><b>$${item.price * item.qty}</b></article>
    `).join("") : `<p class="empty-cart">尚未選擇餐點</p>`;
  }

  function changeQty(id, delta) {
    cart[id] = Math.max(0, (cart[id] || 0) + delta);
    if (cart[id] === 0) delete cart[id];
    renderCart();
  }

  function orderSummaryRows(includePay = false) {
    const rows = getCartRows();
    const mealText = rows.map(item => `${item.name} × ${item.qty}`).join("、") || "尚未選擇";
    const extra = includePay ? `<div><span>付款方式</span><b>${paymentMethod}</b></div>` : "";
    const employeeRow = selectedEmployee ? `<div><span>員工</span><b>${selectedEmployee.id} ${selectedEmployee.name}</b></div>` : "";
    return `
      ${employeeRow}
      <div><span>取餐日期</span><b>${todayText()}</b></div>
      <div><span>取餐時間</span><b>11:30 - 12:00</b></div>
      <div><span>餐點</span><b>${mealText}</b></div>
      ${extra}
      <div><span>金額</span><b>$${cartTotalValue()}</b></div>
    `;
  }

  function renderReserveSummary() {
    $("#reserveSummary").innerHTML = orderSummaryRows(false);
    $("#salaryBox").innerHTML = `
      <div><span>訂單金額</span><b>$${cartTotalValue()}</b></div>
      <div><span>扣款月份</span><b>2026年07月薪資</b></div>
    `;
    $("#welfareBox").innerHTML = `
      <div><span>訂單金額</span><b>$${cartTotalValue()}</b></div>
      <div><span>目前點數餘額</span><b>1,250 點</b></div>
      <div><span>可折抵金額</span><b>$${cartTotalValue()}</b></div>
    `;
    $("#qrAmount").textContent = `訂單金額：$${cartTotalValue()}`;
  }

  function completePayment(method) {
    paymentMethod = method;
    if (selectedEmployee) {
      const rows = getCartRows();
      window.MockEmployees?.addLunchOrder(selectedEmployee.id, {
        date: todayText(),
        store: getStore().name,
        meal: rows.map(item => `${item.name} × ${item.qty}`).join("、"),
        amount: cartTotalValue(),
        status: "已付款",
        payment: method
      });
    }
    $("#paidSummary").innerHTML = orderSummaryRows(true);
    showView("paidSuccessView", "done");
  }

  vendorGrid.addEventListener("click", event => {
    const card = event.target.closest(".vendor-card");
    if (!card) return;
    showMealView(card.dataset.store);
  });

  $("#backStore").addEventListener("click", () => showView("storeView", "store"));
  menuList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    changeQty(button.dataset.id, button.dataset.action === "plus" ? 1 : -1);
  });
  submitOrder.addEventListener("click", () => {
    renderReserveSummary();
    showView("reserveSuccessView", "done");
  });
  $("#goPayment").addEventListener("click", () => showView("employeeView", "done"));
  $("#backReserve").addEventListener("click", () => showView("reserveSuccessView", "done"));
  $("#backEmployee").addEventListener("click", () => showView("employeeView", "done"));
  $("#backFaceVerify").addEventListener("click", () => {
    stopLunchFaceCamera();
    showView("employeeView", "done");
  });
  $("#finishEmployee").addEventListener("click", () => {
    const employeeInput = $("#employeeId");
    const employee = window.MockEmployees?.find(employeeInput.value.trim());
    if (!employeeInput.value.trim() || !employee) {
      employeeInput.animate?.(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 240, easing: "ease-out" }
      );
      employeeInput.focus();
      employeeInput.value = employeeInput.value.replace(/\D/g, "").slice(0, 8);
      employeeInput.placeholder = "查無工號，請輸入 1111-1116";
      return;
    }
    selectedEmployee = employee;
    $("#faceEmployeeLabel").textContent = `${employee.id} ${employee.name}，請面向鏡頭`;
    showView("faceVerifyView", "done");
    startLunchFaceCamera();
  });
  $("#confirmFaceVerify").addEventListener("click", () => {
    stopLunchFaceCamera();
    showView("methodView", "done");
  });

  $("#numberPad").addEventListener("click", event => {
    const button = event.target.closest("button[data-key]");
    if (!button) return;
    const input = $("#employeeId");
    const key = button.dataset.key;
    if (key === "clear") input.value = "";
    else if (key === "backspace") input.value = input.value.slice(0, -1);
    else if (input.value.length < 8) input.value += key;
    input.placeholder = "請輸入您的工號";
  });

  $("#methodView").addEventListener("click", event => {
    const card = event.target.closest(".method-card");
    if (!card) return;
    const target = { card: "cardView", online: "onlineView", salary: "salaryView", welfare: "welfareView" }[card.dataset.method];
    if (target) showView(target, "done");
  });

  document.addEventListener("click", event => {
    const gotoButton = event.target.closest("[data-goto]");
    if (gotoButton) showView(gotoButton.dataset.goto, "done");

    const payButton = event.target.closest("[data-pay]");
    if (payButton) completePayment(payButton.dataset.pay);

    const qrButton = event.target.closest("[data-qr]");
    if (qrButton) {
      $("#qrTitle").textContent = qrButton.dataset.qr;
      paymentMethod = qrButton.dataset.qr;
      showView("qrView", "done");
    }

    const confirmButton = event.target.closest("[data-confirm-pay]");
    if (confirmButton) completePayment(confirmButton.dataset.confirmPay);
  });

  $("#completeQr").addEventListener("click", () => completePayment(paymentMethod || "線上支付"));

  document.addEventListener("pointerdown", event => {
    const target = event.target.closest("button, .link-btn, .vendor-card");
    if (target) target.classList.add("touch-press");
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(type => document.addEventListener(type, () => {
    $$(".touch-press").forEach(item => item.classList.remove("touch-press"));
  }));

  updateClock();
  renderVendors();
  const initialStoreId = new URLSearchParams(window.location.search).get("store");
  if (initialStoreId && stores.some(store => store.id === initialStoreId)) showMealView(initialStoreId);
  else setStep("store");
  window.setInterval(updateClock, 1000 * 20);
  window.addEventListener("beforeunload", stopLunchFaceCamera);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLunchFaceCamera();
  });
})();
