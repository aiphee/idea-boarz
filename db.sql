CREATE TABLE IF NOT EXISTS col
(
    id   INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS idea
(
    id         INTEGER PRIMARY KEY,
    text       text              NOT NULL,
    guest_hash text              NOT NULL,
    col_id     INTEGER           NOT NULL
        CONSTRAINT idea_col_id_fk
        REFERENCES "col" (id)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    deleted    integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS idea_likes
(
    idea_id    INTEGER NOT NULL
        CONSTRAINT idea_likes_idea_id_fk
        REFERENCES idea (id),
    guest_hash text    NOT NULL
);

CREATE UNIQUE INDEX idea_guest_uindex
    ON idea_likes (idea_id, guest_hash);

