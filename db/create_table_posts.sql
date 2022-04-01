-- Table: app.posts

-- DROP TABLE IF EXISTS app.posts;

CREATE TABLE IF NOT EXISTS app.posts
(
    id bigint NOT NULL DEFAULT nextval('app.posts_id_seq'::regclass),
    user_id bigint,
    company_id bigint,
    "position" text COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default",
    resume text COLLATE pg_catalog."default",
    job_link text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_app_posts_company FOREIGN KEY (company_id)
        REFERENCES app.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_app_users_posts FOREIGN KEY (user_id)
        REFERENCES app.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;
