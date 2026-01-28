const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addIsDefaultColumn() {
  try {
    console.log('Adding is_default column to menu_languages table...');
    
    await prisma.$executeRawUnsafe(`
      ALTER TABLE public.menu_languages 
      ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
    `);
    
    console.log('✅ Column added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addIsDefaultColumn();
