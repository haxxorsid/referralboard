-- Table: app.years_of_experiences

-- DROP TABLE IF EXISTS app.years_of_experiences;

CREATE TABLE IF NOT EXISTS app.years_of_experiences
(
    years_of_experience_id bigint NOT NULL DEFAULT nextval('app.years_of_experiences_years_of_experience_id_seq'::regclass),
    description text COLLATE pg_catalog."default",
    CONSTRAINT years_of_experiences_pkey PRIMARY KEY (years_of_experience_id)
)

TABLESPACE pg_default;