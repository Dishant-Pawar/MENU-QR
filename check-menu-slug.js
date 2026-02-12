/**
 * Check if a menu slug exists and is published
 * Usage: node check-menu-slug.js prasad-malegoan-736
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMenu() {
  const slug = process.argv[2];
  
  if (!slug) {
    console.error('❌ Please provide a slug as an argument');
    console.log('Usage: node check-menu-slug.js <slug>');
    process.exit(1);
  }

  console.log(`\n🔍 Checking menu with slug: "${slug}"\n`);

  try {
    const menu = await prisma.menu.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        address: true,
        city: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!menu) {
      console.log('❌ Menu NOT FOUND in database\n');
      console.log('📋 Available menu slugs:');
      const allMenus = await prisma.menu.findMany({
        select: { slug: true, name: true, isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      
      if (allMenus.length === 0) {
        console.log('   No menus found in database');
      } else {
        allMenus.forEach((m) => {
          console.log(`   - ${m.slug} | ${m.name} | Published: ${m.isPublished ? '✅' : '❌'}`);
        });
      }
    } else {
      console.log('✅ Menu FOUND:\n');
      console.log(`   ID: ${menu.id}`);
      console.log(`   Name: ${menu.name}`);
      console.log(`   Slug: ${menu.slug}`);
      console.log(`   Published: ${menu.isPublished ? '✅ YES' : '❌ NO'}`);
      console.log(`   Address: ${menu.address || 'N/A'}`);
      console.log(`   City: ${menu.city || 'N/A'}`);
      console.log(`   Created: ${menu.createdAt}`);
      console.log(`   Updated: ${menu.updatedAt}`);
      
      if (!menu.isPublished) {
        console.log('\n⚠️  WARNING: Menu exists but is NOT PUBLISHED');
        console.log('   The menu will return 404 until it is published.');
      } else {
        console.log('\n✅ Menu is published and should be accessible at:');
        console.log(`   https://menu-qr-lovat.vercel.app/menu/${menu.slug}`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking menu:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenu();
