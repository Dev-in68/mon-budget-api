# Test API complet - Mon Budget API
Write-Host "=== TEST API MON BUDGET ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"
$headers = @{"Content-Type" = "application/json"}

# Test 1: Health Check
Write-Host "1. Test Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/health" -Method GET
    Write-Host "   SUCCESS: $($response.status)" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Register
Write-Host "2. Test Register..." -ForegroundColor Yellow
$registerData = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerData -Headers $headers
    Write-Host "   SUCCESS: Utilisateur cree" -ForegroundColor Green
    Write-Host "   ID: $($response.user.id)" -ForegroundColor Gray
    $global:testToken = $response.access_token
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Details: $errorBody" -ForegroundColor Gray
    }
}

Write-Host ""

# Test 3: Login avec utilisateur demo
Write-Host "3. Test Login (utilisateur demo)..." -ForegroundColor Yellow
$loginData = @{
    email = "demo@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers
    Write-Host "   SUCCESS: Login reussi" -ForegroundColor Green
    Write-Host "   User: $($response.user.name)" -ForegroundColor Gray
    $global:demoToken = $response.access_token
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get User Profile
if ($global:demoToken) {
    Write-Host "4. Test Profile utilisateur..." -ForegroundColor Yellow
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:demoToken"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/users/me" -Method GET -Headers $authHeaders
        Write-Host "   SUCCESS: Profile recupere" -ForegroundColor Green
        Write-Host "   User: $($response.name) ($($response.email))" -ForegroundColor Gray
    } catch {
        Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 5: Get Budgets
if ($global:demoToken) {
    Write-Host "5. Test recuperation budgets..." -ForegroundColor Yellow
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $global:demoToken"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method GET -Headers $authHeaders
        Write-Host "   SUCCESS: $($response.Count) budget(s) trouve(s)" -ForegroundColor Green
        if ($response.Count -gt 0) {
            Write-Host "   Premier budget: $($response[0].month)/$($response[0].year)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== TESTS TERMINES ===" -ForegroundColor Cyan