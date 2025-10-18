# Script de deploiement PowerShell - Mon Budget API
# Utilisation: .\deploy.ps1

Write-Host "Debut du deploiement de Mon Budget API" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

try {
    # 1. Verifications prealables
    Write-Host "1. Verifications prealables..." -ForegroundColor Yellow
    
    # Verifier Node.js
    try {
        $nodeVersion = node --version
        Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Node.js n'est pas installe" -ForegroundColor Red
        exit 1
    }

    # Verifier npm
    try {
        $npmVersion = npm --version
        Write-Host "npm version: $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "npm n'est pas installe" -ForegroundColor Red
        exit 1
    }

    # Verifier Docker
    try {
        $dockerVersion = docker --version
        Write-Host "Docker version: $dockerVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Docker n'est pas installe" -ForegroundColor Red
        exit 1
    }

    # 2. Configuration de l'environnement
    Write-Host "2. Configuration de l'environnement..." -ForegroundColor Yellow
    if (Test-Path ".env.production") {
        Copy-Item ".env.production" ".env" -Force
        Write-Host "Configuration de production chargee" -ForegroundColor Green
    }
    else {
        Write-Host "Fichier .env.production non trouve" -ForegroundColor Yellow
    }

    # 3. Build de l'application
    Write-Host "3. Build de l'application..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Erreur lors du build" }
    Write-Host "Build termine" -ForegroundColor Green

    # 4. Generation du client Prisma
    Write-Host "4. Generation du client Prisma..." -ForegroundColor Yellow
    npx prisma generate
    if ($LASTEXITCODE -ne 0) { throw "Erreur lors de la generation Prisma" }
    Write-Host "Client Prisma genere" -ForegroundColor Green

    # 5. Demarrage des services Docker
    Write-Host "5. Verification des services Docker..." -ForegroundColor Yellow
    docker-compose up -d
    Write-Host "Services Docker demarres" -ForegroundColor Green

    # Attendre que la base de donnees soit prete
    Write-Host "Attente de la base de donnees (10 secondes)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    # 6. Migrations de base de donnees
    Write-Host "6. Application des migrations..." -ForegroundColor Yellow
    npx prisma db push
    Write-Host "Migrations appliquees" -ForegroundColor Green

    # 7. Seed des donnees
    Write-Host "7. Seed des donnees..." -ForegroundColor Yellow
    npm run seed
    Write-Host "Donnees de demonstration creees" -ForegroundColor Green

    # 8. Demarrage de l'application
    Write-Host "8. Demarrage de l'application..." -ForegroundColor Yellow
    
    # Demarrer l'application en arriere-plan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:prod" -WindowStyle Normal
    
    # Attendre un peu pour que l'app demarre
    Start-Sleep -Seconds 8

    # Test de l'API
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
        Write-Host "API operationnelle" -ForegroundColor Green
    }
    catch {
        Write-Host "API en cours de demarrage..." -ForegroundColor Yellow
    }

    Write-Host "=======================================" -ForegroundColor Green
    Write-Host "Deploiement termine !" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Informations d'acces:" -ForegroundColor Cyan
    Write-Host "• Application API: http://localhost:3000/api" -ForegroundColor White
    Write-Host "• Frontend: http://localhost:3000/app.html" -ForegroundColor White
    Write-Host "• Admin Base de donnees: http://localhost:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "Utilisateur de demonstration:" -ForegroundColor Cyan
    Write-Host "• Email: demo@example.com" -ForegroundColor White
    Write-Host "• Mot de passe: password123" -ForegroundColor White

}
catch {
    Write-Host "Erreur lors du deploiement: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}