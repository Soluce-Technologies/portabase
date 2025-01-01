#!/bin/bash

npm install -g npm@11.0.0
npm -v



npx zenstack generate
npx prisma migrate deploy
node server.js

exec "$@"