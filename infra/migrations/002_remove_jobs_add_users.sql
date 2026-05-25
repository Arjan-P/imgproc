DROP TABLE IF EXISTS jobs;

CREATE TABLE users (
  id TEXT PRIMARY KEY,

  email_address TEXT UNIQUE,

  first_name TEXT,
  last_name TEXT,
  image_url TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email_address
ON users (email_address);

CREATE INDEX idx_users_created_at
ON users (created_at DESC);
