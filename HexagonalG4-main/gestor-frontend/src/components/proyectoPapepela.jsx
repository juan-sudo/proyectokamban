import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useN
import _ from 'lodash';
import dayjs from 'dayjs';
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
    Space, Spin, Timeline,InputNumber,Tabs,Divider,
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
    DeleteOutlined,
    InboxOutlined,
    FolderOpenOutlined,
    ReloadOutlined


} from '@ant-design/icons';

const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];


function ProyectoListPapelera() {
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
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const [usuarioActivo, setUsuarioActivo] = useState(null); // default is 'middle'




    useEffect(() => {
        // Actualizar el estado de autenticación si el token cambia
        if (token) {
            setIsAuthenticated(true);
            fetchProyectos(token);
            fetchUsuario(token);
            fetchPrioridad(token);
            fetchUsuarioAutenticado(token);
        } else {
            setIsAuthenticated(false);
        }
    }, [token]);

    // Función para truncar el texto
    const truncateText = (text) => {
        return _.truncate(text, {
            length: 40, // Longitud máxima (incluye los puntos suspensivos)
            separator: ' '
        });
    };


    //pPARA SEEÑCT

    // Define los elementos del menú
// Componente CustomDropdown



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


    // FILTRAR USUARIO de SUBTAREA
    useEffect(() => {
        if (selectedsubTarea && selectedsubTarea.usuarios) {
            const userIds = selectedsubTarea.usuarios.map(user => user.id);
            console.log("usuariros de tarea:::: "+userIds);
            setSelectedSubTareaUserIds(userIds);


        } else {

            setSelectedSubTareaUserIds([]);

        }
    }, [selectedsubTarea]);

    //USARIO AUTENTICADO

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


    //ACTUALIZR ESTADO DEL PROYECTO

    const actualizarEstadoProyecto = async (id, nombreProyecto) => {
        // Muestra una alerta de confirmación
        const result = await Swal.fire({
            title: '¿Desea restaurar este proyecto?',
            text: `Está a punto de restaurar "${nombreProyecto}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, restaurar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.patch(
                    `${backendUrl}/api/proyectos/${id}/restaurar-papelera`,
                    null
                    , {
                        headers: {
                            'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                        }
                    }

                );

                if (response.data.mensaje) {
                    console.log('Mensaje del servidor:', response.data.mensaje);

                    // Muestra el mensaje de confirmación en una alerta de éxito
                    await Swal.fire({
                        icon: 'success',
                        title: 'Restaurado',
                        text: response.data.mensaje,
                        confirmButtonText: 'Aceptar'
                    });

                    // Aquí eliminamos el proyecto de la lista
                    setProyectos((prevProyectos) => prevProyectos.filter(proyecto => proyecto.id !== id));
                }
            } catch (error) {
                console.error('Error al actualizar el estado del proyecto:', error);

                // Muestra un mensaje de error si la solicitud falla
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo restaurar el proyecto. Inténtalo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };


// drop dow para restaurar

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


    const handleChange = async (value, projectId) => {
        if (value === 'none') {
            setSelectedOption(null);

            // Aquí llamas a la API para establecer la prioridad a null
            try {
                const response = await axios.get(`${backendUrl}/api/proyectos/eliminados`)
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos();
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            setSelectedOption(selected);

            try {
                // Usa el ID del proyecto y el ID de prioridad
                const response = await axios.put(`http://localhost:8080/api/proyectos/${projectId}/prioridad/${selected.value}`);
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos();
            } catch (error) {
                console.error("Error al actualizar la prioridad:", error);
            }
        }
        setEditingId(null); // Cambiar aquí para finalizar la edición
    };


    const handleChangeModulo = async (value, moduloId, proyectoId) => {
        if (value === 'none') {
            setSelectedOptionModulo(null);

            // Aquí llamas a la API para establecer la prioridad a null
            try {
                const response = await axios.put(`http://localhost:8080/api/proyectos/${proyectoId}/modulos/${moduloId}/prioridad`);
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos();
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            setSelectedOptionModulo(selected);

            try {
                const response = await axios.put(`http://localhost:8080/api/proyectos/${proyectoId}/modulos/${moduloId}/prioridad/${selected.value}`);
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos();
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
                const response = await axios.put(`http://localhost:8080/api/tareas/${tareaId}/subTareas/${subtareaId}/prioridad`);
                //http://localhost:8080/api/tareas/1/subTareas/1/prioridad
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos();
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            setSelectedOptionSubtarea(selected);

            try {
                const response = await axios.put(`http://localhost:8080/api/tareas/${tareaId}/subTareas/${subtareaId}/prioridad/${selected.value}`);
                ////http://localhost:8080/api/tareas/1/subTareas/1/prioridad
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos();
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
                const response = await axios.put(`http://localhost:8080/api/modulos/${moduloId}/tareas/${tareaId}/prioridad`);
                //http://localhost:8080/api/modulos/1/tareas/1/prioridad
                console.log("Prioridad actualizada a null:", response.data);
                await fetchProyectos();
            } catch (error) {
                console.error("Error al actualizar la prioridad a null:", error);
            }
        } else {
            const selected = prioridad.find(option => option.value === value);
            setSelectedOptionTarea(selected);

            try {
                const response = await axios.put(`http://localhost:8080/api/modulos/${moduloId}/tareas/${tareaId}/prioridad/${selected.value}`);
                //http://localhost:8080/api/modulos/1/tareas/1/prioridad/1
                console.log("Prioridad actualizada:", response.data);
                await fetchProyectos();
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
                setProyectos((prevProyectos) => prevProyectos.filter(proyecto => proyecto.id !== id));

                // Muestra un mensaje de éxito
                Swal.fire('Archivado', 'El proyecto ha sido archivado.', 'success');

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
        try {
            const response = await axios.get(
                `${backendUrl}/api/proyectos/eliminados`
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
            }
        } catch (error) {
            console.error("Error al obtener proyectos:", error);
        }
    };

// OBTENER  USUARIOS

    const fetchUsuario = async (token) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/usuarios`
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                }

            );
            if (Array.isArray(response.data)) {
                const usuarioValor = response.data.map(usuario => ({
                    label: usuario.nombres,
                    value: usuario.id,
                    emoji:  <Avatar style={{ backgroundColor: usuario.backgroundUser }}
                                    size={20}
                                    icon={<UserAddOutlined />} />,
                    desc: usuario.nombres+" "+usuario.apellidoPaterno+" "+usuario.apellidoMaterno,
                }));
                setUsuario(usuarioValor);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            //message.error('No se pudieron cargar las personas.');
        }
    };

    const fetchPrioridad = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/prioridad`
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Aquí se agrega el token en el encabezado
                    }
                }
            );
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
                await axios.delete(`http://localhost:8080/api/proyectos/${selectedProject.id}/usuarios/${userId}`);
                // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);
                await fetchProyectos();

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
            await axios.put(`http://localhost:8080/api/proyectos/${selectedProject.id}/usuarios`, selectedUserIds);
            //message.success('Usuarios actualizados correctamente');
            // Actualizar el estado del proyecto para reflejar los usuarios asignados
            // Vuelve a obtener todos los proyectos para reflejar los cambios
            await fetchProyectos();

            const updatedUsuarios = usuarios
                .filter(persona => selectedUserIds.includes(persona.value))
                .map(persona => ({ id: persona.value, nombres: persona.label }));

            setSelectedProject(prevProject => ({
                ...prevProject,
                usuarios: updatedUsuarios
            }));
        } catch (error) {
            message.error('Error al actualizar los usuarios');
            console.error('Error:', error);
        }
    };




//eliminar USUARIO de MODULO
    const handleUserModuloChange = (newUserIds) => {
        const removedUserIds = selectedModuloUserIds.filter(id => !newUserIds.includes(id));

        removedUserIds.forEach(async (userId) => {
            try {
                await axios.delete(`http://localhost:8080/api/proyectos/${selectedProject.id}/modulos/${selectedModule.id}/usuarios/${userId}`);
                //http://localhost:8080/api/proyectos/1/modulos/2/usuarios/5
                // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);

                await fetchProyectos();

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

            await axios.put(`http://localhost:8080/api/proyectos/${selectedProject.id}/modulos/${selectedModule.id}/usuarios`, selectedModuloUserIds);

            await fetchProyectos();

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
                await axios.delete(`http://localhost:8080/api/modulos/${selectedModule.id}/tareas/${selectedTarea.id}/usuarios/${userId}`);

                //http://localhost:8080/api/modulos/2/tareas/1/usuarios/4
                // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);

                await fetchProyectos();

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
            await axios.put(`http://localhost:8080/api/modulos/${selectedModule.id}/tareas/${selectedTarea.id}/usuarios`, selectedTareaUserIds);

            ////http://localhost:8080/api/modulos/2/tareas/1/usuarios

            // /api/proyectos/{proyectoId}/modulos/{id}/usuarios
            //message.success('Usuarios actualizados correctamente');
            // Actualizar el estado del proyecto para reflejar los usuarios asignados
            // Vuelve a obtener todos los proyectos para reflejar los cambios
            await fetchProyectos();

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
                await axios.delete(`http://localhost:8080/api/tareas/${selectedTarea.id}/subTareas/${selectedsubTarea.id}/usuarios/${userId}`);

                //http://localhost:8080/api/tareas/4/subTareas/4/usuarios/4


                await fetchProyectos();

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
            await axios.put(`http://localhost:8080/api/tareas/${selectedTarea.id}/subTareas/${selectedsubTarea.id}/usuarios`, selectedSubTareaUserIds);

            //http://localhost:8080/api/tareas/4/subTareas/4/usuarios


            await fetchProyectos();

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
                const modulo = proyecto.modulos.find(m => m.id === moduloId);

                // Si se encuentra el módulo, actualiza el estado con ese módulo
                if (modulo) {
                    setSelectedModule(modulo)
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
            }

            else if (modalType === 'subtarea') {
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
        });
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

            <Row gutter={[16, 16]}
                 style={{


                     minWidth: '600px',
                     transition: 'background-color 0.3s ease',

                     color:'#656f7d',
                     fontSize:'12px'

                 }}>
                <Col span={24} style={{ padding: '16px', fontSize:23 }}>

                    <apan>Proyectos Eliminado</apan>
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
                        <Col span={9}
                        >
                            <div>Nombre de proyecto</div>
                        </Col>
                        <Col span={4}>
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
                        <Col span={2}>
                            <div className="task-item__due-date">Prioridad</div>
                        </Col>
                        <Col span={3}>
                            <div className="task-item__due-date">Accion</div>
                        </Col>
                    </Row>


                    {proyectos.map((row) => (
                        <React.Fragment key={row.id}>
                            <Row
                                gutter={[16, 16]}
                                style={{
                                    borderBottom: '1px solid rgba(217, 217, 217, 0.4)',
                                    cursor:"pointer",
                                    minWidth: '600px',
                                    transition: 'background-color 0.3s ease',
                                    backgroundColor: hoveredRow === row.id ? '#f7f2f2' : '',
                                    color:'#2a2e34'
                                }}

                                onMouseEnter={() => handleMouseEnter(row.id)}
                                onMouseLeave={handleMouseLeave}

                            >
                                <Col span={9}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button
                                            type="text"
                                            size="small"
                                            onClick={() => toggleCollapseProyecto(row.id)}
                                            icon={expandedRows[row.id] ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                        />
                                        <FolderOutlined
                                            style={{
                                                backgroundColor: row.backgroundProyecto,
                                                color: 'black',
                                                padding: '5px',
                                                borderRadius: '50%',
                                                border: '2px solid black',
                                            }}
                                        />
                                        <Tooltip title="Ver proyecto">
                                            <a
                                                style={{
                                                    marginLeft: 5,
                                                    fontWeight: 500,
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    fontSize: 14,
                                                    transition: 'color 0.3s', // Añade una transición suave
                                                }}
                                                onClick={() => showModal('verProyecto', row.id)}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = '#534dc9')} // Cambia el color al pasar el mouse
                                                onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')} // Restaura el color al salir
                                            >
                                                {row.nombre}
                                            </a>
                                        </Tooltip>
                                        {expandedRows[row.id] && (
                                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight:5 }}>



                                                <Button
                                                    style={{
                                                        color: '#656f7d',
                                                        backgroundColor: 'transparent', // Color de fondo predeterminado
                                                        transition: 'background-color 0.3s',
                                                        paddingLeft:20
                                                        // Suave transición
                                                    }}
                                                    icon={<PlusOutlined />}
                                                    size="small"
                                                    type="link"
                                                    onClick={() => showModal('AñadirModulo', row.id)}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dce0e8'; // Cambia el color de fondo al pasar el mouse
                                                        e.currentTarget.style.color = '#000000'; // Cambia el color del texto si es necesario
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent'; // Restaura el color de fondo al salir
                                                        e.currentTarget.style.color = '#656f7d'; // Restaura el color del texto
                                                    }}
                                                    disabled
                                                >

                                                </Button>



                                            </div>
                                        )}
                                    </div>
                                </Col>




                                <Col span={4}>
                                    {/* Generar avatares de los usuarios del proyecto */}
                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: '22px', width: '30px', paddingTop:10 }}> {/* Reduce la altura aquí */}
                                        {row.usuarios.length > 0 ? (
                                            row.usuarios.map((usuario, index) => {
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







                                <Col style={{paddingTop: '8px', paddingLeft: 10, color: '#055706'}}
                                     span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 0,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {row.fechaInicio} < /span>


                                </Col>

                                <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                     span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 0,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {row.fechaFin} < /span>


                                </Col>
                                <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                     span={2}>

                                                        <span style={{
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            margin: 0,
                                                            fontWeight: '400'
                                                        }}>
                                                                <CalendarOutlined/>
                                                          < /span>


                                </Col>

                                <Col span={2} style={{ display: 'flex', alignItems: 'center' }}
                                     onMouseEnter={() => handleMouseEnter(row.id)}
                                     onMouseLeave={handleMouseLeave}
                                     onDoubleClick={() => handleDoubleClick(row.id)}>

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
                                            disabled
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
                                        <span style={{ cursor: 'pointer' }} onDoubleClick={() => handleDoubleClick(row.id)}>
            {row.prioridad ? (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: row.prioridad.backgroundPrioridad }} />
                    {row.prioridad.nombre}
                </Space>
            ) : (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: 'gray' }} />
                </Space>
            )}
        </span>
                                    )}
                                </Col>

                                <Col key={row.id} span={3}>
                                    {usuarioActivo && usuarioActivo.rolesNames && (usuarioActivo.rolesNames.includes("GESTOR") || usuarioActivo.rolesNames.includes("ADMINISTRADOR")) ? (

                                        <Space direction="horizontal" style={{ border: 'none', marginBottom:0    }}>
                                        <Button


                                            onClick={() => actualizarEstadoProyecto(row.id, row.nombre)}
                                        >
                                            <span style={{fontSize:12}}>
                                                 Restaurar
                                            </span>

                                        </Button>
                                    </Space>
                                    ):(
                                        <div >

                                        </div>
                                    )

                                    }
                                </Col>





                            </Row>



                            {/* Mostrar los módulos debajo del proyecto */}
                            {expandedRows[row.id] && row.modulos?.map((modulo) => (
                                <React.Fragment key={modulo.id}>
                                    <Row
                                        style={{
                                            borderBottom: '1px solid rgba(217, 217, 217, 0.3)' ,
                                            marginLeft: '20px',
                                            cursor: 'pointer',
                                            minWidth: '600px',
                                            backgroundColor: hoveredRowmodulo === modulo.id ? '#f7f2f2' : '',
                                        }}
                                        onMouseEnter={() => handleMouseEntermodulo(modulo.id)}
                                        onMouseLeave={handleMouseLeavemodulo}

                                    >
                                        <Col span={9}>
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
                                                        backgroundColor: row.backgroundProyecto,
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

                                                <div
                                                    style={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>

                                                    <Tooltip title="kamban">
                                                        <Button
                                                            icon={<InsertRowBelowOutlined/>}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => handleButtonClick(row.id, modulo.id)}  // Redirige al hacer clic
                                                            disabled
                                                            style={{marginLeft: 'auto'}}
                                                        />
                                                    </Tooltip>
                                                    {/* Mostrar el botón solo si el módulo está expandido */}
                                                    {!expandedModules[modulo.id] && (
                                                        <Button
                                                            style={{
                                                                color: '#656f7d',
                                                                backgroundColor: 'transparent', // Color de fondo predeterminado
                                                                transition: 'background-color 0.3s' // Suave transición
                                                                ,marginRight:15,

                                                            }}
                                                            icon={<PlusOutlined />}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => showModal('AñadirTarea',row.id, modulo.id)}
                                                            disabled
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

                                                    )}


                                                </div>

                                            </div>
                                        </Col>


                                        <Col span={4}>
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
                                        <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                             span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 5,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {modulo.fechaInicio} < /span>


                                        </Col>
                                        <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                             span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 5,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {modulo.fechaFin} < /span>


                                        </Col>
                                        <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                             span={2}>

                                                        <span style={{
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            margin: 0,
                                                            fontWeight: '400'
                                                        }}>
                                                                <CalendarOutlined/>
                                                          < /span>


                                        </Col>

                                        <Col span={2} style={{ display: 'flex', alignItems: 'center' }}

                                             onMouseLeave={handleMouseLeave}
                                             onDoubleClick={(e) => {
                                                 e.stopPropagation(); // Detener la propagación del evento
                                                 handleDoubleClickModulo(modulo.id);
                                             }}>
                                            {editingModuloId === modulo.id ? (
                                                <Select
                                                    style={{
                                                        width: '100%',
                                                        boxShadow: 'none',
                                                        transition: 'background-color 0.3s ease, border 0.3s ease',
                                                        marginLeft:10
                                                    }}
                                                    //className={`custom-select ${hoveredRow === modulo.id ? 'hovered-bg' : ''}`}
                                                    value={selectedOptionModulo ? selectedOptionModulo.value : 'none'}
                                                    onChange={(value) => handleChangeModulo(value, modulo.id,row.id)} // Pasar el ID del proyecto
                                                    onBlur={() => setEditingModuloId(null)} // Cambiar aquí
                                                    suffixIcon={null}
                                                    showArrow={false}
                                                    showSearch={false}
                                                    size="small"
                                                    disabled
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
                                                        disabled
                                                    </Option>
                                                </Select>

                                            ) : (
                                                <span style={{ cursor: 'pointer', marginLeft:10 }} onDoubleClick={() => handleDoubleClickModulo(modulo.id)}>
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
                                    {expandedModules[`${row.id}-${modulo.id}`] && modulo.tareas?.map((tarea) => (
                                        <React.Fragment key={tarea.id}>
                                            <Row
                                                style={{
                                                    marginLeft: '20px',
                                                    padding:0,
                                                    paddingBottom:6 ,
                                                    borderBottom: '1px solid rgba(217, 217, 217, 0.3)' ,
                                                    cursor: 'pointer',
                                                    backgroundColor: hoveredRowtarea === tarea.id ? '#f7f2f2' : '',
                                                    boxSizing: 'border-box', // Para incluir padding y border en el tamaño

                                                }}

                                                onMouseEnter={() => handleMouseEntertarea(tarea.id)}
                                                onMouseLeave={handleMouseLeavetarea}
                                            >
                                                <Col span={9} style={{ display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
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
                                                        backgroundColor: row.backgroundProyecto,
                                                        color: 'black',
                                                        marginTop: '7px',
                                                        fontSize:19,
                                                        marginRight: '4px' // Espacio entre el icono y el texto
                                                    }} />


                                                    <Tooltip title={tarea.nombre}>
                                                        <a

                                                            style={{

                                                                marginLeft: 5,

                                                                textDecoration: 'none',
                                                                color: 'inherit',
                                                                paddingTop:6
                                                            }}
                                                            onClick={() => showModal('verTarea', row.id, modulo.id, tarea.id)}

                                                        >

                                                            {truncateText(tarea.nombre)} {/* Usa la función aquí */}
                                                        </a>
                                                    </Tooltip>
                                                    <Tooltip title="kamban">
                                                        <Button
                                                            icon={<InsertRowBelowOutlined />}
                                                            size="small"
                                                            type="link"
                                                            onClick={() => handleButtonClickSub(row.id,modulo.id,tarea.id)}  // Redirige al hacer clic
                                                            style={{ marginLeft: 'auto', paddingRight:10 , paddingTop:6}}
                                                            disabled
                                                        />
                                                    </Tooltip>

                                                    <Button
                                                        style={{
                                                            color: '#656f7d',
                                                            backgroundColor: 'transparent', // Color de fondo predeterminado
                                                            transition: 'background-color 0.3s' // Suave transición
                                                            ,marginRight:15,

                                                        }}
                                                        icon={<PlusOutlined />}
                                                        size="small"
                                                        type="link"
                                                        onClick={() => showModal('AñadirSubtarea', row.id, modulo.id, tarea.id)}
                                                        disabled
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


                                                </Col>


                                                <Col span={4}>
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
                                                <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                                     span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 5,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {tarea.fechaInicio} < /span>


                                                </Col>

                                                <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                                     span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 5,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {tarea.fechaFin} < /span>


                                                </Col>
                                                <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                                     span={2}>

                                                        <span style={{
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            margin: 0,
                                                            fontWeight: '400'
                                                        }}>
                                                                <CalendarOutlined/>
                                                          < /span>


                                                </Col>
                                                <Col span={2} style={{ display: 'flex', alignItems: 'center' }}

                                                     onMouseLeave={handleMouseLeave}
                                                     onDoubleClick={(e) => {
                                                         e.stopPropagation(); // Detener la propagación del evento
                                                         handleDoubleClickTarea(tarea.id);
                                                     }}>
                                                    {editingTareaId === tarea.id ? (
                                                        <Select
                                                            style={{
                                                                width: '100%',
                                                                boxShadow: 'none',
                                                                transition: 'background-color 0.3s ease, border 0.3s ease',
                                                                marginLeft:10
                                                            }}
                                                            //className={`custom-select ${hoveredRow === modulo.id ? 'hovered-bg' : ''}`}
                                                            value={selectedOptionTarea ? selectedOptionTarea.value : 'none'}
                                                            onChange={(value) => handleChangeTarea(value, modulo.id,tarea.id)} // Pasar el ID del proyecto
                                                            onBlur={() => setEditingTareaId(null)} // Cambiar aquí
                                                            suffixIcon={null}
                                                            showArrow={false}
                                                            showSearch={false}
                                                            size="small"
                                                            disabled
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
                                                        <span style={{ cursor: 'pointer', marginLeft:10 }} onDoubleClick={() => handleDoubleClickTarea(tarea.id)}>
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


                                            {expandedTasks[`${row.id}-${modulo.id}-${tarea.id}`] && tarea.subtareas?.map((subtarea) => (
                                                <Row key={subtarea.id}
                                                     style={{
                                                         marginLeft: '20px',
                                                         padding:0,
                                                         paddingBottom:6 ,
                                                         borderBottom: '1px solid rgba(217, 217, 217, 0.3)' ,
                                                         cursor: 'pointer',
                                                         backgroundColor: hoveredRowsubtarea === subtarea.id ? '#f7f2f2' : '',
                                                         boxSizing: 'border-box', // Para incluir padding y border en el tamaño
                                                     }}

                                                     onMouseEnter={() => handleMouseEntersubtarea(subtarea.id)}
                                                     onMouseLeave={handleMouseLeavesubtarea}

                                                >

                                                    <Col span={9} style={{ display: 'flex', alignItems: 'center', paddingLeft:50 }}>
                                                        <div style={{
                                                            marginTop:6,
                                                            width: '20px', // Ajusta el tamaño del círculo
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: row.backgroundProyecto, // Cambia el color según tus necesidades
                                                            marginRight: '8px' // Espacio entre el círculo y el texto
                                                        }}>

                                                        </div>
                                                        <Tooltip title= {subtarea.nombre}>
                                                            <a

                                                                style={{
                                                                    paddingTop:6,
                                                                    marginLeft: 5,

                                                                    textDecoration: 'none',
                                                                    color: 'inherit'
                                                                }}
                                                                onClick={() => showModal('verSubtarea', row.id, modulo.id, tarea.id, subtarea.id)}
                                                            >


                                                                {truncateText(subtarea.nombre)}
                                                            </a>
                                                        </Tooltip>
                                                        {/* Elimina el margen superior e inferior del párrafo */}
                                                    </Col>


                                                    <Col span={4}>
                                                        {/* Generar avatares de los usuarios del proyecto */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            position: 'relative',
                                                            height: '22px',
                                                            width: '30px',
                                                            paddingTop: 10
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
                                                                <Tooltip title="Agregar persona">
                                                                    <Avatar
                                                                        size={27}
                                                                        icon={<UserAddOutlined/>}/>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                                         span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 5,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {subtarea.fechaInicio} < /span>


                                                    </Col>


                                                    <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                                         span={2}>

                                                    <span style={{
                                                        fontSize: '14px',
                                                        paddingLeft: 5,
                                                        margin: 0,
                                                        fontWeight: '400'
                                                    }}>
                                                     {subtarea.fechaFin} < /span>


                                                    </Col>
                                                    <Col style={{paddingTop: '8px', paddingLeft: 4, color: '#055706'}}
                                                         span={2}>

                                                        <span style={{
                                                            fontSize: '14px',
                                                            paddingLeft: 0,
                                                            margin: 0,
                                                            fontWeight: '400'
                                                        }}>
                                                                <CalendarOutlined />
                                                          < /span>


                                                    </Col>
                                                    <Col span={2} style={{ display: 'flex', alignItems: 'center' }}

                                                         onMouseLeave={handleMouseLeave}
                                                         onDoubleClick={(e) => {
                                                             e.stopPropagation(); // Detener la propagación del evento
                                                             handleDoubleClickSubtarea(subtarea.id);
                                                         }}>
                                                        {editingSubtareaId === subtarea.id ? (
                                                            <Select
                                                                style={{
                                                                    width: '100%',
                                                                    boxShadow: 'none',
                                                                    transition: 'background-color 0.3s ease, border 0.3s ease',
                                                                    marginLeft:10
                                                                }}
                                                                //className={`custom-select ${hoveredRow === modulo.id ? 'hovered-bg' : ''}`}
                                                                value={selectedOptionSubtarea ? selectedOptionSubtarea.value : 'none'}
                                                                onChange={(value) => handleChangeSubtarea(value, tarea.id,subtarea.id)} // Pasar el ID del proyecto
                                                                onBlur={() => setEditingSubtareaId(null)} // Cambiar aquí
                                                                suffixIcon={null}
                                                                showArrow={false}
                                                                showSearch={false}
                                                                size="small"
                                                                disabled
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
                                                            <span style={{ cursor: 'pointer', marginLeft:10 }} onDoubleClick={() => handleDoubleClickSubtarea(subtarea.id)}>
            {subtarea.prioridad ? (
                <Space>
                    <FlagOutlined style={{ fontSize: '16px', color: subtarea.prioridad.backgroundPrioridad }} />
                    {subtarea.prioridad.nombre}
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
                style={{
                    top: 20,
                }}
                title={
                    modalType === 'verProyecto' ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>

                              </span>
                        ) :
                        modalType === 'editarProyecto' ? 'Editar Proyecto' :
                            modalType === 'Añadirproyecto' ? 'Crear Proyecto' :
                                modalType === 'verModulo' ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>

                            </span>
                                    ):
                                    modalType === 'editarModulo' ? 'Editar Módulo' :
                                        modalType === 'AñadirModulo' ? 'Crear Módulo' :
                                            modalType === 'editarProyecto' ? 'Editar Proyecto' :
                                                modalType === 'Añadirproyecto' ? 'Crear Proyecto' :
                                                    modalType === 'verTarea' ? (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>

                            </span>
                                                        ):

                                                        modalType === 'editarTarea' ? 'Editar Tarea' :
                                                            modalType === 'AñadirTarea' ? 'Crear Tarea':
                                                                modalType === 'verSubtarea' ? (
                                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px'  }}>

                            </span>
                                                                    ):

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
                width={modalType === 'verProyecto'|| modalType === 'verModulo' ||modalType==='verTarea'||modalType==='verSubtarea'? 1200 : undefined}
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
                                            <span style={{marginLeft: 8, color: '#656f7d'}}>PROYECTO</span>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginRight: 30}}>
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
                                                    disabled
                                                >
                                                    Archivar
                                                </Button>

                                            </Tooltip>
                                            <Divider type="vertical"/>


                                            <div style={{display: 'flex', gap: '3px'}}>

                                                <Tooltip title={"Eliminar proyecto"}>
                                                    <Button
                                                        style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                        icon={<DeleteOutlined style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                        disabled
                                                    />
                                                </Tooltip>

                                                <Tooltip title={"Copiar proyecto"}>
                                                    <Button
                                                        style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                        icon={<CopyOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                        disabled
                                                    />
                                                </Tooltip>

                                                <Tooltip title={"Calificar proyecto"}>
                                                    <Button
                                                        style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                        icon={<StarOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                        disabled
                                                    />
                                                </Tooltip>

                                                <Tooltip title={"Mas opciones"}>
                                                    <Button
                                                        style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                        icon={<MoreOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                        disabled
                                                    />
                                                </Tooltip>
                                            </div>
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
        {new Date(new Date(selectedProject.fechaInicio).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
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
        {new Date(new Date(selectedProject.fechaFin).toISOString().slice(0, -1)).toLocaleDateString('es-ES', {
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


                                                    </div>


                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '16px',
                                                    color: '#656f7d'
                                                }}>

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
                                                                value={selectedUserIds}
                                                                onChange={handleUserChange}
                                                                onBlur={handleUpdateUsers}
                                                                disabled
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



                                                <Tabs defaultActiveKey="1" items={itemsTap} onChange={onChange}/>


                                            </div>


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
                                                        min={0}               // Establece un valor mínimo, opcional
                                                        max={100}             // Establece un valor máximo, opcional
                                                        defaultValue={1}
                                                        readOnly={true}// Valor inicial
                                                        onChange={(value) => console.log(value)} // Maneja cambios en el valor
                                                    />

                                                </div>

                                            </div>


                                        </div>


                                    </div>

                                </Col>
                                <Col span={9} style={{overflowY:"auto", height:450, paddingRight:10, backgroundColor:'#fbfbfc'}}>
                                    <h2 style={{marginTop:10, marginBottom:20}}>Actividades</h2>
                                    <Timeline style={{ paddingLeft: 20 }} items={sortedTimelineItems.map(item => ({
                                        color: item.color,
                                        children: (
                                            <span style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" style={{ marginRight: '4px' }}>
                <UserOutlined style={{ color: 'green', fontSize: '16px' }} />
            </Avatar>
            <span style={{ color: '#4f5762', fontWeight: 600,fontSize:13,textDecoration: 'underline' }}>
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
                                {required: true, message: 'Por favor, selecciona una fecha'},
                                {
                                    validator(_, value) {
                                        // Convertimos selectedProject.fechaInicio a un objeto Date
                                        const projectStart = new Date(selectedProject.fechaFin);
                                        projectStart.setDate(projectStart.getDate() + 1);
                                        // Validamos que value exista y sea mayor a projectStart
                                        if (!value || new Date(value).getTime() < projectStart.getTime()) {
                                            return Promise.resolve();
                                        }
                                        projectStart.setDate(projectStart.getDate() - 1);

                                        // Mensaje de error si la fecha no es posterior
                                        return Promise.reject(new Error(`La fecha fin debe ser menor o igual ${projectStart.toISOString().split('T')[0]}`));
                                    },
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
                                        <spa>
                                            <BookOutlined style={{fontSize: '17px', color: '#656f7d', marginLeft: 8}}/>
                                        </spa>

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

                                            <Tooltip title={"Eliminar modulo"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<DeleteOutlined style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Copiar modulo"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<CopyOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Calificar modulo"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<StarOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Mas opciones"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<MoreOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>
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
                                            <MessageOutlined
                                                style={{marginRight: '8px', alignSelf: 'flex-start'}}/>
                                            {selectedModule.descripcion}
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


                                                        <Tabs defaultActiveKey="1" items={itemsTapModulos} onChange={onChange}/>


                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                color: '#656f7d'
                                            }}>


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
                                                            disabled
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
                                <h2>Actividades</h2>
                                <Timeline style={{paddingLeft: 20}}
                                          items={[

                                              {
                                                  color:'green',
                                                  children: (
                                                      <span style={{display: 'flex', alignItems: 'center'}}>
                <Avatar size="small" style={{marginRight: '4px'}}>
                    <UserOutlined
                        style={{color: 'green', fontSize: '16px'}}/> {/* Icono de usuario dentro del Avatar */}
                </Avatar>
                <span style={{color: '#4f5762', fontWeight: 600}}>
                    {`${selectedModule.userCreate}`} {/* Texto de usuario en negro */}
                </span>
                   <span style={{marginRight: 6, marginLeft: 6}}>creo</span>
               <span style={{color: '#4f5762', fontWeight: 600}}>
    {` ${dayjs(selectedModule.createAt).format('YYYY-MM-DD HH:mm:ss')}`} {/* Texto adicional */}
</span>
            </span>
                                                  ),
                                              },

                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                          ]}

                                />
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
                                    backgroundColor: `${selectedProject.backgroundProyecto}`,
                                    padding: '4px 8px',
                                    color: '#ffffff',
                                    borderRadius: '4px'
                                }}>
                    T
                </span>
                                        <spa>
                                            <BookOutlined style={{fontSize: '17px', color: '#656f7d', marginLeft: 8}}/>
                                        </spa>

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

                                            <Tooltip title={"Eliminar tarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<DeleteOutlined style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Copiar tarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<CopyOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Calificar tarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<StarOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Mas opciones"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<MoreOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>
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
                                                            disabled
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
                                <h2>Actividades</h2>
                                <Timeline style={{paddingLeft: 20}}
                                          items={[

                                              {
                                                  color: 'green',
                                                  children: (
                                                      <span style={{display: 'flex', alignItems: 'center'}}>
                <Avatar size="small" style={{marginRight: '4px'}}>
                    <UserOutlined
                        style={{color: 'green', fontSize: '16px'}}/> {/* Icono de usuario dentro del Avatar */}
                </Avatar>
                <span style={{color: '#4f5762', fontWeight: 600}}>
                    {`${selectedTarea.userCreate}`} {/* Texto de usuario en negro */}
                </span>
                   <span style={{marginRight: 6, marginLeft: 6}}>creo</span>
               <span style={{color: '#4f5762', fontWeight: 600}}>
    {` ${dayjs(selectedTarea.createAt).format('YYYY-MM-DD HH:mm:ss')}`} {/* Texto adicional */}
</span>
            </span>
                                                  ),
                                              },

                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                          ]}
                                />
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
     backgroundColor: `${selectedProject.backgroundProyecto}`,
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

                                            <Tooltip title={"Eliminar subtarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<DeleteOutlined
                                                        style={{fontSize: '17px', color: '#ff4d4f'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Copiar subtarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<CopyOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Calificar subtarea"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<StarOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>

                                            <Tooltip title={"Mas opciones"}>
                                                <Button
                                                    style={{border: 'none', background: 'transparent', padding: '3px'}}
                                                    icon={<MoreOutlined style={{fontSize: '17px', color: '#656f7d'}}/>}
                                                    disabled
                                                />
                                            </Tooltip>
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
                                                            disabled
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
                                <Timeline style={{paddingLeft: 20}}
                                          items={[

                                              {
                                                  color: 'green',
                                                  children: (
                                                      <span style={{display: 'flex', alignItems: 'center'}}>
                <Avatar size="small" style={{marginRight: '4px'}}>
                    <UserOutlined
                        style={{color: 'green', fontSize: '16px'}}/> {/* Icono de usuario dentro del Avatar */}
                </Avatar>
                <span style={{color: '#4f5762', fontWeight: 600}}>
                    {`${selectedsubTarea.userCreate}`} {/* Texto de usuario en negro */}
                </span>
                   <span style={{marginRight: 6, marginLeft: 6}}>creo</span>
               <span style={{color: '#4f5762', fontWeight: 600}}>
    {` ${dayjs(selectedsubTarea.createAt).format('YYYY-MM-DD HH:mm:ss')}`} {/* Texto adicional */}
</span>
            </span>
                                                  ),
                                              },

                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                              {
                                                  color: 'red',
                                                  children: 'Eliminado solved 2015-09-01',
                                              },
                                          ]}
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

export default ProyectoListPapelera;
