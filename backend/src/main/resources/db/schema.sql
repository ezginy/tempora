CREATE TABLE IF NOT EXISTS tasks
(
    id                 SERIAL PRIMARY KEY,
    title              VARCHAR(150)                                                                 NOT NULL,
    description        TEXT,
    priority           VARCHAR(10) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))                    NOT NULL,
    status             VARCHAR(15) CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')) DEFAULT 'TODO' NOT NULL,
    created_at         TIMESTAMPTZ                                                   DEFAULT now()  NOT NULL,
    estimated_duration INTEGER,
    actual_duration    INTEGER                                                       DEFAULT 0      NOT NULL
);

ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS estimated_duration INTEGER;
ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS actual_duration INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS status_history
(
    id          SERIAL PRIMARY KEY,
    task_id     INTEGER REFERENCES tasks (id) ON DELETE CASCADE                   NOT NULL,
    from_status VARCHAR(15) CHECK ( from_status IN ('TODO', 'IN_PROGRESS', 'DONE') ),
    to_status   VARCHAR(15) CHECK ( to_status IN ('TODO', 'IN_PROGRESS', 'DONE')) NOT NULL,
    changed_at  TIMESTAMPTZ DEFAULT now()                                         NOT NULL

);