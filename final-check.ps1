# ==============================================
# VERIFICATION FINALE - MON BUDGET API
# ==============================================

Write-Host "🔍 VERIFICATION FINALE DE L'APPLICATION" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$baseUrl = "http://localhost:3000"
$passed = 0
$total = 0

# Fonction de test
function Test-Endpoint {
    param($name, $url, $expectedStatus = 200)
    $global:total++
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        if ($response.StatusCode -eq $expectedStatus) {
            Write-Host "✅ $name" -ForegroundColor Green
            $global:passed++
            return $true
        } else {
            Write-Host "❌ $name (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $name (Erreur: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Tests de base
Write-Host "🌐 Tests de connectivité" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
Test-Endpoint "API Health Check" "$baseUrl/api/health"
Test-Endpoint "Interface Web" "$baseUrl/app.html"
Test-Endpoint "Page d'accueil" "$baseUrl"

Write-Host ""

# Test API avec authentification
Write-Host "🔐 Tests d'authentification" -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow

$total++
try {
    $loginData = @{ email = "demo@example.com"; password = "password123" } | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -Headers @{"Content-Type" = "application/json"}
    
    if ($loginResponse.access_token) {
        Write-Host "✅ Authentification utilisateur" -ForegroundColor Green
        $passed++
        
        # Test avec token
        $total++
        $authHeaders = @{"Authorization" = "Bearer $($loginResponse.access_token)"}
        try {
            $profile = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Headers $authHeaders
            Write-Host "✅ Récupération profil utilisateur" -ForegroundColor Green
            $passed++
        } catch {
            Write-Host "❌ Récupération profil utilisateur" -ForegroundColor Red
        }
        
        # Test budgets
        $total++
        try {
            $budgets = Invoke-RestMethod -Uri "$baseUrl/api/budgets" -Headers $authHeaders
            Write-Host "✅ API Budgets fonctionnelle" -ForegroundColor Green
            $passed++
        } catch {
            Write-Host "❌ API Budgets" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Authentification utilisateur (pas de token)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Authentification utilisateur (erreur réseau)" -ForegroundColor Red
}

Write-Host ""

# Vérification des fichiers
Write-Host "📁 Vérification des fichiers" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow

$files = @(
    @{name="Configuration Docker"; path="docker-compose.yml"}
    @{name="Schema Prisma"; path="prisma/schema.prisma"}
    @{name="Package.json"; path="package.json"}
    @{name="Guide de production"; path="PRODUCTION-GUIDE.md"}
    @{name="Guide de personnalisation"; path="PERSONNALISATION.md"}
    @{name="Script de test"; path="test-api-simple.ps1"}
)

foreach ($file in $files) {
    $total++
    if (Test-Path $file.path) {
        Write-Host "✅ $($file.name)" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ $($file.name)" -ForegroundColor Red
    }
}

Write-Host ""

# Vérification des services
Write-Host "🔧 Vérification des services" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow

# Node.js process
$total++
$nodeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcess) {
    Write-Host "✅ Service Node.js actif" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ Service Node.js" -ForegroundColor Red
}

# Docker containers
$total++
try {
    $containers = docker ps --format "table {{.Names}}" 2>$null
    if ($containers -and $containers.Contains("mon-budget-api-db-1")) {
        Write-Host "✅ Base de données MySQL active" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ Base de données MySQL" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Docker non disponible" -ForegroundColor Red
}

Write-Host ""

# Résumé final
Write-Host "📊 RÉSUMÉ FINAL" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "Tests réussis: $passed/$total" -ForegroundColor $(if ($passed -eq $total) { "Green" } elseif ($passed -gt ($total * 0.8)) { "Yellow" } else { "Red" })

$percentage = [math]::Round(($passed / $total) * 100, 1)
Write-Host "Pourcentage de réussite: $percentage%" -ForegroundColor $(if ($percentage -eq 100) { "Green" } elseif ($percentage -gt 80) { "Yellow" } else { "Red" })

Write-Host ""

if ($percentage -ge 90) {
    Write-Host "🎉 APPLICATION PRÊTE POUR LA PRODUCTION!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Étapes suivantes recommandées:" -ForegroundColor White
    Write-Host "1. Configurer les variables d'environnement de production" -ForegroundColor Gray
    Write-Host "2. Mettre en place SSL/TLS" -ForegroundColor Gray
    Write-Host "3. Configurer les sauvegardes automatiques" -ForegroundColor Gray
    Write-Host "4. Mettre en place le monitoring" -ForegroundColor Gray
} elseif ($percentage -ge 70) {
    Write-Host "⚠️  APPLICATION PRESQUE PRÊTE" -ForegroundColor Yellow
    Write-Host "Vérifiez les erreurs ci-dessus avant la production" -ForegroundColor Yellow
} else {
    Write-Host "❌ APPLICATION NON PRÊTE POUR LA PRODUCTION" -ForegroundColor Red
    Write-Host "Corrigez les erreurs critiques avant de continuer" -ForegroundColor Red
}

Write-Host ""
Write-Host "📖 Documentation disponible:" -ForegroundColor White
Write-Host "   • Guide de production: PRODUCTION-GUIDE.md" -ForegroundColor Gray
Write-Host "   • Guide de personnalisation: PERSONNALISATION.md" -ForegroundColor Gray
Write-Host "   • Interface web: http://localhost:3000/app.html" -ForegroundColor Gray
Write-Host "   • API Health: http://localhost:3000/api/health" -ForegroundColor Gray
Write-Host ""