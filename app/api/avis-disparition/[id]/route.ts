import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Récupérer l'avis de disparition spécifique
    const avis = await prisma.avisDisparition.findUnique({
      where: { id }
    });

    if (!avis) {
      return NextResponse.json(
        { error: 'Avis de disparition non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ avis });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 