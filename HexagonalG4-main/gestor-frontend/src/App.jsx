import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
 // Importa el componente de lista de proyectos
import KanbanBoard from './components/KanbanBoard';
import KanbanBoardsub from './components/KanbanBoardSubtarea'; // Importa el tablero Kanban

import ProyectoList from './components/proyectoList.jsx';
import ProyectoListArchivados from './components/ProyectoListArchivados.jsx';

import Otro from './components/otro';  // Importa el tablero Kanban
import Otra from './components/otra';  // Importa el tablero Kanban
import UsuariosList from "./components/usuariosLista.jsx";  // Asegúrate de tener este archivo para estilos globales

import {
    HomeOutlined,
    MailOutlined,
    FolderOpenOutlined,
    ClockCircleOutlined,
    DashboardOutlined,
    TeamOutlined,
    FileOutlined,
    UserOutlined
} from '@ant-design/icons';
import './App.txt';
import RegistrarUsuario from "./components/registrarUsuario.jsx";

const { Header, Sider, Content } = Layout;

function App() {
    const menuItems = [
        {
            key: '1',
            icon: <DashboardOutlined />,
            label: <Link to="/">Inicio</Link>
        },
        {
            key: '2',
            icon: <FolderOpenOutlined />,
            label: <Link to="/proyectoList">Gestionar y Crear Proyectos</Link>
        },
        {
            key: '3',
            icon: <MailOutlined />,
            label: <Link to="/proyectoListArchivados">Proyectos archivados</Link>
        },
        {
            key: '4',
            icon: <UserOutlined />,

            label: <Link to="/usuarioslista">Usuarios lista</Link>
        },
        {
            key: '5',
            icon: <UserOutlined />,
            label: <Link to="/registrarusuario">Registrar Usuarios</Link>
        },
        {
            key: '6',
            icon: <ClockCircleOutlined />,
            label: 'Hojas de horas'
        },
        {
            key: '7',

            icon: <TeamOutlined />,
            label: 'Paneles'
        },
        {
            key: '8',
            icon: <FileOutlined />,
            label: 'Clips'
        },


    ];

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                {/* Barra lateral */}
                <Sider
                    width={220}  // Ajustar el ancho de la barra lateral
                    theme="dark"
                    collapsedWidth="0"
                    style={{ background: '#001529', position: 'fixed', height: '100vh' }}  // Fijar barra lateral
                >
                    <div className="logo" style={{ padding: '16px', color: '#fff', fontSize: '18px', textAlign: 'center' }}>
                        Gestor de Proyectos
                    </div>
                    <Menu theme="dark" mode="inline" items={menuItems} />
                </Sider>

                {/* Contenido principal */}
                <Layout style={{ marginLeft: 220 }}>  {/* Ajusta el margen para la barra lateral */}


                    {/* Botones de navegación <NavigationButtons /> */}





                    <Content style={{ margin: '24px 16px', background: '#fff', minHeight: '280px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <Routes>
                            <Route path="/" element={<h2 style={{ fontSize: '20px', textAlign: 'center' }}>Bienvenido a la Gestión de Proyectos</h2>} />
                            <Route path="/otro" element={<Otro />} />
                            <Route path="/otra" element={<Otra />} />
                            <Route path="/proyectoList" element={<ProyectoList />} />
                            <Route path="/proyectoListArchivados" element={<ProyectoListArchivados />} />
                            <Route path="/usuarioslista" element={<UsuariosList />} />
                            <Route path="/registrarusuario" element={<RegistrarUsuario />} />
                            <Route path="/modulos/:proyectoId/tareas" element={<KanbanBoard />} />
                            <Route path="/proyectos/:proyectoId/modulos/:moduloId" element={<KanbanBoard />} />
                            <Route path="proyectos/:proyectoId/modulos/:moduloId/tarea/:tareaId" element={<KanbanBoardsub />} />


                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

// Aquí agregamos la exportación por defecto
export default App;


function NavigationButtons() {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <Button
                type="primary"
                onClick={() => navigate(-1)}  // Navega hacia atrás en el historial
                style={{ marginRight: '10px' }}
            >
                Atrás
            </Button>
            <Button
                type="primary"
                onClick={() => navigate(1)}  // Navega hacia adelante en el historial
            >
                Adelante
            </Button>
        </div>
    );
}