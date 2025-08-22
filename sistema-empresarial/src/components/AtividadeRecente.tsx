import React from "react";

export default function AtividadeRecente() {
  return (
    <section className="bg-cpm-panel p-6 rounded-xl shadow text-white">
      <h3 className="text-lg font-bold mb-4">Atividade Recente</h3>

      <div className="flex items-start gap-3 mb-3">
        <div className="bg-[#2e3a54] text-blue-300 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 000 4z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white">Sistema iniciado</p>
          <p className="text-sm text-gray-400">Pronto para uso</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="bg-[#264f3b] text-green-300 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white">Configuração inicial completa</p>
          <p className="text-sm text-gray-400">Sistema configurado e funcional</p>
        </div>
      </div>
    </section>
  );
}
