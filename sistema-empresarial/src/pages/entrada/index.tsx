import React, { useState } from 'react';
import EntradaManualForm from './EntradaManualForm';
import EntradaNotaFiscal from './EntradaNotaFiscal';

export default function Entrada() {
  const [modo, setModo] = useState<'manual' | 'nota' | null>(null);

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Registrar Entrada</h2>

      {!modo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <button
            onClick={() => setModo('manual')}
            className="bg-cpm-red p-6 rounded-lg shadow hover:bg-red-700 transition-colors"
          >
            <h3 className="text-xl font-semibold">Entrada Manual</h3>
            <p>Adicionar produtos recebidos manualmente</p>
          </button>

          <button
            onClick={() => setModo('nota')}
            className="bg-cpm-red p-6 rounded-lg shadow hover:bg-red-700 transition-colors"
          >
            <h3 className="text-xl font-semibold">Entrada por Nota Fiscal</h3>
            <p>Adicionar materiais recebidos por nota fiscal</p>
          </button>
        </div>
      )}

      {modo === 'manual' && (
        <div className="space-y-4 max-w-3xl">
          <button
            onClick={() => setModo(null)}
            className="text-sm underline text-gray-400 hover:text-gray-200"
          >
            ← Voltar
          </button>
          <EntradaManualForm />
        </div>
      )}

      {modo === 'nota' && (
        <div className="space-y-4 max-w-3xl">
          <button
            onClick={() => setModo(null)}
            className="text-sm underline text-gray-400 hover:text-gray-200"
          >
            ← Voltar
          </button>
          <EntradaNotaFiscal />
        </div>
      )}
    </div>
  );
}
