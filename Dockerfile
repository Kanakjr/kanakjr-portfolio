FROM node:20-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Development target (hot reload) ──────────────────────────────
# Usage: docker compose up (mounts source via volumes)
FROM base AS dev
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
# Enable polling so file-change events propagate through Docker volumes
ENV WATCHPACK_POLLING=true
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── Production build ─────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Blog content needed at build time for static generation;
# GOOGLE_API_KEY is only needed at runtime (dynamic API route)
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

# Next.js collects telemetry by default; disable at runtime too
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Blog content needed at runtime for MDX rendering
COPY --from=builder /app/blog ./blog

# Ensure Next.js build output is writable by the non-root user
RUN chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]

