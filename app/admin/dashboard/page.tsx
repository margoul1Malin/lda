'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import CreateAvisForm from '../../components/admin/CreateAvisForm';
import EditAvisForm from '../../components/admin/EditAvisForm';
import { 
  FiMail, 
  FiSearch, 
  FiCheckCircle, 
  FiUser, 
  FiCalendar, 
  FiPhone, 
  FiMapPin, 
  FiEdit3, 
  FiTrash2, 
  FiPlus,
  FiBarChart,
  FiMessageSquare,
  FiLogOut,
  FiActivity,
  FiZap,
  FiStar,
} from 'react-icons/fi';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(false); // Initialisé à false pour éviter le loader initial
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'avis'>('overview');
  const [showCreateAvis, setShowCreateAvis] = useState(false);
  const [editingAvis, setEditingAvis] = useState<AvisDisparition | null>(null);
  const [stars, setStars] = useState<Array<{left: string, top: string, size: string, delay: string, duration: string}>>([]);
  const router = useRouter();
  const { admin, token, isAuthenticated, isLoading, logout } = useAuth();

  // Générer les étoiles côté client uniquement
  useEffect(() => {
    const generateStars = (count: number) => {
      return Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${8 + Math.random() * 6}px`,
        delay: `${Math.random() * 3}s`,
        duration: `${3 + Math.random() * 2}s`
      }));
    };
    setStars(generateStars(50));
    
  }, []);

  // Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Chargement des données séparé
  useEffect(() => {
    if (!isLoading && isAuthenticated && token) {
      loadData(token);
    }
  }, [isAuthenticated, isLoading, token]);

  const loadData = async (token: string) => {
    try {
      setLoading(true);
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

  const updateAvis = async (avisId: string, updatedData: Partial<AvisDisparition>) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/avis-disparition/${avisId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const result = await response.json();
        setAvis(prev => 
          prev.map(avisItem => 
            avisItem.id === avisId ? { ...avisItem, ...result.avis } : avisItem
          )
        );
        setEditingAvis(null);
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avis:', error);
      alert('Erreur lors de la mise à jour');
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
      case 'new': return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border-red-500/50 shadow-red-500/20';
      case 'read': return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/50 shadow-gray-500/20';
      case 'replied': return 'bg-gradient-to-r from-red-400/20 to-red-500/20 text-red-200 border-red-400/50 shadow-red-400/20';
      case 'lost': return 'bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-300 border-red-600/50 shadow-red-600/20';
      case 'found': return 'bg-gradient-to-r from-red-400/20 to-red-500/20 text-red-200 border-red-400/50 shadow-red-400/20';
      default: return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border-gray-500/50 shadow-gray-500/20';
    }
  };

  // Loader de chargement des données uniquement
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Arrière-plan simplifié */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_50%)]"></div>
        
        {/* Petites étoiles statiques */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute text-red-400 opacity-20 animate-pulse"
              style={{
                left: star.left,
                top: star.top,
                fontSize: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            >
              ✦
            </div>
          ))}
        </div>
        
        <div className="text-center z-10 relative">
          <div className="w-20 h-20 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300 mt-4">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Effets d'arrière-plan simplifiés */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_50%)]"></div>
      
      {/* Petites étoiles statiques */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute text-red-400 opacity-30 animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              fontSize: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Header futuriste */}
      <header className="relative z-50 backdrop-blur-2xl bg-gradient-to-r from-black/90 to-gray-900/90 border-b border-red-500/20 sticky top-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5"></div>
        <div className="relative px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300">
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl animate-pulse opacity-20"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
              </div>
              <Link href="/">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-sm flex items-center space-x-2">
                  <FiZap className="w-4 h-4 text-red-400" />
                  <span>Gestion des avis de disparition et des messages de contact</span>
                </p>
              </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 backdrop-blur-xl bg-gray-900/50 rounded-2xl p-4 border border-red-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{admin?.name}</p>
                  <p className="text-gray-400 text-sm">{admin?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="group relative px-6 py-3 cursor-pointer bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-2xl text-white font-semibold transition-all duration-300 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
              >
                <span className="flex items-center space-x-2 relative z-10">
                  <FiLogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation futuriste */}
      <nav className="relative z-40 backdrop-blur-2xl bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-red-500/10 px-8 py-6">
        <div className="flex space-x-2">
          {[
            { key: 'overview', label: 'Vue d\'ensemble', icon: FiBarChart },
            { key: 'contacts', label: `Messages (${contacts.length})`, icon: FiMessageSquare },
            { key: 'avis', label: `Avis (${avis.length})`, icon: FiSearch }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'overview' | 'contacts' | 'avis')}
              className={`group relative px-8 cursor-pointer py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-2xl shadow-red-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-red-500/10 backdrop-blur-xl'
              }`}
            >
              <span className="flex items-center space-x-3">
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-2xl animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content futuriste */}
      <main className="relative z-30 p-8">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent mb-4">
                  Vue d&apos;ensemble
                </h2>
                <p className="text-gray-400 text-lg flex items-center space-x-2">
                  <FiActivity className="w-5 h-5 text-red-400" />
                  <span>Tableau de bord en temps réel</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Messages de contact',
                  value: contacts.length,
                  subtitle: `${contacts.filter(c => c.status === 'new').length} nouveaux`,
                  icon: FiMail,
                },
                {
                  title: 'Avis de disparition',
                  value: avis.length,
                  subtitle: `${avis.filter(a => a.status === 'lost').length} en cours`,
                  icon: FiSearch,
                },
                {
                  title: 'Personnes retrouvées',
                  value: avis.filter(a => a.status === 'found').length,
                  subtitle: 'Total',
                  icon: FiCheckCircle,
                }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-3xl border border-red-500/20 hover:border-red-500/40 transition-all duration-500 hover:scale-105"
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/20">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">

                    </div>
                  </div>
                  
                  <h3 className="text-gray-300 font-semibold mb-3 text-lg">{stat.title}</h3>
                  <p className="text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-gray-400">{stat.subtitle}</p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent rounded-b-3xl"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages de contact */}
        {activeTab === 'contacts' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent mb-4">
                  Messages de contact
                </h2>
                <p className="text-gray-400 text-lg">Gestion intelligente des demandes</p>
              </div>
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <FiStar className="w-5 h-5 text-red-400" />
                  <span>Total: {contacts.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiZap className="w-5 h-5 text-red-400" />
                  <span>Nouveaux: {contacts.filter(c => c.status === 'new').length}</span>
                </div>
              </div>
            </div>
            
            {contacts.length === 0 ? (
              <div className="text-center py-20 backdrop-blur-2xl bg-gray-900/30 rounded-3xl border border-red-500/20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiMail className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-300 text-2xl mb-2">Aucun message de contact</p>
                <p className="text-gray-500">Les nouveaux messages apparaîtront ici</p>
              </div>
            ) : (
              <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border border-red-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-500/20 to-red-700/20 border-b border-red-500/30">
                      <tr>
                        <th className="text-left p-6 text-white font-semibold">Nom</th>
                        <th className="text-left p-6 text-white font-semibold">Email</th>
                        <th className="text-left p-6 text-white font-semibold">Sujet</th>
                        <th className="text-left p-6 text-white font-semibold">Message</th>
                        <th className="text-left p-6 text-white font-semibold">Statut</th>
                        <th className="text-left p-6 text-white font-semibold">Date</th>
                        <th className="text-left p-6 text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, index) => (
                        <tr 
                          key={contact.id}
                          className="border-b border-red-500/10 hover:bg-red-500/5 transition-all duration-300 group"
                          style={{animationDelay: `${index * 50}ms`}}
                        >
                          <td className="p-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                <FiUser className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-white font-medium">{contact.name}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2 text-gray-300">
                              <FiMail className="w-4 h-4 text-red-400" />
                              <span>{contact.email}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-white font-medium">{contact.subject}</span>
                          </td>
                          <td className="p-6">
                            <div className="max-w-xs">
                              <p className="text-gray-300 truncate" title={contact.message}>
                                {contact.message}
                              </p>
                            </div>
                          </td>
                          <td className="p-6">
                            <select 
                              value={contact.status}
                              onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                              className={`px-4 py-2 rounded-full cursor-pointer text-sm font-semibold border shadow-lg backdrop-blur-xl bg-black/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 ${getStatusColor(contact.status)}`}
                            >
                              <option value="new">🔥 Nouveau</option>
                              <option value="read">👁️ Lu</option>
                              <option value="replied">✅ Répondu</option>
                              <option value="archived">📁 Archivé</option>
                            </select>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2 text-gray-400">
                              <FiCalendar className="w-4 h-4 text-red-400" />
                              <span className="text-sm">{formatDate(contact.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => deleteContact(contact.id)}
                                className="p-2 bg-gradient-to-r from-red-500 to-red-700 cursor-pointer hover:from-red-600 hover:to-red-800 rounded-xl text-white transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
                                title="Supprimer"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Avis de disparition */}
        {activeTab === 'avis' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent mb-4">
                  Avis de disparition
                </h2>
                <p className="text-gray-400 text-lg">Système de recherche avancé</p>
              </div>
              <button
                onClick={() => setShowCreateAvis(true)}
                className="group relative cursor-pointer px-8 py-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-2xl text-white font-semibold transition-all duration-300 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
              >
                <span className="flex items-center space-x-3 relative z-10">
                  <FiPlus className="w-5 h-5" />
                  <span>Créer un avis</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            
            {avis.length === 0 ? (
              <div className="text-center py-20 backdrop-blur-2xl bg-gray-900/30 rounded-3xl border border-red-500/20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-300 text-2xl mb-2">Aucun avis de disparition</p>
                <p className="text-gray-500">Créez votre premier avis pour commencer</p>
              </div>
            ) : (
              <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border border-red-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-500/20 to-red-700/20 border-b border-red-500/30">
                      <tr>
                        <th className="text-left p-6 text-white font-semibold">Personne</th>
                        <th className="text-left p-6 text-white font-semibold">Âge</th>
                        <th className="text-left p-6 text-white font-semibold">Localisation</th>
                        <th className="text-left p-6 text-white font-semibold">Informations</th>
                        <th className="text-left p-6 text-white font-semibold">Contact</th>
                        <th className="text-left p-6 text-white font-semibold">Statut</th>
                        <th className="text-left p-6 text-white font-semibold">Date</th>
                        <th className="text-left p-6 text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {avis.map((avisItem, index) => (
                        <tr 
                          key={avisItem.id}
                          className="border-b border-red-500/10 hover:bg-red-500/5 transition-all duration-300 group"
                          style={{animationDelay: `${index * 50}ms`}}
                        >
                          <td className="p-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                <FiUser className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{avisItem.name}</p>
                                {avisItem.lastname && <p className="text-gray-300 text-sm">{avisItem.lastname}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-white font-medium">{avisItem.age} ans</span>
                          </td>
                          <td className="p-6">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-gray-300">
                                <FiMapPin className="w-4 h-4 text-red-400" />
                                <span>{avisItem.city}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <span>Dép. {avisItem.departement}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="text-gray-300 text-sm space-y-1">
                              {avisItem.taille && <div>Taille: {avisItem.taille}</div>}
                              {avisItem.poids && <div>Poids: {avisItem.poids}</div>}
                              {!avisItem.taille && !avisItem.poids && <div className="text-gray-500">Non renseigné</div>}
                            </div>
                          </td>
                          <td className="p-6">
                            {avisItem.phone ? (
                              <div className="flex items-center space-x-2 text-gray-300">
                                <FiPhone className="w-4 h-4 text-red-400" />
                                <span className="text-sm">{avisItem.phone}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Non renseigné</span>
                            )}
                          </td>
                          <td className="p-6">
                            <select 
                              value={avisItem.status}
                              onChange={(e) => updateAvisStatus(avisItem.id, e.target.value)}
                              className={`px-4 py-2 rounded-full cursor-pointer text-sm font-semibold border shadow-lg backdrop-blur-xl bg-black/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 ${getStatusColor(avisItem.status)}`}
                            >
                              <option value="lost">🔍 Disparu</option>
                              <option value="found">🎯 Retrouvé</option>
                            </select>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2 text-gray-400">
                              <FiCalendar className="w-4 h-4 text-red-400" />
                              <span className="text-sm">{formatDate(avisItem.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingAvis(avisItem)}
                                className="p-2 bg-gradient-to-r cursor-pointer from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded-xl text-white transition-all duration-300 shadow-lg hover:scale-105"
                                title="Modifier"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteAvis(avisItem.id)}
                                className="p-2 bg-gradient-to-r cursor-pointer from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-xl text-white transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
                                title="Supprimer"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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

      {/* Modal d'édition d'avis */}
      {editingAvis && token && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-900/90 to-black/90 rounded-3xl border border-red-500/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Modifier l&apos;avis de disparition
              </h2>
              <button
                onClick={() => setEditingAvis(null)}
                className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
              >
                <span className="text-gray-400 hover:text-white text-2xl">×</span>
              </button>
            </div>

            <EditAvisForm
              avis={editingAvis}
              onSuccess={(updatedData) => updateAvis(editingAvis.id, updatedData)}
              onCancel={() => setEditingAvis(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 