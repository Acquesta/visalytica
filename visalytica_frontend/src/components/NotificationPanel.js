"use client";

import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/context/AuthContext';
import { Bell, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NotificationPanel() {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications(user?.id);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  useEffect(() => {
    console.log('NotificationPanel - User:', user);
    console.log('NotificationPanel - Notifications:', notifications);
    console.log('NotificationPanel - Unread count:', unreadCount);
  }, [user, notifications, unreadCount]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleToggle}
          className="relative p-2 text-cinza_escuro dark:text-cinza_claro hover:text-azul transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center pt-1 justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-6 max-md:min-w-[300px] max-md:right-[-62px] right-[-120px] md:w-80 bg-white dark:bg-noturno_medio border border-cinza dark:border-noturno_borda rounded-[10px] shadow-lg" style={{zIndex: 9999}}>
            <div className="p-3 border-b flex justify-center items-center gap-2 border-cinza text-azul dark:border-noturno_borda">
               <Bell size={20} /> 
              <h3 className="font-semibold text-center">Notificações</h3>
            </div>
            
            <div className="max-h-72 min-h-72 overflow-y-auto overflow-x-hidden rounded-b-[10px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {!Array.isArray(notifications) || notifications.length === 0 ? (
                <div className="p-4 text-center text-cinza_escuro dark:text-cinza_claro">
                  Nenhuma notificação
                </div>
              ) : (
                Array.isArray(notifications) && notifications.map((notification, index) => (
                  <div key={notification.id || index} className={`p-3 border-b border-cinza dark:border-noturno_borda last:border-b-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-black dark:text-white">{notification.message}</p>
                        <div className='flex gap-2'>
                        {notification.data.itemType && (
                          <span className="text-xs text-azul bg-azul/10 px-2 py-1 rounded mt-1 inline-block">
                            {notification.data.itemType}
                          </span>
                        )}
                        {notification.data.status && (
                          <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${notification.data.status === 'recusado' ? 'text-red-600 bg-vermelho/10' : 'text-[#2ACA44] bg-[#2ACA44]/10'}`}>
                            {notification.data.status}
                          </span>
                        )}
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-azul hover:text-azul ml-2 text-xs border border-azul px-2 py-1 rounded-full hover:bg-azul/10"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0" 
          style={{zIndex: 9998}}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}