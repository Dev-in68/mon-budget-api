# ==============================================
# SCRIPT DE MONITORING SIMPLE 
# Mon Budget API - Status Production
# ==============================================

param([string]$Action = "status")

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-ApiHealth {
    try {
        Invoke-RestMethod -Uri "http://localhost:3001/api/auth/health" -TimeoutSec 10 | Out-Null
        return "OK - Status 200"
    }
    catch {
        return "FAILED - $($_.Exception.Message)"
    }
}

switch ($Action) {
    "status" {
        Write-ColorOutput "=== MON BUDGET API - STATUS PRODUCTION ===" "Green"
        Write-Host ""
        
        Write-ColorOutput "API Health:" "Yellow"
        $apiStatus = Test-ApiHealth
        if ($apiStatus -match "OK") {
            Write-ColorOutput "   OK $apiStatus" "Green"
        } else {
            Write-ColorOutput "   ECHEC $apiStatus" "Red"
        }
        Write-Host ""
        
        Write-ColorOutput "Conteneurs:" "Yellow"
        docker ps --filter "name=budget-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        Write-Host ""
        
        Write-ColorOutput "Base de donnees:" "Yellow"
        try {
            docker exec budget-mysql-prod mysqladmin -h localhost -u root ping 2>$null
            Write-ColorOutput "   OK MySQL: Operationnel" "Green"
        }
        catch {
            Write-ColorOutput "   ECHEC MySQL: Erreur" "Red"
        }
    }
    "logs" {
        Write-ColorOutput "Logs recents:" "Yellow"
        Write-ColorOutput "--- API (10 dernieres lignes) ---" "Cyan"
        docker logs budget-api-prod --tail 10
        Write-Host ""
        Write-ColorOutput "--- MySQL (5 dernieres lignes) ---" "Cyan"
        docker logs budget-mysql-prod --tail 5
    }
    "help" {
        Write-ColorOutput "Utilisation:" "Yellow"
        Write-ColorOutput "  .\monitor-simple.ps1 status    - Affiche le statut" "White"
        Write-ColorOutput "  .\monitor-simple.ps1 logs      - Affiche les logs" "White"
        Write-ColorOutput "  .\monitor-simple.ps1 help      - Cette aide" "White"
    }
    default {
        Write-ColorOutput "ECHEC Action inconnue: $Action" "Red"
        Write-ColorOutput "Tapez: .\monitor-simple.ps1 help" "Yellow"
    }
}