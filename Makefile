DOCKER_COMPOSE := -f docker-compose.yaml

.PHONY: dev dev-down docker-compose-up docker-compose-up-debug docker-compose-down dev-purge migrate migrate-down harvest sleep init docker-migrate docker-harvest

docker-compose-up:
	docker compose ${DOCKER_COMPOSE} up -d

docker-compose-up-debug:
	docker compose ${DOCKER_COMPOSE} up

docker-compose-down:
	docker compose ${DOCKER_COMPOSE} down

dev: docker-compose-up

dev-down: docker-compose-down

dev-purge: ## Stop containers and remove all images
	docker compose ${DOCKER_COMPOSE} down --rmi all

sleep:
	sleep 10

init: dev migrate harvest

migrate:
	docker build -f backend/Dockerfile.dev -t yhangry-tools .
	docker run --rm \
		--network yhangry_default \
		-e DB_HOST=postgres \
		-e DB_NAME=yhangry \
		-e DB_USER=yhangry \
		-e DB_PASSWORD=yhangry \
		-e DB_PORT=5432 \
		yhangry-tools migrate

migrate-down:
	docker build -f backend/Dockerfile.dev -t yhangry-tools .
	docker run --rm \
		--network yhangry_default \
		-e DB_HOST=postgres \
		-e DB_NAME=yhangry \
		-e DB_USER=yhangry \
		-e DB_PASSWORD=yhangry \
		-e DB_PORT=5432 \
		yhangry-tools migrate:down

harvest:
	docker build -f backend/Dockerfile.dev -t yhangry-tools .
	docker run --rm \
		--network yhangry_default \
		-e DB_HOST=postgres \
		-e DB_NAME=yhangry \
		-e DB_USER=yhangry \
		-e DB_PASSWORD=yhangry \
		-e DB_PORT=5432 \
		yhangry-tools harvest
