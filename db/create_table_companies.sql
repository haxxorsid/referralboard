-- Table: app.companies

-- DROP TABLE IF EXISTS app.companies;

CREATE TABLE IF NOT EXISTS app.companies
(
    id bigint NOT NULL DEFAULT nextval('app.companies_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    domain text COLLATE pg_catalog."default",
    CONSTRAINT companies_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;