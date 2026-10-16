PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS airdrop_allocations (
  wallet_address TEXT PRIMARY KEY COLLATE NOCASE,
  token_symbol TEXT NOT NULL DEFAULT 'EXB',
  shares REAL NOT NULL CHECK (shares >= 0),
  tokens_per_share INTEGER NOT NULL DEFAULT 1000000 CHECK (tokens_per_share = 1000000),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_airdrop_allocations_token_symbol
  ON airdrop_allocations (token_symbol);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'wallet_login', 'airdrop_query')),
  ip_address TEXT NOT NULL,
  wallet_address TEXT,
  path TEXT,
  user_agent TEXT,
  details TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at
  ON activity_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_wallet
  ON activity_logs (wallet_address);

CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type
  ON activity_logs (event_type);

INSERT INTO airdrop_allocations (wallet_address, token_symbol, shares, tokens_per_share)
VALUES
  ('0x1111111111111111111111111111111111111111', 'EXB', 8, 1000000),
  ('0x2222222222222222222222222222222222222222', 'EXB', 3, 1000000),
  ('0x742d35cc6634c0532925a3b844bc454e4438f44e', 'EXB', 12, 1000000),
  ('0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead', 'EXB', 1, 1000000),
  ('0x787806B4509a5478EF8B5e6bC75a30517F748E2c', 'EXB', 3, 1000000),
  ('0xbE55ef8F6b9C96bf7256bFC9D0663783283aCF6F', 'EXB', 1, 1000000),
  ('0x1dB23feD0254c36BC041B6595Fec9bb6Bf3756be', 'EXB', 1, 1000000),
  ('0x820A0bDF0F6A3D84789465d4d56053b9E207AB12', 'EXB', 1, 1000000),
  ('0x2510b473E132c36C235833317750aAbAb09baa64', 'EXB', 0.5, 1000000),
  ('0x07156c23bf1080cd7976390962159b36ffd1f830', 'EXB', 0.5, 1000000)
ON CONFLICT(wallet_address) DO UPDATE SET
  token_symbol = excluded.token_symbol,
  shares = excluded.shares,
  tokens_per_share = excluded.tokens_per_share,
  updated_at = CURRENT_TIMESTAMP;
