const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDishesTagConstraint() {
  console.log('Fixing dishes_tag table constraint...');
  
  try {
    // Drop the existing table and recreate it with correct composite primary key
    await prisma.$executeRawUnsafe(`
      DROP TABLE IF EXISTS public.dishes_tag CASCADE;
    `);
    console.log('✓ Old table dropped');
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE public.dishes_tag (
        dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
        tag_name tag_type NOT NULL,
        PRIMARY KEY (dish_id, tag_name)
      );
    `);
    console.log('✓ Table recreated with composite primary key');
    
    console.log('✅ dishes_tag table fixed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixDishesTagConstraint();
