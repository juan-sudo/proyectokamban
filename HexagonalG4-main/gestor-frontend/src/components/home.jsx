import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useN
import _ from 'lodash';
import dayjs from 'dayjs';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable, } from 'react-beautiful-dnd';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip as ChartTooltip, Legend } from 'chart.js';

// Registrar los elementos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

import {
    DatePicker,
    Menu,
    Tooltip,
    Button,
    Dropdown,
    Avatar,
    Row,
    Col,
    Checkbox,
    Input,
    Modal,
    Form,
    Select,
    Space, Spin, Timeline, InputNumber, Tabs, Divider, Popover,theme
} from 'antd';
import {
    EditOutlined,
    CheckOutlined,
    SaveOutlined,
    CloseOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    ClockCircleOutlined,
    EllipsisOutlined,
    UserAddOutlined,
    CalendarOutlined,
    FunnelPlotOutlined,
    PlusOutlined,
    FolderOutlined,
    InsertRowBelowOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    RedoOutlined,
    FundOutlined,
    UserOutlined,
    MessageOutlined,
    HomeOutlined,
    ExperimentOutlined,
    HourglassOutlined,
    GroupOutlined,
    RobotOutlined,
    FileOutlined,
    FlagOutlined,
    CopyOutlined,
    StarOutlined,
    MoreOutlined,
    BookOutlined,
    AppstoreOutlined,
    DeleteOutlined,DownloadOutlined,
    InboxOutlined, RightCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined,CaretRightOutlined,HolderOutlined


} from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';



const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];
import { Link } from "react-router-dom";

function HomeProyectos() {
    const [proyectos, setProyectos] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [assignedColors, setAssignedColors] = useState({});
    const [form] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null); // proyecto seleccionado
    const [selectedModule, setSelectedModule] = useState(null); // proyecto seleccionado
    const [selectedTarea, setSelectedTarea] = useState(null); // proyecto seleccionado

    const navigate = useNavigate();
    const [usuarios, setUsuario] = useState([]);
    const [prioridad, setPrioridad] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedModuloUserIds, setSelectedModuloUserIds] = useState([]);
    const [selectedTareaUserIds, setSelectedTareaUserIds] = useState([]);

    // Estado para el valor seleccionado


    const [proyectosState, setProyectosState] = useState(proyectos);
    // Obtener el token del localStorage y configurar el estado
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const [error, setError] = useState(null); // Estado para manejar el error



    const [usuarioActivo, setUsuarioActivo] = useState(null); // default is 'middle'

    useEffect(() => {
        // Actualizar el estado de autenticación si el token cambia
        if (token) {
            setIsAuthenticated(true);
            fetchProyectos(token);
            fetchUsuario(token);
           // console.log("Usuarios en el principia: " + JSON.stringify(usuarios.rolesUsuario, null, 2));
            fetchPrioridad(token);
            fetchUsuarioAutenticado(token);
           // console.log("usairo autenticado"+usuarioActivo)

        } else {
            setIsAuthenticated(false);
        }
    }, [token]);

    // Este useEffect se ejecutará cuando 'usuarioActivo' cambie
    useEffect(() => {
        console.log("usuario autenticado", usuarioActivo);
    }, [usuarioActivo]);
    useEffect(() => {
        setProyectosState(proyectos);
    }, [proyectos]);



    //pPARA SEEÑCT


    // PRIORIDADA
    useEffect(() => {
        if (selectedProject && selectedProject.usuarios) {
            const userIds = selectedProject.usuarios.map(user => user.id);
            setSelectedUserIds(userIds);


        } else {
            setSelectedUserIds([]);
        }
    }, [selectedProject]);

    // Cargar usuarios del proyecto cuando cambia el proyecto seleccionado
    useEffect(() => {
        if (selectedProject && selectedProject.usuarios) {
            const userIds = selectedProject.usuarios.map(user => user.id);
            setSelectedUserIds(userIds);
        } else {
            setSelectedUserIds([]);
        }
    }, [selectedProject]);

    // Cargar usuarios del proyecto cuando cambia el proyecto seleccionado
    useEffect(() => {
        if (selectedModule && selectedModule.usuarios) {
            const userIds = selectedModule.usuarios.map(user => user.id);
            console.log("usuariros de tarea:: "+userIds);
            setSelectedModuloUserIds(userIds);
        } else {
            setSelectedModuloUserIds([]);
        }
    }, [selectedModule]);

    // FILTRAR USUARIOS DE TAREA
    useEffect(() => {
        if (selectedTarea && selectedTarea.usuarios) {
            const userIds = selectedTarea.usuarios.map(user => user.id);
            console.log("usuariros de tarea:::: "+userIds);
            setSelectedTareaUserIds(userIds);


        } else {

            setSelectedTareaUserIds([]);

        }
    }, [selectedTarea]);


    //GRAFUCA

    const contarEstados = (proyectos) => {
        const estados = {
            PENDIENTE: 0,
            EN_PROGRESO: 0,
            COMPLETADO: 0,
          // Incluye todos los estados
        };

        proyectos.forEach((proyecto) => {
            if (proyecto.estado && estados.hasOwnProperty(proyecto.estado)) {
                estados[proyecto.estado] += 1;
            }
        });

        return estados;
    };

    const estadosData = contarEstados(proyectos);

    // Datos para el gráfico
    const data = {
        labels: ['Pendiente', 'En Progreso', 'Completado'], // Incluye todos los estados
        datasets: [
            {
                label: 'Cantidad de Proyectos',
                data: [
                    estadosData.PENDIENTE,
                    estadosData.EN_PROGRESO,
                    estadosData.COMPLETADO,

                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50', '#FFCE56', '#9E9E9E'], // Colores para cada estado
                borderColor: ['#FF6384', '#36A2EB', '#4CAF50', '#FFCE56', '#9E9E9E'],
                borderWidth: 1,
                barThickness: 50, // Aquí reduces el grosor de las barras, puedes ajustar el valor
            },
        ],
    };

    const optionsa = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Reporte de Estados de Proyectos' },
        },
    };

    //END GRAFICA






    //OBTENE PROYECTOS

        const fetchProyectos = async (token) => {
            try {



                const response = await axios.get(
                    `http://localhost:8080/api/proyectos/no-archivados`
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                    );

                if (Array.isArray(response.data)) {
                    const proyectosConColor = response.data.map((proyecto) => {
                        const color = getUniqueColor(proyecto.id);
                        // Asignar el selectedOption basado en la prioridad existente
                        const selectedOption = proyecto.prioridad
                            ? {
                                value: proyecto.prioridad.id,
                                label: proyecto.prioridad.nombre,
                                color: proyecto.prioridad.backgroundPrioridad,
                            }
                            : null;
                        return { ...proyecto, color, selectedOption }; // Incluir selectedOption en el objeto del proyecto
                    });
                    setProyectos(proyectosConColor);
                    setError(null); // Reinicia el error si la solicitud fue exitosa
                }
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
            }
        };

    //USAURIOS AUTENTICADO

    const fetchUsuarioAutenticado = async (token) => {
        try {



            const response = await axios.get(
                `http://localhost:8080/api/usuarios/getCurrentUser`
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                }
            );

            console.log("Datos recibidos autenticado:", JSON.stringify(response.data.usuario, null, 2));


            if (response.data.usuario) {
                setUsuarioActivo(response.data.usuario);
            } else {
                console.error("El campo 'usuario' no está presente en la respuesta.");
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };



// OBTENER  USUARIOS

    const fetchUsuario = async (token) => {
        try {

            const response = await axios.get(`http://localhost:8080/api/usuarios`
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                }

                );



            //console.log("loq ue viene de bd: " + JSON.stringify(response.data, null, 2));
            if (Array.isArray(response.data)) {
                const usuarioValor = response.data.map(usuario => ({
                    label: usuario.nombres,
                    value: usuario.id,
                    emoji:  <Avatar style={{ backgroundColor: usuario.backgroundUser }}
                        size={20}
                        icon={<UserAddOutlined />} />,
                    desc: usuario.nombres+" "+usuario.apellidoPaterno+" "+usuario.apellidoMaterno,




                    //rolesUsuario: usuario.roles.some(role => role.nombreRol === "GESTOR") ? "GESTOR" : role.nombreRol,

                }));
                setUsuario(usuarioValor);

               // setRolUsuario()



            }

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            //message.error('No se pudieron cargar las personas.');
        }
    };

    const fetchPrioridad = async (token) => {
        try {

            const response = await axios.get(`http://localhost:8080/api/prioridad`
            ,{
                headers: {
                    'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                },
                withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
            });

            console.log("prioridades que hay"+response.data)
            if (Array.isArray(response.data)) {
                const usuarioValor = response.data.map(prioridad => ({
                    label: prioridad.nombre,
                    value: prioridad.id,
                    color: prioridad.backgroundPrioridad,
                    desc: prioridad.nombre,
                }));
                setPrioridad(usuarioValor);
            }
            console.log("prioridades aquiii"+prioridad)
        } catch (error) {
            console.error("Error al obtener prioridades:", error);
            // Puedes mostrar un mensaje de error si es necesario
        }
    };




    const getUniqueColor = (projectId) => {
        if (!assignedColors[projectId]) {
            const availableColors = pearlescentColors.filter(color => !Object.values(assignedColors).includes(color));
            if (availableColors.length === 0) return '#000'; // Fallback color
            const selectedColor = availableColors[Math.floor(Math.random() * availableColors.length)];
            setAssignedColors(prevColors => ({ ...prevColors, [projectId]: selectedColor }));
            return selectedColor;
        }
        return assignedColors[projectId];
    };



    // SESION PARA GUARDAR ELN N SESION STORAGE
    const [expandedProjects, setExpandedProjects] = useState(() => {
        const savedExpandedProjects = sessionStorage.getItem('expandedProjects');
        return savedExpandedProjects ? JSON.parse(savedExpandedProjects) : [];
    });

    // Estado para módulos expandidos, guardado en sessionStorage
    const [expandedModules, setExpandedModules] = useState(() => {
        const savedExpandedModules = sessionStorage.getItem('expandedModules');
        try {
            const parsedModules = savedExpandedModules ? JSON.parse(savedExpandedModules) : [];
            if (!Array.isArray(parsedModules)) {
                console.error("expandedModules no es un array. Se asignará un array vacío.");
                return [];
            }
            return parsedModules;
        } catch (e) {
            console.error("Error al parsear expandedModules desde sessionStorage", e);
            return [];
        }
    });

    // Estado para tareas expandidas, guardado en sessionStorage
    const [expandedTasks, setExpandedTasks] = useState(() => {
        const savedExpandedTasks = sessionStorage.getItem('expandedTasks');
        return savedExpandedTasks ? JSON.parse(savedExpandedTasks) : [];
    });



    // Guardar el estado de proyectos expandidos en sessionStorage
    useEffect(() => {
        sessionStorage.setItem('expandedProjects', JSON.stringify(expandedProjects));
    }, [expandedProjects]);

    // Guardar el estado de módulos expandidos en sessionStorage
    useEffect(() => {
        sessionStorage.setItem('expandedModules', JSON.stringify(expandedModules));
    }, [expandedModules]);

    // Guardar el estado de tareas expandidas en sessionStorage
    useEffect(() => {
        sessionStorage.setItem('expandedTasks', JSON.stringify(expandedTasks));
    }, [expandedTasks]);







    if (!proyectos) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin tip="Cargando..." size="large" /> {/* Cambiar el tamaño aquí */}
            </div>
        );// Muestra un mensaje de carga mientras se obtienen los datos
    }


    return (
        <>

            <div className="cu-task-list-header__row" style={{display:"flex", flexDirection:"column"}} >

                <div className="cu-task-list-header__row-inner" style={{display: 'flex', gap: '16px'}}>

                    {/* Card 1 */}
                    <div style={{
                        flex: '1',

                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        backgroundColor: '#fff',

                    }}>
                        <div style={{

                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'start', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{
                                width: '70px', // Ancho del círculo
                                height: '70px', // Alto del círculo
                                borderRadius: '50%', // Hace el contenedor circular
                                display: 'flex', // Flexbox para centrar el ícono
                                alignItems: 'center', // Centrado vertical
                                justifyContent: 'center', // Centrado horizontal
                                backgroundColor: '#f0f2f5', // Color de fondo del círculo
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra suave
                                border: '2px solid rgb(35 135 129)'
                            }}>
                                <FolderOutlined style={{fontSize: '24px', color: '#656f7d'}}/> {/* Ícono */}
                            </div>

                            <div style={{color: '#656f7d', marginTop: 10}}>
                                <p style={{margin: 0, fontSize: '50px',}}>
                                    {proyectos.length}
                                </p>
                                <p>Proyectos</p>

                            </div>
                            {/* Número */}

                        </div>
                        <div style={{
                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'space-between', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{}}>

                                <Link to="/proyectoList" style={{textDecoration: 'none', color: '#656f7d'}}>
                                    Ver todos
                                </Link>
                            </div>

                            <div style={{color: '#656f7d'}}>
                                <p style={{color: 'rgb(35 135 129)'}}>100%</p>


                            </div>
                            {/* Número */}

                        </div>

                    </div>


                    {/* Card 2 */}
                    <div style={{
                        flex: '1',

                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        backgroundColor: '#fff',

                    }}>
                        <div style={{

                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'start', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{
                                width: '70px', // Ancho del círculo
                                height: '70px', // Alto del círculo
                                borderRadius: '50%', // Hace el contenedor circular
                                display: 'flex', // Flexbox para centrar el ícono
                                alignItems: 'center', // Centrado vertical
                                justifyContent: 'center', // Centrado horizontal
                                backgroundColor: '#f0f2f5', // Color de fondo del círculo
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra suave
                                border: '2px solid rgb(35 135 129)'
                            }}>
                                <FolderOutlined style={{fontSize: '24px', color: '#656f7d'}}/> {/* Ícono */}
                            </div>

                            <div style={{color: '#656f7d', marginTop: 10}}>
                                <p style={{
                                    margin: 0,
                                    fontSize: '50px',
                                }}>{proyectos.reduce((total, proyecto) => total + (proyecto.modulos?.length || 0), 0)} {/* Total de módulos */}</p>

                                <p>Módulos</p>

                            </div>
                            {/* Número */}

                        </div>
                        <div style={{
                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'space-between', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{}}>

                            </div>

                            <div style={{color: '#656f7d'}}>
                                <p style={{color: 'rgb(35 135 129)'}}>100%</p>


                            </div>
                            {/* Número */}

                        </div>

                    </div>

                    {/* Card 3 */}
                    <div style={{
                        flex: '1',

                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        backgroundColor: '#fff',

                    }}>
                        <div style={{

                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'start', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{
                                width: '70px', // Ancho del círculo
                                height: '70px', // Alto del círculo
                                borderRadius: '50%', // Hace el contenedor circular
                                display: 'flex', // Flexbox para centrar el ícono
                                alignItems: 'center', // Centrado vertical
                                justifyContent: 'center', // Centrado horizontal
                                backgroundColor: '#f0f2f5', // Color de fondo del círculo
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra suave
                                border: '2px solid rgb(35 135 129)'
                            }}>
                                <FileTextOutlined style={{fontSize: '24px', color: '#656f7d'}}/> {/* Ícono */}
                            </div>

                            <div style={{color: '#656f7d', marginTop: 10}}>
                                <p style={{margin: 0, fontSize: '50px',}}>
                                    {proyectos.reduce((total, proyecto) =>
                                        total + (proyecto.modulos?.reduce((moduloTotal, modulo) =>
                                            moduloTotal + (modulo.tareas?.length || 0), 0) || 0), 0)}
                                </p>
                                <p>Tareas</p>

                            </div>
                            {/* Número */}

                        </div>
                        <div style={{
                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'space-between', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{}}>

                            </div>

                            <div style={{color: '#656f7d'}}>
                                <p style={{color: 'rgb(35 135 129)'}}>100%</p>


                            </div>
                            {/* Número */}

                        </div>

                    </div>
                    {/* Card 4 */}
                    <div style={{
                        flex: '1',

                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        backgroundColor: '#fff',

                    }}>
                        <div style={{

                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'start', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{
                                width: '70px', // Ancho del círculo grande
                                height: '70px', // Alto del círculo grande
                                borderRadius: '50%', // Hace el contenedor circular
                                display: 'flex', // Flexbox para centrar el ícono
                                alignItems: 'center', // Centrado vertical
                                justifyContent: 'center', // Centrado horizontal
                                backgroundColor: '#f0f2f5', // Color de fondo del círculo grande
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra suave
                                border: '2px solid rgb(35 135 129)' // Borde del círculo grande
                            }}>
                                <div style={{
                                    width: '25px', // Ancho del círculo pequeño
                                    height: '25px', // Alto del círculo pequeño
                                    borderRadius: '50%', // Hace el contenedor pequeño circular
                                    border: '2px solid #656f7d', // Borde del círculo pequeño
                                }}/>

                            </div>


                            <div style={{color: '#656f7d', marginTop: 10}}>
                                <p style={{margin: 0, fontSize: '50px'}}>
                                    {proyectos.reduce((total, proyecto) =>
                                        total + (proyecto.modulos?.reduce((moduloTotal, modulo) =>
                                            moduloTotal + (modulo.tareas?.reduce((tareaTotal, tarea) =>
                                                tareaTotal + (tarea.subtareas?.length || 0), 0) || 0), 0) || 0), 0)}
                                </p>

                                <p>SubTareas</p>

                            </div>
                            {/* Número */}

                        </div>
                        <div style={{
                            display: 'flex', // Flexbox para organizar los hijos
                            alignItems: 'center', // Centrado vertical
                            justifyContent: 'space-between', // Centrado horizontal
                            gap: '8px', // Espacio entre los elementos
                        }}>
                            <div style={{}}>

                            </div>

                            <div style={{color: '#656f7d'}}>
                                <p style={{color: 'rgb(35 135 129)'}}>100%</p>


                            </div>
                            {/* Número */}

                        </div>

                    </div>


                </div>

                <div className="cu-task-list-header__row-inner" >

                    {error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : (
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#fff',
                                width: '100%',
                                maxWidth: '1200px', // Define un ancho máximo grande
                                height: '350px', // Define una altura grande
                                margin: '0 auto', // Centra el div horizontalmente
                            }}
                        >
                            <h3 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
                                Reporte de Estados de Proyectos
                            </h3>
                            <div style={{ width: '100%', height: '100%' }}>
                                <Bar
                                    data={data}
                                    options={{
                                        ...optionsa,
                                        maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
                                        responsive: true, // Se asegura de que el gráfico sea responsivo
                                    }}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>


        </>
    );

}

export default HomeProyectos;
