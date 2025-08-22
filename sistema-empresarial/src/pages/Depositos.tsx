import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';

type Deposito = {
  id: string;
  nome: string;
  responsavel: string;
};

export default function Depositos() {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const navigate = useNavigate();

  // Carrega depósitos do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('cadastros-Depósito');
    if (dadosSalvos) {
      setDepositos(JSON.parse(dadosSalvos));
    }
  }, []);

  const handleDelete = (id: string) => {
    const dadosAtuais = depositos.filter(deposito => deposito.id !== id);
    setDepositos(dadosAtuais);
    localStorage.setItem('cadastros-Depósito', JSON.stringify(dadosAtuais));
  };

  const handleAccess = (id: string) => {
    navigate(`/deposito/${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Depósitos Cadastrados</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {depositos.map(deposito => (
          <div
            key={deposito.id} // chave única
            className="bg-cpm-panel p-4 rounded-lg shadow"
          >
            <h3 className="font-semibold text-white">{deposito.nome}</h3>
            <p className="text-gray-400">Responsável: {deposito.responsavel}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAccess(deposito.id)}
                className="bg-cpm-red text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Acessar Depósito
              </button>

              <button
                onClick={() => handleDelete(deposito.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
