-- Table: app.posts

-- DROP TABLE IF EXISTS app.posts;

CREATE TABLE IF NOT EXISTS app.posts
(
    post_id bigint NOT NULL DEFAULT nextval('app.posts_post_id_seq'::regclass),
    user_id bigint,
    target_company_id bigint,
    target_position text COLLATE pg_catalog."default",
    message text COLLATE pg_catalog."default",
    resume text COLLATE pg_catalog."default",
    job_link text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    CONSTRAINT posts_pkey PRIMARY KEY (post_id)
)

TABLESPACE pg_default;