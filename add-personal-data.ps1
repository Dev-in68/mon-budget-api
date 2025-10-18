# Script d'ajout de données personnalisées
Write-Host "=== AJOUT DE DONNEES PERSONNALISEES ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3000/api"
$headers = @{"Content-Type" = "application/json"}

# Login avec utilisateur demo
Write-Host "1. Connexion..." -ForegroundColor Yellow
$loginData = @{
    email = "demo@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $($loginResponse.access_token)"
    }
    Write-Host "   SUCCESS: Connecte" -ForegroundColor Green
} catch {
    Write-Host "   FAILED: Impossible de se connecter" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Ajouter des catégories personnalisées
Write-Host "2. Ajout de categories personnalisees..." -ForegroundColor Yellow

$categories = @(
    @{ name = "Salaire IT"; type = "INCOME" }
    @{ name = "Formation"; type = "EXPENSE" }
    @{ name = "Outils Tech"; type = "EXPENSE" }
    @{ name = "Abonnements"; type = "EXPENSE" }
)

foreach ($cat in $categories) {
    try {
        $catData = $cat | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method POST -Body $catData -Headers $authHeaders
        Write-Host "   + Categorie '$($cat.name)' ajoutee" -ForegroundColor Green
    } catch {
        Write-Host "   - Echec pour '$($cat.name)'" -ForegroundColor Red
    }
}

Write-Host ""

# Ajouter des transactions personnalisées
Write-Host "3. Ajout de transactions personnalisees..." -ForegroundColor Yellow

# Récupérer les catégories pour les IDs
try {
    $allCategories = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $authHeaders
    Write-Host "   Categories disponibles: $($allCategories.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   Impossible de recuperer les categories" -ForegroundColor Red
    $allCategories = @()
}

# Trouver les IDs des catégories
$salaireId = ($allCategories | Where-Object { $_.name -eq "Salaire" }).id
$alimentationId = ($allCategories | Where-Object { $_.name -eq "Alimentation" }).id
$transportId = ($allCategories | Where-Object { $_.name -eq "Transport" }).id

if ($salaireId) {
    # Transaction de salaire
    $salaryTransaction = @{
        description = "Salaire mensuel octobre"
        amount = 3500.00
        type = "INCOME"
        categoryId = $salaireId
        date = "2025-10-01T00:00:00.000Z"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method POST -Body $salaryTransaction -Headers $authHeaders
        Write-Host "   + Transaction salaire ajoutee: 3500 EUR" -ForegroundColor Green
    } catch {
        Write-Host "   - Echec transaction salaire" -ForegroundColor Red
    }
}

if ($alimentationId) {
    # Quelques dépenses alimentaires
    $foodTransactions = @(
        @{ description = "Courses Carrefour"; amount = 85.50; date = "2025-10-15T00:00:00.000Z" }
        @{ description = "Boulangerie"; amount = 12.30; date = "2025-10-16T00:00:00.000Z" }
        @{ description = "Restaurant midi"; amount = 25.00; date = "2025-10-17T00:00:00.000Z" }
    )

    foreach ($food in $foodTransactions) {
        $foodData = @{
            description = $food.description
            amount = $food.amount
            type = "EXPENSE"
            categoryId = $alimentationId
            date = $food.date
        } | ConvertTo-Json

        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method POST -Body $foodData -Headers $authHeaders
            Write-Host "   + Depense '$($food.description)': $($food.amount) EUR" -ForegroundColor Green
        } catch {
            Write-Host "   - Echec '$($food.description)'" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Créer un nouveau budget pour novembre
Write-Host "4. Creation budget novembre..." -ForegroundColor Yellow
$novemberBudget = @{
    month = 11
    year = 2025
    amount = 2500.00
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method POST -Body $novemberBudget -Headers $authHeaders
    Write-Host "   + Budget novembre 2025: 2500 EUR" -ForegroundColor Green
} catch {
    Write-Host "   - Echec creation budget novembre" -ForegroundColor Red
}

Write-Host ""

# Récapitulatif
Write-Host "5. Recapitulatif..." -ForegroundColor Yellow
try {
    $transactions = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method GET -Headers $authHeaders
    $budgets = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method GET -Headers $authHeaders
    
    Write-Host "   Total transactions: $($transactions.Count)" -ForegroundColor Gray
    Write-Host "   Total budgets: $($budgets.Count)" -ForegroundColor Gray
    
    $totalIncome = ($transactions | Where-Object { $_.type -eq "INCOME" } | Measure-Object -Property amount -Sum).Sum
    $totalExpense = ($transactions | Where-Object { $_.type -eq "EXPENSE" } | Measure-Object -Property amount -Sum).Sum
    
    Write-Host "   Total revenus: $totalIncome EUR" -ForegroundColor Green
    Write-Host "   Total depenses: $totalExpense EUR" -ForegroundColor Red
    Write-Host "   Solde: $($totalIncome - $totalExpense) EUR" -ForegroundColor Cyan
} catch {
    Write-Host "   Impossible de calculer le recapitulatif" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DONNEES AJOUTEES AVEC SUCCES ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vous pouvez maintenant:" -ForegroundColor Yellow
Write-Host "- Voir vos donnees sur http://localhost:3000/app.html" -ForegroundColor White
Write-Host "- Ajouter plus de transactions via l'interface" -ForegroundColor White
Write-Host "- Modifier ce script pour vos besoins specifiques" -ForegroundColor White