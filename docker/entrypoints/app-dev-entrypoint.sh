#!/bin/bash

npm install -g npm@11.0.0
npm -v

npx drizzle-kit generate
npx drizzle-kit migrate

npm run dev

exec "$@"