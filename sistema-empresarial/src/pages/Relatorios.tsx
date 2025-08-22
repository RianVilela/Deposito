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
    const dados = materiais.map(material => ({
      Material: material.nome,
      Quantidade: material.quantidade,
      Unidade: material.unidade,
      Depósito: material.deposito || 'Não especificado'
    }));

    console.table(dados);
    alert('Relatório de estoque gerado no console');
  };

  const gerarRelatorioFornecedores = () => {
    const dados = fornecedores.map(fornecedor => ({
      Nome: fornecedor.Nome,
      CNPJ: fornecedor.CNPJ,
      Telefone: fornecedor.Telefone,
      Email: fornecedor.Email
    }));

    console.table(dados);
    alert('Relatório de fornecedores gerado no console');
  };

  const gerarRelatorioDepositos = () => {
    const dados = depositos.map(deposito => ({
      Nome: deposito.nome,
      Responsável: deposito.responsavel,
      ID: deposito.id
    }));

    console.table(dados);
    alert('Relatório de depósitos gerado no console');
  };

  const gerarRelatorioMovimentacao = () => {
    const entradas = JSON.parse(localStorage.getItem('entradas') || '[]');
    const saidas = JSON.parse(localStorage.getItem('saidas') || '[]');

    const movimentacoes = [
      ...entradas.map((e: any) => ({
        Tipo: 'Entrada',
        Material: e.material,
        Quantidade: e.quantidade,
        Data: e.data,
        Local: e.destino
      })),
      ...saidas.map((s: any) => ({
        Tipo: 'Saída',
        Material: s.material,
        Quantidade: s.quantidade,
        Data: s.data,
        Local: s.destino
      }))
    ].filter((mov: any) => {
      if (!dataInicio && !dataFim) return true;
      const dataMovimentacao = new Date(mov.Data);
      const inicio = dataInicio ? new Date(dataInicio) : null;
      const fim = dataFim ? new Date(dataFim) : null;

      return (!inicio || dataMovimentacao >= inicio) && (!fim || dataMovimentacao <= fim);
    }).sort((a: any, b: any) => new Date(b.Data).getTime() - new Date(a.Data).getTime());

    console.table(movimentacoes);
    alert('Relatório de movimentação gerado no console');
  };

  const gerarRelatorioFinanceiro = () => {
    const notas = JSON.parse(localStorage.getItem('notas-fiscais') || '[]');

    const financeiro = notas
      .filter((nota: any) => {
        if (!dataInicio && !dataFim) return true;
        const dataNota = new Date(nota.dataEmissao);
        const inicio = dataInicio ? new Date(dataInicio) : null;
        const fim = dataFim ? new Date(dataFim) : null;

        return (!inicio || dataNota >= inicio) && (!fim || dataNota <= fim);
      })
      .map((nota: any) => ({
        'Nota Fiscal': nota.numero,
        Fornecedor: nota.fornecedor,
        'Data Emissão': nota.dataEmissao,
        'Valor Total': `R$ ${nota.valorTotal.toFixed(2)}`,
        Status: nota.status
      }));

    const totalGasto = notas
      .filter((nota: any) => {
        if (!dataInicio && !dataFim) return true;
        const dataNota = new Date(nota.dataEmissao);
        const inicio = dataInicio ? new Date(dataInicio) : null;
        const fim = dataFim ? new Date(dataFim) : null;

        return (!inicio || dataNota >= inicio) && (!fim || dataNota <= fim);
      })
      .reduce((total: number, nota: any) => total + nota.valorTotal, 0);

    console.table(financeiro);
    console.log(`Total gasto no período: R$ ${totalGasto.toFixed(2)}`);
    alert(`Relatório financeiro gerado no console. Total: R$ ${totalGasto.toFixed(2)}`);
  };

  const exportarDados = () => {
    const dados = {
      materiais,
      fornecedores,
      depositos,
      entradas: JSON.parse(localStorage.getItem('entradas') || '[]'),
      saidas: JSON.parse(localStorage.getItem('saidas') || '[]'),
      notasFiscais: JSON.parse(localStorage.getItem('notas-fiscais') || '[]')
    };

    const dataStr = JSON.stringify(dados, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `backup-sistema-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Relatórios e Exportações</h2>

      {/* Configurações de Período */}
      <div className="bg-cpm-panel p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Período para Relatórios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full p-2 bg-cpm-bg border border-gray-600 rounded"
            />
          </div>
        </div>
      </div>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-cpm-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Package size={24} className="text-blue-400" />
            <h3 className="text-lg font-semibold">Relatório de Estoque</h3>
          </div>
          <p className="text-gray-400 mb-4">Lista completa de todos os materiais em estoque com quantidades e localizações.</p>
          <button
            onClick={gerarRelatorioEstoque}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <BarChart3 size={16} />
            Gerar Relatório
          </button>
        </div>

        <div className="bg-cpm-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-green-400" />
            <h3 className="text-lg font-semibold">Relatório de Fornecedores</h3>
          </div>
          <p className="text-gray-400 mb-4">Listagem completa de fornecedores cadastrados com suas informações de contato.</p>
          <button
            onClick={gerarRelatorioFornecedores}
            className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <FileText size={16} />
            Gerar Relatório
          </button>
        </div>

        <div className="bg-cpm-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Warehouse size={24} className="text-purple-400" />
            <h3 className="text-lg font-semibold">Relatório de Depósitos</h3>
          </div>
          <p className="text-gray-400 mb-4">Lista de todos os depósitos cadastrados com seus responsáveis.</p>
          <button
            onClick={gerarRelatorioDepositos}
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <BarChart3 size={16} />
            Gerar Relatório
          </button>
        </div>

        <div className="bg-cpm-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-orange-400" />
            <h3 className="text-lg font-semibold">Relatório de Movimentação</h3>
          </div>
          <p className="text-gray-400 mb-4">Histórico de entradas e saídas de materiais no período selecionado.</p>
          <button
            onClick={gerarRelatorioMovimentacao}
            className="w-full bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <BarChart3 size={16} />
            Gerar Relatório
          </button>
        </div>

        <div className="bg-cpm-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-yellow-400" />
            <h3 className="text-lg font-semibold">Relatório Financeiro</h3>
          </div>
          <p className="text-gray-400 mb-4">Resumo financeiro baseado nas notas fiscais do período selecionado.</p>
          <button
            onClick={gerarRelatorioFinanceiro}
            className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <BarChart3 size={16} />
            Gerar Relatório
          </button>
        </div>

        <div className="bg-cpm-panel p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Download size={24} className="text-cpm-red" />
            <h3 className="text-lg font-semibold">Backup Completo</h3>
          </div>
          <p className="text-gray-400 mb-4">Exportar todos os dados do sistema em formato JSON para backup.</p>
          <button
            onClick={exportarDados}
            className="w-full bg-cpm-red hover:bg-red-700 py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Exportar Dados
          </button>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="bg-cpm-panel p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Resumo do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{materiais.length}</div>
            <div className="text-gray-400">Materiais</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{fornecedores.length}</div>
            <div className="text-gray-400">Fornecedores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{depositos.length}</div>
            <div className="text-gray-400">Depósitos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {JSON.parse(localStorage.getItem('notas-fiscais') || '[]').length}
            </div>
            <div className="text-gray-400">Notas Fiscais</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        * Os relatórios são exibidos no console do navegador (pressione F12 para visualizar)
      </div>
    </div>
  );
}