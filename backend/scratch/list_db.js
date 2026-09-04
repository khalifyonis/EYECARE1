import { PrismaClient } from './src/generated/client/index.js';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log("Users in DB:");
    console.log(users.map(u => ({ username: u.username, role: u.role, branchId: u.branchId })));
}
main().finally(() => prisma.$disconnect());
