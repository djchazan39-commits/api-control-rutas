import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatosProvider } from './context/DatosContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import UsuariosPage from './pages/UsuariosPage';
import OperadoresPage from './pages/OperadoresPage';
import UnidadesPage from './pages/UnidadesPage';
import ClientesPage from './pages/ClientesPage';
import RutasPage from './pages/RutasPage';
import MiRutaPage from './pages/MiRutaPage';
import SeguimientoPage from './pages/SeguimientoPage';
import ReportesPage from './pages/ReportesPage';
import RespaldoPage from './pages/RespaldoPage';
import CombustiblePage from './pages/CombustiblePage';
import './index.css';

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const sesion = localStorage.getItem('usuarioActivo');
  if (!sesion) return <Navigate to="/" replace />;
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatosProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <RutaProtegida>
              <Layout />
            </RutaProtegida>
          }>
            <Route index element={<Dashboard />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="operadores" element={<OperadoresPage />} />
            <Route path="unidades" element={<UnidadesPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="rutas" element={<RutasPage />} />
            <Route path="mi-ruta" element={<MiRutaPage />} />
            <Route path="seguimiento" element={<SeguimientoPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="respaldo" element={<RespaldoPage />} />
            <Route path="combustible" element={<CombustiblePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DatosProvider>
  </React.StrictMode>
);