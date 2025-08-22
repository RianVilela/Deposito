
import React, { useState, useEffect } from 'react';
import { BarChart3, Package, AlertCircle, TrendingUp } from 'lucide-react';

interface Material {
  nome: string;
  quantidade: string;
  unidade: string;
  deposito?: string;
}

export default function EstatisticasRapidas() {
  const [stats, setStats] = useState({
    totalMateriais: 0,
    materiaisComEstoqueBaixo: 0,
    depositosAtivos: 0,
    materiaisSemEstoque: 0
  });

  useEffect(() => {
    const materiais: Material[] = JSON.parse(localStorage.getItem('cadastros-Material') || '[]');
    const depositos = JSON.parse(localStorage.getItem('cadastros-Depósito') || '[]');

    const materiaisComEstoqueBaixo = materiais.filter(m => {
      const quantidade = parseInt(m.quantidade) || 0;
      return quantidade < 10;
    }).length;

    const materiaisSemEstoque = materiais.filter(m => {
      const quantidade = parseInt(m.quantidade) || 0;
      return quantidade === 0;
    }).length;

    setStats({
      totalMateriais: materiais.length,
      materiaisComEstoqueBaixo,
      depositosAtivos: depositos.length,
      materiaisSemEstoque
    });
  }, []);

  const estatisticas = [
    {
      label: 'Total de Materiais',
      value: stats.totalMateriais,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Estoque Baixo',
      value: stats.materiaisComEstoqueBaixo,
      icon: AlertCircle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      label: 'Depósitos Ativos',
      value: stats.depositosAtivos,
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Sem Estoque',
      value: stats.materiaisSemEstoque,
      icon: TrendingUp,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  ];

  return (
    <div className="bg-cpm-panel p-6 rounded-xl shadow mb-6">
      <h3 className="text-lg font-bold mb-4 text-white">Estatísticas Rápidas</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-cpm-bg">
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
