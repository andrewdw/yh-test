# Technical test

![demo](./demo.gif)

## Setup (with Docker)

Requirements:

- [Docker](https://www.docker.com/)

**Running Automatically (preferred):**

1. `make init` - This should start the apps, database, run migration, and harvest the data. The service will then be available at `http://localhost:3030`

_Note: the docker commands inside the Makefile use `docker compose` instead of `docker-compose` which may be incompatible with older versions of docker._

**Running step-by-step**

1. `make dev` or `docker compose -f docker-compose.yaml up -d` will start the frontend, backend and database
2. `make migrate` or `docker build -f backend/Dockerfile.dev -t yhangry-tools .
	docker run --rm \
		--network yhangry_default \
		-e DB_HOST=postgres \
		-e DB_NAME=yhangry \
		-e DB_USER=yhangry \
		-e DB_PASSWORD=yhangry \
		-e DB_PORT=5432 \
		yhangry-tools migrate
`
   will create the database schema
3. `make harvest` or `docker build -f backend/Dockerfile.dev -t yhangry-tools .
docker run --rm \
	--network yhangry_default \
	-e DB_HOST=postgres \
	-e DB_NAME=yhangry \
	-e DB_USER=yhangry \
	-e DB_PASSWORD=yhangry \
	-e DB_PORT=5432 \
	yhangry-tools harvest`
   will fetch data from the stageing endpoint

## Setup (without Docker)

Requirements:

- Node 18 or greater

**Backend**

1. Either start a local Postgres database and edit the `backend/.env` with it's credentials, or start a postgres instance in docker with `docker compose -f docker-compose.yaml up -d postgres`
2. `cd backend` and run `{pnpm|yarn|npm} install`, for example: `pnpm install`
3. `{pnpm|yarn|npm} run migrate` will create the database schema
4. `{pnpm|yarn|npm} run harvest` will fetch all the data from the staging endpoint
5. `{pnpm|yarn|npm} run dev` will start the server
6. The set-menu endpoint will be available at `http://localhost:3031/api/set-menus`

**Frontend**

1. `cd frontend` and run `{pnpm|yarn|npm} install`, for example: `pnpm install`
2. `{pnpm|yarn|npm} run dev` will start the server
3. Front end will be avilable at `http://localhost:3030`

## Some Notes:

- Backend is Express - Fast to setup for a simple endpoint but would likely opt for a more structured project like NestJS in production

- Database is a basic Postgres 15 instance

- No tests - Given more time I'd set up a proper test suite and refactor to allow for proper dependancy injection and mocking

## Bonus Question Notes:

- **How can you optimize the DB for faster querying?**

  - I'd double check that all join columns are indexed properly.
  - We could also add a simple in-memory cache (either locally if or with Redis) to store/serve infrequently changing items (like filter names) and invalidate it maybe every hour or so.

- **How can you improve security and reduce latency?**

  - Regarding security we'd need to introduce a rate limit, similar to the staging service, as well as tightening up the allowed cross-domain origins (currently it's open).
  - The Knex orm will already sanitize sql inputs but we can add some ligcal checks before we try to make db calls, such as rejecting anything over a certain length or anything with non-alphabetic characters

- **Use Redux for state management**
  - Although fantastic, Redux was a bit overkill for this usecase and opted to use a Zustand as a simple state manager
