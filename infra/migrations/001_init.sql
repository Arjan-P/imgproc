CREATE TABLE jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status      TEXT NOT NULL DEFAULT 'pending',
  progress    INT  NOT NULL DEFAULT 0,
  ops         JSONB NOT NULL DEFAULT '[]',
  s3_key_in   TEXT NOT NULL,
  s3_key_out  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  done_at     TIMESTAMPTZ
);

CREATE INDEX ON jobs (status);
CREATE INDEX ON jobs (created_at DESC);
