import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'lost';

    // Récupérer uniquement les avis de disparition avec le statut demandé
    const avis = await prisma.avisDisparition.findMany({
      where: { status },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ avis });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 