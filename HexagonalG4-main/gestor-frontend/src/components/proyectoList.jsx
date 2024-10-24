import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useN
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
    FlagOutlined

} from '@ant-design/icons';

const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];



function ProyectoList() {
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
    const navigate = useNavigate();
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

    const handleButtonClick = (proyectoId,moduloId) => {
        console.log(`Navegando a /modulos/${proyectoId}/tareas`);
       // navigate(`/modulos/${proyectoId}/tareas`); // Elimina '/api' si es innecesario
navigate(`/proyectos/${proyectoId}/modulos/${moduloId}`)

    };



    const  handleButtonClickSub = (proyectoId,moduloId,tareaId) => {
        console.log(`Navegando a /modulos/${proyectoId}/tareas`);
        // navigate(`/modulos/${proyecto7Id}/tareas`); // Elimina '/api' si es innecesario
        navigate(`/proyectos/${proyectoId}/modulos/${moduloId}/tarea/${tareaId}`)

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
                    // const response = await axios.post(url, values);
                    //   console.log("estaaaaa"+response);
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
                    // const response = await axios.post(url, values);
                    //console.log("estaaaaa"+response);
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
            {/* PENDIENTE*/}
            <div className="cu-task-list-header__row">
                <div className="cu-task-list-header__row-inner">
                    {/* Botón para colapsar todas las tareas */}


                    {/* Estado de la tarea */}


                    {/* Opciones de hover */}


                    {/* Botón para añadir una nueva tarea */}

                    <Button
                        type="primary"

                        icon={<PlusOutlined/>}
                        onClick={() => showModal('Añadirproyecto')}
                        // onClick={() => showModal('proyecto')}
                        style={{}}
                    >
                        Crear Proyecto
                    </Button>

                </div>
            </div>

            {/* Lista de tareas (sin tabla) */}
            <div className="task-list">
                {/* Aquí puedes agregar los encabezados de las columnas si es necesario */}


                {/* Renderiza las tareas */}


                {/* Si no está colapsado, renderiza el contenido adicional */}

                <>
                    <Row gutter={[16, 16]}>
                        <Col span={11}>
                            <div>Nombre de proyecto</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__assignee">Asignado</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__due-date">Fecha Inicio</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__due-date">Fecha Fin</div>
                        </Col>
                        <Col span={4}>
                            <div className="task-item__due-date">Prioridad</div>
                        </Col>
                    </Row>


                    {proyectos.map((row) => (
                        <React.Fragment key={row.id}>
                            <Row
                                gutter={[16, 16]}
                                style={{
                                    borderBottom: '1px solid #d9d9d9',
                                    cursor:"pointer",
                                    minWidth: '600px',
                                    transition: 'background-color 0.3s ease',
                                    backgroundColor: hoveredRow === row.id ? '#e0e0e0' : '',
                                }}

                                onMouseEnter={() => handleMouseEnter(row.id)}
                                onMouseLeave={handleMouseLeave}

                            >
                                <Col span={11}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>

                                        <Button
                                            type="text"
                                            size="small"
                                            onClick={() => toggleCollapseProyecto(row.id)}
                                            icon={expandedRows[row.id] ? <CaretUpOutlined/> : <CaretDownOutlined/>}
                                        />
                                        <FolderOutlined style={{
                                            backgroundColor: row.color,
                                            color: 'black',
                                            padding: '5px',
                                            borderRadius: '50%',
                                            border: '2px solid black'
                                        }}/>
                                        <Tooltip title="Ver proyecto">

                                            <a

                                                style={{

                                                    marginLeft: 5,

                                                    textDecoration: 'none',
                                                    color: 'inherit'
                                                }}
                                                onClick={() => showModal('verProyecto', row.id)}
                                            >
                                                {row.nombre}
                                            </a>
                                        </Tooltip>
                                        {expandedRows[row.id] && (
                                            <Tooltip title="Añadir módulo">
                                                <Button
                                                    icon={<PlusOutlined/>}
                                                    size="small"
                                                    type="link"
                                                    onClick={() => showModal('AñadirModulo', row.id)}
                                                    //onClick={() => showModal('tarea', proyecto.id, modulo.id)}
                                                />
                                            </Tooltip>
                                        )}
                                    </div>
                                </Col>

                                <Col span={3}>
                                    <Avatar icon={<UserAddOutlined/>}/>
                                </Col>
                                <Col style={{ paddingTop: '8px' }} span={3}>
                                        <span style={{
                                            fontSize: '14px',
                                            paddingLeft: 5,
                                            margin: 0,
                                            fontWeight: '400'
                                        }}>
                                       {new Date(row.fechaInicio).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>

                                </Col>
                                <Col style={{ paddingTop: '8px' }} span={3}>
                                             <span style={{
                                                 fontSize: '14px',
                                                 paddingLeft: 5,
                                                 margin: 0,
                                                 fontWeight: '400'
                                             }}>
                                       {new Date(row.fechaFin).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                </Col>
                                <Col span={4}>
                                    <Avatar icon={<FlagOutlined/>}/>
                                    {hoveredRow === row.id && (
                                        <>
                                            <Tooltip title="Editar proyecto">
                                                <a onClick={() => setModalVisible(true)}
                                                   style={{cursor: 'pointer'}}>
                                                    <Avatar
                                                        icon={<EditOutlined />}
                                                        style={{ marginLeft: '0', backgroundColor: 'transparent', color: '#2c2c30' }}
                                                    />
                                                </a>
                                            </Tooltip>
                                            <Tooltip title="Archivar proyecto">
                                                <a onClick={() => setModalVisible(true)} style={{ cursor: 'pointer' }}>
                                                    <Avatar
                                                        icon={<SaveOutlined />}
                                                        style={{ backgroundColor: 'transparent', color: '#2c2c30' }}
                                                    />
                                                </a>
                                            </Tooltip>
                                        </>
                                    )}
                                </Col>
                            </Row>

                            {/* Mostrar los módulos debajo del proyecto */}
                            {expandedRows[row.id] && row.modulos?.map((modulo) => (
                                <React.Fragment key={modulo.id}>
                                    <Row
                                        style={{
                                            marginLeft: '20px',
                                            cursor: 'pointer',
                                            minWidth: '600px',
                                            backgroundColor: hoveredRowmodulo === modulo.id ? '#e0e0e0' : '',
                                        }}
                                        onMouseEnter={() => handleMouseEntermodulo(modulo.id)}
                                        onMouseLeave={handleMouseLeavemodulo}

                                    >
                                        <Col span={11}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Evita que el clic se propague al Row
                                                        toggleCollapseModulo(row.id, modulo.id);
                                                    }}
                                                    icon={expandedModules[modulo.id] ? <CaretUpOutlined/> :
                                                        <CaretDownOutlined/>}
                                                />
                                                <FolderOutlined
                                                    style={{
                                                        backgroundColor: row.color,
                                                        color: 'black',
                                                        padding: '5px',
                                                        borderRadius: '50%',
                                                        border: '2px solid black',
                                                    }}
                                                />
                                                <Tooltip title="Ver modulo">
                                                    <a

                                                        style={{

                                                            marginLeft: 5,

                                                            textDecoration: 'none',
                                                            color: 'inherit'
                                                        }}
                                                        onClick={() => showModal('verModulo', row.id, modulo.id)}
                                                    >

                                                        {modulo.nombre}
                                                    </a>
                                                </Tooltip>
                                                <Tooltip title="kamban">
                                                    <Button
                                                        icon={<InsertRowBelowOutlined />}
                                                        size="small"
                                                        type="link"
                                                        onClick={() => handleButtonClick(row.id,modulo.id)}  // Redirige al hacer clic
                                                        style={{ marginLeft: 'auto' }}
                                                    />
                                                </Tooltip>
                                                {/* Mostrar el botón solo si el módulo está expandido */}
                                                {!expandedModules[modulo.id] && (
                                                    <Tooltip title="Añadir tarea">
                                                        <Button
                                                            icon={<PlusOutlined/>}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => showModal('AñadirTarea', row.id, modulo.id)}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={3}>
                                            <Avatar icon={<UserAddOutlined/>}/>
                                            <Avatar icon={<UserAddOutlined/>}/>
                                        </Col>
                                        <Col style={{ paddingTop: '8px' }} span={3}>
                                                <span style={{
                                                    fontSize: '14px',
                                                    paddingLeft: 5,
                                                    margin: 0,
                                                    fontWeight: '400'
                                                }}>
                                       {new Date(modulo.fechaInicio).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                        </Col>
                                        <Col style={{ paddingTop: '8px' }} span={3}>
                                                   <span style={{
                                                       fontSize: '14px',
                                                       paddingLeft: 5,
                                                       margin: 0,
                                                       fontWeight: '400'
                                                   }}>
                                       {new Date(modulo.fechaFin).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                        </Col>
                                        <Col span={4}>
                                            <Avatar icon={<FlagOutlined/>}/>

                                            {hoveredRowmodulo === modulo.id && (
                                                <>
                                                    <Tooltip title="Editar proyecto">
                                                        <a onClick={() => setModalVisible(true)}
                                                           style={{cursor: 'pointer'}}>
                                                            <Avatar
                                                                icon={<EditOutlined />}
                                                                style={{ marginLeft: '0', backgroundColor: 'transparent', color: '#2c2c30' }}
                                                            />
                                                        </a>
                                                    </Tooltip>
                                                    <Tooltip title="Archivar proyecto">
                                                        <a onClick={() => setModalVisible(true)} style={{ cursor: 'pointer' }}>
                                                            <Avatar
                                                                icon={<SaveOutlined />}
                                                                style={{ backgroundColor: 'transparent', color: '#2c2c30' }}
                                                            />
                                                        </a>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                    {expandedModules[`${row.id}-${modulo.id}`] && modulo.tareas?.map((tarea) => (
                                        <React.Fragment key={tarea.id}>
                                            <Row
                                                style={{
                                                    marginLeft: '20px',
                                                    padding:0,
                                                    borderBottom: '1px solid #d9d9d9',
                                                    cursor: 'pointer',
                                                    backgroundColor: hoveredRowtarea === tarea.id ? '#e0e0e0' : '',
                                                    boxSizing: 'border-box', // Para incluir padding y border en el tamaño

                                                }}

                                                onMouseEnter={() => handleMouseEntertarea(tarea.id)}
                                                onMouseLeave={handleMouseLeavetarea}
                                            >
                                                <Col span={11} style={{ display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Evita que el click propague al Row
                                                            toggleCollapseTarea(row.id, modulo.id, tarea.id);
                                                        }}
                                                        icon={expandedModules[`${row.id}-${modulo.id}-${tarea.id}`] ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                                    />
                                                    <FileTextOutlined style={{
                                                        backgroundColor: row.color,
                                                        color: 'black',
                                                        padding: '5px',
                                                        marginRight: '4px' // Espacio entre el icono y el texto
                                                    }} />


                                                    <Tooltip title="Ver tarea">
                                                        <a

                                                            style={{

                                                                marginLeft: 5,

                                                                textDecoration: 'none',
                                                                color: 'inherit'
                                                            }}
                                                            onClick={() => showModal('verTarea', row.id, modulo.id, tarea.id)}
                                                        >

                                                            {tarea.nombre}
                                                        </a>
                                                    </Tooltip>
                                                    <Tooltip title="kamban">
                                                        <Button
                                                            icon={<InsertRowBelowOutlined />}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => handleButtonClickSub(row.id,modulo.id,tarea.id)}  // Redirige al hacer clic
                                                            style={{ marginLeft: 'auto' }}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Añadir subtarea">
                                                        <Button
                                                            icon={<PlusOutlined/>}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => showModal('AñadirSubtarea', row.id, modulo.id, tarea.id)}
                                                            //onClick={() => showModal('tarea', proyecto.id, modulo.id)}
                                                        />
                                                    </Tooltip>

                                                </Col>

                                                <Col span={3}> <Avatar icon={<UserAddOutlined />} /></Col>
                                                <Col style={{ paddingTop: '8px' }} span={3}>
                                                          <span style={{
                                                              fontSize: '14px',
                                                              paddingLeft: 5,
                                                              margin: 0,
                                                              fontWeight: '400'
                                                          }}>
                                       {new Date(tarea.fechaInicio).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                                </Col>
                                                <Col style={{ paddingTop: '8px' }} span={3}><span style={{
                                                    fontSize: '14px',
                                                    paddingLeft: 5,
                                                    margin: 0,
                                                    fontWeight: '400'
                                                }}>
                                       {new Date(tarea.fechaFin).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span></Col>
                                                <Col span={4}>

                                                    <Avatar icon={<FlagOutlined/>}/>
                                                    {hoveredRowtarea === tarea.id && (
                                                        <>
                                                            <Tooltip title="Editar proyecto">
                                                                <a onClick={() => setModalVisible(true)}
                                                                   style={{cursor: 'pointer'}}>
                                                                    <Avatar
                                                                        icon={<EditOutlined />}
                                                                        style={{ marginLeft: '0', backgroundColor: 'transparent', color: '#2c2c30' }}
                                                                    />
                                                                </a>
                                                            </Tooltip>
                                                            <Tooltip title="Archivar proyecto">
                                                                <a onClick={() => setModalVisible(true)} style={{ cursor: 'pointer' }}>
                                                                    <Avatar
                                                                        icon={<SaveOutlined />}
                                                                        style={{ backgroundColor: 'transparent', color: '#2c2c30' }}
                                                                    />
                                                                </a>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </Col>
                                            </Row>


                                            {expandedModules[`${row.id}-${modulo.id}-${tarea.id}`] && tarea.subtareas?.map((subtarea) => (
                                                <Row key={subtarea.id}
                                                     style={{
                                                         marginLeft: '20px',
                                                         padding:0,

                                                         borderBottom: '1px solid #d9d9d9',
                                                         cursor: 'pointer',
                                                         backgroundColor: hoveredRowsubtarea === subtarea.id ? '#e0e0e0' : '',
                                                         boxSizing: 'border-box', // Para incluir padding y border en el tamaño
                                                     }}

                                                     onMouseEnter={() => handleMouseEntersubtarea(subtarea.id)}
                                                     onMouseLeave={handleMouseLeavesubtarea}

                                                >

                                                    <Col span={11} style={{ display: 'flex', alignItems: 'center', paddingLeft:50 }}>
                                                        <div style={{
                                                            width: '20px', // Ajusta el tamaño del círculo
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: row.color, // Cambia el color según tus necesidades
                                                            marginRight: '8px' // Espacio entre el círculo y el texto
                                                        }}></div>
                                                        <Tooltip title="Ver subTarea">
                                                            <a

                                                                style={{

                                                                    marginLeft: 5,

                                                                    textDecoration: 'none',
                                                                    color: 'inherit'
                                                                }}
                                                                onClick={() => showModal('verSubtarea', row.id, modulo.id, tarea.id, subtarea.id)}
                                                            >

                                                                {subtarea.nombre}
                                                            </a>
                                                        </Tooltip>
                                                        {/* Elimina el margen superior e inferior del párrafo */}
                                                    </Col>

                                                    <Col span={3}>
                                                        <Avatar icon={<UserAddOutlined />} />
                                                    </Col>
                                                    <Col style={{ paddingTop: '8px' }} span={3}>
                                                        <span style={{
                                                            fontSize: '14px',
                                                            paddingLeft: 5,
                                                            // Ajusta este valor según lo que necesites
                                                            margin: 0,
                                                            fontWeight: '400'
                                                        }}>
                                                            {new Date(subtarea.fechaInicio).toLocaleDateString('es-ES', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </Col>
                                                    <Col style={{ paddingTop: '8px' }} span={3}>
                                                            <span style={{
                                                                fontSize: '14px',
                                                                paddingLeft: 5,
                                                                margin: 0,
                                                                fontWeight: '400'
                                                            }}>
                                       {new Date(subtarea.fechaFin).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                                    </Col>
                                                    <Col>
                                                        <Avatar icon={<FlagOutlined/>}/>

                                                        {hoveredRowsubtarea === subtarea.id && (
                                                            <>
                                                                <Tooltip title="Editar proyecto">
                                                                    <a onClick={() => setModalVisible(true)}
                                                                       style={{cursor: 'pointer'}}>
                                                                        <Avatar
                                                                            icon={<EditOutlined />}
                                                                            style={{ marginLeft: '0', backgroundColor: 'transparent', color: '#2c2c30' }}
                                                                        />
                                                                    </a>
                                                                </Tooltip>
                                                                <Tooltip title="Archivar proyecto">
                                                                    <a onClick={() => setModalVisible(true)} style={{ cursor: 'pointer' }}>
                                                                        <Avatar
                                                                            icon={<SaveOutlined />}
                                                                            style={{ backgroundColor: 'transparent', color: '#2c2c30' }}
                                                                        />
                                                                    </a>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </Col>

                                                </Row>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}


                </>

            </div>

            <Modal
                title={
                    modalType === 'verProyecto' ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>
                                <HomeOutlined />
                                Detalle proyecto
                              </span>
                        ) :
                        modalType === 'editarProyecto' ? 'Editar Proyecto' :
                            modalType === 'Añadirproyecto' ? 'Crear Proyecto' :
                                modalType === 'verModulo' ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>
                                <GroupOutlined />
                                Detalle módulo
                            </span>
                                    ):
                                    modalType === 'editarModulo' ? 'Editar Módulo' :
                                        modalType === 'AñadirModulo' ? 'Crear Módulo' :
                                            modalType === 'editarProyecto' ? 'Editar Proyecto' :
                                                modalType === 'Añadirproyecto' ? 'Crear Proyecto' :
                                                    modalType === 'verTarea' ? (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>
                                <RobotOutlined />
                                Detalle tarea
                            </span>
                                                        ):

                                                        modalType === 'editarTarea' ? 'Editar Tarea' :
                                                            modalType === 'AñadirTarea' ? 'Crear Tarea':
                                                                modalType === 'verSubtarea' ? (
                                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>
                                <FileOutlined />
                                Detalle subtarea
                            </span>
                                                                    ):

                                                                    modalType === 'editarSubtarea' ? 'Editar Subtarea' :
                                                                        modalType === 'AñadirSubtarea' ? 'Crear Subtarea' :
                                                                            'Crear Item'
                }
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={modalType === 'verProyecto'|| modalType === 'verModulo' ||modalType==='verTarea'||modalType==='verSubtarea'? 800 : undefined}
                //  bodyStyle={{  borderBottom: '1px solid #d9d9d9',borderTop: '1px solid #d9d9d9', borderRadius: '8px' }} // Estilo del cuerpo del modal


            >
                {/* Contenido según el modalType */}

                {modalType === 'verProyecto' && selectedProject && (

                    <div style={{paddingLeft: 10}}>


                        <p style={{fontSize: '30px', fontWeight: 'bold'}}>
                            {selectedProject.nombre}
                        </p>


                        <div>

                            <p
                                style={{

                                    padding: '10px',
                                    backgroundColor: '#f0f2f5',
                                    borderRadius: '5px',
                                    display: 'flex', // Usar flex para alinear el ícono y el texto
                                    alignItems: 'flex-start' // Alinear el ícono al inicio (parte superior)
                                }}
                            >
                                <MessageOutlined
                                    style={{marginRight: '8px', alignSelf: 'flex-start'}}/>
                                {selectedProject.descripcion}
                            </p>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <RedoOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Estado:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>{selectedProject.estado}</span>
                                            </p>


                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha inicio:
                                                <span style={{
                                                    fontSize: '14px',
                                                    paddingLeft: 5,
                                                    margin: 0,
                                                    fontWeight: '400'
                                                }}>
                                        {new Date(selectedProject.fechaInicio).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                            </p>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha fin:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                        {new Date(selectedProject.fechaFin).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>

                                            </p>

                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <HourglassOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Duración:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                        <span style={{fontSize: '14px', paddingLeft: 5, margin: 0, fontWeight: '400'}}>
            {
                Math.ceil(
                    (new Date(selectedProject.fechaFin) - new Date(selectedProject.fechaInicio)) / (1000 * 60 * 60 * 24)
                )
            } días
        </span>
                                    </span>

                                            </p>

                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                         <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <UserOutlined/>
                                      <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                        Asignar persona:
                                      </p>
                                    </span>

                                    <div style={{width: 300}}>
                                        <Select
                                            mode="multiple"
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Seleccionar una opción"
                                            defaultValue={['jjnio']}
                                            options={options}
                                            optionRender={(option) => (
                                                <Space>
                                                <span role="img" aria-label={option.data.label}>
                                                    {option.data.emoji}
                                                </span>
                                                    {option.data.desc}
                                                </Space>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>


                )}

                {modalType === 'editarProyecto' && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{required: true, message: 'Por favor, ingresa el nombre'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{required: true, message: 'Por favor, ingresa la descripción'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{required: true, message: 'Por favor selecciona un estado'}]}
                        >
                            <Select>
                                <Select.Option value="PENDIENTE">Pendiente</Select.Option>
                                <Select.Option value="EN_PROGRESO">En Progreso</Select.Option>
                                <Select.Option value="COMPLETADO">Completado</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                )}

                {(modalType === 'Añadirproyecto' || modalType === 'AñadirModulo') && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{required: true, message: 'Por favor, ingresa el nombre'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="fechaInicio"
                            label="Fecha de Inicio"
                            rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="fechaFin"
                            label="Fecha de Fin"
                            rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}
                        >
                            <DatePicker />
                        </Form.Item>

                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}

                {modalType === 'verModulo' && selectedModule && (


                    <div style={{paddingLeft: 10}}>


                        <p style={{fontSize: '30px', fontWeight: 'bold'}}>
                            {selectedModule.nombre}
                        </p>


                        <div>

                            <p
                                style={{

                                    padding: '10px',
                                    backgroundColor: '#f0f2f5',
                                    borderRadius: '5px',
                                    display: 'flex', // Usar flex para alinear el ícono y el texto
                                    alignItems: 'flex-start' // Alinear el ícono al inicio (parte superior)
                                }}
                            >
                                <MessageOutlined
                                    style={{marginRight: '8px', alignSelf: 'flex-start'}}/>
                                {selectedModule.descripcion}
                            </p>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <RedoOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Estado:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>{selectedModule.estado}</span>
                                            </p>


                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha inicio:
                                                <span style={{
                                                    fontSize: '14px',
                                                    paddingLeft: 5,
                                                    margin: 0,
                                                    fontWeight: '400'
                                                }}>
                                        {new Date(selectedModule.fechaInicio).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                            </p>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha fin:
                                                <span style={{
                                                    fontSize: '14px',
                                                    paddingLeft: 5,
                                                    margin: 0,
                                                    fontWeight: '400'
                                                }}>
                                        {new Date(selectedModule.fechaFin).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                            </p>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <HourglassOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Duración:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                        <span style={{fontSize: '14px', paddingLeft: 5, margin: 0, fontWeight: '400'}}>
            {
                Math.ceil(
                    (new Date(selectedModule.fechaFin) - new Date(selectedModule.fechaInicio)) / (1000 * 60 * 60 * 24)
                )
            } días
        </span>
                                    </span>
                                            </p>

                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                         <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <UserOutlined/>
                                      <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                        Asignar persona:
                                      </p>
                                    </span>

                                    <div style={{width: 300}}>
                                        <Select
                                            mode="multiple" // Permitir selección múltiple
                                            style={{ width: '100%' }} // Estilo del Select
                                            placeholder="Seleccionar una opción" // Placeholder del Select
                                            value={selectedValues} // Estado de los valores seleccionados
                                            onChange={(values) => setSelectedValues(values)} // Actualiza el estado al seleccionar/deseleccionar opciones
                                            options={personas.map((persona) => ({
                                                label: (
                                                    <Space>
                            <span role="img">

                                  <Avatar
                                      icon={<UserAddOutlined />}
                                      style={{ width: '16px', height: '16px', fontSize: '12px' }} // Tamaño pequeño
                                  />
                            </span>
                                                        {persona.label} {/* Mostramos el nombre en minúsculas */}
                                                    </Space>
                                                ),
                                                value: persona.value // Asegúrate de que el value sea idPersona
                                            }))}
                                        />

                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                )}

                {modalType === 'editarModulo' && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}

                {modalType === 'verTarea' && selectedTarea && (


                    <div style={{paddingLeft: 10}}>


                        <p style={{fontSize: '30px', fontWeight: 'bold'}}>
                            {selectedTarea.nombre}
                        </p>


                        <div>

                            <p
                                style={{

                                    padding: '10px',
                                    backgroundColor: '#f0f2f5',
                                    borderRadius: '5px',
                                    display: 'flex', // Usar flex para alinear el ícono y el texto
                                    alignItems: 'flex-start' // Alinear el ícono al inicio (parte superior)
                                }}
                            >
                                <MessageOutlined
                                    style={{marginRight: '8px', alignSelf: 'flex-start'}}/>
                                {selectedTarea.descripcion}
                            </p>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <RedoOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Estado:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>{selectedTarea.estado}</span>
                                            </p>


                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha inicio:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                       {new Date(selectedTarea.fechaInicio).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                            </p>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha fin:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                        {new Date(selectedTarea.fechaFin).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                            </p>

                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <HourglassOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Duración:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                        <span style={{fontSize: '14px', paddingLeft: 5, margin: 0, fontWeight: '400'}}>
            {
                Math.ceil(
                    (new Date(selectedTarea.fechaFin) - new Date(selectedTarea.fechaInicio)) / (1000 * 60 * 60 * 24)
                )
            } días
        </span>
                                    </span>
                                            </p>

                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                         <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <UserOutlined/>
                                      <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                        Asignar persona:
                                      </p>
                                    </span>

                                    <div style={{width: 300}}>
                                        <Select
                                            mode="multiple"
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Seleccionar una opción"
                                            defaultValue={['jjnio']}
                                            options={options}
                                            optionRender={(option) => (
                                                <Space>
                                                <span role="img" aria-label={option.data.label}>
                                                    {option.data.emoji}
                                                </span>
                                                    {option.data.desc}
                                                </Space>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                )}

                {modalType === 'editarTarea' && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}

                {modalType === 'AñadirTarea' && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="fechaInicio"
                            label="Fecha de Inicio"
                            rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="fechaFin"
                            label="Fecha de Fin"
                            rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{ required: true, message: 'Por favor selecciona un estado' }]}
                        >
                            <Select>
                                <Select.Option value="PENDIENTE">Pendiente</Select.Option>
                                <Select.Option value="EN_PROGRESO">En Progreso</Select.Option>
                                <Select.Option value="COMPLETADA">Completado</Select.Option>

                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}



                {modalType === 'verSubtarea' && selectedsubTarea&& (

                    <div style={{paddingLeft: 10}}>


                        <p style={{fontSize: '30px', fontWeight: 'bold'}}>
                            {selectedsubTarea.nombre}
                        </p>


                        <div>

                            <p
                                style={{

                                    padding: '10px',
                                    backgroundColor: '#f0f2f5',
                                    borderRadius: '5px',
                                    display: 'flex', // Usar flex para alinear el ícono y el texto
                                    alignItems: 'flex-start' // Alinear el ícono al inicio (parte superior)
                                }}
                            >
                                <MessageOutlined
                                    style={{marginRight: '8px', alignSelf: 'flex-start'}}/>
                                {selectedsubTarea.descripcion}
                            </p>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <RedoOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Estado:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>{selectedsubTarea.estado}</span>
                                            </p>


                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha inicio:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                       {new Date(selectedsubTarea.fechaInicio).toLocaleDateString('es-ES', {
                                           day: '2-digit',
                                           month: 'short',
                                           year: 'numeric'
                                       })}

                                    </span>
                                            </p>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <CalendarOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Fecha fin:<span style={{
                                                fontSize: '14px',
                                                paddingLeft: 5,
                                                margin: 0,
                                                fontWeight: '400'
                                            }}>
                                        {new Date(selectedsubTarea.fechaFin).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                            </p>

                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <HourglassOutlined/>
                                            <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                Duración:
                                                <span style={{
                                                    fontSize: '14px',
                                                    paddingLeft: 5,
                                                    margin: 0,
                                                    fontWeight: '400'
                                                }}>
                                        <span style={{fontSize: '14px', paddingLeft: 5, margin: 0, fontWeight: '400'}}>
            {
                Math.ceil(
                    (new Date(selectedsubTarea.fechaFin) - new Date(selectedsubTarea.fechaInicio)) / (1000 * 60 * 60 * 24)
                )
            } días
        </span>
                                    </span>
                                            </p>

                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                         <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <UserOutlined/>
                                      <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                        Asignar persona:
                                      </p>
                                    </span>

                                    <div style={{width: 300}}>
                                        <Select
                                            mode="multiple"
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Seleccionar una opción"
                                            defaultValue={['jjnio']}
                                            options={options}
                                            optionRender={(option) => (
                                                <Space>
                                                <span role="img" aria-label={option.data.label}>
                                                    {option.data.emoji}
                                                </span>
                                                    {option.data.desc}
                                                </Space>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                )}

                {modalType === 'editarSubtarea' && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}

                {modalType === 'AñadirSubtarea' && (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="fechaInicio"
                            label="Fecha de Inicio"
                            rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="fechaFin"
                            label="Fecha de Fin"
                            rules={[{ required: true, message: 'Por favor, selecciona una fecha' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{ required: true, message: 'Por favor selecciona un estado' }]}
                        >
                            <Select>
                                <Select.Option value="PENDIENTE">Pendiente</Select.Option>
                                <Select.Option value="EN_PROGRESO">En Progreso</Select.Option>
                                <Select.Option value="COMPLETADA">Completado</Select.Option>


                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}

            </Modal>





        </>
    );

}

export default ProyectoList;
