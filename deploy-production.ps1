# ==============================================
# SCRIPT DEPLOIEMENT PRODUCTION AVANCE
# Mon Budget API - Version Production Complete
# ==============================================

param(
    [switch]$FirstDeploy,
    [switch]$GenerateSecrets,
    [switch]$BackupFirst
)

Write-Host "DEPLOIEMENT PRODUCTION AVANCE" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Fonction de log avec timestamp
function Write-Log {
    param($Message, $Color = "White", $NoNewLine = $false)
    $timestamp = Get-Date -Format "HH:mm:ss"
    if ($NoNewLine) {
        Write-Host "[$timestamp] $Message" -ForegroundColor $Color -NoNewline
    } else {
        Write-Host "[$timestamp] $Message" -ForegroundColor $Color
    }
}

# Génération des secrets sécurisés
if ($GenerateSecrets -or $FirstDeploy) {
    Write-Log "🔐 Génération des secrets sécurisés..." "Yellow"
    
    # Chargement de l'assembly pour générer des mots de passe sécurisés
    Add-Type -AssemblyName System.Web
    
    $jwtSecret = [System.Web.Security.Membership]::GeneratePassword(64, 16)
    $jwtRefreshSecret = [System.Web.Security.Membership]::GeneratePassword(64, 16)
    $mysqlPassword = [System.Web.Security.Membership]::GeneratePassword(32, 8)
    $mysqlRootPassword = [System.Web.Security.Membership]::GeneratePassword(32, 8)
    
    Write-Log "✅ Secrets générés" "Green"
    Write-Log "⚠️  Sauvegardez ces valeurs en lieu sûr!" "Yellow"
    Write-Host ""
    Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor Gray
    Write-Host "JWT_REFRESH_SECRET=$jwtRefreshSecret" -ForegroundColor Gray
    Write-Host "MYSQL_PASSWORD=$mysqlPassword" -ForegroundColor Gray
    Write-Host "MYSQL_ROOT_PASSWORD=$mysqlRootPassword" -ForegroundColor Gray
    Write-Host ""
}

# Vérifications préalables
Write-Log "🔍 Vérification des prérequis..." "Yellow"

# Docker
try {
    $dockerVersion = docker --version 2>$null
    Write-Log "✅ Docker: $dockerVersion" "Green"
} catch {
    Write-Log "❌ Docker non disponible" "Red"
    exit 1
}

# Docker Compose
try {
    $composeVersion = docker-compose --version 2>$null
    Write-Log "✅ Docker Compose: $composeVersion" "Green"
} catch {
    Write-Log "❌ Docker Compose non disponible" "Red"
    exit 1
}

# Fichiers requis
$requiredFiles = @(
    "docker-compose.prod.yml",
    "Dockerfile.prod",
    ".env.production"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Log "✅ $file" "Green"
    } else {
        Write-Log "❌ $file manquant" "Red"
        exit 1
    }
}

# Backup avant déploiement
if ($BackupFirst) {
    Write-Log "💾 Backup des données existantes..." "Yellow"
    try {
        docker-compose -f docker-compose.prod.yml --profile backup run --rm backup
        Write-Log "✅ Backup terminé" "Green"
    } catch {
        Write-Log "⚠️  Aucune donnée à sauvegarder (normal pour premier déploiement)" "Yellow"
    }
}

# Arrêt des services existants
Write-Log "🛑 Arrêt des services existants..." "Yellow"
try {
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    Write-Log "✅ Services arrêtés" "Green"
} catch {
    Write-Log "⚠️  Aucun service à arrêter" "Yellow"
}

# Construction des images
Write-Log "🔨 Construction de l'image production..." "Yellow"
try {
    docker-compose -f docker-compose.prod.yml build --no-cache app
    Write-Log "✅ Image construite" "Green"
} catch {
    Write-Log "❌ Erreur lors de la construction" "Red"
    exit 1
}

# Démarrage des services
Write-Log "🚀 Démarrage des services production..." "Yellow"
try {
    docker-compose -f docker-compose.prod.yml up -d db
    Write-Log "✅ Base de données démarrée" "Green"
    
    # Attendre que MySQL soit prêt
    Write-Log "⏳ Attente de MySQL..." "Yellow"
    $maxWait = 60
    $waited = 0
    
    do {
        Start-Sleep -Seconds 2
        $waited += 2
        try {
            $healthCheck = docker-compose -f docker-compose.prod.yml exec -T db mysqladmin ping -h localhost 2>$null
            if ($healthCheck -like "*alive*") {
                Write-Log "✅ MySQL prêt" "Green"
                break
            }
        } catch {}
        
        if ($waited -ge $maxWait) {
            Write-Log "⚠️  Timeout MySQL - continuons quand même" "Yellow"
            break
        }
    } while ($true)
    
    # Démarrer l'application
    docker-compose -f docker-compose.prod.yml up -d app
    Write-Log "✅ Application démarrée" "Green"
    
} catch {
    Write-Log "❌ Erreur lors du démarrage" "Red"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
}

# Migration de la base de données
Write-Log "🗄️  Application des migrations..." "Yellow"
Start-Sleep -Seconds 10  # Laisser le temps à l'app de démarrer

try {
    docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy
    Write-Log "✅ Migrations appliquées" "Green"
} catch {
    Write-Log "⚠️  Erreur migrations - retry..." "Yellow"
    Start-Sleep -Seconds 5
    try {
        docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy
        Write-Log "✅ Migrations appliquées (retry)" "Green"
    } catch {
        Write-Log "❌ Échec des migrations" "Red"
    }
}

# Test de santé
Write-Log "🏥 Test de santé de l'application..." "Yellow"
$maxRetries = 10
$retryCount = 0

do {
    Start-Sleep -Seconds 3
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Application opérationnelle!" "Green"
            break
        }
    } catch {
        $retryCount++
        Write-Log "⏳ Tentative $retryCount/$maxRetries..." "Yellow"
    }
} while ($retryCount -lt $maxRetries)

if ($retryCount -ge $maxRetries) {
    Write-Log "⚠️  Health check échoué - vérifiez manuellement" "Yellow"
}

# Statut final
Write-Log "📊 Statut du déploiement:" "Cyan"
Write-Host ""

# Containers
Write-Host "🐳 Containers:" -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml ps

Write-Host ""
Write-Host "🌐 URLs d'accès:" -ForegroundColor Cyan
Write-Host "   • Application: http://localhost:3000" -ForegroundColor White
Write-Host "   • Interface:   http://localhost:3000/app.html" -ForegroundColor White  
Write-Host "   • API Health:  http://localhost:3000/api/health" -ForegroundColor White

Write-Host ""
Write-Host "📚 Commandes utiles:" -ForegroundColor Cyan
Write-Host "   • Logs:     docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Gray
Write-Host "   • Restart:  docker-compose -f docker-compose.prod.yml restart" -ForegroundColor Gray
Write-Host "   • Stop:     docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray
Write-Host "   • Backup:   docker-compose -f docker-compose.prod.yml --profile backup run --rm backup" -ForegroundColor Gray

Write-Host ""
Write-Log "🎉 DEPLOIEMENT PRODUCTION TERMINE!" "Green"
Write-Log "Application accessible sur http://localhost:3000" "Cyan"