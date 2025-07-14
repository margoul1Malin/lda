'use client';

import { useState, useEffect } from 'react';
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

export default function AlertesPage() {
  const [avisDisparus, setAvisDisparus] = useState<AvisDisparition[]>([]);
  const [avisRetrouves, setAvisRetrouves] = useState<AvisDisparition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'disparus' | 'retrouves'>('disparus');

  useEffect(() => {
    fetchAllAvis();
  }, []);

  const fetchAllAvis = async () => {
    try {
      const [disparusRes, retrouvesRes] = await Promise.all([
        fetch('/api/avis-disparition?status=lost&limit=100'),
        fetch('/api/avis-disparition?status=found&limit=100')
      ]);

      if (disparusRes.ok) {
        const disparusData = await disparusRes.json();
        setAvisDisparus(disparusData.avis || []);
      }

      if (retrouvesRes.ok) {
        const retrouvesData = await retrouvesRes.json();
        setAvisRetrouves(retrouvesData.avis || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUrgencyLevel = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 3) return { label: 'URGENT', color: 'bg-red-600' };
    if (diffInDays <= 7) return { label: 'RÉCENT', color: 'bg-orange-600' };
    return { label: 'SUIVI', color: 'bg-yellow-600' };
  };

  const getDaysSinceDisparition = (disparitionDate: string) => {
    const now = new Date();
    const dispDate = new Date(disparitionDate);
    const diffInDays = Math.floor((now.getTime() - dispDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">L</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gradient">LDA</h1>
                </Link>
              </div>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-xl">Chargement des alertes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <h1 className="text-2xl font-bold text-gradient">LDA</h1>
              </Link>
            </div>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gradient">Toutes les Alertes</h1>
          <p className="text-xl text-gray-300">Ensemble, nous retrouvons ceux qui ont disparu</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-2xl border border-border text-center">
            <h3 className="text-3xl font-bold text-red-500 mb-2">{avisDisparus.length}</h3>
            <p className="text-gray-300">Personnes recherchées</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border text-center">
            <h3 className="text-3xl font-bold text-green-500 mb-2">{avisRetrouves.length}</h3>
            <p className="text-gray-300">Personnes retrouvées</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border text-center">
            <h3 className="text-3xl font-bold text-blue-500 mb-2">
              {avisDisparus.filter(a => getDaysSinceDisparition(a.disparitionDate) <= 7).length}
            </h3>
            <p className="text-gray-300">Alertes récentes</p>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-2xl p-2 border border-border">
            <button
              onClick={() => setActiveTab('disparus')}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === 'disparus'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Personnes recherchées ({avisDisparus.length})
            </button>
            <button
              onClick={() => setActiveTab('retrouves')}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                activeTab === 'retrouves'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Personnes retrouvées ({avisRetrouves.length})
            </button>
          </div>
        </div>

        {/* Section Personnes recherchées */}
        {activeTab === 'disparus' && (
          <div className="space-y-8">
            {avisDisparus.length > 0 ? (
              <>
                <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-6 mb-8">
                  <h2 className="text-2xl font-bold text-red-400 mb-2">🚨 Personnes actuellement recherchées</h2>
                  <p className="text-gray-300">
                    Ces personnes sont actuellement portées disparues. Toute information, même minime, peut être déterminante.
                    Vous pouvez nous contacter anonymement.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {avisDisparus.map((avis) => {
                    const urgency = getUrgencyLevel(avis.createdAt);
                    const daysSince = getDaysSinceDisparition(avis.disparitionDate);
                    
                    return (
                                             <div key={avis.id} className="card-hover bg-card rounded-2xl border border-border overflow-hidden">
                         <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
                           {avis.image ? (
                             <Image 
                               width={1000}
                               height={1000}  
                               src={avis.image} 
                               alt={`${avis.name} ${avis.lastname}`}
                               className="w-full h-full object-cover absolute inset-0"
                             />
                           ) : (
                             <span className="text-6xl">👤</span>
                           )}
                           <div className={`absolute top-4 right-4 ${urgency.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                             {urgency.label}
                           </div>
                         </div>
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {avis.name} {avis.lastname}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {avis.age} ans • {avis.city} ({avis.departement})
                            </p>
                          </div>
                          
                                                     <div className="space-y-2 text-sm text-gray-300 mb-4">
                             <div className="flex justify-between">
                               <span>Disparu(e) le:</span>
                               <span className="font-semibold">{formatDateShort(avis.disparitionDate)}</span>
                             </div>
                             <div className="flex justify-between">
                               <span>Depuis:</span>
                               <span className="font-semibold text-red-400">
                                 {daysSince} jour{daysSince > 1 ? 's' : ''}
                               </span>
                             </div>
                             {(avis.taille || avis.poids) && (
                               <div className="flex justify-between">
                                 <span>Physique:</span>
                                 <span className="font-semibold">
                                   {avis.taille && avis.poids ? `${avis.taille}, ${avis.poids}` : 
                                    avis.taille ? avis.taille : avis.poids}
                                 </span>
                               </div>
                             )}
                             <div className="flex justify-between">
                               <span>Alerte créée:</span>
                               <span>{formatDateShort(avis.createdAt)}</span>
                             </div>
                           </div>
                          
                                                     <Link href={`/alertes/${avis.id}`} className="btn-primary w-full py-2 rounded-lg text-white font-semibold text-center block">
                             Voir les détails
                           </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Aucune personne recherchée</h3>
                <p className="text-gray-400">Toutes les personnes signalées ont été retrouvées !</p>
              </div>
            )}
          </div>
        )}

        {/* Section Personnes retrouvées */}
        {activeTab === 'retrouves' && (
          <div className="space-y-8">
            {avisRetrouves.length > 0 ? (
              <>
                <div className="bg-green-600/10 border border-green-600/20 rounded-2xl p-6 mb-8">
                  <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 Personnes retrouvées</h2>
                  <p className="text-gray-300">
                    Grâce à la mobilisation de tous, ces personnes ont pu être retrouvées saines et sauves.
                    Merci à tous ceux qui ont participé aux recherches.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {avisRetrouves.map((avis) => {
                    const daysLost = getDaysSinceDisparition(avis.disparitionDate);
                    
                    return (
                                             <div key={avis.id} className="card-hover bg-card rounded-2xl border border-green-600/30 overflow-hidden">
                         <div className="h-48 bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center relative overflow-hidden">
                           {avis.image ? (
                             <Image 
                               width={1000}
                               height={1000}  
                               src={avis.image} 
                               alt={`${avis.name} ${avis.lastname}`}
                               className="w-full h-full object-cover absolute inset-0"
                             />
                           ) : (
                             <span className="text-6xl">👤</span>
                           )}
                           <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                             RETROUVÉ(E)
                           </div>
                         </div>
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {avis.name} {avis.lastname}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {avis.age} ans • {avis.city} ({avis.departement})
                            </p>
                          </div>
                          
                                                     <div className="space-y-2 text-sm text-gray-300 mb-4">
                             <div className="flex justify-between">
                               <span>Avait disparu le:</span>
                               <span className="font-semibold">{formatDateShort(avis.disparitionDate)}</span>
                             </div>
                             <div className="flex justify-between">
                               <span>Retrouvé(e) après:</span>
                               <span className="font-semibold text-green-400">
                                 {daysLost} jour{daysLost > 1 ? 's' : ''}
                               </span>
                             </div>
                             {(avis.taille || avis.poids) && (
                               <div className="flex justify-between">
                                 <span>Physique:</span>
                                 <span className="font-semibold">
                                   {avis.taille && avis.poids ? `${avis.taille}, ${avis.poids}` : 
                                    avis.taille ? avis.taille : avis.poids}
                                 </span>
                               </div>
                             )}
                             <div className="flex justify-between">
                               <span>Alerte créée:</span>
                               <span>{formatDateShort(avis.createdAt)}</span>
                             </div>
                           </div>
                          
                          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 text-center">
                            <p className="text-green-400 font-semibold text-sm">
                              ✅ Personne retrouvée saine et sauve
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucune personne retrouvée</h3>
                <p className="text-gray-400">Les personnes retrouvées apparaîtront ici.</p>
              </div>
            )}
          </div>
        )}

        {/* Call to action */}
        <div className="bg-card rounded-2xl border border-border p-8 mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Vous avez des informations ?</h3>
          <p className="text-gray-300 mb-6">
            Toute information, même minime, peut être déterminante pour retrouver une personne disparue.
            Vous pouvez nous contacter de manière totalement anonyme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact" className="btn-primary px-8 py-3 rounded-lg text-white font-semibold">
              Nous contacter
            </Link>
            <a href="tel:0800123456" className="btn-outline px-8 py-3 rounded-lg text-red-500 font-semibold">
              Appeler 0800 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 