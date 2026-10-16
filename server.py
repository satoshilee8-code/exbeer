from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import hashlib
import hmac
import json
import secrets
import sqlite3
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "airdrops.db"
TOKENS_PER_SHARE = 1_000_000
ACTIVITY_TYPES = {"page_view", "wallet_login", "airdrop_query"}
ADMIN_LOGIN_PATH = "/ops-6f13-exbeer-console"
ADMIN_CREDENTIAL_SALT = b"exbeer-admin-2027-06-13"
ADMIN_USERNAME_HASH = "b5272b92329ab62cc9f16af30d1b5bccf45eae912c3d7bb7f3d9047b9988409d"
ADMIN_PASSWORD_HASH = "7c371f121125843a1c5cadd70ae265682e0d5e2b2fbddcc36dd6079ded2baaec"
ADMIN_TOKEN = secrets.token_urlsafe(32)
BLOCKED_STATIC_SUFFIXES = (".db", ".sql", ".py", ".log")
BLOCKED_ADMIN_PATHS = ("/admin", "/admin/", "/admin.html")
CLEAN_ROUTES = {
    "/": "launchpad.html",
    "/home": "launchpad.html",
    "/launchpad": "launchpad.html",
    "/airdrop": "airdrop.html",
    "/spot": "spot.html",
    "/perps": "perps.html",
    "/staking": "staking.html",
    "/dao": "dao.html",
    ADMIN_LOGIN_PATH: "admin.html",
}
HTML_REDIRECTS = {
    "/index.html": "/",
    "/launchpad.html": "/",
    "/airdrop.html": "/airdrop",
    "/spot.html": "/spot",
    "/perps.html": "/perps",
    "/staking.html": "/staking",
    "/dao.html": "/dao",
}


def init_database():
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS activity_logs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'wallet_login', 'airdrop_query')),
              ip_address TEXT NOT NULL,
              wallet_address TEXT,
              path TEXT,
              user_agent TEXT,
              details TEXT NOT NULL DEFAULT '{}',
              created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
            )
            """
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs (created_at DESC)"
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_wallet ON activity_logs (wallet_address)"
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON activity_logs (event_type)"
        )
        connection.commit()


class ExBeerHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/airdrop":
            self.handle_airdrop(parse_qs(parsed.query))
            return

        if parsed.path == "/api/admin/airdrops":
            if not self.require_admin():
                return
            self.handle_admin_list()
            return

        if parsed.path == "/api/admin/activity":
            if not self.require_admin():
                return
            self.handle_admin_activity()
            return

        if self.is_blocked_admin_path(parsed.path):
            self.send_json(404, {"ok": False, "error": "not_found"})
            return

        if parsed.path in HTML_REDIRECTS:
            self.redirect_clean_path(HTML_REDIRECTS[parsed.path], parsed.query)
            return

        if self.is_blocked_static_path(parsed.path):
            self.send_json(403, {"ok": False, "error": "forbidden"})
            return

        if parsed.path in CLEAN_ROUTES:
            self.log_activity("page_view", path=parsed.path)
            self.path = "/" + CLEAN_ROUTES[parsed.path]
            if parsed.query:
                self.path += "?" + parsed.query
            super().do_GET()
            return

        super().do_GET()

    def do_HEAD(self):
        parsed = urlparse(self.path)

        if self.is_blocked_admin_path(parsed.path):
            self.send_response(404)
            self.end_headers()
            return

        if parsed.path in HTML_REDIRECTS:
            self.redirect_clean_path(HTML_REDIRECTS[parsed.path], parsed.query)
            return

        if self.is_blocked_static_path(parsed.path):
            self.send_response(403)
            self.end_headers()
            return

        if parsed.path in CLEAN_ROUTES:
            self.path = "/" + CLEAN_ROUTES[parsed.path]
            if parsed.query:
                self.path += "?" + parsed.query
            super().do_HEAD()
            return

        super().do_HEAD()

    def is_blocked_static_path(self, path):
        normalized = path.lower()
        return normalized.endswith(BLOCKED_STATIC_SUFFIXES)

    def is_blocked_admin_path(self, path):
        return path.lower() in BLOCKED_ADMIN_PATHS

    def credential_hash(self, value, iterations):
        return hashlib.pbkdf2_hmac(
            "sha256",
            (value or "").encode("utf-8"),
            ADMIN_CREDENTIAL_SALT,
            iterations,
        ).hex()

    def verify_admin_credentials(self, username, password):
        username_hash = self.credential_hash(username, 120000)
        password_hash = self.credential_hash(password, 210000)
        return hmac.compare_digest(username_hash, ADMIN_USERNAME_HASH) and hmac.compare_digest(
            password_hash,
            ADMIN_PASSWORD_HASH,
        )

    def redirect_clean_path(self, path, query=""):
        target = path
        if query:
            target += "?" + query
        self.send_response(302)
        self.send_header("Location", target)
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/admin/login":
            self.handle_admin_login()
            return

        if parsed.path == "/api/admin/airdrops":
            if not self.require_admin():
                return
            self.handle_admin_save()
            return

        if parsed.path == "/api/activity":
            self.handle_activity_event()
            return

        self.send_json(404, {"ok": False, "error": "not_found"})

    def do_PUT(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/admin/airdrops":
            if not self.require_admin():
                return
            self.handle_admin_save()
            return

        self.send_json(404, {"ok": False, "error": "not_found"})

    def do_DELETE(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/admin/airdrops":
            if not self.require_admin():
                return
            self.handle_admin_delete(parse_qs(parsed.query))
            return

        self.send_json(404, {"ok": False, "error": "not_found"})

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw or "{}")

    def require_admin(self):
        header = self.headers.get("Authorization", "")
        if header == f"Bearer {ADMIN_TOKEN}":
            return True
        self.send_json(401, {"ok": False, "error": "unauthorized"})
        return False

    def is_valid_address(self, address):
        normalized = address.strip().lower()
        return len(normalized) == 42 and normalized.startswith("0x") and all(
            char in "0123456789abcdef" for char in normalized[2:]
        )

    def client_ip(self):
        forwarded_for = (self.headers.get("X-Forwarded-For") or "").split(",")[0].strip()
        real_ip = (self.headers.get("X-Real-IP") or "").strip()
        return forwarded_for or real_ip or self.client_address[0]

    def log_activity(self, event_type, wallet_address="", path="", details=None):
        if event_type not in ACTIVITY_TYPES:
            return

        normalized_wallet = (wallet_address or "").strip()
        if normalized_wallet and not self.is_valid_address(normalized_wallet):
            normalized_wallet = ""

        payload = details or {}
        try:
            with sqlite3.connect(DB_PATH) as connection:
                connection.execute(
                    """
                    INSERT INTO activity_logs (event_type, ip_address, wallet_address, path, user_agent, details, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
                    """,
                    (
                        event_type,
                        self.client_ip(),
                        normalized_wallet,
                        path or "",
                        self.headers.get("User-Agent", ""),
                        json.dumps(payload, ensure_ascii=False),
                    ),
                )
                connection.commit()
        except sqlite3.Error:
            pass

    def handle_airdrop(self, query):
        address = (query.get("address") or [""])[0].strip().lower()

        if not address:
            self.send_json(
                400,
                {
                    "ok": False,
                    "error": "address_required",
                    "message": "Wallet address is required.",
                },
            )
            return

        with sqlite3.connect(DB_PATH) as connection:
            connection.row_factory = sqlite3.Row
            row = connection.execute(
                """
                SELECT wallet_address, token_symbol, shares, tokens_per_share
                FROM airdrop_allocations
                WHERE lower(wallet_address) = ?
                """,
                (address,),
            ).fetchone()

        if not row:
            self.log_activity(
                "airdrop_query",
                wallet_address=address,
                path="/api/airdrop",
                details={"shares": 0, "eligible": False, "tokenSymbol": "EXB"},
            )
            self.send_json(
                200,
                {
                    "ok": True,
                    "address": address,
                    "tokenSymbol": "EXB",
                    "shares": 0,
                    "tokensPerShare": TOKENS_PER_SHARE,
                    "totalTokens": 0,
                    "eligible": False,
                },
            )
            return

        shares = float(row["shares"])
        tokens_per_share = int(row["tokens_per_share"])
        self.log_activity(
            "airdrop_query",
            wallet_address=row["wallet_address"],
            path="/api/airdrop",
            details={
                "shares": shares,
                "eligible": shares > 0,
                "tokenSymbol": row["token_symbol"],
                "totalTokens": shares * tokens_per_share,
            },
        )
        self.send_json(
            200,
            {
                "ok": True,
                "address": row["wallet_address"],
                "tokenSymbol": row["token_symbol"],
                "shares": shares,
                "tokensPerShare": tokens_per_share,
                "totalTokens": shares * tokens_per_share,
                "eligible": shares > 0,
            },
        )

    def handle_admin_login(self):
        try:
            payload = self.read_json()
        except json.JSONDecodeError:
            self.send_json(400, {"ok": False, "error": "invalid_json"})
            return

        if self.verify_admin_credentials(payload.get("username"), payload.get("password")):
            self.send_json(200, {"ok": True, "token": ADMIN_TOKEN})
            return

        self.send_json(401, {"ok": False, "error": "invalid_credentials"})

    def handle_activity_event(self):
        try:
            payload = self.read_json()
        except json.JSONDecodeError:
            self.send_json(400, {"ok": False, "error": "invalid_json"})
            return

        event_type = (payload.get("eventType") or "").strip()
        address = (payload.get("walletAddress") or payload.get("address") or "").strip()
        page = (payload.get("page") or "").strip()

        if event_type != "wallet_login":
            self.send_json(400, {"ok": False, "error": "invalid_event_type"})
            return

        if not self.is_valid_address(address):
            self.send_json(400, {"ok": False, "error": "invalid_address"})
            return

        self.log_activity(
            "wallet_login",
            wallet_address=address,
            path=page,
            details={"source": "wallet_connect"},
        )
        self.send_json(200, {"ok": True})

    def handle_admin_list(self):
        with sqlite3.connect(DB_PATH) as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute(
                """
                SELECT wallet_address, token_symbol, shares, tokens_per_share, updated_at
                FROM airdrop_allocations
                ORDER BY updated_at DESC, wallet_address ASC
                """
            ).fetchall()

        items = []
        total_shares = 0
        for row in rows:
            shares = float(row["shares"])
            tokens_per_share = int(row["tokens_per_share"])
            total_shares += shares
            items.append(
                {
                    "walletAddress": row["wallet_address"],
                    "tokenSymbol": row["token_symbol"],
                    "shares": shares,
                    "tokensPerShare": tokens_per_share,
                    "totalTokens": shares * tokens_per_share,
                    "updatedAt": row["updated_at"],
                }
            )

        self.send_json(
            200,
            {
                "ok": True,
                "items": items,
                "summary": {
                    "count": len(items),
                    "totalShares": total_shares,
                    "totalTokens": total_shares * TOKENS_PER_SHARE,
                },
            },
        )

    def handle_admin_activity(self):
        with sqlite3.connect(DB_PATH) as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute(
                """
                SELECT id, event_type, ip_address, wallet_address, path, user_agent, details, created_at
                FROM activity_logs
                ORDER BY id DESC
                LIMIT 300
                """
            ).fetchall()
            summary_rows = connection.execute(
                """
                SELECT event_type, COUNT(*) AS count
                FROM activity_logs
                GROUP BY event_type
                """
            ).fetchall()

        items = []
        for row in rows:
            try:
                details = json.loads(row["details"] or "{}")
            except json.JSONDecodeError:
                details = {}
            items.append(
                {
                    "id": row["id"],
                    "eventType": row["event_type"],
                    "ipAddress": row["ip_address"],
                    "walletAddress": row["wallet_address"],
                    "path": row["path"],
                    "userAgent": row["user_agent"],
                    "details": details,
                    "createdAt": row["created_at"],
                }
            )

        summary = {row["event_type"]: row["count"] for row in summary_rows}
        self.send_json(
            200,
            {
                "ok": True,
                "items": items,
                "summary": {
                    "pageViews": summary.get("page_view", 0),
                    "walletLogins": summary.get("wallet_login", 0),
                    "airdropQueries": summary.get("airdrop_query", 0),
                },
            },
        )

    def handle_admin_save(self):
        try:
            payload = self.read_json()
        except json.JSONDecodeError:
            self.send_json(400, {"ok": False, "error": "invalid_json"})
            return

        address = (payload.get("walletAddress") or payload.get("address") or "").strip()
        shares = payload.get("shares")

        if not self.is_valid_address(address):
            self.send_json(400, {"ok": False, "error": "invalid_address"})
            return

        try:
            shares = float(shares)
        except (TypeError, ValueError):
            self.send_json(400, {"ok": False, "error": "invalid_shares"})
            return

        if shares < 0:
            self.send_json(400, {"ok": False, "error": "invalid_shares"})
            return

        with sqlite3.connect(DB_PATH) as connection:
            connection.execute(
                """
                INSERT INTO airdrop_allocations (wallet_address, token_symbol, shares, tokens_per_share, updated_at)
                VALUES (?, 'EXB', ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(wallet_address) DO UPDATE SET
                  token_symbol = excluded.token_symbol,
                  shares = excluded.shares,
                  tokens_per_share = excluded.tokens_per_share,
                  updated_at = CURRENT_TIMESTAMP
                """,
                (address, shares, TOKENS_PER_SHARE),
            )
            connection.commit()

        self.send_json(
            200,
            {
                "ok": True,
                "walletAddress": address,
                "tokenSymbol": "EXB",
                "shares": shares,
                "tokensPerShare": TOKENS_PER_SHARE,
                "totalTokens": shares * TOKENS_PER_SHARE,
            },
        )

    def handle_admin_delete(self, query):
        address = (query.get("address") or [""])[0].strip()

        if not self.is_valid_address(address):
            self.send_json(400, {"ok": False, "error": "invalid_address"})
            return

        with sqlite3.connect(DB_PATH) as connection:
            cursor = connection.execute(
                "DELETE FROM airdrop_allocations WHERE lower(wallet_address) = ?",
                (address.lower(),),
            )
            connection.commit()

        self.send_json(200, {"ok": True, "deleted": cursor.rowcount})

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    init_database()
    server = ThreadingHTTPServer(("127.0.0.1", 4174), ExBeerHandler)
    print("ExBeer server running at http://127.0.0.1:4174")
    server.serve_forever()
