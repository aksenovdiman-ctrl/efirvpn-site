#!/usr/bin/env python3
"""Static contract check for the EfirVPN landing/account UI."""

from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def require(name: str, text: str, needle: str) -> None:
    if needle not in text:
        raise SystemExit(f"MISSING {name}: {needle}")
    print("OK", name, needle)


def reject(name: str, text: str, needle: str) -> None:
    if needle.lower() in text.lower():
        raise SystemExit(f"BLOCKED_COPY {name}: {needle}")


def main() -> int:
    index = read("index.html")
    app = read("app.js")
    styles = read("styles.css")

    for marker in (
        "data-link-telegram",
        "data-link-email",
        "data-support-link",
        "data-auth-readiness",
        'data-auth-ready-item="telegram"',
        'data-auth-ready-item="email"',
        "data-subscription-next-action",
        "happ-preview-card",
        "happ-actions",
        "data-happ-preview-profiles",
        "data-happ-preview-latency",
        "data-happ-preview-network",
        "data-happ-preview-traffic",
        "data-traffic-description",
        "data-profile-list",
        "data-profile-readiness",
        "data-device-profile-list",
        "data-device-slot-list",
        "data-device-summary",
        "data-happ-guide-list",
        "data-payment-status",
        'data-plan="12 месяцев"',
        'data-tariff-code="month_12"',
        "data-connect-code",
        "data-manual-subscription-link",
        "data-manual-protocol",
        "data-manual-transport",
        "data-manual-security",
        "data-manual-format",
        "data-connection-receipt-title",
        "data-connection-receipt-summary",
        "data-connection-receipt-list",
        "data-activity-summary",
        "data-refresh-activity",
        'data-activity-filter="payment"',
        "data-activity-list",
    ):
        require("index", index, marker)

    for marker in (
        'const apiBase = "https://api.efirvpn.ru"',
        'const subscriptionBase = "https://panel.efirvpn.ru/api/sub"',
        "hasCurrentAccountApi",
        "authReadinessItems",
        "accountApiReady",
        "setAuthReadyItem",
        "updateAuthReadiness",
        "authMethods",
        "subscriptionStatus",
        "getSubscriptionStatus",
        "profileReadiness",
        "expectedProfiles",
        "telegram_link_started",
        "auth_started",
        "email_code_requested",
        "email_link_started",
        "supportLinks",
        "support_started",
        "eventMetaCatalog",
        "fallbackEventMeta",
        "applyEventCatalog",
        "refreshEventCatalog",
        "refreshActivityLog",
        "refreshHappManifest",
        "applyHappManifest",
        "/api/events/types",
        "/api/events",
        "/api/happ/manifest",
        "dataset.eventTone",
        "dataset.eventGroup",
        "allowedActivityGroups",
        "activityFilter",
        "getActivityCounts",
        "updateActivityFilters",
        "subscription_link_copied",
        "happ_open_clicked",
        "tariff_selected",
        "paymentStatus",
        "payment_started",
        "key_rotated",
        "planToTariffCode",
        "startPaymentForPlan",
        "/api/payments/start",
        "/api/account/rotate-key",
        "rotation",
        "getSafeProvidedHappDeepLink",
        "tariffCode",
        "renderConnectionCode",
        "renderDeviceProfileList",
        "renderDeviceSlotList",
        "renderHappGuideSteps",
        "renderConnectionReceipt",
        "getConnectionReceipt",
        "happGuideSteps",
        "fallbackHappGuideSteps",
        "refreshConnectionKit",
        "/api/account/connect",
        "currentConnectionKit",
        "getSafeHappDeepLink",
        "happPreview",
        "happManifest",
        "getHappManifestProfiles",
        "getHappManifestGuideSteps",
        "getHappManifestDescriptionLines",
        "profileCountText",
        "latencyText",
        "networkText",
        "getHappPreview",
        "getHappPreviewNote",
        "cleanPreviewLine",
        "trafficDescriptionText",
        "profile.signal",
        "profile.chevron",
        "manualSpec",
        "connectionReceipt",
        "dataset.receiptState",
        "getProfileKind",
        "getProfileIcon",
        "getProfileStatus",
        "profileKind",
        "displayIcon",
        "statusText",
        "deviceSlots",
        "deviceLimit",
        "deviceUsed",
        "deviceSummaryText",
        "getDeviceUsedCount",
        "dataset.profileKind",
        "Efir Helsinki · Основной",
        "Efir Reserve 1 · резервная линия",
        "Efir Reserve 2 · стабильная сеть",
        "Efir Reserve 3 · низкая задержка",
        "VLESS | TCP | Reality | JSON",
        "Один личный ключ для Happ, v2rayN, v2rayNG и Shadowrocket",
    ):
        require("app", app, marker)

    for marker in (
        ".happ-preview-card",
        ".happ-actions span",
        ".happ-preview-metrics",
        ".happ-preview-band",
        ".happ-mini-bar",
        ".happ-preview-note",
        ".connection-kit-card",
        ".connection-code-grid",
        ".guide-list article",
        ".guide-list b",
        ".activity-filters",
        ".activity-refresh-button",
        ".activity-filters button.active",
        ".device-slot-list",
        ".device-slot-list article",
        '.device-slot-list article[data-device-slot="primary"]',
        ".payment-status",
        '.activity-item[data-event-tone="success"]',
        '.activity-item[data-event-tone="info"]',
        '.activity-item[data-event-tone="warning"]',
        ".auth-readiness",
        '.auth-readiness article[data-ready-state="ready"]',
        '.auth-readiness article[data-ready-state="pending"]',
        ".subscription-next-action",
        ".device-profile-list article",
        ".server-list em",
        ".device-profile-list em",
        '.server-list article[data-profile-kind="primary"]',
        '.server-list article[data-profile-kind="reserve"]',
        '.device-profile-list article[data-profile-kind="primary"]',
        '.device-profile-list article[data-profile-kind="reserve"]',
        ".manual-spec-grid",
        ".connection-receipt",
        ".connection-receipt-list",
        ".server-list article > div",
        ".server-list strong,\n.server-list small",
        "@media",
    ):
        require("styles", styles, marker)

    public_copy = index
    for blocked in (
        "Germany",
        "обход",
        "глуш",
        "запасной маршрут",
        "demo-user-key",
    ):
        reject("site copy", public_copy, blocked)

    for blocked in (
        "Efir Germany",
        "Обход глушилок",
        "НадоVPN",
        "demo-user-key",
    ):
        reject("app display copy", app, blocked)

    print("STATIC_CONTRACT_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
