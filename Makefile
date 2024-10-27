.PHONY: start dev
start-dev:
	docker compose -f docker/compose/docker-compose.yml up

.PHONY: down dev volumes
down-dev-volumes:
	docker compose -f docker/compose/docker-compose.yml down --volumes





.PHONY: build dev
build-dev:
	docker compose -f docker/compose/docker-compose.yml build



.PHONY: start local
start-local:
	docker compose -f docker/compose/docker-compose.local.yml up


.PHONY: build local
build-local:
	docker compose -f docker/compose/docker-compose.local.yml build --no-cache backup_agent


.PHONY: start prod
start-prod:
	docker compose -f docker/compose/docker-compose.prod.yml up


