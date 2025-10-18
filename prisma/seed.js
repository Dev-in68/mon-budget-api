"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'demo@demo.dev' },
        update: {},
        create: {
            email: 'demo@demo.dev',
            name: 'Demo',
            password: '$2b$10$XmJ9t0b1wR8yJ7sV..hashhash',
        },
    });
    await prisma.category.createMany({
        data: [
            { name: 'Salaire', type: 'INCOME', userId: user.id },
            { name: 'Courses', type: 'EXPENSE', userId: user.id },
        ],
        skipDuplicates: true,
    });
}
main().finally(() => prisma.$disconnect());
