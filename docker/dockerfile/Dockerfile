FROM node:20-alpine AS base

ENV YARN_VERSION=4.2.2

RUN apk add --no-cache libc6-compat

# install and use yarn 4.x
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}
RUN yarn set version ${YARN_VERSION}


FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS dev

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER root

RUN chmod +x /app/docker/entrypoints/app-dev-entrypoint.sh
ENTRYPOINT ["sh","/app/docker/entrypoints/app-dev-entrypoint.sh"]


# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS prod

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs prisma ./prisma/

USER root

COPY ./docker/entrypoints/app-prod-entrypoint.sh /app/app-prod-entrypoint.sh
RUN chmod +x /app/app-prod-entrypoint.sh

EXPOSE 80

ENV PORT=80

ENV HOSTNAME="0.0.0.0"

USER nextjs

ENTRYPOINT ["sh","/app/app-prod-entrypoint.sh"]
