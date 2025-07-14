# LDA - Ligue des Disparus Anonymes

Application web pour aider à retrouver les personnes disparues avec système de dons intégré.

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données
DATABASE_URL="your-mongodb-connection-string"

# Stripe - Clés de paiement
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"

# URL de base (pour les redirections Stripe)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optionnel : Webhook Stripe (requis pour le carousel des donateurs)
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

### Configuration du Webhook Stripe

Pour que le carousel des donateurs fonctionne, vous devez configurer un webhook Stripe :

1. Allez dans votre dashboard Stripe → Webhooks
2. Créez un nouveau webhook avec l'URL : `https://votre-domaine.com/api/webhooks/stripe`
3. Sélectionnez les événements : `checkout.session.completed` et `checkout.session.expired`
4. Copiez le secret du webhook dans votre `.env.local`

### Fonctionnalités des dons

- ✅ Formulaire de dons sécurisé avec Stripe
- ✅ Validation des montants (minimum 1€)
- ✅ Option d'anonymat pour les donateurs
- ✅ Carousel des donateurs sur la page d'accueil
- ✅ Enregistrement automatique des dons via webhook
- ✅ Page de succès avec choix d'anonymat

### Installation

```bash
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
