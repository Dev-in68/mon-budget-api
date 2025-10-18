import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seeding...');

  // Créer un utilisateur de démonstration
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Utilisateur Demo',
      password: hashedPassword,
    },
  });
  console.log('✅ Utilisateur demo créé:', user.email);

  // Créer des catégories
  await prisma.category.deleteMany({ where: { userId: user.id } });
  
  const categoryData = [
    // Revenus
    { name: 'Salaire', type: 'INCOME', userId: user.id },
    { name: 'Freelance', type: 'INCOME', userId: user.id },
    { name: 'Investissements', type: 'INCOME', userId: user.id },
    
    // Dépenses
    { name: 'Alimentation', type: 'EXPENSE', userId: user.id },
    { name: 'Transport', type: 'EXPENSE', userId: user.id },
    { name: 'Logement', type: 'EXPENSE', userId: user.id },
    { name: 'Loisirs', type: 'EXPENSE', userId: user.id },
    { name: 'Santé', type: 'EXPENSE', userId: user.id },
  ];

  for (const cat of categoryData) {
    await prisma.category.create({ data: cat });
  }
  console.log('✅ Catégories créées:', categoryData.length);

  // Récupérer les catégories pour les transactions
  const allCategories = await prisma.category.findMany({
    where: { userId: user.id }
  });

  const incomeCategories = allCategories.filter(c => c.type === 'INCOME');
  const expenseCategories = allCategories.filter(c => c.type === 'EXPENSE');

  // Créer des transactions de démonstration
  const transactions = [];
  const currentDate = new Date();

  // Transactions des 3 derniers mois
  for (let month = 0; month < 3; month++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - month, 15);
    
    // Revenus mensuels
    transactions.push({
      amount: 3500.00,
      date: date,
      note: 'Salaire mensuel',
      userId: user.id,
      categoryId: incomeCategories.find(c => c.name === 'Salaire')?.id || incomeCategories[0].id,
    });

    // Dépenses diverses
    transactions.push(
      {
        amount: -800.00,
        date: new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000),
        note: 'Loyer',
        userId: user.id,
        categoryId: expenseCategories.find(c => c.name === 'Logement')?.id || expenseCategories[0].id,
      },
      {
        amount: -350.00,
        date: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000),
        note: 'Courses alimentaires',
        userId: user.id,
        categoryId: expenseCategories.find(c => c.name === 'Alimentation')?.id || expenseCategories[0].id,
      },
      {
        amount: -120.00,
        date: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
        note: 'Abonnement transport',
        userId: user.id,
        categoryId: expenseCategories.find(c => c.name === 'Transport')?.id || expenseCategories[0].id,
      },
      {
        amount: -80.00,
        date: new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000),
        note: 'Sortie cinéma + restaurant',
        userId: user.id,
        categoryId: expenseCategories.find(c => c.name === 'Loisirs')?.id || expenseCategories[0].id,
      }
    );
  }

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  
  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }
  console.log('✅ Transactions créées:', transactions.length);

  // Créer un budget de démonstration
  const budget = await prisma.budget.upsert({
    where: { 
      year_month_userId: { 
        year: 2025, 
        month: 10,
        userId: user.id 
      } 
    },
    update: {},
    create: {
      year: 2025,
      month: 10,
      limit: 2500.00,
      userId: user.id,
    },
  });
  console.log('✅ Budget créé:', `${budget.year}/${budget.month}`);

  console.log('🎉 Seeding terminé avec succès !');
  console.log('📧 Utilisateur de test: demo@example.com');
  console.log('🔑 Mot de passe: password123');
}
main().finally(() => prisma.$disconnect());
