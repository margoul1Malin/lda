import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: Request) {
  try {
    const { amount, email, name } = await request.json();

    // Validation du montant (minimum 1€ = 100 centimes)
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Le montant minimum est de 1€' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Don pour la Ligue des Disparus Anonymes',
              description: 'Votre don nous aide à retrouver les personnes disparues',
              images: ['https://your-domain.com/logo.png'], // Remplacez par votre logo
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/don-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/#dons`,
      customer_email: email,
      metadata: {
        donor_name: name || 'Anonyme',
        purpose: 'donation',
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du paiement' },
      { status: 500 }
    );
  }
}

// Endpoint pour vérifier le statut d'un paiement ou récupérer les dons publics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const getPublicDonations = searchParams.get('public');

    // Si c'est pour récupérer les dons publics
    if (getPublicDonations === 'true') {
      const donations = await prisma.donation.findMany({
        where: {
          status: 'completed',
          // Inclure tous les dons, on filtrera l'affichage du nom côté client
        },
        select: {
          id: true,
          amount: true,
          donorName: true,
          isAnonymous: true,
          message: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20 // Limiter à 20 dons récents
      });

      return NextResponse.json({
        donations: donations.map((donation: {
          id: string;
          amount: number;
          donorName: string | null;
          isAnonymous: boolean;
          message: string | null;
          createdAt: Date;
        }) => ({
          id: donation.id,
          amount: donation.amount,
          donorName: donation.isAnonymous ? 'Anonyme' : (donation.donorName || 'Anonyme'),
          message: donation.message,
          createdAt: donation.createdAt
        }))
      });
    }

    // Sinon, vérifier le statut d'un paiement spécifique
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID manquant' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,
      amount: session.amount_total,
      customer_email: session.customer_email,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
} 