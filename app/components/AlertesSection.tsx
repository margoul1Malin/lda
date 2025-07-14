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

export default function AlertesSection() {
  const [avis, setAvis] = useState<AvisDisparition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvis();
  }, []);

  const fetchAvis = async () => {
    try {
      const response = await fetch('/api/avis-disparition?limit=6&status=lost');
      if (response.ok) {
        const data = await response.json();
        setAvis(data.avis || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (loading) {
    return (
      <section id="alertes" className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Alertes Disparitions</h2>
            <p className="text-xl text-gray-300">Aidez-nous à retrouver ces personnes.</p>
            <p className="text-xl text-gray-300">Toutes informations est la bienvenue et peut-être transmise anonymement.</p>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des alertes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="alertes" className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Alertes Disparitions</h2>
          <p className="text-xl text-gray-300">Aidez-nous à retrouver ces personnes.</p>
          <p className="text-xl text-gray-300">Toutes informations est la bienvenue et peut-être transmise anonymement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {avis.map((avisItem) => {
            const urgency = getUrgencyLevel(avisItem.createdAt);
            return (
              <div key={avisItem.id} className="card-hover bg-card rounded-2xl border border-border overflow-hidden">
                                 <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden relative">
                   {avisItem.image ? (
                     <Image 
                       width={1000}
                       height={1000}  
                       src={avisItem.image} 
                       alt={`${avisItem.name} ${avisItem.lastname}`}
                       className="w-full h-full object-cover absolute inset-0"
                     />
                   ) : (
                     <span className="text-6xl">👤</span>
                   )}
                 </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {avisItem.name} {avisItem.lastname}
                    </h3>
                    <span className={`${urgency.color} text-white px-3 py-1 rounded-full text-sm`}>
                      {urgency.label}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Disparu(e) le {formatDate(avisItem.disparitionDate)}
                  </p>
                  <p className="text-gray-300 mb-2">
                    {avisItem.age} ans
                  </p>
                  <p className="text-gray-300 mb-4">
                    Dernière fois vu(e) à {avisItem.city} ({avisItem.departement})
                  </p>
                  <Link href={`/alertes/${avisItem.id}`} className="btn-primary w-full py-2 rounded-lg text-white font-semibold text-center block">
                    Voir les détails
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {avis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Aucune alerte active pour le moment</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/alertes" className="btn-outline px-8 py-4 rounded-lg text-red-500 font-semibold text-lg inline-block">
            Voir toutes les alertes
          </Link>
        </div>
      </div>
    </section>
  );
} 