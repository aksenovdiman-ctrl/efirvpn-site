#!/usr/bin/env bash
set -euo pipefail

PANEL_IP="${PANEL_IP:-72.56.11.76}"
LISTEN_PORT="${LISTEN_PORT:-18080}"
PROXY_SCRIPT="${PROXY_SCRIPT:-/opt/efir-telegram-proxy.py}"
SERVICE_FILE="${SERVICE_FILE:-/etc/systemd/system/efir-telegram-proxy.service}"

cat >"${PROXY_SCRIPT}" <<PY
#!/usr/bin/env python3
import asyncio

LISTEN_HOST = "0.0.0.0"
LISTEN_PORT = ${LISTEN_PORT}
ALLOWED_CLIENTS = {"${PANEL_IP}", "127.0.0.1"}
ALLOWED_HOST = "api.telegram.org"
ALLOWED_PORT = 443

async def pipe(reader, writer):
    try:
        while True:
            data = await reader.read(65536)
            if not data:
                break
            writer.write(data)
            await writer.drain()
    finally:
        writer.close()

async def handle(client_reader, client_writer):
    peer = client_writer.get_extra_info("peername")
    client_ip = peer[0] if peer else ""
    try:
        request = await client_reader.readline()
        if client_ip not in ALLOWED_CLIENTS:
            client_writer.write(b"HTTP/1.1 403 Forbidden\\r\\n\\r\\n")
            await client_writer.drain()
            return

        parts = request.decode("latin1", "ignore").strip().split()
        if len(parts) < 3 or parts[0].upper() != "CONNECT":
            client_writer.write(b"HTTP/1.1 405 Method Not Allowed\\r\\n\\r\\n")
            await client_writer.drain()
            return

        host, _, port_raw = parts[1].partition(":")
        port = int(port_raw or "443")
        if host != ALLOWED_HOST or port != ALLOWED_PORT:
            client_writer.write(b"HTTP/1.1 403 Forbidden\\r\\n\\r\\n")
            await client_writer.drain()
            return

        while True:
            line = await client_reader.readline()
            if line in (b"\\r\\n", b"\\n", b""):
                break

        remote_reader, remote_writer = await asyncio.open_connection(host, port)
        client_writer.write(b"HTTP/1.1 200 Connection Established\\r\\n\\r\\n")
        await client_writer.drain()
        await asyncio.gather(
            pipe(client_reader, remote_writer),
            pipe(remote_reader, client_writer),
        )
    except Exception:
        try:
            client_writer.write(b"HTTP/1.1 502 Bad Gateway\\r\\n\\r\\n")
            await client_writer.drain()
        except Exception:
            pass
    finally:
        client_writer.close()

async def main():
    server = await asyncio.start_server(handle, LISTEN_HOST, LISTEN_PORT)
    async with server:
        await server.serve_forever()

asyncio.run(main())
PY

chmod +x "${PROXY_SCRIPT}"
python3 -m py_compile "${PROXY_SCRIPT}"

cat >"${SERVICE_FILE}" <<UNIT
[Unit]
Description=EfirVPN Telegram API CONNECT proxy
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 ${PROXY_SCRIPT}
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

if command -v ufw >/dev/null 2>&1; then
    ufw allow from "${PANEL_IP}" to any port "${LISTEN_PORT}" proto tcp || true
fi

systemctl daemon-reload
systemctl enable --now efir-telegram-proxy
sleep 2
systemctl status efir-telegram-proxy --no-pager -l
ss -lntp | grep ":${LISTEN_PORT}"
