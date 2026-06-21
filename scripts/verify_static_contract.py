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
        "data-happ-preview-traffic",
        "data-traffic-description",
        "data-profile-list",
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
        "subscription_link_copied",
        "happ_open_clicked",
        "tariff_selected",
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
        ".happ-preview-band",
        ".happ-mini-bar",
        ".happ-preview-note",
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
