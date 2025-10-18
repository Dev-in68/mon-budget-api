# ==============================================
# GUIDE DE DEPLOIEMENT PRODUCTION
# Mon Budget API - Version finale
# ==============================================

## 📋 CHECKLIST PRE-PRODUCTION

### ✅ Sécurité
- [x] JWT secrets configurés
- [x] Authentification Passport
- [x] Validation des données (DTO)
- [x] CORS configuré
- [x] Helmet activé (sécurité headers)
- [x] Hashage des mots de passe (bcrypt)

### ✅ Base de données
- [x] Schema Prisma validé
- [x] Migrations appliquées
- [x] Seed data disponible
- [x] Connexion MySQL sécurisée

### ✅ Application
- [x] Interface web accessible
- [x] API endpoints testés
- [x] Scripts de test fournis
- [x] Documentation complète

## 🔧 CONFIGURATION PRODUCTION

### Variables d'environnement requises
```env
# Base de données
DATABASE_URL="mysql://user:password@host:3306/budgetdb"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
JWT_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Sécurité
BCRYPT_SALT_ROUNDS="12"

# Application
NODE_ENV="production"
PORT="3000"
```

### Configuration Docker Compose (production)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://budget_user:secure_password@db:3306/budget_production
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - db
    restart: unless-stopped
    
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: budget_production
      MYSQL_USER: budget_user
      MYSQL_PASSWORD: secure_password
      MYSQL_ROOT_PASSWORD: root_secure_password
    volumes:
      - budget_data:/var/lib/mysql
      - ./backup:/backup
    ports:
      - "3306:3306"
    restart: unless-stopped
    
volumes:
  budget_data:
```

## 🚀 DEPLOIEMENT

### 1. Préparation
```bash
# Clone du repository
git clone <your-repo>
cd mon-budget-api

# Installation des dépendances
npm ci --only=production

# Build de l'application
npm run build

# Génération Prisma client
npx prisma generate
```

### 2. Base de données
```bash
# Application des migrations
npx prisma migrate deploy

# Seed des données initiales (optionnel)
npm run seed
```

### 3. Démarrage
```bash
# Avec PM2 (recommandé)
npm install -g pm2
pm2 start dist/main.js --name "budget-api"
pm2 startup
pm2 save

# Ou avec Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 MONITORING

### Healthcheck
- URL: `http://your-domain/api/health`
- Réponse: `{"status":"ok","message":"Auth service is running"}`

### Logs
```bash
# Avec PM2
pm2 logs budget-api

# Avec Docker
docker-compose logs -f app
```

### Métriques importantes
- Temps de réponse API
- Nombre de connexions actives
- Utilisation mémoire/CPU
- Erreurs 4xx/5xx

## 🔒 BACKUP

### Script de sauvegarde automatique
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"

# Backup MySQL
docker exec mysql_container mysqldump -u root -p$MYSQL_ROOT_PASSWORD budget_production > $BACKUP_DIR/budget_$DATE.sql

# Nettoyage (garder 7 jours)
find $BACKUP_DIR -name "budget_*.sql" -mtime +7 -delete
```

### Restauration
```bash
# Restaurer depuis backup
docker exec -i mysql_container mysql -u root -p$MYSQL_ROOT_PASSWORD budget_production < /backup/budget_YYYYMMDD_HHMMSS.sql
```

## 🔐 SÉCURITÉ PRODUCTION

### SSL/TLS
- Certificat Let's Encrypt recommandé
- Redirection HTTP → HTTPS
- HSTS headers activés

### Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall
```bash
# UFW (Ubuntu)
ufw allow ssh
ufw allow 80
ufw allow 443
ufw deny 3306  # MySQL uniquement en local
ufw enable
```

## 📋 MAINTENANCE

### Mises à jour
```bash
# Backup avant mise à jour
npm run backup

# Mise à jour du code
git pull origin main
npm ci --only=production
npm run build

# Migrations si nécessaire
npx prisma migrate deploy

# Redémarrage
pm2 restart budget-api
```

### Surveillance des erreurs
- Logs applicatifs : `/var/log/budget-api/`
- Monitoring système : htop, iotop
- Alertes email/SMS pour erreurs critiques

## 🎯 PERFORMANCES

### Optimisations recommandées
- Compression gzip activée
- Cache Redis pour sessions (optionnel)
- Index database optimaux
- Connection pooling MySQL

### Limites recommandées
- Rate limiting : 100 req/min par IP
- Body size max : 1MB
- Timeout requêtes : 30s
- Connection pool : 10-20 connexions

## 📞 SUPPORT

### Contact d'urgence
- Email admin : admin@your-domain.com
- Documentation : https://your-domain.com/docs
- Status page : https://status.your-domain.com

### Procédures d'urgence
1. Vérifier healthcheck
2. Consulter logs PM2/Docker
3. Redémarrer service si nécessaire
4. Escalader si problème persiste

---
**Date de création :** $(Get-Date -Format "yyyy-MM-dd HH:mm")
**Version :** 1.0.0
**Statut :** PRÊT POUR PRODUCTION ✅