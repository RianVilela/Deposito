import { Produto } from './Produto';

export interface NotaFiscal {
  id: number;
  numero: string;
  dataEmissao: string; // formato ISO, ex: '2025-08-01'
  fornecedor: string;
  produtos: Produto[];
  valorTotal: number;
}
