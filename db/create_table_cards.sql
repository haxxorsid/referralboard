CREATE TABLE IF NOT EXISTS app.cards (
    card_id SERIAL,
    title VARCHAR ( 50 ) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_card_id PRIMARY KEY (card_id)
);