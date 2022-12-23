--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    token text NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    url text NOT NULL,
    "shortUrl" text NOT NULL,
    "userId" integer,
    "visitCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "confirmPassword" text NOT NULL,
    "visitCount" integer DEFAULT 0 NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (2, '8277babe-0d79-455c-ae0c-6e7123252fb6', 3);
INSERT INTO public.sessions VALUES (3, '68f4d888-ee7e-4b14-9869-e94a12104d6a', 4);
INSERT INTO public.sessions VALUES (4, 'd6d2ec78-3e67-43cd-92e7-ccc2337ec461', 5);
INSERT INTO public.sessions VALUES (5, '417f8a03-b3b4-46ef-96a1-175bbabf1cf7', 5);
INSERT INTO public.sessions VALUES (6, 'bbc5fe3e-15fa-4782-a1d1-0d68ae0c6e8c', 4);
INSERT INTO public.sessions VALUES (7, 'eac49449-7def-4936-b66c-552e7261d904', 6);
INSERT INTO public.sessions VALUES (8, '9451bd22-c970-45de-8cf9-461552c9be88', 5);
INSERT INTO public.sessions VALUES (9, 'a4656011-2dbd-4d5a-b451-8090ef45e338', 7);
INSERT INTO public.sessions VALUES (10, '1613aaac-c695-4541-97da-37ed299f0895', 7);
INSERT INTO public.sessions VALUES (11, '6b7e10fd-34a7-4d97-8c0a-bab0d7d71e7a', 7);
INSERT INTO public.sessions VALUES (12, 'c9074d7b-136a-4708-a40f-42a60f49842f', 5);
INSERT INTO public.sessions VALUES (13, 'd53395cf-845b-40d8-b1a9-a1cbc6dd17bc', 8);
INSERT INTO public.sessions VALUES (14, '639e4e56-be4e-4e3e-852e-f30e68e16207', 8);
INSERT INTO public.sessions VALUES (15, '8b443cff-d9cb-43e0-8173-cbb53d2b5ac1', 9);


--
-- Data for Name: urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.urls VALUES (1, 'https://www.google.com/search?q=joi+uri+validation&oq=joi+uri+&aqs=chrome.1.69i57j0i19i512l2j0i19i22i30l2j69i60.3767j0j7&sourceid=chrome&ie=UTF-8', 'hEOrNU-o', NULL, 0, '2022-12-20 13:45:00.958438');
INSERT INTO public.urls VALUES (2, 'https://www.google.com/search?q=parenteses&sxsrf=ALiCzsb2K7m1f2naSGzMlDmRkcBFpdEJnw:1671555530446&ei=yumhY8HlGqre1sQPx66CkA4&start=10&sa=N&ved=2ahUKEwjB8vTM1Yj8AhUqr5UCHUeXAOIQ8NMDegQIBhAW', 'cDUjUTNR', NULL, 0, '2022-12-20 14:54:38.581797');
INSERT INTO public.urls VALUES (14, 'https://www.youtube.com/watch?v=8cSJZEi5Ynw', '8yiuuohR', 5, 9, '2022-12-22 11:45:49.895908');
INSERT INTO public.urls VALUES (15, 'https://www.youtube.com/watch?v=rldMKIbfEAc', 'AXWOgOlB', 5, 3, '2022-12-22 11:46:12.176513');
INSERT INTO public.urls VALUES (4, 'https://www.youtube.com/watch?v=7iEVkcwM31E', 'ReBlSjpm', 3, 4, '2022-12-21 15:47:44.558739');
INSERT INTO public.urls VALUES (5, 'https://www.youtube.com/watch?v=7iEVkcwM31E', '7u3JiXQm', 3, 0, '2022-12-21 22:40:54.913153');
INSERT INTO public.urls VALUES (10, 'https://www.notion.so/bootcampra/Projeto-Shortly-API-3ef2afe78c254d069f862c036efa6f04', 'Jtm0yckM', 4, 0, '2022-12-22 11:38:14.171279');
INSERT INTO public.urls VALUES (16, 'https://www.youtube.com/watch?v=SLKWBwvTj1k', 'ZO4GUR0f', 6, 0, '2022-12-22 12:09:52.22147');
INSERT INTO public.urls VALUES (17, 'https://www.youtube.com/watch?v=lUAY_cv9bZk', 'YSODWhdd', 6, 0, '2022-12-22 12:10:16.543984');
INSERT INTO public.urls VALUES (19, 'https://www.youtube.com/watch?v=mpBk_0TehhE', 'jBhYvqX9', 6, 0, '2022-12-22 12:11:06.051348');
INSERT INTO public.urls VALUES (7, 'https://www.google.com/search?q=como+organizar+arquivos+json&oq=como+organizar+arquivos+json+&aqs=chrome..69i57j0i22i30.5257j1j7&sourceid=chrome&ie=UTF-8', 'WvuFfMNt', 4, 7, '2022-12-22 11:37:06.216918');
INSERT INTO public.urls VALUES (8, 'https://www.enterprisedb.com/postgres-tutorials/how-use-limit-and-offset-postgresql', 'TiqOwqpS', 4, 5, '2022-12-22 11:37:36.53315');
INSERT INTO public.urls VALUES (20, 'https://www.youtube.com/watch?v=IHUJ3B4FlUA', 'IA7Ra-6G', 6, 6, '2022-12-22 12:11:29.847314');
INSERT INTO public.urls VALUES (21, 'https://www.devmedia.com.br/json-tutorial/25275', 'Xeb4MuEB', 5, 0, '2022-12-22 12:23:07.668208');
INSERT INTO public.urls VALUES (26, 'https://www.notion.so/bootcampra/Materiais-5d1fe6e0d1764b0e94ed6b0a65827c98', '_W6X_lKh', 9, 9, '2022-12-23 16:10:43.974542');
INSERT INTO public.urls VALUES (11, 'https://pt.stackoverflow.com/questions/244826/como-organizar-conte%C3%BAdo-json', 'fuMndGIp', 4, 2, '2022-12-22 11:38:33.287616');
INSERT INTO public.urls VALUES (9, 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/', 'XUa4j8Gd', 4, 5, '2022-12-22 11:37:58.635212');
INSERT INTO public.urls VALUES (12, 'https://www.youtube.com/watch?v=jfKfPfyJRdk', 'cl0Gwh5b', 5, 0, '2022-12-22 11:45:06.901274');
INSERT INTO public.urls VALUES (18, 'https://www.youtube.com/watch?v=QKuENYO4W04', 'eYrcevpu', 6, 3, '2022-12-22 12:10:45.016767');
INSERT INTO public.urls VALUES (6, 'https://web.whatsapp.com/', 'nekMao62', 3, 2, '2022-12-21 22:41:12.870726');
INSERT INTO public.urls VALUES (13, 'https://www.youtube.com/', 'jhW9-IwC', 5, 7, '2022-12-22 11:45:21.353331');
INSERT INTO public.urls VALUES (23, 'https://cdn.discordapp.com/attachments/1055472920513748992/1055473558601601094/image.png', 'IK6brQ-N', 8, 2, '2022-12-23 15:42:34.564913');
INSERT INTO public.urls VALUES (24, 'https://us06web.zoom.us/rec/play/kM8MEriVvKYqvnEOaeslBTUQfTb-dv_ZXoIuegfgTKSD-iA_45UB1qX-595EKcyrtfvAGl-51yqEIrMH.PigRRU2tJSpz6qEz?_x_zm_rhtaid=123&_x_zm_rtaid=FFkU4mqHQ1iZ7f2Ys1mcIg.1671806505655.8b66430ad044e73dab39f348cf918e18&autoplay=true&continueMode=true&startTime=1668723722000', '8WYvcbSc', 8, 5, '2022-12-23 16:01:01.493923');
INSERT INTO public.urls VALUES (25, 'https://github.com/ramonlnas/projeto17-shortly/blob/main/src/index.js', 'sJEGYTLc', 9, 0, '2022-12-23 16:10:20.381884');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (8, 'João', 'joao7@driven.com.br', '$2b$12$J20HTdgoooiN/hdjZsEkh.YBXKrmgPS.5lR6N61t5r9FibQm/udVK', '$2b$12$tG9QvMX.UzYE2Ilkr8wrgOMESOhkcH4rT87OcyTyDxkj9iEuZqTMK', 7);
INSERT INTO public.users VALUES (9, 'João', 'joao10@driven.com.br', '$2b$12$RtxwojbCebDnaSqL6YRZeeQVA2FYDSLDTocb6AAqyDRcVeipdy/2e', '$2b$12$WPO6uX/yih05DFswASLjIOYTEVz3bFhhvRiPdA0/7VqvlNqrt/HeS', 9);
INSERT INTO public.users VALUES (5, 'Jhin', 'joao3@driven.com.br', '$2b$12$cIlwEJQ37PVKrgMXnFE/Iu1dZD0EiNuRL4lagNgL4N1xaArEg4.ZG', '$2b$12$hbK.NQgXbsnxA6Q2ogn1FOu1O15IEFOSFaLSlgWzvmEIqkiGMsWAS', 19);
INSERT INTO public.users VALUES (4, 'Vayne', 'joao2@driven.com.br', '$2b$12$cGVSSh7pvm7xVyPQpchoYO9/XiyH61GnKwggZml1KdESHWVF6otv2', '$2b$12$H41BHdtnr8/CUreaORS2N.sldYq8lfKNHxuZk0pX36y5v.fUiCUIK', 19);
INSERT INTO public.users VALUES (6, 'K''sante', 'joao4@driven.com.br', '$2b$12$ZFiKFV5pbJH9lf8oOFlHTOgl5q.se.zRQkELFJgnjPOq.ExIqXz7a', '$2b$12$r/voLaibAVQvBDNulYaQX.pGvgiBILFPLdy1FIeVaJq6f/GbluWVi', 9);
INSERT INTO public.users VALUES (3, 'Ramon', 'ramon@driven.com.br', '$2b$12$ahQhrevvOgOdLsmCIhgb/OdQIRMyKz9buCo9xMBKz4rez5k0zAqdW', '$2b$12$q.hUCuSrpOiZ6pfBk78sruLcYIBmPfhFt3fjFetCByF062Rogt8PG', 3);
INSERT INTO public.users VALUES (7, 'João', 'joao@driven.com.br', '$2b$12$thrCs.3dIj0a0cwS0PHrtOtZAHWD7EBEtTZz/WzMCVr1ZvGjXebiy', '$2b$12$z6U3mTdWD1Q3sC7pWExEfe3ZdWCMK3WIIC36DxFYH4k7rFVJvu6p6', 0);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 15, true);


--
-- Name: urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.urls_id_seq', 26, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: urls urls_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT "urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

