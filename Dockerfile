FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install the exact dependency tree from package-lock.json.
FROM base AS dependencies

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci

# Build the Next.js standalone server.
FROM base AS builder

ARG NEXT_PUBLIC_SITE_URL=https://joelbakirel.de
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG GALLERY_BUILD_MODE=validate

RUN if [ "$GALLERY_BUILD_MODE" = "empty" ]; then \
      rm -rf /app/content/gallery; \
    elif [ "$GALLERY_BUILD_MODE" != "validate" ]; then \
      echo "Unsupported GALLERY_BUILD_MODE: $GALLERY_BUILD_MODE" >&2; \
      exit 1; \
    fi \
  && npm run build

# Keep only files required by the production server.
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# The gallery loader resolves this manifest from process.cwd() at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/lib/generated ./lib/generated

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
