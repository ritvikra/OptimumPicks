--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Homebrew)
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: games; Type: TABLE; Schema: public; Owner: ritvikrallapalli
--

CREATE TABLE public.games (
    id character varying(255) NOT NULL,
    league_id character varying(255),
    date date,
    home_team character varying(255),
    away_team character varying(255),
    "time" character varying(255)
);


ALTER TABLE public.games OWNER TO ritvikrallapalli;

--
-- Name: leagues; Type: TABLE; Schema: public; Owner: ritvikrallapalli
--

CREATE TABLE public.leagues (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.leagues OWNER TO ritvikrallapalli;

--
-- Name: leagues_id_seq; Type: SEQUENCE; Schema: public; Owner: ritvikrallapalli
--

CREATE SEQUENCE public.leagues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leagues_id_seq OWNER TO ritvikrallapalli;

--
-- Name: leagues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ritvikrallapalli
--

ALTER SEQUENCE public.leagues_id_seq OWNED BY public.leagues.id;


--
-- Name: odds; Type: TABLE; Schema: public; Owner: ritvikrallapalli
--

CREATE TABLE public.odds (
    id integer NOT NULL,
    game_id character varying(255),
    sportsbook character varying(255),
    type character varying(50),
    value numeric,
    odds numeric
);


ALTER TABLE public.odds OWNER TO ritvikrallapalli;

--
-- Name: odds_id_seq; Type: SEQUENCE; Schema: public; Owner: ritvikrallapalli
--

CREATE SEQUENCE public.odds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.odds_id_seq OWNER TO ritvikrallapalli;

--
-- Name: odds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ritvikrallapalli
--

ALTER SEQUENCE public.odds_id_seq OWNED BY public.odds.id;


--
-- Name: leagues id; Type: DEFAULT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.leagues ALTER COLUMN id SET DEFAULT nextval('public.leagues_id_seq'::regclass);


--
-- Name: odds id; Type: DEFAULT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.odds ALTER COLUMN id SET DEFAULT nextval('public.odds_id_seq'::regclass);


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: ritvikrallapalli
--

COPY public.games (id, league_id, date, home_team, away_team, "time") FROM stdin;
DENBK2025-01-10	NBA	2025-01-10	DEN	BK	9:00 PM
ATLHOU2025-01-11	NBA	2025-01-11	ATL	HOU	3:00 PM
PHOUTA2025-01-11	NBA	2025-01-11	PHO	UTA	5:00 PM
DETTOR2025-01-11	NBA	2025-01-11	DET	TOR	7:00 PM
MINMEM2025-01-11	NBA	2025-01-11	MIN	MEM	8:00 PM
PORMIA2025-01-11	NBA	2025-01-11	POR	MIA	10:00 PM
PHINO2025-01-10	NBA	2025-01-10	PHI	NO	End
ORLMIL2025-01-10	NBA	2025-01-10	ORL	MIL	09:40 4th
INDGS2025-01-10	NBA	2025-01-10	IND	GS	11:43 4th
NYOKC2025-01-10	NBA	2025-01-10	NY	OKC	Halftime
BOSSAC2025-01-10	NBA	2025-01-10	BOS	SAC	09:12 3rd
CHIWAS2025-01-10	NBA	2025-01-10	CHI	WAS	04:53 2nd
LALSA2025-01-11	NBA	2025-01-11	LAL	SA	10:30 PM
LACCHA2025-01-11	NBA	2025-01-11	LAC	CHA	10:30 PM
NYMIL2025-01-11	NBA	2025-01-11	NY	MIL	3:00 PM
DALDEN2025-01-11	NBA	2025-01-11	DAL	DEN	3:00 PM
CHISAC2025-01-11	NBA	2025-01-11	CHI	SAC	3:30 PM
WASOKC2025-01-11	NBA	2025-01-11	WAS	OKC	6:00 PM
CLEIND2025-01-11	NBA	2025-01-11	CLE	IND	6:00 PM
ORLPHI2025-01-11	NBA	2025-01-11	ORL	PHI	6:00 PM
BOSNO2025-01-11	NBA	2025-01-11	BOS	NO	6:00 PM
UTABK2025-01-11	NBA	2025-01-11	UTA	BK	8:00 PM
PHOCHA2025-01-11	NBA	2025-01-11	PHO	CHA	9:00 PM
INDCLE2025-01-13	NBA	2025-01-13	IND	CLE	7:00 PM
PHIOKC2025-01-13	NBA	2025-01-13	PHI	OKC	7:00 PM
ATLPHO2025-01-13	NBA	2025-01-13	ATL	PHO	7:30 PM
CHINO2025-01-13	NBA	2025-01-13	CHI	NO	8:00 PM
MILSAC2025-01-13	NBA	2025-01-13	MIL	SAC	8:00 PM
DALDEN2025-01-13	NBA	2025-01-13	DAL	DEN	9:30 PM
PORBK2025-01-13	NBA	2025-01-13	POR	BK	10:00 PM
\.


--
-- Data for Name: leagues; Type: TABLE DATA; Schema: public; Owner: ritvikrallapalli
--

COPY public.leagues (id, name) FROM stdin;
1	NFL
2	NBA
\.


--
-- Data for Name: odds; Type: TABLE DATA; Schema: public; Owner: ritvikrallapalli
--

COPY public.odds (id, game_id, sportsbook, type, value, odds) FROM stdin;
541	INDCLE2025-01-13	ProphetX	total	229.0	-112
542	INDCLE2025-01-13	ProphetX	spread	-7.5	-121
543	INDCLE2025-01-13	Novig	total	0	0
544	INDCLE2025-01-13	Novig	spread	0	0
545	INDCLE2025-01-13	BetMGM	total	228.5	-105
546	INDCLE2025-01-13	BetMGM	spread	-7.5	-115
547	INDCLE2025-01-13	Bet365	total	229.0	-110
548	INDCLE2025-01-13	Bet365	spread	-7.0	-110
549	INDCLE2025-01-13	FanDuel	total	229.5	-114
550	INDCLE2025-01-13	FanDuel	spread	-7.0	-106
551	INDCLE2025-01-13	DraftKings	total	229.5	-108
552	INDCLE2025-01-13	DraftKings	spread	-7.5	-112
553	PHIOKC2025-01-13	ProphetX	total	218.5	-114
554	PHIOKC2025-01-13	ProphetX	spread	-11.0	-118
555	PHIOKC2025-01-13	Novig	total	0	0
556	PHIOKC2025-01-13	Novig	spread	0	0
557	PHIOKC2025-01-13	BetMGM	total	218.5	-115
558	PHIOKC2025-01-13	BetMGM	spread	-10.5	-105
559	PHIOKC2025-01-13	Bet365	total	218.5	-110
560	PHIOKC2025-01-13	Bet365	spread	-11.0	-110
561	PHIOKC2025-01-13	FanDuel	total	218.0	-112
562	PHIOKC2025-01-13	FanDuel	spread	-11.5	-108
563	PHIOKC2025-01-13	DraftKings	total	218.5	-110
564	PHIOKC2025-01-13	DraftKings	spread	-11.0	-110
565	ATLPHO2025-01-13	ProphetX	total	236.5	-112
566	ATLPHO2025-01-13	ProphetX	spread	-3.0	-121
567	ATLPHO2025-01-13	Novig	total	0	0
568	ATLPHO2025-01-13	Novig	spread	0	0
569	ATLPHO2025-01-13	BetMGM	total	235.5	-115
570	ATLPHO2025-01-13	BetMGM	spread	-2.5	-105
571	ATLPHO2025-01-13	Bet365	total	235.5	-110
572	ATLPHO2025-01-13	Bet365	spread	-3.0	-110
573	ATLPHO2025-01-13	FanDuel	total	236.0	-108
574	ATLPHO2025-01-13	FanDuel	spread	-3.0	-112
575	ATLPHO2025-01-13	DraftKings	total	236.0	-110
576	ATLPHO2025-01-13	DraftKings	spread	-3.0	-110
577	CHINO2025-01-13	ProphetX	total	238.5	-112
578	CHINO2025-01-13	ProphetX	spread	-2.0	-121
579	CHINO2025-01-13	Novig	total	0	0
580	CHINO2025-01-13	Novig	spread	0	0
581	CHINO2025-01-13	BetMGM	total	238.5	-115
582	CHINO2025-01-13	BetMGM	spread	-2.5	-105
583	CHINO2025-01-13	Bet365	total	238.0	-110
584	CHINO2025-01-13	Bet365	spread	-2.0	-110
585	CHINO2025-01-13	FanDuel	total	238.0	-108
586	CHINO2025-01-13	FanDuel	spread	-2.0	-112
587	CHINO2025-01-13	DraftKings	total	238.5	-108
588	CHINO2025-01-13	DraftKings	spread	-2.0	-112
589	MILSAC2025-01-13	ProphetX	total	230.0	-113
590	MILSAC2025-01-13	ProphetX	spread	-2.0	-120
591	MILSAC2025-01-13	Novig	total	0	0
592	MILSAC2025-01-13	Novig	spread	0	0
593	MILSAC2025-01-13	BetMGM	total	228.5	-110
594	MILSAC2025-01-13	BetMGM	spread	-2.5	-110
595	MILSAC2025-01-13	Bet365	total	229.0	-110
596	MILSAC2025-01-13	Bet365	spread	-2.0	-110
597	MILSAC2025-01-13	FanDuel	total	229.0	-110
598	MILSAC2025-01-13	FanDuel	spread	-2.5	-110
599	MILSAC2025-01-13	DraftKings	total	229.0	-105
600	MILSAC2025-01-13	DraftKings	spread	-2.0	-115
601	DALDEN2025-01-13	ProphetX	total	231.5	-114
602	DALDEN2025-01-13	ProphetX	spread	-4.5	-118
603	DALDEN2025-01-13	Novig	total	0	0
604	DALDEN2025-01-13	Novig	spread	0	0
605	DALDEN2025-01-13	BetMGM	total	231.5	-110
606	DALDEN2025-01-13	BetMGM	spread	-4.5	-110
607	DALDEN2025-01-13	Bet365	total	231.0	-110
608	DALDEN2025-01-13	Bet365	spread	-4.5	-110
609	DALDEN2025-01-13	FanDuel	total	231.5	-114
610	DALDEN2025-01-13	FanDuel	spread	-4.0	-106
611	DALDEN2025-01-13	DraftKings	total	231.5	-115
612	DALDEN2025-01-13	DraftKings	spread	-4.0	-105
613	PORBK2025-01-13	ProphetX	total	216.0	-115
614	PORBK2025-01-13	ProphetX	spread	-6.0	-117
615	PORBK2025-01-13	Novig	total	0	0
616	PORBK2025-01-13	Novig	spread	0	0
617	PORBK2025-01-13	BetMGM	total	215.5	-115
618	PORBK2025-01-13	BetMGM	spread	-6.5	-105
619	PORBK2025-01-13	Bet365	total	216.0	-110
620	PORBK2025-01-13	Bet365	spread	-6.0	-110
621	PORBK2025-01-13	FanDuel	total	216.5	-112
622	PORBK2025-01-13	FanDuel	spread	-6.0	-108
623	PORBK2025-01-13	DraftKings	total	216.0	-108
624	PORBK2025-01-13	DraftKings	spread	-6.0	-112
25	ATLHOU2025-01-11	ProphetX	total	0	0
26	ATLHOU2025-01-11	ProphetX	spread	0	0
27	ATLHOU2025-01-11	Novig	total	0	0
28	ATLHOU2025-01-11	Novig	spread	0	0
29	ATLHOU2025-01-11	BetMGM	total	233.5	-110
30	ATLHOU2025-01-11	BetMGM	spread	-4.5	-110
31	ATLHOU2025-01-11	Bet365	total	233.5	-110
32	ATLHOU2025-01-11	Bet365	spread	-4.5	-110
33	ATLHOU2025-01-11	FanDuel	total	232.5	-110
34	ATLHOU2025-01-11	FanDuel	spread	-4.5	-110
35	ATLHOU2025-01-11	DraftKings	total	233.5	-112
37	PHOUTA2025-01-11	ProphetX	total	0	0
334	NYMIL2025-01-11	FanDuel	spread	-4.0	-108
335	NYMIL2025-01-11	DraftKings	total	227.5	-110
336	NYMIL2025-01-11	DraftKings	spread	-3.5	-110
337	DALDEN2025-01-11	ProphetX	total	229.5	-120
338	DALDEN2025-01-11	ProphetX	spread	-4.5	-113
339	DALDEN2025-01-11	Novig	total	0	0
340	DALDEN2025-01-11	Novig	spread	0	0
341	DALDEN2025-01-11	BetMGM	total	228.5	-105
342	DALDEN2025-01-11	BetMGM	spread	-4.5	-115
343	DALDEN2025-01-11	Bet365	total	228.5	-110
344	DALDEN2025-01-11	Bet365	spread	-4.0	-110
345	DALDEN2025-01-11	FanDuel	total	228.0	-110
346	DALDEN2025-01-11	FanDuel	spread	-4.5	-110
347	DALDEN2025-01-11	DraftKings	total	229.0	-105
348	DALDEN2025-01-11	DraftKings	spread	-4.5	-115
349	CHISAC2025-01-11	ProphetX	total	238.0	-117
350	CHISAC2025-01-11	ProphetX	spread	-3.5	-115
351	CHISAC2025-01-11	Novig	total	0	0
352	CHISAC2025-01-11	Novig	spread	0	0
353	CHISAC2025-01-11	BetMGM	total	237.5	-115
354	CHISAC2025-01-11	BetMGM	spread	-2.5	-105
355	CHISAC2025-01-11	Bet365	total	238.0	-110
356	CHISAC2025-01-11	Bet365	spread	-3.0	-110
357	CHISAC2025-01-11	FanDuel	total	239.0	-108
358	CHISAC2025-01-11	FanDuel	spread	-3.5	-112
359	CHISAC2025-01-11	DraftKings	total	238.0	-110
360	CHISAC2025-01-11	DraftKings	spread	-3.0	-110
361	WASOKC2025-01-11	ProphetX	total	229.5	-116
362	WASOKC2025-01-11	ProphetX	spread	-16.5	-116
363	WASOKC2025-01-11	Novig	total	0	0
364	WASOKC2025-01-11	Novig	spread	0	0
365	WASOKC2025-01-11	BetMGM	total	229.5	-110
366	WASOKC2025-01-11	BetMGM	spread	-16.5	-110
367	WASOKC2025-01-11	Bet365	total	229.5	-110
368	WASOKC2025-01-11	Bet365	spread	-16.5	-110
369	WASOKC2025-01-11	FanDuel	total	230.0	-110
36	ATLHOU2025-01-11	DraftKings	spread	-4.5	-108
38	PHOUTA2025-01-11	ProphetX	spread	0	0
39	PHOUTA2025-01-11	Novig	total	0	0
40	PHOUTA2025-01-11	Novig	spread	0	0
41	PHOUTA2025-01-11	BetMGM	total	228.5	-115
42	PHOUTA2025-01-11	BetMGM	spread	-11.5	-105
43	PHOUTA2025-01-11	Bet365	total	228.5	-110
44	PHOUTA2025-01-11	Bet365	spread	-11.0	-110
45	PHOUTA2025-01-11	FanDuel	total	228.5	-110
46	PHOUTA2025-01-11	FanDuel	spread	-11.0	-110
47	PHOUTA2025-01-11	DraftKings	total	228.5	-112
48	PHOUTA2025-01-11	DraftKings	spread	-11.0	-108
49	DETTOR2025-01-11	ProphetX	total	0	0
50	DETTOR2025-01-11	ProphetX	spread	0	0
51	DETTOR2025-01-11	Novig	total	0	0
52	DETTOR2025-01-11	Novig	spread	0	0
53	DETTOR2025-01-11	BetMGM	total	230.5	-105
54	DETTOR2025-01-11	BetMGM	spread	-4.5	-115
55	DETTOR2025-01-11	Bet365	total	230.5	-110
56	DETTOR2025-01-11	Bet365	spread	-4.5	-110
57	DETTOR2025-01-11	FanDuel	total	230.0	-108
58	DETTOR2025-01-11	FanDuel	spread	-4.5	-112
59	DETTOR2025-01-11	DraftKings	total	230.5	-115
60	DETTOR2025-01-11	DraftKings	spread	-5.0	-105
61	MINMEM2025-01-11	ProphetX	total	0	0
62	MINMEM2025-01-11	ProphetX	spread	0	0
63	MINMEM2025-01-11	Novig	total	0	0
64	MINMEM2025-01-11	Novig	spread	0	0
65	MINMEM2025-01-11	BetMGM	total	228.5	-115
66	MINMEM2025-01-11	BetMGM	spread	-1.5	-105
67	MINMEM2025-01-11	Bet365	total	229.0	-110
68	MINMEM2025-01-11	Bet365	spread	-1.0	-110
69	MINMEM2025-01-11	FanDuel	total	228.0	-112
70	MINMEM2025-01-11	FanDuel	spread	-1.5	-108
71	MINMEM2025-01-11	DraftKings	total	228.0	-112
72	MINMEM2025-01-11	DraftKings	spread	-1.0	-108
73	PORMIA2025-01-11	ProphetX	total	0	0
74	PORMIA2025-01-11	ProphetX	spread	0	0
75	PORMIA2025-01-11	Novig	total	0	0
76	PORMIA2025-01-11	Novig	spread	0	0
77	PORMIA2025-01-11	BetMGM	total	216.5	-110
78	PORMIA2025-01-11	BetMGM	spread	-3.5	-110
79	PORMIA2025-01-11	Bet365	total	216.5	-110
80	PORMIA2025-01-11	Bet365	spread	-3.5	-110
81	PORMIA2025-01-11	FanDuel	total	216.5	-112
82	PORMIA2025-01-11	FanDuel	spread	-3.5	-108
83	PORMIA2025-01-11	DraftKings	total	216.5	-112
84	PORMIA2025-01-11	DraftKings	spread	-3.5	-108
217	LALSA2025-01-11	ProphetX	total	0	0
218	LALSA2025-01-11	ProphetX	spread	0	0
219	LALSA2025-01-11	Novig	total	0	0
220	LALSA2025-01-11	Novig	spread	0	0
221	LALSA2025-01-11	BetMGM	total	221.5	-115
222	LALSA2025-01-11	BetMGM	spread	-3.5	-105
223	LALSA2025-01-11	Bet365	total	222.0	-110
224	LALSA2025-01-11	Bet365	spread	-3.0	-110
225	LALSA2025-01-11	FanDuel	total	223.0	-112
226	LALSA2025-01-11	FanDuel	spread	-4.0	-108
227	LALSA2025-01-11	DraftKings	total	222.0	-112
228	LALSA2025-01-11	DraftKings	spread	-3.5	-108
229	LACCHA2025-01-11	ProphetX	total	0	0
230	LACCHA2025-01-11	ProphetX	spread	0	0
231	LACCHA2025-01-11	Novig	total	0	0
232	LACCHA2025-01-11	Novig	spread	0	0
233	LACCHA2025-01-11	BetMGM	total	219.5	-110
234	LACCHA2025-01-11	BetMGM	spread	-9.5	-110
235	LACCHA2025-01-11	Bet365	total	219.0	-110
236	LACCHA2025-01-11	Bet365	spread	-9.5	-110
237	LACCHA2025-01-11	FanDuel	total	217.5	-110
238	LACCHA2025-01-11	FanDuel	spread	-9.5	-110
239	LACCHA2025-01-11	DraftKings	total	219.0	-112
240	LACCHA2025-01-11	DraftKings	spread	-9.5	-108
1	DENBK2025-01-10	ProphetX	total	224.0	-105
2	DENBK2025-01-10	ProphetX	spread	-14.0	-400
3	DENBK2025-01-10	Novig	total	224.5	102
4	DENBK2025-01-10	Novig	spread	-14.5	-115
5	DENBK2025-01-10	BetMGM	total	224.5	-105
6	DENBK2025-01-10	BetMGM	spread	-14.5	-115
7	DENBK2025-01-10	Bet365	total	224.5	-110
8	DENBK2025-01-10	Bet365	spread	-15.0	-110
9	DENBK2025-01-10	FanDuel	total	224.0	-112
10	DENBK2025-01-10	FanDuel	spread	-15.0	-108
11	DENBK2025-01-10	DraftKings	total	224.0	-110
12	DENBK2025-01-10	DraftKings	spread	-15.0	-110
85	PHINO2025-01-10	ProphetX	total	220.0	-103
86	PHINO2025-01-10	ProphetX	spread	-7.5	-105
87	PHINO2025-01-10	Novig	total	218.5	-109
88	PHINO2025-01-10	Novig	spread	-7.5	-102
89	PHINO2025-01-10	BetMGM	total	219.5	-115
90	PHINO2025-01-10	BetMGM	spread	-7.5	-105
91	PHINO2025-01-10	Bet365	total	219.5	-110
92	PHINO2025-01-10	Bet365	spread	-7.0	-110
93	PHINO2025-01-10	FanDuel	total	219.5	-112
94	PHINO2025-01-10	FanDuel	spread	-7.0	-108
95	PHINO2025-01-10	DraftKings	total	219.0	-112
96	PHINO2025-01-10	DraftKings	spread	-7.0	-108
97	ORLMIL2025-01-10	ProphetX	total	211.5	-102
98	ORLMIL2025-01-10	ProphetX	spread	-6.0	-107
99	ORLMIL2025-01-10	Novig	total	212.5	-118
100	ORLMIL2025-01-10	Novig	spread	-5.5	101
101	ORLMIL2025-01-10	BetMGM	total	212.5	-115
102	ORLMIL2025-01-10	BetMGM	spread	-5.5	-105
103	ORLMIL2025-01-10	Bet365	total	212.0	-110
104	ORLMIL2025-01-10	Bet365	spread	-6.0	-110
105	ORLMIL2025-01-10	FanDuel	total	212.0	-106
106	ORLMIL2025-01-10	FanDuel	spread	-6.0	-114
107	ORLMIL2025-01-10	DraftKings	total	212.0	-108
108	ORLMIL2025-01-10	DraftKings	spread	-6.0	-112
109	INDGS2025-01-10	ProphetX	total	222.0	-102
110	INDGS2025-01-10	ProphetX	spread	-10.5	-106
111	INDGS2025-01-10	Novig	total	222.5	-104
112	INDGS2025-01-10	Novig	spread	-10.5	-109
113	INDGS2025-01-10	BetMGM	total	222.5	-105
114	INDGS2025-01-10	BetMGM	spread	-10.5	-115
115	INDGS2025-01-10	Bet365	total	222.5	-110
116	INDGS2025-01-10	Bet365	spread	-11.0	-110
117	INDGS2025-01-10	FanDuel	total	223.0	-112
118	INDGS2025-01-10	FanDuel	spread	-11.0	-108
119	INDGS2025-01-10	DraftKings	total	223.0	-112
120	INDGS2025-01-10	DraftKings	spread	-11.0	-108
121	NYOKC2025-01-10	ProphetX	total	225.0	103
122	NYOKC2025-01-10	ProphetX	spread	-3.0	-111
123	NYOKC2025-01-10	Novig	total	224.5	-111
124	NYOKC2025-01-10	Novig	spread	-2.5	-101
125	NYOKC2025-01-10	BetMGM	total	224.5	-110
126	NYOKC2025-01-10	BetMGM	spread	-2.5	-110
127	NYOKC2025-01-10	Bet365	total	224.5	-110
128	NYOKC2025-01-10	Bet365	spread	-2.5	-110
129	NYOKC2025-01-10	FanDuel	total	224.5	-112
130	NYOKC2025-01-10	FanDuel	spread	-2.5	-108
131	NYOKC2025-01-10	DraftKings	total	224.5	-112
132	NYOKC2025-01-10	DraftKings	spread	-2.5	-108
133	BOSSAC2025-01-10	ProphetX	total	225.0	-108
134	BOSSAC2025-01-10	ProphetX	spread	-12.0	-101
135	BOSSAC2025-01-10	Novig	total	224.5	100
136	BOSSAC2025-01-10	Novig	spread	-11.5	-113
137	BOSSAC2025-01-10	BetMGM	total	226.5	-105
138	BOSSAC2025-01-10	BetMGM	spread	-11.5	-115
139	BOSSAC2025-01-10	Bet365	total	226.5	-115
140	BOSSAC2025-01-10	Bet365	spread	-12.0	-105
141	BOSSAC2025-01-10	FanDuel	total	226.0	-110
142	BOSSAC2025-01-10	FanDuel	spread	-12.0	-110
143	BOSSAC2025-01-10	DraftKings	total	225.5	-112
144	BOSSAC2025-01-10	DraftKings	spread	-12.0	-108
145	CHIWAS2025-01-10	ProphetX	total	243.5	-101
146	CHIWAS2025-01-10	ProphetX	spread	-10.0	-105
147	CHIWAS2025-01-10	Novig	total	244.5	102
148	CHIWAS2025-01-10	Novig	spread	-9.5	-120
149	CHIWAS2025-01-10	BetMGM	total	244.5	-105
150	CHIWAS2025-01-10	BetMGM	spread	-9.5	-115
151	CHIWAS2025-01-10	Bet365	total	244.0	-105
152	CHIWAS2025-01-10	Bet365	spread	-10.0	-115
153	CHIWAS2025-01-10	FanDuel	total	243.5	-110
154	CHIWAS2025-01-10	FanDuel	spread	-10.5	-110
155	CHIWAS2025-01-10	DraftKings	total	244.0	-108
156	CHIWAS2025-01-10	DraftKings	spread	-10.0	-112
325	NYMIL2025-01-11	ProphetX	total	228.0	-116
326	NYMIL2025-01-11	ProphetX	spread	-3.5	-116
327	NYMIL2025-01-11	Novig	total	0	0
328	NYMIL2025-01-11	Novig	spread	0	0
329	NYMIL2025-01-11	BetMGM	total	227.5	-110
330	NYMIL2025-01-11	BetMGM	spread	-3.5	-110
331	NYMIL2025-01-11	Bet365	total	227.0	-110
332	NYMIL2025-01-11	Bet365	spread	-3.5	-110
333	NYMIL2025-01-11	FanDuel	total	227.5	-112
370	WASOKC2025-01-11	FanDuel	spread	-16.5	-110
371	WASOKC2025-01-11	DraftKings	total	229.5	-108
372	WASOKC2025-01-11	DraftKings	spread	-16.5	-112
373	CLEIND2025-01-11	ProphetX	total	238.5	-116
374	CLEIND2025-01-11	ProphetX	spread	-9.5	-116
375	CLEIND2025-01-11	Novig	total	0	0
376	CLEIND2025-01-11	Novig	spread	0	0
377	CLEIND2025-01-11	BetMGM	total	239.5	-115
378	CLEIND2025-01-11	BetMGM	spread	-9.5	-105
379	CLEIND2025-01-11	Bet365	total	239.0	-110
380	CLEIND2025-01-11	Bet365	spread	-9.5	-110
381	CLEIND2025-01-11	FanDuel	total	240.0	-110
382	CLEIND2025-01-11	FanDuel	spread	-9.5	-110
383	CLEIND2025-01-11	DraftKings	total	239.0	-110
384	CLEIND2025-01-11	DraftKings	spread	-9.0	-110
385	ORLPHI2025-01-11	ProphetX	total	205.5	-118
386	ORLPHI2025-01-11	ProphetX	spread	-1.5	-114
387	ORLPHI2025-01-11	Novig	total	0	0
388	ORLPHI2025-01-11	Novig	spread	0	0
389	ORLPHI2025-01-11	BetMGM	total	206.5	-115
390	ORLPHI2025-01-11	BetMGM	spread	-2.5	-105
391	ORLPHI2025-01-11	Bet365	total	206.5	-110
392	ORLPHI2025-01-11	Bet365	spread	-2.0	-110
393	ORLPHI2025-01-11	FanDuel	total	206.5	-112
394	ORLPHI2025-01-11	FanDuel	spread	-2.0	-108
395	ORLPHI2025-01-11	DraftKings	total	206.5	-110
396	ORLPHI2025-01-11	DraftKings	spread	-2.0	-110
397	BOSNO2025-01-11	ProphetX	total	226.5	-117
398	BOSNO2025-01-11	ProphetX	spread	-14.5	-115
399	BOSNO2025-01-11	Novig	total	0	0
400	BOSNO2025-01-11	Novig	spread	0	0
401	BOSNO2025-01-11	BetMGM	total	226.5	-110
402	BOSNO2025-01-11	BetMGM	spread	-14.5	-110
403	BOSNO2025-01-11	Bet365	total	226.5	-110
404	BOSNO2025-01-11	Bet365	spread	-14.5	-110
405	BOSNO2025-01-11	FanDuel	total	226.5	-110
406	BOSNO2025-01-11	FanDuel	spread	-14.5	-110
407	BOSNO2025-01-11	DraftKings	total	226.5	-110
408	BOSNO2025-01-11	DraftKings	spread	-14.5	-110
409	UTABK2025-01-11	ProphetX	total	215.0	-111
410	UTABK2025-01-11	ProphetX	spread	-3.5	-122
411	UTABK2025-01-11	Novig	total	0	0
412	UTABK2025-01-11	Novig	spread	0	0
413	UTABK2025-01-11	BetMGM	total	214.5	-110
414	UTABK2025-01-11	BetMGM	spread	-3.5	-110
415	UTABK2025-01-11	Bet365	total	214.5	-110
416	UTABK2025-01-11	Bet365	spread	-3.0	-110
417	UTABK2025-01-11	FanDuel	total	214.5	-110
418	UTABK2025-01-11	FanDuel	spread	-3.5	-110
419	UTABK2025-01-11	DraftKings	total	214.5	-112
420	UTABK2025-01-11	DraftKings	spread	-3.5	-108
421	PHOCHA2025-01-11	ProphetX	total	0	0
422	PHOCHA2025-01-11	ProphetX	spread	0	0
423	PHOCHA2025-01-11	Novig	total	0	0
424	PHOCHA2025-01-11	Novig	spread	0	0
425	PHOCHA2025-01-11	BetMGM	total	224.5	-115
426	PHOCHA2025-01-11	BetMGM	spread	-7.5	-105
427	PHOCHA2025-01-11	Bet365	total	225.0	-110
428	PHOCHA2025-01-11	Bet365	spread	-7.0	-110
429	PHOCHA2025-01-11	FanDuel	total	223.5	-110
430	PHOCHA2025-01-11	FanDuel	spread	-7.0	-110
431	PHOCHA2025-01-11	DraftKings	total	224.0	-110
432	PHOCHA2025-01-11	DraftKings	spread	-7.0	-110
\.


--
-- Name: leagues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ritvikrallapalli
--

SELECT pg_catalog.setval('public.leagues_id_seq', 56, true);


--
-- Name: odds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ritvikrallapalli
--

SELECT pg_catalog.setval('public.odds_id_seq', 624, true);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: leagues leagues_name_key; Type: CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT leagues_name_key UNIQUE (name);


--
-- Name: leagues leagues_pkey; Type: CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT leagues_pkey PRIMARY KEY (id);


--
-- Name: odds odds_pkey; Type: CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.odds
    ADD CONSTRAINT odds_pkey PRIMARY KEY (id);


--
-- Name: odds unique_odds; Type: CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.odds
    ADD CONSTRAINT unique_odds UNIQUE (game_id, sportsbook, type);


--
-- Name: games games_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(name);


--
-- Name: odds odds_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ritvikrallapalli
--

ALTER TABLE ONLY public.odds
    ADD CONSTRAINT odds_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- PostgreSQL database dump complete
--

