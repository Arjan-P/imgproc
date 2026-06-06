-- clean setup for jwt branch
DROP TABLE IF EXISTS pipelines;
DROP TABLE IF EXISTS users;

-- recreate jwt oriented users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- recreate pipelines table for new users foreign keys
CREATE TABLE pipelines (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Untitled pipeline',
  ops        JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pipelines_user_id
  ON pipelines (user_id);

CREATE INDEX idx_pipelines_user_updated
  ON pipelines (user_id, updated_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- sync updated_at automatically
CREATE TRIGGER pipelines_updated_at
  BEFORE UPDATE ON pipelines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
