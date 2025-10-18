#!/bin/bash
# Script de démarrage pour développement local
echo "🚀 Démarrage de l'environnement de développement Mon Budget API"

# Vérifier si Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
fi

# Vérifier si .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Le fichier .env.local n'existe pas. Veuillez le créer à partir de .env.example"
    exit 1
fi

echo "📦 Démarrage des containers Docker..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Attente que PostgreSQL soit prêt..."
sleep 10

echo "🔄 Génération du client Prisma..."
npm run prisma:generate

echo "🗃️ Application des migrations..."
npm run prisma:dev

echo "✅ Environnement prêt!"
echo "🌐 API disponible sur: http://localhost"
echo "📊 Base de données: PostgreSQL sur localhost:5432"
echo ""
echo "🛠️ Commandes utiles:"
echo "  - Arrêter: docker-compose -f docker-compose.prod.yml down"
echo "  - Logs API: docker logs budget-api-prod -f"
echo "  - Logs DB: docker logs budget-postgres-prod -f"
echo "  - Prisma Studio: npm run prisma:studio"