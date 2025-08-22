import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type Material = {
  nome: string;
  unidade: string;
  quantidade: string;
  deposito?: string; // depósito armazenado como nome (string)
};

export default function Estoque() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [depositos, setDepositos] = useState<string[]>([]); // lista nomes depósitos
  const [filtro, setFiltro] = useState('');
  const [modoEdicao, setModoEdicao] = useState<number | null>(null);
  const [materialEditado, setMaterialEditado] = useState<Material>({
    nome: '',
    unidade: 'Kg',
    quantidade: '',
    deposito: '',
  });

  useEffect(() => {
    const armazenadoMateriais = localStorage.getItem('cadastros-Material');
    if (armazenadoMateriais) {
      setMateriais(JSON.parse(armazenadoMateriais));
    }
    const armazenadoDepositos = localStorage.getItem('cadastros-Depósito');
    if (armazenadoDepositos) {
      const deps = JSON.parse(armazenadoDepositos).map((d: any) => d.nome);
      setDepositos(deps);
    }
  }, []);

  const salvarLocalStorage = (novos: Material[]) => {
    localStorage.setItem('cadastros-Material', JSON.stringify(novos));
  };

  const removerMaterial = (index: number) => {
    const atualizados = materiais.filter((_, i) => i !== index);
    setMateriais(atualizados);
    salvarLocalStorage(atualizados);
  };

  const iniciarEdicao = (index: number) => {
    setModoEdicao(index);
    setMaterialEditado(materiais[index]);
  };

  const cancelarEdicao = () => {
    setModoEdicao(null);
    setMaterialEditado({ nome: '', unidade: 'Kg', quantidade: '', deposito: '' });
  };

  const salvarEdicao = () => {
    if (modoEdicao === null) return;
    const atualizados = [...materiais];
    atualizados[modoEdicao] = materialEditado;
    setMateriais(atualizados);
    salvarLocalStorage(atualizados);
    cancelarEdicao();
  };

  const materiaisFiltrados = materiais.filter(m =>
    m.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Estoque de Materiais</h2>

      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="mb-4 px-4 py-2 rounded bg-cpm-panel text-white border border-cpm-bg w-full sm:w-96"
      />

      {materiaisFiltrados.length === 0 ? (
        <p className="text-gray-300">Nenhum material encontrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-cpm-bg shadow">
          <table className="min-w-full bg-cpm-panel text-white">
            <thead>
              <tr className="bg-cpm-bg text-left text-sm uppercase">
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Unidade</th>
                <th className="px-4 py-2">Quantidade</th>
                <th className="px-4 py-2">Depósito</th> {/* NOVO */}
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {materiaisFiltrados.map((material, index) => (
                <tr key={index} className="border-t border-cpm-bg">
                  {modoEdicao === index ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={materialEditado.nome}
                          onChange={e =>
                            setMaterialEditado(prev => ({ ...prev, nome: e.target.value }))
                          }
                          className="bg-cpm-bg text-white px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={materialEditado.unidade}
                          onChange={e =>
                            setMaterialEditado(prev => ({ ...prev, unidade: e.target.value }))
                          }
                          className="bg-cpm-bg text-white px-2 py-1 rounded w-full"
                        >
                          <option value="Kg">Kg</option>
                          <option value="L">L</option>
                          <option value="UN">UN</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={materialEditado.quantidade}
                          onChange={e =>
                            setMaterialEditado(prev => ({ ...prev, quantidade: e.target.value }))
                          }
                          className="bg-cpm-bg text-white px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={materialEditado.deposito || ''}
                          onChange={e =>
                            setMaterialEditado(prev => ({ ...prev, deposito: e.target.value }))
                          }
                          className="bg-cpm-bg text-white px-2 py-1 rounded w-full"
                        >
                          <option value="">Sem depósito definido</option>
                          {depositos.map((d, i) => (
                            <option key={i} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={salvarEdicao}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{material.nome}</td>
                      <td className="px-4 py-2">{material.unidade}</td>
                      <td className="px-4 py-2">{material.quantidade}</td>
                      <td className="px-4 py-2">{material.deposito || 'Sem depósito'}</td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => iniciarEdicao(index)}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => removerMaterial(index)}
                          className="text-red-400 hover:text-red-300"
                          title="Remover"
                        >
                          <Trash2 size={18} />
                        </button>
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
  );
}
