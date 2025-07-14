import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Gérer l'événement
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Vérifier si le don existe déjà
        const existingDonation = await prisma.donation.findUnique({
          where: { stripeSessionId: session.id }
        });

        if (!existingDonation) {
          // Créer le don dans la base de données
          await prisma.donation.create({
            data: {
              stripeSessionId: session.id,
              amount: session.amount_total || 0,
              currency: session.currency || 'eur',
              donorName: session.metadata?.donor_name || null,
              donorEmail: session.customer_email || '',
              isAnonymous: false, // Par défaut, sera mis à jour via l'API
              status: 'completed'
            }
          });

          console.log('Don enregistré avec succès:', session.id);
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du don:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Marquer le don comme échoué s'il existe
        await prisma.donation.updateMany({
          where: { stripeSessionId: expiredSession.id },
          data: { status: 'failed' }
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
      break;

    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  return NextResponse.json({ received: true });
} 