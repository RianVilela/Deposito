
import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, AlertTriangle, CheckCircle, Warehouse } from 'lucide-react';

interface Material {
  id: string;
  nome: string;
  quantidade: string;
  unidade: string;
  deposito?: string;
  estoqueMinimo?: string;
}

export default function Estoque() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroEstoque, setFiltroEstoque] = useState('todos');

  useEffect(() => {
    const materiaisArmazenados = JSON.parse(localStorage.getItem('cadastros-Material') || '[]');
    setMateriais(materiaisArmazenados);
  }, []);

  const materiaisFiltrados = materiais.filter(material => {
    const matchBusca = material.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      material.deposito?.toLowerCase().includes(busca.toLowerCase());
    
    const quantidade = parseInt(material.quantidade) || 0;
    const estoqueMinimo = parseInt(material.estoqueMinimo || '10') || 10;
    
    switch (filtroEstoque) {
      case 'baixo':
        return matchBusca && quantidade < estoqueMinimo;
      case 'zerado':
        return matchBusca && quantidade === 0;
      case 'adequado':
        return matchBusca && quantidade >= estoqueMinimo;
      default:
        return matchBusca;
    }
  });

  const getStatusEstoque = (quantidade: number, estoqueMinimo: number) => {
    if (quantidade === 0) {
      return { status: 'Zerado', color: 'text-red-400', bg: 'bg-red-400/10', icon: AlertTriangle };
    } else if (quantidade < estoqueMinimo) {
      return { status: 'Baixo', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: AlertTriangle };
    } else {
      return { status: 'Adequado', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle };
    }
  };

  const estatisticasEstoque = {
    total: materiais.length,
    zerado: materiais.filter(m => parseInt(m.quantidade) === 0).length,
    baixo: materiais.filter(m => {
      const qty = parseInt(m.quantidade) || 0;
      const min = parseInt(m.estoqueMinimo || '10') || 10;
      return qty > 0 && qty < min;
    }).length,
    adequado: materiais.filter(m => {
      const qty = parseInt(m.quantidade) || 0;
      const min = parseInt(m.estoqueMinimo || '10') || 10;
      return qty >= min;
    }).length
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="text-blue-400" />
          Controle de Estoque
        </h2>
      </div>

      {/* Estatísticas do Estoque */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-cpm-panel p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Warehouse className="text-blue-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-white">{estatisticasEstoque.total}</p>
              <p className="text-sm text-gray-400">Total de Itens</p>
            </div>
          </div>
        </div>
        <div className="bg-cpm-panel p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-green-400">{estatisticasEstoque.adequado}</p>
              <p className="text-sm text-gray-400">Estoque Adequado</p>
            </div>
          </div>
        </div>
        <div className="bg-cpm-panel p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-yellow-400">{estatisticasEstoque.baixo}</p>
              <p className="text-sm text-gray-400">Estoque Baixo</p>
            </div>
          </div>
        </div>
        <div className="bg-cpm-panel p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-red-400">{estatisticasEstoque.zerado}</p>
              <p className="text-sm text-gray-400">Estoque Zerado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-cpm-panel p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar material ou depósito..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cpm-bg border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cpm-red focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filtroEstoque}
              onChange={(e) => setFiltroEstoque(e.target.value)}
              className="bg-cpm-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cpm-red focus:outline-none"
            >
              <option value="todos">Todos os Estoques</option>
              <option value="adequado">Estoque Adequado</option>
              <option value="baixo">Estoque Baixo</option>
              <option value="zerado">Estoque Zerado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Materiais */}
      <div className="bg-cpm-panel rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Materiais em Estoque</h3>
          <p className="text-sm text-gray-400">
            Exibindo {materiaisFiltrados.length} de {materiais.length} materiais
          </p>
        </div>

        {materiaisFiltrados.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">
              {materiais.length === 0 ? 'Nenhum material cadastrado' : 'Nenhum material encontrado com os filtros aplicados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cpm-bg">
                <tr>
                  <th className="text-left p-4 text-gray-300">Material</th>
                  <th className="text-left p-4 text-gray-300">Quantidade</th>
                  <th className="text-left p-4 text-gray-300">Unidade</th>
                  <th className="text-left p-4 text-gray-300">Depósito</th>
                  <th className="text-left p-4 text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {materiaisFiltrados.map((material, index) => {
                  const quantidade = parseInt(material.quantidade) || 0;
                  const estoqueMinimo = parseInt(material.estoqueMinimo || '10') || 10;
                  const statusInfo = getStatusEstoque(quantidade, estoqueMinimo);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={index} className="border-b border-gray-700 hover:bg-cpm-bg/50">
                      <td className="p-4">
                        <div className="font-semibold text-white">{material.nome}</div>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${statusInfo.color}`}>{quantidade}</span>
                      </td>
                      <td className="p-4 text-gray-300">{material.unidade}</td>
                      <td className="p-4 text-gray-300">{material.deposito || 'N/A'}</td>
                      <td className="p-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg} w-fit`}>
                          <StatusIcon size={16} className={statusInfo.color} />
                          <span className={`text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
