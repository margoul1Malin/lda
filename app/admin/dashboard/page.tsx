'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import CreateAvisForm from '../../components/admin/CreateAvisForm';

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

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
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<ContactQuery[]>([]);
  const [avis, setAvis] = useState<AvisDisparition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'avis'>('overview');
  const [showCreateAvis, setShowCreateAvis] = useState(false);
  const router = useRouter();
  const { admin, token, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    if (token && isAuthenticated) {
      loadData(token);
    }
  }, [isAuthenticated, isLoading, token, router]);

  const loadData = async (token: string) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [contactsRes, avisRes] = await Promise.all([
        fetch('/api/contact', { headers }),
        fetch('/api/admin/avis-disparition', { headers })
      ]);

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }

      if (avisRes.ok) {
        const avisData = await avisRes.json();
        setAvis(avisData.avis || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId ? { ...contact, status: newStatus } : contact
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const response = await fetch(`/api/admin/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const updateAvisStatus = async (avisId: string, newStatus: string) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/avis-disparition/${avisId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAvis(prev => 
          prev.map(avisItem => 
            avisItem.id === avisId ? { ...avisItem, status: newStatus } : avisItem
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const deleteAvis = async (avisId: string) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      const response = await fetch(`/api/admin/avis-disparition/${avisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAvis(prev => prev.filter(avisItem => avisItem.id !== avisId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleCreateAvisSuccess = () => {
    setShowCreateAvis(false);
    if (token) {
      loadData(token);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600';
      case 'read': return 'bg-yellow-600';
      case 'replied': return 'bg-green-600';
      case 'lost': return 'bg-red-600';
      case 'found': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'read': return 'Lu';
      case 'replied': return 'Répondu';
      case 'lost': return 'Disparu';
      case 'found': return 'Retrouvé';
      default: return status;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">LDA Admin</h1>
              <p className="text-gray-400">Panel d&apos;administration</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-semibold">{admin?.name}</p>
              <p className="text-gray-400 text-sm">{admin?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-dark border-b border-border p-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'overview' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Vue d&apos;ensemble
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'contacts' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Messages de contact ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('avis')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'avis' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Avis de disparition ({avis.length})
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Vue d&apos;ensemble</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-semibold text-white mb-2">Messages de contact</h3>
                <p className="text-3xl font-bold text-red-500">{contacts.length}</p>
                <p className="text-gray-400">
                  {contacts.filter(c => c.status === 'new').length} nouveaux
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-semibold text-white mb-2">Avis de disparition</h3>
                <p className="text-3xl font-bold text-red-500">{avis.length}</p>
                <p className="text-gray-400">
                  {avis.filter(a => a.status === 'lost').length} en cours
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-semibold text-white mb-2">Personnes retrouvées</h3>
                <p className="text-3xl font-bold text-green-500">
                  {avis.filter(a => a.status === 'found').length}
                </p>
                <p className="text-gray-400">Total</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages de contact */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Messages de contact</h2>
            
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-card p-6 rounded-2xl border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{contact.subject}</h3>
                      <p className="text-gray-400">De: {contact.name} ({contact.email})</p>
                      <p className="text-gray-400 text-sm">{formatDate(contact.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(contact.status)}`}>
                        {getStatusText(contact.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{contact.message}</p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <select 
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                    >
                      <option value="new">Nouveau</option>
                      <option value="read">Lu</option>
                      <option value="replied">Répondu</option>
                      <option value="archived">Archivé</option>
                    </select>
                    
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xl">Aucun message de contact</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Avis de disparition */}
        {activeTab === 'avis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Avis de disparition</h2>
              <button
                onClick={() => setShowCreateAvis(true)}
                className="btn-primary px-6 py-3 rounded-lg text-white font-semibold"
              >
                Créer un avis
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avis.map((avisItem) => (
                <div key={avisItem.id} className="bg-card p-6 rounded-2xl border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {avisItem.name} {avisItem.lastname}
                      </h3>
                      <p className="text-gray-400">{avisItem.age} ans</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(avisItem.status)}`}>
                      {getStatusText(avisItem.status)}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-300 mb-4">
                    <p><strong>Ville:</strong> {avisItem.city}</p>
                    <p><strong>Département:</strong> {avisItem.departement}</p>
                    {(avisItem.taille || avisItem.poids) && (
                      <p><strong>Physique:</strong> {avisItem.taille && avisItem.poids ? `${avisItem.taille}, ${avisItem.poids}` : avisItem.taille || avisItem.poids}</p>
                    )}
                    {avisItem.phone && <p><strong>Téléphone:</strong> {avisItem.phone}</p>}
                    <p className="text-gray-400 text-sm">{formatDate(avisItem.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <select 
                      value={avisItem.status}
                      onChange={(e) => updateAvisStatus(avisItem.id, e.target.value)}
                      className="bg-background border border-border rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none flex-1"
                    >
                      <option value="lost">Disparu</option>
                      <option value="found">Retrouvé</option>
                    </select>
                    
                    <button
                      onClick={() => deleteAvis(avisItem.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              {avis.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-xl">Aucun avis de disparition</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal de création d'avis */}
      {showCreateAvis && token && (
        <CreateAvisForm 
          onSuccess={handleCreateAvisSuccess}
          onCancel={() => setShowCreateAvis(false)}
          token={token}
        />
      )}
    </div>
  );
} 