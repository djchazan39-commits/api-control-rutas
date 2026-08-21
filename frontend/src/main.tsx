import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatosProvider } from './context/DatosContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';  // ✅ Tu archivo existe, úsalo
import UsuariosPage from './pages/UsuariosPage';
import OperadoresPage from './pages/OperadoresPage';
import UnidadesPage from './pages/UnidadesPage';
import ClientesPage from './pages/ClientesPage';
import RutasPage from './pages/RutasPage';
import MiRutaPage from './pages/MiRutaPage';
import SeguimientoPage from './pages/SeguimientoPage';
import ReportesPage from './pages/ReportesPage';
import RespaldoPage from './pages/RespaldoPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <DatosProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* ✅ Layout = Encabezado + Menú abajo */}
        <Route path="/dashboard" element={<Layout />}>
          {/* ✅ Página principal del menú */}
          <Route index element={<Dashboard />} />
          
          {/* ✅ Los formularios */}
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="operadores" element={<OperadoresPage />} />
          <Route path="unidades" element={<UnidadesPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="rutas" element={<RutasPage />} />
          <Route path="mi-ruta" element={<MiRutaPage />} />
          <Route path="seguimiento" element={<SeguimientoPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="respaldo" element={<RespaldoPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </DatosProvider>
);