import { PrismaClient } from './src/generated/client/index.js';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log('Total users DB:', users.length);
    users.forEach(u => console.log(u.username, u.role, u.branchId));
}
main().finally(() => prisma.$disconnect());
