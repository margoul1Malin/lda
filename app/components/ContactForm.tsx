'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        console.error('Erreur de connexion:', data);
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setSubmitStatus('error');
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-hover bg-card p-8 rounded-2xl border border-border">
      <h3 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h3>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg">
          <p className="text-green-400">✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
          <p className="text-red-400">✗ {errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="name"
            placeholder="Nom" 
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
          />
        </div>
        <input 
          type="text" 
          name="subject"
          placeholder="Sujet" 
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
        />
        <textarea 
          name="message"
          placeholder="Votre message" 
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 bg-background border border-border rounded-lg text-white placeholder-gray-400 resize-none focus:border-red-500 focus:outline-none transition-colors"
        ></textarea>
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary w-full py-3 rounded-lg text-white font-semibold transition-opacity ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>
    </div>
  );
} 