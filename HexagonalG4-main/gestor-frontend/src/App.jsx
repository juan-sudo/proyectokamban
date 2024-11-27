import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import {Layout, Menu, Button, Typography, Divider, Input, Breadcrumb, Row, Col, Avatar, Popover,} from 'antd';
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
import HomeProyectos from "./components/home.jsx";

import logo from './assets/logoinei.svg';
import {
    HomeOutlined,
    MailOutlined,
    FolderOpenOutlined,
    ClockCircleOutlined,
    DashboardOutlined,
    TeamOutlined,
    FileOutlined,
    UserOutlined,
    SearchOutlined,
    PoweroffOutlined,
    AlignLeftOutlined,
    UserAddOutlined,
    BellOutlined,
    MessageOutlined,
    EllipsisOutlined, InboxOutlined,DeleteOutlined,EditOutlined,SettingOutlined
} from '@ant-design/icons';
import RegistrarUsuarioadmin from "./components/registrarUsuarioadmin.jsx";


const { Header, Sider, Content } = Layout;




// Main App Component
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [role, setRoles] = useState([]); // Estado para almacenar roles
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [nombresC,setnombreCompleto]=useState(null);

    useEffect(() => {

        if (token) {
            // Validar el token
            const isValid = validateToken(token);
            if (isValid) {
                setIsAuthenticated(true);
                // Decodificar el payload y extraer los roles
                const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload
                setnombreCompleto(payload.nombreCompleto)
                // Si el rol "GESTOR" está en la lista de roles, asignamos solo "GESTOR"
                if (payload.roles.includes("GESTOR")) {
                    setRoles(["GESTOR"]);
                } else {
                    // Si "GESTOR" no está, asignamos todos los roles
                    setRoles(payload.roles);


                }
                // Configurar temporizador para cerrar sesión cuando el token haya expirado
                const expirationTime = payload.exp * 1000; // Convertir el tiempo de expiración a milisegundos
                const timeToExpire = expirationTime - Date.now(); // Tiempo restante en milisegundos

                if (timeToExpire > 0) {
                    // Configurar el temporizador para cerrar sesión cuando expire
                    setTimeout(() => {
                        // Mostrar mensaje de expiración y cerrar sesión
                        Swal.fire({
                            title: 'Sesión expirada',
                            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar',
                        }).then(() => {
                            // Lógica para cerrar sesión
                            setIsAuthenticated(false);
                            localStorage.removeItem('token');
                            navigate('/login');
                            window.location.reload(); // Recargar la página para reflejar el cierre de sesión
                        });
                    }, timeToExpire); // Esperar hasta la expiración del token
                } else {
                    // Si el token ya expiró
                    Swal.fire({
                        title: 'Sesión expirada',
                        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        setIsAuthenticated(false);
                        localStorage.removeItem('token');
                        navigate('/login');
                        window.location.reload();
                    });
                }
            } else {
                setIsAuthenticated(false); // Si el token no es válido
            }
        } else {
            setIsAuthenticated(false); // Si no hay token en el almacenamiento local
        }
    }, [isAuthenticated]);




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
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Seguro que deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Color del botón de confirmación
            cancelButtonColor: '#d33',   // Color del botón de cancelación
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Lógica para cerrar sesión
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                navigate('/login');
                window.location.reload();  // Recargar la página

            }
        });
    };

    const menuItems = [
        { key: '1', icon: <DashboardOutlined />, label: <Link to="/">Inicio</Link> },
        { key: '2', icon: <FolderOpenOutlined />, label: <Link to="/proyectoList">Gestionar y Crear Proyectos</Link> },
        { key: '3', icon: <MailOutlined />, label: <Link to="/proyectoListArchivados">Proyectos archivados</Link> },
        { key: '4',
            icon: <UserOutlined />,
            label: <Link to="/usuarioslista">Usuarios lista</Link>,
            visible: role.includes("GESTOR") || role.includes("ADMINISTRADOR") // Visible si es GESTOR o ADMINISTRADOR
        },

        { key: '9', icon: <UserOutlined />, label: <Link to="/proyectoPapelera">Papelera</Link> },
    ];


    const filteredMenuItems = menuItems.filter(item => item.visible !== false);  // Filtrar ítems no visibles


//OPCIONESW DE TRES PUNTOS PROYECTO
    const getContent = (logout) => (
        <>
            <div onClick={() => handleEditarTask(proyectoId, nombreProyecto)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <Col span={5}>
                        <div style={{position: 'relative', display: 'inline-block', marginRight:10}}>
                            <Avatar
                                size={35}
                                icon={<UserAddOutlined style={{color: 'rgb(68, 64, 80)'}}/>}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: 10,
                                    height: 10,
                                    backgroundColor: 'green',
                                    borderRadius: '50%',
                                    border: '2px solid white', // Para dar contraste al borde

                                }}
                            ></span>
                        </div>
                    </Col>
                    <Col span={2}>
                    </Col>
                    <Col span={17} >

                        <div style={{marginLeft: 5, color: 'rgb(68, 64, 80)'}}>
                            {nombresC}
                        </div>
                        <div style={{marginLeft: 5, color: 'rgb(172, 170, 177)'}}>
                            <span> {role.length > 0 ? role.join(', ') : 'Cargando roles...'}</span>
                        </div>


                    </Col>


                </Row>
            </div>

            {/* Separador vertical */}
            <Divider type="horizontal" style={{backgroundColor: '#f5f7fa', padding: 0, marginTop: 6, marginBottom: 6}}/>


            <div onClick={() => archivarProyecto(proyectoId, nombreProyecto)} style={{cursor: 'pointer',marginBottom: 10}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: 'rgb(68, 64, 80)'}}>
                    <UserOutlined style={{marginRight: 8}}/> {/* Ícono de copiar */}
                    <span>My perfil</span>

                </Row>
            </div>




            <div
                onClick={logout}
                style={{
                    cursor: 'pointer',
                    backgroundColor: 'rgb(255, 76, 81)',
                    borderRadius: 5,
                    display: 'flex', // Flexbox para alinear
                    alignItems: 'center', // Centra verticalmente
                    justifyContent: 'center', // Centra horizontalmente
                    padding: '4px 8px', // Espaciado interno
                }}
            >
                <PoweroffOutlined
                    style={{
                        marginRight: 8,
                        color: '#ffffff',
                        fontWeight: 600,
                    }}
                />
                <span style={{color: '#ffffff', fontWeight: 600}}>Cerrar sesión</span>
            </div>

        </>
    );

    const AppHeader = ({logout}) => (


        <Header
            style={{
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '98%', // Asegurar que cubra todo el ancho
                marginLeft: 11,
                paddingLeft: 6,
                paddingRight: 0,
                borderRadius: 5

            }}
        >
            <Row gutter={[16, 16]} style={{width: '100%'}}>
                {/* Columna para el icono y búsqueda */}
                <Col span={12} style={{display: 'flex', alignItems: 'center' }}>
                    <AlignLeftOutlined style={{ fontSize: '20px', marginRight: '10px', color:'rgb(68, 64, 80)' }} />

                    {/* Icono de búsqueda */}
                    <Input
                        type="text"
                        placeholder="Buscar proyectos..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '80%', // Ajustar el ancho del input a 80%
                            padding: '5px 10px', // Padding dentro del input
                            borderRadius: '4px', // Bordes redondeados
                        }}
                        prefix={<SearchOutlined style={{ fontSize: '16px', marginLeft: '5px',color:'rgb(68, 64, 80)' }} />} // Icono dentro del input
                    />
                </Col>

                {/* Columna para los botones */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>




                    <Popover
                        content={getContent(logout)}
                        trigger="click"
                        placement="topRight"

                        //   onVisibleChange={(visible) => handleVisibleChangeP(visible, project.id)}

                    >
                        <Button
                            type="text"
                            style={{
                                padding: '2px 6px',
                                fontSize: '14px',
                                borderRadius: '4px',
                                // backgroundColor: focusedProjectId === project.id ? '#e0e0e0' : 'transparent',
                            }}
                        >
                            <div style={{position: 'relative', display: 'inline-block'}}>
                                <Avatar
                                    size={35}
                                    icon={<UserAddOutlined style={{color: 'rgb(68, 64, 80)'}}/>}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: 10,
                                        height: 10,
                                        backgroundColor: 'green',
                                        borderRadius: '50%',
                                        border: '2px solid white', // Para dar contraste al borde
                                    }}
                                ></span>
                            </div>
                            <span style={{fontWeight: 700, fontSize: 15}}>{nombresC}</span>
                        </Button>
                    </Popover>

                </Col>
            </Row>
        </Header>
    );


    return (
        <>

            <Layout style={{height: '100vh'}}>


                {isAuthenticated ? (
                    <>

                        <Sider width={220} theme="dark" collapsedWidth="0"
                               style={{background: '#001529', position: 'fixed', height: '100vh'}}>
                            <div className="logo"
                                 style={{padding: '16px', color: '#fff', fontSize: '18px', textAlign: 'center'}}>
                                Gestor de Proyectos
                            </div>
                            <Menu theme="dark" mode="inline" items={filteredMenuItems}/>
                        </Sider>
                        <Layout style={{marginLeft: 220 }}>
                            {isAuthenticated && <AppHeader logout={logout}  />}

                            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: '280px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>

                                <Routes>
                                    <Route path="/" element={<HomeProyectos />}   />
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
                        {/* Ruta para la página Home (sólo disponible después del login) */}
                        <Route path="/registroadmin" element={<RegistrarUsuarioadmin />} />
                    </Routes>

                )}


                {!isAuthenticated && (
                    <>
                        <div style={{ position: 'fixed', top: '35px', left: '50px', zIndex: 1000 }}>
                            <img
                                src={logo}// Adjust logo path here
                                alt="Logo"
                                style={{ width: '110px', height: '80px' }}
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
                            <Typography.Text style={{ fontSize: '14px', color: '#ffffff' }}>
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
