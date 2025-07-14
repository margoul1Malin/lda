'use client';

import { useState } from 'react';

interface CreateAvisFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  token: string;
}

export default function CreateAvisForm({ onSuccess, onCancel, token }: CreateAvisFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    age: '',
    taille: '',
    poids: '',
    disparitionDate: '',
    departement: '',
    city: '',
    phone: '',
    image: '',
    status: 'lost'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/avis-disparition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        console.error('Erreur de connexion:', data);
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Créer un avis de disparition</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
            <p className="text-red-400">✗ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Prénom *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Prénom"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Nom</label>
              <input 
                type="text" 
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Nom de famille"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Âge *</label>
              <input 
                type="text" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="25 ans"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Taille</label>
              <input 
                type="text" 
                name="taille"
                value={formData.taille}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="1m75"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Poids</label>
              <input 
                type="text" 
                name="poids"
                value={formData.poids}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="70kg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Date de disparition</label>
              <input 
                type="date" 
                name="disparitionDate"
                value={formData.disparitionDate}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">URL de l&apos;image</label>
              <input 
                type="url" 
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="https://exemple.com/photo.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Département *</label>
              <input 
                type="number" 
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                required
                min="1"
                max="95"
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="75"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Ville *</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Téléphone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="06 12 34 56 78"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Statut</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-border rounded-lg text-white focus:border-red-500 focus:outline-none transition-colors"
              >
                <option value="lost">Disparu</option>
                <option value="found">Retrouvé</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary flex-1 py-3 rounded-lg text-white font-semibold transition-opacity ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Création...' : 'Créer l\'avis'}
            </button>
            
            <button 
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="btn-outline flex-1 py-3 rounded-lg text-red-500 font-semibold"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 