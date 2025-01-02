#!/bin/bash

npx install --save-dev @zenstackhq/openapi


npx zenstack generate
npx prisma migrate deploy
node server.js

exec "$@"