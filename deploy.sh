#!/bin/bash
# Script de déploiement automatisé - Mon Budget API

echo "🚀 Début du déploiement de Mon Budget API"
echo "========================================"

# 1. Vérifications préalables
echo "📋 1. Vérifications préalables..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi
echo "✅ Node.js version: $(node --version)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi
echo "✅ npm version: $(npm --version)"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi
echo "✅ Docker version: $(docker --version)"

# 2. Installation des dépendances
echo "📦 2. Installation des dépendances..."
npm ci --only=production

# 3. Configuration de l'environnement
echo "⚙️ 3. Configuration de l'environnement..."
if [ -f .env.production ]; then
    cp .env.production .env
    echo "✅ Configuration de production chargée"
else
    echo "⚠️ Fichier .env.production non trouvé, utilisation de .env par défaut"
fi

# 4. Build de l'application
echo "🔨 4. Build de l'application..."
npm run build

# 5. Génération du client Prisma
echo "🗄️ 5. Génération du client Prisma..."
npx prisma generate

# 6. Démarrage des services Docker
echo "🐳 6. Démarrage des services Docker..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# 7. Migrations de base de données
echo "🗄️ 7. Application des migrations..."
npx prisma migrate deploy

# 8. Seed des données (optionnel)
echo "🌱 8. Seed des données..."
npm run seed

# 9. Démarrage de l'application
echo "🚀 9. Démarrage de l'application..."
echo "Application accessible sur http://localhost:3000"
echo "Interface admin DB: http://localhost:8080"
echo "Frontend: http://localhost:3000/app.html"

# 10. Tests de santé
echo "🔍 10. Tests de santé..."
sleep 5

# Test de l'API
if curl -f http://localhost:3000/api/health &> /dev/null; then
    echo "✅ API opérationnelle"
else
    echo "⚠️ API non accessible"
fi

echo "========================================"
echo "🎉 Déploiement terminé !"
echo "========================================"

# Démarrer en mode production
npm run start:prod