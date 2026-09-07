"use client";

import { useEffect, useState } from 'react';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log('useNotifications - userId recebido:', userId);
    if (!userId) {
      console.log('useNotifications - userId é null/undefined, retornando');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001' || 'https://nest-visalytica.onrender.com';
    console.log('API URL:', apiUrl, 'User ID:', userId);

    const fetchUnread = async () => {
      try {
        console.log('Fazendo requisição para:', `${apiUrl}/notifications/unread/${userId}`);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiUrl}/notifications/unread/${userId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const unread = await response.json();
        console.log('Notificações recebidas:', unread);
        setNotifications(Array.isArray(unread) ? unread : []);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        setNotifications([]);
      }
    };

    fetchUnread();

    // EventSource com autenticação
    const token = localStorage.getItem('authToken');
    const eventSourceUrl = `${apiUrl}/notifications/${userId}${token ? `?token=${token}` : ''}`;
    console.log('Conectando EventSource:', eventSourceUrl);
    
    const eventSource = new EventSource(eventSourceUrl);
    
    eventSource.onopen = () => {
      console.log('EventSource conectado com sucesso');
    };
    
    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        console.log('Nova notificação via EventSource:', notification);
        setNotifications(prev => [notification, ...(Array.isArray(prev) ? prev : [])]);
      } catch (error) {
        console.error('Erro ao processar notificação:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro no EventSource:', error);
      console.log('EventSource readyState:', eventSource.readyState);
      
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('EventSource foi fechado pelo servidor');
      }
    };

    return () => {
      console.log('useNotifications - Fechando EventSource');
      eventSource.close();
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001' || 'https://nest-visalytica.onrender.com';
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${apiUrl}/notifications/read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setNotifications(prev => 
        Array.isArray(prev) ? prev.map(n => n.id === notificationId ? {...n, read: true} : n) : []
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  return { notifications, markAsRead };
}