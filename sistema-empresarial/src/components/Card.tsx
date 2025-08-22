import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CardProps {
  title: string;
  value: string;
  delta?: string;
  color?: string;
  icon?: React.ReactNode;
}

export default function Card({ title, value, delta, color = "text-white", icon }: CardProps) {
  const deltaValue = delta ? parseFloat(delta) : 0;
  const isPositive = deltaValue >= 0;

  return (
    <div className="bg-cpm-panel p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105 border border-transparent hover:border-cpm-red/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <span className={`text-3xl font-bold ${color} transition-colors duration-300`}>
          {value}
        </span>

        {delta && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'text-green-400 bg-green-400/10' 
              : 'text-red-400 bg-red-400/10'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? '+' : ''}{delta}%
          </div>
        )}
      </div>
    </div>
  );
}