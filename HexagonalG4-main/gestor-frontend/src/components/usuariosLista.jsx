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
    Space,
    Switch
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
    FolderOpenOutlined,
    UsergroupAddOutlined,




} from '@ant-design/icons';

const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];



function UsuariosList() {
    const [usuarios, setUsuarios] = useState([]);
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
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [editingId, setEditingId] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null); // Estado para
    const [rol, setRol] = useState([]);

    useEffect(() => {
       // if (token) {

        fetchUsuarios(token);
        fetchRoles(token);

        console.log("aqui"+usuarios)
    }, [token]);

    // Usar un efecto para observar cambios en `rol`
    useEffect(() => {
        console.log("aquí -------- cambion:", rol);
    }, [rol]);

    //const handleDoubleClick = (projectId) => {
      //  setEditingId(projectId);
    //};

    const handleDoubleClick = (projectId, roles) => {
        // Verifica si alguno de los roles contiene "GESTOR"
        const hasGestor = roles.some(role => role.nombreRol.includes("GESTOR"));

        if (hasGestor) {
            console.log("No se puede editar debido al rol 'GESTOR'.");
            return; // No hacer nada si contiene "GESTOR"
        }

        // Si no contiene "GESTOR", se realiza la acción
        setEditingId(projectId);
        console.log("Edición permitida para el proyecto con ID:", projectId);
    };



    //ACTUALIZR ROL DE USUARIO
    const handleChange = async (value, usarioId) => {


        if (value === 'none') {
            setSelectedOption(null);

            try {
                // Llamar a la API para establecer la prioridad a null
                const response = await axios.put(
                    `http://localhost:8080/api/usuariosrol/${usarioId}/roles`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );
                console.log("usuario actualizada a null:", response.data);
                await fetchUsuarios(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = rol.find(option => option.value === value);

            try {
                // Usar el ID del proyecto y el ID de la prioridad seleccionada
                const response = await axios.put(
                    `http://localhost:8080/api/usuariosrol/${usarioId}/roles`
                    , [selected.value],
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );
                console.log("usuario actualizada:", response.data);
                await fetchUsuarios(token);
            } catch (error) {
                console.error("Error al actualizar usuario", error);
            }
        }

        setEditingId(null); // Cambiar aquí para finalizar la edición
    };


    //ROLES

    const fetchRoles = async (token) => {
        try {

            const response = await axios.get(`http://localhost:8080/api/usuariosrol/roles`

                ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                });

            console.log("roles que hay:", response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                const usuarioValor = response.data
                    .filter(rol => rol.nombreRol !== "GESTOR" && rol.nombreRol !== "ADMINISTRADOR")
                    .map((rol, index) => ({
                    label: rol.nombreRol || "Sin nombre",
                    value: rol.id !== undefined ? rol.id : index + 3, // Usa el índice + 1 si el id está indefinido
                    desc: rol.nombreRol || "Sin descripción",
                }));
                setRol(usuarioValor);
            } else {
                console.warn("La respuesta del servidor no contiene roles válidos:", response.data);
            }

            console.log("aqui --------roles: "+rol);

            console.log("rol obyeniedo dato.."+rol)

        } catch (error) {
            console.error("Error al obtener prioridades:", error);
            // Puedes mostrar un mensaje de error si es necesario
        }
    };




//AXIOS ARCHIVAR PROYECTO
    const archivarProyecto = async (id, nombreProyecto) => {
        // Muestra una alerta de confirmación con el nombre del proyecto
        const result = await Swal.fire({
            title: `¿Está seguro de archivar el proyecto "${nombreProyecto}"?`,
            text: 'Una vez archivado, no podrá recuperarlo fácilmente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, archivar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`http://localhost:8080/api/proyectos/${id}/estado`, null, {
                    params: { nuevoEstado: 'ARCHIVADO' }
                });
                console.log('Proyecto archivado:', response.data);

                // Actualiza el estado de tus proyectos si es necesario
                setUsuarios((prevProyectos) => prevProyectos.filter(proyecto => proyecto.id !== id));

                // Muestra un mensaje de éxito
                Swal.fire('Archivado', 'El proyecto ha sido archivado.', 'success');

            } catch (error) {
                console.error('Error al archivar el proyecto:', error);
                // Muestra un mensaje de error
                Swal.fire('Error', 'Hubo un problema al archivar el proyecto.', 'error');
            }
        }
    };


    const fetchUsuarios = async (token) => {
        try {
            const response = await axios.get(`${backendUrl}/api/usuariosrol/todos`
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                }
            );
            console.log("Respuesta usaurios:", response.data);
            if (Array.isArray(response.data)) {
                const proyectosConColor = response.data.map((proyecto) => {
                    const color = getUniqueColor(proyecto.id);
                    return { ...proyecto, color };
                });

                // Inicializa los estados activos de cada usuario
                const initialActiveStates = {};
                proyectosConColor.forEach((usuario) => {
                    initialActiveStates[usuario.id] = usuario.activo; // Asumiendo que el objeto usuario tiene un campo 'activo'
                });
                setActiveStates(initialActiveStates);
                setUsuarios(proyectosConColor);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    const fetchPersona = async () => {
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
// Cargar el estado inicial desde localStorage
    const getInitialState = () => {
        const storedExpandedRows = localStorage.getItem('expandedRows');
        const storedExpandedModules = localStorage.getItem('expandedModules');
        const storedExpandedTasks = localStorage.getItem('expandedTasks');

        return {
            expandedRows: storedExpandedRows ? JSON.parse(storedExpandedRows) : {},
            expandedModules: storedExpandedModules ? JSON.parse(storedExpandedModules) : {},
            expandedTasks: storedExpandedTasks ? JSON.parse(storedExpandedTasks) : {}
        };
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
            const proyecto = usuarios.find(p => p.id === id);
            setSelectedProject(proyecto);
        }

        // Lógica para añadir proyecto o módulo
        if (typeModal === 'Añadirproyecto') {
            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }

        // Lógica para editar proyecto
        if (typeModal === 'editarProyecto' && id) {
            const proyecto2 = usuarios.find(p => p.id === id);
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
            const proyecto = usuarios.find(p => p.id === id);

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
            const proyecto = usuarios.find(p => p.id === id);
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
            const proyecto = usuarios.find(p => p.id === id);


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
                fetchUsuarios();
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

    // Almacenar el estado en localStorage
    const saveStateToLocalStorage = (type, state) => {
        localStorage.setItem(type, JSON.stringify(state));
    };

    const [expandedRows, setExpandedRows] = useState(getInitialState().expandedRows);
    const [expandedModules, setExpandedModules] = useState(getInitialState().expandedModules);
    const [expandedTasks, setExpandedTasks] = useState(getInitialState().expandedTasks);



    // TOGGLE DE PROYECTO
    const toggleCollapseProyecto = (id) => {
        setExpandedRows((prev) => {
            const newState = { ...prev, [id]: !prev[id] };
            saveStateToLocalStorage('expandedRows', newState);
            return newState;
        });
    };


    // TOGGLE DE MODULO
    const toggleCollapseModulo = (proyectoId, moduloId) => {
        setExpandedModules((prev) => {
            const newState = { ...prev, [`${proyectoId}-${moduloId}`]: !prev[`${proyectoId}-${moduloId}`] };
            saveStateToLocalStorage('expandedModules', newState);
            return newState;
        });
    };

    // TOGGLE DE TAREA
    const toggleCollapseTarea = (proyectoId, moduloId, tareaId) => {
        setExpandedTasks((prev) => {
            const newState = { ...prev, [`${proyectoId}-${moduloId}-${tareaId}`]: !prev[`${proyectoId}-${moduloId}-${tareaId}`] };
            saveStateToLocalStorage('expandedTasks', newState);
            return newState;
        });
    };

    const [activeStates, setActiveStates] = useState({}); // Estado para manejar el estado de cada usuario



    const [active, setActive] = useState(true); // Estado inicial del Switch
    const onChange = async (checked, rowId) => {
        try {
            // Actualiza el estado en la base de datos
            await axios.put(`http://localhost:8080/api/usuarios/${rowId}/estado`, {
                activo: checked, // Enviar el nuevo estado
            }
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                }

            );

            // Actualiza el estado local
            setActiveStates((prevState) => ({
                ...prevState,
                [rowId]: checked, // Actualiza el estado del usuario específico
            }));


        } catch (error) {
           console.log('Error al actualizar el estado en la base de datos');
        }
    };




    return (
        <>

            <Row gutter={[16, 16]}
                 style={{


                     minWidth: '600px',
                     transition: 'background-color 0.3s ease',

                     color:'#656f7d',
                     fontSize:'12px'

                 }}>
                <Col span={24} style={{ padding: '16px', fontSize:23 }}>

                    <span>Todos Usuarios</span>
                </Col>
            </Row>

            {/* Lista de tareas (sin tabla) */}
            <div className="task-list">
                {/* Aquí puedes agregar los encabezados de las columnas si es necesario */}


                {/* Renderiza las tareas */}


                {/* Si no está colapsado, renderiza el contenido adicional */}

                <>
                    <Row gutter={[16, 16]}
                         style={{
                             borderBottom: '1px solid #d9d9d9',
                             cursor:"pointer",
                             minWidth: '600px',
                             transition: 'background-color 0.3s ease',
                             paddingBottom:'13px',
                             color:'#656f7d',
                             fontSize:'12px'

                         }}

                    >
                        <Col span={1}
                        >
                            <div>#</div>
                        </Col>
                        <Col span={6}
                        >
                            <div>Nombres</div>
                        </Col>
                        <Col span={4}>
                            <div className="task-item__assignee">Correo</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__due-date">Teléfono</div>
                        </Col>
                        <Col span={5}>
                            <div className="task-item__due-date">Rol</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__due-date"> Estado</div>
                        </Col>
                        <Col span={2}>
                            <div className="task-item__due-date">Acion</div>
                        </Col>
                    </Row>


                    {usuarios.map((row,index) => (
                        <React.Fragment key={row.id}>
                            <Row
                                gutter={[16, 16]}
                                align="middle"
                                style={{
                                    borderBottom: '1px solid rgba(217, 217, 217, 0.4)',
                                    cursor:"pointer",
                                    minWidth: '600px',
                                    transition: 'background-color 0.3s ease',
                                    backgroundColor: hoveredRow === row.id ? '#e0e0e0' : '',
                                    color:'#2a2e34',
                                    paddingTop:'6px',
                                    paddingBottom:'6px',

                                }}

                                onMouseEnter={() => handleMouseEnter(row.id)}
                                onMouseLeave={handleMouseLeave}

                            >
                                <Col span={1}>
                                    {/* Display row number (index + 1) */}
                                    {index + 1}
                                </Col>
                                <Col span={6}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>



                                        <Tooltip title="Ver proyecto">

                                            <a

                                                style={{

                                                    marginLeft: 5,

                                                    textDecoration: 'none',
                                                    color: 'inherit'
                                                }}
                                                onClick={() => showModal('verProyecto', row.id)}
                                            >
                                                <span  style={{color:'#656f7d'}} >{row.nombres}</span>
                                                <span style={{paddingLeft:4,color:'#656f7d'}}  >
                                                    {row.apellidoPaterno}
                                                    </span>
                                                <span style={{paddingLeft:4,color:'#656f7d'}}>{row.apellidoMaterno}
                                                    </span>
                                            </a>
                                        </Tooltip>

                                    </div>
                                </Col>

                                <Col span={4}>
                                    <span style={{color:'#656f7d'}}>{row.email}</span>
                                </Col>
                                <Col  span={3} style={{color:'#656f7d'}}>
                                    <span>{row.telefono}</span>

                                </Col>

                                <Col
                                    span={5}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    onMouseEnter={() => handleMouseEnter(row.id)}
                                    onMouseLeave={handleMouseLeave}
                                    onDoubleClick={() => handleDoubleClick(row.id)}
                                >
                                    {editingId === row.id ? (
                                        <Select
                                            style={{
                                                width: '100%',
                                                boxShadow: 'none',
                                                transition: 'background-color 0.3s ease, border 0.3s ease',
                                            }}
                                            className={`custom-select ${hoveredRow === row.id ? 'hovered-bg' : ''}`}
                                            value={selectedOption ? selectedOption.value : 'none'}
                                            onChange={(value) => handleChange(value, row.id)} // Pasar el ID del proyecto
                                            onBlur={() => setEditingId(null)} // Cambiar aquí
                                            suffixIcon={null}
                                            showArrow={false}
                                            showSearch={false}
                                            size="small"
                                        >
                                            {rol.length > 0 ? (
                                                rol.map(({ value, label }) => (
                                                    <Option key={value} value={value}>
                                                        <Space>

                                                            {label}
                                                        </Space>
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option value="none">sin rol disponibles</Option>
                                            )}


                                        </Select>
                                    ) : (
                                        <span style={{ cursor: 'pointer' }} onDoubleClick={() => handleDoubleClick(row.id, row.roles)}>
      {row.roles && row.roles.length > 0 ? (
          <Space>
              {
                  row.roles.some(role => role.nombreRol === "GESTOR") ? (
                      // Si existe "GESTOR", solo muestra "GESTOR"
                      <span>{row.roles.find(role => role.nombreRol === "GESTOR").nombreRol}</span>
                  ) : (
                      // Si no hay "GESTOR", muestra todos los roles
                      row.roles.map((role, index) => (
                          <span key={index} style={{backgroundColor:'#27ba40', color:'#ffffff', fontSize:10, fontWeight:500, padding:2, borderRadius:5}}>
          {role.nombreRol}
                              {index < row.roles.length - 1 && ', '} {/* Para separar con comas */}
        </span>
                      ))
                  )
              }
          </Space>

      ) : (
          <Space>
              <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
              Sin rol
          </Space>
      )}
    </span>
                                    )}
                                </Col>



                                <Col span={3}>
                                    <Switch
                                        checkedChildren="Activo"
                                        unCheckedChildren="Desactivo"
                                        checked={activeStates[row.id]} // Usa el estado individual del usuario
                                        onChange={(checked) => onChange(checked, row.id)}
                                        size="default" // Tamaño predeterminado
                                        // Llama a la función cuando cambia el estado
                                    />
                                </Col>


                                <Col span={2}>

                                    <EllipsisOutlined />

                                </Col>
                            </Row>


                        </React.Fragment>
                    ))}


                </>

            </div>






        </>
    );

}

export default UsuariosList;
