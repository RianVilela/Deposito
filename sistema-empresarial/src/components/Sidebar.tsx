import React from 'react';
import { Home, FileText, TrendingUp, BarChart, Plus, User, Warehouse, Inbox, Box } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-cpm-panel border-r border-cpm-bg p-6 flex flex-col fixed top-0 left-0">
      <h1 className="text-xl font-bold mb-10 text-white">Sistema Estoque</h1>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <Home size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/cadastro"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <Plus size={20} />
          Cadastro
        </NavLink>

        <NavLink
          to="/notas"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <FileText size={20} />
          Notas Fiscais
        </NavLink>

        <NavLink
          to="/entrada"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <Inbox size={20} />
          Entrada
        </NavLink>

        <NavLink
          to="/saidas"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <TrendingUp size={20} />
          Saídas
        </NavLink>

        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <BarChart size={20} />
          Relatórios
        </NavLink>

        <NavLink
          to="/estoque"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <Box size={20} />
          Estoque
        </NavLink>

        <NavLink
          to="/depositos"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition duration-200 ${
              isActive ? 'text-cpm-red' : 'text-white hover:bg-cpm-bg hover:text-white'
            }`
          }
        >
          <Warehouse size={20} />
          Depósitos
        </NavLink>
      </nav>

      <div className="mt-auto text-sm text-gray-400 pt-6 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <User size={18} className="text-gray-300" />
          <div>
            <p className="font-semibold text-gray-300">Admin</p>
            <p>Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
