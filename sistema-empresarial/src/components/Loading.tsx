
import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Loading({ size = 'md', text = 'Carregando...' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-cpm-red/20 border-t-cpm-red rounded-full animate-spin`}></div>
      {text && <p className="text-gray-400 mt-4 text-sm">{text}</p>}
    </div>
  );
}
