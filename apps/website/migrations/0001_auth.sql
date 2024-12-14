-- Migration number: 0001 	 2024-08-03T15:43:57.349Z

CREATE TABLE IF NOT EXISTS user (
  id TEXT NOT NULL PRIMARY KEY,
  discord_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  access_token TEXT NOT NULL,
  access_token_expiration NUMBER NOT NULL,
  refresh_token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);
