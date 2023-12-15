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
-- Name: Calendar; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."Calendar" (
    day integer NOT NULL
);


ALTER TABLE public."Calendar" OWNER TO dmitriy;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."Event" (
    id integer NOT NULL,
    "ownerId" integer,
    "calendarDay" integer,
    title character varying(80),
    description character varying(8000),
    requirements character varying(2000),
    location character varying(400),
    "isPublic" boolean,
    "createdAt" timestamp with time zone,
    "startsAt" timestamp with time zone,
    "endsAt" timestamp with time zone
);


ALTER TABLE public."Event" OWNER TO dmitriy;

--
-- Name: EventNotification; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."EventNotification" (
    "personId" integer NOT NULL,
    "eventId" integer NOT NULL,
    "createdAt" timestamp with time zone,
    "notifyAt" timestamp with time zone,
    attempts integer,
    "interval" integer,
    "isSuccess" boolean
);


ALTER TABLE public."EventNotification" OWNER TO dmitriy;

--
-- Name: EventTag; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."EventTag" (
    "eventId" integer NOT NULL,
    tag character varying(30) NOT NULL
);


ALTER TABLE public."EventTag" OWNER TO dmitriy;

--
-- Name: EventVisit; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."EventVisit" (
    "personId" integer NOT NULL,
    "eventId" integer NOT NULL,
    motivation character varying(1000),
    "createdAt" timestamp with time zone,
    "isApproved" boolean,
    "isVisited" boolean
);


ALTER TABLE public."EventVisit" OWNER TO dmitriy;

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
    "isPublic" boolean,
    password character varying(255),
    "createdAt" timestamp with time zone
);


ALTER TABLE public."Person" OWNER TO dmitriy;

--
-- Name: PersonTag; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."PersonTag" (
    "personId" integer NOT NULL,
    tag character varying(30) NOT NULL
);


ALTER TABLE public."PersonTag" OWNER TO dmitriy;

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
-- Name: UserSession; Type: TABLE; Schema: public; Owner: dmitriy
--

CREATE TABLE public."UserSession" (
    id integer NOT NULL,
    "personId" integer,
    password character varying(160),
    "expiresAt" timestamp with time zone
);


ALTER TABLE public."UserSession" OWNER TO dmitriy;

--
-- Name: UserSession_id_seq; Type: SEQUENCE; Schema: public; Owner: dmitriy
--

CREATE SEQUENCE public."UserSession_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserSession_id_seq" OWNER TO dmitriy;

--
-- Name: UserSession_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dmitriy
--

ALTER SEQUENCE public."UserSession_id_seq" OWNED BY public."UserSession".id;


--
-- Name: Event id; Type: DEFAULT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event" ALTER COLUMN id SET DEFAULT nextval('public."Event_id_seq"'::regclass);


--
-- Name: Person id; Type: DEFAULT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Person" ALTER COLUMN id SET DEFAULT nextval('public."Person_id_seq"'::regclass);


--
-- Name: UserSession id; Type: DEFAULT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."UserSession" ALTER COLUMN id SET DEFAULT nextval('public."UserSession_id_seq"'::regclass);


--
-- Data for Name: Calendar; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."Calendar" (day) FROM stdin;
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."Event" (id, "ownerId", "calendarDay", title, description, requirements, location, "isPublic", "createdAt", "startsAt", "endsAt") FROM stdin;
\.


--
-- Data for Name: EventNotification; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."EventNotification" ("personId", "eventId", "createdAt", "notifyAt", attempts, "interval", "isSuccess") FROM stdin;
\.


--
-- Data for Name: EventTag; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."EventTag" ("eventId", tag) FROM stdin;
\.


--
-- Data for Name: EventVisit; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."EventVisit" ("personId", "eventId", motivation, "createdAt", "isApproved", "isVisited") FROM stdin;
\.


--
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."Person" (id, email, name, biography, "isPublic", password, "createdAt") FROM stdin;
\.


--
-- Data for Name: PersonTag; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."PersonTag" ("personId", tag) FROM stdin;
\.


--
-- Data for Name: UserSession; Type: TABLE DATA; Schema: public; Owner: dmitriy
--

COPY public."UserSession" (id, "personId", password, "expiresAt") FROM stdin;
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
-- Name: UserSession_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dmitriy
--

SELECT pg_catalog.setval('public."UserSession_id_seq"', 1, false);


--
-- Name: Calendar Calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Calendar"
    ADD CONSTRAINT "Calendar_pkey" PRIMARY KEY (day);


--
-- Name: EventNotification EventNotification_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventNotification"
    ADD CONSTRAINT "EventNotification_pkey" PRIMARY KEY ("personId", "eventId");


--
-- Name: EventTag EventTag_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventTag"
    ADD CONSTRAINT "EventTag_pkey" PRIMARY KEY ("eventId", tag);


--
-- Name: EventVisit EventVisit_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventVisit"
    ADD CONSTRAINT "EventVisit_pkey" PRIMARY KEY ("personId", "eventId");


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: PersonTag PersonTag_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."PersonTag"
    ADD CONSTRAINT "PersonTag_pkey" PRIMARY KEY ("personId", tag);


--
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY (id);


--
-- Name: UserSession UserSession_pkey; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."UserSession"
    ADD CONSTRAINT "UserSession_pkey" PRIMARY KEY (id);


--
-- Name: Person person_email_unique; Type: CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT person_email_unique UNIQUE (email);


--
-- Name: Event event_calendarday_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT event_calendarday_foreign FOREIGN KEY ("calendarDay") REFERENCES public."Calendar"(day);


--
-- Name: Event event_ownerid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT event_ownerid_foreign FOREIGN KEY ("ownerId") REFERENCES public."Person"(id);


--
-- Name: EventNotification eventnotification_eventid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventNotification"
    ADD CONSTRAINT eventnotification_eventid_foreign FOREIGN KEY ("eventId") REFERENCES public."Event"(id);


--
-- Name: EventNotification eventnotification_personid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventNotification"
    ADD CONSTRAINT eventnotification_personid_foreign FOREIGN KEY ("personId") REFERENCES public."Person"(id);


--
-- Name: EventTag eventtag_eventid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventTag"
    ADD CONSTRAINT eventtag_eventid_foreign FOREIGN KEY ("eventId") REFERENCES public."Event"(id);


--
-- Name: EventVisit eventvisit_eventid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventVisit"
    ADD CONSTRAINT eventvisit_eventid_foreign FOREIGN KEY ("eventId") REFERENCES public."Event"(id);


--
-- Name: EventVisit eventvisit_personid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."EventVisit"
    ADD CONSTRAINT eventvisit_personid_foreign FOREIGN KEY ("personId") REFERENCES public."Person"(id);


--
-- Name: PersonTag persontag_personid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."PersonTag"
    ADD CONSTRAINT persontag_personid_foreign FOREIGN KEY ("personId") REFERENCES public."Person"(id);


--
-- Name: UserSession usersession_personid_foreign; Type: FK CONSTRAINT; Schema: public; Owner: dmitriy
--

ALTER TABLE ONLY public."UserSession"
    ADD CONSTRAINT usersession_personid_foreign FOREIGN KEY ("personId") REFERENCES public."Person"(id);


--
-- PostgreSQL database dump complete
--

