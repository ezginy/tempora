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