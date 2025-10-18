# 🚀 Guide de déploiement Railway

## Prérequis
- Compte GitHub avec votre repo `mon-budget-api`
- Compte Railway (gratuit) : https://railway.app

## Étapes de déploiement

### 1. Créer un compte Railway
- Allez sur https://railway.app
- Connectez-vous avec GitHub
- Autorisez Railway à accéder à vos repos

### 2. Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez "Deploy from GitHub repo"
- Choisissez votre repo `Dev-in68/mon-budget-api`

### 3. Configurer PostgreSQL
- Dans votre projet Railway, cliquez "Add service"
- Sélectionnez "PostgreSQL"
- Railway va créer une base de données automatiquement

### 4. Configurer les variables d'environnement
Dans l'onglet "Variables" de votre service API, ajoutez :

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=votre-secret-jwt-super-securise-changez-moi
JWT_REFRESH_SECRET=votre-refresh-secret-super-securise-aussi
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d
BCRYPT_SALT_ROUNDS=12
NODE_ENV=production
```

### 5. Modifier le schema Prisma pour PostgreSQL
Avant le déploiement, changez dans `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql"  // Changé de "mysql" à "postgresql"
  url      = env("DATABASE_URL")
}
```

### 6. Déployer
- Railway va automatiquement détecter votre `Dockerfile.railway`
- Le build et le déploiement se lancent automatiquement
- Les migrations Prisma s'exécutent au démarrage

### 7. Accéder à votre app
- Railway vous donnera une URL : `https://votre-app.up.railway.app`
- Testez : `https://votre-app.up.railway.app/api/auth/health`

## 🔧 Commandes utiles

### Logs en temps réel
```bash
# Dans Railway dashboard > Service > Logs
```

### Accès à la base de données
```bash
# Dans Railway dashboard > PostgreSQL > Connect
# Obtenez les credentials de connexion
```

### Variables d'environnement
- `${{Postgres.DATABASE_URL}}` - URL auto-générée par Railway
- Utilisez cette syntaxe pour référencer d'autres services

## 🚨 Important

1. **Changez les secrets JWT** en production
2. **Activez CORS** pour votre domaine frontend
3. **Sauvegardez** régulièrement votre base de données
4. **Surveillez** les logs pour les erreurs

## 💰 Coûts
- **Plan Hobby** : 5$/mois après la période d'essai
- **Base de données** : Incluse dans le plan
- **Domaine custom** : Gratuit

Votre app sera accessible 24/7 avec HTTPS automatique ! 🎉