-- Table: app.companies

-- DROP TABLE IF EXISTS app.companies;

CREATE TABLE IF NOT EXISTS app.companies
(
    company_id bigint NOT NULL DEFAULT nextval('app.companies_company_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    domain text COLLATE pg_catalog."default",
    CONSTRAINT companies_pkey PRIMARY KEY (company_id)
)

TABLESPACE pg_default;