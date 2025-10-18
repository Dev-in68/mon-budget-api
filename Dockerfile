# Dockerfile optimisé Railway - Build séparé
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx @nestjs/cli build

# Stage Runtime
FROM node:20-alpine

RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE $PORT
ENV NODE_ENV=production

CMD ["sh", "-c", "echo '🚀 STARTING...' && export DATABASE_URL=\"postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}\" && echo '📍 DB:' $DATABASE_URL && npx prisma generate && npx prisma db push --accept-data-loss && echo '✅ READY!' && node dist/src/main.js"]