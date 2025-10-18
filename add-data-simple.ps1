# Script simplifié d'ajout de données
Write-Host "=== AJOUT DE DONNEES SIMPLIFIEES ===" -ForegroundColor Cyan

# Test de base
$baseUrl = "http://localhost:3000/api"

# 1. Login
Write-Host "1. Connexion..." -ForegroundColor Yellow
$loginData = '{"email":"demo@example.com","password":"password123"}'
$loginHeaders = @{"Content-Type" = "application/json"}

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $loginHeaders
    Write-Host "   ✓ Connexion reussie" -ForegroundColor Green
    
    # Extraire le token
    $token = $loginResponse.access_token
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }
    
} catch {
    Write-Host "   ✗ Echec connexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Test profile
Write-Host "2. Test profil utilisateur..." -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method GET -Headers $authHeaders
    Write-Host "   ✓ Profil: $($profile.email)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Echec profil: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test budgets existants
Write-Host "3. Test budgets existants..." -ForegroundColor Yellow
try {
    $budgets = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method GET -Headers $authHeaders
    Write-Host "   ✓ Budgets trouves: $($budgets.Count)" -ForegroundColor Green
    
    if ($budgets.Count -gt 0) {
        foreach ($budget in $budgets) {
            Write-Host "     - $($budget.month)/$($budget.year): $($budget.amount) EUR" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ✗ Echec budgets: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Créer un nouveau budget
Write-Host "4. Creation nouveau budget..." -ForegroundColor Yellow
$newBudget = '{"month":12,"year":2025,"amount":2800.00}'

try {
    $budgetResponse = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method POST -Body $newBudget -Headers $authHeaders
    Write-Host "   ✓ Nouveau budget cree: Decembre 2025 - 2800 EUR" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Echec creation budget: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Lister tous les budgets après ajout
Write-Host "5. Verification finale..." -ForegroundColor Yellow
try {
    $finalBudgets = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method GET -Headers $authHeaders
    Write-Host "   ✓ Total budgets: $($finalBudgets.Count)" -ForegroundColor Green
    
    $totalAmount = ($finalBudgets | Measure-Object -Property amount -Sum).Sum
    Write-Host "   ✓ Montant total planifie: $totalAmount EUR" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ✗ Echec verification: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DONNEES AJOUTEES ===" -ForegroundColor Cyan
Write-Host "Interface web: http://localhost:3000/app.html" -ForegroundColor White