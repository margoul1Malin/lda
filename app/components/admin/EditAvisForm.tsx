'use client';

import { useState } from 'react';
import { FiUser, FiMapPin, FiPhone, FiCalendar, FiSave, FiX } from 'react-icons/fi';

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

interface EditAvisFormProps {
  avis: AvisDisparition;
  onSuccess: (updatedData: Partial<AvisDisparition>) => void;
  onCancel: () => void;
}

export default function EditAvisForm({ avis, onSuccess, onCancel }: EditAvisFormProps) {
  const [formData, setFormData] = useState({
    name: avis.name || '',
    lastname: avis.lastname || '',
    age: avis.age || '',
    taille: avis.taille || '',
    poids: avis.poids || '',
    departement: avis.departement.toString(),
    city: avis.city || '',
    phone: avis.phone || '',
    status: avis.status || 'lost'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        departement: parseInt(formData.departement),
        // Supprimer les champs vides optionnels
        lastname: formData.lastname || undefined,
        taille: formData.taille || undefined,
        poids: formData.poids || undefined,
        phone: formData.phone || undefined,
      };

      onSuccess(updatedData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-red-400" />
            <span>Nom *</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Nom de la personne"
          />
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-red-400" />
            <span>Prénom</span>
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Prénom de la personne"
          />
        </div>

        {/* Âge */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiCalendar className="w-5 h-5 text-red-400" />
            <span>Âge *</span>
          </label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Âge de la personne"
          />
        </div>

        {/* Taille */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-red-400" />
            <span>Taille</span>
          </label>
          <input
            type="text"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Ex: 1m75"
          />
        </div>

        {/* Poids */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-red-400" />
            <span>Poids</span>
          </label>
          <input
            type="text"
            name="poids"
            value={formData.poids}
            onChange={handleChange}
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Ex: 70kg"
          />
        </div>

        {/* Département */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiMapPin className="w-5 h-5 text-red-400" />
            <span>Département *</span>
          </label>
          <input
            type="number"
            name="departement"
            value={formData.departement}
            onChange={handleChange}
            required
            min="1"
            max="95"
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Numéro du département"
          />
        </div>

        {/* Ville */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiMapPin className="w-5 h-5 text-red-400" />
            <span>Ville *</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Ville de disparition"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiPhone className="w-5 h-5 text-red-400" />
            <span>Téléphone</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            placeholder="Numéro de téléphone"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center space-x-2">
            <FiUser className="w-5 h-5 text-red-400" />
            <span>Statut *</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 backdrop-blur-xl bg-black/50 border border-red-500/20 rounded-2xl text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
          >
            <option value="lost">🔍 Disparu</option>
            <option value="found">🎯 Retrouvé</option>
          </select>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-red-500/20">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 backdrop-blur-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center space-x-2"
        >
          <FiX className="w-5 h-5" />
          <span>Annuler</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all duration-300 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 flex items-center space-x-2"
        >
          <FiSave className="w-5 h-5" />
          <span>{isSubmitting ? 'Modification...' : 'Modifier'}</span>
        </button>
      </div>
    </form>
  );
} 