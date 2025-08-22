import React, { useState, useEffect } from 'react';
import { getFornecedores, getMateriais, getEstoques } from '../api/api'; // Importando as funções da API
import Card from '../components/Card';
import AtividadeRecente from '../components/AtividadeRecente'; 
import AlertasEstoque from '../components/AlertasEstoque';
import EstatisticasRapidas from '../components/EstatisticasRapidas';
import { Users, Package, Warehouse, TrendingUp } from 'lucide-react';

// Tipagem dos dados que esperamos da API
interface Fornecedor {
  CNPJ: string;
  Nome: string;
  Endereco: string;
  Telefone: string;
  Email: string;
}

interface Material {
  Nome: string;
  Unidade_de_Medida: string;
  Estoque_Minimo: number;
}

interface Estoque {
  ID_Estoque: number;
  Material: string;
  Deposito: string;
  Quantidade: number;
}

export default function Dashboard() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);

  // Estado para armazenar os dados do mês anterior
  const [previousData, setPreviousData] = useState<{
    fornecedores: number;
    materiais: number;
    estoques: number;
  }>({
    fornecedores: 0,
    materiais: 0,
    estoques: 0,
  });

  // Função para calcular a variação percentual
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Função para buscar os dados da API quando o componente for montado
  useEffect(() => {
    const fetchData = async () => {
      const fornecedoresData = await getFornecedores();
      const materiaisData = await getMateriais();
      const estoquesData = await getEstoques();

      // Atualiza os estados com os dados recebidos
      setFornecedores(fornecedoresData);
      setMateriais(materiaisData);
      setEstoques(estoquesData);

      // Atualiza os dados do mês anterior
      setPreviousData({
        fornecedores: fornecedoresData.length,
        materiais: materiaisData.length,
        estoques: estoquesData.length,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <EstatisticasRapidas />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="Total de Fornecedores" 
          value={fornecedores.length.toString()}
          delta={`${calculatePercentageChange(fornecedores.length, previousData.fornecedores).toFixed(2)}`} 
          color="text-yellow-400"
          icon={<Users size={24} />}
        />
        <Card 
          title="Total de Materiais" 
          value={materiais.length.toString()}
          delta={`${calculatePercentageChange(materiais.length, previousData.materiais).toFixed(2)}`} 
          color="text-green-400"
          icon={<Package size={24} />}
        />
        <Card 
          title="Estoques Ativos" 
          value={estoques.length.toString()}
          delta={`${calculatePercentageChange(estoques.length, previousData.estoques).toFixed(2)}`} 
          color="text-purple-400"
          icon={<Warehouse size={24} />}
        />
        <Card 
          title="Valor Total" 
          value="R$ 0,00"
          delta="0.00" 
          color="text-blue-400"
          icon={<TrendingUp size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AtividadeRecente />  {/* Exibe a atividade recente */}
        <AlertasEstoque />    {/* Exibe os alertas de estoque */}
      </div>
    </div>
  );
}
