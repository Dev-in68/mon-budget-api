# ==============================================
# SCRIPT DE MONITORING PRODUCTION
# Mon Budget API - Surveillance continue
# ==============================================

param(
    [int]$IntervalSeconds = 60,
    [switch]$SendAlerts,
    [string]$LogFile = "monitoring.log"
)

Write-Host "📊 MONITORING PRODUCTION - MON BUDGET API" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$composeFile = "docker-compose.prod.yml"
$healthUrl = "http://localhost:3000/api/health"
$alertThresholds = @{
    CpuUsage = 80
    MemoryUsage = 85
    DiskUsage = 90
    ResponseTime = 5000  # ms
}

# Fonction de log
function Write-MonitorLog {
    param($Message, $Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    $logEntry | Out-File -FilePath $LogFile -Append
}

# Test de santé de l'application
function Test-ApplicationHealth {
    try {
        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10 -UseBasicParsing
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalMilliseconds
        
        return @{
            IsHealthy = ($response.StatusCode -eq 200)
            ResponseTime = $responseTime
            StatusCode = $response.StatusCode
        }
    } catch {
        return @{
            IsHealthy = $false
            ResponseTime = -1
            Error = $_.Exception.Message
        }
    }
}

# Surveillance des containers
function Get-ContainerStats {
    try {
        $containers = docker-compose -f $composeFile ps --services
        $stats = @{}
        
        foreach ($container in $containers) {
            try {
                $containerName = "budget-$(if($container -eq 'app') {'api'} elseif($container -eq 'db') {'mysql'} else {$container})-prod"
                $stat = docker stats $containerName --no-stream --format "table {{.CPUPerc}},{{.MemUsage}},{{.MemPerc}}" 2>$null
                
                if ($stat -and $stat.Length -gt 1) {
                    $values = $stat[1] -split ","
                    $stats[$container] = @{
                        CpuPercent = [float]($values[0] -replace '%','')
                        MemoryUsage = $values[1]
                        MemoryPercent = [float]($values[2] -replace '%','')
                    }
                }
            } catch {
                $stats[$container] = @{ Error = "Stats non disponibles" }
            }
        }
        
        return $stats
    } catch {
        return @{}
    }
}

# Surveillance de l'espace disque
function Get-DiskUsage {
    try {
        $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
        $usedSpace = $disk.Size - $disk.FreeSpace
        $usagePercent = [math]::Round(($usedSpace / $disk.Size) * 100, 2)
        
        return @{
            UsagePercent = $usagePercent
            FreeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
            TotalSpaceGB = [math]::Round($disk.Size / 1GB, 2)
        }
    } catch {
        return @{ Error = "Impossible de récupérer l'usage disque" }
    }
}

# Vérification des logs d'erreur
function Check-ApplicationLogs {
    try {
        $logs = docker-compose -f $composeFile logs --tail=50 app 2>$null
        $errorCount = ($logs | Where-Object { $_ -match "ERROR|FATAL|Exception" }).Count
        $warningCount = ($logs | Where-Object { $_ -match "WARN|WARNING" }).Count
        
        return @{
            ErrorCount = $errorCount
            WarningCount = $warningCount
            HasCriticalErrors = $errorCount -gt 0
        }
    } catch {
        return @{ Error = "Impossible de récupérer les logs" }
    }
}

# Envoi d'alertes (simulation)
function Send-Alert {
    param($Title, $Message, $Severity = "WARNING")
    
    Write-MonitorLog "ALERTE [$Severity] $Title : $Message" "ALERT"
    
    # Ici vous pouvez ajouter l'envoi d'emails, notifications Slack, etc.
    if ($SendAlerts) {
        Write-Host "🚨 ALERTE: $Title" -ForegroundColor Red
        Write-Host "   $Message" -ForegroundColor Yellow
    }
}

# Boucle de monitoring principal
Write-MonitorLog "Démarrage du monitoring (intervalle: $IntervalSeconds secondes)"

try {
    while ($true) {
        Write-Host "`n⏰ $(Get-Date -Format 'HH:mm:ss') - Vérification système..." -ForegroundColor Yellow
        
        # Test de santé
        $health = Test-ApplicationHealth
        if ($health.IsHealthy) {
            Write-Host "✅ Application: OK (${[math]::Round($health.ResponseTime)}ms)" -ForegroundColor Green
        } else {
            Write-Host "❌ Application: ERREUR" -ForegroundColor Red
            Send-Alert "Application non responsive" "L'application ne répond pas au health check"
        }
        
        # Stats des containers
        $containerStats = Get-ContainerStats
        foreach ($container in $containerStats.Keys) {
            $stat = $containerStats[$container]
            if ($stat.Error) {
                Write-Host "⚠️  $container : $($stat.Error)" -ForegroundColor Yellow
            } else {
                $cpuColor = if ($stat.CpuPercent -gt $alertThresholds.CpuUsage) { "Red" } else { "Green" }
                $memColor = if ($stat.MemoryPercent -gt $alertThresholds.MemoryUsage) { "Red" } else { "Green" }
                
                Write-Host "📊 $container : CPU " -NoNewline
                Write-Host "$($stat.CpuPercent)%" -ForegroundColor $cpuColor -NoNewline
                Write-Host " | MEM " -NoNewline  
                Write-Host "$($stat.MemoryPercent)%" -ForegroundColor $memColor
                
                # Alertes sur les seuils
                if ($stat.CpuPercent -gt $alertThresholds.CpuUsage) {
                    Send-Alert "CPU élevé sur $container" "Usage CPU: $($stat.CpuPercent)%"
                }
                if ($stat.MemoryPercent -gt $alertThresholds.MemoryUsage) {
                    Send-Alert "Mémoire élevée sur $container" "Usage mémoire: $($stat.MemoryPercent)%"
                }
            }
        }
        
        # Espace disque
        $disk = Get-DiskUsage
        if ($disk.Error) {
            Write-Host "⚠️  Disque: $($disk.Error)" -ForegroundColor Yellow
        } else {
            $diskColor = if ($disk.UsagePercent -gt $alertThresholds.DiskUsage) { "Red" } else { "Green" }
            Write-Host "💾 Disque: " -NoNewline
            Write-Host "$($disk.UsagePercent)%" -ForegroundColor $diskColor -NoNewline
            Write-Host " (${$disk.FreeSpaceGB}GB libre)"
            
            if ($disk.UsagePercent -gt $alertThresholds.DiskUsage) {
                Send-Alert "Espace disque faible" "Usage: $($disk.UsagePercent)% - Libre: ${$disk.FreeSpaceGB}GB"
            }
        }
        
        # Vérification des logs
        $logCheck = Check-ApplicationLogs
        if ($logCheck.Error) {
            Write-Host "⚠️  Logs: $($logCheck.Error)" -ForegroundColor Yellow
        } else {
            if ($logCheck.HasCriticalErrors) {
                Write-Host "❌ Logs: $($logCheck.ErrorCount) erreurs, $($logCheck.WarningCount) warnings" -ForegroundColor Red
                Send-Alert "Erreurs dans les logs" "$($logCheck.ErrorCount) erreurs détectées"
            } else {
                Write-Host "✅ Logs: Aucune erreur ($($logCheck.WarningCount) warnings)" -ForegroundColor Green
            }
        }
        
        # Attendre avant la prochaine vérification
        Start-Sleep -Seconds $IntervalSeconds
    }
    
} catch {
    Write-MonitorLog "Erreur dans la boucle de monitoring: $($_.Exception.Message)" "ERROR"
} finally {
    Write-MonitorLog "Arrêt du monitoring"
}

Write-Host "`n📊 Monitoring arrêté. Logs sauvegardés dans: $LogFile" -ForegroundColor Cyan