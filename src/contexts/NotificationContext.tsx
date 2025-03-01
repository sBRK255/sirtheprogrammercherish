'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  isEnabled: boolean;
  requestPermission: () => Promise<void>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and permission is granted
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setIsEnabled(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsEnabled(true);
        toast.success('Notifications enabled!');
      } else {
        toast.error('Permission denied for notifications');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (isEnabled) {
      try {
        new Notification(title, options);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ isEnabled, requestPermission, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
