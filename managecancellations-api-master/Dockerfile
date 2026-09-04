FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8033

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:8033/ || exit 1

# Seed the base admin role/access-rights/admin user (idempotent, no-op if
# they already exist), then start the real server.
CMD ["sh", "-c", "node seeder.js && node server.js"]
