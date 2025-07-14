'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiHeart, FiHome, FiLoader } from 'react-icons/fi';

function DonSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentInfo, setPaymentInfo] = useState<{
    status: string;
    amount: number;
    customer_email: string;
    metadata: Record<string, string>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [anonymityUpdated, setAnonymityUpdated] = useState<boolean>(false);

  const fetchPaymentInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/donations?session_id=${sessionId}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentInfo(data);
      } else {
        setError(data.error || 'Erreur lors de la vérification du paiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la vérification du paiement');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchPaymentInfo();
    } else {
      setError('Session de paiement introuvable');
      setLoading(false);
    }
  }, [sessionId, fetchPaymentInfo]);

  const updateAnonymity = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch('/api/donations/anonymity', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          isAnonymous,
          message
        }),
      });

      if (response.ok) {
        setAnonymityUpdated(true);
      } else {
        console.error('Erreur lors de la mise à jour de l\'anonymat');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Erreur</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link href="/" className="btn-primary px-6 py-3 rounded-lg text-white font-semibold">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Étoiles de fond */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 text-xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Gradient de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-black to-black"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-2xl w-full">
          {/* Carte principale */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/50 to-black/50 p-8 md:p-12 rounded-3xl border border-red-500/20 text-center">
            {/* Icône de succès */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30">
              <FiCheck className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent mb-6">
              Merci pour votre don ! 🎉
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Votre générosité nous aide à poursuivre notre mission de retrouver les personnes disparues.
            </p>

            {/* Informations du paiement */}
            {paymentInfo && (
              <div className="bg-gray-900/30 rounded-2xl p-6 mb-8 border border-gray-700/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
                  <FiHeart className="w-6 h-6 text-red-400" />
                  <span>Détails de votre don</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-gray-400 mb-1">Montant</p>
                    <p className="text-2xl font-bold text-white">
                      {paymentInfo.amount ? (paymentInfo.amount / 100).toFixed(2) : '0.00'}€
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 mb-1">Statut</p>
                    <p className="text-green-400 font-semibold">
                      ✅ Paiement confirmé
                    </p>
                  </div>
                  
                  {paymentInfo.customer_email && (
                    <div className="md:col-span-2">
                      <p className="text-gray-400 mb-1">Email de confirmation</p>
                      <p className="text-white">{paymentInfo.customer_email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Option d'anonymat et message */}
            {!anonymityUpdated && (
              <div className="bg-gray-900/30 rounded-2xl p-6 mb-8 border border-gray-700/30">
                <h3 className="text-xl font-bold text-white mb-4">Préférences d&apos;affichage</h3>
                <p className="text-gray-300 mb-6">
                  Personnalisez l&apos;affichage de votre don dans notre liste des donateurs
                </p>
                
                {/* Choix d'anonymat */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Affichage du nom</h4>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="anonymity"
                        checked={!isAnonymous}
                        onChange={() => setIsAnonymous(false)}
                        className="w-4 h-4 text-red-600 bg-gray-900 border-gray-600 focus:ring-red-500"
                      />
                      <span className="text-white">Afficher mon nom</span>
                    </label>
                    
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="anonymity"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(true)}
                        className="w-4 h-4 text-red-600 bg-gray-900 border-gray-600 focus:ring-red-500"
                      />
                      <span className="text-white">Rester anonyme</span>
                    </label>
                  </div>
                </div>

                {/* Message personnalisé */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Message personnalisé (optionnel)</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Ajoutez un message qui apparaîtra avec votre don pour inspirer d&apos;autres personnes
                  </p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: J'espère que mon don aidera à retrouver une personne disparue..."
                    maxLength={150}
                    className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all duration-300 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 text-xs">
                      {message.length}/150 caractères
                    </p>
                    {message.length > 0 && (
                      <button
                        onClick={() => setMessage('')}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors duration-300"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={updateAnonymity}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300"
                >
                  Confirmer mes préférences
                </button>
              </div>
            )}

            {anonymityUpdated && (
              <div className="bg-green-600/10 border border-green-600/20 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-green-400 mb-2">✅ Préférences enregistrées</h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    {isAnonymous 
                      ? 'Votre don apparaîtra comme "Anonyme" dans notre liste des donateurs.'
                      : 'Votre nom apparaîtra dans notre liste des donateurs. Merci pour votre générosité !'
                    }
                  </p>
                  {message && (
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <p className="text-gray-400 text-sm mb-1">Votre message :</p>
                      <p className="text-white italic">&quot;{message}&quot;</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Impact du don */}
            <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-red-400 mb-4">L&apos;impact de votre don</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-400">🔍</span>
                  </div>
                  <p className="text-gray-300">Financement des recherches actives</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-400">👥</span>
                  </div>
                  <p className="text-gray-300">Formation de nos bénévoles</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-400">💙</span>
                  </div>
                  <p className="text-gray-300">Soutien aux familles</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300"
              >
                <FiHome className="w-5 h-5" />
                <span>Retour à l&apos;accueil</span>
              </Link>
              
              <Link 
                href="/alertes"
                className="flex items-center justify-center space-x-2 bg-gray-800/50 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-all duration-300"
              >
                <span>Voir les alertes</span>
              </Link>
            </div>

            <p className="text-gray-400 text-sm mt-8">
              Un reçu de votre don vous sera envoyé par email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    }>
      <DonSuccessContent />
    </Suspense>
  );
} 