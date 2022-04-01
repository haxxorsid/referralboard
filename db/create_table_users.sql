-- Table: app.users

-- DROP TABLE IF EXISTS app.users;

CREATE TABLE IF NOT EXISTS app.users
(
    id bigint NOT NULL DEFAULT nextval('app.users_id_seq'::regclass),
    first_name text COLLATE pg_catalog."default" NOT NULL,
    last_name text COLLATE pg_catalog."default" NOT NULL,
    location text COLLATE pg_catalog."default" NOT NULL,
    company_id bigint,
    company_name text COLLATE pg_catalog."default" NOT NULL,
    "position" text COLLATE pg_catalog."default" NOT NULL,
    school text COLLATE pg_catalog."default" NOT NULL,
    years_of_experience_id bigint NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS app.users
    OWNER to siddhesh;
-- Index: uq_users_email

-- DROP INDEX IF EXISTS app.uq_users_email;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email
    ON app.users USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

