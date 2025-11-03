#!/bin/bash

set -euo pipefail

echo "▶ Running Drizzle codegen..."
npx drizzle-kit generate

echo "▶ Applying migrations..."
npx drizzle-kit migrate

echo "▶ Starting Next.js dev server..."
exec npm run dev
