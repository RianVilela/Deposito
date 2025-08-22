import React, { useState, useEffect } from 'react';
import CadastroCard from '../components/CadastroCard';
import CadastroForm from '../components/CadastroForm';
import PlanilhaCadastro from '../components/PlanilhaCadastro';

type Deposito = {
  id: string;
  nome: string;
  responsavel: string;
};

export default function Cadastro() {
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [dadosPorTipo, setDadosPorTipo] = useState<Record<string, Record<string, string>[]>>({});
  const [depositos, setDepositos] = useState<Deposito[]>([]);

  const tipos = [
    { tipo: 'Depósito', genero: 'o' },
    { tipo: 'Obra', genero: 'a' },
    { tipo: 'Fornecedor', genero: 'o' },
    { tipo: 'Material', genero: 'o' },
  ];

  // Carregar depósitos do localStorage
  useEffect(() => {
    const armazenados = localStorage.getItem('cadastros-Depósito');
    if (armazenados) {
      setDepositos(JSON.parse(armazenados));
    }
  }, []);

  // Campos por tipo de cadastro
  const camposPorTipo: Record<string, { label: string; name: string; options?: string[] }[]> = {
    'Depósito': [
      { label: 'Nome do depósito', name: 'nome' },
      { label: 'Responsável', name: 'responsavel' },
    ],
    'Obra': [
      { label: 'Nome da obra', name: 'nome' },
      { label: 'Endereço', name: 'endereco' },
    ],
    'Fornecedor': [
      { label: 'Nome do fornecedor', name: 'nome' },
      { label: 'CNPJ', name: 'cnpj' },
    ],
    'Material': [
      { label: 'Nome do material', name: 'nome' },
      { label: 'Unidade', name: 'unidade', options: ['Kg', 'L', 'UN'] },
      { label: 'Quantidade Inicial', name: 'quantidade' },
      {
        label: 'Depósito',
        name: 'deposito',
        options: ['Sem depósito definido', ...depositos.map(dep => dep.nome)],
      },
    ],
  };

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const dados: Record<string, Record<string, string>[]> = {};
    tipos.forEach(({ tipo }) => {
      const armazenado = localStorage.getItem(`cadastros-${tipo}`);
      dados[tipo] = armazenado ? JSON.parse(armazenado) : [];
    });
    setDadosPorTipo(dados);
  }, [depositos]);

  // Função para salvar novo registro
  const salvarNovo = (tipo: string, novo: Record<string, string>) => {
    if (tipo === 'Depósito') {
      // Adiciona id único
      novo.id = Date.now().toString();
      setDepositos(prev => [...prev, novo as Deposito]);
      localStorage.setItem('cadastros-Depósito', JSON.stringify([...depositos, novo]));
    }

    const atualizados = [...(dadosPorTipo[tipo] || []), novo];
    setDadosPorTipo(prev => ({ ...prev, [tipo]: atualizados }));
    localStorage.setItem(`cadastros-${tipo}`, JSON.stringify(atualizados));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Cadastro</h2>

      {!tipoSelecionado && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tipos.map(({ tipo, genero }) => (
            <CadastroCard
              key={tipo}
              tipo={tipo}
              generoTipo={genero}
              onClick={() => setTipoSelecionado(tipo)}
            />
          ))}
        </div>
      )}

      {tipoSelecionado && (
        <div className="flex flex-col gap-8">
          <CadastroForm
            tipo={tipoSelecionado}
            campos={camposPorTipo[tipoSelecionado]}
            onCancel={() => setTipoSelecionado(null)}
            onSubmit={(novo) => salvarNovo(tipoSelecionado, novo)}
          />

          <PlanilhaCadastro
            tipo={tipoSelecionado}
            campos={camposPorTipo[tipoSelecionado]}
            dados={dadosPorTipo[tipoSelecionado] || []}
          />
        </div>
      )}
    </div>
  );
}
