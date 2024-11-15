import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import {Layout, Menu, Button, Typography, Divider,Input,Breadcrumb} from 'antd';
import KanbanBoard from './components/KanbanBoard';
import KanbanBoardsub from './components/KanbanBoardSubtarea';
import ProyectoList from './components/proyectoList.jsx';
import ProyectoListArchivados from './components/ProyectoListArchivados.jsx';
import ProyectoPapelera from './components/proyectoPapepela.jsx';
import Otro from './components/otro';
import Otra from './components/otra';
import UsuariosList from "./components/usuariosLista.jsx";
import LoginPage from './components/LoginPage';
import RegistraUsuairo from "./components/registrarUsuario.jsx";
import {
    HomeOutlined,
    MailOutlined,
    FolderOpenOutlined,
    ClockCircleOutlined,
    DashboardOutlined,
    TeamOutlined,
    FileOutlined,
    UserOutlined,SearchOutlined,PoweroffOutlined
} from '@ant-design/icons';
import './App.txt';

const { Header, Sider, Content } = Layout;


const AppHeader = ({ logout }) => (
    <Header
        style={{
            background: '#ffffff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',

            width: '100%', // Asegurar que cubra todo el ancho

        }}

    >


        {/* Icono de búsqueda */}
        <SearchOutlined
            style={{
                fontSize: '16px',

                marginRight: '8px', // Espacio entre el icono y el input
            }}
        />

        {/* Input de búsqueda */}
        <Input
            type="text"
            placeholder="Buscar..."
            style={{
                border: 'none',
                outline: 'none',
                width: '100%', // Ajustar el ancho del input a 200px

                padding: '5px 10px', // Padding dentro del input
                borderRadius: '4px', // Bordes redondeados
            }}
        />

        <Divider
            type="vertical"
            style={{
                height: '32px',
                margin: '0 10px',

            }}
        />

        <Button
            onClick={logout}
            type="primary"
            icon={<PoweroffOutlined />}
            style={{
                backgroundColor: '#FFA500', // Color naranja
                borderColor: '#FFA500', // Color del borde
                color: 'white', // Color del texto
                padding: '5px 15px', // Espaciado dentro del botón
                borderRadius: '4px', // Bordes redondeados
            }}
        >
            Cerrar Sesión
        </Button>


    </Header>

);

// Private Route Component
const PrivateRoute = ({element, isAuthenticated}) => {
    return isAuthenticated ? element : <Navigate to="/login" replace/>;
};

// Main App Component
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate the token
            const isValid = validateToken(token);
            if (isValid) setIsAuthenticated(true);
        }
    }, []);

    const validateToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000; // Validate expiration
        } catch {
            return false;
        }
    };

    const login = () => {
        setIsAuthenticated(true);
        navigate('/');
        setIsRegistering(false);
    };

    const logout = () => {
        if (window.confirm('¿Seguro que deseas cerrar sesión?')) {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const menuItems = [
        { key: '1', icon: <DashboardOutlined />, label: <Link to="/">Inicio</Link> },
        { key: '2', icon: <FolderOpenOutlined />, label: <Link to="/proyectoList">Gestionar y Crear Proyectos</Link> },
        { key: '3', icon: <MailOutlined />, label: <Link to="/proyectoListArchivados">Proyectos archivados</Link> },
        { key: '4', icon: <UserOutlined />, label: <Link to="/usuarioslista">Usuarios lista</Link> },
        { key: '6', icon: <ClockCircleOutlined />, label: 'Hojas de horas' },
        { key: '7', icon: <TeamOutlined />, label: 'Paneles' },
        { key: '8', icon: <FileOutlined />, label: 'Clips' },
        { key: '9', icon: <UserOutlined />, label: <Link to="/proyectoPapelera">Papelera</Link> },
    ];

    return (
        <>

            <Layout style={{
                minHeight: '100vh',
                background: isAuthenticated ? '#fff' : '#f0f2f5',
                padding:'0 !important'


            }}>



                {isAuthenticated ? (
                    <>

                        <Sider width={220} theme="dark" collapsedWidth="0" style={{ background: '#001529', position: 'fixed', height: '100vh' }}>
                            <div className="logo" style={{ padding: '16px', color: '#fff', fontSize: '18px', textAlign: 'center' }}>
                                Gestor de Proyectos
                            </div>
                            <Menu theme="dark" mode="inline" items={menuItems} />
                        </Sider>
                        <Layout style={{ marginLeft: 220 }}>
                            {isAuthenticated && <AppHeader logout={logout} />}
                            <Breadcrumb style={{marginLeft:12, marginTop:5, marginBottom:5}}
                                        items={[
                                            {
                                                title: 'Home',
                                            },
                                            {
                                                title: <a href="">Application Center</a>,
                                            },

                                        ]}
                            />
                            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: '280px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>

                                <Routes>
                                    <Route path="/" element={<h2 style={{ fontSize: '20px', textAlign: 'center' }}>Bienvenido a la Gestión de Proyectos</h2>} />
                                    <Route path="/otro" element={<Otro />} />
                                    <Route path="/otra" element={<Otra />} />
                                    <Route path="/proyectoList" element={<ProyectoList setIsAuthenticated={setIsAuthenticated} />} />
                                    <Route path="/proyectoListArchivados" element={<ProyectoListArchivados />} />
                                    <Route path="/proyectoPapelera" element={<ProyectoPapelera />} />
                                    <Route path="/usuarioslista" element={<UsuariosList />} />
                                    <Route path="/modulos/:proyectoId/tareas" element={<KanbanBoard />} />
                                    <Route path="/proyectos/:proyectoId/modulos/:moduloId" element={<KanbanBoard />} />
                                    <Route path="proyectos/:proyectoId/modulos/:moduloId/tarea/:tareaId" element={<KanbanBoardsub />} />
                                </Routes>
                            </Content>
                        </Layout>
                    </>
                ) : (
                    <Routes>
                        <Route path="/" element={isRegistering ? <RegistraUsuairo /> : <LoginPage onLogin={login} />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                )}
                {!isAuthenticated && (
                    <>
                        <div style={{ position: 'fixed', top: '35px', left: '50px', zIndex: 1000 }}>
                            <img
                                src="/ruta-del-logo.png" // Adjust logo path here
                                alt="Logo"
                                style={{ width: '50px', height: '50px' }}
                            />
                        </div>

                        <div
                            style={{
                                position: 'fixed',
                                top: '35px',
                                right: '20px',
                                zIndex: 1000,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <Typography.Text style={{ fontSize: '14px', color: '#555' }}>
                                ¿No tienes cuenta?
                            </Typography.Text>
                            <Button
                                type="primary"
                                style={{
                                    height: '40px',
                                    fontSize: '16px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={() => setIsRegistering(true)}
                            >
                                Registrate
                            </Button>
                        </div>
                    </>
                )}
            </Layout>
        </>
    );
}

export default App;
