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

# Script de démarrage simplifié
CMD ["sh", "-c", "echo 'Starting app...' && echo 'DB URL:' $DATABASE_URL && sleep 5 && npx prisma db push --force-reset && echo 'DB ready!' && node dist/src/main.js"]