FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite embeds these into the built bundle, so they must be present at
# build time, not just at container runtime.
ARG VITE_BASE_URL
ARG VITE_APP_TITLE
ARG VITE_PORT
ENV VITE_BASE_URL=${VITE_BASE_URL} \
    VITE_APP_TITLE=${VITE_APP_TITLE} \
    VITE_PORT=${VITE_PORT}

RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY app.js ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

USER appuser

ARG VITE_PORT=8034
ENV VITE_PORT=${VITE_PORT}
EXPOSE 8034

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:${VITE_PORT}/ || exit 1

CMD ["node", "app.js"]
