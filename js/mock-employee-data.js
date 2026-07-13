(() => {
  const STORAGE_KEY = "wohours.mockEmployeeMemory.v1";

  const employees = {
    "1111": {
      id: "1111",
      name: "王小明",
      dept: "客服部",
      role: "客服專員",
      birthday: "07/10",
      schedule: {
        today: "早班 09:00 - 18:00",
        next: "07/10（五）中班 12:00 - 21:00",
        week: ["早班", "中班", "早班", "休息", "晚班", "中班", "休息"]
      },
      benefits: { birthdayGift: "未領取", activity: "員工旅遊已報名", points: 1250 },
      leaveRequests: [
        { type: "特休", period: "2026/07/24 - 2026/07/24", status: "已核准" }
      ],
      health: { eligible: true, status: "尚未預約", slot: "可預約 07/15（三）09:00" },
      parcels: [
        { no: "TW11110001", source: "黑貓宅急便", status: "待領取", time: "2026/07/08 09:30" },
        { no: "TW11110002", source: "7-11 交貨便", status: "已寄出", time: "2026/07/09 14:20" }
      ],
      lunchOrders: [
        { date: "2026/07/08", store: "花火丼飯", meal: "炸豬排丼", amount: 135, status: "已付款" }
      ],
      attendance: [
        { date: "2026/07/08", mode: "上班打卡", time: "08:57" }
      ]
    },
    "1112": {
      id: "1112",
      name: "李佳穎",
      dept: "行政部",
      role: "行政專員",
      birthday: "09/22",
      schedule: { today: "中班 12:00 - 21:00", next: "07/10（五）休息", week: ["中班", "中班", "休息", "早班", "早班", "休息", "晚班"] },
      benefits: { birthdayGift: "非本月壽星", activity: "尚未報名", points: 980 },
      leaveRequests: [
        { type: "病假", period: "2026/07/12 - 2026/07/13", status: "審核中" }
      ],
      health: { eligible: true, status: "已預約", slot: "07/18（六）13:30" },
      parcels: [{ no: "TW11120001", source: "新竹物流", status: "待領取", time: "2026/07/07 16:45" }],
      lunchOrders: [{ date: "2026/07/08", store: "青禾蔬食", meal: "能量沙拉盒", amount: 95, status: "已預約" }],
      attendance: [{ date: "2026/07/08", mode: "上班打卡", time: "11:56" }]
    },
    "1113": {
      id: "1113",
      name: "陳志豪",
      dept: "門市部",
      role: "門市支援",
      birthday: "07/17",
      schedule: { today: "晚班 15:00 - 24:00", next: "07/10（五）晚班 15:00 - 24:00", week: ["晚班", "休息", "晚班", "中班", "中班", "早班", "休息"] },
      benefits: { birthdayGift: "未領取", activity: "健康講座已報名", points: 1530 },
      leaveRequests: [
        { type: "特休", period: "2026/07/15 - 2026/07/17", status: "已核准" }
      ],
      health: { eligible: true, status: "檢查完成", slot: "2026/06/28 已完成" },
      parcels: [{ no: "TW11130001", source: "順豐速運", status: "已領取", time: "2026/07/04 11:10" }],
      lunchOrders: [],
      attendance: [{ date: "2026/07/08", mode: "上班打卡", time: "14:51" }]
    },
    "1114": {
      id: "1114",
      name: "張雅婷",
      dept: "財務部",
      role: "會計專員",
      birthday: "12/03",
      schedule: { today: "早班 09:00 - 18:00", next: "07/10（五）早班 09:00 - 18:00", week: ["早班", "早班", "早班", "早班", "休息", "休息", "中班"] },
      benefits: { birthdayGift: "非本月壽星", activity: "福利公告已讀", points: 760 },
      leaveRequests: [
        { type: "事假", period: "2026/07/21 - 2026/07/21", status: "待主管審核" }
      ],
      health: { eligible: true, status: "尚未預約", slot: "可預約 07/22（三）10:00" },
      parcels: [{ no: "TW11140001", source: "黑貓宅急便", status: "逾期未領", time: "2026/07/02 10:00" }],
      lunchOrders: [{ date: "2026/07/07", store: "老張便當", meal: "控肉飯", amount: 95, status: "已取餐" }],
      attendance: [{ date: "2026/07/08", mode: "上班打卡", time: "09:02" }]
    },
    "1115": {
      id: "1115",
      name: "林柏翰",
      dept: "資訊部",
      role: "系統工程師",
      birthday: "03/15",
      schedule: { today: "休息", next: "07/10（五）早班 09:00 - 18:00", week: ["休息", "早班", "中班", "中班", "晚班", "休息", "早班"] },
      benefits: { birthdayGift: "非本月壽星", activity: "員工旅遊待確認", points: 2020 },
      leaveRequests: [
        { type: "補休", period: "2026/07/18 - 2026/07/18", status: "已核准" }
      ],
      health: { eligible: true, status: "已預約", slot: "07/22（三）10:00" },
      parcels: [],
      lunchOrders: [{ date: "2026/07/08", store: "辣味研究所", meal: "麻婆豆腐飯", amount: 95, status: "已付款" }],
      attendance: []
    },
    "1116": {
      id: "1116",
      name: "黃子晴",
      dept: "行銷部",
      role: "行銷企劃",
      birthday: "07/28",
      schedule: { today: "中班 12:00 - 21:00", next: "07/10（五）中班 12:00 - 21:00", week: ["中班", "休息", "中班", "早班", "休息", "晚班", "晚班"] },
      benefits: { birthdayGift: "未領取", activity: "活動報名待審核", points: 1180 },
      leaveRequests: [
        { type: "家庭照護假", period: "2026/07/29 - 2026/07/29", status: "審核中" }
      ],
      health: { eligible: true, status: "尚未預約", slot: "可預約 07/18（六）13:30" },
      parcels: [{ no: "TW11160001", source: "7-11 交貨便", status: "已寄出", time: "2026/07/09 10:40" }],
      lunchOrders: [],
      attendance: [{ date: "2026/07/08", mode: "上班打卡", time: "12:01" }]
    },
    "1117": {
      id: "1117",
      name: "周宜庭",
      dept: "人資部",
      role: "人資專員",
      birthday: "11/08",
      schedule: { today: "早班 09:00 - 18:00", next: "07/10（五）早班 09:00 - 18:00", week: ["早班", "早班", "中班", "休息", "早班", "休息", "中班"] },
      benefits: { birthdayGift: "非本月壽星", activity: "健康檢查開放預約", points: 1320 },
      leaveRequests: [
        { type: "特休", period: "2026/08/03 - 2026/08/04", status: "待主管審核" }
      ],
      health: { eligible: true, status: "尚未預約", slot: "可預約 07/21（二）15:00" },
      parcels: [],
      lunchOrders: [{ date: "2026/07/09", store: "小島輕食", meal: "雞肉可頌", amount: 120, status: "已付款" }],
      attendance: [{ date: "2026/07/09", mode: "上班打卡", time: "08:55" }]
    },
    "1118": {
      id: "1118",
      name: "劉冠宇",
      dept: "倉儲部",
      role: "倉儲管理",
      birthday: "05/20",
      schedule: { today: "晚班 15:00 - 24:00", next: "07/10（五）晚班 15:00 - 24:00", week: ["晚班", "晚班", "休息", "中班", "晚班", "早班", "休息"] },
      benefits: { birthdayGift: "非本月壽星", activity: "員工旅遊尚未報名", points: 890 },
      leaveRequests: [
        { type: "病假", period: "2026/07/30 - 2026/07/30", status: "已核准" }
      ],
      health: { eligible: true, status: "已預約", slot: "07/23（四）11:00" },
      parcels: [{ no: "TW11180001", source: "黑貓宅急便", status: "待領取", time: "2026/07/09 18:05" }],
      lunchOrders: [],
      attendance: [{ date: "2026/07/09", mode: "上班打卡", time: "14:54" }]
    },
    "1119": {
      id: "1119",
      name: "吳佳蓉",
      dept: "客服部",
      role: "客服組長",
      birthday: "02/14",
      schedule: { today: "中班 12:00 - 21:00", next: "07/10（五）中班 12:00 - 21:00", week: ["中班", "休息", "早班", "中班", "休息", "晚班", "早班"] },
      benefits: { birthdayGift: "非本月壽星", activity: "福利公告已讀", points: 1660 },
      leaveRequests: [
        { type: "事假", period: "2026/07/16 - 2026/07/16", status: "審核中" }
      ],
      health: { eligible: true, status: "尚未預約", slot: "可預約 07/24（五）09:30" },
      parcels: [],
      lunchOrders: [{ date: "2026/07/09", store: "花火丼飯", meal: "親子丼", amount: 115, status: "已付款" }],
      attendance: [{ date: "2026/07/09", mode: "上班打卡", time: "11:58" }]
    },
    "1120": {
      id: "1120",
      name: "蔡宗翰",
      dept: "行政部",
      role: "總務專員",
      birthday: "08/06",
      schedule: { today: "早班 09:00 - 18:00", next: "07/10（五）休息", week: ["早班", "中班", "休息", "早班", "晚班", "休息", "中班"] },
      benefits: { birthdayGift: "非本月壽星", activity: "員工旅遊已報名", points: 1040 },
      leaveRequests: [
        { type: "補休", period: "2026/07/27 - 2026/07/27", status: "已核准" }
      ],
      health: { eligible: true, status: "檢查完成", slot: "2026/06/30 已完成" },
      parcels: [{ no: "TW11200001", source: "新竹物流", status: "已寄出", time: "2026/07/09 13:10" }],
      lunchOrders: [{ date: "2026/07/08", store: "青禾蔬食", meal: "彩虹蔬食盒", amount: 105, status: "已取餐" }],
      attendance: [{ date: "2026/07/09", mode: "下班打卡", time: "18:04" }]
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readMemory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function writeMemory(memory) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  }

  function withMemory(employee) {
    const memory = readMemory()[employee.id] || {};
    return { ...clone(employee), ...memory };
  }

  function find(id) {
    const normalized = String(id || "").trim().replace(/\D/g, "").slice(0, 8);
    const employee = employees[normalized];
    return employee ? withMemory(employee) : null;
  }

  function all() {
    return Object.values(employees).map(withMemory);
  }

  function update(id, updater) {
    const employee = find(id);
    if (!employee) return null;
    const memory = readMemory();
    const current = memory[employee.id] || {};
    const next = typeof updater === "function" ? updater({ ...employee, ...current }) : updater;
    memory[employee.id] = { ...current, ...next };
    writeMemory(memory);
    return find(employee.id);
  }

  function addAttendance(id, record) {
    return update(id, employee => ({
      attendance: [record, ...(employee.attendance || [])].slice(0, 12)
    }));
  }

  function addLunchOrder(id, record) {
    return update(id, employee => ({
      lunchOrders: [record, ...(employee.lunchOrders || [])].slice(0, 12)
    }));
  }

  function claimBirthday(id) {
    return update(id, employee => ({
      benefits: { ...employee.benefits, birthdayGift: "已領取" }
    }));
  }

  window.MockEmployees = { all, find, update, addAttendance, addLunchOrder, claimBirthday };
})();
