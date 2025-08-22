export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  quantidade: number;
  unidade: 'un' | 'kg' | 'l';
  precoUnitario: number;
}
