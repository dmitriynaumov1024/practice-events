# practice-events

**Виробнича практика в НЦ "Фрешкод"** 

&copy; 2023 Дмитро Наумов naumov1024@gmail.com

**My Freshcode practice**

&copy; 2023 Dmitriy Naumov naumov1024@gmail.com


## What even is this?

This is a Event billboard system where users can create events like parties 
or meetings, discover and attend events. Please check `science` directory for 
more info.


## Prerequisites

**database**
- OS Linux / Windows
- postgresql >= 14

**backend & tests**
- OS Linux / Windows
- node >= 18
- npm >= 8


## Usage

**database** 

- create an empty postgresql database

**.env file**

- create back/.env from back/.env.example and configure for your own environment

**backend (setup)**

```bash
cd back
npm install
npm run create-db
npm run seed-db
``` 

**backend (serve)**

```bash
cd back 
npm run serve
# use Ctrl-C to stop server
```

**backend (tests)**

```bash
cd back-test
npm install
npm run test
```

**backend (teardown)**

```bash
cd back
npm run drop-db
```

**frontend (setup)**

```bash
cd front
npm install
```

**frontend (dev server)**

```bash
cd front
npm run dev
# open http://localhost:5000 in your browser
```