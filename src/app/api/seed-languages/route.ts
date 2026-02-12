import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export const dynamic = 'force-dynamic';

const languages = [
  { isoCode: 'en', name: 'English', flagUrl: 'https://flagsapi.com/GB/flat/64.png' },
  { isoCode: 'es', name: 'Spanish', flagUrl: 'https://flagsapi.com/ES/flat/64.png' },
  { isoCode: 'fr', name: 'French', flagUrl: 'https://flagsapi.com/FR/flat/64.png' },
  { isoCode: 'de', name: 'German', flagUrl: 'https://flagsapi.com/DE/flat/64.png' },
  { isoCode: 'it', name: 'Italian', flagUrl: 'https://flagsapi.com/IT/flat/64.png' },
  { isoCode: 'hi', name: 'Hindi', flagUrl: 'https://flagsapi.com/IN/flat/64.png' },
];

export async function POST() {
  try {
    // Check if languages already exist
    const existingCount = await db.languages.count();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Languages already seeded. Found ${existingCount} languages.`,
        alreadySeeded: true,
      });
    }

    // Seed languages
    const results = [];

    for (const lang of languages) {
      const created = await db.languages.create({
        data: {
          isoCode: lang.isoCode,
          name: lang.name,
          flagUrl: lang.flagUrl,
        },
      });

      results.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${results.length} languages`,
      languages: results,
    });
  } catch (error) {
    console.error('Seed languages error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allLanguages = await db.languages.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      count: allLanguages.length,
      languages: allLanguages,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
