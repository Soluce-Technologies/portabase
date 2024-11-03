#!/bin/bash

current_date=$(date +"%Y-%m-%d")
npx prisma migrate dev --name $current_date
npm run dev

exec "$@"