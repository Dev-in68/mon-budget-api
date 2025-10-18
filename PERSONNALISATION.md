# 🔧 Guide de Personnalisation - Mon Budget API

## 📋 Points de personnalisation courants

### 1. **🎨 Personnalisation du Frontend**

#### Couleurs et thème
- **Fichier :** `public/app.html`
- **Variables CSS :** Modifier les couleurs dans la section `<style>`
```css
:root {
    --primary-color: #3b82f6;    /* Bleu principal */
    --success-color: #10b981;    /* Vert succès */
    --danger-color: #ef4444;     /* Rouge erreur */
    --background-color: #f8fafc; /* Arrière-plan */
}
```

#### Logo et titre
- **Ligne 45-50 :** Modifier le titre de l'application
- **Ajouter logo :** Remplacer `💰` par `<img src="logo.png">`

### 2. **📊 Catégories personnalisées**

#### Modifier les catégories par défaut
- **Fichier :** `prisma/seed.ts`
- **Lignes 25-35 :** Modifier le tableau `categoryData`

```typescript
const categoryData = [
    // Vos catégories personnalisées
    { name: 'Salaire Principal', type: 'INCOME', userId: user.id },
    { name: 'Freelance Web', type: 'INCOME', userId: user.id },
    { name: 'Courses Bio', type: 'EXPENSE', userId: user.id },
    { name: 'Transport Public', type: 'EXPENSE', userId: user.id },
    // ... ajoutez vos catégories
];
```

### 3. **💰 Montants et devises**

#### Changer la devise
- **Frontend :** Modifier `formatCurrency()` dans `public/app.html`
```javascript
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD' // Changer en USD, CHF, etc.
    }).format(amount);
}
```

#### Précision des montants
- **Prisma :** Modifier `prisma/schema.prisma`
```prisma
amount Decimal @db.Decimal(10, 2) // 2 décimales par défaut
```

### 4. **🔐 Configuration de sécurité**

#### Changer les clés JWT
- **Fichier :** `.env.production`
```env
JWT_SECRET="votre-nouvelle-cle-super-secrete"
JWT_REFRESH_SECRET="votre-refresh-secret-unique"
```

#### Durée des tokens
```env
JWT_EXPIRES="2h"        # 2 heures au lieu d'1h
JWT_REFRESH_EXPIRES="30d" # 30 jours au lieu de 7
```

### 5. **📧 Notifications et emails**

#### Ajouter un service d'email
1. Installer un package email : `npm install @nestjs-modules/mailer`
2. Configurer dans `src/app.module.ts`
3. Créer un service de notification

### 6. **📱 API personnalisée**

#### Ajouter de nouveaux endpoints
1. **Créer un module :** `nest g module mon-module`
2. **Créer un contrôleur :** `nest g controller mon-module`
3. **Créer un service :** `nest g service mon-module`

#### Exemple d'endpoint personnalisé
```typescript
// Dans votre contrôleur
@Get('statistics')
@UseGuards(JwtAuthGuard)
async getStatistics(@Request() req) {
    // Votre logique personnalisée
    return this.monService.getStatistics(req.user.sub);
}
```

### 7. **🗄️ Base de données**

#### Ajouter de nouveaux champs
1. Modifier `prisma/schema.prisma`
2. Créer une migration : `npm run prisma:dev`
3. Mettre à jour les DTOs correspondants

#### Exemple : Ajouter un champ description aux transactions
```prisma
model Transaction {
    id          Int      @id @default(autoincrement())
    description String?  // Nouveau champ optionnel
    amount      Decimal  @db.Decimal(10, 2)
    // ... autres champs
}
```

### 8. **🎯 Fonctionnalités avancées**

#### Rapports personnalisés
- Créer un module `reports`
- Ajouter des vues pour tableaux de bord
- Intégrer des graphiques (Chart.js)

#### Objectifs d'épargne
- Nouveau modèle Prisma `SavingsGoal`
- Endpoints pour suivi des objectifs
- Interface de progression

#### Notifications Push
- Service Worker pour notifications
- Alertes de budget dépassé
- Rappels de saisie

### 9. **🌐 Déploiement personnalisé**

#### Variables d'environnement spécifiques
```env
# Votre configuration
APP_NAME="Mon Budget Perso"
COMPANY_NAME="Ma Société"
SUPPORT_EMAIL="support@mondomaine.com"
```

#### Docker personnalisé
- Modifier `Dockerfile` pour vos besoins
- Ajouter des volumes persistants
- Configuration SSL/HTTPS

## 🚀 **Commandes utiles après personnalisation**

```bash
# Rebuild après modifications
npm run build

# Nouvelle migration après changement Prisma
npm run prisma:dev

# Re-seed avec nouvelles données
npm run seed

# Tests après modifications
npm run test

# Redémarrage complet
docker-compose down && docker-compose up -d
npm run start:prod
```

---

**💡 Conseil :** Sauvegardez toujours votre base de données avant des modifications importantes !

**🔄 Workflow recommandé :**
1. Modifier en local
2. Tester avec `npm run test`
3. Vérifier avec l'interface web
4. Committer les changements
5. Déployer en production