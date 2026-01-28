const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDishesTagTable() {
  try {
    console.log('Creating dishes_tag table...');
    
    // First create the enum if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE public.tag_type AS ENUM (
          'keto', 'vegan', 'vegetarian', 'low_carb', 'sugar_free',
          'low_fat', 'high_protein', 'high_fiber', 'organic',
          'gluten_free', 'lactose_free'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    console.log('✓ Enum created/exists');
    
    // Create the table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.dishes_tag (
        dish_id UUID,
        tag_name public.tag_type NOT NULL,
        PRIMARY KEY (tag_name),
        CONSTRAINT dishes_tag_dish_id_fkey 
          FOREIGN KEY (dish_id) 
          REFERENCES public.dishes(id) 
          ON DELETE CASCADE 
          ON UPDATE NO ACTION
      );
    `);
    
    console.log('✓ Table created');
    console.log('✅ dishes_tag table created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDishesTagTable();
