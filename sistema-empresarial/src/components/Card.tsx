import React from 'react'; // Adicionando a importação do React

interface CardProps {
  title: string;
  value: string;
  delta: string; // variação percentual
  color?: string; // cor opcional para destacar
}

const Card: React.FC<CardProps> = ({ title, value, delta, color = 'text-cpm-red' }) => {
  return (
    <div className={`bg-cpm-panel p-4 rounded shadow text-white`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm text-gray-400">{title}</h4>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-xs text-gray-500 ${color}`}>{delta} vs. mês anterior</div>
    </div>
  );
};

export default Card;
