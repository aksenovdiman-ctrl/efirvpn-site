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
  const authReadinessItems = document.querySelectorAll("[data-auth-ready-item]");
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
  const deviceSummary = document.querySelector("[data-device-summary]");
  const accountDaysLeft = document.querySelector("[data-account-days-left]");
  const accountExpires = document.querySelector("[data-account-expires]");
  const accountStatusBadge = document.querySelector("[data-account-status-badge]");
  const subscriptionNextAction = document.querySelector("[data-subscription-next-action]");
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
  const happPreviewProfiles = document.querySelector("[data-happ-preview-profiles]");
  const happPreviewLatency = document.querySelector("[data-happ-preview-latency]");
  const happPreviewNetwork = document.querySelector("[data-happ-preview-network]");
  const happPreviewTraffic = document.querySelector("[data-happ-preview-traffic]");
  const happPreviewExpires = document.querySelector("[data-happ-preview-expires]");
  const happPreviewBar = document.querySelector("[data-happ-preview-bar]");
  const happPreviewNote = document.querySelector("[data-happ-preview-note]");
  const copyButtons = document.querySelectorAll("[data-copy-sub]");
  const openHappButtons = document.querySelectorAll("[data-open-happ]");
  const rotateKeyButtons = document.querySelectorAll("[data-rotate-key]");
  const linkTelegramButtons = document.querySelectorAll("[data-link-telegram]");
  const linkEmailButtons = document.querySelectorAll("[data-link-email]");
  const supportLinks = document.querySelectorAll("[data-support-link]");
  const planUpgradeButton = document.querySelector("[data-plan-upgrade]");
  const subLink = document.querySelector("#subLink");
  const profileList = document.querySelector("[data-profile-list]");
  const profileReadiness = document.querySelector("[data-profile-readiness]");
  const deviceProfileList = document.querySelector("[data-device-profile-list]");
  const deviceSlotList = document.querySelector("[data-device-slot-list]");
  const happGuideList = document.querySelector("[data-happ-guide-list]");
  const manualSubscriptionLink = document.querySelector("[data-manual-subscription-link]");
  const manualExpires = document.querySelector("[data-manual-expires]");
  const manualTraffic = document.querySelector("[data-manual-traffic]");
  const manualProtocol = document.querySelector("[data-manual-protocol]");
  const manualTransport = document.querySelector("[data-manual-transport]");
  const manualSecurity = document.querySelector("[data-manual-security]");
  const manualFormat = document.querySelector("[data-manual-format]");
  const connectionReceiptTitle = document.querySelector("[data-connection-receipt-title]");
  const connectionReceiptSummary = document.querySelector("[data-connection-receipt-summary]");
  const connectionReceiptList = document.querySelector("[data-connection-receipt-list]");
  const connectStatus = document.querySelector("[data-connect-status]");
  const connectCode = document.querySelector("[data-connect-code]");
  const activityList = document.querySelector("[data-activity-list]");
  const activityEmpty = document.querySelector("[data-activity-empty]");
  const activitySummary = document.querySelector("[data-activity-summary]");
  const activityFilters = document.querySelectorAll("[data-activity-filter]");
  const activityRefreshButton = document.querySelector("[data-refresh-activity]");
  const paymentStatus = document.querySelector("[data-payment-status]");
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
  const planToTariffCode = Object.freeze({
    "1 месяц": "month_1",
    "3 месяца": "month_3",
    "6 месяцев": "month_6",
    "12 месяцев": "month_12",
  });
  const allowedAuthMethods = new Set(["telegram", "email"]);
  const allowedActivityGroups = new Set(["all", "account", "auth", "connection", "payment", "support"]);
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
  const fallbackHappGuideSteps = Object.freeze([
    {
      step: 1,
      title: "Установите Happ",
      description: "Откройте приложение и держите личный кабинет EfirVPN рядом.",
    },
    {
      step: 2,
      title: "Откройте личный ключ",
      description: "Нажмите «Открыть в Happ» или скопируйте subscription link вручную.",
    },
    {
      step: 3,
      title: "Обновите подписку",
      description: "В Happ появится профиль EfirVPN с основной линией Helsinki.",
    },
  ]);

  const subscriptionOverviewLines = Object.freeze([
    "🟢 Основная линия: Helsinki / Finland",
    "↳ Сеть активна: остаток и срок обновляются в личном кабинете",
    "↳ Резервные профили помогают при нестабильной сети",
    "↳ Формат профилей: VLESS | TCP | Reality | JSON",
    "↳ Один личный ключ для Happ, v2rayN, v2rayNG и Shadowrocket",
  ]);
  const fallbackEventMeta = Object.freeze({
    activity_opened: { icon: "🧾", label: "Журнал", group: "account", tone: "neutral" },
    auth_completed: { icon: "✅", label: "Вход выполнен", group: "auth", tone: "success" },
    auth_started: { icon: "🔐", label: "Вход начат", group: "auth", tone: "info" },
    connection_confirmed: { icon: "🟢", label: "Профиль открыт", group: "connection", tone: "success" },
    connection_failed: { icon: "⚠️", label: "Ошибка подключения", group: "connection", tone: "warning" },
    email_code_requested: { icon: "📧", label: "Код Email", group: "auth", tone: "info" },
    email_connected: { icon: "📧", label: "Email подключен", group: "auth", tone: "success" },
    email_link_started: { icon: "📧", label: "Привязка Email", group: "auth", tone: "info" },
    happ_open_clicked: { icon: "📲", label: "Открыт Happ", group: "connection", tone: "success" },
    instruction_opened: { icon: "📘", label: "Инструкция", group: "support", tone: "neutral" },
    key_rotated: { icon: "♻️", label: "Ключ обновлен", group: "connection", tone: "info" },
    payment_failed: { icon: "⚠️", label: "Оплата не прошла", group: "payment", tone: "warning" },
    payment_started: { icon: "💳", label: "Оплата начата", group: "payment", tone: "info" },
    payment_succeeded: { icon: "✅", label: "Оплата прошла", group: "payment", tone: "success" },
    status_opened: { icon: "📊", label: "Статус открыт", group: "account", tone: "neutral" },
    subscription_created: { icon: "🔑", label: "Подписка создана", group: "connection", tone: "success" },
    subscription_link_copied: { icon: "📋", label: "Ключ скопирован", group: "connection", tone: "info" },
    subscription_link_requested: { icon: "📲", label: "Ключ запрошен", group: "connection", tone: "info" },
    support_started: { icon: "💬", label: "Поддержка", group: "support", tone: "neutral" },
    tariff_selected: { icon: "💳", label: "Тариф выбран", group: "payment", tone: "info" },
    telegram_connected: { icon: "✈️", label: "Telegram подключен", group: "auth", tone: "success" },
    telegram_link_started: { icon: "✈️", label: "Привязка Telegram", group: "auth", tone: "info" },
    trial_created: { icon: "🟢", label: "Trial создан", group: "connection", tone: "success" },
  });

  let toastTimer = 0;
  let isAuthenticated = false;
  let pendingAccountTab = "overview";
  let pendingEmail = "";
  let apiSessionToken = "";
  let currentProfiles = [];
  let currentEvents = [];
  let eventMetaCatalog = { ...fallbackEventMeta };
  let activityFilter = "all";
  let activityRefreshLoading = false;
  let currentConnectionKit = null;
  let happManifest = {};
  let hasOpenedSessionLog = false;
  let pendingSessionEvents = [];
  let authCapabilities = {
    telegram: true,
    email: false,
  };
  let accountApiReady = false;
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
    subscriptionStatus: null,
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

  function getSubscriptionStatus(hasAccountData) {
    const status = currentIdentity.subscriptionStatus;
    if (hasAccountData && status && typeof status === "object") {
      return status;
    }

    if (!hasAccountData) {
      return {
        state: "signed_out",
        label: "Вход не выполнен",
        daysLeft: null,
        nextAction: "Войдите, чтобы увидеть состояние подписки.",
      };
    }

    const daysLeft = getDaysLeft(currentIdentity.expiresAt);
    return {
      state: daysLeft > 0 ? "active" : "expired",
      label: daysLeft > 0 ? "Подписка активна" : "Подписка истекла",
      daysLeft,
      nextAction:
        daysLeft > 0
          ? "Ключ, трафик и профили обновляются в личном кабинете."
          : "Продлите тариф, чтобы снова получить доступ.",
    };
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

    const manifestProfile = getHappManifestProfiles()[index];
    return manifestProfile?.name || profileNames[index] || `Efir Reserve ${index + 1} · резервный профиль`;
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
      subscriptionStatus: null,
    };
    currentProfiles = [];
    currentEvents = [];
    currentConnectionKit = null;
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
    events = currentEvents,
    connection = undefined
  ) {
    if (!account || typeof account !== "object") {
      throw new Error("Invalid account response");
    }

    apiSessionToken = token || apiSessionToken;
    currentProfiles = Array.isArray(profiles) ? profiles : [];
    currentEvents = Array.isArray(events) ? events : [];
    if (connection && typeof connection === "object") {
      currentConnectionKit = connection;
      if (Array.isArray(connection.profiles)) {
        currentProfiles = connection.profiles;
      }
    } else if (connection === null) {
      currentConnectionKit = null;
    }
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
      subscriptionStatus: account.subscriptionStatus || currentIdentity.subscriptionStatus,
    };
  }

  async function refreshApiAccount() {
    if (!apiSessionToken) {
      return false;
    }

    const data = await apiFetch("/api/account");
    applyApiAccount(data.account, apiSessionToken, data.profiles, data.events);
    await refreshConnectionKit();
    updateAccountIdentity();
    renderActivityLog();
    saveStoredAccount();
    return true;
  }

  async function refreshConnectionKit() {
    if (!apiSessionToken) {
      return false;
    }

    try {
      const data = await apiFetch("/api/account/connect");
      applyApiAccount(
        data.account,
        apiSessionToken,
        data.connection?.profiles || currentProfiles,
        currentEvents,
        data.connection || null
      );
      return true;
    } catch {
      return false;
    }
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

  function getSafeHappDeepLink(subscriptionUrl) {
    const fallback = `happ://add/${encodeURIComponent(subscriptionUrl)}`;
    const candidate = currentConnectionKit?.happDeepLink;
    if (typeof candidate !== "string" || !candidate.startsWith("happ://add/")) {
      return fallback;
    }

    return candidate;
  }

  function getSafeProvidedHappDeepLink(subscriptionUrl, providedDeepLink = "") {
    if (typeof providedDeepLink === "string" && providedDeepLink.startsWith("happ://add/")) {
      return providedDeepLink;
    }

    return `happ://add/${encodeURIComponent(subscriptionUrl)}`;
  }

  function getSafeAuthMethod(methodName) {
    return allowedAuthMethods.has(methodName) ? methodName : "telegram";
  }

  function formatProfileProtocol(profile) {
    if (profile.displayProtocol) {
      return profile.displayProtocol;
    }

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
    const kitProfile = currentConnectionKit?.profiles?.[index];
    if (kitProfile?.role) {
      return kitProfile.role;
    }

    if (index === 0) {
      return "основной";
    }

    const reserveTypes = ["резервная линия", "стабильная сеть", "низкая задержка", "резервный профиль"];
    return reserveTypes[index - 1] || "резервный";
  }

  function formatProfileIcon(index) {
    return index === 0 ? "🇫🇮" : "★";
  }

  function getProfileKind(profile, index) {
    if (profile?.profileKind === "primary" || profile?.profileKind === "reserve") {
      return profile.profileKind;
    }

    return index === 0 ? "primary" : "reserve";
  }

  function getProfileIcon(profile, index) {
    return typeof profile?.displayIcon === "string" && profile.displayIcon
      ? profile.displayIcon
      : formatProfileIcon(index);
  }

  function getProfileStatus(profile, index) {
    return typeof profile?.statusText === "string" && profile.statusText
      ? profile.statusText
      : formatProfileType(index);
  }

  function getHappPreview() {
    const preview = currentConnectionKit?.happPreview;
    if (preview && typeof preview === "object") {
      return preview;
    }

    return happManifest.happPreview && typeof happManifest.happPreview === "object"
      ? happManifest.happPreview
      : {};
  }

  function getHappManifestProfiles() {
    return Array.isArray(happManifest.expectedProfiles) ? happManifest.expectedProfiles : [];
  }

  function getHappManifestGuideSteps() {
    return Array.isArray(happManifest.happGuideSteps) ? happManifest.happGuideSteps : [];
  }

  function getHappManifestDescriptionLines() {
    return Array.isArray(happManifest.descriptionLines) && happManifest.descriptionLines.length
      ? happManifest.descriptionLines
      : subscriptionOverviewLines;
  }

  function cleanPreviewLine(line) {
    return String(line || "").replace(/^↳\s*/, "").replace(/^🟢\s*/, "");
  }

  function getHappPreviewNote({ hasAccountData, remainingText, limit, leftText, limitText, descriptionLines }) {
    if (!hasAccountData) {
      return "🟢 Основная линия Helsinki готовится после входа\n↳ Резервные профили появятся в одном JSON-ключе";
    }

    const preview = getHappPreview();
    const statusLine = typeof preview.statusLine === "string" && preview.statusLine
      ? preview.statusLine
      : remainingText
        ? `🟢 ${remainingText}`
        : limit > 0
          ? `🟢 Осталось ${leftText} ГБ из ${limitText} ГБ`
          : "🟢 Безлимитный пакет активен";
    const noteLines = Array.isArray(preview.noteLines) && preview.noteLines.length
      ? preview.noteLines
      : descriptionLines.length
        ? descriptionLines
        : getHappManifestDescriptionLines();

    return `${statusLine}\n${noteLines.map((line) => `↳ ${cleanPreviewLine(line)}`).join("\n")}`;
  }

  function getConnectionSeed(subscriptionUrl) {
    const raw = subscriptionUrl || currentIdentity.subscriptionToken || currentIdentity.email || "efirvpn";
    let hash = 0;
    for (let index = 0; index < raw.length; index += 1) {
      hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
    }
    return hash || 1;
  }

  function renderConnectionCode(subscriptionUrl, hasAccountData) {
    if (!connectCode) {
      return;
    }

    connectCode.replaceChildren();
    const seed = getConnectionSeed(subscriptionUrl);
    for (let index = 0; index < 81; index += 1) {
      const cell = document.createElement("span");
      const row = Math.floor(index / 9);
      const col = index % 9;
      const isCorner =
        (row < 3 && col < 3) ||
        (row < 3 && col > 5) ||
        (row > 5 && col < 3);
      const mixed = (seed + index * 17 + row * 29 + col * 43) % 7;
      const shouldFill = isCorner || (hasAccountData ? mixed < 3 : (row + col) % 5 === 0);
      cell.className = shouldFill ? "is-filled" : "";
      connectCode.append(cell);
    }
  }

  function isAuthMethodAvailable(methodName) {
    return authCapabilities[getSafeAuthMethod(methodName)] !== false;
  }

  function getEventMeta(eventType) {
    const fallback = { icon: "🧭", label: "Событие", group: "account", tone: "neutral" };
    return eventMetaCatalog[eventType] || fallbackEventMeta[eventType] || fallback;
  }

  function applyEventCatalog(payload) {
    if (!Array.isArray(payload?.eventMeta)) {
      return;
    }

    const nextCatalog = { ...fallbackEventMeta };
    payload.eventMeta.forEach((item) => {
      if (!item || typeof item.eventType !== "string") {
        return;
      }
      nextCatalog[item.eventType] = {
        icon: typeof item.icon === "string" && item.icon ? item.icon : "🧭",
        label: typeof item.label === "string" && item.label ? item.label : "Событие",
        group: typeof item.group === "string" && item.group ? item.group : "account",
        tone: typeof item.tone === "string" && item.tone ? item.tone : "neutral",
      };
    });
    eventMetaCatalog = nextCatalog;
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
    if (!isAuthenticated) {
      pendingSessionEvents = [localEvent, ...pendingSessionEvents].slice(0, 8);
    }
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

  function updateActivityRefreshButton() {
    if (!activityRefreshButton) {
      return;
    }

    activityRefreshButton.disabled = activityRefreshLoading || !isAuthenticated || !apiSessionToken;
    activityRefreshButton.textContent = activityRefreshLoading ? "Обновляем" : "Обновить";
  }

  async function refreshActivityLog() {
    if (!apiSessionToken) {
      renderActivityLog();
      return false;
    }

    activityRefreshLoading = true;
    updateActivityRefreshButton();

    try {
      const payload = await apiFetch("/api/events");
      currentEvents = Array.isArray(payload.events) ? payload.events.map(normalizeEvent) : [];
      renderActivityLog();
      return true;
    } catch {
      renderActivityLog();
      return false;
    } finally {
      activityRefreshLoading = false;
      updateActivityRefreshButton();
    }
  }

  function getActivityCounts(events = currentEvents) {
    const counts = {
      all: events.length,
      account: 0,
      auth: 0,
      connection: 0,
      payment: 0,
      support: 0,
    };

    events.forEach((event) => {
      const group = getEventMeta(event.eventType).group;
      if (Object.prototype.hasOwnProperty.call(counts, group)) {
        counts[group] += 1;
      }
    });

    return counts;
  }

  function updateActivityFilters() {
    const counts = getActivityCounts();
    activityFilters.forEach((button) => {
      const group = allowedActivityGroups.has(button.dataset.activityFilter)
        ? button.dataset.activityFilter
        : "all";
      const baseLabel = button.dataset.activityLabel || button.textContent.replace(/\s+\d+$/, "").trim();

      button.dataset.activityLabel = baseLabel;
      button.textContent = `${baseLabel} ${counts[group] || 0}`;
      button.classList.toggle("active", group === activityFilter);
      button.disabled = !isAuthenticated || currentEvents.length === 0;
    });
  }

  function renderActivityLog() {
    if (!activityList || !activityEmpty) {
      return;
    }

    activityList.replaceChildren();
    updateActivityFilters();
    updateActivityRefreshButton();

    if (!isAuthenticated) {
      activityList.hidden = true;
      activityEmpty.hidden = false;
      activityEmpty.textContent = "Войдите, чтобы увидеть историю.";
      if (activitySummary) {
        activitySummary.textContent = "Входы, ключи, Happ и платежные действия в одном журнале.";
      }
      return;
    }

    if (!currentEvents.length) {
      activityList.hidden = true;
      activityEmpty.hidden = false;
      activityEmpty.textContent = "Журнал пока пустой.";
      if (activitySummary) {
        activitySummary.textContent = "События появятся после входа, копирования ключа, открытия Happ или выбора тарифа.";
      }
      return;
    }

    const visibleEvents = currentEvents.filter((event) => {
      if (activityFilter === "all") {
        return true;
      }

      return getEventMeta(event.eventType).group === activityFilter;
    });
    const counts = getActivityCounts();
    if (activitySummary) {
      activitySummary.textContent = `Всего событий: ${counts.all}. Вход: ${counts.auth}, ключ: ${counts.connection}, оплата: ${counts.payment}.`;
    }

    if (!visibleEvents.length) {
      activityList.hidden = true;
      activityEmpty.hidden = false;
      activityEmpty.textContent = "В этом разделе пока нет событий.";
      return;
    }

    activityList.hidden = false;
    activityEmpty.hidden = true;

    visibleEvents.forEach((event) => {
      const item = document.createElement("article");
      const icon = document.createElement("span");
      const body = document.createElement("div");
      const title = document.createElement("strong");
      const details = document.createElement("p");
      const meta = document.createElement("small");
      const eventMeta = getEventMeta(event.eventType);

      item.className = "activity-item";
      item.dataset.eventTone = eventMeta.tone;
      item.dataset.eventGroup = eventMeta.group;
      icon.className = "activity-icon";
      icon.textContent = eventMeta.icon;

      title.textContent = event.title || "Событие";
      details.textContent = event.details || "";
      meta.textContent = `${eventMeta.label} · ${formatShortTime(event.createdAt)}`;

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
    if (profileReadiness) {
      const readiness = currentConnectionKit?.profileReadiness || {};
      const expectedProfiles = Array.isArray(currentConnectionKit?.expectedProfiles)
        ? currentConnectionKit.expectedProfiles
        : [];
      if (hasAccountData && readiness.label) {
        const loaded = Number(readiness.loadedCount) || 0;
        const expected = Number(readiness.expectedCount) || expectedProfiles.length || 4;
        profileReadiness.textContent = `${readiness.label}: ${loaded}/${expected}. ${readiness.description || ""}`.trim();
      } else {
        profileReadiness.textContent = hasAccountData
          ? "Проверяем профиль подписки и ожидаемый вид Happ."
          : "Helsinki и резервные линии в одной подписке.";
      }
    }

    const profiles = hasAccountData ? currentProfiles : [];
    const manifestProfiles = getHappManifestProfiles();
    const rows = profiles.length ? profiles : manifestProfiles;
    if (!rows.length) {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      const status = document.createElement("b");
      const chevron = document.createElement("em");

      icon.className = "flag flag--placeholder";
      row.dataset.profileKind = "placeholder";
      icon.textContent = "VPN";
      title.textContent = hasAccountData ? "Профили обновляются" : "Профили появятся после входа";
      meta.textContent = "VLESS | TCP | Reality | JSON";
      status.textContent = hasAccountData ? "скоро" : "готовим";
      chevron.textContent = "›";
      chevron.setAttribute("aria-hidden", "true");

      content.append(title, meta);
      row.append(icon, content, status, chevron);
      profileList.append(row);
      return;
    }

    rows.forEach((profile, index) => {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      const status = document.createElement("b");
      const chevron = document.createElement("em");
      const kind = getProfileKind(profile, index);

      row.dataset.profileKind = kind;
      row.dataset.profileAccent = profile.accent || (kind === "primary" ? "country" : "sky");
      icon.className = kind === "primary" ? "flag flag--country" : "flag flag--reserve";
      icon.textContent = getProfileIcon(profile, index);
      title.textContent = formatProfileDisplayName(index, profile.name);
      meta.textContent = formatProfileProtocol(profile);
      status.textContent = `${profile.signal || "🟢"} ${getProfileStatus(profile, index)}`;
      chevron.textContent = profile.chevron || "›";
      chevron.setAttribute("aria-hidden", "true");
      if (typeof profile.description === "string" && profile.description) {
        row.title = profile.description;
      }

      content.append(title, meta);
      row.append(icon, content, status, chevron);
      profileList.append(row);
    });
  }

  function renderDeviceProfileList(hasAccountData) {
    if (!deviceProfileList) {
      return;
    }

    deviceProfileList.replaceChildren();
    const profiles = hasAccountData ? currentProfiles : getHappManifestProfiles();
    const rows = profiles.length
      ? profiles
      : [
          {
            name: hasAccountData ? "EfirVPN · профили обновляются" : "EfirVPN · профиль ожидает входа",
            protocol: "VLESS",
            network: "TCP",
            security: "Reality",
            json: true,
          },
        ];

    rows.forEach((profile, index) => {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const meta = document.createElement("small");
      const status = document.createElement("b");
      const chevron = document.createElement("em");
      const kind = profiles.length ? getProfileKind(profile, index) : "placeholder";

      row.dataset.profileKind = kind;
      row.dataset.profileAccent = profile.accent || (kind === "primary" ? "country" : "sky");
      icon.textContent = profiles.length ? getProfileIcon(profile, index) : "VPN";
      title.textContent = profiles.length
        ? formatProfileDisplayName(index, profile.name)
        : profile.name;
      meta.textContent = formatProfileProtocol(profile);
      status.textContent = profiles.length
        ? `${profile.signal || "🟢"} ${getProfileStatus(profile, index)}`
        : hasAccountData ? "скоро" : "готовим";
      chevron.textContent = profiles.length ? profile.chevron || "›" : "›";
      chevron.setAttribute("aria-hidden", "true");
      if (typeof profile.description === "string" && profile.description) {
        row.title = profile.description;
      }

      content.append(title, meta);
      row.append(icon, content, status, chevron);
      deviceProfileList.append(row);
    });
  }

  function renderDeviceSlotList(hasAccountData) {
    if (!deviceSlotList) {
      return;
    }

    deviceSlotList.replaceChildren();
    const slots = hasAccountData && Array.isArray(currentConnectionKit?.deviceSlots)
      ? currentConnectionKit.deviceSlots
      : [
          {
            name: hasAccountData ? "Слоты устройств обновляются" : "Телефон · Happ",
            icon: "📱",
            status: hasAccountData ? "скоро" : "готовим",
            description: hasAccountData
              ? "Проверяем доступные слоты личного ключа."
              : "Слоты появятся после входа в личный кабинет.",
          },
        ];

    const slotLimit = Number(currentConnectionKit?.deviceLimit) || defaultDeviceLimit;
    slots.slice(0, slotLimit).forEach((slot, index) => {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const description = document.createElement("small");
      const status = document.createElement("b");

      row.dataset.deviceSlot = index === 0 ? "primary" : "free";
      icon.textContent = typeof slot.icon === "string" && slot.icon ? slot.icon : "•";
      title.textContent = typeof slot.name === "string" && slot.name ? slot.name : `Устройство ${index + 1}`;
      description.textContent =
        typeof slot.description === "string" && slot.description
          ? slot.description
          : "Можно подключить тем же subscription link.";
      status.textContent = typeof slot.status === "string" && slot.status ? slot.status : "свободно";

      content.append(title, description);
      row.append(icon, content, status);
      deviceSlotList.append(row);
    });
  }

  function getDeviceUsedCount(hasAccountData) {
    if (!hasAccountData) {
      return 0;
    }

    const explicitCount = Number(currentConnectionKit?.deviceUsed);
    if (Number.isFinite(explicitCount) && explicitCount >= 0) {
      return explicitCount;
    }

    const slots = Array.isArray(currentConnectionKit?.deviceSlots)
      ? currentConnectionKit.deviceSlots
      : [];
    return slots.filter((slot) => !["свободно", "ожидает"].includes(String(slot.status || ""))).length;
  }

  function renderHappGuideSteps(hasAccountData) {
    if (!happGuideList) {
      return;
    }

    const sourceSteps =
      hasAccountData && Array.isArray(currentConnectionKit?.happGuideSteps)
        ? currentConnectionKit.happGuideSteps
        : getHappManifestGuideSteps();
    const steps = sourceSteps.length ? sourceSteps : fallbackHappGuideSteps;

    happGuideList.replaceChildren();
    steps.forEach((step, index) => {
      const row = document.createElement("article");
      const marker = document.createElement("b");
      const body = document.createElement("div");
      const title = document.createElement("strong");
      const description = document.createElement("p");

      marker.textContent = String(Number(step.step) || index + 1);
      title.textContent = typeof step.title === "string" && step.title ? step.title : `Шаг ${index + 1}`;
      description.textContent =
        typeof step.description === "string" && step.description
          ? step.description
          : "Следуйте подсказке в личном кабинете EfirVPN.";

      body.append(title, description);
      row.append(marker, body);
      happGuideList.append(row);
    });
  }

  function getConnectionReceipt(hasAccountData) {
    const receipt = currentConnectionKit?.connectionReceipt;
    if (hasAccountData && receipt && typeof receipt === "object") {
      return receipt;
    }

    return {
      title: "Набор подключения",
      summary: hasAccountData
        ? "Проверяем личный ключ и список профилей."
        : "Войдите, чтобы получить личную ссылку и открыть её в Happ.",
      checks: [
        {
          label: "Личный ключ",
          description: hasAccountData ? "Ссылка готовится к выдаче." : "Появится после входа.",
          state: hasAccountData ? "pending" : "waiting",
        },
        {
          label: "4 профиля Happ",
          description: "Helsinki и резервные линии будут в одной подписке.",
          state: "ready",
        },
        {
          label: "Срок и трафик",
          description: "Кабинет покажет актуальные данные после входа.",
          state: hasAccountData ? "pending" : "waiting",
        },
      ],
    };
  }

  function renderConnectionReceipt(hasAccountData) {
    if (!connectionReceiptTitle || !connectionReceiptSummary || !connectionReceiptList) {
      return;
    }

    const receipt = getConnectionReceipt(hasAccountData);
    const checks = Array.isArray(receipt.checks) ? receipt.checks : [];
    connectionReceiptTitle.textContent = typeof receipt.title === "string" && receipt.title
      ? receipt.title
      : "Набор подключения";
    connectionReceiptSummary.textContent = typeof receipt.summary === "string" && receipt.summary
      ? receipt.summary
      : "Проверьте ключ, профили и срок подписки.";
    connectionReceiptList.replaceChildren();

    checks.forEach((check) => {
      const row = document.createElement("article");
      const icon = document.createElement("span");
      const body = document.createElement("div");
      const title = document.createElement("strong");
      const description = document.createElement("small");
      const state = typeof check.state === "string" && check.state ? check.state : "ready";

      row.dataset.receiptState = state;
      icon.textContent = state === "ready" ? "✓" : "•";
      title.textContent = typeof check.label === "string" && check.label ? check.label : "Проверка";
      description.textContent =
        typeof check.description === "string" && check.description
          ? check.description
          : "Готово к проверке в личном кабинете.";

      body.append(title, description);
      row.append(icon, body);
      connectionReceiptList.append(row);
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

  function setAuthReadyItem(itemName, state, statusText, description) {
    authReadinessItems.forEach((item) => {
      if (item.dataset.authReadyItem !== itemName) {
        return;
      }

      const status = item.querySelector("b");
      const detail = item.querySelector("small");
      item.dataset.readyState = state;
      if (status) {
        status.textContent = statusText;
      }
      if (detail) {
        detail.textContent = description;
      }
    });
  }

  function updateAuthReadiness(methods = []) {
    setAuthReadyItem(
      "api",
      accountApiReady ? "ready" : "pending",
      accountApiReady ? "готово" : "ожидает",
      accountApiReady ? "API панели отвечает текущим контрактом" : "Нужно развернуть свежий API на панели"
    );

    const byCode = new Map(
      Array.isArray(methods)
        ? methods
            .filter((method) => method && typeof method.code === "string")
            .map((method) => [method.code, method])
        : []
    );
    const telegram = byCode.get("telegram") || {};
    const email = byCode.get("email") || {};
    const telegramEnabled = Boolean(telegram.enabled ?? authCapabilities.telegram);
    const emailEnabled = Boolean(email.enabled ?? authCapabilities.email);

    setAuthReadyItem(
      "telegram",
      telegramEnabled ? "ready" : "pending",
      telegramEnabled ? "готово" : "скоро",
      typeof telegram.description === "string" && telegram.description
        ? telegram.description
        : telegramEnabled
          ? "Подтверждение через EfirVPN bot"
          : "Telegram вход включится после деплоя API"
    );
    setAuthReadyItem(
      "email",
      emailEnabled ? "ready" : "pending",
      emailEnabled ? "готово" : "скоро",
      typeof email.description === "string" && email.description
        ? email.description
        : emailEnabled
          ? "Одноразовый код на почту"
          : "Нужны SMTP-настройки или demo-коды"
    );
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
    accountApiReady = false;
    updateAuthReadiness();
    setApiStatus(
      "is-warning",
      "Кабинет временно недоступен. Напишите в Telegram, мы выдадим ключ вручную."
    );
  }

  async function refreshEventCatalog() {
    try {
      const payload = await apiFetch("/api/events/types");
      applyEventCatalog(payload);
      renderActivityLog();
    } catch {
      // Keep bundled event metadata; the account journal should stay readable offline.
    }
  }

  function applyHappManifest(payload) {
    if (!payload || payload.ok !== true || !Array.isArray(payload.expectedProfiles)) {
      return false;
    }

    happManifest = {
      title: typeof payload.title === "string" ? payload.title : "",
      subtitle: typeof payload.subtitle === "string" ? payload.subtitle : "",
      happPreview: payload.happPreview && typeof payload.happPreview === "object" ? payload.happPreview : {},
      descriptionLines: Array.isArray(payload.descriptionLines) ? payload.descriptionLines : [],
      happGuideSteps: Array.isArray(payload.happGuideSteps) ? payload.happGuideSteps : [],
      expectedProfiles: payload.expectedProfiles,
      manualSpec: payload.manualSpec && typeof payload.manualSpec === "object" ? payload.manualSpec : {},
    };
    return true;
  }

  async function refreshHappManifest() {
    try {
      const payload = await apiFetch("/api/happ/manifest");
      if (applyHappManifest(payload)) {
        updateAccountIdentity();
      }
      return true;
    } catch {
      return false;
    }
  }

  async function checkApiStatus() {
    setApiStatus("is-checking", "Проверяем доступность кабинета.");
    accountApiReady = false;
    updateAuthReadiness();

    try {
      const health = await apiFetch("/health");
      if (health?.ok || health?.status === "ok") {
        await refreshHappManifest();
        const hasCurrentAccountApi = Boolean(
          health.apiVersion &&
            health.apiBuild &&
            health.auth &&
            typeof health.telegramConfigured === "boolean" &&
            typeof health.emailConfigured === "boolean"
        );

        if (!hasCurrentAccountApi) {
          accountApiReady = false;
          authCapabilities = {
            telegram: false,
            email: false,
          };
          updateAuthAvailability();
          updateAuthReadiness();
          setApiStatus(
            "is-warning",
            "Кабинет обновляется: сайт уже готов, но API панели еще ждёт деплой."
          );
          return false;
        }

        accountApiReady = true;
        authCapabilities = {
          telegram: health.telegramConfigured,
          email: Boolean(health.emailConfigured),
        };
        await refreshEventCatalog();
        updateAuthAvailability();
        updateAuthReadiness(health.authMethods);

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

    const wasOpen = authDialog.open;
    if (!authDialog.open) {
      authDialog.showModal();
    }

    setAuthMethod(method);
    if (!isAuthenticated && !wasOpen) {
      emitAccountEvent(
        "auth_started",
        method === "email" ? "Начат вход по Email" : "Начат вход через Telegram",
        "Пользователь открыл форму входа в личный кабинет."
      );
    }
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
    const connectionKit =
      hasAccountData && currentConnectionKit?.subscriptionUrl === subscriptionUrl
        ? currentConnectionKit
        : null;
    const kitTraffic = connectionKit?.traffic || {};
    const limit = Number(currentIdentity.trafficLimitGb) || 0;
    const rawUsed = Number(currentIdentity.trafficUsedGb) || 0;
    const used = limit > 0 ? Math.min(rawUsed, limit) : rawUsed;
    const left = limit > 0 ? Math.max(0, limit - used) : 0;
    const usedPercent = Number.isFinite(Number(kitTraffic.usedPercent))
      ? Number(kitTraffic.usedPercent)
      : limit > 0
        ? Math.round((used / limit) * 100)
        : 0;
    const leftText = formatGb(left);
    const usedText = formatGb(rawUsed);
    const limitText = formatGb(limit);
    const trafficSummary = typeof kitTraffic.summary === "string" ? kitTraffic.summary : "";
    const remainingText =
      typeof kitTraffic.remainingText === "string" ? kitTraffic.remainingText : "";
    const trafficDescriptionText =
      typeof kitTraffic.description === "string" ? kitTraffic.description : "";
    const descriptionLines = Array.isArray(connectionKit?.descriptionLines)
      ? connectionKit.descriptionLines
      : [];
    const happPreview = getHappPreview();
    const deviceLimit = Number(connectionKit?.deviceLimit) || defaultDeviceLimit;
    const manualSpec = connectionKit?.manualSpec || {};
    const subscriptionStatus = getSubscriptionStatus(hasAccountData);

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
        const daysLeft = Number.isFinite(Number(subscriptionStatus.daysLeft))
          ? Number(subscriptionStatus.daysLeft)
          : getDaysLeft(currentIdentity.expiresAt);
        accountDaysLeft.textContent = `Осталось ${daysLeft} дн.`;
        applyStatusBadge(
          accountStatusBadge,
          subscriptionStatus.state !== "expired",
          subscriptionStatus.label || "Подписка активна"
        );
      } else {
        accountDaysLeft.textContent = "Войдите, чтобы увидеть срок";
        applyStatusBadge(accountStatusBadge, false, "Вход не выполнен");
      }
    }

    if (subscriptionNextAction) {
      subscriptionNextAction.textContent = hasAccountData
        ? subscriptionStatus.nextAction || "Ключ, трафик и профили обновляются в личном кабинете."
        : "Войдите, чтобы увидеть состояние подписки.";
    }

    if (accountDevicesUsed && accountDeviceLimit) {
      accountDevicesUsed.textContent = hasAccountData ? String(getDeviceUsedCount(hasAccountData)) : "—";
      accountDeviceLimit.textContent = ` / ${deviceLimit}`;
    }

    if (deviceSummary) {
      deviceSummary.textContent = hasAccountData
        ? currentConnectionKit?.deviceSummaryText || `${getDeviceUsedCount(hasAccountData)} из ${deviceLimit} слотов готово`
        : "Один ключ можно использовать на личных устройствах без повторной настройки.";
    }

    if (happPreviewTitle && happPreviewUpdated && happPreviewTraffic && happPreviewExpires && happPreviewBar && happPreviewNote) {
      happPreviewTitle.textContent = hasAccountData
        ? happPreview.title || connectionKit?.title || "EfirVPN · личный доступ"
        : "EfirVPN · профиль ожидает входа";
      happPreviewUpdated.textContent = hasAccountData
        ? happPreview.updatedText || connectionKit?.subtitle || "Автообновление подписки · Happ JSON"
        : "Автообновление профиля после входа";
      if (happPreviewProfiles) {
        happPreviewProfiles.textContent = hasAccountData
          ? happPreview.profileCountText || `${currentProfiles.length || 4} профиля`
          : "4 профиля";
      }
      if (happPreviewLatency) {
        happPreviewLatency.textContent = hasAccountData
          ? happPreview.latencyText || "Низкая задержка"
          : "Низкая задержка";
      }
      if (happPreviewNetwork) {
        happPreviewNetwork.textContent = hasAccountData
          ? happPreview.networkText || "Helsinki + резерв"
          : "Helsinki + резерв";
      }
      happPreviewTraffic.textContent = hasAccountData
        ? happPreview.trafficLabel || trafficSummary || (limit > 0 ? `${usedText} GB/${limitText} GB` : `${usedText} GB/∞`)
        : "— GB/∞";
      happPreviewExpires.textContent = hasAccountData
        ? `Истекает: ${formatShortDate(connectionKit?.expiresAt || currentIdentity.expiresAt)}`
        : "Истекает: —";
      happPreviewBar.style.width = hasAccountData
        ? limit > 0
          ? `${Math.min(100, usedPercent)}%`
          : "100%"
        : "8%";
      happPreviewNote.textContent = getHappPreviewNote({
        hasAccountData,
        remainingText,
        limit,
        leftText,
        limitText,
        descriptionLines,
      });
    }

    if (trafficLeft && trafficUsed && trafficLimit && trafficNote && trafficBar && trafficMeta && trafficSpentRow) {
      if (hasAccountData && limit === 0) {
        trafficLeft.textContent = "∞";
        trafficUsed.textContent = usedText;
        trafficLimit.textContent = "0";
        trafficMeta.textContent = trafficSummary || `Израсходовано: ${usedText} ГБ / Безлимит`;
        trafficSpentRow.textContent = `Без лимита • использовано ${usedText} ГБ`;
        trafficNote.textContent = remainingText || `Безлимитный тариф · трафик обновляется по лимитам подписки`;
        trafficBar.style.width = "100%";
        applyStatusBadge(trafficStatusBadge, true, "Безлимит");
      } else {
        trafficLeft.textContent = hasAccountData && limit > 0 ? leftText : "—";
        trafficUsed.textContent = hasAccountData ? usedText : "—";
        trafficLimit.textContent = hasAccountData ? limitText : "—";
        trafficMeta.textContent = hasAccountData
          ? trafficSummary || `Израсходовано: ${usedText} ГБ • Лимит: ${limitText} ГБ`
          : "Войдите, чтобы увидеть данные по трафику";
        trafficNote.textContent = hasAccountData && limit > 0
          ? remainingText || `Остаток: ${leftText} ГБ • Использовано: ${usedText} ГБ`
          : "Войдите, чтобы увидеть остаток трафика";
        trafficSpentRow.textContent = hasAccountData
          ? `${remainingText || `Остаток ${leftText} ГБ из ${limitText} ГБ`} (${usedPercent}%)`
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
          const remainingLine = trafficDescriptionText
            ? `↳ ${trafficDescriptionText}`
            : remainingText
              ? `↳ ${remainingText}`
              : limit > 0
                ? `↳ Остаток: ${leftText} ГБ из ${limitText} ГБ`
                : "↳ Безлимитный пакет, остаток неограничен";

          const overviewLines = descriptionLines.length
            ? descriptionLines.map((line) => `↳ ${line.replace(/^↳\s*/, "").replace(/^🟢\s*/, "")}`)
            : getHappManifestDescriptionLines();

          trafficDescription.textContent = `${remainingLine}\n${overviewLines.join("\n")}`;
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

    if (manualSubscriptionLink) {
      manualSubscriptionLink.textContent = subscriptionUrl || "Ключ появится после входа";
    }

    if (manualExpires) {
      manualExpires.textContent = hasAccountData ? formatShortDate(currentIdentity.expiresAt) : "—";
    }

    if (manualTraffic) {
      manualTraffic.textContent = hasAccountData
        ? remainingText || (limit > 0 ? `${leftText} ГБ осталось` : `${usedText} ГБ использовано`)
        : "—";
    }

    if (manualProtocol) {
      manualProtocol.textContent = hasAccountData ? manualSpec.protocol || "VLESS" : "VLESS";
    }

    if (manualTransport) {
      manualTransport.textContent = hasAccountData ? manualSpec.transport || "TCP" : "TCP";
    }

    if (manualSecurity) {
      manualSecurity.textContent = hasAccountData ? manualSpec.security || "Reality" : "Reality";
    }

    if (manualFormat) {
      manualFormat.textContent = hasAccountData ? manualSpec.format || "JSON" : "JSON";
    }

    applyStatusBadge(connectStatus, hasAccountData, hasAccountData ? "Готов к импорту" : "Ключ ожидает входа");
    renderConnectionCode(subscriptionUrl, hasAccountData);

    renderProfileList(hasAccountData);
    renderDeviceProfileList(hasAccountData);
    renderDeviceSlotList(hasAccountData);
    renderHappGuideSteps(hasAccountData);
    renderConnectionReceipt(hasAccountData);
    renderActivityLog();
  }

  function completeApiAuth(data, successMessage) {
    const eventsToSync = pendingSessionEvents.slice().reverse();
    pendingSessionEvents = [];
    applyApiAccount(data.account, data.token, data.profiles, data.events);
    isAuthenticated = true;
    updateAccountIdentity();
    saveStoredAccount();
    setApiStatus("is-ready", "Кабинет готов: ключ и срок подписки обновлены.");
    eventsToSync.forEach((event) => {
      emitAccountEvent(event.eventType, event.title, event.details);
    });
    emitAccountEvent("auth_completed", "Вход выполнен", "Профиль и ключ доступны в кабинете.");
    refreshConnectionKit()
      .then((loaded) => {
        if (loaded) {
          updateAccountIdentity();
          saveStoredAccount();
        }
      })
      .catch(() => {});

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
    currentConnectionKit = null;
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
      subscriptionStatus: null,
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

  activityFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const nextFilter = allowedActivityGroups.has(button.dataset.activityFilter)
        ? button.dataset.activityFilter
        : "all";
      activityFilter = nextFilter;
      renderActivityLog();
    });
  });

  activityRefreshButton?.addEventListener("click", async () => {
    if (!isAuthenticated) {
      openAuth("telegram");
      return;
    }

    const refreshed = await refreshActivityLog();
    showToast(refreshed ? "Журнал обновлен" : "Не удалось обновить журнал");
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
      if (data.ok) {
        emitAccountEvent("email_code_requested", "Код Email отправлен", "Пользователь запросил одноразовый код для входа.");
      }
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
      window.location.href = getSafeHappDeepLink(subscriptionUrl);
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
        applyApiAccount(data.account, apiSessionToken, data.profiles, data.events, null);
        await refreshConnectionKit();
        updateAccountIdentity();
        saveStoredAccount();
        renderActivityLog();
        const rotation = data.rotation || {};
        const nextLink = typeof rotation.subscriptionUrl === "string" && rotation.subscriptionUrl
          ? rotation.subscriptionUrl
          : getSubscriptionUrl();
        const rotationMessage = typeof rotation.message === "string" && rotation.message
          ? rotation.message
          : "Новый ключ готов. Обновите подписку в Happ.";
        if (connectStatus) {
          applyStatusBadge(connectStatus, true, "Новый ключ готов");
        }
        if (nextLink) {
          navigator.clipboard?.writeText(nextLink).catch(() => {});
        }
        emitAccountEvent(
          "key_rotated",
          "Ключ перевыпущен",
          `${rotationMessage} ${getSafeProvidedHappDeepLink(nextLink, rotation.happDeepLink).startsWith("happ://add/") ? "Можно открыть в Happ." : ""}`.trim()
        );
        showToast("Новый ключ готов и скопирован");
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

  supportLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const source = link.dataset.supportLink || "site";
      emitAccountEvent(
        "support_started",
        "Открыта поддержка",
        source === "account"
          ? "Пользователь открыл поддержку из личного кабинета."
          : "Пользователь перешел в Telegram из сайта EfirVPN."
      );
    });
  });

  async function startPaymentForPlan(button) {
    const plan = allowedPlans.has(button.dataset.plan) ? button.dataset.plan : "тариф";
    const tariffCode = button.dataset.tariffCode || planToTariffCode[plan] || "";

    openAccount("payments");
    if (!isAuthenticated || !apiSessionToken) {
      if (paymentStatus) {
        paymentStatus.textContent = `Выбран тариф: ${plan}. Войдите в кабинет, чтобы продолжить оплату через Telegram.`;
      }
      addLocalEvent("tariff_selected", `Выбран тариф: ${plan}`, "Ожидаем вход в личный кабинет для продолжения оплаты.");
      showToast(`Выбран тариф: ${plan}`);
      return;
    }

    button.disabled = true;
    if (paymentStatus) {
      paymentStatus.textContent = `Готовим оплату тарифа ${plan}...`;
    }

    try {
      const data = await apiFetch("/api/payments/start", {
        method: "POST",
        body: JSON.stringify({ tariff_code: tariffCode, plan }),
      });
      if (Array.isArray(data.events)) {
        currentEvents = data.events.map(normalizeEvent);
        renderActivityLog();
      }
      const payment = data.payment || {};
      const tariff = payment.tariff || {};
      if (paymentStatus) {
        paymentStatus.textContent = `${tariff.title || plan} выбран: ${tariff.priceRub || "—"} ₽. Подтвердите оплату в Telegram-боте EfirVPN.`;
      }
      showToast("Откройте Telegram для оплаты");
      return;
    } catch {
      await emitAccountEvent("payment_started", `Выбран тариф: ${plan}`, "API оплаты временно недоступен, выбор сохранен локально.");
      if (paymentStatus) {
        paymentStatus.textContent = `Выбран тариф: ${plan}. Если Telegram не открылся, напишите в поддержку.`;
      }
      showToast("Тариф сохранен в журнале");
    } finally {
      button.disabled = false;
    }
  }

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      startPaymentForPlan(button);
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
  refreshHappManifest().catch(() => {});
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
