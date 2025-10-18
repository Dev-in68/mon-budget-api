# Script de démarrage pour développement local - Windows PowerShell
Write-Host "🚀 Démarrage de l'environnement de développement Mon Budget API" -ForegroundColor Green

# Vérifier si Docker est en cours d'exécution
try {
    docker info | Out-Null
    Write-Host "✅ Docker est en cours d'exécution" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop." -ForegroundColor Red
    exit 1
}

# Vérifier si .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Le fichier .env.local n'existe pas. Veuillez le créer à partir de .env.example" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Démarrage des containers Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

Write-Host "⏳ Attente que PostgreSQL soit prêt..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "🔄 Génération du client Prisma..." -ForegroundColor Yellow
npm run prisma:generate

Write-Host "🗃️ Application des migrations..." -ForegroundColor Yellow
npm run prisma:dev

Write-Host "✅ Environnement prêt!" -ForegroundColor Green
Write-Host "🌐 API disponible sur: http://localhost" -ForegroundColor Cyan
Write-Host "📊 Base de données: PostgreSQL sur localhost:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛠️ Commandes utiles:" -ForegroundColor Blue
Write-Host "  - Arrêter: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray
Write-Host "  - Logs API: docker logs budget-api-prod -f" -ForegroundColor Gray
Write-Host "  - Logs DB: docker logs budget-postgres-prod -f" -ForegroundColor Gray
Write-Host "  - Prisma Studio: npm run prisma:studio" -ForegroundColor Gray