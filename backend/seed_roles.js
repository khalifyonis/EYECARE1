import { PrismaClient } from './src/generated/client/index.js';
const prisma = new PrismaClient();

async function main() {
    const defaultRoles = [
        'SUPERADMIN',
        'ADMIN',
        'DOCTOR',
        'RECEPTIONIST',
        'OPTICIAN',
        'PHARMACIST'
    ];

    console.log('Seeding CustomRoles...');
    for (const r of defaultRoles) {
        await prisma.customRole.upsert({
            where: { name: r },
            update: { isSystem: true },
            create: { name: r, isSystem: true, description: `System default role: ${r}` }
        });
    }
    console.log('Roles seeded successfully.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
