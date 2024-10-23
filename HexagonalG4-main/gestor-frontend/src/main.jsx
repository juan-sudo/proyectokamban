import React, { StrictMode } from 'react';  // Asegúrate de importar React
import ReactDOM from 'react-dom';            // Importa desde 'react-dom'

import App from './App.jsx';
import './index.css';
import 'antd/dist/reset.css'; // Importar los estilos de Ant Design

// Utiliza ReactDOM.render en lugar de createRoot
ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root')
);
