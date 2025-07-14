'use client';

import { useState } from 'react';
import { FiCreditCard, FiHeart, FiLoader, FiCheck, FiX } from 'react-icons/fi';

interface DonationFormProps {
  className?: string;
}

export default function DonationForm({ className = '' }: DonationFormProps) {
  const [amount, setAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const predefinedAmounts = [20, 50, 100];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
    setError('');
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('L\'email est requis');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      return false;
    }

    if (!amount || amount < 1) {
      setError('Le montant minimum est de 1€');
      return false;
    }

    if (amount < 0) {
      setError('Le montant ne peut pas être négatif');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convertir en centimes
          email: email.trim(),
          name: name.trim() || 'Anonyme',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du traitement du paiement');
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement manquante');
      }

    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du traitement du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-3xl border border-red-500/20 ${className}`}>
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-3xl opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/20">
            <FiHeart className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 text-center">Faire un don</h3>
        <p className="text-gray-400 text-center mb-8">Votre soutien nous aide à sauver des vies</p>

        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg flex items-center space-x-2">
            <FiX className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg flex items-center space-x-2">
            <FiCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Montants prédéfinis */}
          <div>
            <label className="block text-gray-300 font-semibold mb-3">Choisissez un montant</label>
            <div className="grid grid-cols-3 gap-3">
              {predefinedAmounts.map((preAmount) => (
                <button
                  key={preAmount}
                  type="button"
                  onClick={() => handleAmountSelect(preAmount)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    amount === preAmount && !customAmount
                      ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-red-500/10 hover:text-white border border-gray-700/50 hover:border-red-500/30'
                  }`}
                >
                  {preAmount}€
                </button>
              ))}
            </div>
          </div>

          {/* Montant personnalisé */}
          <div>
            <label className="block text-gray-300 font-semibold mb-3">Ou montant personnalisé</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Montant en euros"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all duration-300 pr-12"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">€</span>
            </div>
          </div>

          {/* Informations du donateur */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-3">Email *</label>
              <input
                type="email"
                required
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-3">Nom (optionnel)</label>
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Montant du don :</span>
              <span className="text-2xl font-bold text-white">{amount.toFixed(2)}€</span>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading || !amount || amount < 1}
            className="relative w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            <div className="flex items-center justify-center space-x-2 relative z-10">
              {isLoading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <FiCreditCard className="w-5 h-5" />
                  <span>Faire un don de {amount.toFixed(2)}€</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <p className="text-center text-gray-400 text-sm">
            🔒 Paiement sécurisé par Stripe
          </p>
        </form>
      </div>
    </div>
  );
} 