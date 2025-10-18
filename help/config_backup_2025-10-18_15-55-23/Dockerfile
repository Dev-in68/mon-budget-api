FROM node:20 AS production

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
RUN echo '#!/bin/sh\necho "Starting application..."\nif [ "$DATABASE_URL" ]; then\n  echo "Generating Prisma client..."\n  npx prisma generate || echo "Prisma generate failed, continuing..."\nfi\nnode dist/src/main.js' > /app/start.sh
RUN chmod +x /app/start.sh

# Commande de démarrage
CMD ["/app/start.sh"]