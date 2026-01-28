const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addNutritionalColumns() {
  try {
    console.log('Adding nutritional columns to dishes table...');
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE public.dishes 
      ADD COLUMN IF NOT EXISTS carbohydrates INTEGER,
      ADD COLUMN IF NOT EXISTS fats INTEGER,
      ADD COLUMN IF NOT EXISTS protein INTEGER,
      ADD COLUMN IF NOT EXISTS calories INTEGER;
    `);
    
    console.log('✅ Columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addNutritionalColumns();
