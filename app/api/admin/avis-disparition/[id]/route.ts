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

    const requestBody = await request.json();
    const { id } = await params;

    // Extraire les champs modifiables
    const { 
      name, 
      lastname, 
      age, 
      taille, 
      poids, 
      departement, 
      city, 
      phone, 
      image, 
      status,
      disparitionDate 
    } = requestBody;

    // Préparer les données à mettre à jour (seulement les champs fournis)
    const updateData: Record<string, unknown> = {};
    
    if (name !== undefined) updateData.name = name;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (age !== undefined) updateData.age = age;
    if (taille !== undefined) updateData.taille = taille;
    if (poids !== undefined) updateData.poids = poids;
    if (departement !== undefined) updateData.departement = parseInt(departement);
    if (city !== undefined) updateData.city = city;
    if (phone !== undefined) updateData.phone = phone;
    if (image !== undefined) updateData.image = image;
    if (disparitionDate !== undefined) updateData.disparitionDate = new Date(disparitionDate);
    
    // Valider le statut s'il est fourni
    if (status !== undefined) {
      const validStatuses = ['lost', 'found'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Statut invalide' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Validation des champs obligatoires si fournis
    if (name !== undefined && !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    if (age !== undefined && (!age || isNaN(parseInt(age)))) {
      return NextResponse.json(
        { error: 'L\'âge doit être un nombre valide' },
        { status: 400 }
      );
    }

    if (departement !== undefined && (!departement || isNaN(parseInt(departement)))) {
      return NextResponse.json(
        { error: 'Le département doit être un nombre valide' },
        { status: 400 }
      );
    }

    if (city !== undefined && !city.trim()) {
      return NextResponse.json(
        { error: 'La ville est requise' },
        { status: 400 }
      );
    }

    // Mettre à jour l'avis
    const updatedAvis = await prisma.avisDisparition.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Avis mis à jour avec succès',
      avis: updatedAvis
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    
    // Gestion des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Avis non trouvé' },
          { status: 404 }
        );
      }
    }
    
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