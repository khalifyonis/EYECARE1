import { PrismaClient } from './src/generated/client/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function addYonis() {
  const branch = await prisma.branch.findFirst();
  if (!branch) {
    console.log('No branch found, cannot create user');
    return;
  }
  const passwordHashes = await bcrypt.hash('yonis1862', 10);

  const user = await prisma.user.upsert({
    where: { username: 'yonis' },
    update: { password: passwordHashes },
    create: {
      fullName: 'Yonis Khalif',
      username: 'yonis',
      email: 'yonis@example.com',
      password: passwordHashes,
      role: 'SUPERADMIN',
      branchId: branch.id,
      phone: '123456789'
    }
  });
  console.log('successfully upserted user yonis: ', user.username);
}

addYonis().catch(console.error).finally(() => prisma.$disconnect());
