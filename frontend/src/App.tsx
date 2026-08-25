import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// ✅ CAMBIA "ProveedorDatos" → "DatosProvider"
import { DatosProvider } from "./context/DatosContext";


// ✅ NOMBRES CORRECTOS de tus archivos
import LoginPage from "./pages/LoginPage";
import BienvenidaPage from "./pages/BienvenidaPage";
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
    // ✅ CAMBIA <ProveedorDatos> → <DatosProvider>
    <DatosProvider>
      <Router>
        <Routes>
          {/* ✅ PANTALLA DE ENTRADA */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* ✅ PANTALLA DE BIENVENIDA */}
          <Route path="/bienvenida" element={<BienvenidaPage />} />
          
          {/* ✅ PANTALLA PRINCIPAL CON BOTONES */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* ✅ DEMÁS PÁGINAS */}
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
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DatosProvider>
  );
}