# ==============================================
# SCRIPT DE SAUVEGARDE AUTOMATISEE  
# Mon Budget API - Backup Production
# ==============================================

param(
    [string]$BackupPath = ".\backups",
    [string]$Action = "backup"
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

function Write-Log {
    param([string]$Message)
    $logMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message"
    Write-Host $logMessage -ForegroundColor Cyan
    Add-Content -Path "backup.log" -Value $logMessage
}

function New-DatabaseBackup {
    $backupFile = "$BackupPath\database_backup_$timestamp.sql"
    
    Write-Log "Demarrage de la sauvegarde de la base de donnees..."
    
    try {
        # Créer le dossier de sauvegarde s'il n'existe pas
        if (!(Test-Path $BackupPath)) {
            New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
            Write-Log "Dossier de sauvegarde cree: $BackupPath"
        }
        
        # Effectuer la sauvegarde
        docker exec budget-mysql-prod mysqldump -u root -p$env:MYSQL_ROOT_PASSWORD --all-databases > $backupFile
        
        if (Test-Path $backupFile) {
            $fileSize = (Get-Item $backupFile).Length
            Write-Log "Sauvegarde de la base de donnees terminee: $backupFile ($fileSize bytes)"
            return $true
        } else {
            Write-Log "ERREUR: Fichier de sauvegarde non cree"
            return $false
        }
    }
    catch {
        Write-Log "ERREUR lors de la sauvegarde: $($_.Exception.Message)"
        return $false
    }
}

function New-ConfigBackup {
    $configBackupPath = "$BackupPath\config_backup_$timestamp"
    
    Write-Log "Sauvegarde des fichiers de configuration..."
    
    try {
        if (!(Test-Path $configBackupPath)) {
            New-Item -ItemType Directory -Path $configBackupPath -Force | Out-Null
        }
        
        # Sauvegarder les fichiers importants
        $filesToBackup = @(
            "docker-compose.prod.yml",
            ".env.production",
            "Dockerfile",
            "nginx\nginx.conf"
        )
        
        foreach ($file in $filesToBackup) {
            if (Test-Path $file) {
                Copy-Item $file -Destination $configBackupPath -Force
                Write-Log "Fichier sauvegarde: $file"
            }
        }
        
        Write-Log "Sauvegarde de configuration terminee: $configBackupPath"
        return $true
    }
    catch {
        Write-Log "ERREUR lors de la sauvegarde config: $($_.Exception.Message)"
        return $false
    }
}

function Remove-OldBackups {
    param([int]$DaysToKeep = 7)
    
    Write-Log "Nettoyage des anciennes sauvegardes (> $DaysToKeep jours)..."
    
    try {
        $cutoffDate = (Get-Date).AddDays(-$DaysToKeep)
        $oldFiles = Get-ChildItem $BackupPath | Where-Object { $_.LastWriteTime -lt $cutoffDate }
        
        foreach ($file in $oldFiles) {
            Remove-Item $file.FullName -Recurse -Force
            Write-Log "Supprime: $($file.Name)"
        }
        
        Write-Log "Nettoyage termine"
    }
    catch {
        Write-Log "ERREUR lors du nettoyage: $($_.Exception.Message)"
    }
}

function Show-BackupStatus {
    Write-Host "=== STATUT DES SAUVEGARDES ===" -ForegroundColor Green
    Write-Host ""
    
    if (Test-Path $BackupPath) {
        $backups = Get-ChildItem $BackupPath | Sort-Object LastWriteTime -Descending | Select-Object -First 10
        
        Write-Host "Dernieres sauvegardes:" -ForegroundColor Yellow
        foreach ($backup in $backups) {
            $size = if ($backup.PSIsContainer) { "Dossier" } else { "$([math]::Round($backup.Length/1MB, 2)) MB" }
            Write-Host "  $($backup.Name) - $($backup.LastWriteTime) - $size" -ForegroundColor White
        }
    } else {
        Write-Host "Aucun dossier de sauvegarde trouve" -ForegroundColor Red
    }
}

# Point d'entree principal
switch ($Action) {
    "backup" {
        Write-Host "=== SAUVEGARDE AUTOMATISEE ===" -ForegroundColor Green
        Write-Host ""
        
        $dbBackup = New-DatabaseBackup
        $configBackup = New-ConfigBackup
        
        if ($dbBackup -and $configBackup) {
            Write-Log "SUCCES: Toutes les sauvegardes sont terminees"
            Remove-OldBackups
        } else {
            Write-Log "ATTENTION: Certaines sauvegardes ont echoue"
        }
    }
    
    "status" {
        Show-BackupStatus
    }
    
    "clean" {
        Remove-OldBackups
    }
    
    default {
        Write-Host "Actions disponibles:" -ForegroundColor Yellow
        Write-Host "  .\backup.ps1 backup   - Effectue une sauvegarde complete" -ForegroundColor White
        Write-Host "  .\backup.ps1 status   - Affiche le statut des sauvegardes" -ForegroundColor White
        Write-Host "  .\backup.ps1 clean    - Nettoie les anciennes sauvegardes" -ForegroundColor White
    }
}