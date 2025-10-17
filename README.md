![CI](https://github.com/Dev-in68/mon-budget-api/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/Dev-in68/mon-budget-api)
![GitHub issues](https://img.shields.io/github/issues/Dev-in68/mon-budget-api)
![GitHub last commit](https://img.shields.io/github/last-commit/Dev-in68/mon-budget-api)

# Mon Budget - Application Complète 

Une application de gestion de budget moderne avec backend NestJS et frontend React.

##  Structure du Projet

Ce dépôt est organisé en monorepo contenant :

`
mon-budget-api/
  src/                 # Backend NestJS
  prisma/             # Schema et migrations base de données
  frontend/           # Application React/Vite
  test/               # Tests backend
  .github/            # CI/CD workflows
  docker-compose.yml  # Configuration Docker
`

##  Démarrage Rapide

### Backend (API NestJS)

`ash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run start:dev

# API disponible sur http://localhost:3000
`

### Frontend (React + Vite)

`ash
# Navigation vers le frontend
cd frontend

# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Application disponible sur http://localhost:5173
`

### Avec Docker (Recommandé)

`ash
# Démarrage de l'ensemble de l'application
docker-compose up -d

# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# Base de données: PostgreSQL sur le port 5432
`

##  Technologies

### Backend
- **NestJS** - Framework Node.js progressif
- **Prisma** - ORM moderne pour TypeScript
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification
- **Docker** - Conteneurisation

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne
- **TailwindCSS** - Framework CSS utilitaire
- **React Router** - Navigation
- **Recharts** - Graphiques et visualisations

##  Fonctionnalités

-  Authentification utilisateur (JWT)
-  Gestion des transactions (revenus/dépenses)
-  Catégorisation des transactions
-  Tableaux de bord avec graphiques
-  Filtres par période et catégorie
-  Interface responsive
-  Mode sombre/clair
-  API REST documentée

##  Tests

### Backend
`ash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
`

### Frontend
`ash
cd frontend

# Tests avec Vitest
npm run test

# Tests en mode watch
npm run test:watch
`

##  Déploiement

### Variables d'environnement

Copiez les fichiers d'exemple et configurez vos variables :

`ash
# Backend
cp .env.example .env

# Frontend
cd frontend
cp .env.example .env
`

### Production

`ash
# Build backend
npm run build

# Build frontend
cd frontend
npm run build
`

##  Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines de contribution.

##  License

MIT - voir [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec  par Dev-in68**
