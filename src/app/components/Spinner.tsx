"use client";

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'blue' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    green: 'border-green-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}; 