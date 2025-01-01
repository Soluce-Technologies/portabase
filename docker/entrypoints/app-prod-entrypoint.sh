#!/bin/bash

npx zenstack generate
npx prisma migrate deploy
node server.js

exec "$@"