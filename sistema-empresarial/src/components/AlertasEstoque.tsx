
import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Material {
  nome: string;
  quantidade: string;
  unidade: string;
  deposito?: string;
}

export default function AlertasEstoque() {
  const [materiaisComEstoqueBaixo, setMateriaisComEstoqueBaixo] = useState<Material[]>([]);

  useEffect(() => {
    const materiais = JSON.parse(localStorage.getItem('cadastros-Material') || '[]');
    const alertas = materiais.filter((material: Material) => {
      const quantidade = parseInt(material.quantidade) || 0;
      return quantidade < 10; // Considerando estoque baixo como menos de 10 unidades
    });
    setMateriaisComEstoqueBaixo(alertas);
  }, []);

  return (
    <section className="bg-cpm-panel p-6 rounded-xl shadow text-white">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-400" size={20} />
        Alertas de Estoque
      </h3>
      
      {materiaisComEstoqueBaixo.length === 0 ? (
        <div className="flex items-center gap-3">
          <div className="bg-green-900/30 text-green-300 p-3 rounded-full">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="font-semibold text-white">Nenhum alerta de estoque</p>
            <p className="text-sm text-gray-400">Todos os materiais estão em níveis adequados</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {materiaisComEstoqueBaixo.slice(0, 3).map((material, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-400/20">
              <div className="bg-yellow-900/30 text-yellow-300 p-2 rounded-full">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{material.nome}</p>
                <p className="text-sm text-yellow-300">
                  Estoque baixo: {material.quantidade} {material.unidade}
                  {material.deposito && ` - ${material.deposito}`}
                </p>
              </div>
            </div>
          ))}
          {materiaisComEstoqueBaixo.length > 3 && (
            <p className="text-sm text-gray-400 text-center">
              +{materiaisComEstoqueBaixo.length - 3} outros materiais com estoque baixo
            </p>
          )}
        </div>
      )}
    </section>
  );
}
