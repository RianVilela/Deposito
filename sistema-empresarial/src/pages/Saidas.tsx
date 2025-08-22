
import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Package, MapPin, Trash2, Edit3 } from 'lucide-react';

interface Saida {
  id: string;
  material: string;
  quantidade: number;
  unidade: string;
  destino: string;
  data: string;
  responsavel: string;
  observacoes?: string;
}

export default function Saidas() {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [materiais, setMateriais] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [editingSaida, setEditingSaida] = useState<Saida | null>(null);
  
  const [formData, setFormData] = useState<Omit<Saida, 'id'>>({
    material: '',
    quantidade: 0,
    unidade: 'Kg',
    destino: '',
    data: new Date().toISOString().split('T')[0],
    responsavel: '',
    observacoes: ''
  });

  useEffect(() => {
    const saidasData = JSON.parse(localStorage.getItem('saidas') || '[]');
    const materiaisData = JSON.parse(localStorage.getItem('cadastros-Material') || '[]');
    setSaidas(saidasData);
    setMateriais(materiaisData);
  }, []);

  const salvarSaida = () => {
    if (editingSaida) {
      const novasSaidas = saidas.map(s => 
        s.id === editingSaida.id ? { ...formData, id: editingSaida.id } : s
      );
      setSaidas(novasSaidas);
      localStorage.setItem('saidas', JSON.stringify(novasSaidas));
    } else {
      const novaSaida: Saida = {
        ...formData,
        id: Date.now().toString()
      };
      const novasSaidas = [...saidas, novaSaida];
      setSaidas(novasSaidas);
      localStorage.setItem('saidas', JSON.stringify(novasSaidas));
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      material: '',
      quantidade: 0,
      unidade: 'Kg',
      destino: '',
      data: new Date().toISOString().split('T')[0],
      responsavel: '',
      observacoes: ''
    });
    setShowForm(false);
    setEditingSaida(null);
  };

  const excluirSaida = (id: string) => {
    const novasSaidas = saidas.filter(s => s.id !== id);
    setSaidas(novasSaidas);
    localStorage.setItem('saidas', JSON.stringify(novasSaidas));
  };

  const editarSaida = (saida: Saida) => {
    setFormData(saida);
    setEditingSaida(saida);
    setShowForm(true);
  };

  const saidasFiltradas = saidas.filter(saida => {
    const matchFiltro = saida.material.toLowerCase().includes(filtro.toLowerCase()) ||
                       saida.destino.toLowerCase().includes(filtro.toLowerCase()) ||
                       saida.responsavel.toLowerCase().includes(filtro.toLowerCase());
    
    const matchData = (!dataInicio || saida.data >= dataInicio) &&
                     (!dataFim || saida.data <= dataFim);
    
    return matchFiltro && matchData;
  });

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Saídas de Material</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cpm-red hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Saída
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-cpm-panel p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por material, destino ou responsável..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="p-2 bg-cpm-bg border border-gray-600 rounded"
              placeholder="Data início"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="p-2 bg-cpm-bg border border-gray-600 rounded"
              placeholder="Data fim"
            />
          </div>
        </div>
      </div>

      {/* Modal/Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cpm-panel p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingSaida ? 'Editar Saída' : 'Nova Saída'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Material</label>
                <select
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  required
                >
                  <option value="">Selecione um material</option>
                  {materiais.map((material, index) => (
                    <option key={index} value={material.nome}>
                      {material.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Quantidade</label>
                  <input
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({...formData, quantidade: parseFloat(e.target.value)})}
                    className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Unidade</label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                    className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Unidade">Unidade</option>
                    <option value="Metro">Metro</option>
                    <option value="Litro">Litro</option>
                    <option value="Saco">Saco</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2">Destino</label>
                <input
                  type="text"
                  value={formData.destino}
                  onChange={(e) => setFormData({...formData, destino: e.target.value})}
                  className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  placeholder="Ex: Obra ABC, Depósito Central..."
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Data</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Responsável</label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                  className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={salvarSaida}
                className="flex-1 bg-cpm-red hover:bg-red-700 py-2 rounded"
              >
                {editingSaida ? 'Atualizar' : 'Registrar'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Saídas */}
      <div className="bg-cpm-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cpm-bg">
              <tr>
                <th className="px-4 py-3 text-left">Material</th>
                <th className="px-4 py-3 text-left">Quantidade</th>
                <th className="px-4 py-3 text-left">Destino</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Responsável</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {saidasFiltradas.map((saida) => (
                <tr key={saida.id} className="border-b border-gray-700">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Package size={16} />
                    {saida.material}
                  </td>
                  <td className="px-4 py-3">{saida.quantidade} {saida.unidade}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {saida.destino}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(saida.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">{saida.responsavel}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editarSaida(saida)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => excluirSaida(saida.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {saidasFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Nenhuma saída encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
