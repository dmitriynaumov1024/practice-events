--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
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
-- Name: Event; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."Event" (
    id integer NOT NULL,
    title character varying(80),
    "ownerId" integer
);


ALTER TABLE public."Event" OWNER TO dmitriy;

--
-- Name: EventTag; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."EventTag" (
    "eventId" integer NOT NULL,
    tag character varying(30) NOT NULL
);


ALTER TABLE public."EventTag" OWNER TO dmitriy;

--
-- Name: Event_id_seq; Type: SEQUENCE; Schema: public; Owner: dmitriy
--

CREATE SEQUENCE public."Event_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Event_id_seq" OWNER TO dmitriy;

--
-- Name: Event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dmitriy
--

ALTER SEQUENCE public."Event_id_seq" OWNED BY public."Event".id;


--
-- Name: Person; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."Person" (
    id integer NOT NULL,
    email character varying(60),
    name character varying(40),
    biography character varying(160),
    password character varying(255),
    "createdAt" timestamp with time zone
);


ALTER TABLE public."Person" OWNER TO dmitriy;

--
-- Name: Person_id_seq; Type: SEQUENCE; Schema: public; Owner: dmitriy
--

CREATE SEQUENCE public."Person_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Person_id_seq" OWNER TO dmitriy;

--
-- Name: Person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dmitriy
--

ALTER SEQUENCE public."Person_id_seq" OWNED BY public."Person".id;


--
-- Name: Event id; Type: DEFAULT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event" ALTER COLUMN id SET DEFAULT nextval('public."Event_id_seq"'::regclass);


--
-- Name: Person id; Type: DEFAULT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Person" ALTER COLUMN id SET DEFAULT nextval('public."Person_id_seq"'::regclass);


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."Event" (id, title, "ownerId") FROM stdin;
\.


--
-- Data for Name: EventTag; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."EventTag" ("eventId", tag) FROM stdin;
\.


--
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."Person" (id, email, name, biography, password, "createdAt") FROM stdin;
\.


--
-- Name: Event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dmitriy
--

SELECT pg_catalog.setval('public."Event_id_seq"', 1, false);


--
-- Name: Person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dmitriy
--

SELECT pg_catalog.setval('public."Person_id_seq"', 1, false);


--
-- Name: EventTag EventTag_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventTag"
    ADD CONSTRAINT "EventTag_pkey" PRIMARY KEY ("eventId", tag);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY (id);


--
-- Name: Person person_email_unique; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT person_email_unique UNIQUE (email);


--
-- Name: Event event_ownerid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT event_ownerid_foreign FOREIGN KEY ("ownerId") REFERENCES public."Person"(id);


--
-- Name: EventTag eventtag_eventid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventTag"
    ADD CONSTRAINT eventtag_eventid_foreign FOREIGN KEY ("eventId") REFERENCES public."Event"(id);


--
-- PostgreSQL database dump complete
--

