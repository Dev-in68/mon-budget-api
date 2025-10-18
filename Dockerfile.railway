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

# Script de démarrage avec DATABASE_URL construite manuellement
CMD ["sh", "-c", "echo 'Building DATABASE_URL...' && export DATABASE_URL=\"postgresql://$PGUSER:$PGPASSWORD@$PGHOST:$PGPORT/$PGDATABASE\" && echo 'DATABASE_URL:' $DATABASE_URL && node dist/src/main.js"]