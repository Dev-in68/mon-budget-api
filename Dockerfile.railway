# Dockerfile optimisé pour Railway
FROM node:20-alpine

# Installer les dépendances système pour Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./
COPY prisma ./prisma

# Installer TOUTES les dépendances (dev incluses pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application SANS générer Prisma (qui nécessite DATABASE_URL)
RUN npx @nestjs/cli build

# Exposer le port (Railway utilise PORT env variable)
EXPOSE $PORT

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Script de démarrage avec génération Prisma au runtime
CMD ["sh", "-c", "echo 'Runtime setup...' && export DATABASE_URL=\"postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}\" && echo 'DATABASE_URL:' $DATABASE_URL && npx prisma generate && npx prisma db push --accept-data-loss && echo 'Starting app...' && node dist/src/main.js"]