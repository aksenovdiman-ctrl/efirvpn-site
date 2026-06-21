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
        "happ-preview-card",
        "happ-actions",
        "data-happ-preview-traffic",
        "data-traffic-description",
        "data-profile-list",
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
        "data-activity-summary",
        'data-activity-filter="payment"',
        "data-activity-list",
    ):
        require("index", index, marker)

    for marker in (
        'const apiBase = "https://panel.efirvpn.ru/efir-api"',
        'const subscriptionBase = "https://panel.efirvpn.ru/api/sub"',
        "hasCurrentAccountApi",
        "telegram_link_started",
        "auth_started",
        "email_code_requested",
        "email_link_started",
        "eventMetaCatalog",
        "fallbackEventMeta",
        "applyEventCatalog",
        "refreshEventCatalog",
        "/api/events/types",
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
        "planToTariffCode",
        "startPaymentForPlan",
        "/api/payments/start",
        "tariffCode",
        "renderConnectionCode",
        "renderDeviceProfileList",
        "renderDeviceSlotList",
        "renderHappGuideSteps",
        "happGuideSteps",
        "fallbackHappGuideSteps",
        "refreshConnectionKit",
        "/api/account/connect",
        "currentConnectionKit",
        "getSafeHappDeepLink",
        "happPreview",
        "getHappPreview",
        "getHappPreviewNote",
        "cleanPreviewLine",
        "trafficDescriptionText",
        "profile.signal",
        "profile.chevron",
        "manualSpec",
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
        ".happ-preview-band",
        ".happ-mini-bar",
        ".happ-preview-note",
        ".connection-kit-card",
        ".connection-code-grid",
        ".guide-list article",
        ".guide-list b",
        ".activity-filters",
        ".activity-filters button.active",
        ".device-slot-list",
        ".device-slot-list article",
        '.device-slot-list article[data-device-slot="primary"]',
        ".payment-status",
        '.activity-item[data-event-tone="success"]',
        '.activity-item[data-event-tone="info"]',
        '.activity-item[data-event-tone="warning"]',
        ".device-profile-list article",
        ".server-list em",
        ".device-profile-list em",
        '.server-list article[data-profile-kind="primary"]',
        '.server-list article[data-profile-kind="reserve"]',
        '.device-profile-list article[data-profile-kind="primary"]',
        '.device-profile-list article[data-profile-kind="reserve"]',
        ".manual-spec-grid",
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
