import React from 'react';

interface Field {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  options?: string[]; // Para campos de seleção
}

interface CadastroFormProps {
  tipo: string;
  campos: Field[];
  onSubmit: (novo: Record<string, string>) => void;
  onCancel?: () => void;
}

export default function CadastroForm({
  tipo,
  campos,
  onSubmit,
  onCancel,
}: CadastroFormProps) {
  // Inicializa formData com os valores padrão para campos que têm opções (select)
  const initialFormData: Record<string, string> = {};
  campos.forEach(field => {
    if (field.options && field.options.length > 0) {
      initialFormData[field.name] = field.options[0]; // pega o primeiro valor como padrão
    }
  });

  const [formData, setFormData] = React.useState<Record<string, string>>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormData); // reseta o formulário para o estado inicial (com defaults)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-cpm-panel text-white p-6 rounded-xl shadow w-full max-w-4xl"
    >
      <h2 className="text-xl font-bold mb-6">Cadastrar novo {tipo}</h2>

      {campos.map(field => (
        <div className="mb-4" key={field.name}>
          <label className="block text-sm text-gray-300 mb-1">{field.label}</label>

          {field.options ? (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full p-2 rounded bg-cpm-bg text-white border border-cpm-panel
                         focus:outline-none focus:ring-2 focus:ring-cpm-red hover:shadow hover:shadow-cpm-shadow/30 transition"
              required
            >
              {field.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full p-2 rounded bg-cpm-bg text-white border border-cpm-panel
                         focus:outline-none focus:ring-2 focus:ring-cpm-red hover:shadow hover:shadow-cpm-shadow/30 transition"
              required
            />
          )}
        </div>
      ))}

      <div className="flex justify-end gap-2 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Voltar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-cpm-red text-white rounded hover:bg-red-700 transition"
        >
          Salvar {tipo}
        </button>
      </div>
    </form>
  );
}
