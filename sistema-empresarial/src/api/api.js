// src/api/api.js
import axios from 'axios';

// Definir a URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:3206/api/', // Altere conforme necessário
});

// Função para pegar todos os fornecedores
export const getFornecedores = async () => {
  try {
    const response = await api.get('fornecedores');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return [];
  }
};

// Função para pegar todos os materiais
export const getMateriais = async () => {
  try {
    const response = await api.get('materiais');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    return [];
  }
};

// Função para pegar os estoques
export const getEstoques = async () => {
  try {
    const response = await api.get('estoques');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estoques:', error);
    return [];
  }
};
