(() => {
  "use strict";

  const accountPage = document.querySelector("#account");
  const authDialog = document.querySelector("#authDialog");
  const openAccountButtons = document.querySelectorAll("[data-open-account]");
  const closeAccountButtons = document.querySelectorAll("[data-close-account]");
  const closeAuthButtons = document.querySelectorAll("[data-close-auth]");
  const tabs = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");
  const authMethods = document.querySelectorAll("[data-auth-method]");
  const authPanels = document.querySelectorAll("[data-auth-panel]");
  const authLabel = document.querySelector("[data-auth-label]");
  const emailAuthForm = document.querySelector("[data-email-auth]");
  const emailSubmit = document.querySelector("[data-email-submit]");
  const codeBox = document.querySelector("[data-code-box]");
  const confirmCodeButton = document.querySelector("[data-confirm-code]");
  const authMessage = document.querySelector("[data-auth-message]");
  const apiStatus = document.querySelector("[data-api-status]");
  const telegramLoginButton = document.querySelector("[data-telegram-login]");
  const accountTitle = document.querySelector("[data-account-title]");
  const accountUser = document.querySelector("[data-account-user]");
  const accountProvider = document.querySelector("[data-account-provider]");
  const accountProviderTitle = document.querySelector("[data-account-provider-title]");
  const accountEmail = document.querySelector("[data-account-email]");
  const accountDaysLeft = document.querySelector("[data-account-days-left]");
  const accountExpires = document.querySelector("[data-account-expires]");
  const trafficLeft = document.querySelector("[data-traffic-left]");
  const trafficNote = document.querySelector("[data-traffic-note]");
  const trafficBar = document.querySelector("[data-traffic-bar]");
  const copyButton = document.querySelector("[data-copy-sub]");
  const openHappButton = document.querySelector("[data-open-happ]");
  const rotateKeyButton = document.querySelector("[data-rotate-key]");
  const subLink = document.querySelector("#subLink");
  const profileList = document.querySelector("[data-profile-list]");
  const toast = document.querySelector("#toast");
  const planButtons = document.querySelectorAll("[data-plan]");

  const titles = Object.freeze({
    overview: "Мой VPN",
    devices: "Инструкция",
    payments: "Тарифы",
    help: "Поддержка",
  });

  const allowedTabs = new Set(Object.keys(titles));
  const allowedPlans = new Set(["1 месяц", "3 месяца", "6 месяцев", "12 месяцев"]);
  const allowedAuthMethods = new Set(["telegram", "email"]);
  const allowedSubscriptionHost = "panel.efirvpn.ru";
  const apiBase = "https://api.efirvpn.ru";
  const subscriptionBase = "https://panel.efirvpn.ru/api/sub";
  const storageKey = "efirvpn.account.v1";
  const sessionStorageKey = "efirvpn.session.v1";

  let toastTimer = 0;
  let isAuthenticated = false;
  let pendingAccountTab = "overview";
  let pendingEmail = "";
  let apiSessionToken = "";
  let currentProfiles = [];
  let currentIdentity = {
    email: "",
    provider: "Войдите в кабинет",
    providerTitle: "Войдите в кабинет",
    username: "Аккаунт",
    subscriptionUrl: "",
    subscriptionToken: "",
    expiresAt: "",
    trafficLimitGb: 0,
    trafficUsedGb: 0,
  };

  function formatShortDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  }

  function getDaysLeft(value) {
    const expires = new Date(value);
    if (Number.isNaN(expires.getTime())) {
      return 0;
    }

    const diffMs = expires.getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / 86_400_000));
  }

  function getSubscriptionUrl(token = currentIdentity.subscriptionToken) {
    if (currentIdentity.subscriptionUrl) {
      return currentIdentity.subscriptionUrl;
    }

    if (!token) {
      return "";
    }

    return `${subscriptionBase}/${encodeURIComponent(token)}`;
  }

  function loadStoredAccount() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return;
      }

      currentIdentity = {
        ...currentIdentity,
        ...parsed,
      };
      apiSessionToken = window.localStorage.getItem(sessionStorageKey) || "";
      isAuthenticated = true;
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }

  function saveStoredAccount() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(currentIdentity));
      if (apiSessionToken) {
        window.localStorage.setItem(sessionStorageKey, apiSessionToken);
      }
    } catch {
      showToast("Браузер не сохранил сессию");
    }
  }

  function clearStoredAccount() {
    try {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(sessionStorageKey);
    } catch {
      // The in-memory session is still cleared below.
    }
  }

  async function apiFetch(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (apiSessionToken) {
      headers.Authorization = `Bearer ${apiSessionToken}`;
    }

    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    return response.json();
  }

  function applyApiAccount(account, token = apiSessionToken, profiles = currentProfiles) {
    if (!account || typeof account !== "object") {
      throw new Error("Invalid account response");
    }

    apiSessionToken = token || apiSessionToken;
    currentProfiles = Array.isArray(profiles) ? profiles : [];
    currentIdentity = {
      ...currentIdentity,
      email: account.email || currentIdentity.email,
      provider: account.provider === "email" ? "Email подключен" : "Telegram подключен",
      providerTitle: account.provider === "email" ? "Email привязан" : "Telegram подключен",
      username: account.username || account.email || currentIdentity.username,
      subscriptionUrl: account.subscriptionUrl || currentIdentity.subscriptionUrl,
      expiresAt: account.expiresAt || currentIdentity.expiresAt,
      trafficLimitGb: account.trafficLimitGb || currentIdentity.trafficLimitGb,
      trafficUsedGb: account.trafficUsedGb ?? currentIdentity.trafficUsedGb,
    };
  }

  async function refreshApiAccount() {
    if (!apiSessionToken) {
      return false;
    }

    const data = await apiFetch("/api/account");
    applyApiAccount(data.account, apiSessionToken, data.profiles);
    updateAccountIdentity();
    saveStoredAccount();
    return true;
  }

  function getSafeTab(tabName) {
    return allowedTabs.has(tabName) ? tabName : "overview";
  }

  function getSafeSubscriptionLink() {
    const rawLink = subLink?.dataset.subscriptionLink || "";
    if (!rawLink) {
      throw new Error("Subscription link is not ready");
    }

    const url = new URL(rawLink);

    if (url.protocol !== "https:" || url.hostname !== allowedSubscriptionHost) {
      throw new Error("Unexpected subscription link origin");
    }

    return url.toString();
  }

  function getSafeAuthMethod(methodName) {
    return allowedAuthMethods.has(methodName) ? methodName : "telegram";
  }

  function formatProfileProtocol(profile) {
    const parts = [profile.protocol, profile.network, profile.security, profile.json ? "JSON" : ""]
      .filter(Boolean)
      .map((part) => String(part).toUpperCase());
    return parts.join(" · ") || "VLESS · TCP · REALITY · JSON";
  }

  function renderProfileList(hasAccountData) {
    if (!profileList) {
      return;
    }

    profileList.replaceChildren();

    const profiles = hasAccountData ? currentProfiles : [];
    if (!profiles.length) {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      const status = document.createElement("b");

      icon.className = "flag";
      icon.textContent = "VPN";
      title.textContent = hasAccountData ? "Профили обновляются" : "Профили появятся после входа";
      meta.textContent = "VLESS · TCP · Reality · JSON";
      status.textContent = hasAccountData ? "скоро" : "готовим";

      content.append(title, meta);
      row.append(icon, content, status);
      profileList.append(row);
      return;
    }

    profiles.forEach((profile, index) => {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      const status = document.createElement("b");

      icon.className = "flag";
      icon.textContent = index === 0 ? "DE" : "R";
      title.textContent = profile.name || `Efir профиль ${index + 1}`;
      meta.textContent = formatProfileProtocol(profile);
      status.textContent = index === 0 ? "основной" : "резерв";

      content.append(title, meta);
      row.append(icon, content, status);
      profileList.append(row);
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function setApiStatus(state, message) {
    if (!apiStatus || !authMessage) {
      return;
    }

    apiStatus.classList.remove("is-ready", "is-warning", "is-checking");
    apiStatus.classList.add(state);
    authMessage.textContent = message;
  }

  function explainApiDelay() {
    setApiStatus(
      "is-warning",
      "Кабинет временно недоступен. Напишите в Telegram, мы выдадим ключ вручную."
    );
  }

  async function checkApiStatus() {
    setApiStatus("is-checking", "Проверяем доступность кабинета.");

    try {
      const health = await apiFetch("/health");
      if (health?.ok || health?.status === "ok") {
        setApiStatus("is-ready", "Кабинет готов: можно войти через Telegram или email.");
        return true;
      }
    } catch {
      // The public API domain can temporarily point at the panel while deployment is being routed.
    }

    explainApiDelay();
    return false;
  }

  function openAuth(method = "telegram") {
    if (!authDialog || typeof authDialog.showModal !== "function") {
      return;
    }

    if (!authDialog.open) {
      authDialog.showModal();
    }

    setAuthMethod(method);
  }

  function closeAuth() {
    if (authDialog?.open) {
      authDialog.close();
    }

    if (!isAuthenticated && window.location.hash === "#account") {
      window.history.pushState(null, "", "#home");
    }
  }

  function updateAccountIdentity() {
    const subscriptionUrl = getSubscriptionUrl();
    const hasAccountData = isAuthenticated && Boolean(subscriptionUrl);

    if (accountUser) {
      accountUser.textContent = currentIdentity.username || "Аккаунт";
    }

    if (accountProvider) {
      accountProvider.textContent = currentIdentity.provider;
    }

    if (accountProviderTitle) {
      accountProviderTitle.textContent = currentIdentity.providerTitle || currentIdentity.provider;
    }

    if (accountEmail) {
      accountEmail.textContent = currentIdentity.email || "Аккаунт не подключен";
    }

    if (accountExpires) {
      accountExpires.textContent = hasAccountData ? formatShortDate(currentIdentity.expiresAt) : "—";
    }

    if (accountDaysLeft) {
      if (hasAccountData) {
        const daysLeft = getDaysLeft(currentIdentity.expiresAt);
        accountDaysLeft.textContent = `Осталось ${daysLeft} дн.`;
      } else {
        accountDaysLeft.textContent = "Войдите, чтобы увидеть срок";
      }
    }

    if (trafficLeft && trafficNote && trafficBar) {
      const limit = Number(currentIdentity.trafficLimitGb) || 0;
      const rawUsed = Number(currentIdentity.trafficUsedGb) || 0;
      const used = limit > 0 ? Math.min(rawUsed, limit) : rawUsed;
      const left = limit > 0 ? Math.max(0, limit - used) : 0;
      const usedPercent = limit > 0 ? Math.round((used / limit) * 100) : 0;

      if (hasAccountData && limit === 0) {
        trafficLeft.textContent = "∞";
        trafficNote.textContent = `без ограничения тарифа · использовано ${rawUsed.toFixed(2)} ГБ`;
        trafficBar.style.width = "100%";
      } else {
        trafficLeft.textContent = hasAccountData && limit > 0 ? left.toFixed(1) : "—";
        trafficNote.textContent =
          hasAccountData && limit > 0
            ? `осталось из ${limit} ГБ · использовано ${usedPercent}%`
            : "Войдите, чтобы увидеть остаток трафика";
        trafficBar.style.width = `${usedPercent}%`;
      }
      trafficBar.parentElement?.setAttribute(
        "aria-label",
        hasAccountData
          ? limit === 0
            ? "Трафик без ограничения тарифа"
            : `Использовано ${usedPercent}%`
          : "Трафик появится после входа"
      );
    }

    if (subLink) {
      subLink.dataset.subscriptionLink = subscriptionUrl;
      subLink.textContent = subscriptionUrl || "Ключ появится после входа";
    }

    renderProfileList(hasAccountData);
  }

  function completeApiAuth(data, successMessage) {
    applyApiAccount(data.account, data.token, data.profiles);
    updateAccountIdentity();
    saveStoredAccount();
    setApiStatus("is-ready", "Кабинет готов: ключ и срок подписки обновлены.");

    if (authLabel) {
      authLabel.textContent = "Кабинет";
    }
    isAuthenticated = true;
    closeAuth();
    openAccount(pendingAccountTab, true);
    pendingAccountTab = "overview";
    showToast(successMessage);
  }

  function setAuthMethod(methodName) {
    const safeMethod = getSafeAuthMethod(methodName);

    authMethods.forEach((method) => {
      method.classList.toggle("active", method.dataset.authMethod === safeMethod);
    });

    authPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.authPanel === safeMethod);
    });
  }

  function openAccount(tab = "overview", skipAuthCheck = false) {
    const safeTab = getSafeTab(tab);

    if (!skipAuthCheck && !isAuthenticated) {
      pendingAccountTab = safeTab;
      openAuth("telegram");
      return;
    }

    if (!accountPage) {
      return;
    }

    accountPage.hidden = false;
    document.body.classList.add("account-route");

    if (window.location.hash !== "#account") {
      window.history.pushState(null, "", "#account");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setTab(safeTab);
  }

  function closeAccount() {
    isAuthenticated = false;
    pendingAccountTab = "overview";
    clearStoredAccount();
    apiSessionToken = "";

    if (accountPage) {
      accountPage.hidden = true;
    }

    document.body.classList.remove("account-route");

    if (authLabel) {
      authLabel.textContent = "Войти";
    }

    if (window.location.hash === "#account") {
      window.history.pushState(null, "", "#home");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Вы вышли из личного кабинета");
  }

  function leaveAccountView() {
    if (accountPage) {
      accountPage.hidden = true;
    }

    document.body.classList.remove("account-route");
  }

  function setTab(tabName) {
    const safeTab = getSafeTab(tabName);

    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === safeTab);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === safeTab);
    });

    if (accountTitle) {
      accountTitle.textContent = titles[safeTab];
    }
  }

  function showToast(message) {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  openAccountButtons.forEach((button) => {
    button.addEventListener("click", () => openAccount());
  });

  closeAccountButtons.forEach((button) => {
    button.addEventListener("click", closeAccount);
  });

  closeAuthButtons.forEach((button) => {
    button.addEventListener("click", closeAuth);
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTab(tab.dataset.tab));
  });

  authMethods.forEach((method) => {
    method.addEventListener("click", () => setAuthMethod(method.dataset.authMethod));
  });

  authDialog?.addEventListener("click", (event) => {
    if (event.target === authDialog) {
      closeAuth();
    }
  });

  telegramLoginButton?.addEventListener("click", async () => {
    telegramLoginButton.disabled = true;
    telegramLoginButton.textContent = "Откройте Telegram";

    try {
      const login = await apiFetch("/api/auth/telegram/request", {
        method: "POST",
        body: JSON.stringify({}),
      });

      setApiStatus(
        "is-checking",
        "Подтвердите вход в Telegram. Кабинет откроется автоматически."
      );
      window.open(login.botUrl, "_blank", "noopener,noreferrer");

      for (let attempt = 0; attempt < 30; attempt += 1) {
        await wait(2000);
        const status = await apiFetch(
          `/api/auth/telegram/status/${encodeURIComponent(login.requestToken)}`
        );

        if (status.status === "confirmed") {
          completeApiAuth(status, "Вход через Telegram выполнен");
          return;
        }

        if (status.status === "expired") {
          setApiStatus("is-warning", "Ссылка устарела. Нажмите вход через Telegram еще раз.");
          return;
        }
      }

      setApiStatus("is-warning", "Не дождались подтверждения. Нажмите кнопку еще раз.");
    } catch {
      explainApiDelay();
    } finally {
      telegramLoginButton.disabled = false;
      telegramLoginButton.textContent = "Войти через Telegram";
    }
  });

  emailAuthForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(emailAuthForm);
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      setApiStatus("is-warning", "Введите корректную почту.");
      return;
    }

    pendingEmail = email;
    codeBox.hidden = false;
    emailSubmit.textContent = "Отправить код еще раз";

    try {
      const data = await apiFetch("/api/auth/email/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setApiStatus(
        data.ok ? "is-ready" : "is-warning",
        data.ok ? "Код отправлен на почту." : "Повторите попытку позже."
      );
    } catch {
      explainApiDelay();
    }
  });

  confirmCodeButton?.addEventListener("click", async () => {
    const codeInput = emailAuthForm?.elements.namedItem("code");
    const code = String(codeInput?.value || "").trim();

    if (!pendingEmail) {
      setApiStatus("is-warning", "Сначала укажите почту.");
      return;
    }

    try {
      const data = await apiFetch("/api/auth/email/verify", {
        method: "POST",
        body: JSON.stringify({ email: pendingEmail, code }),
      });
      completeApiAuth(data, "Вход по email выполнен");
      return;
    } catch {
      setApiStatus("is-warning", "Неверный код или кабинет временно недоступен.");
      return;
    }
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getSafeSubscriptionLink());
      showToast("Ссылка скопирована");
    } catch {
      showToast("Скопируйте ссылку вручную");
    }
  });

  openHappButton?.addEventListener("click", () => {
    if (!isAuthenticated) {
      openAuth("telegram");
      return;
    }

    try {
      const subscriptionUrl = getSafeSubscriptionLink();
      navigator.clipboard?.writeText(subscriptionUrl).catch(() => {});
      window.location.href = `happ://add/${encodeURIComponent(subscriptionUrl)}`;
      showToast("Открываем Happ. Ссылка также скопирована");
    } catch {
      showToast("Ключ еще не готов");
    }
  });

  rotateKeyButton?.addEventListener("click", async () => {
    if (!isAuthenticated) {
      openAuth("telegram");
      return;
    }

    if (apiSessionToken) {
      try {
        const data = await apiFetch("/api/account/rotate-key", {
          method: "POST",
          body: JSON.stringify({}),
        });
        applyApiAccount(data.account, apiSessionToken, data.profiles);
        updateAccountIdentity();
        saveStoredAccount();
        showToast("Ключ перевыпущен");
        return;
      } catch {
        showToast("API недоступен, ключ не изменен");
        return;
      }
    }

    showToast("Войдите заново, чтобы перевыпустить ключ");
  });

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const plan = allowedPlans.has(button.dataset.plan) ? button.dataset.plan : "тариф";

      openAccount("payments");
      showToast(`Выбран тариф: ${plan}`);
    });
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#account") {
      openAccount("overview");
      return;
    }

    if (document.body.classList.contains("account-route")) {
      leaveAccountView();
    }
  });

  loadStoredAccount();
  checkApiStatus();

  if (isAuthenticated) {
    updateAccountIdentity();
    refreshApiAccount().catch(() => {
      explainApiDelay();
    });
    if (authLabel) {
      authLabel.textContent = "Кабинет";
    }
  }

  if (window.location.hash === "#account") {
    openAccount("overview");
  }
})();
