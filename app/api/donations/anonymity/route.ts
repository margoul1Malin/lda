import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PATCH(request: Request) {
  try {
    const { sessionId, isAnonymous, message } = await request.json();

    if (!sessionId || typeof isAnonymous !== 'boolean') {
      return NextResponse.json(
        { error: 'Session ID et statut d\'anonymat requis' },
        { status: 400 }
      );
    }

    // Préparer les données à mettre à jour
    const updateData: Record<string, unknown> = { isAnonymous };
    
    // Ajouter le message s'il est fourni
    if (message !== undefined) {
      updateData.message = message.trim() || null;
    }

    // Mettre à jour le statut d'anonymat et le message du don
    const donation = await prisma.donation.update({
      where: { stripeSessionId: sessionId },
      data: updateData
    });

    return NextResponse.json({
      message: 'Préférences mises à jour avec succès',
      donation: {
        id: donation.id,
        isAnonymous: donation.isAnonymous,
        message: donation.message
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
} 