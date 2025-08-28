"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
  isVisible,
}) => {
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);
    
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '🎉';
    }
  };

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          className="fixed top-4 right-4 z-50 flex items-center max-w-sm"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`${getBackgroundColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center`}>
            <span className="mr-2 text-xl">{getIcon()}</span>
            <p className="font-medium">{message}</p>
            <button 
              onClick={() => {
                setIsShowing(false);
                if (onClose) onClose();
              }}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 