"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await api.get('/auth/perfil');
          
          setToken(storedToken);
          setUser(response.data);
        } catch (error) {
          console.error("Falha ao validar token e buscar perfil", error);
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    }

    loadUserFromStorage();
  }, []);

  const login = async (newToken) => {
    localStorage.setItem('authToken', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    try {
      const response = await api.get('/auth/perfil');
      setUser(response.data);
      setToken(newToken);
    } catch (error) {
      console.error("Falha ao buscar perfil do usuário após login", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    api.defaults.headers.common['Authorization'] = null;
    setToken(null);
    setUser(null);
  };

  const value = { token, user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);