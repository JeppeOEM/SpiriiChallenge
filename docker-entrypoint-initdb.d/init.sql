CREATE TABLE IF NOT EXISTS git_stats (
    username TEXT PRIMARY KEY,
    additions INTEGER NOT NULL,
    deletions INTEGER NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
