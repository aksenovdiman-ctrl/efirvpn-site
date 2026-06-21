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
  const telegramStaticLink = document.querySelector("[data-telegram-static]");
  const accountTitle = document.querySelector("[data-account-title]");
  const accountUser = document.querySelector("[data-account-user]");
  const accountProvider = document.querySelector("[data-account-provider]");
  const accountProviderTitle = document.querySelector("[data-account-provider-title]");
  const accountEmail = document.querySelector("[data-account-email]");
  const accountDevicesUsed = document.querySelector("[data-account-devices-used]");
  const accountDeviceLimit = document.querySelector("[data-account-device-limit]");
  const accountDaysLeft = document.querySelector("[data-account-days-left]");
  const accountExpires = document.querySelector("[data-account-expires]");
  const accountStatusBadge = document.querySelector("[data-account-status-badge]");
  const trafficLeft = document.querySelector("[data-traffic-left]");
  const trafficUsed = document.querySelector("[data-traffic-used]");
  const trafficLimit = document.querySelector("[data-traffic-limit]");
  const trafficNote = document.querySelector("[data-traffic-note]");
  const trafficMeta = document.querySelector("[data-traffic-meta]");
  const trafficSpentRow = document.querySelector("[data-traffic-spent]");
  const trafficDescription = document.querySelector("[data-traffic-description]");
  const trafficStatusBadge = document.querySelector("[data-traffic-status-badge]");
  const trafficBar = document.querySelector("[data-traffic-bar]");
  const happPreviewTitle = document.querySelector("[data-happ-preview-title]");
  const happPreviewUpdated = document.querySelector("[data-happ-preview-updated]");
  const happPreviewTraffic = document.querySelector("[data-happ-preview-traffic]");
  const happPreviewExpires = document.querySelector("[data-happ-preview-expires]");
  const happPreviewBar = document.querySelector("[data-happ-preview-bar]");
  const happPreviewNote = document.querySelector("[data-happ-preview-note]");
  const copyButtons = document.querySelectorAll("[data-copy-sub]");
  const openHappButtons = document.querySelectorAll("[data-open-happ]");
  const rotateKeyButtons = document.querySelectorAll("[data-rotate-key]");
  const linkTelegramButtons = document.querySelectorAll("[data-link-telegram]");
  const linkEmailButtons = document.querySelectorAll("[data-link-email]");
  const planUpgradeButton = document.querySelector("[data-plan-upgrade]");
  const subLink = document.querySelector("#subLink");
  const profileList = document.querySelector("[data-profile-list]");
  const activityList = document.querySelector("[data-activity-list]");
  const activityEmpty = document.querySelector("[data-activity-empty]");
  const toast = document.querySelector("#toast");
  const planButtons = document.querySelectorAll("[data-plan]");

  const titles = Object.freeze({
    overview: "Мой VPN",
    devices: "Подключить устройство",
    payments: "Тарифы",
    help: "Поддержка",
  });

  const allowedTabs = new Set(Object.keys(titles));
  const allowedPlans = new Set(["1 месяц", "3 месяца", "6 месяцев", "12 месяцев"]);
  const allowedAuthMethods = new Set(["telegram", "email"]);
  const allowedSubscriptionHost = "panel.efirvpn.ru";
  const apiBase = "https://panel.efirvpn.ru/efir-api";
  const subscriptionBase = "https://panel.efirvpn.ru/api/sub";
  const storageKey = "efirvpn.account.v1";
  const sessionStorageKey = "efirvpn.session.v1";

  const profileNames = Object.freeze([
    "Efir Helsinki · Основной",
    "Efir Reserve 1 · резервная линия",
    "Efir Reserve 2 · стабильная сеть",
    "Efir Reserve 3 · низкая задержка",
  ]);
  const defaultDeviceLimit = 5;

  const subscriptionOverviewLines = Object.freeze([
    "🟢 Основная линия: Helsinki / Finland",
    "↳ Резервные профили помогают при нестабильной сети",
    "↳ Формат профилей: VLESS | TCP | Reality | JSON",
    "↳ Один личный ключ для Happ, v2rayN, v2rayNG и Shadowrocket",
  ]);

  let toastTimer = 0;
  let isAuthenticated = false;
  let pendingAccountTab = "overview";
  let pendingEmail = "";
  let apiSessionToken = "";
  let currentProfiles = [];
  let currentEvents = [];
  let hasOpenedSessionLog = false;
  let authCapabilities = {
    telegram: true,
    email: false,
  };
  let currentIdentity = {
    email: "",
    providerKey: "",
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

  function formatShortTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function formatGb(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return "0";
    }

    return numeric % 1 === 0 ? String(Math.trunc(numeric)) : numeric.toFixed(1);
  }

  function applyStatusBadge(element, enabled, text) {
    if (!element) {
      return;
    }
    element.textContent = text;
    element.dataset.status = enabled ? "active" : "inactive";
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

  function formatProfileDisplayName(index, profileName) {
    const safeName = typeof profileName === "string" ? profileName.trim() : "";
    const blockedFragments = ["germany", "запасная", "запасной", "обход", "глуш"];
    const hasBlockedFragment = blockedFragments.some((fragment) =>
      safeName.toLowerCase().includes(fragment),
    );
    if (safeName && !hasBlockedFragment) {
      return safeName;
    }

    return profileNames[index] || `Efir Reserve ${index + 1} · резервный профиль`;
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
      const storedToken = window.localStorage.getItem(sessionStorageKey) || "";
      apiSessionToken = storedToken;
      isAuthenticated = typeof storedToken === "string" && storedToken.length > 20;
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

  class ApiError extends Error {
    constructor(status, message, details) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.details = details;
    }
  }

  function clearAuthState(shouldToast = false, message = "") {
    clearStoredAccount();
    apiSessionToken = "";
    isAuthenticated = false;
    currentIdentity = {
      ...currentIdentity,
      email: "",
      providerKey: "",
      provider: "Войдите в кабинет",
      providerTitle: "Войдите в кабинет",
      username: "Аккаунт",
      subscriptionUrl: "",
      subscriptionToken: "",
      expiresAt: "",
      trafficLimitGb: 0,
      trafficUsedGb: 0,
    };
    currentProfiles = [];
    currentEvents = [];
    updateAccountIdentity();

    if (shouldToast) {
      showToast(message || "Сессия завершена. Войдите заново.");
    }
  }

  function handleApiError(error) {
    if (error instanceof ApiError && error.status === 401) {
      clearAuthState(true, "Сессия истекла. Войдите заново.");
      setApiStatus("is-warning", "Сессия истекла. Нажмите вход, чтобы обновить доступ.");
      return;
    }

    throw error;
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
      const details = await response.text().catch(() => "");
      if (response.status === 401) {
        handleApiError(new ApiError(response.status, `API ${response.status}`, details));
      }

      throw new ApiError(response.status, `API ${response.status}`, details);
    }

    return response.json();
  }

  function applyApiAccount(
    account,
    token = apiSessionToken,
    profiles = currentProfiles,
    events = currentEvents
  ) {
    if (!account || typeof account !== "object") {
      throw new Error("Invalid account response");
    }

    apiSessionToken = token || apiSessionToken;
    currentProfiles = Array.isArray(profiles) ? profiles : [];
    currentEvents = Array.isArray(events) ? events : [];
    currentIdentity = {
      ...currentIdentity,
      email: account.email || currentIdentity.email,
      providerKey: account.provider || currentIdentity.providerKey,
      provider: account.provider === "email" ? "Email подключен" : "Telegram подключен",
      providerTitle: account.provider === "email" ? "Email привязан" : "Telegram подключен",
      username: account.username || account.email || currentIdentity.username,
      subscriptionUrl: account.subscriptionUrl || currentIdentity.subscriptionUrl,
      expiresAt: account.expiresAt || currentIdentity.expiresAt,
      trafficLimitGb: account.trafficLimitGb ?? currentIdentity.trafficLimitGb,
      trafficUsedGb: account.trafficUsedGb ?? currentIdentity.trafficUsedGb,
    };
  }

  async function refreshApiAccount() {
    if (!apiSessionToken) {
      return false;
    }

    const data = await apiFetch("/api/account");
    applyApiAccount(data.account, apiSessionToken, data.profiles, data.events);
    updateAccountIdentity();
    renderActivityLog();
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
    const labelMap = {
      reality: "Reality",
      tcp: "TCP",
      vless: "VLESS",
      tls: "TLS",
      httpupgrade: "HTTP upgrade",
      xhttp: "XHTTP",
    };
    const parts = [profile.protocol, profile.network, profile.security, profile.json ? "JSON" : ""]
      .filter(Boolean)
      .map((part) => labelMap[String(part).toLowerCase()] || String(part).toUpperCase());
    return parts.join(" | ") || "VLESS | TCP | Reality | JSON";
  }

  function formatProfileType(index) {
    if (index === 0) {
      return "основной";
    }

    const reserveTypes = ["резервная линия", "стабильная сеть", "низкая задержка", "резервный профиль"];
    return reserveTypes[index - 1] || "резервный";
  }

  function formatProfileIcon(index) {
    return index === 0 ? "🇫🇮" : "★";
  }

  function isAuthMethodAvailable(methodName) {
    return authCapabilities[getSafeAuthMethod(methodName)] !== false;
  }

  function getEventIcon(eventType) {
    switch (eventType) {
      case "auth_started":
        return "🔐";
      case "email_connected":
        return "✉️";
      case "telegram_connected":
        return "📲";
      case "telegram_link_started":
        return "✈️";
      case "subscription_created":
        return "🧩";
      case "email_link_started":
        return "📧";
      case "auth_completed":
        return "✅";
      case "trial_created":
      case "connection_confirmed":
        return "🟢";
      case "subscription_link_copied":
        return "📋";
      case "happ_open_clicked":
        return "🔌";
      case "instruction_opened":
        return "📘";
      case "key_rotated":
        return "♻️";
      case "payment_started":
        return "💳";
      case "support_started":
        return "🧑‍💼";
      case "connection_failed":
        return "⚠️";
      case "payment_succeeded":
        return "💚";
      case "payment_failed":
        return "🔥";
      default:
        return "🧭";
    }
  }

  function normalizeEvent({ eventType, title, details, createdAt }) {
    return {
      eventType: typeof eventType === "string" && eventType ? eventType : "account_event",
      title: typeof title === "string" && title ? title : "Событие",
      details: typeof details === "string" && details ? details : "",
      createdAt: typeof createdAt === "string" && createdAt ? createdAt : new Date().toISOString(),
    };
  }

  function addLocalEvent(eventType, title, details) {
    const localEvent = normalizeEvent({
      eventType,
      title,
      details,
      createdAt: new Date().toISOString(),
    });

    const next = [localEvent, ...currentEvents]
      .filter((event, index, list) => {
        const key = `${event.eventType}|${event.createdAt}|${event.title}`;
        return list.findIndex((item) => `${item.eventType}|${item.createdAt}|${item.title}` === key) === index;
      })
      .slice(0, 20);

    currentEvents = next;
    renderActivityLog();
  }

  async function emitAccountEvent(eventType, title, details) {
    if (!isAuthenticated || !apiSessionToken) {
      addLocalEvent(eventType, title, details);
      return;
    }

    try {
      await apiFetch("/api/events", {
        method: "POST",
        body: JSON.stringify({
          event_type: eventType,
          title,
          details,
        }),
      });
    } catch {
      // API can be temporarily unavailable. Keep local audit in UI anyway.
    }

    addLocalEvent(eventType, title, details);
  }

  function renderActivityLog() {
    if (!activityList || !activityEmpty) {
      return;
    }

    activityList.replaceChildren();

    if (!isAuthenticated) {
      activityList.hidden = true;
      activityEmpty.hidden = false;
      activityEmpty.textContent = "Войдите, чтобы увидеть историю.";
      return;
    }

    if (!currentEvents.length) {
      activityList.hidden = true;
      activityEmpty.hidden = false;
      activityEmpty.textContent = "Журнал пока пустой.";
      return;
    }

    activityList.hidden = false;
    activityEmpty.hidden = true;

    currentEvents.forEach((event) => {
      const item = document.createElement("article");
      const icon = document.createElement("span");
      const body = document.createElement("div");
      const title = document.createElement("strong");
      const details = document.createElement("p");
      const meta = document.createElement("small");

      item.className = "activity-item";
      icon.className = "activity-icon";
      icon.textContent = getEventIcon(event.eventType);

      title.textContent = event.title || "Событие";
      details.textContent = event.details || "";
      meta.textContent = formatShortTime(event.createdAt);

      body.append(title, details);
      item.append(icon, body, meta);
      activityList.append(item);
    });
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

      icon.className = "flag flag--placeholder";
      icon.textContent = "VPN";
      title.textContent = hasAccountData ? "Профили обновляются" : "Профили появятся после входа";
      meta.textContent = "VLESS | TCP | Reality | JSON";
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

      icon.className = index === 0 ? "flag flag--country" : "flag flag--reserve";
      icon.textContent = formatProfileIcon(index);
      title.textContent = formatProfileDisplayName(index, profile.name);
      meta.textContent = formatProfileProtocol(profile);
      status.textContent = formatProfileType(index);

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

  function availableAuthMethodsText() {
    const enabled = [];
    if (authCapabilities.telegram) {
      enabled.push("Telegram");
    }
    if (authCapabilities.email) {
      enabled.push("Email");
    }
    return enabled.join(" или ");
  }

  function updateAuthAvailability() {
    authMethods.forEach((method) => {
      const authMethod = getSafeAuthMethod(method.dataset.authMethod);
      const enabled = isAuthMethodAvailable(authMethod);
      method.disabled = !enabled;
      method.setAttribute("aria-disabled", String(!enabled));
    });

    if (telegramLoginButton) {
      telegramLoginButton.disabled = !authCapabilities.telegram;
      telegramLoginButton.textContent = authCapabilities.telegram
        ? "Войти через Telegram"
        : "Telegram скоро подключим";
    }

    if (telegramStaticLink) {
      telegramStaticLink.setAttribute("aria-disabled", String(!authCapabilities.telegram));
      telegramStaticLink.tabIndex = authCapabilities.telegram ? 0 : -1;
    }

    if (emailSubmit) {
      emailSubmit.disabled = !authCapabilities.email;
      emailSubmit.textContent = authCapabilities.email ? "Получить код" : "Email скоро подключим";
    }

    if (confirmCodeButton) {
      confirmCodeButton.disabled = !authCapabilities.email;
    }

    const activeMethod = document.querySelector("[data-auth-method].active")?.dataset.authMethod || "telegram";
    if (!isAuthMethodAvailable(activeMethod)) {
      const fallback = authCapabilities.telegram ? "telegram" : authCapabilities.email ? "email" : "telegram";
      setAuthMethod(fallback);
    }
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
        const hasCurrentAccountApi = Boolean(
          health.apiVersion &&
            health.apiBuild &&
            health.auth &&
            typeof health.telegramConfigured === "boolean" &&
            typeof health.emailConfigured === "boolean"
        );

        if (!hasCurrentAccountApi) {
          authCapabilities = {
            telegram: false,
            email: false,
          };
          updateAuthAvailability();
          setApiStatus(
            "is-warning",
            "Кабинет обновляется: сайт уже готов, но API панели еще ждёт деплой."
          );
          return false;
        }

        authCapabilities = {
          telegram: health.telegramConfigured,
          email: Boolean(health.emailConfigured),
        };
        updateAuthAvailability();

        const authText = availableAuthMethodsText();
        setApiStatus(
          authText ? "is-ready" : "is-warning",
          authText
            ? `Кабинет готов: вход через ${authText}.`
            : "Кабинет API работает, но способы входа еще не подключены."
        );
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
    const limit = Number(currentIdentity.trafficLimitGb) || 0;
    const rawUsed = Number(currentIdentity.trafficUsedGb) || 0;
    const used = limit > 0 ? Math.min(rawUsed, limit) : rawUsed;
    const left = limit > 0 ? Math.max(0, limit - used) : 0;
    const usedPercent = limit > 0 ? Math.round((used / limit) * 100) : 0;
    const leftText = formatGb(left);
    const usedText = formatGb(rawUsed);
    const limitText = formatGb(limit);

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
        applyStatusBadge(accountStatusBadge, true, "Подписка активна");
      } else {
        accountDaysLeft.textContent = "Войдите, чтобы увидеть срок";
        applyStatusBadge(accountStatusBadge, false, "Вход не выполнен");
      }
    }

    if (accountDevicesUsed && accountDeviceLimit) {
      accountDevicesUsed.textContent = hasAccountData ? "0" : "—";
      accountDeviceLimit.textContent = ` / ${defaultDeviceLimit}`;
    }

    if (happPreviewTitle && happPreviewUpdated && happPreviewTraffic && happPreviewExpires && happPreviewBar && happPreviewNote) {
      happPreviewTitle.textContent = hasAccountData ? "EfirVPN · личный доступ" : "EfirVPN · профиль ожидает входа";
      happPreviewUpdated.textContent = hasAccountData
        ? "Автообновление подписки · Happ JSON"
        : "Автообновление профиля после входа";
      happPreviewTraffic.textContent = hasAccountData
        ? limit > 0
          ? `${usedText} GB/${limitText} GB`
          : `${usedText} GB/∞`
        : "— GB/∞";
      happPreviewExpires.textContent = hasAccountData
        ? `Истекает: ${formatShortDate(currentIdentity.expiresAt)}`
        : "Истекает: —";
      happPreviewBar.style.width = hasAccountData
        ? limit > 0
          ? `${Math.min(100, usedPercent)}%`
          : "100%"
        : "8%";
      happPreviewNote.textContent = hasAccountData
        ? `${limit > 0 ? `🟢 Осталось ${leftText} ГБ из ${limitText} ГБ` : "🟢 Безлимитный пакет активен"}\n↳ Основная линия: Helsinki / Finland\n↳ Резервные профили: VLESS | TCP | Reality | JSON`
        : "🟢 Основная линия Helsinki готовится после входа\n↳ Резервные профили появятся в одном JSON-ключе";
    }

    if (trafficLeft && trafficUsed && trafficLimit && trafficNote && trafficBar && trafficMeta && trafficSpentRow) {
      if (hasAccountData && limit === 0) {
        trafficLeft.textContent = "∞";
        trafficUsed.textContent = usedText;
        trafficLimit.textContent = "0";
        trafficMeta.textContent = `Израсходовано: ${usedText} ГБ / Безлимит`;
        trafficSpentRow.textContent = `Без лимита • использовано ${usedText} ГБ`;
        trafficNote.textContent = `Безлимитный тариф · трафик обновляется по лимитам подписки`;
        trafficBar.style.width = "100%";
        applyStatusBadge(trafficStatusBadge, true, "Безлимит");
      } else {
        trafficLeft.textContent = hasAccountData && limit > 0 ? leftText : "—";
        trafficUsed.textContent = hasAccountData ? usedText : "—";
        trafficLimit.textContent = hasAccountData ? limitText : "—";
        trafficMeta.textContent = hasAccountData
          ? `Израсходовано: ${usedText} ГБ • Лимит: ${limitText} ГБ`
          : "Войдите, чтобы увидеть данные по трафику";
        trafficNote.textContent = hasAccountData && limit > 0
          ? `Остаток: ${leftText} ГБ • Использовано: ${usedText} ГБ`
          : "Войдите, чтобы увидеть остаток трафика";
        trafficSpentRow.textContent = hasAccountData
          ? `Остаток ${leftText} ГБ из ${limitText} ГБ (${usedPercent}%)`
          : "Загрузка данных...";
        trafficBar.style.width = `${Math.min(100, usedPercent)}%`;
        if (hasAccountData) {
          applyStatusBadge(trafficStatusBadge, usedPercent < 90, `Загрузка: ${usedPercent}%`);
        } else {
          applyStatusBadge(trafficStatusBadge, false, "Нужна авторизация");
        }
      }

      if (trafficDescription) {
        if (hasAccountData) {
          const remainingLine =
            limit > 0
              ? `↳ Остаток: ${leftText} ГБ из ${limitText} ГБ`
              : "↳ Безлимитный пакет, остаток неограничен";

          trafficDescription.textContent = `${remainingLine}\n${subscriptionOverviewLines.join("\n")}`;
        } else {
          trafficDescription.textContent =
            "После входа здесь будет видно, сколько ГБ осталось, где основной профиль и какие резервы доступны.";
        }
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
    renderActivityLog();
  }

  function completeApiAuth(data, successMessage) {
    applyApiAccount(data.account, data.token, data.profiles, data.events);
    isAuthenticated = true;
    updateAccountIdentity();
    saveStoredAccount();
    setApiStatus("is-ready", "Кабинет готов: ключ и срок подписки обновлены.");
    emitAccountEvent("auth_completed", "Вход выполнен", "Профиль и ключ доступны в кабинете.");

    if (authLabel) {
      authLabel.textContent = "Кабинет";
    }
    closeAuth();
    openAccount(pendingAccountTab, true);
    pendingAccountTab = "overview";
    showToast(successMessage);
  }

  function setAuthMethod(methodName) {
    const safeMethod = getSafeAuthMethod(methodName);
    if (!isAuthMethodAvailable(safeMethod)) {
      setApiStatus(
        "is-warning",
        !authCapabilities.telegram && !authCapabilities.email
          ? "Кабинет обновляется: сайт уже готов, но API панели еще ждёт деплой."
          : `${safeMethod === "email" ? "Email" : "Telegram"} вход еще не подключен.`
      );
      return;
    }

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

    hasOpenedSessionLog = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
    setTab(safeTab);
  }

  function closeAccount() {
    isAuthenticated = false;
    pendingAccountTab = "overview";
    currentEvents = [];
    currentProfiles = [];
    clearStoredAccount();
    apiSessionToken = "";
    currentIdentity = {
      ...currentIdentity,
      email: "",
      providerKey: "",
      provider: "Войдите в кабинет",
      providerTitle: "Войдите в кабинет",
      username: "Аккаунт",
      subscriptionUrl: "",
      subscriptionToken: "",
      expiresAt: "",
      trafficLimitGb: 0,
      trafficUsedGb: 0,
    };

    if (accountPage) {
      accountPage.hidden = true;
    }

    document.body.classList.remove("account-route");

    if (authLabel) {
      authLabel.textContent = "Войти";
    }

    hasOpenedSessionLog = false;

    if (window.location.hash === "#account") {
      window.history.pushState(null, "", "#home");
    }

    updateAccountIdentity();

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

    if (isAuthenticated) {
      if (safeTab === "devices") {
        emitAccountEvent("instruction_opened", "Открыта инструкция", "Пользователь перешел в раздел инструкции.");
      } else if (safeTab === "payments") {
        emitAccountEvent("tariff_selected", "Открыт раздел тарифов", "Пользователь открыл экраны продления.");
      } else if (safeTab === "help") {
        emitAccountEvent("support_started", "Открыта поддержка", "Пользователь открыл раздел поддержки.");
      } else if (safeTab === "overview") {
        if (!hasOpenedSessionLog) {
          emitAccountEvent("connection_confirmed", "Открыт профиль", "Пользователь открыл обзор подписки.");
          hasOpenedSessionLog = true;
        }
      }
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
    if (!authCapabilities.telegram) {
      setApiStatus("is-warning", "Telegram вход еще не подключен. Напишите в поддержку, если нужен ключ сейчас.");
      return;
    }

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

  linkTelegramButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!isAuthenticated) {
        openAuth("telegram");
        return;
      }

      if (currentIdentity.providerKey === "telegram") {
        showToast("Telegram уже подключен");
        return;
      }

      if (!authCapabilities.telegram) {
        setApiStatus("is-warning", "Telegram вход еще не подключен. Напишите в поддержку, если нужен ключ сейчас.");
        return;
      }

      button.disabled = true;
      button.textContent = "Откройте Telegram";

      try {
        const login = await apiFetch("/api/auth/telegram/request", {
          method: "POST",
          body: JSON.stringify({}),
        });

        setApiStatus("is-checking", "Подтвердите привязку в Telegram. Ключ останется тем же.");
        emitAccountEvent("telegram_link_started", "Привязка Telegram", "Открыта ссылка подтверждения Telegram для текущего ключа.");
        window.open(login.botUrl, "_blank", "noopener,noreferrer");

        for (let attempt = 0; attempt < 30; attempt += 1) {
          await wait(2000);
          const status = await apiFetch(
            `/api/auth/telegram/status/${encodeURIComponent(login.requestToken)}`
          );

          if (status.status === "confirmed") {
            completeApiAuth(status, "Telegram привязан к кабинету");
            return;
          }

          if (status.status === "expired") {
            setApiStatus("is-warning", "Ссылка устарела. Нажмите привязку еще раз.");
            return;
          }
        }

        setApiStatus("is-warning", "Не дождались подтверждения. Нажмите кнопку еще раз.");
      } catch {
        explainApiDelay();
      } finally {
        button.disabled = false;
        button.textContent = "Привязать Telegram";
      }
    });
  });

  linkEmailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!isAuthenticated) {
        openAuth("email");
        return;
      }

      if (currentIdentity.providerKey === "email") {
        showToast("Email уже подключен");
        return;
      }

      if (!authCapabilities.email) {
        setApiStatus("is-warning", "Email вход пока не подключен. Нужны SMTP-настройки для отправки кодов.");
        return;
      }

      pendingAccountTab = "overview";
      openAuth("email");
      setApiStatus("is-checking", "Введите Email: код привяжет почту к текущему ключу.");
      emitAccountEvent("email_link_started", "Привязка Email", "Открыта форма привязки Email к текущему ключу.");
    });
  });

  telegramStaticLink?.addEventListener("click", (event) => {
    if (!authCapabilities.telegram) {
      event.preventDefault();
      setApiStatus("is-warning", "Telegram вход еще не подключен. Напишите в поддержку, если нужен ключ сейчас.");
    }
  });

  emailAuthForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!authCapabilities.email) {
      setApiStatus("is-warning", "Email вход пока не подключен. Используйте Telegram или поддержку.");
      return;
    }

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

  async function copySubscriptionLink() {
    try {
      await navigator.clipboard.writeText(getSafeSubscriptionLink());
      await emitAccountEvent(
        "subscription_link_copied",
        "Ключ скопирован",
        "Пользователь скопировал subscription link из веб-кабинета."
      );
      showToast("Ссылка скопирована");
    } catch {
      emitAccountEvent(
        "subscription_link_copied",
        "Попытка скопировать ссылку",
        "Копирование в буфер прошло без API/браузерного разрешения."
      );
      showToast("Скопируйте ссылку вручную");
    }
  }

  async function openSubscriptionInHapp() {
    if (!isAuthenticated) {
      openAuth("telegram");
      return;
    }

    try {
      const subscriptionUrl = getSafeSubscriptionLink();
      navigator.clipboard?.writeText(subscriptionUrl).catch(() => {});
      window.location.href = `happ://add/${encodeURIComponent(subscriptionUrl)}`;
      await emitAccountEvent(
        "happ_open_clicked",
        "Запрос на добавление в Happ",
        "Переход выполнен по кнопке добавить в Happ."
      );
      showToast("Открываем Happ. Ссылка также скопирована");
    } catch {
      emitAccountEvent(
        "happ_open_clicked",
        "Не удалось открыть Happ",
        "Deep link был недоступен или ссылка еще не готова."
      );
      showToast("Ключ еще не готов");
    }
  }

  async function rotateSubscriptionKey() {
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
        applyApiAccount(data.account, apiSessionToken, data.profiles, data.events);
        updateAccountIdentity();
        saveStoredAccount();
        renderActivityLog();
        showToast("Ключ перевыпущен");
        emitAccountEvent("key_rotated", "Ключ перевыпущен", "Пользователь создал новый ключ вручную.");
        return;
      } catch {
        emitAccountEvent("key_rotated", "Ошибка перевыпуска", "Пользователь не смог перевыпустить ключ.");
        showToast("API недоступен, ключ не изменен");
        return;
      }
    }

    showToast("Войдите заново, чтобы перевыпустить ключ");
  }

  copyButtons.forEach((button) => {
    button.addEventListener("click", copySubscriptionLink);
  });

  openHappButtons.forEach((button) => {
    button.addEventListener("click", openSubscriptionInHapp);
  });

  rotateKeyButtons.forEach((button) => {
    button.addEventListener("click", rotateSubscriptionKey);
  });

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const plan = allowedPlans.has(button.dataset.plan) ? button.dataset.plan : "тариф";

      openAccount("payments");
      emitAccountEvent("payment_started", `Выбран тариф: ${plan}`, "Открыт выбор на оплату.");
      showToast(`Выбран тариф: ${plan}`);
    });
  });

  planUpgradeButton?.addEventListener("click", () => {
    openAccount("payments", true);
    emitAccountEvent("payment_started", "Открыта покупка трафика", "Пользователь нажал кнопку увеличения лимита.");
    showToast("Выберите удобный тариф в разделе Тарифы");
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
