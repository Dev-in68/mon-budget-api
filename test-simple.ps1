# Test simple des endpoints API
Write-Host "🧪 Test API - Health Check..." -ForegroundColor Cyan

# Attendre que le serveur soit prêt
Start-Sleep -Seconds 3

try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/health" -Method GET
    Write-Host "✅ Health Check OK: $health" -ForegroundColor Green
    
    # Test Register
    Write-Host "📝 Test Register..." -ForegroundColor Yellow
    $registerBody = @{
        name = "Test User"
        email = "test@example.com"
        password = "password123"
    }
    
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body ($registerBody | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Register OK - Token: $($registerResponse.access_token.Substring(0,20))..." -ForegroundColor Green
    
    # Test Login
    Write-Host "🔐 Test Login..." -ForegroundColor Yellow
    $loginBody = @{
        email = "test@example.com"
        password = "password123"
    }
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body ($loginBody | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Login OK - Token: $($loginResponse.access_token.Substring(0,20))..." -ForegroundColor Green
    
    Write-Host "🎉 Tous les tests API réussis !" -ForegroundColor Green

} catch {
    Write-Host "❌ Erreur API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⏰ Le serveur met peut-être du temps à démarrer..." -ForegroundColor Yellow
}