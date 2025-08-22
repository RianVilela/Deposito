import React from "react";

export default function AlertasEstoque() {
  return (
    <section className="bg-cpm-panel p-6 rounded-xl shadow text-white">
      <h3 className="text-lg font-bold mb-4">Alertas de Estoque</h3>
      <div className="flex items-center gap-3">
        <div className="bg-[#264f3b] text-green-300 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white">Nenhum alerta de estoque no momento</p>
          <p className="text-sm text-gray-400">Todos os materiais estão em níveis adequados</p>
        </div>
      </div>
    </section>
  );
}
