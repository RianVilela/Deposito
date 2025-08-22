export interface Fornecedor {
  CNPJ: string;
  Nome: string;
  Endereco: string;
  Telefone: string;
  Email: string;
}

export interface Material {
  Nome: string;
  Unidade_de_Medida: string;
  Estoque_Minimo: number;
}

export interface Estoque {
  ID_Estoque: number;
  Material: string;
  Deposito: string;
  Quantidade: number;
}

// Declaração das funções
export const getFornecedores: () => Promise<Fornecedor[]>;
export const getMateriais: () => Promise<Material[]>;
export const getEstoques: () => Promise<Estoque[]>;
