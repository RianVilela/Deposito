import React from "react";

interface Field {
  label: string;
  name: string;
}

interface PlanilhaCadastroProps {
  tipo: string;
  campos: Field[];
  dados: Record<string, string>[];
}

export default function PlanilhaCadastro({ tipo, campos, dados }: PlanilhaCadastroProps) {
  if (dados.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">{tipo}s cadastrados</h3>
      <div className="overflow-auto rounded border border-scroll-bar">
        <table className="w-full text-left text-sm">
          <thead className="bg-cpm-bg text-gray-400">
            <tr>
              {campos.map(field => (
                <th key={field.name} className="px-4 py-2 border-b border-scroll-bar">
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index} className="hover:bg-scroll-bar">
                {campos.map(field => (
                  <td key={field.name} className="px-4 py-2 border-b border-scroll-bar">
                    {item[field.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
