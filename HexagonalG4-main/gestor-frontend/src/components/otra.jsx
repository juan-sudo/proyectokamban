import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";


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
    Space
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
    FlagOutlined

} from '@ant-design/icons';

const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];

function Otra() {
    const [proyectos, setProyectos] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [assignedColors, setAssignedColors] = useState({});
    const [modalType, setModalType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedModuloId, setSelectedModuloId] = useState(null);
    const [selectedTareaId, setSelectedTareaId] = useState(null);
    const [selectedsubTareaId, setSelectedsubTareaId] = useState(null);
    const [form] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null); // proyecto seleccionado
    const [selectedModule, setSelectedModule] = useState(null); // proyecto seleccionado
    const [selectedTarea, setSelectedTarea] = useState(null); // proyecto seleccionado
    const [selectedsubTarea, setSelectedsubTarea] = useState(null); // proyecto seleccionado
    const [personas, setPersonas] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {

        fetchProyectos();
        fetchPersonas();
        console.log("aqui"+proyectos)
    }, []);

    const fetchProyectos = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/proyectos`);
            console.log("Respuesta de la API:", response.data);
            if (Array.isArray(response.data)) {
                const proyectosConColor = response.data.map((proyecto) => {
                    const color = getUniqueColor(proyecto.id);
                    return { ...proyecto, color };
                });
                setProyectos(proyectosConColor);
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };

    const fetchPersonas = async () => {
        try {
            const response = await axios.get(`${backendUrl}/ms-registro/v1/persona`);
            console.log("Respuesta de la API personas:", response.data);

            if (Array.isArray(response.data)) {
                const personasConColor = response.data.map((persona) => {
                    return {
                        label: persona.nombres.toLowerCase(), // Usamos el nombre en minúsculas como etiqueta
                        value: persona.idPersona, // Usamos el idPersona como valor
                        emoji: "🇨🇳", // Emoji asignado
                        desc: persona.apePat // Usamos el apellido paterno como descripción
                    };
                });
                setPersonas(personasConColor); // Guardar las personas en el estado correspondiente
            }
        } catch (error) {
            console.error("Error al obtener personas:", error);
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

    const options = [
        {
            label: 'juan',
            value: 'juan',
            emoji: '🇨🇳',
            desc: 'China',
        },
        {
            label: 'pepe',
            value: 'pepe',
            emoji: '🇺🇸',
            desc: 'pepe',
        },
        {
            label: 'sana',
            value: 'san',
            emoji: '🇯🇵',
            desc: 'san',
        },
        {
            label: 'lo',
            value: 'lo',
            emoji: '🇰🇷',
            desc: 'lo',
        },
    ];
    const showModal = (typeModal, id = null, moduloId = null, tareaId = null,subtareaId=null) => {
        setModalType(typeModal);
        setSelectedItemId(id);
        setSelectedModuloId(moduloId);
        setSelectedTareaId(tareaId);


        setIsModalOpen(true);

        // Lógica para ver proyecto
        if (typeModal === 'verProyecto' && id) {
            const proyecto = proyectos.find(p => p.id === id);
            setSelectedProject(proyecto);
        }

        // Lógica para añadir proyecto o módulo
        if (typeModal === 'Añadirproyecto') {
            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }

        // Lógica para editar proyecto
        if (typeModal === 'editarProyecto' && id) {
            const proyecto2 = proyectos.find(p => p.id === id);
            setSelectedProject(proyecto2);

            // Precargar el formulario con los datos del proyecto
            if (proyecto2) {
                form.setFieldsValue({
                    nombre: proyecto2.nombre,
                    descripcion: proyecto2.descripcion,
                    estado: proyecto2.estado,
                    fechaInicio: proyecto2.fechaInicio ? dayjs(proyecto2.fechaInicio) : null,
                    fechaFin: proyecto2.fechaFin ? dayjs(proyecto2.fechaFin) : null,
                });
            }
        }

        // Lógica para añadir proyecto o módulo
        if (typeModal === 'AñadirModulo'&& moduloId) {
            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }


        // Lógica para ver módulo
        if (typeModal === 'verModulo' && id && moduloId) {
            // Encuentra el proyecto por su ID
            const proyecto = proyectos.find(p => p.id === id);

            // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
            if (proyecto) {
                const modulo = proyecto.modulos.find(m => m.id === moduloId);

                // Si se encuentra el módulo, actualiza el estado con ese módulo
                if (modulo) {
                    setSelectedModule(modulo);
                } else {
                    console.error("Módulo no encontrado");
                }
            } else {
                console.error("Proyecto no encontrado");
            }
        }




        // Lógica para editar módulo
        if (typeModal === 'editarModulo' && moduloId) {
            const modulo2 = modulos.find(m => m.id === moduloId);
            setSelectedModule(modulo2);

            if (modulo2) {
                form.setFieldsValue({
                    nombre: modulo2.nombre,
                    descripcion: modulo2.descripcion,
                });
            }
        }
        if (typeModal === 'AñadirTarea'&& id&&moduloId) {
            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }
        // Lógica para ver tarea

        if (typeModal === 'verTarea' && id&& moduloId && tareaId) {
            // Encuentra el proyecto por su ID
            const proyecto = proyectos.find(p => p.id === id);
            console.log("psaste por qui");
            // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
            if (proyecto) {
                const modulo = proyecto.modulos.find(m => m.id === moduloId);

                // Si se encuentra el módulo, actualiza el estado con ese módulo
                if (modulo) {
                    const  tarea=modulo.tareas.find(t=>t.id===tareaId);
                    if(tarea){
                        setSelectedTarea(tarea);
                    }else {
                        console.error("tarea no encontrado");
                    }

                } else {
                    console.error("Módulo no encontrado");
                }
            } else {
                console.error("Proyecto no encontrado");
            }
        }

        // Verificación del if
        if (typeModal === 'verSubtarea' && id && moduloId && tareaId && subtareaId) {
            console.log("Entró correctamente en 'verSubtarea'");
            // Encuentra el proyecto por su ID
            const proyecto = proyectos.find(p => p.id === id);


            if (proyecto) {
                const modulo = proyecto.modulos.find(m => m.id === moduloId);
                if (modulo) {
                    const tarea = modulo.tareas.find(t => t.id === tareaId);
                    if (tarea) {
                        const subtarea = tarea.subtareas.find(st => st.id === subtareaId);
                        setSelectedsubTarea(subtarea);
                        console.log("Subtarea seleccionada:", subtarea);
                    } else {
                        console.error("Tarea no encontrada");
                    }
                } else {
                    console.error("Módulo no encontrado");
                }
            } else {
                console.error("Proyecto no encontrado");
            }
        }

        // Lógica para editar tarea
        if (typeModal === 'editarTarea' && tareaId) {
            const tarea2 = tareas.find(t => t.id === tareaId);
            setSelectedTask(tarea2);

            if (tarea2) {
                form.setFieldsValue({
                    nombre: tarea2.nombre,
                    descripcion: tarea2.descripcion,
                });
            }
        }



        // Lógica para editar subtarea
        if (typeModal === 'editarSubtarea' && id) {
            const subtarea2 = subtareas.find(st => st.id === id);
            setSelectedSubtask(subtarea2);

            if (subtarea2) {
                form.setFieldsValue({
                    nombre: subtarea2.nombre,
                    descripcion: subtarea2.descripcion,
                });
            }
        }

        // Resetea el formulario para añadir tareas o subtareas
        if (typeModal === 'AñadirSubtarea'&&id&&moduloId&&tareaId) {
            form.resetFields();
        }
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            if (values.fechaInicio) {
                values.fechaInicio = values.fechaInicio.format('YYYY-MM-DD');
            }
            if (values.fechaFin) {
                values.fechaFin = values.fechaFin.format('YYYY-MM-DD');
            }

            let url = '';
            if (modalType === 'Añadirproyecto') {
                url = `${backendUrl}/api/proyectos`;

                try {
                    // Hacer la solicitud POST al backend con axios
                    const response = await axios.post(url, values);
                    console.log("estaaaaa"+response);
                    // Si la solicitud es exitosa, mostrar un SweetAlert2 de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Proyecto añadido!',
                        text: 'El proyecto ha sido añadido con éxito.',
                        confirmButtonText: 'OK',
                    });

                    // Aquí puedes hacer más acciones, como cerrar el modal o refrescar la lista

                }catch (error) {
                    // Manejo de errores: Mostrar un SweetAlert2 de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al añadir el proyecto. Inténtalo nuevamente.',
                        confirmButtonText: 'OK',
                    });
                    console.error('Error al añadir proyecto:', error);
                }

            }if (modalType === 'editarProyecto') {
                url = `${backendUrl}/api/proyectos`;
            }
            else if (modalType === 'AñadirModulo') {
                url = `${backendUrl}/api/proyectos/${selectedItemId}/modulos`;
                try {
                    // Hacer la solicitud POST al backend con axios
                    const response = await axios.post(url, values);
                    console.log("estaaaaa"+response);
                    // Si la solicitud es exitosa, mostrar un SweetAlert2 de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Módulo añadido!',
                        text: 'El Módulo ha sido añadido con éxito.',
                        confirmButtonText: 'OK',
                    });

                    // Aquí puedes hacer más acciones, como cerrar el modal o refrescar la lista

                }catch (error) {
                    // Manejo de errores: Mostrar un SweetAlert2 de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al añadir el módulo. Inténtalo nuevamente.',
                        confirmButtonText: 'OK',
                    });
                    console.error('Error al añadir proyecto:', error);
                }
            }
            else if (modalType === 'AñadirTarea') {
                url = `${backendUrl}/api/modulos/${selectedModuloId}/tareas`;
                try {
                    // Hacer la solicitud POST al backend con axios
                    //const response = await axios.post(url, values);
                    //console.log("estaaaaa"+response);
                    // Si la solicitud es exitosa, mostrar un SweetAlert2 de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Tarea añadido!',
                        text: 'La tarea ha sido añadido con éxito.',
                        confirmButtonText: 'OK',
                    });

                    // Aquí puedes hacer más acciones, como cerrar el modal o refrescar la lista

                }catch (error) {
                    // Manejo de errores: Mostrar un SweetAlert2 de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al añadir la tarea. Inténtalo nuevamente.',
                        confirmButtonText: 'OK',
                    });
                    console.error('Error al añadir tarea:', error);
                }


            }
            else if (modalType === 'AñadirSubtarea') {
                url = `${backendUrl}/api/tareas/${selectedTareaId}/subTareas`;
                try {
                    // Hacer la solicitud POST al backend con axios
                    //const response = await axios.post(url, values);
                    //console.log("estaaaaa"+response);
                    // Si la solicitud es exitosa, mostrar un SweetAlert2 de éxito
                    Swal.fire({
                        icon: 'success',
                        title: '¡Subtarea añadido!',
                        text: 'La Subtarea ha sido añadido con éxito.',
                        confirmButtonText: 'OK',
                    });

                    // Aquí puedes hacer más acciones, como cerrar el modal o refrescar la lista

                }catch (error) {
                    // Manejo de errores: Mostrar un SweetAlert2 de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al añadir la Subtarea. Inténtalo nuevamente.',
                        confirmButtonText: 'OK',
                    });
                    console.error('Error al añadir proyecto:', error);
                }
            }
            else if (modalType === 'tarea') {
                url = `${backendUrl}/api/modulos/${selectedModuloId}/tareas`;
            } else if (modalType === 'subtarea') {
                url = `${backendUrl}/api/tareas/${selectedTareaId}/subTareas`;
            }

            console.log("Datos que se envían:", values);

            try {
                await axios.post(url, values, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                fetchProyectos();
            } catch (error) {
                console.error("Error creando tarea:", error);
            }
            form.resetFields();
            setIsModalOpen(false);
        }).catch((errorInfo) => {
            // Manejo de validación del formulario (si falla)
            Swal.fire({
                icon: 'warning',
                title: 'Campos inválidos',
                text: 'Por favor, corrige los errores en el formulario.',
                confirmButtonText: 'OK',
            });
        });;
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    const [collapsedModulo, setCollapsedModulo] = useState(true); // Estado para manejar el colapso del módulo

    const toggleCollapseModulo1 = () => {
        setCollapsedModulo(prevState => !prevState); // Cambia el estado de colapso
    };

    const [collapsed, setCollapsed] = useState(true); // Estado para manejar el colapso
    const [collapsedPendiente, setCollapsedPendiente] = useState(() => {
        const saved = localStorage.getItem('collapsedPendiente');
        return saved !== null ? JSON.parse(saved) : true; // Si existe en localStorage, lo usamos; si no, true.
    });

    const [collapsedProceso, setCollapsedProceso] = useState(() => {
        const saved = localStorage.getItem('collapsedProceso');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [collapsedCompletado, setCollapsedCompletado] = useState(() => {
        const saved = localStorage.getItem('collapsedCompletado');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [collapsedEntregado, setCollapsedEntregado] = useState(() => {
        const saved = localStorage.getItem('collapsedEntregado');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const toggleCollapse = () => {
        setCollapsed(prev => !prev); // Cambia el estado de colapso
    };

    // Funciones para alternar el estado y guardarlo en localStorage
    const toggleCollapsePendiente = () => {
        setCollapsedPendiente((prev) => {
            localStorage.setItem('collapsedPendiente', JSON.stringify(!prev));
            return !prev;
        });
    };

    const toggleCollapseProceso = () => {
        setCollapsedProceso((prev) => {
            localStorage.setItem('collapsedProceso', JSON.stringify(!prev));
            return !prev;
        });
    };

    const toggleCollapseCompletado = () => {
        setCollapsedCompletado((prev) => {
            localStorage.setItem('collapsedCompletado', JSON.stringify(!prev));
            return !prev;
        });
    };

    const toggleCollapseEntregado = () => {
        setCollapsedEntregado((prev) => {
            localStorage.setItem('collapsedEntregado', JSON.stringify(!prev));
            return !prev;
        });
    };


    // ... PARA QUE AORESCA LOS ICONOS DE GUARDAR Y EDITAR
    const [hoveredRow, setHoveredRow] = useState(null); // Estado para la fila actualmente sobre la que se hace hover


    const handleMouseEnter = (rowId) => {
        setHoveredRow(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeave = () => {
        setHoveredRow(null); // Limpiar el estado cuando se sale de la fila
    };
    // ... PARA QUE AORESCA LOS ICONOS DE GUARDAR Y EDITAR
    const [hoveredRowmodulo, setHoveredRowmodulo] = useState(null); // Estado para la fila actualmente sobre la que se hace hover

    const handleMouseEntermodulo = (rowId) => {
        setHoveredRowmodulo(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeavemodulo = () => {
        setHoveredRowmodulo(null); // Limpiar el estado cuando se sale de la fila
    };

    const [hoveredRowtarea, setHoveredRowtarea] = useState(null); // Estado para la fila actualmente sobre la que se hace hover

    const handleMouseEntertarea = (rowId) => {
        setHoveredRowtarea(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeavetarea = () => {
        setHoveredRowtarea(null); // Limpiar el estado cuando se sale de la fila
    };

    const [hoveredRowsubtarea, setHoveredRowsubtarea] = useState(null); // Estado para la fila actualmente sobre la que se hace hover

    const handleMouseEntersubtarea = (rowId) => {
        setHoveredRowsubtarea(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeavesubtarea = () => {
        setHoveredRowsubtarea(null); // Limpiar el estado cuando se sale de la fila
    };


    const [expandedRows, setExpandedRows] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [collapsedModulo1, setCollapsedModulo1] = useState({});
    const [collapsedTarea, setCollapsedTarea] = useState({});
    const [hoveredRow1, setHoveredRow1] = useState(null);
    // const [modalVisible, setModalVisible] = useState(false);




    const toggleCollapseProyecto = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

        // Al cambiar el estado de expansión, colapsamos el módulo también


    };

    const toggleCollapseModulo = (proyectoId, moduloId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [`${proyectoId}-${moduloId}`]: !prev[`${proyectoId}-${moduloId}`],
        }));
    };

    const toggleCollapseTarea = (proyectoId, moduloId,tareaId) => {
        setExpandedModules((prev) => ({
            ...prev,

            [`${proyectoId}-${moduloId}-${tareaId}`]: !prev[`${proyectoId}-${moduloId}-${tareaId}`], // Corregido aquí

        }));
    };



    const handleMouseEnter1 = (id) => {
        setHoveredRow(id);
    };

    const handleMouseLeave1 = () => {
        setHoveredRow(null);
    };
// ... COPALSE PROYECTO




    //HOVER DE FILA PERSONALIZADO.. const [hoveredRow, setHoveredRow] = useState(null); // Estado para la fila actualmente sobre la que se hace hover
    //
    //     const handleMouseEnter = (rowId) => {
    //         setHoveredRow(rowId); // Establecer la fila que se está "hovering"
    //     };
    //
    //     const handleMouseLeave = () => {
    //         setHoveredRow(null); // Limpiar el estado cuando se sale de la fila
    //     };
    //
    //     const rowsData = [
    //         { id: 1, title: 'Texto adicional PROYECTO 1' },
    //         { id: 2, title: 'Texto adicional PROYECTO 2' },
    //         { id: 3, title: 'Texto adicional PROYECTO 3' },
    //     ];
    const columns = [
        // ... tus columnas
    ];

    const [isVisiblePendiente, setIsVisiblePendinte] = useState(false);
    const [isVisibleProceso, setIsVisibleProseco] = useState(false);
    const [isVisibleCompletado, setIsVisibleCompletado] = useState(false);
    const [isVisibleEntregado, setIsVisibleEntregado] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibilityPendinte = () => {
        setIsVisiblePendinte(!isVisiblePendiente);
    };
    const toggleVisibilityProceso = () => {
        setIsVisibleProseco(!isVisibleProceso);
    };
    const toggleVisibilityCompletado = () => {
        setIsVisibleCompletado(!isVisibleCompletado);
    };
    const toggleVisibilityEntregado = () => {
        setIsVisibleEntregado(!isVisibleEntregado);
    };

    const handleCheckboxChange = (checked, taskId) => {
        console.log(`Task ${taskId} is ${checked ? 'checked' : 'unchecked'}`);
    };
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };



    return (
        <>
            <>
                <div className="cu-task-list-header__row">
                    <div className="cu-task-list-header__row-inner">
                        {/* Botón para añadir una nueva tarea */}

                            <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal('Añadirproyecto')}
                    >
                        Crear Proyecto así
                    </Button>


                    </div>
                </div>
            </>
        </>
    );
}

export default Otra;