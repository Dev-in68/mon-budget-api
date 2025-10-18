# Image Node.js Alpine standard (accepter 1 vulnérabilité mineure)
FROM node:20-alpine AS production

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copier les fichiers de package
COPY package.json ./
COPY prisma ./prisma

# Installer toutes les dépendances (prod + dev pour Prisma)
RUN npm install --production=false

# Copier le code source
COPY . .

# Construire l'application directement (sans générer Prisma d'abord)
RUN npx @nestjs/cli build

# Nettoyer les dev dependencies après le build
RUN npm prune --production

# Réinstaller Prisma CLI pour la production
RUN npm install prisma@5.0.0

# Exposer le port
EXPOSE 3000

# Script de démarrage avec Prisma generate
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]