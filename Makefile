DOCKER_COMPOSE := -f docker-compose.yaml


.PHONY: dev dev-down docker-compose-up docker-compose-up-debug docker-compose-down dev-purge migrate migrate-down harvest sleep init

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

# cd into backend and run
migrate:
	(cd backend && pnpm migrate)

migrate-down:
	(cd backend && pnpm migrate:down)

harvest:
	(cd backend && pnpm harvest)

sleep:
	sleep 10

init: dev sleep migrate sleep harvest


# debug-postgres: ## Connect to Postgres container shell
# 	docker exec -it postgres-1 /bin/bash


# logs-postgres: ## Stream Postgres container logs
# 	docker logs --follow postgres-1
