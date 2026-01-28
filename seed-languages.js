const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const languages = [
  { isoCode: 'en', name: 'English', flagUrl: 'https://flagsapi.com/GB/flat/64.png' },
  { isoCode: 'es', name: 'Spanish', flagUrl: 'https://flagsapi.com/ES/flat/64.png' },
  { isoCode: 'fr', name: 'French', flagUrl: 'https://flagsapi.com/FR/flat/64.png' },
  { isoCode: 'de', name: 'German', flagUrl: 'https://flagsapi.com/DE/flat/64.png' },
  { isoCode: 'it', name: 'Italian', flagUrl: 'https://flagsapi.com/IT/flat/64.png' },
  { isoCode: 'pt', name: 'Portuguese', flagUrl: 'https://flagsapi.com/PT/flat/64.png' },
  { isoCode: 'ru', name: 'Russian', flagUrl: 'https://flagsapi.com/RU/flat/64.png' },
  { isoCode: 'zh', name: 'Chinese', flagUrl: 'https://flagsapi.com/CN/flat/64.png' },
  { isoCode: 'ja', name: 'Japanese', flagUrl: 'https://flagsapi.com/JP/flat/64.png' },
  { isoCode: 'ko', name: 'Korean', flagUrl: 'https://flagsapi.com/KR/flat/64.png' },
  { isoCode: 'ar', name: 'Arabic', flagUrl: 'https://flagsapi.com/SA/flat/64.png' },
  { isoCode: 'hi', name: 'Hindi', flagUrl: 'https://flagsapi.com/IN/flat/64.png' },
  { isoCode: 'tr', name: 'Turkish', flagUrl: 'https://flagsapi.com/TR/flat/64.png' },
  { isoCode: 'pl', name: 'Polish', flagUrl: 'https://flagsapi.com/PL/flat/64.png' },
  { isoCode: 'nl', name: 'Dutch', flagUrl: 'https://flagsapi.com/NL/flat/64.png' },
  { isoCode: 'sv', name: 'Swedish', flagUrl: 'https://flagsapi.com/SE/flat/64.png' },
  { isoCode: 'da', name: 'Danish', flagUrl: 'https://flagsapi.com/DK/flat/64.png' },
  { isoCode: 'fi', name: 'Finnish', flagUrl: 'https://flagsapi.com/FI/flat/64.png' },
  { isoCode: 'no', name: 'Norwegian', flagUrl: 'https://flagsapi.com/NO/flat/64.png' },
  { isoCode: 'cs', name: 'Czech', flagUrl: 'https://flagsapi.com/CZ/flat/64.png' },
  { isoCode: 'el', name: 'Greek', flagUrl: 'https://flagsapi.com/GR/flat/64.png' },
  { isoCode: 'he', name: 'Hebrew', flagUrl: 'https://flagsapi.com/IL/flat/64.png' },
  { isoCode: 'th', name: 'Thai', flagUrl: 'https://flagsapi.com/TH/flat/64.png' },
  { isoCode: 'vi', name: 'Vietnamese', flagUrl: 'https://flagsapi.com/VN/flat/64.png' },
  { isoCode: 'id', name: 'Indonesian', flagUrl: 'https://flagsapi.com/ID/flat/64.png' },
  { isoCode: 'ms', name: 'Malay', flagUrl: 'https://flagsapi.com/MY/flat/64.png' },
  { isoCode: 'ro', name: 'Romanian', flagUrl: 'https://flagsapi.com/RO/flat/64.png' },
  { isoCode: 'hu', name: 'Hungarian', flagUrl: 'https://flagsapi.com/HU/flat/64.png' },
  { isoCode: 'uk', name: 'Ukrainian', flagUrl: 'https://flagsapi.com/UA/flat/64.png' },
  { isoCode: 'bg', name: 'Bulgarian', flagUrl: 'https://flagsapi.com/BG/flat/64.png' },
];

async function seedLanguages() {
  try {
    console.log('Seeding languages...');
    
    for (const lang of languages) {
      const existing = await prisma.languages.findFirst({
        where: { isoCode: lang.isoCode }
      });
      
      if (existing) {
        console.log(`  ✓ ${lang.name} (${lang.isoCode}) already exists`);
        continue;
      }
      
      await prisma.languages.create({
        data: {
          isoCode: lang.isoCode,
          name: lang.name,
          flagUrl: lang.flagUrl,
        }
      });
      
      console.log(`  ✓ Added ${lang.name} (${lang.isoCode})`);
    }
    
    console.log('\n✅ All languages seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedLanguages();
