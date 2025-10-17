# Script de test automatisé pour l'API Budget
Write-Host "🧪 TESTS AUTOMATISES - APPLICATION BUDGET" -ForegroundColor Cyan
Write-Host "=" * 50

# Test 1: Health Check
Write-Host "`n1️⃣ Test Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/health" -Method GET
    Write-Host "✅ SUCCES: $($health.message)" -ForegroundColor Green
    Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "❌ ECHEC: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Inscription
Write-Host "`n2️⃣ Test Inscription..." -ForegroundColor Yellow
try {
    $userData = @{
        email = "test-$(Get-Random)@example.com"
        name = "Test User"
        password = "password123"
    } | ConvertTo-Json
    
    $register = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "✅ SUCCES: Utilisateur créé avec token" -ForegroundColor Green
    $token = $register.access
    Write-Host "   Token: $($token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ECHEC: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Login
Write-Host "`n3️⃣ Test Connexion..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ SUCCES: Connexion réussie" -ForegroundColor Green
    Write-Host "   Token reçu: $($login.access.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ECHEC: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Vérification serveurs
Write-Host "`n4️⃣ Vérification des serveurs..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 3
    Write-Host "✅ Frontend accessible (Status: $($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 RESUME:" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Pour tester dans le navigateur: Ouvrir http://localhost:5173/" -ForegroundColor Yellow