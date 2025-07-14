import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getTokenFromRequest, verifyToken } from '../../../../lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Vérifier l'authentification
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { status } = await request.json();
    const { id } = await params;

    // Valider le statut
    const validStatuses = ['lost', 'found'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour l'avis
    const updatedAvis = await prisma.avisDisparition.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({
      message: 'Statut mis à jour avec succès',
      avis: updatedAvis
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Vérifier l'authentification
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Supprimer l'avis
    await prisma.avisDisparition.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Avis supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 