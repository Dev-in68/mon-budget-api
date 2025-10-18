# 🚀 Guide de Déploiement - Mon Budget API

## 📋 Pré-requis pour le déploiement

### ✅ Vérifications préalables
- [x] Application backend fonctionnelle (NestJS)
- [x] Base de données configurée (SQLite pour dev)
- [x] Tests passants (27/27)
- [x] Frontend interactif
- [x] Variables d'environnement configurées

## 🔧 Configuration de production

### 1. Variables d'environnement production
Créer un fichier `.env.production` :
```bash
# Base de données production (MySQL/PostgreSQL)
DATABASE_URL="mysql://user:password@host:port/database"
# ou
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT - IMPORTANT: Changer ces clés en production !
JWT_SECRET="votre-super-secret-jwt-production-très-sécurisé"
JWT_REFRESH_SECRET="votre-super-secret-refresh-production-très-sécurisé"
JWT_EXPIRES="1h"
JWT_REFRESH_EXPIRES="7d"

# Sécurité
BCRYPT_SALT_ROUNDS=12
NODE_ENV="production"
PORT=3000

# CORS (ajuster selon votre domaine)
FRONTEND_URL="https://votre-domaine.com"
```

### 2. Script de build production
```bash
npm run build
npm run prisma:deploy  # Migrations production
```

## 🐳 Déploiement avec Docker

### Option A: Docker simple
```bash
# Build de l'image
docker build -t mon-budget-api .

# Run avec base de données
docker run -p 3000:3000 \
  -e DATABASE_URL="votre-url-db" \
  -e JWT_SECRET="votre-secret" \
  mon-budget-api
```

### Option B: Docker Compose (recommandé)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://monbudget:password@db:3306/monbudget_prod
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: monbudget_prod
      MYSQL_USER: monbudget
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

## ☁️ Déploiement Cloud

### Vercel (Frontend + API)
1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Ajouter un fichier `vercel.json` :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/main.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```

### Heroku
1. Installer Heroku CLI
2. Créer l'application :
```bash
heroku create mon-budget-api
heroku addons:create jawsdb-maria:kitefin  # Base de données MySQL
```

3. Configurer les variables :
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="votre-secret-production"
# La DATABASE_URL sera automatiquement configurée par JawsDB
```

4. Déployer :
```bash
git push heroku main
heroku run npm run prisma:deploy
```

### Railway
1. Connecter le repo à Railway
2. Ajouter une base de données MySQL
3. Configurer les variables d'environnement
4. Déploiement automatique sur push

### DigitalOcean App Platform
1. Créer une nouvelle app depuis GitHub
2. Configurer le build :
   - Build Command: `npm run build`
   - Run Command: `npm run start:prod`
3. Ajouter base de données managée
4. Configurer variables d'environnement

## 🔒 Sécurité en production

### Checklist sécurité
- [ ] JWT secrets forts et uniques
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Helmet.js activé (déjà fait)
- [ ] Rate limiting ajouté
- [ ] Logs de sécurité
- [ ] Variables d'environnement sécurisées

### Ajout du rate limiting
```bash
npm install @nestjs/throttler
```

## 📊 Monitoring

### Logs en production
```typescript
// main.ts
if (process.env.NODE_ENV === 'production') {
  app.useLogger(['error', 'warn']);
}
```

### Health check endpoint
L'endpoint `/api/auth/health` est déjà disponible pour les health checks.

## 🗄️ Base de données production

### Migration vers PostgreSQL/MySQL
1. Changer le provider dans `schema.prisma`
2. Mettre à jour DATABASE_URL
3. Exécuter migrations : `npm run prisma:deploy`

### Backup automatique
Configurer des backups réguliers de la base de données selon votre hébergeur.

## 🚀 Commandes de déploiement rapide

### Déploiement local de test
```bash
npm run build
npm run start:prod
```

### Déploiement Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vérification post-déploiement
```bash
curl https://votre-api.com/api/auth/health
# Devrait retourner: "OK"
```

## 📞 Support

En cas de problème :
1. Vérifier les logs de l'application
2. Tester les endpoints avec Postman
3. Vérifier la connectivité base de données
4. Contrôler les variables d'environnement

---

✅ **Application prête pour le déploiement !**