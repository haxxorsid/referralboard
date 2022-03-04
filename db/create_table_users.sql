-- Table: app.users

-- DROP TABLE IF EXISTS app.users;

CREATE TABLE IF NOT EXISTS app.users
(
    user_id bigint NOT NULL DEFAULT nextval('app.users_user_id_seq'::regclass),
    first_name text COLLATE pg_catalog."default" NOT NULL,
    last_name text COLLATE pg_catalog."default" NOT NULL,
    current_location text COLLATE pg_catalog."default" NOT NULL,
    current_company_id bigint,
    current_company_name text COLLATE pg_catalog."default" NOT NULL,
    current_position text COLLATE pg_catalog."default" NOT NULL,
    school text COLLATE pg_catalog."default" NOT NULL,
    years_of_experience_id bigint NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

-- Index: uq_users_email

-- DROP INDEX IF EXISTS app.uq_users_email;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email
    ON app.users USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

