#!/bin/bash

npm install -g npm@11.0.0
npm -v


current_date=$(date +"%Y-%m-%d")
npx zenstack generate
npx prisma migrate dev --name $current_date

npm run dev

exec "$@"