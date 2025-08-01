#!/bin/bash
#
#npx drizzle-kit generate
#npx drizzle-kit migrate
#
#npm run dev
#
#exec "$@"
set -euo pipefail

echo "▶ Running Drizzle codegen..."
npx drizzle-kit generate

echo "▶ Applying migrations..."
npx drizzle-kit migrate

echo "▶ Starting Next.js dev server..."
exec npm run dev
