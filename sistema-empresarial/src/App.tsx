import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Cadastro from './pages/Cadastro';
import Sidebar from './components/Sidebar';
import Estoque from './pages/Estoque';
import Entrada from './pages/entrada';
import Depositos from './pages/Depositos'; // Página de Depósitos
import NotasFiscais from './pages/NotasFiscais';
import Saidas from './pages/Saidas';
import Relatorios from './pages/Relatorios';
// import CadastroForm from './components/CadastroForm';
import DepositoUnico from './components/DepositoUnico';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-cpm-bg text-white ml-64 overflow-y-auto ">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/entrada" element={<Entrada />} />
          <Route path="/depositos" element={<Depositos />} /> 
          <Route path="/deposito/:depositoId" element={<DepositoUnico />} />
          <Route path="/notas" element={<NotasFiscais />} />
          <Route path="/saidas" element={<Saidas />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
