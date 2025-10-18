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

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application
RUN npm run build

# Exposer le port (Railway utilise PORT env variable)
EXPOSE $PORT

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Script de démarrage optimisé pour Railway
CMD ["sh", "-c", "echo 'Starting application...' && echo 'DATABASE_URL:' && echo $DATABASE_URL && npx prisma db push --accept-data-loss && node dist/src/main.js"]