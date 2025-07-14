'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiHeart, FiTrendingUp, FiUsers, FiStar } from 'react-icons/fi';

interface Donation {
  id: string;
  amount: number;
  donorName: string;
  message?: string;
  createdAt: string;
}

export default function DonorsCarousel() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations?public=true');
      const data = await response.json();

      if (response.ok) {
        setDonations(data.donations || []);
      } else {
        setError(data.error || 'Erreur lors du chargement des dons');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des dons');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  // Dupliquer les dons pour un défilement infini
  const duplicatedDonations = donations.length > 0 ? [...donations, ...donations, ...donations] : [];

  if (loading) {
    return (
      <div className="py-16 px-6 bg-gradient-to-br from-gray-900/20 to-black/20">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des dons...</p>
        </div>
      </div>
    );
  }

  if (error || donations.length === 0) {
    return (
      <div className="py-16 px-6 bg-gradient-to-br from-gray-900/20 to-black/20">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30">
            <FiHeart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Soyez le premier à donner !</h3>
          <p className="text-xl text-gray-300 mb-6">Votre générosité apparaîtra ici et inspirera d&apos;autres personnes à nous soutenir.</p>
          <div className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-600/20 rounded-full px-6 py-3">
            <FiStar className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Votre don peut faire la différence</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900/20 to-black/20 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <FiTrendingUp className="w-8 h-8 text-red-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Nos Généreux Donateurs
            </h2>
            <FiUsers className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Rejoignez ces héros qui nous aident à retrouver les personnes disparues
          </p>
          
          {/* Statistiques incitatives */}
          <div className="inline-flex items-center space-x-8 bg-gradient-to-r from-red-600/10 to-red-800/10 border border-red-500/20 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FiHeart className="w-6 h-6 text-red-400" />
                <h4 className="text-3xl font-bold text-white">{donations.length}</h4>
              </div>
              <p className="text-gray-300 font-semibold">Donateur{donations.length > 1 ? 's' : ''}</p>
            </div>
            <div className="w-px h-16 bg-red-500/30"></div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FiTrendingUp className="w-6 h-6 text-red-400" />
                <h4 className="text-3xl font-bold text-white">
                  {formatAmount(donations.reduce((sum, d) => sum + d.amount, 0))}€
                </h4>
              </div>
              <p className="text-gray-300 font-semibold">Collectés</p>
            </div>
            <div className="w-px h-16 bg-red-500/30"></div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FiStar className="w-6 h-6 text-red-400" />
                <h4 className="text-3xl font-bold text-white">∞</h4>
              </div>
              <p className="text-gray-300 font-semibold">Impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* Défilement continu */}
      <div className="relative">
        {/* Gradient de fade sur les côtés */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>
        
        {/* Conteneur de défilement */}
        <div className="flex animate-scroll-left">
          {duplicatedDonations.map((donation, index) => (
            <div 
              key={`${donation.id}-${index}`}
              className="flex-shrink-0 w-80 mx-4"
            >
              <div className="group relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/70 to-black/70 p-6 rounded-2xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
                {/* Badge "Nouveau don" pour les dons récents */}
                {new Date(donation.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    🔥 NOUVEAU
                  </div>
                )}
                
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icône et montant */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow duration-300">
                      <FiHeart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white group-hover:text-red-100 transition-colors duration-300">
                        {formatAmount(donation.amount)}€
                      </p>
                      <p className="text-red-400 text-sm font-semibold">
                        {formatDate(donation.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Nom du donateur */}
                  <div className="text-center mb-4">
                    <p className="text-gray-300 text-sm mb-1">Don de</p>
                    <p className="text-xl font-bold text-white group-hover:text-red-200 transition-colors duration-300">
                      {donation.donorName}
                    </p>
                  </div>

                                     {/* Message personnalisé ou générique */}
                   <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-3 group-hover:bg-red-600/15 transition-colors duration-300">
                     <p className="text-gray-300 text-sm text-center italic">
                       &quot;{donation.message || 'Chaque don nous rapproche de retrouver une personne disparue'}&quot;
                     </p>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="container mx-auto px-6 mt-12 text-center">
        <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6">
          <FiHeart className="w-8 h-8 text-red-400" />
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Rejoignez-les !</h3>
            <p className="text-gray-300">Votre don peut sauver une vie</p>
          </div>
          <div className="w-px h-12 bg-red-500/30"></div>
          <Link href="#dons" className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105">
            Faire un don
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
} 