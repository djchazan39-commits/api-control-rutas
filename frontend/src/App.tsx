import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ NOMBRE EXACTO: ProveedorDatos (como dice en tu archivo)
import { ProveedorDatos } from "./context/DatosContext";
import BienvenidaPage from "./pages/BienvenidaPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import OperadoresPage from "./pages/OperadoresPage";
import UnidadesPage from "./pages/UnidadesPage";
import ClientesPage from "./pages/ClientesPage";
import RutasPage from "./pages/RutasPage";
import MiRutaPage from "./pages/MiRutaPage";
import SeguimientoPage from "./pages/SeguimientoPage";
import UsuariosPage from "./pages/UsuariosPage";
import RespaldoPage from "./pages/RespaldoPage";
import ReportesPage from "./pages/ReportesPage";
import CombustiblePage from "./pages/CombustiblePage";

export default function App() {
  return (
    // ✅ NOMBRE EXACTO: <ProveedorDatos>
    <ProveedorDatos>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bienvenida" element={<BienvenidaPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/operadores" element={<OperadoresPage />} />
          <Route path="/unidades" element={<UnidadesPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/rutas" element={<RutasPage />} />
          <Route path="/mi-ruta" element={<MiRutaPage />} />
          <Route path="/seguimiento" element={<SeguimientoPage />} />
          <Route path="/combustible" element={<CombustiblePage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/respaldo" element={<RespaldoPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ProveedorDatos>
  );
}