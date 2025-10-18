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

# Script de démarrage MINIMAL pour test
CMD ["sh", "-c", "echo 'Starting app...' && echo 'DATABASE_URL exists:' && test -n \"$DATABASE_URL\" && echo 'YES' || echo 'NO' && node dist/src/main.js"]