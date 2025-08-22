import React from 'react';
import { Warehouse, Hammer, Truck, Package } from 'lucide-react';

interface CadastroCardProps {
  tipo: string;
  generoTipo: string;
  onClick?: () => void;
}

export default function CadastroCard({ tipo, generoTipo, onClick }: CadastroCardProps) {
  const artigo = generoTipo === 'a' ? 'uma' : 'um'; //se o generoTipo for "a" a palavra retornada é uma, se não é um
  const novo = generoTipo === 'a' ? 'nova' : 'novo'; //se o generoTipo for "a" a palavra retornada é nova, se não é novo

  const icones: Record<string, JSX.Element> = {
    Depósito: <Warehouse size={32} className="text-cpm-red" />,
    Obra: <Hammer size={32} className="text-cpm-red" />,
    Fornecedor: <Truck size={32} className="text-cpm-red" />,
    Material: <Package size={32} className="text-cpm-red" />,
  };

  return (
    <div className="bg-cpm-panel p-6 rounded-xl shadow text-white flex flex-col justify-between">
      <div>
        <div className="mb-4">{icones[tipo]}</div>
        <h3 className="text-lg font-bold mb-2">Cadastrar {novo} {tipo}</h3>
        <p className="text-sm text-gray-400">
          Adicionar {artigo} {novo} {tipo.toLowerCase()} ao sistema.
        </p>
      </div>
      <button
        onClick={onClick}
        className="mt-6 bg-cpm-red hover:bg-red-700 transition text-white py-2 px-4 rounded"
      >
        Adicionar {tipo}
      </button>
    </div>
  );
}
