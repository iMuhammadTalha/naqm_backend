CREATE TYPE user_otp_method AS ENUM ('email', 'mobile');
-- Table: public.user_otp

-- DROP TABLE public.user_otp;

CREATE TYPE user_otp_method AS ENUM ('email', 'mobile');

CREATE TABLE public.user_otp
(
    id bigserial NOT NULL,
    user_id bigserial NOT NULL,
    otp integer NOT NULL,
    created_date timestamp with time zone NOT NULL,
    method user_otp_method,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.user_otp
    OWNER to postgres;

    CREATE TABLE public.user_jwt
    (
        id bigserial NOT NULL,
        user_id bigserial NOT NULL,
        jwt text,
        fcm text,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id)
            REFERENCES public.users (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
    )
    WITH (
        OIDS = FALSE
    );

    ALTER TABLE public.user_jwt
        OWNER to postgres;