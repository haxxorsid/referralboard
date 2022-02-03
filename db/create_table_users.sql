-- Table: app.users

-- DROP TABLE IF EXISTS app.users;

CREATE TABLE IF NOT EXISTS app.users
(
    user_id bigint NOT NULL DEFAULT nextval('app.users_user_id_seq'::regclass),
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    current_location text COLLATE pg_catalog."default",
    current_company_id bigint,
    current_company_name text COLLATE pg_catalog."default",
    current_position text COLLATE pg_catalog."default",
    school text COLLATE pg_catalog."default",
    years_of_experience_id bigint,
    email text COLLATE pg_catalog."default",
    password_hash text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

-- Index: uq_users_email

-- DROP INDEX IF EXISTS app.uq_users_email;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email
    ON app.users USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

