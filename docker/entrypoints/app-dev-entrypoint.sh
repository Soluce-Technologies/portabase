#!/bin/bash

current_date=$(date +"%Y-%m-%d")
npx zenstack generate
npx prisma migrate dev --name $current_date

npm run dev

exec "$@"