import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import UsuariosPage from './pages/UsuariosPage';
import OperadoresPage from './pages/OperadoresPage';
import UnidadesPage from './pages/UnidadesPage';
import ClientesPage from './pages/ClientesPage';
import RutasPage from './pages/RutasPage';
import SeguimientoPage from './pages/SeguimientoPage';
import MiRutaPage from './pages/MiRutaPage';
import CombustiblePage from './pages/CombustiblePage';
import ReportesPage from './pages/ReportesPage';
import RespaldoPage from './pages/RespaldoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="operadores" element={<OperadoresPage />} />
          <Route path="unidades" element={<UnidadesPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="rutas" element={<RutasPage />} />
          <Route path="seguimiento" element={<SeguimientoPage />} />
          <Route path="mi-ruta" element={<MiRutaPage />} />
          <Route path="combustible" element={<CombustiblePage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="respaldo" element={<RespaldoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;