import { PrismaClient } from '@prisma/client';
import { seedCategories } from '@modules/category/infrastructure/prisma/categories.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }

  await seedCategories();

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
