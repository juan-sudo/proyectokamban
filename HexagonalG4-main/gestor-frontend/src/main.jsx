import React, { StrictMode } from 'react';  // Asegúrate de importar React
import ReactDOM from 'react-dom';            // Importa desde 'react-dom'

import App from './App.jsx';
import './index.css';
import 'antd/dist/reset.css'; // Importar los estilos de Ant Design
import { BrowserRouter as Router } from 'react-router-dom'; // Importa Router

// Utiliza ReactDOM.render en lugar de createRoot
ReactDOM.render(
    <StrictMode>
        <Router> {/* Envolvemos App con BrowserRouter */}
            <App />
        </Router>
    </StrictMode>,
    document.getElementById('root')
);
