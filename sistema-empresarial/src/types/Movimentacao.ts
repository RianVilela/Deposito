export type Movimentacao = {
  tipo: 'entrada' | 'saida';
  material: string;
  quantidade: number;
  data: string;
  destinoOuOrigem: string;
};
