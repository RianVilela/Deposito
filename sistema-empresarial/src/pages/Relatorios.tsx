
import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, BarChart3, Package, Users, Warehouse } from 'lucide-react';

interface Material {
  nome: string;
  quantidade: string;
  unidade: string;
  deposito?: string;
}

interface Fornecedor {
  CNPJ: string;
  Nome: string;
  Endereco: string;
  Telefone: string;
  Email: string;
}

export default function Relatorios() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [depositos, setDepositos] = useState<any[]>([]);
  const [tipoRelatorio, setTipoRelatorio] = useState('estoque');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const materiaisData = JSON.parse(localStorage.getItem('cadastros-Material') || '[]');
    const fornecedoresData = JSON.parse(localStorage.getItem('cadastros-Fornecedor') || '[]');
    const depositosData = JSON.parse(localStorage.getItem('cadastros-Depósito') || '[]');
    
    setMateriais(materiaisData);
    setFornecedores(fornecedoresData);
    setDepositos(depositosData);

    // Definir datas padrão (último mês)
    const hoje = new Date();
    const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
    setDataFim(hoje.toISOString().split('T')[0]);
    setDataInicio(umMesAtras.toISOString().split('T')[0]);
  }, []);

  const gerarRelatorioEstoque = () => {
    const materiaisComEstoqueBaixo = materiais.filter(m => parseInt(m.quantidade) < 10);
    const materiaisSemEstoque = materiais.filter(m => parseInt(m.quantidade) === 0);
    
    return {
      titulo: 'Relatório de Estoque',
      dados: {
        totalMateriais: materiais.length,
        materiaisComEstoqueBaixo: materiaisComEstoqueBaixo.length,
        materiaisSemEstoque: materiaisSemEstoque.length,
        valorTotalEstimado: 'R$ 0,00' // Placeholder
      },
      detalhes: materiais
    };
  };

  const gerarRelatorioFornecedores = () => {
    return {
      titulo: 'Relatório de Fornecedores',
      dados: {
        totalFornecedores: fornecedores.length,
        fornecedoresAtivos: fornecedores.length,
        fornecedoresInativos: 0
      },
      detalhes: fornecedores
    };
  };

  const gerarRelatorioDepositos = () => {
    return {
      titulo: 'Relatório de Depósitos',
      dados: {
        totalDepositos: depositos.length,
        depositosAtivos: depositos.length,
        ocupacaoMedia: '75%' // Placeholder
      },
      detalhes: depositos
    };
  };

  const obterDadosRelatorio = () => {
    switch (tipoRelatorio) {
      case 'estoque':
        return gerarRelatorioEstoque();
      case 'fornecedores':
        return gerarRelatorioFornecedores();
      case 'depositos':
        return gerarRelatorioDepositos();
      default:
        return gerarRelatorioEstoque();
    }
  };

  const exportarRelatorio = () => {
    const relatorio = obterDadosRelatorio();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    let conteudo = `${relatorio.titulo}\nData: ${dataAtual}\nPeríodo: ${dataInicio} a ${dataFim}\n\n`;
    
    // Adicionar resumo
    Object.entries(relatorio.dados).forEach(([chave, valor]) => {
      conteudo += `${chave}: ${valor}\n`;
    });
    
    conteudo += '\n--- Detalhes ---\n\n';
    
    // Adicionar detalhes baseado no tipo
    if (tipoRelatorio === 'estoque') {
      relatorio.detalhes.forEach((item: Material) => {
        conteudo += `${item.nome} - ${item.quantidade} ${item.unidade} - ${item.deposito || 'N/A'}\n`;
      });
    } else if (tipoRelatorio === 'fornecedores') {
      relatorio.detalhes.forEach((item: Fornecedor) => {
        conteudo += `${item.Nome} - ${item.CNPJ} - ${item.Telefone}\n`;
      });
    }
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const relatorioAtual = obterDadosRelatorio();

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="text-blue-400" />
          Relatórios
        </h2>
        <button
          onClick={exportarRelatorio}
          className="bg-cpm-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download size={20} />
          Exportar
        </button>
      </div>

      {/* Filtros de Relatório */}
      <div className="bg-cpm-panel p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Relatório</label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full bg-cpm-bg border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cpm-red focus:outline-none"
            >
              <option value="estoque">Relatório de Estoque</option>
              <option value="fornecedores">Relatório de Fornecedores</option>
              <option value="depositos">Relatório de Depósitos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full bg-cpm-bg border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cpm-red focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full bg-cpm-bg border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cpm-red focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <BarChart3 size={20} />
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Resumo do Relatório */}
      <div className="bg-cpm-panel p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="text-blue-400" />
          {relatorioAtual.titulo}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(relatorioAtual.dados).map(([chave, valor], index) => {
            const icons = [Package, Users, Warehouse, BarChart3];
            const colors = ['text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400'];
            const Icon = icons[index % icons.length];
            const color = colors[index % colors.length];
            
            return (
              <div key={chave} className="bg-cpm-bg p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={color} size={24} />
                  <div>
                    <p className="text-2xl font-bold text-white">{valor}</p>
                    <p className="text-sm text-gray-400 capitalize">{chave.replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dados Detalhados */}
      <div className="bg-cpm-panel rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Dados Detalhados</h3>
        </div>

        {relatorioAtual.detalhes.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">Nenhum dado disponível para este relatório</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cpm-bg">
                <tr>
                  {tipoRelatorio === 'estoque' && (
                    <>
                      <th className="text-left p-4 text-gray-300">Material</th>
                      <th className="text-left p-4 text-gray-300">Quantidade</th>
                      <th className="text-left p-4 text-gray-300">Unidade</th>
                      <th className="text-left p-4 text-gray-300">Depósito</th>
                    </>
                  )}
                  {tipoRelatorio === 'fornecedores' && (
                    <>
                      <th className="text-left p-4 text-gray-300">Nome</th>
                      <th className="text-left p-4 text-gray-300">CNPJ</th>
                      <th className="text-left p-4 text-gray-300">Telefone</th>
                      <th className="text-left p-4 text-gray-300">Email</th>
                    </>
                  )}
                  {tipoRelatorio === 'depositos' && (
                    <>
                      <th className="text-left p-4 text-gray-300">Nome</th>
                      <th className="text-left p-4 text-gray-300">Localização</th>
                      <th className="text-left p-4 text-gray-300">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {relatorioAtual.detalhes.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-cpm-bg/50">
                    {tipoRelatorio === 'estoque' && (
                      <>
                        <td className="p-4 text-white font-medium">{item.nome}</td>
                        <td className="p-4 text-gray-300">{item.quantidade}</td>
                        <td className="p-4 text-gray-300">{item.unidade}</td>
                        <td className="p-4 text-gray-300">{item.deposito || 'N/A'}</td>
                      </>
                    )}
                    {tipoRelatorio === 'fornecedores' && (
                      <>
                        <td className="p-4 text-white font-medium">{item.Nome}</td>
                        <td className="p-4 text-gray-300">{item.CNPJ}</td>
                        <td className="p-4 text-gray-300">{item.Telefone}</td>
                        <td className="p-4 text-gray-300">{item.Email}</td>
                      </>
                    )}
                    {tipoRelatorio === 'depositos' && (
                      <>
                        <td className="p-4 text-white font-medium">{item.nome || 'N/A'}</td>
                        <td className="p-4 text-gray-300">{item.localizacao || 'N/A'}</td>
                        <td className="p-4">
                          <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded-full text-sm">
                            Ativo
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
