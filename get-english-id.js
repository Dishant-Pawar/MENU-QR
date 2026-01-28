const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getEnglishId() {
  try {
    const english = await prisma.languages.findFirst({
      where: { isoCode: 'en' }
    });
    
    if (english) {
      console.log('English Language ID:', english.id);
      console.log('\nUpdate this in src/server/api/routers/menus.ts:');
      console.log(`export const DEFAULT_LANGUAGE_ID = "${english.id}"; // English`);
    } else {
      console.log('English language not found!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getEnglishId();
