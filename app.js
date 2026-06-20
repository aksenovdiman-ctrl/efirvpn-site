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
  const demoTelegramButton = document.querySelector("[data-demo-telegram-login]");
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
  const subscriptionBase = "https://panel.efirvpn.ru/api/sub";
  const storageKey = "efirvpn.account.v1";
  const demoEmailCode = "123456";

  let toastTimer = 0;
  let isAuthenticated = false;
  let pendingAccountTab = "overview";
  let pendingEmail = "";
  let currentIdentity = {
    email: "aksenov_1998@efir.local",
    provider: "Telegram подключен",
    providerTitle: "Telegram подключен",
    username: "aksenov_1998",
    subscriptionToken: "efir-preview-key",
    expiresAt: getDateAfterDays(5),
    trafficLimitGb: 80,
    trafficUsedGb: 4,
  };

  function getDateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

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

  function createToken(seed) {
    let hash = 2166136261;
    const source = `${seed}:${Date.now()}:${Math.random()}`;

    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return `efir_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
  }

  function getSubscriptionUrl(token = currentIdentity.subscriptionToken) {
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
      isAuthenticated = true;
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }

  function saveStoredAccount() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(currentIdentity));
    } catch {
      showToast("Браузер не сохранил сессию");
    }
  }

  function clearStoredAccount() {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // The in-memory session is still cleared below.
    }
  }

  function getSafeTab(tabName) {
    return allowedTabs.has(tabName) ? tabName : "overview";
  }

  function getSafeSubscriptionLink() {
    const rawLink = subLink?.dataset.subscriptionLink || "";
    const url = new URL(rawLink);

    if (url.protocol !== "https:" || url.hostname !== allowedSubscriptionHost) {
      throw new Error("Unexpected subscription link origin");
    }

    return url.toString();
  }

  function getSafeAuthMethod(methodName) {
    return allowedAuthMethods.has(methodName) ? methodName : "telegram";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

    if (accountUser) {
      accountUser.textContent = currentIdentity.username;
    }

    if (accountProvider) {
      accountProvider.textContent = currentIdentity.provider;
    }

    if (accountProviderTitle) {
      accountProviderTitle.textContent = currentIdentity.providerTitle || currentIdentity.provider;
    }

    if (accountEmail) {
      accountEmail.textContent = currentIdentity.email;
    }

    if (accountExpires) {
      accountExpires.textContent = formatShortDate(currentIdentity.expiresAt);
    }

    if (accountDaysLeft) {
      const daysLeft = getDaysLeft(currentIdentity.expiresAt);
      accountDaysLeft.textContent = `Осталось ${daysLeft} дн.`;
    }

    if (trafficLeft && trafficNote && trafficBar) {
      const limit = Number(currentIdentity.trafficLimitGb) || 80;
      const used = Math.min(Number(currentIdentity.trafficUsedGb) || 0, limit);
      const left = Math.max(0, limit - used);
      const usedPercent = Math.round((used / limit) * 100);

      trafficLeft.textContent = left.toFixed(1);
      trafficNote.textContent = `осталось из ${limit} ГБ · использовано ${usedPercent}%`;
      trafficBar.style.width = `${usedPercent}%`;
      trafficBar.parentElement?.setAttribute("aria-label", `Использовано ${usedPercent}%`);
    }

    if (subLink) {
      subLink.dataset.subscriptionLink = subscriptionUrl;
      subLink.textContent = subscriptionUrl;
    }
  }

  function completeAuth(provider) {
    isAuthenticated = true;
    const baseTokenSeed = provider === "email" ? pendingEmail : "telegram";
    currentIdentity =
      provider === "email"
        ? {
            email: pendingEmail,
            provider: "Email подключен",
            providerTitle: "Email привязан",
            username: pendingEmail.split("@")[0],
            subscriptionToken: createToken(baseTokenSeed),
            expiresAt: getDateAfterDays(5),
            trafficLimitGb: 80,
            trafficUsedGb: 4,
          }
        : {
            email: "aksenov_1998@efir.local",
            provider: "Telegram подключен",
            providerTitle: "Telegram подключен",
            username: "aksenov_1998",
            subscriptionToken: createToken(baseTokenSeed),
            expiresAt: getDateAfterDays(5),
            trafficLimitGb: 80,
            trafficUsedGb: 4,
          };

    updateAccountIdentity();
    saveStoredAccount();

    if (authLabel) {
      authLabel.textContent = "Кабинет";
    }
    closeAuth();
    openAccount(pendingAccountTab, true);
    pendingAccountTab = "overview";
    showToast(provider === "email" ? "Вход по email выполнен" : "Вход через Telegram выполнен");
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

  demoTelegramButton?.addEventListener("click", () => {
    completeAuth("telegram");
  });

  emailAuthForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(emailAuthForm);
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      authMessage.textContent = "Введите корректную почту.";
      return;
    }

    pendingEmail = email;
    codeBox.hidden = false;
    emailSubmit.textContent = "Отправить код еще раз";
    authMessage.textContent = "Демо-код: 123456. В продакшене код придет на почту.";
  });

  confirmCodeButton?.addEventListener("click", () => {
    const codeInput = emailAuthForm?.elements.namedItem("code");
    const code = String(codeInput?.value || "").trim();

    if (!pendingEmail) {
      authMessage.textContent = "Сначала укажите почту.";
      return;
    }

    if (code !== demoEmailCode) {
      authMessage.textContent = "Неверный код. Для демо используйте 123456.";
      return;
    }

    completeAuth("email");
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
    window.open(getSafeSubscriptionLink(), "_blank", "noopener,noreferrer");
    showToast("Открываем ключ подключения");
  });

  rotateKeyButton?.addEventListener("click", () => {
    if (!isAuthenticated) {
      openAuth("telegram");
      return;
    }

    currentIdentity = {
      ...currentIdentity,
      subscriptionToken: createToken(currentIdentity.email || currentIdentity.username),
    };
    updateAccountIdentity();
    saveStoredAccount();
    showToast("Ключ перевыпущен");
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
  if (isAuthenticated) {
    updateAccountIdentity();
    if (authLabel) {
      authLabel.textContent = "Кабинет";
    }
  }

  if (window.location.hash === "#account") {
    openAccount("overview");
  }
})();
