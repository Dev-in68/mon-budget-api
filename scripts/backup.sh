#!/bin/bash
# ==============================================
# SCRIPT DE BACKUP AUTOMATIQUE
# Mon Budget API - MySQL Backup
# ==============================================

set -e

# Configuration
DB_NAME="budget_production"
DB_USER="root"
DB_HOST="db"
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/budget_backup_$DATE.sql"
RETENTION_DAYS=7

echo "🗄️  Démarrage du backup MySQL..."
echo "Date: $(date)"
echo "Base: $DB_NAME"
echo "Fichier: $BACKUP_FILE"

# Créer le répertoire de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

# Attendre que MySQL soit prêt
echo "⏳ Attente de MySQL..."
until mysqladmin ping -h "$DB_HOST" -u "$DB_USER" -p"$MYSQL_ROOT_PASSWORD" --silent; do
    echo "MySQL n'est pas encore prêt, attente..."
    sleep 5
done

echo "✅ MySQL est prêt, démarrage du backup..."

# Effectuer le backup
mysqldump -h "$DB_HOST" \
          -u "$DB_USER" \
          -p"$MYSQL_ROOT_PASSWORD" \
          --single-transaction \
          --routines \
          --triggers \
          --events \
          --add-drop-database \
          --databases "$DB_NAME" > "$BACKUP_FILE"

# Vérifier que le backup a réussi
if [ $? -eq 0 ]; then
    echo "✅ Backup réussi: $BACKUP_FILE"
    
    # Compresser le backup
    gzip "$BACKUP_FILE"
    echo "✅ Backup compressé: $BACKUP_FILE.gz"
    
    # Afficher la taille
    BACKUP_SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)
    echo "📊 Taille du backup: $BACKUP_SIZE"
    
else
    echo "❌ Erreur lors du backup"
    exit 1
fi

# Nettoyage des anciens backups
echo "🧹 Nettoyage des backups anciens (>$RETENTION_DAYS jours)..."
find "$BACKUP_DIR" -name "budget_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Lister les backups restants
echo "📋 Backups disponibles:"
ls -lah "$BACKUP_DIR"/budget_backup_*.sql.gz 2>/dev/null || echo "Aucun backup trouvé"

echo "✅ Backup terminé avec succès!"
echo "Date de fin: $(date)"