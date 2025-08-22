// src/pages/Entrada/EntradaNotaFiscal.tsx
import React, { useState } from 'react';

export default function EntradaNotaFiscal() {
  const [nota, setNota] = useState({
    numero: '',
    fornecedor: '',
    data: '',
    materiais: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNota(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nota fiscal registrada:', nota);
    // Aqui você pode salvar no localStorage ou enviar para um backend
    alert('Nota fiscal registrada com sucesso!');
    setNota({ numero: '', fornecedor: '', data: '', materiais: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cpm-panel p-6 rounded-lg shadow text-white space-y-4 max-w-xl">
      <div>
        <label className="block mb-1">Número da Nota</label>
        <input
          type="text"
          name="numero"
          value={nota.numero}
          onChange={handleChange}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Fornecedor</label>
        <input
          type="text"
          name="fornecedor"
          value={nota.fornecedor}
          onChange={handleChange}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Data</label>
        <input
          type="date"
          name="data"
          value={nota.data}
          onChange={handleChange}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Materiais (nome e quantidade)</label>
        <textarea
          name="materiais"
          value={nota.materiais}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          placeholder="Exemplo: Cimento - 20 sacos"
          required
        />
      </div>

      <button type="submit" className="bg-cpm-red text-white px-4 py-2 rounded hover:bg-red-700">
        Registrar Nota Fiscal
      </button>
    </form>
  );
}
