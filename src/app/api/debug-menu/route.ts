import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'prasad-malegoan-736';

    // Check if menu exists
    const menu = await db.menus.findFirst({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        userId: true,
      },
    });

    // Get total menu count
    const totalMenus = await db.menus.count();

    // Get all slugs
    const allMenus = await db.menus.findMany({
      select: { slug: true, isPublished: true, name: true },
      take: 20,
    });

    return NextResponse.json({
      requestedSlug: slug,
      menu: menu || null,
      found: !!menu,
      published: menu?.isPublished || false,
      totalMenus,
      allMenus,
      databaseConnected: true,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseConnected: false,
    }, { status: 500 });
  }
}
