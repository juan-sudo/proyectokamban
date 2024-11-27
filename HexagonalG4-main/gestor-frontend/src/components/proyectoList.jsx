import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState,useRef } from 'react';
import "../index.css";
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useN
import _ from 'lodash';
import dayjs from 'dayjs';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable, } from 'react-beautiful-dnd';
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
    const [selectedValues, setSelectedValues] = useState([]);
    const navigate = useNavigate();
    const [usuarios, setUsuario] = useState([]);
    const [prioridad, setPrioridad] = useState([]);
    //const [usuariosModulo, setUsuario] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedPrioridadIds, setSelectedPrioridadIds] = useState([]);
    const [selectedModuloUserIds, setSelectedModuloUserIds] = useState([]);
    const [selectedTareaUserIds, setSelectedTareaUserIds] = useState([]);
    const [selectedSubTareaUserIds, setSelectedSubTareaUserIds] = useState([]);
    // Estado para el valor seleccionado
    const [editing, setEditing] = useState(false); // Estado para controlar el modo de edición
    const [selectedOption, setSelectedOption] = useState(null); // Estado para
    const [editingId, setEditingId] = useState(null);

    const [selectedOptionModulo, setSelectedOptionModulo] = useState(null);
    const [selectedOptionTarea, setSelectedOptionTarea] = useState(null);
    const [selectedOptionSubtarea, setSelectedOptionSubtarea] = useState(null);
    const [editingModuloId, setEditingModuloId] = useState(null);
    const [editingTareaId, setEditingTareaId] = useState(null);
    const [editingSubtareaId, setEditingSubtareaId] = useState(null);
    const [proyectosState, setProyectosState] = useState(proyectos);
    const [proyectosStateSubtarea, setProyectosStateSubtarea] = useState(proyectos);
    // Obtener el token del localStorage y configurar el estado
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [size, setSize] = useState('medium'); // default is 'middle'

    const [loading, setLoading] = useState(true);  // Estado para controlar la carga


    const [usuarioActivo, setUsuarioActivo] = useState(null); // default is 'middle'

    const isMounted = useRef(true);  // Usamos useRef para manejar el flag


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

//DESMONATANDO
    useEffect(() => {
        fetchProyectos(token);

        return () => {
            // Limpiar el flag cuando el componente se desmonte
            isMounted.current = false;
        };
    }, [token]); // Dependencias del useEffect, se vuelve a ejecutar cuando cambia el token


    // Este useEffect se ejecutará cuando 'usuarioActivo' cambie
    useEffect(() => {

    }, [usuarioActivo]);
    useEffect(() => {
       // setProyectosState(proyectos);
        // Se ejecutará cuando 'proyectos' cambie
        if (proyectos && proyectos.length > 0) {
            setProyectosState(proyectos);
        }
    }, [proyectos]);



    // Función para truncar el texto
    const truncateText = (text) => {
        return _.truncate(text, {
            length: 50, // Longitud máxima (incluye los puntos suspensivos)
            separator: ' '
        });
    };


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







    //EDITAR FECHA INICIO PROYECTO
    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPI = async (id, fechaInicio) => {
        try {
            const response = await axios.patch(
                `http://localhost:8080/api/proyectos/actualizarFechaInicio/${id}`,
                { fechaInicio: fechaInicio },  // Enviamos la nueva fecha en formato YYYY-MM-DD
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Incluye el token en el encabezado de autorización
                    },
                    withCredentials: true  // Incluye las credenciales si es necesario
                }
            );

            await fetchProyectos(token);
            console.log('Fecha actualizada sa', response.data);
        }
        catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActual, setFechaInicioActual] = useState({});
    const [isDatePickerVisible, setIsDatePickerVisible] = useState({});

    const handleSpanClick = (fechaInicio, id) => {
        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActual(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisible(prev => ({
            ...prev,
            [id]: true,
        }));
    };

    const handleDateChange = (date, dateString, id) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActual(prev => ({
            ...prev,
            [id]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPI(id, dateString);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisible(prev => ({
            ...prev,
            [id]: false,
        }));
    };


    //EDITA FECHA INICIO MODULO

    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPIModulo = async (moduloId, fechaInicio,proyectoId) => {
        try {
            console.log("token a modulo"+token)
            ///api/proyectos/{proyectoId}/modulos/actualizarFechaInicio/{moduloId}
            const response = await axios.patch(`http://localhost:8080/api/proyectosmodulo/${proyectoId}/modulos/actualizarFechaInicio/${moduloId}`, {
                fechaInicio: fechaInicio, // Enviamos la nueva fecha en formato YYYY-MM-DD

            }
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                });
            await fetchProyectos(token);
            console.log('Fecha actualizada correctamente', response.data);
        } catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActualModulo, setFechaInicioActualModulo] = useState({});
    const [isDatePickerVisibleModulo, setIsDatePickerVisibleModulo] = useState({});

    const handleSpanClickModulo = (fechaInicio, id) => {

        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActualModulo(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisibleModulo(prev => ({
            ...prev,
            [id]: true,
        }));
    };

    const handleDateChangeModulo = (date, dateString, id,rowId) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActualModulo(prev => ({
            ...prev,
            [id]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPIModulo(id, dateString,rowId);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisibleModulo(prev => ({
            ...prev,
            [id]: false,
        }));
    };

    //EDITA FECHA FIN MODULO
    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPIModuloFin = async (moduloId, fechaFin,proyectoId) => {
        try {
            ///api/proyectos/{proyectoId}/modulos/actualizarFechaInicio/{moduloId}
            const response = await axios.patch(`http://localhost:8080/api/proyectosmodulo/${proyectoId}/modulos/actualizarFechaFin/${moduloId}`, {
                fechaFin: fechaFin, // Enviamos la nueva fecha en formato YYYY-MM-DD

            }
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                });
            await fetchProyectos(token);
            console.log('Fecha fin actualizada correctamente', response.data);
        } catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActualModuloFin, setFechaInicioActualModuloFin] = useState({});
    const [isDatePickerVisibleModuloFin, setIsDatePickerVisibleModuloFin] = useState({});

    const handleSpanClickModuloFin = (fechaInicio, id) => {

        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActualModuloFin(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisibleModuloFin(prev => ({
            ...prev,
            [id]: true,
        }));
    };

    const handleDateChangeModuloFin = (date, dateString, id,rowId) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActualModuloFin(prev => ({
            ...prev,
            [id]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPIModuloFin(id, dateString,rowId);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisibleModuloFin(prev => ({
            ...prev,
            [id]: false,
        }));
    };

    //EDITA FECHA INICIO TAREA
    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPITareaFechaInicio = async (tareaId, fechaInicio,moduloId) => {
        try {
            ////api/modulos/{moduloId}/tareas/actualizarFechaFin/{tareaId}
            const response = await axios.patch(`http://localhost:8080/api/modulos/${moduloId}/tareas/actualizarFechaInicio/${tareaId}`, {
                fechaInicio: fechaInicio, // Enviamos la nueva fecha en formato YYYY-MM-DD

            }
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                });
            await fetchProyectos(token);
            console.log('Fecha actualizada correctamente', response.data);
        } catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActualTareaFechaInicio, setFechaInicioActualTareaFechaInicio] = useState({});
    const [isDatePickerVisibleTareaFechaInicio, setIsDatePickerVisibleTareaFechaInicio] = useState({});

    const handleSpanClickTareaFechaInicio = (fechaInicio, id) => {

        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActualTareaFechaInicio(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisibleTareaFechaInicio(prev => ({
            ...prev,
            [id]: true,
        }));
    };

    const handleDateChangeTareaFechaInicio = (date, dateString, idTarea,moduloId) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActualTareaFechaInicio(prev => ({
            ...prev,
            [idTarea]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPITareaFechaInicio(idTarea, dateString,moduloId);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisibleTareaFechaInicio(prev => ({
            ...prev,
            [idTarea]: false,
        }));
    };

    //EDITA FECHA FIN TAREA
    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPITareaFechaFin = async (tareaId, fechaFin,moduloId) => {
        try {
            ////api/modulos/{moduloId}/tareas/actualizarFechaFin/{tareaId}
            const response = await axios.patch(`http://localhost:8080/api/modulos/${moduloId}/tareas/actualizarFechaFin/${tareaId}`, {
                fechaFin: fechaFin, // Enviamos la nueva fecha en formato YYYY-MM-DD

            }
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                });
            await fetchProyectos(token);
            console.log('Fecha actualizada correctamente', response.data);
        } catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActualTareaFechaFin, setFechaInicioActualTareaFechaFin] = useState({});
    const [isDatePickerVisibleTareaFechaFin, setIsDatePickerVisibleTareaFechaFin] = useState({});

    const handleSpanClickTareaFechaFin = (fechaInicio, id) => {

        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActualTareaFechaFin(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisibleTareaFechaFin(prev => ({
            ...prev,
            [id]: true,
        }));
    };

    const handleDateChangeTareaFechaFin = (date, dateString, idTarea,moduloId) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActualTareaFechaFin(prev => ({
            ...prev,
            [idTarea]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPITareaFechaFin(idTarea, dateString,moduloId);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisibleTareaFechaFin(prev => ({
            ...prev,
            [idTarea]: false,
        }));
    };


    //EDITA FECHA FIN SUBTAREA
    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPIsubtareaFechaFin = async (subtareaId, fechaFin,tareaId) => {
        try {
            ////api/tareas/{tareaId}/subTareas/actualizarFechaFin/{subtareaId}
            const response = await axios.patch(`http://localhost:8080/api/tareas/${tareaId}/subTareas/actualizarFechaFin/${subtareaId}`, {

                fechaFin: fechaFin, // Enviamos la nueva fecha en formato YYYY-MM-DD

            },
            {

                headers: {
                    'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                }
            }
            );
            await fetchProyectos(token);
            console.log('Fecha actualizada correctamente', response.data);
        } catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActualsubtareaFechaFin, setFechaInicioActualsubtareaFechaFin] = useState({});
    const [isDatePickerVisiblesubtareaFechaFin, setIsDatePickerVisiblesubtareaFechaFin] = useState({});

    const handleSpanClicksubtareaFechaFin = (fechaInicio, id) => {

        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActualsubtareaFechaFin(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisiblesubtareaFechaFin(prev => ({
            ...prev,
            [id]: true,
        }));

    };

    const handleDateChangesubtareaFechaFin = (date, dateString, idTarea,moduloId) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActualsubtareaFechaFin(prev => ({
            ...prev,
            [idTarea]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPIsubtareaFechaFin(idTarea, dateString,moduloId);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisiblesubtareaFechaFin(prev => ({
            ...prev,
            [idTarea]: false,
        }));
    };


    //EDITA FECHA INICIO SUBTAREA
    // Función para actualizar la fecha en la API
    const actualizarFechaInicioAPIsubtareaFechaInicio = async (subtareaId, fechaFin,tareaId) => {
        try {
            ////api/tareas/{tareaId}/subTareas/actualizarFechaFin/{subtareaId}
            const response = await axios.patch(
                `http://localhost:8080/api/tareas/${tareaId}/subTareas/actualizarFechaInicio/${subtareaId}`,
                {
                fechaInicio: fechaFin, // Enviamos la nueva fecha en formato YYYY-MM-DD

            },{
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
            }

            );
            await fetchProyectos(token);
            console.log('Fecha actualizada correctamente', response.data);
        } catch (error) {
            console.error('Error al actualizar la fecha', error);
        }
    };
    // Estados necesarios para manejar la fecha y la visibilidad
    const [fechaInicioActualsubtareaFechaInicio, setFechaInicioActualsubtareaFechaInicio] = useState({});
    const [isDatePickerVisiblesubtareaFechaInicio, setIsDatePickerVisiblesubtareaFechaInicio] = useState({});

    const handleSpanClicksubtareaFechaInicio = (fechaInicio, id) => {

        // Establece la fecha seleccionada al hacer clic en el span
        setFechaInicioActualsubtareaFechaInicio(prev => ({
            ...prev,
            [id]: fechaInicio, // Guarda la fecha cuando se hace clic en el span
        }));
        // Muestra el DatePicker correspondiente a esta fila
        setIsDatePickerVisiblesubtareaFechaInicio(prev => ({
            ...prev,
            [id]: true,
        }));
    };

    const handleDateChangesubtareaFechaInicio = (date, dateString, idTarea,moduloId) => {
        // Actualiza la fecha seleccionada en el estado
        setFechaInicioActualsubtareaFechaInicio(prev => ({
            ...prev,
            [idTarea]: dateString,
        }));
        // Llama a la API para actualizar la fecha
        actualizarFechaInicioAPIsubtareaFechaInicio(idTarea, dateString,moduloId);
        // Cierra el DatePicker después de seleccionar una fecha
        setIsDatePickerVisiblesubtareaFechaInicio(prev => ({
            ...prev,
            [idTarea]: false,
        }));
    };



//AMPLIAR FECHA

    const [dias, setDias] = useState(1); // Estado para almacenar el valor de "dias"

    const handleChangeDias = (value) => {
        // Aseguramos que el valor sea siempre positivo
        if (value > 0) {
            setDias(value); // Actualiza el estado solo si el valor es positivo
        }
    };

    const ampliarFechaProyecto = async (proyectoId,fechaFin, dias) => {
        // Muestra la alerta de confirmación antes de eliminar
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `La fecha fin "${fechaFin}" será ampliada a  "${dias}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ampliar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario confirma, se procede a enviar la solicitud de ampliación
        if (result.isConfirmed) {
            try {
                const response = await axios.patch(
                    `http://localhost:8080/api/proyectos/${proyectoId}/ampliar/dias=${dias}`,
                    null
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );

                if (response.status === 200) {
                    Swal.fire('Ampliado', 'La fecha del proyecto ha sido ampliada correctamente.', 'success');
                    await fetchProyectos(token);
                } else {
                    Swal.fire('Error', 'Hubo un problema al ampliar la fecha del proyecto.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', `Hubo un error al intentar ampliar la fecha: ${error.message}`, 'error');
            }
        }

    };



// ELIMINAR MODULO
    const handleDeleteModulo = async (proyectoId, nombreModulo,moduloId) => {
        // Muestra la alerta de confirmación antes de eliminar
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `La tarea "${nombreModulo}" será eliminada. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario confirma, se procede a eliminar
        if (result.isConfirmed) {
            try {
                console.log(token)
                const response = await axios.delete(`/api/proyectosmodulo/${proyectoId}/modulos/delete/${moduloId}`
                    ,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );


                if (response.status === 200) {
                    Swal.fire(
                        '¡Eliminado!',
                        'La tarea ha sido eliminada exitosamente.',
                        'success'
                    );
                    // Aquí puedes actualizar el estado para eliminar la tarea de la lista en el frontend
                    await fetchProyectos(token);
                    // Llama a handleCancel si deseas realizar alguna acción adicional
                    handleCancel();
                }
            } catch (error) {
                console.error("Error eliminando la tarea:", error);
                Swal.fire(
                    'Error',
                    'No se pudo eliminar la tarea. Inténtalo de nuevo.',
                    'error'
                );
            }
        }
    };

// ELIMINAR TAREA
    const handleDeleteTarea = async (idTarea, nombreTarea,moduloId) => {
        // Muestra la alerta de confirmación antes de eliminar
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `La tarea "${nombreTarea}" será eliminada. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario confirma, se procede a eliminar
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/modulos/${moduloId}/tareas/delete/${idTarea}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                });


                if (response.status === 200) {
                    Swal.fire(
                        '¡Eliminado!',
                        'La tarea ha sido eliminada exitosamente.',
                        'success'
                    );

                    // Aquí puedes actualizar el estado para eliminar la tarea de la lista en el frontend
                    await fetchProyectos(token);

                    handleCancel();
                }
            } catch (error) {
                console.error("Error eliminando la tarea:", error);
                Swal.fire(
                    'Error',
                    'No se pudo eliminar la tarea. Inténtalo de nuevo.',
                    'error'
                );
            }
        }
    };
// ELIMINAR SUBTAREA
    const handleDeletesubtarea = async (subtareaId, nombreTarea,tareaId) => {
        // Muestra la alerta de confirmación antes de eliminar
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `La tarea "${nombreTarea}" será eliminada. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario confirma, se procede a eliminar
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/tareas/${tareaId}/subTareas/delete/${subtareaId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }


                    );
                ///api/tareas/{tareaId}/subTareas/delete/{idTarea}
                if (response.status === 200) {
                    Swal.fire(
                        '¡Eliminado!',
                        'La subtarea ha sido eliminada exitosamente.',
                        'success'
                    );
                    // Aquí puedes actualizar el estado para eliminar la tarea de la lista en el frontend
                    
                    await fetchProyectos(token);
                    
                    handleCancel();
                }
            } catch (error) {
                console.error("Error eliminando la tarea:", error);
                Swal.fire(
                    'Error',
                    'No se pudo eliminar la tarea. Inténtalo de nuevo.',
                    'error'
                );
            }
        }
    };



    //ACTUALIZAR NOMBRE PROYECTO

   // const [editProjectId, setEditProjectId] = useState(null); // Guarda el proyecto que está siendo editado
   // const [projectName, setProjectName] = useState(''); // Nombre temporal durante la edición
    const [popoverVisible, setPopoverVisible] = useState(false); // Estado para controlar la visibilidad del Popover

    // Inicia la edición y oculta el Popover
    const startEditing = (row) => {
        setEditProjectId(row.id);
        setProjectName(row.nombre);
        setPopoverVisible(false); // Oculta el Popover cuando empieza la edición
    };

    // Maneja la visibilidad del Popover solo si no estamos editando
    const handleVisibleChangeP = (visible, rowId) => {
        if (rowId !== editProjectId) { // Si no estamos editando este proyecto, mostrar el Popover
            setPopoverVisible(visible);
        }
    };


    const saveProjectName = (rowId, projectName) => {

        console.log("llego hasta ahi"+token)
        // URL de la API para actualizar el proyecto
        const apiUrl = `http://localhost:8080/api/proyectos/actualizar/${rowId}`;

        // Datos a enviar en el cuerpo de la solicitud (PATCH)
        const data = {
            nombre: projectName
        };

        // Configuración de la solicitud, incluyendo el encabezado de autorización

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        // Realizar solicitud PATCH con Axios
        axios.patch(apiUrl, data,config)
            .then((response) => {
                // Si la solicitud es exitosa, muestra en la consola
                fetchProyectos(token);

                // Opcional: Realizar otras acciones después de la actualización, como limpiar los campos
                setEditProjectId(null);  // Termina la edición
                setPopoverVisible(true);  // Reabre el Popover si es necesario

            })
            .catch((error) => {
                // Si la solicitud falla, muestra en la consola
                console.error(`Error al actualizar el proyecto con ID: ${rowId}. Error:`, error.response?.data || error.message);
            });
    };

    const handleEditarTask = (proyectoId,nombreProyecto) => {
        startEditing({ id: proyectoId, nombre: nombreProyecto });
    };

//OPCIONESW DE TRES PUNTOS PROYECTO
    const getContent = (proyectoId, nombreProyecto) => (
        <>
            <div onClick={() => handleEditarTask(proyectoId,nombreProyecto)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <EditOutlined style={{marginRight: 8}}/>
                    <span>Editar nombre</span>
                </Row>
            </div>

            <div onClick={() => archivarProyecto(proyectoId, nombreProyecto)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <InboxOutlined style={{marginRight: 8}}/> {/* Ícono de copiar */}
                    <span>Archivar proyecto</span>

                </Row>
            </div>



            {/* Separador vertical */}
            <Divider type="horizontal" style={{ backgroundColor: '#d9d9d9', padding:0, marginTop:6,marginBottom:6 }} />



            <div onClick={()=>eliminarProyectos(proyectoId, nombreProyecto)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: "red"}}>
                    <DeleteOutlined style={{marginRight: 8}}/> {/* Ícono de eliminar */}
                    <span>Mover papelera proyecto</span>
                </Row>
            </div>
        </>
    );






    //OPCIONESW DE TRES PUNTOS MODULO
    const getContentModulo = (proyectoId, nombreModulo,moduloId) => (

        <>

            <div onClick={() => handleEditarTaskModulo(moduloId,nombreModulo)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <EditOutlined style={{marginRight: 8}}/>
                    <span>Editar nombre</span>
                </Row>
            </div>



            {/* Separador vertical */}
            <Divider type="horizontal" style={{ backgroundColor: '#d9d9d9', padding:0, marginTop:6,marginBottom:6 }} />



            <div onClick={() => handleDeleteModulo(proyectoId,nombreModulo,moduloId)}  style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: "red"}}>
                    <DeleteOutlined style={{marginRight: 8}}/> {/* Ícono de eliminar */}
                    <span>Eliminar modulo</span>
                </Row>
            </div>
        </>
    );

    //ACTUALIZAR NOMBRE MODULO

    const [editModuloId, setEditModuloId] = useState(null); // Guarda el proyecto que está siendo editado
    const [moduloName, seModuloName] = useState(''); // Nombre temporal durante la edición
    const [popoverVisibleModulo, setPopoverVisibleModulo] = useState(false); // Estado para controlar la visibilidad del Popover

    // Inicia la edición y oculta el Popover
    const startEditingModulo = (modulo) => {
        setEditModuloId(modulo.id);
        seModuloName(modulo.nombre);
        setPopoverVisibleModulo(false); // Oculta el Popover cuando empieza la edición
    };

    // Maneja la visibilidad del Popover solo si no estamos editando
    const handleVisibleChangeM = (visible, rowId) => {
        if (rowId !== editModuloId) { // Si no estamos editando este proyecto, mostrar el Popover
            setPopoverVisibleModulo(visible);
        }
    };

    //ADITAR NOMBRE MODULO

    const saveProjectNameModulo = (rowId,moduloId, projectName) => {


        // URL de la API para actualizar el proyecto
        const apiUrl = `http://localhost:8080/api/proyectosmodulo/${rowId}/modulos/actualizar/${moduloId}`;

        // Datos a enviar en el cuerpo de la solicitud (PATCH)
        const data = {
            nombre: projectName
        };

        // Realizar solicitud PATCH con Axios
        axios.patch(apiUrl, data, {
            headers: {
                'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
            }
        })
            .then((response) => {
                // Si la solicitud es exitosa, muestra en la consola
                fetchProyectos(token);

                // Opcional: Realizar otras acciones después de la actualización, como limpiar los campos
                setEditModuloId(null);  // Termina la edición
                setPopoverVisibleModulo(true);  // Reabre el Popover si es necesario

            })
            .catch((error) => {
                // Si la solicitud falla, muestra en la consola
                console.error(`Error al actualizar el proyecto con ID: ${rowId}. Error:`, error.response?.data || error.message);
            });
    };


    const handleEditarTaskModulo = (moduloId,nombreModulo) => {
        startEditingModulo({ id: moduloId, nombre: nombreModulo });
    };


    //CAMBIAR NOMBRE TAREA

    const [editTareaId, setEditTareaId] = useState(null); // Guarda el proyecto que está siendo editado
    const [tareaName, setTareaName] = useState(''); // Nombre temporal durante la edición
    const [popoverVisibleTarea, setPopoverVisibleTarea] = useState(false); // Estado para controlar la visibilidad del Popover

    // Inicia la edición y oculta el Popover
    const startEditingTarea = (tarea) => {
        setEditTareaId(tarea.id);
        setTareaName(tarea.nombre);
        setPopoverVisibleTarea(false); // Oculta el Popover cuando empieza la edición
    };

    // Maneja la visibilidad del Popover solo si no estamos editando
    const handleVisibleChangeT = (visible, rowId) => {
        if (rowId !== editTareaId) { // Si no estamos editando este proyecto, mostrar el Popover
            setPopoverVisibleTarea(visible);
        }
    };


    const saveProjectNameTarea = (moduloId,tareaId, tareaName) => {

console.log("ide modulo:"+moduloId);
        console.log("ide tarea:"+moduloId);
        console.log("lo que viene :"+tareaName);

        // URL de la API para actualizar el proyecto
        const apiUrl = `http://localhost:8080/api/modulos/${moduloId}/tareas/actualizar/${tareaId}`;
//http://localhost:8080/api/modulos/1/tareas/actualizar/34
        // Datos a enviar en el cuerpo de la solicitud (PATCH)
        const data = {
            nombre: tareaName
        };

        // Realizar solicitud PATCH con Axios
        axios.patch(apiUrl, data, {
            headers: {
                'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
            }
        })
            .then((response) => {
                // Si la solicitud es exitosa, muestra en la consola
                fetchProyectos(token);

                // Opcional: Realizar otras acciones después de la actualización, como limpiar los campos
                setEditTareaId(null);  // Termina la edición
                setPopoverVisibleTarea(true);  // Reabre el Popover si es necesario

            })
            .catch((error) => {
                // Si la solicitud falla, muestra en la consola
                console.error(`Error al actualizar el tarea con ID: ${moduloId}. Error:`, error.response?.data || error.message);
            });
    };


    const handleEditarTaskTarea = (tareaId,nombreTarea) => {
        startEditingTarea({ id: tareaId, nombre: nombreTarea });
    };



    //OPCIONESW DE TRES PUNTOS TAREA
    const getContentTarea = (tareaId, nombreTarea,moduloId) => (

        <>

            <div onClick={() => handleEditarTaskTarea(tareaId,nombreTarea)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <EditOutlined style={{marginRight: 8}}/>
                    <span>Editar nombre</span>
                </Row>
            </div>



            {/* Separador vertical */}
            <Divider type="horizontal" style={{ backgroundColor: '#d9d9d9', padding:0, marginTop:6,marginBottom:6 }} />



            <div onClick={() => handleDeleteTarea(tareaId,nombreTarea,moduloId)}  style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: "red"}}>
                    <DeleteOutlined style={{marginRight: 8}}/> {/* Ícono de eliminar */}
                    <span>Eliminar tarea</span>
                </Row>
            </div>
        </>
    );

    //CAMBIAR NOMBRE SUBTAREA

    const [editsubTareaId, setEditsubTareaId] = useState(null); // Guarda el proyecto que está siendo editado
    const [subtareaName, setsubTareaName] = useState(''); // Nombre temporal durante la edición
    const [popoverVisiblesubTarea, setPopoverVisiblesubTarea] = useState(false); // Estado para controlar la visibilidad del Popover

    // Inicia la edición y oculta el Popover
    const startEditingsubTarea = (subtarea) => {
        setEditsubTareaId(subtarea.id);
        setsubTareaName(subtarea.nombre);
        setPopoverVisiblesubTarea(false); // Oculta el Popover cuando empieza la edición
    };

    // Maneja la visibilidad del Popover solo si no estamos editando
    const handleVisibleChangeST = (visible, rowId) => {
        if (rowId !== editsubTareaId) { // Si no estamos editando este proyecto, mostrar el Popover
            setPopoverVisiblesubTarea(visible);
        }
    };


    const saveProjectNamesubTarea = (tareaId,subtareaId, subtareaName) => {

        console.log("ide tarea:"+tareaId);
        console.log("ide subatrea:"+subtareaId);
        console.log("lo que viene :"+subtareaName);

        // URL de la API para actualizar el proyecto
        const apiUrl = `http://localhost:8080/api/tareas/${tareaId}/subTareas/actualizar/${subtareaId}`;

//http://localhost:8080/api/tareas/8/subTareas/actualizar/10
        // Datos a enviar en el cuerpo de la solicitud (PATCH)
        const data = {
            nombre: subtareaName
        };

        // Configuración de la solicitud, incluyendo el encabezado de autorización
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
            }
        };

        // Realizar solicitud PATCH con Axios
        axios.patch(apiUrl, data,config)
            .then((response) => {
                // Si la solicitud es exitosa, muestra en la consola
                fetchProyectos(token);

                // Opcional: Realizar otras acciones después de la actualización, como limpiar los campos
                setEditsubTareaId(null);  // Termina la edición
                setPopoverVisiblesubTarea(true);  // Reabre el Popover si es necesario

            })
            .catch((error) => {
                // Si la solicitud falla, muestra en la consola
                console.error(`Error al actualizar el tarea con ID: . Error:`, error.response?.data || error.message);
            });
    };


    const handleEditarTasksubTarea = (subtareaId,nombresubTarea) => {
        startEditingsubTarea({ id: subtareaId, nombre: nombresubTarea });
    };



    //OPCIONESW DE TRES PUNTOS MODULO
    const getContentsubTarea = (subtareaId, nombresubTarea, tareaId) => (

        <>

            <div onClick={() => handleEditarTasksubTarea(subtareaId,nombresubTarea)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <EditOutlined style={{marginRight: 8}}/>
                    <span>Editar nombre</span>
                </Row>
            </div>



            {/* Separador vertical */}
            <Divider type="horizontal" style={{ backgroundColor: '#d9d9d9', padding:0, marginTop:6,marginBottom:6 }} />



            <div onClick={() => handleDeletesubtarea(subtareaId,nombresubTarea,tareaId)}  style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: "red"}}>
                    <DeleteOutlined style={{marginRight: 8}}/> {/* Ícono de eliminar */}
                    <span>Eliminar subtarea</span>
                </Row>
            </div>
        </>
    );



    //FOCUS DE POPER
    const [focusedProjectId, setFocusedProjectId] = useState(null); // Mantiene el ID del proyecto que tiene el Popover visible

    const handleVisibleChange = (visible, rowId) => {
        setFocusedProjectId(visible ? rowId : null);
    };

    //ACTIVIDADES DE FECHA POR SUBATAREA
    const sortedTimelineItemsSubtarea = [
        {
            color: 'green',
            user: selectedsubTarea?.userCreate || 'Usuario no disponible',
            action: 'creó',
            date: selectedsubTarea?.createAt,
            formattedDate: selectedsubTarea?.createAt ? dayjs(selectedsubTarea.createAt).format('YYYY-MM-DD HH:mm:ss') : null
        },
        {
            color: '#00CCFF',
            user: selectedsubTarea?.userModify || 'Usuario no disponible',
            action: 'modificó',
            date: selectedsubTarea?.modifyAt,
            formattedDate: selectedsubTarea?.modifyAt ? dayjs(selectedsubTarea.modifyAt).format('YYYY-MM-DD HH:mm:ss') : null
        },

    ]
        .filter(item => item.date) // Filtrar los elementos sin fecha (date null)
        .sort((a, b) => new Date(a.date) - new Date(b.date));


    //ACTIVIDADES DE FECHA POR TAREA
    const sortedTimelineItemsTarea = [
        {
            color: 'green',
            user: selectedTarea?.userCreate || 'Usuario no disponible',
            action: 'creó',
            date: selectedTarea?.createAt,
            formattedDate: selectedTarea?.createAt ? dayjs(selectedTarea.createAt).format('YYYY-MM-DD HH:mm:ss') : null
        },
        {
            color: '#00CCFF',
            user: selectedTarea?.userModify || 'Usuario no disponible',
            action: 'modificó',
            date: selectedTarea?.modifyAt,
            formattedDate: selectedTarea?.modifyAt ? dayjs(selectedTarea.modifyAt).format('YYYY-MM-DD HH:mm:ss') : null
        },

    ]
        .filter(item => item.date) // Filtrar los elementos sin fecha (date null)
        .sort((a, b) => new Date(a.date) - new Date(b.date));


//ACTIVIDADES DE FECHA POR MODULO
    const sortedTimelineItemsModulo = [
        {
            color: 'green',
            user: selectedModule?.userCreate || 'Usuario no disponible',
            action: 'creó',
            date: selectedModule?.createAt,
            formattedDate: selectedModule?.createAt ? dayjs(selectedModule.createAt).format('YYYY-MM-DD HH:mm:ss') : null
        },
        {
            color: '#00CCFF',
            user: selectedModule?.userModify || 'Usuario no disponible',
            action: 'modificó',
            date: selectedModule?.modifyAt,
            formattedDate: selectedModule?.modifyAt ? dayjs(selectedModule.modifyAt).format('YYYY-MM-DD HH:mm:ss') : null
        },

    ]
        .filter(item => item.date) // Filtrar los elementos sin fecha (date null)
        .sort((a, b) => new Date(a.date) - new Date(b.date));




    //ACTIVIDADES PROYETCO POR FECHA
    const sortedTimelineItems = [
        {
            color: 'green',
            user: selectedProject?.userCreate || 'Usuario no disponible',
            action: 'creó',
            date: selectedProject?.createAt,
            formattedDate: selectedProject?.createAt ? dayjs(selectedProject.createAt).format('YYYY-MM-DD HH:mm:ss') : null
        },
        {
            color: '#00CCFF',
            user: selectedProject?.userModify || 'Usuario no disponible',
            action: 'modificó',
            date: selectedProject?.modifyAt,
            formattedDate: selectedProject?.modifyAt ? dayjs(selectedProject.modifyAt).format('YYYY-MM-DD HH:mm:ss') : null
        },

        {
            color: 'rgb(0, 21, 41)',
            user: selectedProject?.archivarDelete || 'Usuario no disponible',
            action: 'archivó',
            date: selectedProject?.archivarAt,
            formattedDate: selectedProject?.archivarAt ? dayjs(selectedProject.archivarAt).format('YYYY-MM-DD HH:mm:ss') : null
        },
        {
            color: 'red',
            user: selectedProject?.userDelete || 'Usuario no disponible',
            action: 'eliminó',
            date: selectedProject?.deleteAt,
            formattedDate: selectedProject?.deleteAt ? dayjs(selectedProject.deleteAt).format('YYYY-MM-DD HH:mm:ss') : null
        }
    ]
        .filter(item => item.date) // Filtrar los elementos sin fecha (date null)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

//TAPS
    const onChange = (key) => {
        console.log(key);
    };
//  TAPS
    const itemsTap = [
        {
            key: '1',
            label: 'Módulo',
            children:  (
                <div>
                    <p style={{display: 'flex', alignItems: 'center', color:'#656f7d'}}>
                        <AppstoreOutlined style={{marginRight: '8px', fontSize: '16px'}}/>
                      <span style={{fontWeight:600, marginRight:5}}> Cantidad de módulos:</span> <span>{selectedProject?.modulos?.length}</span>
                    </p>
                </div>
            ),
        },

    ];

//MODULOS
    const itemsTapModulos = [
        {
            key: '1',
            label: 'Tarea',
            children:  (
                <div>
                    <p style={{display: 'flex', alignItems: 'center', color:'#656f7d'}}>
                        <AppstoreOutlined style={{marginRight: '8px', fontSize: '16px'}}/>
                        <span style={{fontWeight:600, marginRight:5}}> Cantidad de tareas:</span> <span>{selectedModule?.tareas?.length}</span>
                    </p>
                </div>
            ),
        },

    ];

    //  TAPS
    const itemsTapSubtarea = [
        {
            key: '1',
            label: 'Subatarea',
            children:  (
                <div>
                    <p style={{display: 'flex', alignItems: 'center', color:'#656f7d'}}>
                        <AppstoreOutlined style={{marginRight: '8px', fontSize: '16px'}}/>
                        <span style={{fontWeight:600, marginRight:5}}> Cantidad de Subtarea:</span> <span>{selectedTarea?.subtareas?.length}</span>
                    </p>
                </div>
            ),
        },

    ];


    const handleDoubleClick = (projectId) => {
        setEditingId(projectId);
    };

    const handleDoubleClickModulo = (projectId) => {

        setEditingModuloId(projectId);
    };

    const handleDoubleClickTarea = (tareaId) => {
        setEditingTareaId(tareaId);
    };

    const handleDoubleClickSubtarea = (subtareaId) => {

        setEditingSubtareaId(subtareaId);
    };


    //ACTUALIZR PRIORIDAD PROYECTO
    const handleChange = async (value, projectId) => {


        if (value === 'none') {
            setSelectedOption(null);

            try {
                // Llamar a la API para establecer la prioridad a null
                const response = await axios.put(
                    `http://localhost:8080/api/proyectos/${projectId}/prioridad`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            console.log("prioridad selecioando"+selected)
            setSelectedOption(selected);

            try {
                // Usar el ID del proyecto y el ID de la prioridad seleccionada
                const response = await axios.put(
                    `http://localhost:8080/api/proyectos/${projectId}/prioridad/${selected.value}`
                    ,null,
                     {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad:", error);
            }
        }

        setEditingId(null); // Cambiar aquí para finalizar la edición
    };


    //ACTUAZIAR PRIORIDA MODULO
    const handleChangeModulo = async (value, moduloId, proyectoId) => {
        if (value === 'none') {
            setSelectedOptionModulo(null);

            // Aquí llamas a la API para establecer la prioridad a null
            try {
                const response = await axios.put(`http://localhost:8080/api/proyectosmodulo/${proyectoId}/modulos/${moduloId}/prioridad`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                );
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);

            setSelectedOptionModulo(selected);

            try {
                const response = await axios.put(`http://localhost:8080/api/proyectosmodulo/${proyectoId}/modulos/${moduloId}/prioridad/${selected.value}`

                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                );
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad:", error);
            }
        }
        setEditingModuloId(null);
    };



    const handleChangeSubtarea = async (value, tareaId, subtareaId) => {
        if (value === 'none') {
            setSelectedOptionSubtarea(null);

            // Aquí llamas a la API para establecer la prioridad a null
            try {
                const response = await axios.put(`http://localhost:8080/api/tareas/${tareaId}/subTareas/${subtareaId}/prioridad`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                );
                //http://localhost:8080/api/tareas/1/subTareas/1/prioridad
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            setSelectedOptionSubtarea(selected);

            try {
                const response = await axios.put(`http://localhost:8080/api/tareas/${tareaId}/subTareas/${subtareaId}/prioridad/${selected.value}`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                );
                ////http://localhost:8080/api/tareas/1/subTareas/1/prioridad
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad:", error);
            }
        }
        setEditingSubtareaId(null);
    };

    const handleChangeTarea = async (value, moduloId, tareaId) => {
        if (value === 'none') {
            setSelectedOptionTarea(null);

            // Aquí llamas a la API para establecer la prioridad a null
            try {
                const response = await axios.put(`http://localhost:8080/api/modulos/${moduloId}/tareas/${tareaId}/prioridad`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                );
                //http://localhost:8080/api/modulos/1/tareas/1/prioridad
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            setSelectedOptionTarea(selected);

            try {
                const response = await axios.put(`http://localhost:8080/api/modulos/${moduloId}/tareas/${tareaId}/prioridad/${selected.value}`
                    ,null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }
                );
                //http://localhost:8080/api/modulos/1/tareas/1/prioridad/1
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos(token);
            } catch (error) {
                console.error("Error al actualizar la prioridad:", error);
            }
        }
        setEditingTareaId(null);
    };



    const handleBlur = () => {
        setEditing(false); // Desactivar el modo de edición al perder el foco
    };


    //AXIOS ARCHIVAR PROYECTO
    const eliminarProyectos = async (id, nombreProyecto) => {
        // Muestra una alerta de confirmación con el nombre del proyecto
        const result = await Swal.fire({
            title: `¿Está seguro de eliminar el proyecto "${nombreProyecto}"?`,
            text: 'Una vez eliminado, no podrá recuperarlo fácilmente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.patch(`http://localhost:8080/api/proyectos/${id}/eliminar`,
                    null
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }



                });

                // Captura y muestra el mensaje de éxito desde el backend
                if (response.data.mensaje) {
                    Swal.fire('Eliminado', response.data.mensaje, 'success');
                }

                // Actualiza el estado de tus proyectos si es necesario
                setProyectos((prevProyectos) => prevProyectos.filter(proyecto => proyecto.id !== id));

                // Llama a handleCancel si deseas realizar alguna acción adicional
                handleCancel();

            } catch (error) {
                console.error('Error al eliminar el proyecto:', error);

                // Muestra un mensaje de error
                Swal.fire('Error', 'Hubo un problema al eliminar el proyecto.', 'error');
            }
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
                    params: { nuevoEstado: 'ARCHIVADO' },
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }

                });

                // Captura y muestra el mensaje de éxito desde el backend
                if (response.data.mensaje) {
                    Swal.fire('Archivado', response.data.mensaje, 'success');
                }

                // Actualiza el estado de tus proyectos si es necesario
                setProyectos((prevProyectos) => prevProyectos.filter(proyecto => proyecto.id !== id));

                // Llama a handleCancel si deseas realizar alguna acción adicional
                handleCancel();

            } catch (error) {
                console.error('Error al archivar el proyecto:', error);

                // Muestra un mensaje de error
                Swal.fire('Error', 'Hubo un problema al archivar el proyecto.', 'error');
            }
        }
    };

    //OBTENE PROYECTOS

    const fetchProyectos = async (token) => {
       // let isMounted = true; // flag para evitar actualizaciones de estado si el componente se desmonta

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
              //  setProyectos(proyectosConColor);
                if (isMounted.current) {  // Verificar si el componente está montado antes de actualizar el estado
                    setProyectos(proyectosConColor);
                }
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }  finally {
            //setLoading(false);  // Una vez terminada la solicitud, cambiar loading a false
            if (isMounted.current) {
                setLoading(false);  // Cambiar loading a false solo si el componente está montado
            }
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


            if (Array.isArray(response.data)) {
                const usuarioValor = response.data.map(prioridad => ({
                    label: prioridad.nombre,
                    value: prioridad.id,
                    color: prioridad.backgroundPrioridad,
                    desc: prioridad.nombre,
                }));
                setPrioridad(usuarioValor);
            }

        } catch (error) {
            console.error("Error al obtener prioridades:", error);
            // Puedes mostrar un mensaje de error si es necesario
        }
    };



//USUARIO PROYECTO
    const handleUserChange = (newUserIds) => {
        const removedUserIds = selectedUserIds.filter(id => !newUserIds.includes(id));

        // Eliminar usuarios desasignados del proyecto
        removedUserIds.forEach(async (userId) => {
            try {
                await axios.delete(`http://localhost:8080/api/proyectos/${selectedProject.id}/usuarios/${userId}`
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                    });
               // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);
                await fetchProyectos(token);

            } catch (error) {
                message.error(`Error al eliminar el usuario ${userId} del proyecto`);
                console.error('Error:', error);
            }
        });

        setSelectedUserIds(newUserIds);
    };


//ACTUALIZAR USUARIO PROYECTO
    const handleUpdateUsers = async () => {
        try {
            console.log("token"+token)
            await axios.put(`http://localhost:8080/api/proyectos/${selectedProject.id}/usuarios`, selectedUserIds, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
            });

            await fetchProyectos(token);

            const updatedUsuarios = usuarios
                .filter(persona => selectedUserIds.includes(persona.value))
                .map(persona => ({ id: persona.value, nombres: persona.label }));

            setSelectedProject(prevProject => ({
                ...prevProject,
                usuarios: updatedUsuarios
            }));
        } catch (error) {

            console.error('Error:', error);
        }
    };




//eliminar USUARIO de MODULO
    const handleUserModuloChange = (newUserIds) => {
        const removedUserIds = selectedModuloUserIds.filter(id => !newUserIds.includes(id));

        removedUserIds.forEach(async (userId) => {
            try {
                await axios.delete(`http://localhost:8080/api/proyectosmodulo/${selectedProject.id}/modulos/${selectedModule.id}/usuarios/${userId}`
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                    });

                //http://localhost:8080/api/proyectos/1/modulos/2/usuarios/5
                // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);

                await fetchProyectos(token);

            } catch (error) {
             //   message.error(`Error al eliminar el usuario ${userId} del proyecto`);
                console.error('Error:', error);
            }
        });

        setSelectedModuloUserIds(newUserIds);
    };

//ACTUALIZAR USUARIO MODULO
    const handleUpdateModuloUsers = async () => {

        try {

            await axios.put(`http://localhost:8080/api/proyectosmodulo/${selectedProject.id}/modulos/${selectedModule.id}/usuarios`, selectedModuloUserIds
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                });

            await fetchProyectos(token);

            const updatedUsuarios = usuarios
                .filter(persona => selectedUserIds.includes(persona.value))
                .map(persona => ({ id: persona.value, nombres: persona.label }));

            setSelectedProject(prevProject => ({
                ...prevProject,
                usuarios: updatedUsuarios
            }));
        } catch (error) {
           // message.error('Error al actualizar los usuarios');
            console.error('Error:', error);
        }
    };



//Eliminar USUARIO TAREA
    const handleUserTareaChange = (newUserIds) => {
        const removedUserIds = selectedTareaUserIds.filter(id => !newUserIds.includes(id));

        removedUserIds.forEach(async (userId) => {
            try {
                await axios.delete(`http://localhost:8080/api/modulos/${selectedModule.id}/tareas/${selectedTarea.id}/usuarios/${userId}`
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                    });

                //http://localhost:8080/api/modulos/2/tareas/1/usuarios/4
                // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);

                await fetchProyectos(token);

            } catch (error) {
                //   message.error(`Error al eliminar el usuario ${userId} del proyecto`);
                console.error('Error:', error);
            }
        });
setSelectedTareaUserIds(newUserIds)

    };

//ACTUALIZAR USUARIO TAREA
    const handleUpdateTareaUsers = async () => {

        try {

                console.log("Usuarios seleccionados:", selectedTareaUserIds);
            await axios.put(`http://localhost:8080/api/modulos/${selectedModule.id}/tareas/${selectedTarea.id}/usuarios`, selectedTareaUserIds
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                });

            ////http://localhost:8080/api/modulos/2/tareas/1/usuarios

            // /api/proyectos/{proyectoId}/modulos/{id}/usuarios
            //message.success('Usuarios actualizados correctamente');
            // Actualizar el estado del proyecto para reflejar los usuarios asignados
            // Vuelve a obtener todos los proyectos para reflejar los cambios
            await fetchProyectos(token);

            const updatedUsuarios = usuarios
                .filter(persona => selectedUserIds.includes(persona.value))
                .map(persona => ({ id: persona.value, nombres: persona.label }));

            setSelectedProject(prevProject => ({
                ...prevProject,
                usuarios: updatedUsuarios
            }));
        } catch (error) {
            // message.error('Error al actualizar los usuarios');
            console.error('Error:', error);
        }
    };



//Eliminar USUARIO SUBTAREA
    const handleUserSubTareaChange = (newUserIds) => {
        const removedUserIds = selectedSubTareaUserIds.filter(id => !newUserIds.includes(id));

            removedUserIds.forEach(async (userId) => {
            console.log("select tarea: ")
            try {
                await axios.delete(`http://localhost:8080/api/tareas/${selectedTarea.id}/subTareas/${selectedsubTarea.id}/usuarios/${userId}`
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                    });

                //http://localhost:8080/api/tareas/4/subTareas/4/usuarios/4


                await fetchProyectos(token);

            } catch (error) {
                //   message.error(`Error al eliminar el usuario ${userId} del proyecto`);
                console.error('Error:', error);
            }
        });
        setSelectedSubTareaUserIds(newUserIds)

    };

//ACTUALIZAR USUARIO SUBTAREA
    const handleUpdateSubTareaUsers = async () => {

        try {

            console.log("Usuarios seleccionados:", selectedTareaUserIds);
            await axios.put(`http://localhost:8080/api/tareas/${selectedTarea.id}/subTareas/${selectedsubTarea.id}/usuarios`, selectedSubTareaUserIds
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true  // Esto asegura que las cookies y las credenciales se envíen si es necesario
                });

            //http://localhost:8080/api/tareas/4/subTareas/4/usuarios


            await fetchProyectos(token);

            const updatedUsuarios = usuarios
                .filter(persona => selectedUserIds.includes(persona.value))
                .map(persona => ({ id: persona.value, nombres: persona.label }));

            setSelectedProject(prevProject => ({
                ...prevProject,
                usuarios: updatedUsuarios
            }));
        } catch (error) {
            // message.error('Error al actualizar los usuarios');
            console.error('Error:', error);
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
        console.log(`Navegando a /modulos/${moduloId}/tareas`);
       // navigate(`/m
        // odulos/${proyectoId}/tareas`); // Elimina '/api' si es innecesario
navigate(`/proyectos/${proyectoId}/modulos/${moduloId}`)

    };


    const  handleButtonClickSub = (proyectoId,moduloId,tareaId) => {
        console.log(`Navegando a /modulos/${moduloId}/tareas`);
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
        if (typeModal === 'AñadirModulo'&& id) {
            const proyecto = proyectos.find(p => p.id === id);
            if (proyecto) {
                // Actualiza el estado con el proyecto seleccionado
                setSelectedProject(proyecto);
            }
            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }

// Lógica para ver módulo
        if (typeModal === 'verModulo' && id && moduloId) {
            // Encuentra el proyecto por su ID
            const proyecto = proyectos.find(p => p.id === id);

            // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
            if (proyecto) {
                // Actualiza el estado con el proyecto seleccionado
                setSelectedProject(proyecto);

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

            const proyecto = proyectos.find(p => p.id === id);

            // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
            if (proyecto) {
                // Actualiza el estado con el proyecto seleccionado
                setSelectedProject(proyecto);

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

            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }
        // Lógica para ver tarea

        if (typeModal === 'verTarea' && id&& moduloId && tareaId) {
            // Encuentra el proyecto por su ID
            const proyecto = proyectos.find(p => p.id === id);


            // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
            if (proyecto) {
                // Actualiza el estado con el proyecto seleccionado
                setSelectedProject(proyecto);

                // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
                if (proyecto) {
                    const modulo = proyecto.modulos.find(m => m.id === moduloId);

                    // Si se encuentra el módulo, actualiza el estado con ese módulo
                    if (modulo) {
                        setSelectedModule(modulo)
                        const tarea = modulo.tareas.find(t => t.id === tareaId);
                        if (tarea) {

                            setSelectedTarea(tarea);
                        } else {
                            console.error("tarea no encontrado");
                        }

                    } else {
                        console.error("Módulo no encontrado");
                    }
                } else {
                    console.error("Proyecto no encontrado");
                }
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
                        setSelectedTarea(tarea);
                        const subtarea = tarea.subtareas.find(st => st.id === subtareaId);

                        if(subtarea){
                            setSelectedsubTarea(subtarea);
                            console.log("Subtarea seleccionada:", subtarea);
                        }

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
            const proyecto = proyectos.find(p => p.id === id);

            console.log("proyecto seleccionada:", proyecto);
            if (proyecto) {
                const modulo = proyecto.modulos.find(m => m.id === moduloId);
                if (modulo) {
                    const tarea = modulo.tareas.find(t => t.id === tareaId);
                    if (tarea) {
                        setSelectedTarea(tarea);



                    } else {
                        console.error("Tarea no encontrada");
                    }
                } else {
                    console.error("Módulo no encontrado");
                }
            } else {
                console.error("Proyecto no encontrado");
            }
            form.resetFields();
        }
    };
    const handleOk = () => {
        console.log("entro aqui---------------")
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
                url = `${backendUrl}/api/proyectosmodulo/${selectedItemId}/modulos`;
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
            }

            else if (modalType === 'subtarea') {
                url = `${backendUrl}/api/tareas/${selectedTareaId}/subTareas`;
            }

            console.log("Datos que se envían:", values);

            try {
                await axios.post(url, values, {
                    headers: {
                        'Authorization': `Bearer ${token}`

                    }

                });
                fetchProyectos(token);
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
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    // ... PARA QUE AORESCA LOS ICONOS DE GUARDAR Y EDITAR
    const [hoveredRowBackground, setHoveredRowBackground] = useState(null); // Estado para la fila actualmente sobre la que se hace hover


    const handleMouseEnter = (rowId) => {
        setHoveredRowBackground(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeave = () => {
        setHoveredRowBackground(null); // Limpiar el estado cuando se sale de la fila
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

        const onDragEnd = async(result) => {
            const { source, destination, type } = result;
            if (!destination) return;
    
            // Reordenamiento de Proyectos
            if (type === 'PROJECT') {
                const reorderedProjects = Array.from(proyectosState);
                // Movemos el proyecto de la posición source a la posición destination
                const [movedProject] = reorderedProjects.splice(source.index, 1); // El proyecto movido
                reorderedProjects.splice(destination.index, 0, movedProject); // Lo insertamos en la nueva posición

                // Asignamos el valor de 'indexVisual' en orden descendente de 'idProyectoOrden'
                const proyectosConNuevoIndice = reorderedProjects
                    .sort((a, b) => b.idProyectoOrden - a.idProyectoOrden) // Ordenamos por 'idProyectoOrden' de forma descendente
                    .map((project, index) => ({
                        ...project,
                        indexVisual: proyectosState.length - 1 - index // Asignamos índices en orden descendente
                    }));

                setProyectosState(proyectosConNuevoIndice); // Actualizamos el estado con los nuevos índices visuales

            const idProyecto = proyectosState[source.index].id; // ID del proyecto que se mueve
                const idPosicionPoner = proyectosState.length  - destination.index;



            try {
                await axios.put(
                    'http://localhost:8080/api/proyectos/actualizar-posicion',
                    null, // PUT no necesita cuerpo en este caso
                    {
                        params: {
                            idProyecto, // Enviar como idProyecto
                            idPosicionPoner
                        },
                        headers: {
                            'Authorization': `Bearer ${token}` // Enviar el token aquí
                        }
                    }
                );

                await fetchProyectos(token);

            } catch (error) {
                console.error("Error al actualizar la posición:", error);
            }

        }
        // Reordenamiento de Módulos
        else if (type === 'MODULE') {
                const projectIndex = proyectosState.findIndex(
                    (project) => project.id.toString() === source.droppableId
                );

                // Obtén el ID del proyecto al que pertenece el módulo
                const idProyectoModulo = proyectosState[projectIndex].id; // Este es el ID del proyecto


                const projectModules = Array.from(proyectosState[projectIndex].modulos);
                const [movedModule] = projectModules.splice(source.index, 1);
                projectModules.splice(destination.index, 0, movedModule);


                const updatedProjects = Array.from(proyectosState);
                updatedProjects[projectIndex] = {
                    ...updatedProjects[projectIndex],
                    modulos: projectModules,
                };


            setProyectosState(updatedProjects);

                // Ahora tenemos el ID del proyecto
                const moduloId = movedModule.id;
                const idPosicionPoner = projectModules.length - destination.index;



                try {
                    await axios.put(
                        `http://localhost:8080/api/proyectosmodulo/${idProyectoModulo}/modulos/actualizar-posicion`,

                        null, // PUT no necesita cuerpo en este caso
                        {
                            params: {

                                idPosicionPoner,
                                moduloId, // Enviar ID del módulo
                            },
                            headers: {
                                'Authorization': `Bearer ${token}` // Enviar el token aquí
                            }
                        }
                    );

                    await fetchProyectos(token);

                } catch (error) {
                    console.error("Error al actualizar la posición:", error);
                }




        }
            else if (type === 'TASK') {
                // Encuentra el índice del módulo que contiene las tareas
                const moduleIndex = proyectosState.findIndex(
                    (project) => project.modulos.some(modulo => modulo.id.toString() === source.droppableId)
                );

                // Encuentra el módulo específico basado en el droppableId
                const modulo = proyectosState[moduleIndex].modulos.find(
                    (modulo) => modulo.id.toString() === source.droppableId
                );

                // Copia las tareas del módulo para manipularlas sin mutar el estado original
                const moduleTasks = Array.from(modulo.tareas);
                const [movedTask] = moduleTasks.splice(source.index, 1); // Extrae la tarea que se está moviendo
                moduleTasks.splice(destination.index, 0, movedTask); // Inserta la tarea en la nueva posición

                // Crea una copia del estado de los proyectos y actualiza las tareas del módulo
                const updatedModules = Array.from(proyectosState[moduleIndex].modulos);
                updatedModules.forEach(mod => {
                    if (mod.id === modulo.id) {
                        mod.tareas = moduleTasks;
                    }
                });

                const updatedProjects = Array.from(proyectosState);
                updatedProjects[moduleIndex] = {
                    ...updatedProjects[moduleIndex],
                    modulos: updatedModules,
                };

                // Actualiza el estado en el frontend
                setProyectosState(updatedProjects);

                // ID del módulo y tarea que se están moviendo
                const tareaId = movedTask.id;
                const idPosicionPoner = moduleTasks.length - destination.index;

                try {
                    // Realiza la llamada al backend para sincronizar los cambios
                    await axios.put(
                        `http://localhost:8080/api/modulos/${modulo.id}/tareas/actualizar-posicion`,
                        null, // No hay necesidad de cuerpo
                        {
                            params: {
                                idPosicionPoner,
                                tareaId, // ID de la tarea que se mueve
                            },
                            headers: {
                                'Authorization': `Bearer ${token}`, // Token para autorización
                            },
                        }
                    );

                    // Vuelve a cargar los datos para asegurarte de que estén sincronizados
                    await fetchProyectos(token);

                } catch (error) {
                    console.error("Error al actualizar la posición de la tarea:", error);
                }
            }

            else if (type === 'SUBTASK') {

                // Encuentra el índice de la tarea que contiene las subtareas
                const tareaIndexEncontrada = proyectosState.findIndex((project) =>
                        project.modulos && project.modulos.some(modulo =>
                            modulo.tareas && modulo.tareas.some(tarea => tarea.id.toString() === source.droppableId)
                        )
                );

                let tareaEncontrada = null; // Declaramos tareaEncontrada fuera del bloque condicional

                if (tareaIndexEncontrada !== -1) {
                    // Ahora que tenemos el índice del proyecto, encontramos el módulo y la tarea dentro de él
                    const project = proyectosState[tareaIndexEncontrada];

                    // Encuentra el módulo dentro de 'modulos' que contiene la tarea
                    const moduloIndex = project.modulos.findIndex(modulo =>
                        modulo.tareas.some(tarea => tarea.id.toString() === source.droppableId)
                    );

                    if (moduloIndex !== -1) {

                        // Encuentra la tarea dentro del módulo
                        tareaEncontrada = project.modulos[moduloIndex].tareas.find(tarea =>
                            tarea.id.toString() === source.droppableId
                        );

                        if (tareaEncontrada) {


                            // Verificamos que 'subtareas' esté definido y sea un array antes de manipularlo
                            const tareaTasks = Array.isArray(tareaEncontrada.subtareas) ? [...tareaEncontrada.subtareas] : [];
                            const [movedTask] = tareaTasks.splice(source.index, 1); // Extrae la subtarea que se está moviendo
                            tareaTasks.splice(destination.index, 0, movedTask); // Inserta la subtarea en la nueva posición

                            // Actualiza el estado del proyecto correctamente
                            const updatedProjects = proyectosState.map((project, index) => {
                                if (index === tareaIndexEncontrada) {
                                    const updatedModulos = project.modulos.map((modulo, moduloIndex) => {
                                        if (moduloIndex === moduloIndex) {
                                            // Actualiza las tareas dentro del módulo
                                            const updatedTareas = modulo.tareas.map(tarea => {
                                                if (tarea.id === tareaEncontrada.id) {
                                                    return {
                                                        ...tarea,
                                                        subtareas: tareaTasks, // Actualiza las subtareas de la tarea
                                                    };
                                                }
                                                return tarea;
                                            });

                                            return {
                                                ...modulo,
                                                tareas: updatedTareas, // Actualiza las tareas dentro del módulo
                                            };
                                        }
                                        return modulo;
                                    });

                                    return {
                                        ...project,
                                        modulos: updatedModulos, // Actualiza los módulos
                                    };
                                }
                                return project;
                            });

                            // Actualiza el estado en el frontend
                            setProyectosState(updatedProjects);

                            // ID de la subtarea que se está moviendo y nueva posición
                            const subtareaId = movedTask.id;
                            const idPosicionPoner = tareaTasks.length - destination.index;

                            try {
                                // Realiza la llamada al backend para sincronizar los cambios
                                await axios.put(
                                    `http://localhost:8080/api/tareas/${tareaEncontrada.id}/subTareas/actualizar-posicion`,
                                    null, // No hay necesidad de cuerpo
                                    {
                                        params: {
                                            subtareaId, // ID de la subtarea que se mueve
                                            idPosicionPoner, // Nueva posición de la subtarea
                                        },
                                        headers: {
                                            'Authorization': `Bearer ${token}`, // Token para autorización
                                        },
                                    }
                                );

                                // Vuelve a cargar los datos para asegurarte de que estén sincronizados
                                await fetchProyectos(token);

                            } catch (error) {
                                console.error("Error al actualizar la posición de la subtarea:", error);
                            }
                        }

                        console.log('Tarea encontrada:', tarea);
                        // Ahora puedes hacer lo que necesites con la tarea encontrada, por ejemplo actualizarla
                    } else {
                        console.log('Módulo no encontrado');
                    }
                } else {
                    console.log('Proyecto no encontrado');
                }


            }


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

    const [hoveredRow, setHoveredRow] = useState(null);
    const [editProjectId, setEditProjectId] = useState(null);
    const [projectName, setProjectName] = useState("");

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

    // Alternar expansión de proyecto
    const toggleExpandProject = (projectId) => {
        setExpandedProjects((prev) => prev.includes(projectId)
            ? prev.filter((id) => id !== projectId)
            : [...prev, projectId]);
    };

    // Alternar expansión de módulo
    const toggleExpandModule = (moduleId) => {
        setExpandedModules((prev) => prev.includes(moduleId)
            ? prev.filter((id) => id !== moduleId)
            : [...prev, moduleId]);
    };

    // Alternar expansión de tarea
    const toggleExpandTask = (taskId) => {
        setExpandedTasks((prev) => prev.includes(taskId)
            ? prev.filter((id) => id !== taskId)
            : [...prev, taskId]);
    };







    const items = [
        {
            key: '1',
            label: (
                <a onClick={() => setModalVisible(true)}
                   style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                    <Avatar
                        icon={<EditOutlined/>}
                        style={{marginLeft: '0', backgroundColor: 'transparent', color: '#2c2c30'}}
                    />
                    <span style={{marginLeft: 5, color: '#2c2c30', fontSize: 14}}>Editar</span> {/* Texto agregado */}
                </a>

            ),
        },
        {
            key: '2',
            label: (
                <a onClick={() => archivarProyecto(row.id, row.nombre)}
                   style={{cursor: 'pointer'}}> {/* Cambia 1 por el id correcto */}
                    <Avatar
                        icon={<SaveOutlined/>}
                        style={{backgroundColor: 'transparent', color: '#2c2c30'}}
                    />
                    <span style={{marginLeft: 5, color: '#2c2c30', fontSize: 14}}>Archivar</span>
                </a>
            ),
        }
    ];


    if (!proyectos) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin tip="Cargando..." size="large" /> {/* Cambiar el tamaño aquí */}
            </div>
        );// Muestra un mensaje de carga mientras se obtienen los datos
    }


    return (
        <>

            <div className="cu-task-list-header__row">

                <div className="cu-task-list-header__row-inner">
                    <div>
                        <apan style={{marginRight: 7,fontSize:23 ,color:'#656f7d',}}>Todos proyectos</apan>
                    </div>
                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (


                        <div style={{marginRight:10}}>
                        <Button
                            type="primary"

                            icon={<PlusOutlined/>}
                            onClick={() => showModal('Añadirproyecto')}
                            // onClick={() => showModal('proyecto')}

                        >
                            Crear Proyecto
                        </Button>


                    </div>

                    ):(
                        <div >

                        </div>
                    )

                    }


                </div>
            </div>

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
                        <Col span={12}
                        >
                            <div>Nombre de proyecto</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__assignee">Persona asignado</div>
                        </Col>
                        <Col span={2}>
                            <div className="task-item__due-date">Fecha Inicio</div>
                        </Col>
                        <Col span={2}>
                            <div className="task-item__due-date">Fecha Fin</div>
                        </Col>
                        <Col span={2}>
                            <div className="task-item__due-date">Ampliado</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__due-date">Prioridad</div>
                        </Col>
                    </Row>
                    {loading ? (
                        <Spin size="large"> {/* Aquí usamos el componente Spin */}
                            <div style={{ minHeight: 400 }} /> {/* Un contenedor para el spinner */}
                        </Spin>// Mensaje mientras se cargan los datos
                    ) : (
                        <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="proyectos" type="PROJECT">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                {proyectosState.map((project,index) => (
                                    <Draggable
                                        key={project.id}
                                        draggableId={project.id ? project.id.toString() : "default-id"}

                                        index={index}
                                       // index={project.idProyectoOrden}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style, // Mantén el estilo proporcionado
                                                    borderBottom: '1px solid rgba(217, 217, 217, 0.1)', // Agrega borde a la parte inferior
                                                    cursor: snapshot.isDragging ? 'grabbing' : 'pointer', // Cambia el cursor cuando esté siendo arrastrado
                                                    backgroundColor: snapshot.isDragging ? 'lightgray' : 'white', // Cambia el color de fondo cuando se está arrastrando
                                                    boxShadow: snapshot.isDragging ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none', // Agrega sombra si se está arrastrando
                                                }}
                                            >

                        <React.Fragment key={project.id}>
                            <Row
                                gutter={[16, 16]}
                                style={{

                                    borderBottom: '1px solid rgba(217, 217, 217, 0.3)',
                                    cursor: "pointer",
                                    minWidth: '600px',
                                    transition: 'background-color 0.3s ease',
                                    backgroundColor: hoveredRowBackground === project.id ? '#f7f2f2' : '',
                                    color: '#2a2e34',
                                    marginBottom:2,
                                    marginTop:2

                                }}
                                onMouseEnter={() => handleMouseEnter(project.id)}
                                onMouseLeave={handleMouseLeave}

                            >
                                <Col span={12}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <HolderOutlined />
                                        <Checkbox style={{marginLeft:5}}

                                        />

                                        <Button
                                            type="text"
                                            size="small"
                                            icon={expandedProjects.includes(project.id) ? <CaretDownOutlined /> : <CaretRightOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpandProject(project.id);
                                            }}
                                        />
                                        <FolderOutlined
                                            style={{
                                                backgroundColor: project.backgroundProyecto,
                                                color: 'black',
                                                padding: '5px',
                                                borderRadius: '50%',
                                                border: '2px solid black',
                                            }}
                                        />
                                        {editProjectId === project.id ? (
                                            // Cuando estamos editando, muestra el Input
                                            <Input
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                onBlur={() => saveProjectName(project.id,projectName)} // Guarda al hacer clic fuera
                                                onPressEnter={() => saveProjectName(project.id,projectName)} // Guarda al presionar Enter
                                                style={{
                                                    marginLeft: 5,
                                                    fontWeight: 500,
                                                    fontSize: 14,
                                                    width: '72%',
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <Tooltip title={project.nombre}>

                                                <a
                                                    style={{
                                                        marginLeft: 5,
                                                        fontWeight: 500,
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        fontSize: 14,
                                                        transition: 'color 0.3s',
                                                    }}
                                                    // Comienza la edición al hacer clic
                                                    onClick={() => showModal('verProyecto', project.id)}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#534dc9')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                                                >
                                                    {project.nombre}
                                                </a>
                                            </Tooltip>
                                        )}
                                        {expandedProjects.includes(project.id)  && (

                                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight:0 }}>


                                                {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (
                                                <Popover
                                                    content={getContent(project.id, project.nombre)}
                                                    trigger="click"
                                                    onVisibleChange={(visible) => handleVisibleChangeP(visible, project.id)}

                                                >
                                                    <Button
                                                        type="text"
                                                        style={{
                                                            padding: '2px 6px',
                                                            fontSize: '14px',
                                                            borderRadius: '4px',
                                                            backgroundColor: focusedProjectId === project.id ? '#e0e0e0' : 'transparent',
                                                        }}
                                                    >
                                                        <EllipsisOutlined />
                                                    </Button>
                                                </Popover>

                                                ):(
                                                    <div >

                                                    </div>
                                                )

                                                }

                                                {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                    <Button
                                                    style={{
                                                        color: '#656f7d',
                                                        backgroundColor: 'transparent', // Color de fondo predeterminado
                                                        transition: 'background-color 0.3s',
                                                        padding: '12px 14px',
                                                        // Suave transición
                                                    }}
                                                    icon={<PlusOutlined />}
                                                    size="small"
                                                    type="link"
                                                    onClick={() => showModal('AñadirModulo', project.id)}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dce0e8'; // Cambia el color de fondo al pasar el mouse
                                                        e.currentTarget.style.color = '#000000'; // Cambia el color del texto si es necesario
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent'; // Restaura el color de fondo al salir
                                                        e.currentTarget.style.color = '#656f7d'; // Restaura el color del texto
                                                    }}
                                                >

                                                </Button>

                                                ):(
                                                    <div >

                                                    </div>
                                                )

                                                }



                                            </div>
                                        )}
                                    </div>

                                </Col>
                                <Col span={3}>
                                    {/* Generar avatares de los usuarios del proyecto */}
                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: '22px', width: '30px', paddingTop:10 }}> {/* Reduce la altura aquí */}
                                        {project.usuarios.length > 0 ? (
                                            project.usuarios.map((usuario, index) => {
                                                // Utilizar el color de fondo asignado en backgroundUser
                                                const backgroundColor = usuario.backgroundUser || '#000000'; // Color predeterminado si backgroundUser es null o undefined

                                                return (
                                                    <Tooltip
                                                        key={usuario.id}
                                                        title={`${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}
                                                    >
                                                        <Avatar
                                                            size={27} // Ajusta el tamaño aquí
                                                            style={{
                                                                backgroundColor,
                                                                border: '1px solid white',
                                                                position: 'absolute',
                                                                left: `${index * 20}px`, // Ajusta el desplazamiento horizontal
                                                                zIndex: 10 - index, // Controla la superposición (el último estará encima)
                                                                lineHeight: '0px', // Ajusta la altura de la línea si es necesario
                                                                fontSize: '12px', // Ajusta el tamaño de la fuente si es necesario
                                                            }}
                                                        >
                                                            {usuario.nombres.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    </Tooltip>
                                                );
                                            })
                                        ) : (
                                            <Tooltip title="Agregar persona">
                                                <Avatar
                                                    size={27}
                                                    icon={<UserAddOutlined />} />
                                            </Tooltip>
                                        )}
                                    </div>
                                </Col>
                                <Col key={project.id} style={{ paddingTop: '8px', color: '#055706' }} span={2}>
                                    {isDatePickerVisible[project.id] ? (

                                        <>

                                            <DatePicker
                                                open={isDatePickerVisible[project.id]}
                                                // Pasamos row.fechaInicio a cellRender
                                                onChange={(date, dateString) => handleDateChange(date, dateString, project.id)}
                                                onOpenChange={(open) => !open && setIsDatePickerVisible(prev => ({ ...prev, [project.id]: false }))} // Cierra el DatePicker si se cierra
                                                style={{ width: '80px', padding:0 }} // Aumenta el ancho del input

                                                size="small"  // Reduce el tamaño del DatePicker
                                                format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                defaultValue={dayjs(project.fechaInicio, "YYYY-MM-DD")}
                                                allowClear={false}  // Desactiva el ícono de la "x"
                                                suffixIcon={null} // Oculta el icono de calendario

                                            />




                                        </>
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                paddingLeft: 0,
                                                margin: 0,
                                                fontWeight: '400',
                                                cursor: 'pointer',
                                            }}
                                           // onClick={() => handleSpanClick(project.fechaInicio, project.id)}
                                            onClick={() => {
                                                if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {
                                                    handleSpanClick(project.fechaInicio, project.id);
                                                }
                                            }}
                                        >
                    {fechaInicioActual[project.id] || project.fechaInicio} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                    )}
                                </Col>

                                <Col style={{paddingTop: '8px'}}
                                     span={2}>
                                    {project.fechaAmpliada ? (
                                        <span style={{
                                            fontSize: '14px',
                                            paddingLeft: 0,
                                            margin: 0,
                                            fontWeight: '400',
                                            color: 'red'
                                        }}>
                                                     {project.fechaFin} < /span>

                                    ): (
                                        <span style={{
                                            fontSize: '14px',
                                            paddingLeft: 0,
                                            margin: 0,
                                            fontWeight: '400',
                                            color: '#055706'
                                        }}>
                                                     {project.fechaFin} < /span>
                                    )}

                                </Col>
                                <Col style={{paddingTop: '8px',  color: '#055706'}} span={2}>
                                    {/* Verifica si fechaAmpliada es null o está vacía */}
                                    {project.fechaAmpliada ? (
                                        // Si hay una fecha, muestra la fecha
                                        <>
          <span
              style={{
                  fontSize: '14px',
                  paddingLeft: 0,
                  margin: 0,
                  fontWeight: '400',
              }}
          >

          </span>
                                            <span>{project.fechaAmpliada}</span>
                                        </>
                                    ) : (
                                        // Si no hay fecha, muestra solo el icono de calendario
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                paddingLeft: 0,
                                                margin: 0,
                                                fontWeight: '400',
                                            }}
                                        >
          <CalendarOutlined />
        </span>
                                    )}
                                </Col>


                                <Col span={3} style={{ display: 'flex', alignItems: 'center' }}
                                     onMouseEnter={() => handleMouseEnter(project.id)}
                                     onMouseLeave={handleMouseLeave}
                                     onDoubleClick={() => {
                                         if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {
                                             handleDoubleClick(project.id)
                                         }


                                     }}>

                                    {editingId === project.id ? (
                                        <Select
                                            style={{
                                                width: '100%',
                                                boxShadow: 'none',
                                                transition: 'background-color 0.3s ease, border 0.3s ease',
                                            }}
                                            className={`custom-select ${hoveredRow === project.id ? 'hovered-bg' : ''}`}
                                            value={selectedOption ? selectedOption.value : 'none'}
                                            onChange={(value) => handleChange(value, project.id)} // Pasar el ID del proyecto
                                            onBlur={() => setEditingId(null)} // Cambiar aquí
                                            suffixIcon={null}
                                            showArrow={false}
                                            showSearch={false}
                                            size="small"
                                        >
                                            {prioridad.length > 0 ? (
                                                prioridad.map(({ value, label, color }) => (
                                                    <Option key={value} value={value}>
                                                        <Space>
                                                            <FlagOutlined style={{ fontSize: '16px', color }} />
                                                            {label}
                                                        </Space>
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option value="none">Sin prioridades disponibles</Option>
                                            )}

                                            <Option key="none" value="none">
                                                <Space>
                                                    <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                                                    Ninguno
                                                </Space>
                                            </Option>
                                        </Select>
                                    ) : (

                                        <span style={{ cursor: 'pointer' }} onDoubleClick={() => {

                                            if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {
                                                handleDoubleClick(project.id)
                                            }

                                } }>
            {project.prioridad ? (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: project.prioridad.backgroundPrioridad }} />
                    {project.prioridad.nombre}
                </Space>
            ) : (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                </Space>
            )}
        </span>
                                    )}
                                </Col>



                            </Row>

                            {/* Renderizar módulos solo si el proyecto está expandido */}
                            {expandedProjects.includes(project.id) && (
                                <Droppable droppableId={project.id.toString()} type="MODULE">
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {project.modulos?.map((modulo, moduloIndex) => (
                                <React.Fragment key={modulo.id}>
                                    <Draggable key={modulo.id} draggableId={`module-${modulo.id}`} index={moduloIndex}>
                                        {(provided,snapshot) => (
                                    <Row
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        gutter={[16, 16]}
                                        style={{
                                            ...provided.draggableProps.style, // Mantén el estilo proporcionado
                                            borderBottom: '1px solid rgba(217, 217, 217, 0.1)', // Agrega borde a la parte inferior
                                            cursor: snapshot.isDragging ? 'grabbing' : 'pointer', // Cambia el cursor cuando esté siendo arrastrado
                                            //backgroundColor: snapshot.isDragging ? 'lightgray' : 'white', // Cambia el color de fondo cuando se está arrastrando
                                            boxShadow: snapshot.isDragging ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none', // Agrega sombra si se está arrastrando
                                            backgroundColor: hoveredRowmodulo === modulo.id ? '#f7f2f2' : '',
                                            marginBottom:2,
                                            marginTop:2,

                                        }}

                                        onMouseEnter={() => handleMouseEntermodulo(modulo.id)}
                                        onMouseLeave={handleMouseLeavemodulo}

                                    >
                                        <Col span={12} >
                                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',marginLeft:44}}>

                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <Checkbox

                                                    />

                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={expandedModules.includes(modulo.id) ? <CaretDownOutlined/> :
                                                            <CaretRightOutlined/>}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpandModule(modulo.id);
                                                        }}
                                                    />
                                                    <FolderOutlined
                                                        style={{
                                                            backgroundColor: project.backgroundProyecto,
                                                            color: 'black',
                                                            padding: '5px',
                                                            borderRadius: '50%',
                                                            border: '2px solid black',
                                                        }}
                                                    />
                                                    {editModuloId === modulo.id ? (
                                                        // Cuando estamos editando, muestra el Input
                                                        <Input
                                                            value={moduloName}
                                                            onChange={(e) => seModuloName(e.target.value)}
                                                            onBlur={() => saveProjectNameModulo(project.id, modulo.id, moduloName)} // Guarda al hacer clic fuera
                                                            onPressEnter={() => saveProjectNameModulo(project.id, modulo.id, moduloName)} // Guarda al presionar Enter
                                                            style={{
                                                                marginLeft: 5,
                                                                fontWeight: 500,
                                                                fontSize: 14,
                                                                width: '72%',
                                                            }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <Tooltip title={modulo.nombre}>

                                                            <a
                                                                style={{
                                                                    marginLeft: 5,
                                                                    fontWeight: 500,
                                                                    textDecoration: 'none',
                                                                    color: 'inherit',
                                                                    fontSize: 14,
                                                                    transition: 'color 0.3s',
                                                                }}
                                                                // Comienza la edición al hacer clic
                                                                onClick={() => showModal('verModulo', project.id, modulo.id)}
                                                                onMouseEnter={(e) => (e.currentTarget.style.color = '#534dc9')}
                                                                onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                                                            >
                                                                {modulo.nombre}
                                                            </a>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                                {/* Mostrar el botón solo si el módulo está expandido */}
                                                {expandedModules.includes(modulo.id)&& (

                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-end',
                                                        marginLeft: 'auto',
                                                        marginRight: 0
                                                    }}>

                                                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                            <Popover
                                                        content={getContentModulo(project.id, modulo.nombre, modulo.id)}
                                                        trigger="click"
                                                        onVisibleChange={(visible) => handleVisibleChangeM(visible, modulo.id)}
                                                    >
                                                        <Button
                                                            type="text"
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '18px',
                                                                borderRadius: '4px',
                                                                backgroundColor: focusedProjectId === project.id ? '#e0e0e0' : 'transparent',
                                                            }}
                                                        >
                                                            <EllipsisOutlined/>
                                                        </Button>
                                                    </Popover>
                                                    ):(
                                                        <div >

                                                        </div>
                                                    )

                                                    }
                                                    <Tooltip title="kamban">
                                                        <Button
                                                            icon={<InsertRowBelowOutlined/>}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => handleButtonClick(project.id, modulo.id)}  // Redirige al hacer clic
                                                            style={{marginLeft: 'auto'}}
                                                        />
                                                    </Tooltip>
                                                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                        <Button
                                                            style={{
                                                                color: '#656f7d',
                                                                backgroundColor: 'transparent', // Color de fondo predeterminado
                                                                transition: 'background-color 0.3s' // Suave transición


                                                            }}
                                                            icon={<PlusOutlined/>}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => showModal('AñadirTarea', project.id, modulo.id)}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#dce0e8'; // Cambia el color de fondo al pasar el mouse
                                                                e.currentTarget.style.color = '#000000'; // Cambia el color del texto si es necesario
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent'; // Restaura el color de fondo al salir
                                                                e.currentTarget.style.color = '#656f7d'; // Restaura el color del texto
                                                            }}
                                                        >

                                                        </Button>

                                                    ):(
                                                        <div >

                                                        </div>
                                                    )

                                                    }




                                                </div>
                                                )}
                                            </div>

                                    </Col>
                                        <Col span={3}>
                                            {/* Generar avatares de los usuarios del proyecto */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                position: 'relative',
                                                height: '22px',
                                                width: '30px',
                                                paddingTop: 10
                                            }}> {/* Reduce la altura aquí */}
                                                {modulo.usuarios.length > 0 ? (
                                                    modulo.usuarios.map((usuario, index) => {
                                                        // Utilizar el color de fondo asignado en backgroundUser
                                                        const backgroundColor = usuario.backgroundUser || '#000000'; // Color predeterminado si backgroundUser es null o undefined

                                                        return (
                                                            <Tooltip
                                                                key={usuario.id}
                                                                title={`${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}
                                                            >
                                                                <Avatar
                                                                    size={27} // Ajusta el tamaño aquí
                                                                    style={{
                                                                        backgroundColor,
                                                                        border: '1px solid white',
                                                                        position: 'absolute',
                                                                        left: `${index * 20}px`, // Ajusta el desplazamiento horizontal
                                                                        zIndex: 10 - index, // Controla la superposición (el último estará encima)
                                                                        lineHeight: '0px', // Ajusta la altura de la línea si es necesario
                                                                        fontSize: '12px', // Ajusta el tamaño de la fuente si es necesario
                                                                    }}
                                                                >
                                                                    {usuario.nombres.charAt(0).toUpperCase()}
                                                                </Avatar>
                                                            </Tooltip>
                                                        );
                                                    })
                                                ) : (
                                                    <Tooltip title="Agregar persona">
                                                        <Avatar
                                                            size={27}
                                                            icon={<UserAddOutlined/>}/>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </Col>
                                        <Col  style={{  paddingTop: '8px', color: '#055706' }} span={2}>
                                            {isDatePickerVisibleModulo[modulo.id] ? (

                                                <>

                                                    <DatePicker
                                                        open={isDatePickerVisibleModulo[modulo.id]}
                                                        // Pasamos row.fechaInicio a cellRender
                                                        onChange={(date, dateString) => handleDateChangeModulo(date, dateString, modulo.id,project.id)}
                                                        onOpenChange={(open) => !open && setIsDatePickerVisibleModulo(prev => ({ ...prev, [modulo.id]: false }))} // Cierra el DatePicker si se cierra
                                                        style={{ width: '75px'}} // Aumenta el ancho del input

                                                        size="small"  // Reduce el tamaño del DatePicker
                                                        format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                        defaultValue={dayjs(modulo.fechaInicio, "YYYY-MM-DD")}
                                                        allowClear={false}  // Desactiva el ícono de la "x"
                                                        suffixIcon={null} // Oculta el icono de calendario

                                                    />




                                                </>
                                            ) : (
                                                <span
                                                    style={{
                                                        fontSize: '14px',
                                                        padding: 0,
                                                        margin: 0,
                                                        fontWeight: '400',
                                                        cursor: 'pointer',
                                                        color: new Date(fechaInicioActualModulo[modulo.id] || modulo.fechaInicio) < new Date(project.fechaInicio)
                                                            ? '#fcba03' // Cambia el color a rojo cuando está tachado
                                                            : 'inherit',
                                                        textDecoration: new Date(fechaInicioActualModulo[modulo.id] || modulo.fechaInicio) < new Date(project.fechaInicio)
                                                            ? 'line-through' // Si la fecha es mayor, se aplica tachado
                                                            : 'none', // Si no, se mantiene normal
                                                    }}
                                                    onClick={() =>{

                                                        if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                            handleSpanClickModulo(modulo.fechaInicio, modulo.id)
                                                        }
                                                }}
                                                >
                    {fechaInicioActualModulo[modulo.id] || modulo.fechaInicio} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                            )}
                                        </Col>


                                        <Col  style={{  paddingTop: '8px',  color: '#055706' }} span={2}>
                                            {isDatePickerVisibleModuloFin[modulo.id] ? (

                                                <>

                                                    <DatePicker
                                                        open={isDatePickerVisibleModuloFin[modulo.id]}
                                                        // Pasamos row.fechaInicio a cellRender
                                                        onChange={(date, dateString) => handleDateChangeModuloFin(date, dateString, modulo.id,project.id)}
                                                        onOpenChange={(open) => !open && setIsDatePickerVisibleModuloFin(prev => ({ ...prev, [modulo.id]: false }))} // Cierra el DatePicker si se cierra
                                                        style={{ width: '75px', padding:0 }} // Aumenta el ancho del input

                                                        size="small"  // Reduce el tamaño del DatePicker
                                                        format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                        defaultValue={dayjs(modulo.fechaFin, "YYYY-MM-DD")}
                                                        allowClear={false}  // Desactiva el ícono de la "x"
                                                        suffixIcon={null} // Oculta el icono de calendario

                                                    />




                                                </>
                                            ) : (
                                                <span
                                                    style={{
                                                        fontSize: '14px',
                                                        padding: 0,
                                                        margin: 0,
                                                        fontWeight: '400',
                                                        cursor: 'pointer',
                                                        color: new Date(fechaInicioActualModuloFin[modulo.id] || modulo.fechaFin) > new Date(project.fechaAmpliada || project.fechaFin)
                                                            ? '#fcba03' // Cambia el color a rojo cuando está tachado
                                                            : 'inherit',
                                                        textDecoration: new Date(fechaInicioActualModuloFin[modulo.id] || modulo.fechaFin) > new Date(project.fechaAmpliada || project.fechaFin)
                                                            ? 'line-through' // Si la fecha es mayor, se aplica tachado
                                                            : 'none', // Si no, se mantiene normal
                                                    }}
                                                    onClick={() =>{

                                                        if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                            handleSpanClickModuloFin(modulo.fechaFin, modulo.id)
                                                        }
                                                    }}
                                                >
                    {fechaInicioActualModuloFin[modulo.id] || modulo.fechaFin} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                            )}
                                        </Col>
                                        <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                             span={2}>




                                        </Col>
                                        <Col span={3} style={{ display: 'flex', alignItems: 'center' }}

                                             onMouseLeave={handleMouseLeave}
                                             onDoubleClick={(e) => {


                                                 if (usuarioActivo && usuarioActivo.rolesNames && usuarioActivo.rolesNames.includes("GESTOR")) {
                                                     e.stopPropagation(); // Detener la propagación del evento
                                                     handleDoubleClickModulo(modulo.id);
                                                 }
                                             }}>
                                            {editingModuloId === modulo.id ? (
                                                <Select
                                                    style={{
                                                        width: '100%',
                                                        boxShadow: 'none',
                                                        transition: 'background-color 0.3s ease, border 0.3s ease',

                                                    }}
                                                    //className={`custom-select ${hoveredRow === modulo.id ? 'hovered-bg' : ''}`}
                                                    value={selectedOptionModulo ? selectedOptionModulo.value : 'none'}
                                                    onChange={(value) => handleChangeModulo(value, modulo.id,project.id)} // Pasar el ID del proyecto
                                                    onBlur={() => setEditingModuloId(null)} // Cambiar aquí
                                                    suffixIcon={null}
                                                    showArrow={false}
                                                    showSearch={false}
                                                    size="small"
                                                >
                                                    {prioridad.length > 0 ? (
                                                        prioridad.map(({ value, label, color }) => (
                                                            <Option key={value} value={value}>
                                                                <Space>
                                                                    <FlagOutlined style={{ fontSize: '16px', color }} />
                                                                    {label}
                                                                </Space>
                                                            </Option>
                                                        ))
                                                    ) : (
                                                        <Option value="none">Sin prioridades disponibles</Option>
                                                    )}

                                                    <Option key="none" value="none">
                                                        <Space>
                                                            <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                                                            Ninguno
                                                        </Space>
                                                    </Option>
                                                </Select>

                                            ) : (
                                                <span style={{ cursor: 'pointer' }} onDoubleClick={() =>{

                                                    if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {
                                                        handleDoubleClickModulo(modulo.id)
                                                    }

                                                }}>
            {modulo.prioridad ? (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: modulo.prioridad.backgroundPrioridad }} />
                    {modulo.prioridad.nombre}
                </Space>
            ) : (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                </Space>
            )}
        </span>
                                            )}
                                        </Col>

                                    </Row>
                                        )}
                                    </Draggable>


                            {/* Renderizar tareas solo si el módulo está expandido */}
                                    {expandedModules.includes(modulo.id) && (
                                            <Droppable droppableId={modulo.id.toString()} type="TASK">
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                                    {modulo?.tareas?.map((tarea, tareaIndex) => (
                                <React.Fragment key={tarea.id}>
                                    <Draggable key={tarea.id}
                                               draggableId={`task-${tarea.id}`}
                                               index={tareaIndex}
                                    >
                                        {(provided,snapshot) => (

                            <Row

                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                gutter={[16, 16]}
                                style={{
                                    ...provided.draggableProps.style, // Mantén el estilo proporcionado
                                    borderBottom: '1px solid rgba(217, 217, 217, 0.1)', // Agrega borde a la parte inferior
                                    cursor: snapshot.isDragging ? 'grabbing' : 'pointer', // Cambia el cursor cuando esté siendo arrastrado
                                   // backgroundColor: snapshot.isDragging ? 'lightgray' : 'white', // Cambia el color de fondo cuando se está arrastrando
                                    boxShadow: snapshot.isDragging ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none', // Agrega sombra si se está arrastrando
                                    backgroundColor: hoveredRowtarea === tarea.id ? '#f7f2f2' : '',
                                    marginBottom:2,
                                    marginTop:2,

                                }}

                                onMouseEnter={() => handleMouseEntertarea(tarea.id)}
                                onMouseLeave={handleMouseLeavetarea}
                            >
                                <Col span={12}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginLeft: 70
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <Checkbox

                                            />


                                            <Button
                                                type="text"
                                                size="small"
                                                icon={expandedTasks.includes(tarea.id) ? <CaretDownOutlined/> :
                                                    <CaretRightOutlined/>}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpandTask(tarea.id);
                                                }}
                                            />
                                            <FileTextOutlined
                                                style={{
                                                    backgroundColor: project.backgroundProyecto,
                                                    color: 'black',
                                                    padding: '5px',
                                                    borderRadius: '50%',
                                                    border: '2px solid black',
                                                }}
                                            />
                                            {editTareaId === tarea.id ? (
                                                <Input
                                                    value={tareaName}
                                                    onChange={(e) => setTareaName(e.target.value)}
                                                    onBlur={() => saveProjectNameTarea(modulo.id, tarea.id, tareaName)} // Guarda al hacer clic fuera
                                                    onPressEnter={() => saveProjectNameTarea(modulo.id, tarea.id, tareaName)} // Guarda al presionar Enter
                                                    style={{
                                                        marginLeft: 5,
                                                        fontWeight: 500,
                                                        fontSize: 14,
                                                        width: '72%',
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <Tooltip title={tarea.nombre}>

                                                    <a
                                                        style={{
                                                            marginLeft: 5,
                                                            fontWeight: 500,
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            fontSize: 14,
                                                            transition: 'color 0.3s',
                                                        }}
                                                        // Comienza la edición al hacer clic
                                                        onClick={() => showModal('verTarea', project.id, modulo.id, tarea.id)}
                                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#534dc9')}
                                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                                                    >

                                                        {truncateText(tarea.nombre)}
                                                    </a>
                                                </Tooltip>
                                            )}
                                        </div>
                                            {expandedTasks.includes(tarea.id) && (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginLeft: 'auto',
                                                        marginRight: 0
                                                    }}>
                                                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                            <Popover
                                                        content={getContentTarea(tarea.id, tarea.nombre, modulo.id)}
                                                        trigger="click"
                                                        onVisibleChange={(visible) => handleVisibleChangeT(visible, tarea.id)}
                                                    >
                                                        <Button
                                                            type="text"
                                                            style={{
                                                                padding: '4px 8px',
                                                                fontSize: '18px',
                                                                borderRadius: '4px',
                                                                backgroundColor: focusedProjectId === tarea.id ? '#e0e0e0' : 'transparent',
                                                            }}
                                                        >
                                                            <EllipsisOutlined/>
                                                        </Button>
                                                    </Popover>
                                                    ):(
                                                        <div >

                                                        </div>
                                                    )

                                                    }

                                                    <Tooltip title="kamban">
                                                        <Button
                                                            icon={<InsertRowBelowOutlined/>}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => handleButtonClickSub(project.id, modulo.id, tarea.id)}  // Redirige al hacer clic
                                                            style={{
                                                                marginLeft: 'auto',
                                                                paddingRight: 10,
                                                                paddingTop: 6
                                                            }}
                                                        />
                                                    </Tooltip>

                                                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                        <Button
                                                        style={{
                                                            color: '#656f7d',
                                                            backgroundColor: 'transparent', // Color de fondo predeterminado
                                                            transition: 'background-color 0.3s' // Suave transición
                                                            , marginRight: 6,

                                                        }}
                                                        icon={<PlusOutlined/>}
                                                        size="small"
                                                        type="link"
                                                        onClick={() => showModal('AñadirSubtarea', project.id, modulo.id, tarea.id)}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#dce0e8'; // Cambia el color de fondo al pasar el mouse
                                                            e.currentTarget.style.color = '#000000'; // Cambia el color del texto si es necesario
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent'; // Restaura el color de fondo al salir
                                                            e.currentTarget.style.color = '#656f7d'; // Restaura el color del texto
                                                        }}
                                                    >
                                                    </Button>


                                                    ):(
                                                        <div >

                                                        </div>
                                                    )

                                                    }

                                                </div>
                                            )}


                                    </div>
                                </Col>
                                <Col span={3}>
                                    {/* Generar avatares de los usuarios del proyecto */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        position: 'relative',
                                        height: '22px',
                                        width: '30px',
                                        paddingTop: 10
                                    }}> {/* Reduce la altura aquí */}
                                        {tarea.usuarios.length > 0 ? (
                                            tarea.usuarios.map((usuario, index) => {
                                                // Utilizar el color de fondo asignado en backgroundUser
                                                const backgroundColor = usuario.backgroundUser || '#000000'; // Color predeterminado si backgroundUser es null o undefined

                                                return (
                                                    <Tooltip
                                                        key={usuario.id}
                                                        title={`${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}
                                                    >
                                                        <Avatar
                                                            size={27} // Ajusta el tamaño aquí
                                                            style={{
                                                                backgroundColor,
                                                                border: '1px solid white',
                                                                position: 'absolute',
                                                                left: `${index * 20}px`, // Ajusta el desplazamiento horizontal
                                                                zIndex: 10 - index, // Controla la superposición (el último estará encima)
                                                                lineHeight: '0px', // Ajusta la altura de la línea si es necesario
                                                                fontSize: '12px', // Ajusta el tamaño de la fuente si es necesario
                                                            }}
                                                        >
                                                            {usuario.nombres.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    </Tooltip>
                                                );
                                            })
                                        ) : (
                                            <Tooltip title="Agregar persona">
                                                <Avatar
                                                    size={27}
                                                    icon={<UserAddOutlined/>}/>
                                            </Tooltip>
                                        )}
                                    </div>
                                </Col>
                                <Col  style={{  paddingTop: '8px',  color: '#055706' }} span={2}>
                                    {isDatePickerVisibleTareaFechaInicio[tarea.id] ? (

                                        <>

                                            <DatePicker
                                                open={isDatePickerVisibleTareaFechaInicio[tarea.id]}
                                                // Pasamos row.fechaInicio a cellRender
                                                onChange={(date, dateString) => handleDateChangeTareaFechaInicio(date, dateString, tarea.id,modulo.id)}
                                                onOpenChange={(open) => !open && setIsDatePickerVisibleTareaFechaInicio(prev => ({ ...prev, [tarea.id]: false }))} // Cierra el DatePicker si se cierra
                                                style={{ width: '75px', padding:0 }} // Aumenta el ancho del input

                                                size="small"  // Reduce el tamaño del DatePicker
                                                format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                defaultValue={dayjs(tarea.fechaInicio, "YYYY-MM-DD")}
                                                allowClear={false}  // Desactiva el ícono de la "x"
                                                suffixIcon={null} // Oculta el icono de calendario

                                            />




                                        </>
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                padding: 0,
                                                margin: 0,
                                                fontWeight: '400',
                                                cursor: 'pointer',
                                                color: new Date(fechaInicioActualTareaFechaInicio[tarea.id] || tarea.fechaInicio) < new Date(modulo.fechaInicio)
                                                    ? '#fcba03' // Cambia el color a rojo cuando está tachado
                                                    : 'inherit',
                                                textDecoration: new Date(fechaInicioActualTareaFechaInicio[tarea.id] || tarea.fechaInicio) < new Date(modulo.fechaInicio)
                                                    ? 'line-through' // Si la fecha es mayor, se aplica tachado
                                                    : 'none', // Si no, se mantiene normal
                                            }}
                                            onClick={() =>{

                                                if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                    handleSpanClickTareaFechaInicio(tarea.fechaInicio, tarea.id)
                                                }

                                        }}
                                        >
                    {fechaInicioActualTareaFechaInicio[tarea.id] || tarea.fechaInicio} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                    )}
                                </Col>

                                <Col  style={{  paddingTop: '8px',  color: '#055706' }} span={2}>
                                    {isDatePickerVisibleTareaFechaFin[tarea.id] ? (

                                        <>

                                            <DatePicker
                                                open={isDatePickerVisibleTareaFechaFin[tarea.id]}
                                                // Pasamos row.fechaInicio a cellRender
                                                onChange={(date, dateString) => handleDateChangeTareaFechaFin(date, dateString, tarea.id,modulo.id)}
                                                onOpenChange={(open) => !open && setIsDatePickerVisibleTareaFechaFin(prev => ({ ...prev, [tarea.id]: false }))} // Cierra el DatePicker si se cierra
                                                style={{ width: '75px', padding:0 }} // Aumenta el ancho del input

                                                size="small"  // Reduce el tamaño del DatePicker
                                                format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                defaultValue={dayjs(tarea.fechaFin, "YYYY-MM-DD")}
                                                allowClear={false}  // Desactiva el ícono de la "x"
                                                suffixIcon={null} // Oculta el icono de calendario

                                            />




                                        </>
                                    ) : (
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                padding: 0,
                                                margin: 0,
                                                fontWeight: '400',
                                                cursor: 'pointer',
                                                color: new Date(fechaInicioActualTareaFechaFin[tarea.id] || tarea.fechaFin) > new Date(modulo.fechaFin)
                                                    ? '#fcba03' // Cambia el color a rojo cuando está tachado
                                                    : 'inherit',
                                                textDecoration: new Date(fechaInicioActualTareaFechaFin[tarea.id] || tarea.fechaFin) > new Date(modulo.fechaFin)
                                                    ? 'line-through' // Si la fecha es mayor, se aplica tachado
                                                    : 'none', // Si no, se mantiene normal
                                            }}
                                            onClick={() => {

                                                if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                    handleSpanClickTareaFechaFin(tarea.fechaFin, tarea.id)
                                                }
                                        }}
                                        >
                    {fechaInicioActualTareaFechaFin[tarea.id] || tarea.fechaFin} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                    )}
                                </Col>
                                <Col style={{paddingTop: '8px', color: '#055706'}}
                                     span={2}>




                                </Col>
                                <Col span={3} style={{ display: 'flex', alignItems: 'center' }}

                                     onMouseLeave={handleMouseLeave}
                                     onDoubleClick={(e) => {


                                         if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {
                                             e.stopPropagation(); // Detener la propagación del evento
                                             handleDoubleClickTarea(tarea.id);
                                         }
                                     }}>
                                    {editingTareaId === tarea.id ? (
                                        <Select
                                            style={{
                                                width: '100%',
                                                boxShadow: 'none',
                                                transition: 'background-color 0.3s ease, border 0.3s ease',

                                            }}
                                            //className={`custom-select ${hoveredRow === modulo.id ? 'hovered-bg' : ''}`}
                                            value={selectedOptionTarea ? selectedOptionTarea.value : 'none'}
                                            onChange={(value) => handleChangeTarea(value, modulo.id,tarea.id)} // Pasar el ID del proyecto
                                            onBlur={() => setEditingTareaId(null)} // Cambiar aquí
                                            suffixIcon={null}
                                            showArrow={false}
                                            showSearch={false}
                                            size="small"
                                        >
                                            {prioridad.length > 0 ? (
                                                prioridad.map(({ value, label, color }) => (
                                                    <Option key={value} value={value}>
                                                        <Space>
                                                            <FlagOutlined style={{ fontSize: '16px', color }} />
                                                            {label}
                                                        </Space>
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option value="none">Sin prioridades disponibles</Option>
                                            )}

                                            <Option key="none" value="none">
                                                <Space>
                                                    <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                                                    Ninguno
                                                </Space>
                                            </Option>
                                        </Select>
                                    ) : (
                                        <span style={{ cursor: 'pointer'}} onDoubleClick={() => {

                                            if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {
                                                e.stopPropagation(); // Detener la propagación del evento
                                                handleDoubleClickTarea(tarea.id)
                                            }
                                        }}>
            {tarea.prioridad ? (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: tarea.prioridad.backgroundPrioridad }} />
                    {tarea.prioridad.nombre}
                </Space>
            ) : (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                </Space>
            )}
        </span>
                                    )}
                                </Col>

                            </Row>
                                        )}
                                    </Draggable>


                                    {/* Renderizar subtareas solo si la tarea e stá expandida */}
                                    {expandedTasks.includes(tarea.id) &&(
                                        <Droppable droppableId={tarea.id.toString()} type="SUBTASK">
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                                        {tarea?.subtareas?.map((subtarea, subtareaIndex) => (
                                                            <React.Fragment key={subtarea.id}>
                                                                <Draggable key={subtarea.id}
                                                                           draggableId={`subtask-${subtarea.id}`}
                                                                           index={subtareaIndex}
                                                                >
                                                                    {(provided,snapshot) => (
                                        <Row
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            gutter={[16, 16]}
                                            style={{
                                                ...provided.draggableProps.style, // Mantén el estilo proporcionado
                                                borderBottom: '1px solid rgba(217, 217, 217, 0.1)', // Agrega borde a la parte inferior
                                                cursor: snapshot.isDragging ? 'grabbing' : 'pointer', // Cambia el cursor cuando esté siendo arrastrado
                                                //backgroundColor: snapshot.isDragging ? 'lightgray' : 'white', // Cambia el color de fondo cuando se está arrastrando
                                                boxShadow: snapshot.isDragging ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none', // Agrega sombra si se está arrastrando
                                                backgroundColor: hoveredRowsubtarea === subtarea.id ? '#f7f2f2' : '',

                                            }}
                                            onMouseEnter={() => handleMouseEntersubtarea(subtarea.id)}
                                            onMouseLeave={handleMouseLeavesubtarea}
                                        >
                                            <Col span={12} style={{width: '50%'}}>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginLeft: 114

                                                }}>


                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                            <Checkbox

                                                        />


                                                        <Avatar
                                                            style={{
                                                                backgroundColor: 'transparent', // Fondo transparente
                                                                border: `3px solid ${project.backgroundProyecto}`,      // Color y grosor del borde
                                                                borderRadius: '50%',            // Redondeado para que sea un círculo
                                                                width: 15,                      // Tamaño del círculo (ajusta según sea necesario)
                                                                height: 15,
                                                                marginLeft:5
                                                            }}
                                                        />

                                                        {editsubTareaId === subtarea.id ? (
                                                            <Input
                                                                value={subtareaName}
                                                                onChange={(e) => setsubTareaName(e.target.value)}
                                                                onBlur={() => saveProjectNamesubTarea(tarea.id, subtarea.id, subtareaName)} // Guarda al hacer clic fuera
                                                                onPressEnter={() => saveProjectNamesubTarea(tarea.id, subtarea.id, subtareaName)} // Guarda al presionar Enter
                                                                style={{
                                                                    marginLeft: 5,
                                                                    fontWeight: 500,
                                                                    fontSize: 14,
                                                                    width: '72%',
                                                                }}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <Tooltip
                                                                title={subtarea.nombre}>

                                                                <a
                                                                    style={{
                                                                        marginLeft: 5,
                                                                        fontWeight: 500,
                                                                        textDecoration: 'none',
                                                                        color: 'inherit',
                                                                        fontSize: 14,
                                                                        transition: 'color 0.3s',
                                                                    }}
                                                                    // Comienza la edición al hacer clic
                                                                    onClick={() => showModal('verSubtarea', project.id, modulo.id, tarea.id, subtarea.id)}
                                                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#534dc9')}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                                                                >

                                                                    {truncateText(subtarea.nombre)}
                                                                </a>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginLeft: 'auto',

                                                        }}>
                                                        {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                            <Popover
                                                            content={getContentsubTarea(subtarea.id, subtarea.nombre, tarea.id)}
                                                            trigger="click"
                                                            onVisibleChange={(visible) => handleVisibleChangeST(visible, subtarea.id)}
                                                        >
                                                            <Button
                                                                type="text"
                                                                style={{
                                                                    padding: '4px 8px',
                                                                    fontSize: '18px',
                                                                    borderRadius: '4px',
                                                                    backgroundColor: focusedProjectId === subtarea.id ? '#e0e0e0' : 'transparent',
                                                                }}
                                                            >
                                                                <EllipsisOutlined/>
                                                            </Button>
                                                        </Popover>

                                                        ):(
                                                            <div >

                                                            </div>
                                                        )

                                                        }
                                                    </div>
                                                </div>

                                            </Col>
                                            <Col span={3}>
                                                {/* Generar avatares de los usuarios del proyecto */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    position: 'relative',
                                                    height: '22px',
                                                    width: '30px',
                                                    paddingTop: 10,
                                                    marginRight:40,


                                                }}> {/* Reduce la altura aquí */}
                                                    {subtarea.usuarios.length > 0 ? (
                                                        subtarea.usuarios.map((usuario, index) => {
                                                            // Utilizar el color de fondo asignado en backgroundUser
                                                            const backgroundColor = usuario.backgroundUser || '#000000'; // Color predeterminado si backgroundUser es null o undefined

                                                            return (
                                                                <Tooltip
                                                                    key={usuario.id}
                                                                    title={`${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}
                                                                >
                                                                    <Avatar
                                                                        size={27} // Ajusta el tamaño aquí
                                                                        style={{
                                                                            backgroundColor,
                                                                            border: '1px solid white',
                                                                            position: 'absolute',
                                                                            left: `${index * 20}px`, // Ajusta el desplazamiento horizontal
                                                                            zIndex: 10 - index, // Controla la superposición (el último estará encima)
                                                                            lineHeight: '0px', // Ajusta la altura de la línea si es necesario
                                                                            fontSize: '12px', // Ajusta el tamaño de la fuente si es necesario
                                                                        }}
                                                                    >
                                                                        {usuario.nombres.charAt(0).toUpperCase()}
                                                                    </Avatar>
                                                                </Tooltip>
                                                            );
                                                        })
                                                    ) : (
                                                        <Tooltip
                                                            title="Agregar persona">
                                                            <Avatar
                                                                size={27}
                                                                icon={
                                                                    <UserAddOutlined/>}/>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col style={{
                                                paddingTop: '8px',

                                                color: '#055706'
                                            }} span={2}>
                                                {isDatePickerVisiblesubtareaFechaInicio[subtarea.id] ? (

                                                    <>

                                                        <DatePicker
                                                            open={isDatePickerVisiblesubtareaFechaInicio[subtarea.id]}
                                                            // Pasamos row.fechaInicio a cellRender
                                                            onChange={(date, dateString) => handleDateChangesubtareaFechaInicio(date, dateString, subtarea.id, tarea.id)}
                                                            onOpenChange={(open) => !open && setIsDatePickerVisiblesubtareaFechaInicio(prev => ({
                                                                ...prev,
                                                                [subtarea.id]: false
                                                            }))} // Cierra el DatePicker si se cierra
                                                            style={{
                                                                width: '75px',
                                                                padding: 0
                                                            }} // Aumenta el ancho del input

                                                            size="small"  // Reduce el tamaño del DatePicker
                                                            format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                            defaultValue={dayjs(subtarea.fechaInicio, "YYYY-MM-DD")}
                                                            allowClear={false}  // Desactiva el ícono de la "x"
                                                            suffixIcon={null} // Oculta el icono de calendario

                                                        />


                                                    </>
                                                ) : (
                                                    <span
                                                        style={{
                                                            fontSize: '14px',
                                                            padding: 0,
                                                            margin: 0,
                                                            fontWeight: '400',
                                                            cursor: 'pointer',
                                                            color: new Date(fechaInicioActualsubtareaFechaInicio[subtarea.id] || subtarea.fechaInicio) < new Date(tarea.fechaInicio)
                                                                ? '#fcba03' // Cambia el color a rojo cuando está tachado
                                                                : 'inherit',
                                                            textDecoration: new Date(fechaInicioActualsubtareaFechaInicio[subtarea.id] || subtarea.fechaInicio) < new Date(tarea.fechaInicio)
                                                                ? 'line-through' // Si la fecha es mayor, se aplica tachado
                                                                : 'none', // Si no, se mantiene normal
                                                        }}
                                                        onClick={() => {

                                                            if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                                handleSpanClicksubtareaFechaInicio(subtarea.fechaInicio, subtarea.id)
                                                            }

                                                    }}
                                                    >
                    {fechaInicioActualsubtareaFechaInicio[subtarea.id] || subtarea.fechaInicio} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                                )}
                                            </Col>
                                            <Col style={{
                                                paddingTop: '8px',

                                                color: '#055706'
                                            }} span={2}>
                                                {isDatePickerVisiblesubtareaFechaFin[subtarea.id] ? (

                                                    <>

                                                        <DatePicker
                                                            open={isDatePickerVisiblesubtareaFechaFin[subtarea.id]}
                                                            // Pasamos row.fechaInicio a cellRender
                                                            onChange={(date, dateString) => handleDateChangesubtareaFechaFin(date, dateString, subtarea.id, tarea.id)}
                                                            onOpenChange={(open) => !open && setIsDatePickerVisiblesubtareaFechaFin(prev => ({
                                                                ...prev,
                                                                [subtarea.id]: false
                                                            }))} // Cierra el DatePicker si se cierra
                                                            style={{
                                                                width: '75px',
                                                                padding: 0
                                                            }} // Aumenta el ancho del input

                                                            size="small"  // Reduce el tamaño del DatePicker
                                                            format="YYYY-MM-DD" // Establece un formato compacto para la fecha
                                                            defaultValue={dayjs(subtarea.fechaFin, "YYYY-MM-DD")}
                                                            allowClear={false}  // Desactiva el ícono de la "x"
                                                            suffixIcon={null} // Oculta el icono de calendario

                                                        />


                                                    </>
                                                ) : (
                                                    <span
                                                        style={{
                                                            fontSize: '14px',
                                                            padding: 0,
                                                            margin: 0,
                                                            fontWeight: '400',
                                                            cursor: 'pointer',
                                                            color: new Date(fechaInicioActualsubtareaFechaFin[subtarea.id] || subtarea.fechaFin) > new Date(tarea.fechaFin)
                                                                ? '#fcba03' // Cambia el color a rojo cuando está tachado
                                                                : 'inherit',
                                                            textDecoration: new Date(fechaInicioActualsubtareaFechaFin[subtarea.id] || subtarea.fechaFin) > new Date(tarea.fechaFin)
                                                                ? 'line-through' // Si la fecha es mayor, se aplica tachado
                                                                : 'none', // Si no, se mantiene normal


                                                        }}
                                                        onClick={() => {

                                                            if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                                handleSpanClicksubtareaFechaFin(subtarea.fechaFin, subtarea.id)
                                                            }

                                                    }}
                                                    >
                    {fechaInicioActualsubtareaFechaFin[subtarea.id] || subtarea.fechaFin} {/* Muestra la fecha seleccionada o la predeterminada */}
                </span>
                                                )}
                                            </Col>
                                            <Col style={{
                                                paddingTop: '8px',
                                                paddingLeft: 4,
                                                color: '#055706'
                                            }}
                                                 span={2}>


                                            </Col>
                                            <Col span={3} style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}

                                                 onMouseLeave={handleMouseLeave}
                                                 onDoubleClick={(e) => {

                                                     if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                         e.stopPropagation(); // Detener la propagación del evento
                                                         handleDoubleClickSubtarea(subtarea.id);
                                                     }
                                                 }}>
                                                {editingSubtareaId === subtarea.id ? (
                                                    <Select
                                                        style={{
                                                            width: '100%',
                                                            boxShadow: 'none',
                                                            transition: 'background-color 0.3s ease, border 0.3s ease',

                                                        }}
                                                        //className={`custom-select ${hoveredRow === modulo.id ? 'hovered-bg' : ''}`}
                                                        value={selectedOptionSubtarea ? selectedOptionSubtarea.value : 'none'}
                                                        onChange={(value) => handleChangeSubtarea(value, tarea.id, subtarea.id)} // Pasar el ID del proyecto
                                                        onBlur={() => setEditingSubtareaId(null)} // Cambiar aquí
                                                        suffixIcon={null}
                                                        showArrow={false}
                                                        showSearch={false}
                                                        size="small"
                                                    >
                                                        {prioridad.length > 0 ? (
                                                            prioridad.map(({
                                                                               value,
                                                                               label,
                                                                               color
                                                                           }) => (
                                                                <Option
                                                                    key={value}
                                                                    value={value}>
                                                                    <Space>
                                                                        <FlagOutlined
                                                                            style={{
                                                                                fontSize: '16px',
                                                                                color
                                                                            }}/>
                                                                        {label}
                                                                    </Space>
                                                                </Option>
                                                            ))
                                                        ) : (
                                                            <Option
                                                                value="none">Sin
                                                                prioridades
                                                                disponibles</Option>
                                                        )}

                                                        <Option key="none"
                                                                value="none">
                                                            <Space>
                                                                <FlagOutlined
                                                                    style={{
                                                                        fontSize: '16px',
                                                                        color: 'gray'
                                                                    }}/>
                                                                Ninguno
                                                            </Space>
                                                        </Option>
                                                    </Select>
                                                ) : (
                                                    <span style={{
                                                        cursor: 'pointer',

                                                    }}
                                                          onDoubleClick={()  =>{

                                                              if (usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR"))) {

                                                                  //e.stopPropagation(); // Detener la propagación del evento
                                                                  handleDoubleClickSubtarea(subtarea.id)
                                                              }
                                                    }}>
            {subtarea.prioridad ? (
                <Space>
                    <FlagOutlined style={{fontSize: '16px', color: subtarea.prioridad.backgroundPrioridad}}/>
                    {subtarea.prioridad.nombre}
                </Space>
            ) : (
                <Space>
                    <FlagOutlined style={{fontSize: '16px', color: 'gray'}}/>
                </Space>
            )}
        </span>
                                                )}
                                            </Col>

                                        </Row>
                                                                        )}
                                                                    </Draggable>
                                                            </React.Fragment>
                                                                ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                        </Droppable>
                                    )}
                                </React.Fragment>
                                                    ))}
                                                    {provided.placeholder}

                                                </div>
                                            )}
                                        </Droppable>
                            )}






                                    
                                </React.Fragment>

                                            ))}

                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                            )}

                        </React.Fragment>
                                            </div>
                                        )}
                                    </Draggable>
                                      ))}
                                    {provided.placeholder}

                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    )}
                </>

            </div>

            <Modal
                style={{
                    top: 20,
                }}
                title={
                    modalType === 'verProyecto' ? (
                            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>

                              </span>
                        ) :
                        modalType === 'editarProyecto' ? 'Editar Proyecto' :
                            modalType === 'Añadirproyecto' ? 'Crear Proyecto' :
                                modalType === 'verModulo' ? (
                                        <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>

                            </span>
                                    ) :
                                    modalType === 'editarModulo' ? 'Editar Módulo' :
                                        modalType === 'AñadirModulo' ? 'Crear Módulo' :
                                            modalType === 'editarProyecto' ? 'Editar Proyecto' :
                                                modalType === 'Añadirproyecto' ? 'Crear Proyecto' :
                                                    modalType === 'verTarea' ? (
                                                            <span
                                                                style={{display: 'flex', alignItems: 'center', gap: '8px'}}>

                            </span>
                                                        ) :

                                                        modalType === 'editarTarea' ? 'Editar Tarea' :
                                                            modalType === 'AñadirTarea' ? 'Crear Tarea' :
                                                                modalType === 'verSubtarea' ? (
                                                                        <span style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '8px'
                                                                        }}>

                            </span>
                                                                    ) :

                                                                    modalType === 'editarSubtarea' ? 'Editar Subtarea' :
                                                                        modalType === 'AñadirSubtarea' ? 'Crear Subtarea' :
                                                                            'Crear Item'
                }
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={modalType === 'verProyecto' || modalType === 'verModulo' || modalType === 'verTarea' || modalType === 'verSubtarea' ? null : [
                    <Button key="cancel" onClick={handleCancel}>Cancelar</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>Guardar</Button>
                ]}
                width={modalType === 'verProyecto' || modalType === 'verModulo' || modalType === 'verTarea' || modalType === 'verSubtarea' ? 1200 : undefined}
                //  bodyStyle={{  borderBottom: '1px solid #d9d9d9',borderTop: '1px solid #d9d9d9', borderRadius: '8px' }} // Estilo del cuerpo del modal


            >
                {/* Contenido según el modalType */}

                {
                    modalType === 'verProyecto' && selectedProject && (
<>
                        <Row style={{borderBottom:'1px solid #f0f3f7', paddingBottom:6}}>
                            <Col span={24}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

                                    <div>
      <span
          style={{
              backgroundColor: `${selectedProject.backgroundProyecto}`,
              padding: '4px 8px',
              color: '#ffffff',
              borderRadius: '4px'
          }}
      >
        P
      </span>
                                        <span>
        <BookOutlined style={{fontSize: '17px', color: '#656f7d', marginLeft: 8}}/>
      </span>
                                        <span style={{
                                            fontWeight: 600,
                                            color: '#656f7d',
                                            fontSize: '17px',
                                            marginLeft: 8
                                        }}>/</span>
                                        <span style={{ color: '#656f7d'}}>PROYECTO</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginRight: 20}}>
                                        {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                                <Tooltip title={"Archivar proyecto"}>

                                            <Button
                                                style={{
                                                    padding: '3px 7px',
                                                    backgroundColor: '#001529',
                                                    borderRadius: 5,
                                                    color: '#ffffff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    border: 'none'
                                                }}
                                                icon={<InboxOutlined style={{fontSize: '17px', color: '#ffffff'}}/>}
                                                onClick={() => archivarProyecto(selectedProject.id, selectedProject.nombre)}
                                            >
                                                Archivar
                                            </Button>

                                        </Tooltip>

                                        ):(
                                            <div >

                                            </div>
                                        )

                                        }
                                        <Divider type="vertical"/>


                                        <div style={{display: 'flex', gap: '0px'}}>

                                            {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (


                                                    <Tooltip title={"Eliminar proyecto"}>
                                            <Button
                                                style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                icon={<DeleteOutlined style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                onClick={()=>eliminarProyectos(selectedProject.id, selectedProject.nombre)}
                                            />
                                            </Tooltip>
                                            ):(
                                                <div >

                                                </div>
                                            )

                                            }


                                        </div>
                                        <Divider type="vertical"/>
                                    </div>

                                </div>
                            </Col>

                        </Row>

    <Row>
        <Col span={15} style={{overflowY: "auto", height: 450, paddingRight: 10}}>

            <div style={{paddingLeft: 10}}>


                <p style={{fontSize: '30px', fontWeight: 'bold'}}>
                    {selectedProject.nombre}
                </p>


                <div>

                    <span
                        style={{

                            padding: '10px',
                            backgroundColor: '#f0f2f5',
                            borderRadius: '5px',
                            display: 'flex', // Usar flex para alinear el ícono y el texto
                            alignItems: 'flex-start', // Alinear el ícono al inicio (parte superior),
                            color: '#656f7d'


                        }}
                    >
                    <MessageOutlined
                                           style={{marginRight: '8px', alignSelf: 'flex-start',color: '#656f7d'}}/>
                       <span> El estado del proyecto se actualizará automáticamente a
                        <span style={{
                            background: 'linear-gradient(45deg, blue, red)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            marginRight: 5,
                            marginLeft: 5
                        }}>
    COMPLETADO
</span>
                        ,cuando todos los  módulos tengan el estado        <span style={{
                               background: 'linear-gradient(45deg, blue, red)',
                               backgroundClip: 'text',
                               color: 'transparent',
                               fontWeight: 'bold',
                               fontSize: '12px',
                               marginRight: 5,
                               marginLeft: 5
                           }}>
    COMPLETADO
</span> </span>

                    </span>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'initial',
                            justifyContent: "space-between",
                            marginTop: 20,


                        }}>
                    <div style={{
                                           display: 'flex',
                                           flexDirection: 'column',
                                           gap: '16px',
                                           color: '#656f7d'

                                       }}>
                                           <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                               <div style={{
                                                   display: 'flex',
                                                   alignItems: 'center',
                                                   gap: '8px',
                                                   color: '#656f7d'
                                               }}>
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
                                               <div style={{
                                                   display: 'flex',
                                                   alignItems: 'center',
                                                   gap: '8px',
                                                   marginTop: 5,
                                                   color: '#656f7d'
                                               }}>
                                                   <CalendarOutlined/>

                                                   <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                       Fecha incio:
                                                       <span style={{
                                                           fontSize: '14px',
                                                           paddingLeft: 5,
                                                           margin: 0,
                                                           fontWeight: '400'
                                                       }}>
        {selectedProject.fechaInicio}
    </span>
                                                   </p>
                                               </div>
                                               {selectedProject.fechaAmpliada ? (
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: 'red'
                                                   }}>
                                                       <CalendarOutlined/>

                                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                           Fecha fin:
                                                           <span style={{
                                                               fontSize: '14px',
                                                               paddingLeft: 5,
                                                               margin: 0,
                                                               fontWeight: '400'
                                                           }}>
        {selectedProject.fechaFin}
    </span>
                                                       </p>

                                                   </div>
                                                   ): (
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
                                                       <CalendarOutlined/>

                                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                           Fecha fin:
                                                           <span style={{
                                                               fontSize: '14px',
                                                               paddingLeft: 5,
                                                               margin: 0,
                                                               fontWeight: '400'
                                                           }}>
        {selectedProject.fechaFin}
    </span>
                                                       </p>

                                                   </div>
                                               )}


                                               {selectedProject.fechaAmpliada ? (
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: 'red'
                                                   }}>
                                                       <HourglassOutlined/>
                                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                           <span> Duración: </span><span style={{
                                                           fontSize: '14px',
                                                           paddingLeft: 5,
                                                           margin: 0,
                                                           fontWeight: '400',

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
                                                   ): (
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
                                                       <HourglassOutlined/>
                                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                           <span> Duración: </span><span style={{
                                                           fontSize: '14px',
                                                           paddingLeft: 5,
                                                           margin: 0,
                                                           fontWeight: '400',

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

                                               )}

                                               {selectedProject.fechaAmpliada && (
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
                                                       <CalendarOutlined />

                                                       <p style={{ fontSize: '14px', margin: 0, fontWeight: '600' }}>
                                                           Fecha ampliada:
                                                           <span style={{
                                                               fontSize: '14px',
                                                               paddingLeft: 4,
                                                               margin: 0,
                                                               fontWeight: '400'
                                                           }}>
                {selectedProject.fechaAmpliada}
            </span>
                                                       </p>
                                                   </div>
                                               )}


                                           </div>


                                           {selectedProject.fechaAmpliada && (
                                           <div style={{
                                               display: 'flex',
                                               alignItems: 'center',
                                               gap: '8px',
                                               marginTop: 0,
                                               color: '#656f7d'
                                           }}>

                                               <HourglassOutlined/>

                                                   <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                   <span> Dias apliacion: </span><span style={{
                                                   fontSize: '14px',
                                                   paddingLeft: 5,
                                                   margin: 0,
                                                   fontWeight: '400',

                                               }}>
                                        <span style={{fontSize: '14px', paddingLeft: 5, margin: 0, fontWeight: '400'}}>
            {
                Math.ceil(
                    (new Date(selectedProject.fechaAmpliada) - new Date(selectedProject.fechaFin)) / (1000 * 60 * 60 * 24)
                )
            } días
        </span>
                                    </span>

                                               </p>



                                           </div>
                                               )}


                                       </div>

                                       <div style={{
                                           display: 'flex',
                                           flexDirection: 'column',
                                           gap: '16px',
                                           color: '#656f7d'
                                       }}>

                                           {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (
                                           <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>

                                         <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <UserOutlined/>
                                      <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                        Asignar persona:
                                      </p>
                                    </span>


                                                   <div style={{ width: 300 }}>
                                                       <Select
                                                           mode="multiple"
                                                           style={{ width: '100%' }}
                                                           placeholder="Seleccionar una opción"
                                                           value={selectedUserIds}
                                                           onChange={handleUserChange}
                                                           onBlur={handleUpdateUsers}
                                                       >
                                                           {usuarios.map(({ value, label, emoji, desc }) => (
                                                               <Option key={value} value={value}>
                                                                   <Space>
                                                                       <span role="img" aria-label={label}>{emoji}</span>
                                                                       {desc}
                                                                   </Space>
                                                               </Option>
                                                           ))}
                                                       </Select>
                                                   </div>





                                           </div>
                                           ):(
                                               <div >

                                               </div>
                                           )

                                           }

                                           <div
                                               style={{display: 'flex', alignItems: 'center', gap: '8px',width: 300}}
                                           >
                                               <FlagOutlined
                                                   style={{
                                                       fontSize: '16px',
                                                       color: 'gray' // Color predeterminado si es null
                                                   }}
                                               />
                                               <p style={{fontSize: '14px', margin: 0}}>
        <span style={{fontWeight: 600, marginRight: 5}}>
            Prioridad:
        </span>
                                                   <FlagOutlined
                                                       style={{
                                                           marginRight: 5,
                                                           fontSize: '16px',
                                                           color: selectedProject?.prioridad?.backgroundPrioridad || 'gray' // Color predeterminado si es null
                                                       }}
                                                   />
                                                   <span
                                                       style={{color: selectedProject?.prioridad?.backgroundPrioridad || 'gray'}}
                                                   >{selectedProject?.prioridad?.nombre || "Sin prioridad"}</span>
                                               </p>
                                           </div>


                                       </div>


                                   </div>

                    <div style={{marginTop: 20}}>

                        <h3 style={{borderBottom: '1px solid #f0f3f7'}}>Descripcion</h3>
                        <div> <p  style={{color:" #656f7d"}}>{selectedProject.descripcion}</p>

                        </div>
                    </div>

                    <div style={{marginTop: 20}}>


                    <Tabs defaultActiveKey="1" items={itemsTap} onChange={onChange}/>


                    </div>

                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                    <div style={{marginTop:18}}>
                                       <h3 style={{borderBottom:'1px solid #f0f3f7'}}>Ampliacion de fecha</h3>
                                       <div style={{
                                           display: 'flex',
                                           alignItems: 'center',
                                           gap: '8px',
                                           marginTop: 5,
                                           color: '#656f7d'
                                       }}>
                                       <CalendarOutlined/>

                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                           Dias:


                                       </p>
                                           <InputNumber
                                               min={1}                // Establece el valor mínimo como 1
                                               max={100}              // Establece el valor máximo como 100
                                               value={dias}           // Vincula el valor con el estado
                                               onChange={handleChangeDias} // Maneja el cambio solo para valores positivos
                                           />

                                           <Button
                                               style={{
                                                   padding: '3px 7px',
                                                   backgroundColor: '#001529',
                                                   borderRadius: 5,
                                                   color: '#ffffff',
                                                   display: 'flex',
                                                   alignItems: 'center',
                                                   border: 'none'
                                               }}
                                               onClick={() => ampliarFechaProyecto(selectedProject.id, selectedProject.fechaFin, dias)} // Usa el valor de "dias"
                                           >
                                               Aplicar
                                           </Button>

                                   </div>

                                   </div>

                    ):(
                        <div >

                        </div>
                    )

                    }
                               </div>


                           </div>


                       </Col>
        <Col span={9} style={{overflowY:"auto", height:450, paddingRight:10, backgroundColor:'#fbfbfc'}}>
                           <h2 style={{marginTop:10, marginBottom:20, marginLeft:10}}>Actividades</h2>

            <Timeline style={{ paddingLeft: 20 }} items={sortedTimelineItems.map(item => ({
                color: item.color,
                children: (
                    <span style={{display: 'flex', alignItems: 'center'}}>
            <Avatar size="small" style={{marginRight: '4px'}}>
                <UserOutlined style={{color: 'green', fontSize: '16px'}}/>
            </Avatar>
           <span
               style={{
                   color: '#4f5762',
                   fontWeight: 500,
                   fontSize: 13,
                   textDecoration: 'underline',
                   textTransform: 'lowercase'
               }}
           >
  {item.user}
</span>

            <span style={{marginRight: 6, marginLeft: 6}}>{item.action}</span>
            <span style={{color: '#4f5762', fontWeight: 500, fontSize: 13}}>
                {item.formattedDate}
            </span>
        </span>
                ),
            }))}/>
        </Col>
    </Row>

</>
                    )
                }

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

                {(modalType === 'Añadirproyecto') && (
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
                            rules={[{required: true, message: 'Por favor, selecciona una fecha'}]}
                        >
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item
                            name="fechaFin"
                            label="Fecha de Fin"
                            rules={[{required: true, message: 'Por favor, selecciona una fecha'}]}
                        >
                            <DatePicker/>
                        </Form.Item>

                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{required: true, message: 'Por favor, ingresa la descripción'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                )}
                {(modalType === 'AñadirModulo') && (
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
                            rules={[
                                {required: true, message: 'Por favor, selecciona una fecha'},
                                {
                                    validator(_, value) {
                                        // Convertimos selectedProject.fechaInicio a un objeto Date
                                        const projectStart = new Date(selectedProject.fechaInicio);

                                        // Validamos que value exista y sea mayor a projectStart
                                        if (!value || new Date(value).getTime() > projectStart.getTime()) {
                                            return Promise.resolve();
                                        }

                                        // Mensaje de error si la fecha no es posterior
                                        return Promise.reject(new Error(`La fecha inicio debe ser igual o posterior a ${projectStart.toISOString().split('T')[0]}`));
                                    },
                                },
                            ]}
                        >
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item
                            name="fechaFin"
                            label="Fecha fin"
                            rules={[
                                { required: true, message: 'Por favor, selecciona una fecha' },
                                {
                                    validator(_, value) {
                                        // Validar que value no sea nulo ni vacío
                                        if (!value) {
                                            return Promise.reject(new Error('La fecha fin es obligatoria'));
                                        }

                                        // Si selectedProject.fechaAmpliada existe, se usa como la fecha de referencia
                                        const projectStart = selectedProject.fechaAmpliada
                                            ? new Date(selectedProject.fechaAmpliada)
                                            : new Date(selectedProject.fechaFin);

                                        // Se asegura de que la fecha de fin sea posterior a la fecha de inicio + 1 día
                                        projectStart.setDate(projectStart.getDate() + 1);  // Sumar 1 día a la fecha de inicio

                                        // Comprobamos que la fecha fin proporcionada sea mayor o igual a projectStart
                                        if (new Date(value).getTime() >= projectStart.getTime()) {
                                            // Restar un día para mostrar en el mensaje de error
                                            projectStart.setDate(projectStart.getDate() - 1);

                                            return Promise.reject(
                                                new Error(`La fecha fin debe ser mayor o igual a ${projectStart.toISOString().split('T')[0]}`)
                                            );
                                        }

                                        return Promise.resolve();
                                    }

                                },
                            ]}
                        >

                        <DatePicker/>
                        </Form.Item>


                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{required: true, message: 'Por favor, ingresa la descripción'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                )}

                {modalType === 'verModulo' && selectedModule && (
                   <>


                    <Row style={{borderBottom:'1px solid #f0f3f7', paddingBottom:6}}>
                        <Col span={24}>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

                            <div>
 <span style={{
     backgroundColor: `${selectedProject.backgroundProyecto}`,
     padding: '4px 8px',
     color: '#ffffff',
     borderRadius: '4px'
 }}>
                    M
                </span>
                                <span>
                                    <BookOutlined style={{fontSize: '17px', color: '#656f7d', marginLeft: 8}}/>
                                </span>

                                <span style={{fontWeight: 600, color: '#656f7d', fontSize: '17px', marginLeft: 8}}>
                                    /
                                </span>

                                <span style={{
                                    marginLeft: 8, color: '#656f7d'

                                }}>

                    MODULO
                </span>


                            </div>

                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginRight: 30}}>




                                <div style={{display: 'flex', gap: '3px'}}>
                                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                    <Tooltip title={"Eliminar modulo"}>
                                        <Button
                                            style={{border: 'none', background: 'transparent', padding: '3px'}}
                                            onClick={() => handleDeleteModulo(selectedProject.id,selectedModule.nombre,selectedModule.id)}
                                            icon={<DeleteOutlined style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                        />
                                    </Tooltip>
                                    ):(
                                        <div >

                                        </div>
                                    )

                                    }

                                   
                                </div>
                            </div>
                        </div>

                        </Col>
                    </Row>


                       <Row>

                           <Col span={15} style={{overflowY: "auto", height: 450, paddingRight: 10}}>

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



                                           <span
                                               style={{

                                                   padding: '10px',
                                                   backgroundColor: '#f0f2f5',
                                                   borderRadius: '5px',
                                                   display: 'flex', // Usar flex para alinear el ícono y el texto
                                                   alignItems: 'flex-start', // Alinear el ícono al inicio (parte superior),
                                                   color: '#656f7d'


                                               }}
                                           >
                    <MessageOutlined
                        style={{marginRight: '8px', alignSelf: 'flex-start', color: '#656f7d'}}/>
                       <span> El estado del módulo se actualizará automáticamente a
                        <span style={{
                            background: 'linear-gradient(45deg, blue, red)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            marginRight: 5,
                            marginLeft: 5
                        }}>
    COMPLETADO
</span>
                        ,cuando todas las  tareas tengan el estado        <span style={{
                               background: 'linear-gradient(45deg, blue, red)',
                               backgroundClip: 'text',
                               color: 'transparent',
                               fontWeight: 'bold',
                               fontSize: '12px',
                               marginRight: 5,
                               marginLeft: 5
                           }}>
    COMPLETADO
</span> </span>

                    </span>
                                       </p>

                                       <div style={{
                                           display: 'flex',
                                           alignItems: 'initial',
                                           justifyContent: "space-between"
                                       }}>
                                           <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                                               <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
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
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
                                                       <CalendarOutlined/>

                                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                           Fecha inicio:
                                                           <span style={{
                                                               fontSize: '14px',
                                                               paddingLeft: 5,
                                                               margin: 0,
                                                               fontWeight: '400'
                                                           }}>
        {new Date(new Date(selectedModule.fechaInicio).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })}
    </span>
                                                       </p>
                                                   </div>
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
                                                       <CalendarOutlined/>

                                                       <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                                           Fecha fin:
                                                           <span style={{
                                                               fontSize: '14px',
                                                               paddingLeft: 5,
                                                               margin: 0,
                                                               fontWeight: '400'
                                                           }}>
        {new Date(new Date(selectedModule.fechaFin).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })}
    </span>
                                                       </p>
                                                   </div>
                                                   <div style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       marginTop: 5,
                                                       color: '#656f7d'
                                                   }}>
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

                                                   <div style={{marginTop: 20}}>

                                                       <h3 style={{borderBottom: '1px solid #f0f3f7'}}>Descripcion</h3>
                                                       <div><p
                                                           style={{color: " #656f7d"}}>{selectedModule.descripcion}</p>

                                                       </div>
                                                   </div>

                                                   <div style={{marginTop: 20}}>


                                                       <Tabs defaultActiveKey="1" items={itemsTapModulos}
                                                             onChange={onChange}/>


                                                   </div>
                                               </div>
                                           </div>


                                           <div style={{
                                               display: 'flex',
                                               flexDirection: 'column',
                                               gap: '16px',
                                               color: '#656f7d'
                                           }}>

                                               {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px',}}>
                                         <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <UserOutlined/>
                                      <p style={{fontSize: '14px', margin: 0, fontWeight: '600'}}>
                                        Asignar persona:
                                      </p>
                                    </span>

                                                <div style={{width: 300}}>

                                                    <Select
                                                        mode="multiple"
                                                        style={{width: '100%'}}
                                                        placeholder="Seleccionar una opción"
                                                        value={selectedModuloUserIds}
                                                        onChange={handleUserModuloChange}
                                                        onBlur={handleUpdateModuloUsers}
                                                    >
                                                        {usuarios.map(({value, label, emoji, desc}) => (
                                                            <Option key={value} value={value}>
                                                                <Space>
                                                                    <span role="img" aria-label={label}>{emoji}</span>
                                                                    {desc}
                                                                </Space>
                                                            </Option>
                                                        ))}
                                                    </Select>

                                                </div>
                                            </div>

                                               ):(
                                                   <div style={{width: 300}} >

                                                   </div>
                                               )

                                               }
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>

                                                <FlagOutlined
                                                    style={{
                                                        fontSize: '16px',
                                                        color: 'gray' // Color predeterminado si es null
                                                    }}
                                                />
                                                <p style={{fontSize: '14px', margin: 0}}>
        <span style={{fontWeight: 600, marginRight: 5}}>
            Prioridad:
        </span> <FlagOutlined
                                                    style={{
                                                        fontSize: '16px', marginRight: 5,
                                                        color: selectedModule?.prioridad?.backgroundPrioridad || 'gray' // Color predeterminado si es null
                                                    }}
                                                />
                                                    <span
                                                        style={{color: selectedModule?.prioridad?.backgroundPrioridad || 'gray'}}
                                                    >{selectedModule?.prioridad?.nombre || "Sin prioridad"}</span>
                                                </p>
                                            </div>

                                        </div>


                                    </div>


                                </div>

                            </div>
                        </Col>

                           <Col span={9} style={{overflowY:"auto", height:400, paddingRight:10, backgroundColor:'#fbfbfc'}}>
                            <h2 style={{marginLeft:6}}>Actividades</h2>
                               <Timeline style={{ paddingLeft: 20 }} items={sortedTimelineItemsModulo.map(item => ({
                                   color: item.color,
                                   children: (
                                       <span style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" style={{ marginRight: '4px' }}>
                <UserOutlined style={{ color: 'green', fontSize: '16px' }} />
            </Avatar>
            <span
                style={{
                    color: '#4f5762',
                    fontWeight: 500,
                    fontSize: 13,
                    textDecoration: 'underline',
                    textTransform: 'lowercase'
                }}

            >
                {item.user}
            </span>
            <span style={{ marginRight: 6, marginLeft: 6,fontSize:13 }}>{item.action}</span>
            <span style={{ color: '#4f5762', fontWeight: 600 }}>
                {item.formattedDate}
            </span>
        </span>
                                   ),
                               }))} />

                           </Col>



                    </Row>
                   </>


                )}

                {modalType === 'editarModulo' && (
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
                    </Form>
                )}

                {modalType === 'verTarea' && selectedTarea && (

<>
                    <Row style={{borderBottom:'1px solid #f0f3f7', paddingBottom:6}}>
                        <Col span={24}>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

                                <div>
                           <span style={{
                               backgroundColor: selectedProject ? selectedProject.backgroundProyecto : '#000', // Usa un color por defecto si selectedProject es null
                               padding: '4px 8px',
                               color: '#ffffff',
                               borderRadius: '4px'
                           }}>
    T
</span>
                                    <span>
                                        <BookOutlined style={{fontSize: '17px', color: '#656f7d', marginLeft: 8}}/>
                                    </span>

                                    <span style={{fontWeight: 600, color: '#656f7d', fontSize: '17px', marginLeft: 8}}>
                                    /
                                </span>

                                    <span style={{
                                        marginLeft: 8, color: '#656f7d'

                                    }}>

                        TAREA
                </span>

                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginRight: 30}}>


                                    <div style={{display: 'flex', gap: '3px'}}>
                                        {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (


                                            <Tooltip title={"Eliminar tarea"}>
                                            <Button
                                                style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                icon={<DeleteOutlined style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                onClick={() => handleDeleteTarea(selectedTarea.id,selectedTarea.nombre,selectedModule.id)}
                                            />
                                        </Tooltip>
                                        ):(
                                            <div >

                                            </div>
                                        )

                                        }

                                    </div>
                                </div>
                            </div>


                        </Col>
                    </Row>

    <Row>

        <Col span={15} style={{overflowY: "auto", height: 450, paddingRight: 10}}>

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

                    <div style={{display: 'flex', alignItems: 'initial', justifyContent: "space-between"}}>
                        <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                marginTop: 5,
                                color: '#656f7d'
                            }}>
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
                                        Fecha inicio:
                                        <span style={{
                                            fontSize: '14px',
                                            paddingLeft: 5,
                                            margin: 0,
                                            fontWeight: '400'
                                        }}>
        {new Date(new Date(selectedTarea.fechaInicio).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
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
        {new Date(new Date(selectedTarea.fechaFin).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
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

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            marginTop: 5,
                            color: '#656f7d'
                        }}>

                            {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

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
                                        style={{width: '100%'}}
                                        placeholder="Seleccionar una opción"
                                        value={selectedTareaUserIds}
                                        onChange={handleUserTareaChange}
                                        onBlur={handleUpdateTareaUsers}
                                    >
                                        {usuarios.map(({value, label, emoji, desc}) => (
                                            <Option key={value} value={value}>
                                                <Space>
                                                    <span role="img" aria-label={label}>{emoji}</span>
                                                    {desc}
                                                </Space>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            ):(
                                <div style={{width: 300}} >

                                </div>
                            )

                            }
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <FlagOutlined
                                    style={{
                                        fontSize: '16px',
                                        color: 'gray' // Color predeterminado si es null
                                    }}
                                />
                                <p style={{fontSize: '14px', margin: 0}}>
        <span style={{fontWeight: 600, marginRight: 5}}>
            Prioridad:
        </span> <FlagOutlined
                                    style={{
                                        fontSize: '16px', marginRight: 5,
                                        color: selectedTarea?.prioridad?.backgroundPrioridad || 'gray' // Color predeterminado si es null
                                    }}
                                />
                                    <span
                                        style={{color: selectedTarea?.prioridad?.backgroundPrioridad || 'gray'}}
                                    >{selectedTarea?.prioridad?.nombre || "Sin prioridad"}</span>
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
                <div style={{marginTop: 20}}>


                    <Tabs defaultActiveKey="1" items={itemsTapSubtarea} onChange={onChange}/>


                </div>

            </div>

        </Col>
        <Col span={9} style={{overflowY:"auto", height:400, paddingRight:10, backgroundColor:'#fbfbfc'}}>
            <h2 style={{marginLeft:6}}>Actividades</h2>

            <Timeline style={{ paddingLeft: 20 }} items={sortedTimelineItemsTarea.map(item => ({
                color: item.color,
                children: (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" style={{ marginRight: '4px' }}>
                <UserOutlined style={{ color: 'green', fontSize: '16px' }} />
            </Avatar>
            <span
                style={{
                    color: '#4f5762',
                    fontWeight: 500,
                    fontSize: 13,
                    textDecoration: 'underline',
                    textTransform: 'lowercase'
                }}
                >
                {item.user}
            </span>
            <span style={{ marginRight: 6, marginLeft: 6,fontSize:13 }}>{item.action}</span>
            <span style={{ color: '#4f5762', fontWeight: 600 }}>
                {item.formattedDate}
            </span>
        </span>
                ),
            }))} />
        </Col>


    </Row>


</>


                )}

                {modalType === 'editarTarea' && (
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
                    </Form>
                )}

                {modalType === 'AñadirTarea' && (
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
                            rules={[
                                {required: true, message: 'Por favor, selecciona una fecha'},
                                {
                                    validator(_, value) {
                                        // Convertimos selectedProject.fechaInicio a un objeto Date
                                        const projectStart = new Date(selectedModule.fechaInicio);

                                        // Validamos que value exista y sea mayor a projectStart
                                        if (!value || new Date(value).getTime() > projectStart.getTime()) {
                                            return Promise.resolve();
                                        }

                                        // Mensaje de error si la fecha no es posterior
                                        return Promise.reject(new Error(`La fecha inicio debe ser igual o posterior a ${projectStart.toISOString().split('T')[0]}`));
                                    },
                                },
                            ]}
                        >
                            <DatePicker/>
                        </Form.Item>


                        <Form.Item
                            name="fechaFin"
                            label="Fecha fin"
                            rules={[
                                {required: true, message: 'Por favor, selecciona una fecha'},
                                {
                                    validator(_, value) {
                                        // Convertimos selectedProject.fechaInicio a un objeto Date
                                        const projectStart = new Date(selectedModule.fechaFin);
                                        projectStart.setDate(projectStart.getDate() + 1);
                                        // Validamos que value exista y sea mayor a projectStart
                                        if (!value || new Date(value).getTime() < projectStart.getTime()) {
                                            return Promise.resolve();
                                        }
                                        projectStart.setDate(projectStart.getDate() - 1);

                                        // Mensaje de error si la fecha no es posterior
                                        return Promise.reject(new Error(`La fecha inicio debe ser menor o igual ${projectStart.toISOString().split('T')[0]}`));
                                    },
                                },
                            ]}
                        >
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{required: true, message: 'Por favor selecciona un estado'}]}
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
                            rules={[{required: true, message: 'Por favor, ingresa la descripción'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                )}


                {modalType === 'verSubtarea' && selectedsubTarea && (

                    <>
                        <Row style={{borderBottom:'1px solid #f0f3f7', paddingBottom:6}}>
                            <Col span={24}>

                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

                                    <div>
 <span style={{
     backgroundColor:  'red',

     padding: '4px 8px',
     color: '#ffffff',
     borderRadius: '4px'
 }}>
                    S
                </span>
                                        <spa>
                                            <BookOutlined style={{fontSize: '17px', color: '#656f7d', marginLeft: 8}}/>
                                        </spa>

                                        <span style={{
                                            fontWeight: 600,
                                            color: '#656f7d',
                                            fontSize: '17px',
                                            marginLeft: 8
                                        }}>
                                    /
                                </span>

                                        <span style={{
                                            marginLeft: 8, color: '#656f7d'

                                        }}>

                        SUBTAREA
                </span>

                                    </div>

                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginRight: 30}}>


                                        <div style={{display: 'flex', gap: '3px'}}>
                                            {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                            <Tooltip title={"Eliminar subtarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<DeleteOutlined
                                                        style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                    onClick={() => handleDeletesubtarea(selectedsubTarea.id,selectedsubTarea.nombre,selectedTarea.id)}
                                                />
                                            </Tooltip>

                                            ):(
                                                <div >

                                                </div>
                                            )

                                            }

                                        </div>
                                    </div>
                                </div>


                            </Col>
                        </Row>

                        <Row>
                            <Col span={15} style={{overflowY: "auto", height: 450, paddingRight: 10}}>

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

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'initial',
                                            justifyContent: "space-between"
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '16px',
                                                marginTop: 5,
                                                color: '#656f7d'
                                            }}>
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
                                                            Fecha inicio:
                                                            <span style={{
                                                                fontSize: '14px',
                                                                paddingLeft: 5,
                                                                margin: 0,
                                                                fontWeight: '400'
                                                            }}>
        {new Date(new Date(selectedsubTarea.fechaInicio).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
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
        {new Date(new Date(selectedsubTarea.fechaFin).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
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

                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                marginTop: 5,
                                                color: '#656f7d'
                                            }}>

                                                {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (
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
                                                            style={{width: '100%'}}
                                                            placeholder="Seleccionar una opción"
                                                            value={selectedSubTareaUserIds}
                                                            onChange={handleUserSubTareaChange}
                                                            onBlur={handleUpdateSubTareaUsers}
                                                        >
                                                            {usuarios.map(({value, label, emoji, desc}) => (
                                                                <Option key={value} value={value}>
                                                                    <Space>
                                                                        <span role="img"
                                                                              aria-label={label}>{emoji}</span>
                                                                        {desc}
                                                                    </Space>
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </div>

                                                </div>

                                                ):(
                                                    <div style={{width: 300}}>

                                                    </div>
                                                )

                                                }

                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    <FlagOutlined
                                                        style={{
                                                            fontSize: '16px',
                                                            color: 'gray' // Color predeterminado si es null
                                                        }}
                                                    />
                                                    <p style={{fontSize: '14px', margin: 0}}>
        <span style={{fontWeight: 600, marginRight: 5}}>
            Prioridad:
        </span> <FlagOutlined
                                                        style={{
                                                            fontSize: '16px', marginRight: 5,
                                                            color: selectedsubTarea?.prioridad?.backgroundPrioridad || 'gray' // Color predeterminado si es null
                                                        }}
                                                    />
                                                        <span
                                                            style={{color: selectedsubTarea?.prioridad?.backgroundPrioridad || 'gray'}}
                                                        >{selectedsubTarea?.prioridad?.nombre || "Sin prioridad"}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>



                                </div>

                            </Col>
                            <Col span={9} style={{overflowY:"auto", height:400, paddingRight:10, backgroundColor:'#fbfbfc'}}>
                                <h2>Actividades</h2>
                                <Timeline style={{ paddingLeft: 20 }} items={sortedTimelineItemsSubtarea.map(item => ({
                                    color: item.color,
                                    children: (
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" style={{ marginRight: '4px' }}>
                <UserOutlined style={{ color: 'green', fontSize: '16px' }} />
            </Avatar>
            <span

                style={{
                    color: '#4f5762',
                    fontWeight: 500,
                    fontSize: 13,
                    textDecoration: 'underline',
                    textTransform: 'lowercase'
                }}
                >
                {item.user}
            </span>
            <span style={{ marginRight: 6, marginLeft: 6,fontSize:13 }}>{item.action}</span>
            <span style={{ color: '#4f5762', fontWeight: 600 }}>
                {item.formattedDate}
            </span>
        </span>
                                    ),
                                }))}

                                />
                        </Col>

                    </Row>

                    </>


                )}

                {modalType === 'editarSubtarea' && (
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
                    </Form>
                )}

                {modalType === 'AñadirSubtarea' && (
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
                            rules={[
                                {required: true, message: 'Por favor, selecciona una fecha'},
                                {
                                    validator(_, value) {
                                        // Convertimos selectedProject.fechaInicio a un objeto Date
                                        const projectStart = new Date(selectedTarea.fechaInicio);

                                        // Validamos que value exista y sea mayor a projectStart
                                        if (!value || new Date(value).getTime() > projectStart.getTime()) {
                                            return Promise.resolve();
                                        }

                                        // Mensaje de error si la fecha no es posterior
                                        return Promise.reject(new Error(`La fecha inicio debe ser igual o posterior a ${projectStart.toISOString().split('T')[0]}`));
                                    },
                                },
                            ]}
                        >
                            <DatePicker/>
                        </Form.Item>

                        <Form.Item
                            name="fechaFin"
                            label="Fecha fin"
                            rules={[
                                {required: true, message: 'Por favor, selecciona una fecha'},
                                {
                                    validator(_, value) {
                                        // Convertimos selectedProject.fechaInicio a un objeto Date
                                        const projectStart = new Date(selectedTarea.fechaFin);
                                        projectStart.setDate(projectStart.getDate() + 1);

                                        // Validamos que value exista y sea mayor a projectStart
                                        if (!value || new Date(value).getTime() <= projectStart.getTime()) {
                                            return Promise.resolve();
                                        }
                                        projectStart.setDate(projectStart.getDate() - 1);
                                        // Mensaje de error si la fecha no es posterior
                                        return Promise.reject(new Error(`La fecha inicio debe ser igual o posterior a ${projectStart.toISOString().split('T')[0]}`));
                                    },
                                },
                            ]}
                        >
                            <DatePicker/>
                        </Form.Item>


                        <Form.Item
                            name="estado"
                            label="Estado"
                            rules={[{required: true, message: 'Por favor selecciona un estado'}]}
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
                            rules={[{required: true, message: 'Por favor, ingresa la descripción'}]}
                        >
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                )}

            </Modal>


        </>
    );

}

export default ProyectoList;
