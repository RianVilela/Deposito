import React, { useState, useEffect } from 'react';
import { getFornecedores, getMateriais, getEstoques } from '../api/api';

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

const Relatorios = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);

  // Função para buscar os dados
  useEffect(() => {
    const fetchData = async () => {
      const fornecedoresData = await getFornecedores();
      const materiaisData = await getMateriais();
      const estoquesData = await getEstoques();

      // Atualiza os estados com os dados recebidos
      setFornecedores(fornecedoresData);
      setMateriais(materiaisData);
      setEstoques(estoquesData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Relatórios Detalhados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Fornecedores</h3>
          <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                <th>CNPJ</th>
                <th>Nome</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor) => (
                <tr key={fornecedor.CNPJ}>
                  <td>{fornecedor.CNPJ}</td>
                  <td>{fornecedor.Nome}</td>
                  <td>{fornecedor.Endereco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Materiais</h3>
          <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Unidade</th>
                <th>Estoque Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((material) => (
                <tr key={material.Nome}>
                  <td>{material.Nome}</td>
                  <td>{material.Unidade_de_Medida}</td>
                  <td>{material.Estoque_Minimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Estoques</h3>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th>Material</th>
              <th>Depósito</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {estoques.map((estoque) => (
              <tr key={estoque.ID_Estoque}>
                <td>{estoque.Material}</td>
                <td>{estoque.Deposito}</td>
                <td>{estoque.Quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Relatorios;
