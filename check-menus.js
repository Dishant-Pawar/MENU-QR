const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMenus() {
  try {
    console.log('Checking menus in database...\n');
    
    const menus = await prisma.menus.findMany({
      include: {
        menuLanguages: {
          include: {
            languages: true
          }
        }
      }
    });
    
    console.log(`Found ${menus.length} menu(s):`);
    menus.forEach(menu => {
      console.log('\n---');
      console.log('ID:', menu.id);
      console.log('Name:', menu.name);
      console.log('User ID:', menu.userId);
      console.log('Slug:', menu.slug);
      console.log('Published:', menu.isPublished);
      console.log('Languages:', menu.menuLanguages.map(ml => ml.languages.name).join(', '));
    });
    
    if (menus.length === 0) {
      console.log('\n❌ No menus found in database!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenus();
