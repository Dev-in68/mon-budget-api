# 🔧 Guide de Test - Application Budget

## ✅ État Actuel du Système

### Backend (NestJS)
- ✅ **Serveur actif** : http://localhost:3000
- ✅ **Base de données** : SQLite configurée
- ✅ **API testée** : Endpoints fonctionnels

### Frontend (React + Vite)  
- ✅ **Serveur actif** : http://localhost:5173
- ✅ **Build** : Sans erreurs de compilation
- ✅ **Interface** : Composant de test API créé

## 🧪 Tests à Effectuer

### 1. Test API Direct (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/health" -Method GET
```
**Résultat attendu** : Status 200 avec message JSON

### 2. Test avec Navigateur Externe
1. Ouvrir un navigateur (Chrome, Firefox, Edge)
2. Aller à : `http://localhost:5173/`
3. Observer l'affichage du test de connexion API

### 3. Test d'Authentification
```powershell
$body = @{ email = "test@example.com"; name = "Test User"; password = "password123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## 🐛 Problème Identifié

Le Simple Browser de VS Code semble bloquer les requêtes cross-origin (CORS) malgré la configuration correcte du backend.

## 🎯 Prochaines Étapes

1. **Tester avec navigateur externe** pour confirmer le fonctionnement
2. **Activer les logs de requêtes** dans le backend si nécessaire
3. **Restaurer l'application complète** une fois la connexion validée

## 📋 Endpoints API Disponibles

- `GET /api/auth/health` - Status de l'API
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/users/me` - Profile utilisateur (protégé)
- `GET/POST /api/budgets` - Gestion des budgets (protégé)

## 🔧 Configuration Technique

- **CORS** : Configuré pour localhost:5173
- **Variables d'environnement** : VITE_API_URL=http://localhost:3000/api
- **Base de données** : SQLite (dev.db)
- **JWT** : Tokens configurés pour l'authentification