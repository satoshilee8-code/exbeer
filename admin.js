const loginPanel = document.querySelector("#loginPanel");
const dashboardPanel = document.querySelector("#dashboardPanel");
const loginForm = document.querySelector("#loginForm");
const allocationForm = document.querySelector("#allocationForm");
const loginMessage = document.querySelector("#loginMessage");
const adminMessage = document.querySelector("#adminMessage");
const allocationRows = document.querySelector("#allocationRows");
const summaryCount = document.querySelector("#summaryCount");
const summaryShares = document.querySelector("#summaryShares");
const summaryTokens = document.querySelector("#summaryTokens");
const refreshButton = document.querySelector("#refreshButton");
const refreshActivityButton = document.querySelector("#refreshActivityButton");
const logoutButton = document.querySelector("#logoutButton");
const walletAddress = document.querySelector("#walletAddress");
const shareAmount = document.querySelector("#shareAmount");
const activityRows = document.querySelector("#activityRows");
const activityPageViews = document.querySelector("#activityPageViews");
const activityWalletLogins = document.querySelector("#activityWalletLogins");
const activityAirdropQueries = document.querySelector("#activityAirdropQueries");

const tokenKey = "exbeerAdminToken";
const tokensPerShare = 1_000_000;

const formatNumber = (value) => new Intl.NumberFormat("zh-CN").format(value);
const getToken = () => localStorage.getItem(tokenKey);

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error-text", isError);
}

function setAuthenticated(isAuthenticated) {
  loginPanel.classList.toggle("hidden", isAuthenticated);
  dashboardPanel.classList.toggle("hidden", !isAuthenticated);
  logoutButton.classList.toggle("hidden", !isAuthenticated);
}

async function adminFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "request_failed");
  }
  return data;
}

async function login(username, password) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "login_failed");
  }

  localStorage.setItem(tokenKey, data.token);
}

async function loadAllocations() {
  const data = await adminFetch("/api/admin/airdrops");
  renderSummary(data.summary);
  renderRows(data.items);
}

async function loadActivity() {
  const data = await adminFetch("/api/admin/activity");
  renderActivitySummary(data.summary);
  renderActivityRows(data.items);
}

function renderSummary(summary) {
  summaryCount.textContent = formatNumber(summary.count);
  summaryShares.textContent = formatNumber(summary.totalShares);
  summaryTokens.textContent = `${formatNumber(summary.totalTokens)} EXB`;
}

function renderRows(items) {
  if (!items.length) {
    allocationRows.innerHTML = `<tr><td colspan="5">暂无空投记录</td></tr>`;
    return;
  }

  allocationRows.innerHTML = items
    .map(
      (item) => `
        <tr>
          <td><code>${item.walletAddress}</code></td>
          <td>${formatNumber(item.shares)} 份</td>
          <td>${formatNumber(item.totalTokens)} EXB</td>
          <td>${item.updatedAt || "-"}</td>
          <td>
            <button class="table-action" data-action="edit" data-address="${item.walletAddress}" data-shares="${item.shares}" type="button">编辑</button>
            <button class="table-action danger" data-action="delete" data-address="${item.walletAddress}" type="button">删除</button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function eventLabel(type) {
  const labels = {
    page_view: "页面访问",
    wallet_login: "钱包登录",
    airdrop_query: "空投查询",
  };
  return labels[type] || type;
}

function renderActivitySummary(summary) {
  activityPageViews.textContent = formatNumber(summary.pageViews || 0);
  activityWalletLogins.textContent = formatNumber(summary.walletLogins || 0);
  activityAirdropQueries.textContent = formatNumber(summary.airdropQueries || 0);
}

function renderDetails(details = {}) {
  const entries = Object.entries(details).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) {
    return "-";
  }
  return entries
    .map(([key, value]) => `${key}: ${typeof value === "number" ? formatNumber(value) : value}`)
    .join(" / ");
}

function renderActivityRows(items) {
  if (!items.length) {
    activityRows.innerHTML = `<tr><td colspan="6">暂无访问记录</td></tr>`;
    return;
  }

  activityRows.innerHTML = items
    .map(
      (item) => `
        <tr>
          <td>${eventLabel(item.eventType)}</td>
          <td>${item.ipAddress || "-"}</td>
          <td><code>${item.walletAddress || "-"}</code></td>
          <td>${item.path || "-"}</td>
          <td>${renderDetails(item.details)}</td>
          <td>${item.createdAt || "-"}</td>
        </tr>
      `,
    )
    .join("");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(loginMessage, "正在登录...");

  try {
    await login(
      document.querySelector("#adminUsername").value.trim(),
      document.querySelector("#adminPassword").value,
    );
    setAuthenticated(true);
    await Promise.all([loadAllocations(), loadActivity()]);
  } catch (error) {
    setMessage(loginMessage, "登录失败，请检查账户或密码。", true);
  }
});

allocationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(adminMessage, "正在保存...");

  try {
    await adminFetch("/api/admin/airdrops", {
      method: "POST",
      body: JSON.stringify({
        walletAddress: walletAddress.value.trim(),
        shares: shareAmount.value,
      }),
    });
    allocationForm.reset();
    setMessage(adminMessage, "保存成功，数据库已更新。");
    await loadAllocations();
  } catch (error) {
    setMessage(adminMessage, `保存失败：${error.message}`, true);
  }
});

allocationRows.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const address = button.dataset.address;

  if (action === "edit") {
    walletAddress.value = address;
    shareAmount.value = button.dataset.shares;
    walletAddress.focus();
    setMessage(adminMessage, "已载入该地址，可以修改份额后保存。");
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm(`确认删除 ${address} 的空投额度？`);
    if (!confirmed) {
      return;
    }

    try {
      await adminFetch(`/api/admin/airdrops?address=${encodeURIComponent(address)}`, {
        method: "DELETE",
      });
      setMessage(adminMessage, "删除成功。");
      await loadAllocations();
    } catch (error) {
      setMessage(adminMessage, `删除失败：${error.message}`, true);
    }
  }
});

refreshButton.addEventListener("click", loadAllocations);
refreshActivityButton.addEventListener("click", loadActivity);

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(tokenKey);
  setAuthenticated(false);
});

if (getToken()) {
  setAuthenticated(true);
  Promise.all([loadAllocations(), loadActivity()]).catch(() => {
    localStorage.removeItem(tokenKey);
    setAuthenticated(false);
  });
} else {
  setAuthenticated(false);
}
