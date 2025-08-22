// src/pages/Entrada/EntradaManualForm.tsx
import React, { useState } from 'react';

export default function EntradaManualForm() {
  const [form, setForm] = useState({
    material: '',
    quantidade: '',
    destino: '',
    data: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Entrada manual registrada:', form);
    // Aqui você pode salvar no localStorage ou enviar para um backend
    alert('Entrada registrada com sucesso!');
    setForm({ material: '', quantidade: '', destino: '', data: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cpm-panel p-6 rounded-lg shadow text-white space-y-4 max-w-xl">
      <div>
        <label className="block mb-1">Material</label>
        <input
          type="text"
          name="material"
          value={form.material}
          onChange={handleChange}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Quantidade</label>
        <input
          type="number"
          name="quantidade"
          value={form.quantidade}
          onChange={handleChange}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Destino (Depósito/Obra)</label>
        <input
          type="text"
          name="destino"
          value={form.destino}
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
          value={form.data}
          onChange={handleChange}
          className="w-full p-2 rounded bg-cpm-bg border border-gray-600"
          required
        />
      </div>

      <button type="submit" className="bg-cpm-red text-white px-4 py-2 rounded hover:bg-red-700">
        Registrar Entrada
      </button>
    </form>
  );
}
