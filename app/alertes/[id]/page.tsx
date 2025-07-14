'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AvisDisparition {
  id: string;
  name: string;
  lastname?: string;
  age: string;
  taille?: string;
  poids?: string;
  departement: number;
  city: string;
  phone?: string;
  image?: string;
  status: string;
  createdAt: string;
  disparitionDate: string;
}

export default function AlerteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [avis, setAvis] = useState<AvisDisparition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAvis = useCallback(async () => {
    try {
      const response = await fetch(`/api/avis-disparition/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setAvis(data.avis);
      } else {
        setError('Avis de disparition non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'avis:', error);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchAvis();
  }, [fetchAvis]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysSinceDisparition = (disparitionDate: string) => {
    const now = new Date();
    const dispDate = new Date(disparitionDate);
    const diffInDays = Math.floor((now.getTime() - dispDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const getUrgencyLevel = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 3) return { label: 'URGENT', color: 'bg-red-600', textColor: 'text-red-400' };
    if (diffInDays <= 7) return { label: 'RÉCENT', color: 'bg-orange-600', textColor: 'text-orange-400' };
    return { label: 'SUIVI', color: 'bg-yellow-600', textColor: 'text-yellow-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <Link href="/alertes" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <span>←</span>
                <span>Retour aux alertes</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-xl">Chargement de l&apos;alerte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !avis) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <Link href="/alertes" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <span>←</span>
                <span>Retour aux alertes</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Alerte non trouvée</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link href="/alertes" className="btn-primary px-8 py-3 rounded-lg text-white font-semibold">
              Voir toutes les alertes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const urgency = getUrgencyLevel(avis.createdAt);
  const daysSince = getDaysSinceDisparition(avis.disparitionDate);
  const isFound = avis.status === 'found';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/alertes" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <span>←</span>
              <span>Retour aux alertes</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-gradient font-bold">LDA</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Status Banner */}
        <div className={`rounded-2xl p-6 mb-8 border ${
          isFound 
            ? 'bg-green-600/10 border-green-600/20' 
            : 'bg-red-600/10 border-red-600/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold mb-2 ${
                isFound ? 'text-green-400' : 'text-red-400'
              }`}>
                {isFound ? '🎉 Personne retrouvée' : '🚨 Personne recherchée'}
              </h1>
              <p className="text-gray-300">
                {isFound 
                  ? 'Cette personne a été retrouvée saine et sauve' 
                  : 'Cette personne est actuellement portée disparue'
                }
              </p>
            </div>
            {!isFound && (
              <div className={`${urgency.color} text-white px-4 py-2 rounded-full font-semibold`}>
                {urgency.label}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo et informations principales */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-8">
              {/* Photo */}
              <div className="h-80 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
                {avis.image ? (
                  <Image 
                    width={1000}
                    height={1000}  
                    src={avis.image} 
                    alt={`${avis.name} ${avis.lastname}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-8xl mb-4 block">👤</span>
                    <p className="text-gray-400">Aucune photo disponible</p>
                  </div>
                )}
                {isFound && (
                  <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                      RETROUVÉ(E)
                    </div>
                  </div>
                )}
              </div>

              {/* Informations de base */}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {avis.name} {avis.lastname}
                </h2>
                <p className="text-xl text-gray-400 mb-6">{avis.age} ans</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-gray-400">Localisation</span>
                    <span className="text-white font-semibold">{avis.city} ({avis.departement})</span>
                  </div>
                  
                  {avis.taille && (
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-gray-400">Taille</span>
                      <span className="text-white font-semibold">{avis.taille}</span>
                    </div>
                  )}
                  
                  {avis.poids && (
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-gray-400">Poids</span>
                      <span className="text-white font-semibold">{avis.poids}</span>
                    </div>
                  )}

                  {avis.phone && (
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-gray-400">Contact</span>
                      <span className="text-white font-semibold">{avis.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Détails et chronologie */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chronologie */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="text-2xl font-bold text-white mb-6">📅 Chronologie</h3>
              
              <div className="space-y-6">
                {/* Disparition */}
                <div className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Disparition signalée</h4>
                    <p className="text-gray-400 mb-2">{formatDate(avis.disparitionDate)}</p>
                    <p className="text-gray-300">
                      Dernière fois vu(e) à {avis.city} dans le département {avis.departement}
                    </p>
                  </div>
                </div>

                {/* Alerte créée */}
                <div className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Alerte LDA créée</h4>
                    <p className="text-gray-400 mb-2">{formatDateTime(avis.createdAt)}</p>
                    <p className="text-gray-300">
                      Mobilisation des équipes de recherche et diffusion de l&apos;alerte
                    </p>
                  </div>
                </div>

                {/* État actuel */}
                <div className="flex items-start space-x-4">
                  <div className={`w-4 h-4 rounded-full mt-2 flex-shrink-0 ${
                    isFound ? 'bg-green-600' : 'bg-yellow-600'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {isFound ? 'Personne retrouvée' : 'Recherches en cours'}
                    </h4>
                    <p className="text-gray-400 mb-2">
                      {isFound 
                        ? `Retrouvé(e) après ${daysSince} jour${daysSince > 1 ? 's' : ''}`
                        : `${daysSince} jour${daysSince > 1 ? 's' : ''} de recherches`
                      }
                    </p>
                    <p className={`font-semibold ${
                      isFound ? 'text-green-400' : urgency.textColor
                    }`}>
                      {isFound 
                        ? '✅ Personne retrouvée saine et sauve'
                        : `🔍 Recherches actives - Niveau ${urgency.label.toLowerCase()}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            {!isFound && (
              <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">⚠️ Informations importantes</h3>
                
                <div className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Si vous avez des informations</h4>
                    <p className="text-gray-300 mb-4">
                      Toute information, même minime, peut être déterminante. Vous pouvez nous contacter de manière totalement anonyme.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="tel:0800123456" className="btn-primary px-6 py-3 rounded-lg text-white font-semibold text-center">
                        📞 Appeler 0800 123 456
                      </Link>
                      <Link href="/#contact" className="btn-outline px-6 py-3 rounded-lg text-red-500 font-semibold text-center">
                        ✉️ Nous contacter
                      </Link>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Que faire si vous la voyez ?</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• <strong>Ne pas approcher</strong> directement la personne</li>
                      <li>• <strong>Appeler immédiatement</strong> notre ligne d&apos;urgence</li>
                      <li>• <strong>Noter l&apos;heure et le lieu</strong> précis de l&apos;observation</li>
                      <li>• <strong>Rester discret</strong> pour ne pas effrayer la personne</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Message de succès pour les personnes retrouvées */}
            {isFound && (
              <div className="bg-green-600/10 border border-green-600/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-green-400 mb-6">🎉 Succès des recherches</h3>
                
                <div className="bg-background/50 rounded-lg p-6">
                  <p className="text-gray-300 mb-4">
                    Grâce à la mobilisation de tous et aux informations reçues, <strong className="text-white">{avis.name} {avis.lastname}</strong> a pu être retrouvé(e) saine et sauve après <strong className="text-green-400">{daysSince} jour{daysSince > 1 ? 's' : ''}</strong> de recherches.
                  </p>
                  <p className="text-gray-300">
                    Merci à tous ceux qui ont participé aux recherches et partagé l&apos;alerte. Votre aide a été précieuse.
                  </p>
                </div>
              </div>
            )}

            {/* Partage */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="text-2xl font-bold text-white mb-6">📢 Partager cette alerte</h3>
              
              <p className="text-gray-300 mb-6">
                Plus cette alerte sera partagée, plus nous aurons de chances de retrouver cette personne rapidement.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors">
                  Partager sur Facebook
                </button>
                <button className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors">
                  Partager sur Twitter
                </button>
                <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors">
                  Partager sur WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 