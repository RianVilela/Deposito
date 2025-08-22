
import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Calendar, Building, DollarSign, Eye, Trash2, Edit3 } from 'lucide-react';

interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  fornecedor: string;
  cnpjFornecedor: string;
  dataEmissao: string;
  dataRecebimento: string;
  valorTotal: number;
  materiais: {
    nome: string;
    quantidade: number;
    unidade: string;
    valorUnitario: number;
    valorTotal: number;
  }[];
  observacoes?: string;
  status: 'pendente' | 'recebida' | 'processada';
}

export default function NotasFiscais() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [materiais, setMateriais] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState<NotaFiscal | null>(null);
  const [editingNota, setEditingNota] = useState<NotaFiscal | null>(null);
  const [filtro, setFiltro] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState<Omit<NotaFiscal, 'id'>>({
    numero: '',
    serie: '',
    fornecedor: '',
    cnpjFornecedor: '',
    dataEmissao: '',
    dataRecebimento: new Date().toISOString().split('T')[0],
    valorTotal: 0,
    materiais: [],
    observacoes: '',
    status: 'recebida'
  });

  const [novoMaterial, setNovoMaterial] = useState({
    nome: '',
    quantidade: 0,
    unidade: 'Kg',
    valorUnitario: 0,
    valorTotal: 0
  });

  useEffect(() => {
    const notasData = JSON.parse(localStorage.getItem('notas-fiscais') || '[]');
    const fornecedoresData = JSON.parse(localStorage.getItem('cadastros-Fornecedor') || '[]');
    const materiaisData = JSON.parse(localStorage.getItem('cadastros-Material') || '[]');
    
    setNotas(notasData);
    setFornecedores(fornecedoresData);
    setMateriais(materiaisData);
  }, []);

  const adicionarMaterial = () => {
    if (novoMaterial.nome && novoMaterial.quantidade > 0) {
      const valorTotal = novoMaterial.quantidade * novoMaterial.valorUnitario;
      const materialCompleto = { ...novoMaterial, valorTotal };
      
      setFormData(prev => ({
        ...prev,
        materiais: [...prev.materiais, materialCompleto],
        valorTotal: prev.valorTotal + valorTotal
      }));

      setNovoMaterial({
        nome: '',
        quantidade: 0,
        unidade: 'Kg',
        valorUnitario: 0,
        valorTotal: 0
      });
    }
  };

  const removerMaterial = (index: number) => {
    const material = formData.materiais[index];
    setFormData(prev => ({
      ...prev,
      materiais: prev.materiais.filter((_, i) => i !== index),
      valorTotal: prev.valorTotal - material.valorTotal
    }));
  };

  const salvarNota = () => {
    if (editingNota) {
      const novasNotas = notas.map(n => 
        n.id === editingNota.id ? { ...formData, id: editingNota.id } : n
      );
      setNotas(novasNotas);
      localStorage.setItem('notas-fiscais', JSON.stringify(novasNotas));
    } else {
      const novaNota: NotaFiscal = {
        ...formData,
        id: Date.now().toString()
      };
      const novasNotas = [...notas, novaNota];
      setNotas(novasNotas);
      localStorage.setItem('notas-fiscais', JSON.stringify(novasNotas));
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      serie: '',
      fornecedor: '',
      cnpjFornecedor: '',
      dataEmissao: '',
      dataRecebimento: new Date().toISOString().split('T')[0],
      valorTotal: 0,
      materiais: [],
      observacoes: '',
      status: 'recebida'
    });
    setShowForm(false);
    setEditingNota(null);
  };

  const excluirNota = (id: string) => {
    const novasNotas = notas.filter(n => n.id !== id);
    setNotas(novasNotas);
    localStorage.setItem('notas-fiscais', JSON.stringify(novasNotas));
  };

  const editarNota = (nota: NotaFiscal) => {
    setFormData(nota);
    setEditingNota(nota);
    setShowForm(true);
  };

  const selecionarFornecedor = (fornecedorNome: string) => {
    const fornecedor = fornecedores.find(f => f.Nome === fornecedorNome);
    if (fornecedor) {
      setFormData(prev => ({
        ...prev,
        fornecedor: fornecedor.Nome,
        cnpjFornecedor: fornecedor.CNPJ
      }));
    }
  };

  const notasFiltradas = notas.filter(nota => {
    const matchFiltro = nota.numero.includes(filtro) ||
                       nota.fornecedor.toLowerCase().includes(filtro.toLowerCase()) ||
                       nota.cnpjFornecedor.includes(filtro);
    
    const matchStatus = !statusFilter || nota.status === statusFilter;
    
    return matchFiltro && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'text-yellow-400';
      case 'recebida': return 'text-blue-400';
      case 'processada': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notas Fiscais</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-cpm-red hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Nota Fiscal
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-cpm-panel p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por número, fornecedor ou CNPJ..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-cpm-bg border border-gray-600 rounded"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="recebida">Recebida</option>
            <option value="processada">Processada</option>
          </select>
        </div>
      </div>

      {/* Modal/Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cpm-panel p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingNota ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Número</label>
                    <input
                      type="text"
                      value={formData.numero}
                      onChange={(e) => setFormData({...formData, numero: e.target.value})}
                      className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Série</label>
                    <input
                      type="text"
                      value={formData.serie}
                      onChange={(e) => setFormData({...formData, serie: e.target.value})}
                      className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Fornecedor</label>
                  <select
                    value={formData.fornecedor}
                    onChange={(e) => selecionarFornecedor(e.target.value)}
                    className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                    required
                  >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map((fornecedor, index) => (
                      <option key={index} value={fornecedor.Nome}>
                        {fornecedor.Nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={formData.cnpjFornecedor}
                    className="w-full p-2 bg-cpm-bg border border-gray-600 rounded bg-gray-700"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Data Emissão</label>
                    <input
                      type="date"
                      value={formData.dataEmissao}
                      onChange={(e) => setFormData({...formData, dataEmissao: e.target.value})}
                      className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Data Recebimento</label>
                    <input
                      type="date"
                      value={formData.dataRecebimento}
                      onChange={(e) => setFormData({...formData, dataRecebimento: e.target.value})}
                      className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="recebida">Recebida</option>
                    <option value="processada">Processada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Adicionar Material</h4>
                
                <div>
                  <select
                    value={novoMaterial.nome}
                    onChange={(e) => setNovoMaterial({...novoMaterial, nome: e.target.value})}
                    className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                  >
                    <option value="">Selecione um material</option>
                    {materiais.map((material, index) => (
                      <option key={index} value={material.nome}>
                        {material.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Qtd"
                    value={novoMaterial.quantidade}
                    onChange={(e) => setNovoMaterial({...novoMaterial, quantidade: parseFloat(e.target.value)})}
                    className="p-2 bg-cpm-bg border border-gray-600 rounded"
                  />
                  <select
                    value={novoMaterial.unidade}
                    onChange={(e) => setNovoMaterial({...novoMaterial, unidade: e.target.value})}
                    className="p-2 bg-cpm-bg border border-gray-600 rounded"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Unidade">Un</option>
                    <option value="Metro">m</option>
                    <option value="Litro">L</option>
                    <option value="Saco">Saco</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Valor unit."
                    value={novoMaterial.valorUnitario}
                    onChange={(e) => setNovoMaterial({...novoMaterial, valorUnitario: parseFloat(e.target.value)})}
                    className="p-2 bg-cpm-bg border border-gray-600 rounded"
                  />
                </div>

                <button
                  onClick={adicionarMaterial}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                >
                  Adicionar Material
                </button>

                {/* Lista de materiais */}
                <div className="max-h-40 overflow-y-auto">
                  {formData.materiais.map((material, index) => (
                    <div key={index} className="flex justify-between items-center bg-cpm-bg p-2 rounded mb-2">
                      <div className="text-sm">
                        <div>{material.nome}</div>
                        <div className="text-gray-400">
                          {material.quantidade} {material.unidade} x R$ {material.valorUnitario.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">R$ {material.valorTotal.toFixed(2)}</span>
                        <button
                          onClick={() => removerMaterial(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-cpm-bg p-3 rounded">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Valor Total:</span>
                    <span className="text-green-400">R$ {formData.valorTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 mt-4">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={salvarNota}
                className="flex-1 bg-cpm-red hover:bg-red-700 py-2 rounded"
              >
                {editingNota ? 'Atualizar' : 'Salvar'}
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

      {/* Modal de Detalhes */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cpm-panel p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detalhes da Nota Fiscal</h3>
              <button
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Número:</span> {showDetails.numero}
                </div>
                <div>
                  <span className="text-gray-400">Série:</span> {showDetails.serie}
                </div>
                <div>
                  <span className="text-gray-400">Fornecedor:</span> {showDetails.fornecedor}
                </div>
                <div>
                  <span className="text-gray-400">CNPJ:</span> {showDetails.cnpjFornecedor}
                </div>
                <div>
                  <span className="text-gray-400">Data Emissão:</span> {new Date(showDetails.dataEmissao).toLocaleDateString('pt-BR')}
                </div>
                <div>
                  <span className="text-gray-400">Data Recebimento:</span> {new Date(showDetails.dataRecebimento).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Materiais:</h4>
                {showDetails.materiais.map((material, index) => (
                  <div key={index} className="bg-cpm-bg p-3 rounded mb-2">
                    <div className="flex justify-between">
                      <span>{material.nome}</span>
                      <span className="text-green-400">R$ {material.valorTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {material.quantidade} {material.unidade} x R$ {material.valorUnitario.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-cpm-bg p-3 rounded">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Valor Total:</span>
                  <span className="text-green-400">R$ {showDetails.valorTotal.toFixed(2)}</span>
                </div>
              </div>

              {showDetails.observacoes && (
                <div>
                  <span className="text-gray-400">Observações:</span>
                  <div className="mt-1">{showDetails.observacoes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Notas */}
      <div className="bg-cpm-panel rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cpm-bg">
              <tr>
                <th className="px-4 py-3 text-left">Número/Série</th>
                <th className="px-4 py-3 text-left">Fornecedor</th>
                <th className="px-4 py-3 text-left">Data Emissão</th>
                <th className="px-4 py-3 text-left">Valor Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map((nota) => (
                <tr key={nota.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      {nota.numero}/{nota.serie}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div>{nota.fornecedor}</div>
                      <div className="text-sm text-gray-400">{nota.cnpjFornecedor}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-green-400 font-semibold">
                    R$ {nota.valorTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`capitalize ${getStatusColor(nota.status)}`}>
                      {nota.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDetails(nota)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => editarNota(nota)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => excluirNota(nota.id)}
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

          {notasFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Nenhuma nota fiscal encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
