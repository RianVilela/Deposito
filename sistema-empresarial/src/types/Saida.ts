import { Produto } from './Produto';

export interface Saida {
  id: number;
  produto: Produto;
  quantidade: number;
  destino: string;
  dataSaida: string;
}
