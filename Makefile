migrate:
	docker compose run --rm app sh -c "npx prisma migrate dev"