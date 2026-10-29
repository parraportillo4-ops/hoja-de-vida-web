import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HojaVida from "./pages/HojaVida.jsx";
import AdminExperiencias from "./pages/AdminExperiencias.jsx";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/hoja/jhon" replace />} />

        {/* Hoja de vida dinámica */}
        <Route path="/hoja/:persona" element={<HojaVida />} />

        {/* Panel administrativo */}
        <Route path="/admin/experiencias" element={<AdminExperiencias />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);