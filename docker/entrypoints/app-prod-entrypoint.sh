!/bin/bash

npx prisma migrate deploy
node server.js

exec "$@"