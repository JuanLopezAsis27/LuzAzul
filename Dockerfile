FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm db:generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Isolated Prisma CLI toolchain for `migrate deploy` at deploy time. Installed
# under its own prefix (a clean npm tree) so it does not clash with the
# pnpm-structured node_modules in the Next standalone bundle. When migrate runs
# with `-w /opt/prisma-cli`, `prisma/config` resolves from this directory.
RUN npm install --prefix /opt/prisma-cli prisma@7.8.0
COPY --from=builder /app/prisma /opt/prisma-cli/prisma
COPY --from=builder /app/prisma.config.ts /opt/prisma-cli/prisma.config.ts

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]