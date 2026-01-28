const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const flagMap = {
  'en': 'https://flagsapi.com/GB/flat/64.png',
  'es': 'https://flagsapi.com/ES/flat/64.png',
  'fr': 'https://flagsapi.com/FR/flat/64.png',
  'de': 'https://flagsapi.com/DE/flat/64.png',
  'it': 'https://flagsapi.com/IT/flat/64.png',
  'pt': 'https://flagsapi.com/PT/flat/64.png',
  'ru': 'https://flagsapi.com/RU/flat/64.png',
  'zh': 'https://flagsapi.com/CN/flat/64.png',
  'ja': 'https://flagsapi.com/JP/flat/64.png',
  'ko': 'https://flagsapi.com/KR/flat/64.png',
  'ar': 'https://flagsapi.com/SA/flat/64.png',
  'hi': 'https://flagsapi.com/IN/flat/64.png',
  'tr': 'https://flagsapi.com/TR/flat/64.png',
  'pl': 'https://flagsapi.com/PL/flat/64.png',
  'nl': 'https://flagsapi.com/NL/flat/64.png',
  'sv': 'https://flagsapi.com/SE/flat/64.png',
  'da': 'https://flagsapi.com/DK/flat/64.png',
  'fi': 'https://flagsapi.com/FI/flat/64.png',
  'no': 'https://flagsapi.com/NO/flat/64.png',
  'cs': 'https://flagsapi.com/CZ/flat/64.png',
  'el': 'https://flagsapi.com/GR/flat/64.png',
  'he': 'https://flagsapi.com/IL/flat/64.png',
  'th': 'https://flagsapi.com/TH/flat/64.png',
  'vi': 'https://flagsapi.com/VN/flat/64.png',
  'id': 'https://flagsapi.com/ID/flat/64.png',
  'ms': 'https://flagsapi.com/MY/flat/64.png',
  'ro': 'https://flagsapi.com/RO/flat/64.png',
  'hu': 'https://flagsapi.com/HU/flat/64.png',
  'uk': 'https://flagsapi.com/UA/flat/64.png',
  'bg': 'https://flagsapi.com/BG/flat/64.png',
};

async function updateFlags() {
  try {
    console.log('Updating language flag URLs...\n');
    
    for (const [isoCode, flagUrl] of Object.entries(flagMap)) {
      await prisma.languages.updateMany({
        where: { isoCode },
        data: { flagUrl }
      });
      console.log(`✓ Updated ${isoCode} flag`);
    }
    
    console.log('\n✅ All flags updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateFlags();
