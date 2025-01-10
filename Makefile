DOCKER_COMPOSE := -f docker-compose.yaml


.PHONY: dev dev-down docker-compose-up docker-compose-up-debug docker-compose-down

docker-compose-up:
	docker compose ${DOCKER_COMPOSE} up -d

docker-compose-up-debug:
	docker compose ${DOCKER_COMPOSE} up

docker-compose-down:
	docker compose ${DOCKER_COMPOSE} down

dev: docker-compose-up

dev-down: docker-compose-down

# debug-postgres: ## Connect to Postgres container shell
# 	docker exec -it postgres-1 /bin/bash


# logs-postgres: ## Stream Postgres container logs
# 	docker logs --follow postgres-1
