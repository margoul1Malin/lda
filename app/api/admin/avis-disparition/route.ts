import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

export async function GET(request: Request) {
  try {
    // Vérifier l'authentification
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [avis, total] = await Promise.all([
      prisma.avisDisparition.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.avisDisparition.count({ where })
    ]);

    return NextResponse.json({
      avis,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { name, lastname, age, taille, poids, disparitionDate, departement, city, phone, image, status } = await request.json();

    // Validation des données
    if (!name || !age || !departement || !city) {
      return NextResponse.json(
        { error: 'Nom, âge, département et ville sont requis' },
        { status: 400 }
      );
    }

    const avis = await prisma.avisDisparition.create({
      data: {
        name,
        lastname,
        age,
        taille,
        poids,
        disparitionDate: disparitionDate ? new Date(disparitionDate) : new Date(),
        departement: parseInt(departement),
        city,
        phone,
        image,
        status: status || 'lost'
      }
    });

    return NextResponse.json({
      message: 'Avis de disparition créé avec succès',
      avis
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 