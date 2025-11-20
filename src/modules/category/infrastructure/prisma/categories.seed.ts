import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesData = [
  {
    name: 'نرم‌افزار و اپلیکیشن',
    description: 'نرم‌افزارهای کاربردی و اپلیکیشن‌های موبایل',
  },
  {
    name: 'خدمات آنلاین',
    description: 'خدمات مختلف آنلاین و دیجیتال',
  },
  {
    name: 'کدهای تخفیف',
    description: 'کدهای تخفیف و کوپن‌های خرید',
  },
  {
    name: 'اشتراک‌ها',
    description: 'اشتراک‌های مختلف پلتفرم‌ها',
  },
];

export async function seedCategories() {
  console.log('🌱 Seeding categories...');

  for (const categoryData of categoriesData) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        description: categoryData.description,
      },
    });
  }

  console.log('✅ Categories seeded successfully');
}
