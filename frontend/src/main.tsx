import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DatosProvider } from './context/DatosContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatosProvider>
      <App />
    </DatosProvider>
  </React.StrictMode>
);