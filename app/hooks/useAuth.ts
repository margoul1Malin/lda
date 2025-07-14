'use client';

import { useState, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cette fonction s'exécute uniquement côté client
    const storedToken = localStorage.getItem('admin_token');
    const storedAdmin = localStorage.getItem('admin_user');

    if (storedToken && storedAdmin) {
      try {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Erreur lors du parsing des données admin:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (tokenData: string, adminData: Admin) => {
    localStorage.setItem('admin_token', tokenData);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    setToken(tokenData);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdmin(null);
  };

  return {
    admin,
    token,
    isLoading,
    isAuthenticated: !!token && !!admin,
    login,
    logout
  };
} 