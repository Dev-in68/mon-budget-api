# Script de test des endpoints API
$baseUrl = "http://localhost:3000/api"

Write-Host "🧪 Test des endpoints API" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. 🏥 Test Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/health" -Method GET -UseBasicParsing
    Write-Host "✅ Health Check: Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Réponse: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Register
Write-Host "`n2. 📝 Test Register..." -ForegroundColor Yellow
$registerData = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $registerData -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Register: Status $($response.StatusCode)" -ForegroundColor Green
    $registerResponse = $response.Content | ConvertFrom-Json
    Write-Host "   Token créé: $($registerResponse.access_token -ne $null)" -ForegroundColor Gray
    $global:token = $registerResponse.access_token
} catch {
    Write-Host "❌ Register échoué: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorContent = $_.Exception.Response.GetResponseStream()
        Write-Host "   Détails: $errorContent" -ForegroundColor Gray
    }
}

# Test 3: Login
Write-Host "`n3. 🔐 Test Login..." -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Login: Status $($response.StatusCode)" -ForegroundColor Green
    $loginResponse = $response.Content | ConvertFrom-Json
    Write-Host "   Token obtenu: $($loginResponse.access_token -ne $null)" -ForegroundColor Gray
    $global:token = $loginResponse.access_token
} catch {
    Write-Host "❌ Login échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: User Profile (protected)
if ($global:token) {
    Write-Host "`n4. 👤 Test User Profile..." -ForegroundColor Yellow
    try {
        $headers = @{ Authorization = "Bearer $global:token" }
        $response = Invoke-WebRequest -Uri "$baseUrl/users/me" -Method GET -Headers $headers -UseBasicParsing
        Write-Host "✅ User Profile: Status $($response.StatusCode)" -ForegroundColor Green
        $userResponse = $response.Content | ConvertFrom-Json
        Write-Host "   Utilisateur: $($userResponse.name) ($($userResponse.email))" -ForegroundColor Gray
    } catch {
        Write-Host "❌ User Profile échoué: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 5: Budgets
    Write-Host "`n5. 💰 Test Budgets..." -ForegroundColor Yellow
    try {
        $headers = @{ Authorization = "Bearer $global:token" }
        $response = Invoke-WebRequest -Uri "$baseUrl/budgets" -Method GET -Headers $headers -UseBasicParsing
        Write-Host "✅ Get Budgets: Status $($response.StatusCode)" -ForegroundColor Green
        $budgetsResponse = $response.Content | ConvertFrom-Json
        Write-Host "   Nombre de budgets: $($budgetsResponse.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Budgets échoué: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Tests terminés !" -ForegroundColor Green