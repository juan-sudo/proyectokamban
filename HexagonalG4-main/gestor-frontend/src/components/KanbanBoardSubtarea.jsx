import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {Card, Col, Row, Button, Modal, Tooltip, Avatar, Space, Form, Popover, Drawer, Timeline} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {
    DatePicker,
    Spin,

    Input,

    Select,

} from 'antd';
import {

    EditOutlined,
    CloseOutlined,

    MenuOutlined,

    EllipsisOutlined,
    UserAddOutlined,
    CalendarOutlined,

    FolderOutlined,

    RedoOutlined,

    UserOutlined,
    MessageOutlined,
    HourglassOutlined,

    FlagOutlined,
    ArrowLeftOutlined,
    DeleteOutlined,
    MergeOutlined, CopyOutlined, ArrowRightOutlined, StarOutlined


} from '@ant-design/icons';

const truncateTextP = (text, maxChars) => {

    if (!text) return 'Cargando nombre del proyecto...'; // Maneja el caso de carga
    // Verifica si el texto es mayor que el número máximo de caracteres permitidos
    return text.length > maxChars ? `${text.slice(0, maxChars)}...` : text;
};
const truncateTextM = (text, maxChars) => {

    if (!text) return 'Cargando nombre del proyecto...'; // Maneja el caso de carga
    // Verifica si el texto es mayor que el número máximo de caracteres permitidos
    return text.length > maxChars ? `${text.slice(0, maxChars)}...` : text;
};

const KanbanBoardSubtarea = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [data, setData] = useState(null); // Cambiado a null para manejar cuando no hay datos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createType, setCreateType] = useState(null);
    const navigate = useNavigate();
    const { proyectoId, moduloId,tareaId } = useParams(); // Obtener IDs de proyecto y módulo desde la URL


    const [modalType, setModalType] = useState('');
    const [form] = Form.useForm();
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedModuloId, setSelectedModuloId] = useState(null);
    const [selectedColumnId, setSelectedColumnId] = useState(null);
    const [selectedTareaId, setSelectedTareaId] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null); // proyecto seleccionado
    const [selectedTareaUserIds, setSelectedTareaUserIds] = useState([]);
    //const [selectedModule,  ] = useState(null); // proyecto seleccionado
    const [selectedModule, setSelectedModule] = useState(null); // proyecto seleccionado
    const [usuarios, setUsuario] = useState([]);

    const [moduleData, setModuleData] = useState(null); // Estado para el módulo
    const [tareaData, setTareaData] = useState(null); // Estado para el módulo

    const [open, setOpen] = useState(false); // State for drawer open/close
    const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchUsuario();
        fetchTasks();

        console.log("esates modulo"+moduleData)
        console.log("tareas esta ----"+selectedTask)

    }, []);


    const showDrawer = (task) => {

        console.log("id que va: "+task.id)
        setSelectedTask(task); // Set the selected task


        setOpen(true); // Open the drawer
    };



// Maneja la apertura del Drawer
    const handleOpenDrawer = () => {
        form.resetFields(); // Reinicia el formulario
        setIsEditing(false); // Desactiva el modo de edición
        setOpen(true); // Abre el Drawer
    };

// Maneja el cierre del Drawer
    const handleCloseDrawer = () => {
        form.resetFields();
        setIsEditing(false);
        setOpen(false);
    };

    //PARA EDITAR TAREA EN DRAW

    const [isEditing, setIsEditing] = useState(false);

    // Manejar el click en el botón "Editar"
    // Manejar el clic en el botón "Editar"
    // En tu función handleEditClick
    const handleEditClick = () => {
        if (selectedTask) {
            form.setFieldsValue({
                nombre: selectedTask.nombre,
                descripcion: selectedTask.descripcion,
                fechaInicio: dayjs(selectedTask.fechaInicio),
                fechaFin: dayjs(selectedTask.fechaFin)// Asegúrate de que sea un objeto dayjs
            });
        }
        setIsEditing(true); // Activa el modo de edición
    };
    const handleGuardarClick = async (tareaId, subTareaId) => {

        try {
            const values = await form.validateFields();
            console.log("Valores enviados:", values); // Asegúrate de que 'nombre' tenga un valor

            const url = `${backendUrl}/api/tareas/${tareaId}/subTareas/${subTareaId}`;

            await axios.put(url, values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Aquí actualizas selectedTask para reflejar los nuevos valores

            setSelectedTask(prev => ({
                ...prev,
                ...values,
                id: +subTareaId // Convierte subTareaId a un número
            }));



            setIsEditing(false);
            await fetchTasks();

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error actualizando subtarea:", error);
        }
    };


    // Manejar el clic en el botón "Cancelar"
    const handleCancelClick = () => {
        setIsEditing(false); // Desactiva el modo de edición
        form.resetFields(); // Opcional: restablece el formulario a sus valores iniciales
    };
    // FILTRAR USUARIOS DE TAREA
    useEffect(() => {
        if (selectedTask && selectedTask.usuarios) {
            const userIds = selectedTask.usuarios.map(user => user.id);
            console.log("usuariros de tarea:::: "+userIds);
            setSelectedTareaUserIds(userIds);


        } else {

            setSelectedTareaUserIds([]);

        }
    }, [selectedTask]);

    const onClose = () => {
        setOpen(false); // Close the drawer
        setSelectedTask(null); // Reset the selected task
    };

    const content = (
        <>
            <div onClick={() => handleCopyTask(task.id)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <CopyOutlined style={{marginRight: 8}}/> {/* Ícono de copiar */}
                    <span>Copiar tarea</span>
                </Row>
            </div>

            <div onClick={() => handleMoveTask(task.id)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <ArrowLeftOutlined style={{marginRight: 8}}/> {/* Ícono de mover a la izquierda */}
                    <span>Mover tarea</span>
                    <ArrowRightOutlined style={{marginLeft: 8}}/> {/* Ícono de mover a la derecha */}
                </Row>
            </div>
            <div onClick={() => handleEditTask(task.id)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <EditOutlined style={{marginRight: 8}}/> {/* Ícono de editar */}
                    <span>Editar tarea</span>
                </Row>
            </div>
            <div onClick={() => handleDeleteTask(task.id)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: "red"}}>
                    <DeleteOutlined style={{marginRight: 8}}/> {/* Ícono de eliminar */}
                    <span>Eliminar tarea</span>
                </Row>
            </div>

        </>


    );


    const [hoveredRowIdPoper, setHoveredRowIdPoper] = useState(null); // Estado para el ID de la fila hoverada

    const handleMouseEnterPoper = (id) => {
        setHoveredRowIdPoper(id);
    };

    const handleMouseLeavePoper = () => {
        setHoveredRowIdPoper(null);
    };

    // Define una función para el contenido que reciba `taskId`
    const getContent = (taskId,moduleDataId, nombreTarea) => (
        <>
            <div onClick={() => handleCopyTask(taskId)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <CopyOutlined style={{marginRight: 8}} /> {/* Ícono de copiar */}
                    <span>Copiar tarea</span>
                    <span>{taskId}</span>
                </Row>
            </div>

            <div   style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <ArrowLeftOutlined style={{marginRight: 8}} /> {/* Ícono de mover a la izquierda */}
                    <span>Mover tarea</span>
                    <ArrowRightOutlined style={{marginLeft: 8}} /> {/* Ícono de mover a la derecha */}
                </Row>
            </div>
            <div  onClick={() => showModal('EditarTarea',null,moduleDataId,null, taskId)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5}}>
                    <EditOutlined style={{marginRight: 8}} /> {/* Ícono de editar */}
                    <span>Editar tarea</span>
                </Row>
            </div>
            <div onClick={() => handleDeleteTask(taskId,moduleDataId,nombreTarea)} style={{cursor: 'pointer'}}>
                <Row align="middle" style={{padding: 4, borderRadius: 5, color: "red"}}>
                    <DeleteOutlined style={{marginRight: 8}} /> {/* Ícono de eliminar */}
                    <span>Eliminar tarea</span>
                </Row>
            </div>
        </>
    );


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



    useEffect(() => {
        console.log("Tarea seleccionada:", selectedTarea);
        if (selectedTarea) {
            const { nombre, fechaInicio, fechaFin, descripcion, estado } = selectedTarea;
            form.setFieldsValue({
                nombre,
                fechaInicio: fechaInicio ? moment(fechaInicio) : null,
                fechaFin: fechaFin ? moment(fechaFin) : null,
                descripcion,
                estado,
            });
        }
    }, [selectedTarea, form]);




// ELIMINAR TAREA
    const handleDeleteTask = async (taskId, moduloId,nombreTarea) => {
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
                const response = await axios.delete(`/api/modulos/${moduloId}/tareas/delete/${taskId}`);
                if (response.status === 200) {
                    Swal.fire(
                        '¡Eliminado!',
                        'La tarea ha sido eliminada exitosamente.',
                        'success'
                    );
                    // Aquí puedes actualizar el estado para eliminar la tarea de la lista en el frontend
                    await fetchTasks();
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
    // OBTENER  USUARIOS

    const fetchUsuario = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/usuarios`);
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
//Eliminar USUARIO TAREA
    const handleUserTareaChange = (newUserIds) => {
        console.log("id selecionado para elimiar::-"+newUserIds)

        const removedUserIds = selectedTareaUserIds.filter(id => !newUserIds.includes(id));


        removedUserIds.forEach(async (userId) => {
            try {
                await axios.delete(`http://localhost:8080/api/tareas/${tareaData.id}/subTareas/${selectedTask.id}/usuarios/${userId}`);

                //http://localhost:8080/api/modulos/2/tareas/1/usuarios/4
                // message.success(`Usuario ${userId} eliminado del proyecto correctamente`);

                await fetchTasks();

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
            await axios.put(`http://localhost:8080/api/tareas/${tareaData.id}/subTareas/${selectedTask.id}/usuarios`, selectedTareaUserIds);

            ////http://localhost:8080/api/modulos/2/tareas/1/usuarios

            // /api/proyectos/{proyectoId}/modulos/{id}/usuarios
            //message.success('Usuarios actualizados correctamente');
            // Actualizar el estado del proyecto para reflejar los usuarios asignados
            // Vuelve a obtener todos los proyectos para reflejar los cambios
            await fetchTasks();

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


    // Llamada a la API para obtener las tareas del módulo
    const fetchTasks = async () => {

        try {

            // Obtener datos del modulo
            const moduloResponse = await axios.get(`http://localhost:8080/api/proyectos/${proyectoId}/modulos/${moduloId}`);
            const moduleData = moduloResponse.data;
            console.log("modulos aqui...........::",moduleData);
            // Actualiza el estado de projectData
            setModuleData(moduleData);

            const responseTarea = await axios.get(`http://localhost:8080/api/modulos/${moduloId}/tareas/${tareaId}`);
            const tareaData = responseTarea.data;
            setTareaData(tareaData); // Actualiza el estado del módulo
            console.log("tareas aquii::",tareaData);
            // Actualiza el estado de projectData

            // Actualiza el estado de projectData


            // Formatea los datos para ajustarse a la estructura del kanban
            const formattedData = {

                projects: {
                    'project-1': { id: 'project-1', title: 'Proyecto 1', modules: [tareaData] },

                },

                tasks: tareaData.subtareas.reduce((acc, subtarea) => ({

                    ...acc,
                    [subtarea.id]: {

                        id: subtarea.id.toString(),
                        nombre: subtarea.nombre || 'Sin título',

                        descripcion: subtarea.descripcion || 'Sin fecha',
                        fechaInicio:subtarea.fechaInicio||'-',
                        fechaFin:subtarea.fechaFin||'-',
                        estado: subtarea.estado|| '-', // Agrega el estado de la tarea
                        usuarios:subtarea.usuarios||'sin usuarios',
                        prioridad:subtarea.prioridad||'-',
                        subtareas:subtarea.subtareas||'0'
                    }

                }), {}),
                columns: {
                    'column-1': {
                        id: 'column-1',
                        title: 'Pendiente',
                        estado:'PENDIENTE',
                        taskIds: [],
                    },
                    'column-2': {
                        id: 'column-2',
                        title: 'En Proceso',
                        estado:'EN_PROGRESO',
                        taskIds: [],
                    },
                    'column-3': {
                        id: 'column-3',
                        title: 'Completada',
                        estado:'COMPLETADA',
                        taskIds: [],
                    },
                },
                columnOrder: ['column-1', 'column-2', 'column-3'],
            };

            // Asigna las tareas a las columnas correspondientes
            tareaData.subtareas.forEach(subtarea => {

                const columnId = subtarea.estado === 'PENDIENTE' ? 'column-1' :
                    subtarea.estado === 'EN_PROGRESO' ? 'column-2' :
                        subtarea.estado === 'COMPLETADA' ? 'column-3' : null;
                if (columnId) {
                    formattedData.columns[columnId].taskIds.push(subtarea.id.toString());

                }
            });

            setData(formattedData);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
        }
    };

    const handleOk = () => {
        if (isProcessing) return; // Evita que se ejecute si ya está procesando
        setIsProcessing(true); // Establece que el proceso está en ejecución

        form.validateFields().then(async (values) => {
            try {
                // Formatear las fechas si están presentes
                if (values.fechaInicio) {
                    values.fechaInicio = values.fechaInicio.format('YYYY-MM-DD');
                }
                if (values.fechaFin) {
                    values.fechaFin = values.fechaFin.format('YYYY-MM-DD');
                }

                const nuevaTarea = {
                    ...values,
                    estado: selectedColumnId // Aquí asegúrate de que este ID es el correcto
                };

                // Definir la URL según el tipo de modal
                let url = '';
                if (modalType === 'AñadirSubTarea') {
                    url = `${backendUrl}/api/tareas/${selectedTareaId}/subTareas`;

                    try {
                        // Enviar solicitud de creación
                        const response = await axios.post(url, nuevaTarea);

                        // Capturar y manejar los datos devueltos
                        const responseData = response.data;
                        console.log("Respuesta JSON recibida:", responseData);

                        Swal.fire({
                            icon: 'success',
                            title: '¡Tarea añadida!',
                            text: `La tarea "${responseData.nombre}" ha sido añadida con éxito.`,
                            confirmButtonText: 'OK',
                        });

                        // Restablecer el formulario y cerrar el modal
                        form.resetFields();
                        setIsModalOpen(false);
                        await fetchTasks();

                    } catch (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un error al añadir la tarea. Inténtalo nuevamente.',
                            confirmButtonText: 'OK',
                        });
                        console.error('Error al añadir tarea:', error);
                    }
                }

            } catch (error) {
                console.error("Error validando el formulario:", error);
            } finally {
                setIsProcessing(false); // Restablecer el estado de procesamiento al finalizar
            }
        }).catch((errorInfo) => {
            Swal.fire({
                icon: 'warning',
                title: 'Campos inválidos',
                text: 'Por favor, corrige los errores en el formulario.',
                confirmButtonText: 'OK',
            });
            setIsProcessing(false); // Restablecer si hay errores de validación
        });
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };


    //HOVER USUARIO
    const [hoveredRowId, setHoveredRowId] = useState(null);

    const handleMouseEnter = (rowId) => {
        setHoveredRowId(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeave = () => {
        setHoveredRowId(null); // Limpiar el estado cuando se sale de la fila
    };

    //HOVER CALENDARIO

    const [isHoveredCalendario, setIsHoveredCalendario] = useState(null);

    const handleMouseEnterCalendario = (rowId) => {
        setIsHoveredCalendario(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeaveCalendario = () => {
        setIsHoveredCalendario(null); // Limpiar el estado cuando se sale de la fila
    };


    //HOVER PRIORIDAD

    const [isHoveredPrioridad, setIsHoveredPrioridad] = useState(null);

    const handleMouseEnterPrioridad = (rowId) => {
        setIsHoveredPrioridad(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeavePrioridad = () => {
        setIsHoveredPrioridad(null); // Limpiar el estado cuando se sale de la fila
    };

//HOVER SUBTAREA

    const [isHoveredSubtarea, setIsHoveredSubtarea] = useState(null);

    const handleMouseEnterSubtarea = (rowId) => {
        setIsHoveredSubtarea(rowId); // Establecer la fila que se está "hovering"
    };

    const handleMouseLeaveSubtarea = () => {
        setIsHoveredSubtarea(null); // Limpiar el estado cuando se sale de la fila
    };


    const showModal = (typeModal, moduloId = null, tareaId = null,columnId=null) => {

        setModalType(typeModal);
        //setSelectedItemId(id);
        setSelectedModuloId(moduloId);
        setSelectedColumnId(columnId);
        setSelectedTareaId(tareaId);



        setIsModalOpen(true);


        if (typeModal === 'AñadirSubTarea'&& moduloId&&tareaId) {
            // Resetea el formulario para que esté vacío al añadir un proyecto o módulo
            form.resetFields();
        }

        if (typeModal === 'verTarea' && id && moduloId && tareaId) {

            // Asegúrate de que projectData sea un arreglo
            const data = Array.isArray(moduleData) ? moduleData : [moduleData];

            const modulo = data.find(p => p.id === id);
            console.log("data proyecto aqui::"+data)
            console.log("proyecto aqui::"+modulo)

            // Si se encuentra el proyecto, busca el módulo dentro de ese proyecto
            if (modulo) {

                const tareaM = Array.isArray(tareaData) ? tareaData : [tareaData];
                const tarea = tareaM.find(m => m.id === moduloId);

                console.log("modulo aqui::"+tarea)



                // Si se encuentra el módulo, actualiza el estado con ese módulo
                if (modulo) {
                    setSelectedModule(modulo);
                    const tarea = modulo.tareas.find(t => t.id === Number(tareaId));
                    if (tarea) {
                        console.log("entra a tarea-------")
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
        }


        // Lógica para editar tarea
        if (typeModal === 'EditarTarea'&& moduloId&&tareaId) {

            console.log("id de modulo"+moduloId);


            const dataM = Array.isArray(moduleData) ? moduleData : [moduleData];
            const moduloM = dataM.find(m => m.id === moduloId);

            console.log("esat en modulo_"+moduloM);

            // Si se encuentra el módulo, actualiza el estado con ese módulo
            if(moduloM) {
                setSelectedModule(moduloM);
                const tarea = moduloM.tareas.find(t => t.id === Number(tareaId));
                if (tarea) {
                    console.log("entra a tarea-------")
                    setSelectedTarea(tarea);
                } else {
                    console.error("Tarea no encontrada");
                }

            } else {
                console.error("Módulo no encontrado");
            }

        }

        // Encuentra el proyecto por su ID

    }


    const getBackgroundColor = (title) => {
        switch (title) {
            case 'Pendiente':
                return '#949291'; // Amarillo para pendiente
            case 'En Proceso':
                return '#7b68ee'; // Azul para en proceso
            case 'Completada':
                return '#387032'; // Verde para terminado
            default:
                return '#b5b2b1'; // Color predeterminado
        }
    };
    const handleTaskClick = (taskId) => {
        if (data.tasks[taskId]) {
            navigate(`/subtasks/${taskId}`);
        }
    };



    const handleDelete = async (taskId) => {
        try {
            await axios.patch(`/api/tareas/eliminar/${taskId}`);
            setData(prevData => {
                const updatedTasks = { ...prevData.tasks };
                delete updatedTasks[taskId];
                return { ...prevData, tasks: updatedTasks };
            });
        } catch (error) {
            console.error('Error eliminando tarea:', error);
        }
    };





    const onDragEnd = async (result) => {
        const {destination, source, draggableId} = result;

        if (!destination) return;

        // Si se arrastra dentro de la misma columna
        if (source.droppableId === destination.droppableId) {
            const column = data.columns[source.droppableId];
            const newTaskIds = Array.from(column.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                taskIds: newTaskIds,
            };

            setData((prevData) => ({
                ...prevData,
                columns: {
                    ...prevData.columns,
                    [newColumn.id]: newColumn,
                },
            }));
        } else {
            // Si se arrastra a una columna diferente
            const startColumn = data.columns[source.droppableId];
            const endColumn = data.columns[destination.droppableId];

            const startTaskIds = Array.from(startColumn.taskIds);
            startTaskIds.splice(source.index, 1); // Remover la tarea de la columna de origen

            const newStartColumn = {
                ...startColumn,
                taskIds: startTaskIds,
            };

            const endTaskIds = Array.from(endColumn.taskIds);
            endTaskIds.splice(destination.index, 0, draggableId); // Agregar la tarea a la columna de destino

            const newEndColumn = {
                ...endColumn,
                taskIds: endTaskIds,
            };

            setData((prevData) => ({
                ...prevData,
                columns: {
                    ...prevData.columns,
                    [newStartColumn.id]: newStartColumn,
                    [newEndColumn.id]: newEndColumn,
                },
            }));
            // Aquí se hace la llamada a la API para actualizar el estado de la tarea
            const nuevoEstado = destination.droppableId === 'column-1' ? 'PENDIENTE' :
                destination.droppableId === 'column-2' ? 'EN_PROGRESO' :
                    destination.droppableId === 'column-3' ? 'COMPLETADA' : null;

            if (nuevoEstado) {
                try {
                    await axios.put(`http://localhost:8080/api/tareas/${tareaId}/subTareas/${draggableId}/estado?nuevoEstado=${nuevoEstado}`);
                    ///api/tareas/{tareaId}/subTareas/{subtareaId}/estado
                } catch (error) {
                    console.error('Error actualizando el estado de la tarea:', error);
                }
            }
        }
    };

    const getDroppableStyle = (isDraggingOver) => ({

        background: isDraggingOver ? '#e0e0e0' : '#f0f0f0',
        padding: 8,
        transition: 'background 0.2s ease',
        maxHeight: '500px', // Establece una altura máxima para el scroll
        overflowY: 'auto', // Permite el scroll vertical
    });

    if (!data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin tip="Cargando..." size="large" /> {/* Cambiar el tamaño aquí */}
            </div>
        );// Muestra un mensaje de carga mientras se obtienen los datos
    }


    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',

                padding: 10,
                borderBottom: '1px solid #ddd'
            }}> {/* Borde inferior suave */}


                <Button type="dashed" icon={<ArrowLeftOutlined />


                }
                        onClick={() => navigate(-1)} // Navega hacia atrás en el historial
                >
                    Atras
                </Button>


                <Tooltip title={tareaData ? tareaData.nombre : 'Cargando nombre del tareas...'} placement="top">
            <span style={{
                fontWeight: 'bold',
                color: '#555',
                fontSize: 14,
                marginLeft: 10,
                marginRight: 3,
                cursor: 'pointer'
            }}>

                 <FolderOutlined style={{

                     color: 'black',

                     // Espacio entre el icono y el texto
                 }}/>
                <span> {truncateTextP(tareaData.nombre, 16)} </span>
            </span>
                </Tooltip>
                <span style={{margin: '0 8px', color: '#555', fontSize: 15, marginLeft: 7}}>/</span>

                <Tooltip title={tareaData ? tareaData.nombre : 'Cargando nombre del proyecto...'} placement="top">
        <span style={{color: '#555', fontSize: 14, cursor: 'pointer'}}>
            <MenuOutlined style={{

                color: 'black',
                // Espacio entre el icono y el texto
            }}/>
            <span> {truncateTextM(tareaData.nombre, 16)} </span>
        </span>
                </Tooltip>



                <span style={{margin: '0 8px', color: '#555', fontSize: 15, marginLeft: 7}}>/</span>
                < span style={{color: '#555', fontSize: 13, cursor: 'pointer'}}>
                    <MergeOutlined/>
                   Tareas
                </span>
                <span><EllipsisOutlined style={{
                    marginTop:4,
                    marginLeft: 5,
                    fontSize: 17,
                    fontWeight: 800
                }}/></span>


            </div>


            <DragDropContext onDragEnd={onDragEnd}>
                <Row gutter={16} style={{marginLeft:2,marginRight:2}}>
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

                        return (
                            <Col key={column.id} span={8}>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 12,
                                    paddingBottom:2,
                                    backgroundColor: "#f5f5f5",
                                    borderTopRightRadius: '10px',


                                }}>

    <span
        style={{
            display: 'flex',
            alignItems: 'center',

            padding: '5px 9px', // Padding (arriba/abajo, izquierda/derecha)
            borderRadius: '5px', // Bordes redondeados (opcional)
            color: '#ffffff',
        }}
    >

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                height: '16px', // Altura y ancho iguales para hacer un círculo
                width: '16px',
                borderRadius: '50%', // Hace el div circular
                border: `3px solid ${getBackgroundColor(column.title)}`, // Borde del círculo
                marginTop: 0,
                marginRight: 4,
                color:getBackgroundColor(column.title) ,

            }}
        >

                    </div>


        <span style={{fontWeight: 'bold', backgroundColor: getBackgroundColor(column.title), paddingBottom:4,paddingRight:5,paddingLeft:4,paddingTop:4, borderRadius:4}}> {/* Span adicional para el texto en negrita */}
            {column.title}
        </span>

  <span style={{marginLeft: 10,color:getBackgroundColor(column.title)}}>{column.taskIds.length}</span>
    </span>


                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={getDroppableStyle(snapshot.isDraggingOver)}
                                        >
                                            {tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(draggableProvided) => (
                                                        <Card
                                                            onMouseEnter={() => handleMouseEnterPoper(task.id)} // Manejo del hover
                                                            onMouseLeave={handleMouseLeavePoper}
                                                            style={{
                                                                position: 'relative', // Para posicionar el div dentro del card
                                                                width: 300,
                                                                margin: '10px',
                                                            }}
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.draggableProps}
                                                            {...draggableProvided.dragHandleProps}
                                                            className="task-card"

                                                        >
                                                            <Card.Meta

                                                                title={
                                                                    <a  style={{
                                                                        color: '#4c47ab',
                                                                        marginLeft: 8,
                                                                        whiteSpace: 'normal', // Permite que el texto se envuelva
                                                                        overflow: 'visible',  // Asegura que el texto no se recorte
                                                                        display: 'inline-block', // Configura el contenedor como inline para evitar recortes
                                                                        width: '100%'          // Permite que ocupe el espacio completo
                                                                    }}
                                                                        onClick={() => showDrawer(task)}
                                                                    >




                                                                        {task.nombre}
                                                                    </a>
                                                                }


                                                            />


                                                            <Row
                                                                style={{

                                                                    backgroundColor: hoveredRowId===task.id ? '#f0f0f0' : 'transparent', // Cambia el color de fondo al hacer hover
                                                                    transition: 'background-color 0.3s ease', // Transición suave
                                                                    paddingTop:2,
                                                                    paddingBottom:2,
                                                                    paddingLeft:7,
                                                                    borderRadius:10
                                                                }}
                                                                onMouseEnter={() => handleMouseEnter(task.id)} // Activa el hover
                                                                onMouseLeave={handleMouseLeave} // Desactiva el hover


                                                            >


                                                                <Col span={2}>
                                                                    <Tooltip title="Usuarios">
                    <span style={{ fontWeight: 800 }}>
                        <UserAddOutlined
                            style={{
                                fontSize: '13px',
                                transform: 'scale(1.2)',
                                color: '#656f7d'
                            }}
                        />
                    </span>
                                                                    </Tooltip>
                                                                </Col>

                                                                <Col span={22}>
                <span>
                    {Array.isArray(task.usuarios) && task.usuarios.length > 0 ? (
                        task.usuarios.map((usuario, index) => {
                            const backgroundColor = usuario.backgroundUser || '#000000'; // Color predeterminado

                            return (
                                <Tooltip
                                    key={usuario.id}
                                    title={`${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`}
                                >
                                    <Avatar
                                        size={27}
                                        style={{
                                            backgroundColor,
                                            border: '1px solid white',
                                            position: 'absolute',
                                            left: `${index * 20}px`, // Desplazamiento horizontal
                                            zIndex: 10 - index,
                                            lineHeight: '0px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {usuario.nombres.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Tooltip>
                            );
                        })
                    ) : (
                        <Tooltip title="Agregar persona">
                            <Avatar size={27} icon={<UserAddOutlined />} />
                        </Tooltip>
                    )}
                </span>
                                                                </Col>
                                                            </Row>





                                                            <Row

                                                                style={{


                                                                    // Desactiva el hover

                                                                    backgroundColor: isHoveredCalendario===task.id ? '#f0f0f0' : 'transparent', // Cambia el color de fondo al hacer hover
                                                                    transition: 'background-color 0.3s ease', // Transición suave
                                                                    paddingTop:2,
                                                                    paddingBottom:0,
                                                                    paddingLeft:7,
                                                                    borderRadius:10
                                                                }}
                                                                onMouseEnter={() => handleMouseEnterCalendario(task.id)} // Activa el hover
                                                                onMouseLeave={handleMouseLeaveCalendario} // Desactiva el hover


                                                            >

                                                                <Col span={2}>
                                                                    <Tooltip title="Fecha límite">
                                                                     <span style={{fontWeight: 800}}>
                                                                  <CalendarOutlined style={{
                                                                      fontSize: '13px',
                                                                      transform: 'scale(1.2)',
                                                                      color: '#656f7d'
                                                                  }}/>

                                                                </span>
                                                                    </Tooltip>
                                                                </Col>
                                                                <Col span={22} >


                                                                    <span style={{
                                                                        fontSize: 12,
                                                                        color: '#2a2e2a',
                                                                        fontWeight: 400,

                                                                    }}>
                                                                        {task.fechaInicio}
                                                                    </span>



                                                                </Col>
                                                            </Row>
                                                            <Row

                                                                style={{


                                                                    // Desactiva el hover

                                                                    backgroundColor: isHoveredCalendario===task.id ? '#f0f0f0' : 'transparent', // Cambia el color de fondo al hacer hover
                                                                    transition: 'background-color 0.3s ease', // Transición suave
                                                                    paddingTop:2,
                                                                    paddingBottom:0,
                                                                    paddingLeft:7,
                                                                    borderRadius:10
                                                                }}
                                                                onMouseEnter={() => handleMouseEnterCalendario(task.id)} // Activa el hover
                                                                onMouseLeave={handleMouseLeaveCalendario} // Desactiva el hover


                                                            >

                                                                <Col span={2}>
                                                                    <Tooltip title="Fecha límite">
                                                                     <span style={{fontWeight: 800}}>
                                                                  <CalendarOutlined style={{
                                                                      fontSize: '13px',
                                                                      transform: 'scale(1.2)',
                                                                      color: '#656f7d'
                                                                  }}/>

                                                                </span>
                                                                    </Tooltip>
                                                                </Col>
                                                                <Col span={22} >


                                                                    <span style={{
                                                                        fontSize: 12,
                                                                        color: '#2a2e2a',
                                                                        fontWeight: 400,

                                                                    }}>
                                                                        {task.fechaFin}
                                                                    </span>



                                                                </Col>
                                                            </Row>

                                                            <Row

                                                                style={{

                                                                    backgroundColor: isHoveredPrioridad ===task.id? '#f0f0f0' : 'transparent', // Cambia el color de fondo al hacer hover
                                                                    transition: 'background-color 0.3s ease', // Transición suave
                                                                    paddingTop:2,
                                                                    paddingBottom:0,
                                                                    paddingLeft:7,
                                                                    borderRadius:10
                                                                }}
                                                                onMouseEnter={() => handleMouseEnterPrioridad(task.id)} // Activa el hover
                                                                onMouseLeave={handleMouseLeavePrioridad} // Desactiva el hover
                                                            >

                                                                <Col span={2}>
                                                                    <Tooltip title="Prioridad">
                                                                     <span style={{fontWeight: 800}}>
                                                                  <FlagOutlined style={{
                                                                      fontSize: '13px',
                                                                      transform: 'scale(1.2)',
                                                                      color: '#656f7d'
                                                                  }}/>

                                                                </span>
                                                                    </Tooltip>
                                                                </Col>
                                                                <Col span={22}>


                                                                    {task.prioridad && task.prioridad.nombre ? (
                                                                        <Space>
                                                                            <FlagOutlined style={{ fontSize: '12px', color: task.prioridad.backgroundPrioridad }} />
                                                                            <span style={{color: task.prioridad.backgroundPrioridad, fontSize:12}}>{task.prioridad.nombre}</span>
                                                                        </Space>
                                                                    ) : (
                                                                        <Space>
                                                                            -
                                                                        </Space>
                                                                    )}




                                                                </Col>
                                                            </Row>

                                                            <Row
                                                                style={{

                                                                    backgroundColor: isHoveredSubtarea===task.id ? '#f0f0f0' : 'transparent', // Cambia el color de fondo al hacer hover
                                                                    transition: 'background-color 0.3s ease', // Transición suave
                                                                    paddingTop:2,
                                                                    paddingBottom:0,
                                                                    paddingLeft:7,
                                                                    borderRadius:10
                                                                }}
                                                                onMouseEnter={() => handleMouseEnterSubtarea(task.id)} // Activa el hover
                                                                onMouseLeave={handleMouseLeaveSubtarea} // Desactiva el hover

                                                            >


                                                                <Col span={2}>


                                                                     <span style={{fontWeight: 800}}>

                                                                  <MergeOutlined style={{
                                                                      fontSize: '13px',
                                                                      transform: 'scale(1.2)',
                                                                      color: '#656f7d'
                                                                  }}/>


                                                                </span>
                                                                </Col>
                                                                <Col span={22} style={{
                                                                    fontSize: 12,
                                                                    color: '#2a2e2a',
                                                                    fontWeight: 400,
                                                                }}>


                                                                    <span>


                                                                    {Array.isArray(task.subtareas) ? task.subtareas.length : 0}
                                                                </span>
                                                                    <span style={{marginLeft: 6}}>


                                                                        Subtareas
                                                                    </span>
                                                                    <span style={{color: "red"}}>{task.id}</span>
                                                                    <span style={{color: "red"}}>{tareaData.id}</span>

                                                                </Col>
                                                            </Row>

                                                            {hoveredRowIdPoper === task.id && (
                                                                <Space
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '0px',  // Posiciona en la parte superior
                                                                        right: '0px', // Posiciona en la parte derecha
                                                                        display: 'flex',
                                                                        gap: '2px', // Ajusta el espacio entre elementos
                                                                        marginTop:2,marginRight:2
                                                                    }}
                                                                    wrap
                                                                >
                                                                    <Popover content={getContent(task.id,tareaData.id,task.nombre)}  trigger="click">
                                                                        <Button
                                                                            style={{
                                                                                padding: '4px 8px', // Ajusta el padding para hacer el botón más pequeño
                                                                                fontSize: '12px', // Reduce el tamaño de la fuente
                                                                            }}
                                                                        >
                                                                            <EllipsisOutlined />
                                                                        </Button>
                                                                    </Popover>
                                                                </Space>


                                                            )}


                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* Div para "Agregar tarea" */}
                                            <div


                                                onClick={() => showModal('AñadirSubTarea', moduleData.id, tareaData.id, column.estado)}

                                                // Abre el modal de creación de tarea
                                                style={{
                                                    marginTop: 10,
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    backgroundColor: '#e0e0e0',
                                                    borderRadius: '5px',
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                }}
                                            >
                                                + Agregar tarea
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                        );
                    })}
                </Row>

            </DragDropContext>




            <Modal
                title={
                    modalType === 'AñadirSubTarea' ? 'Crear SubTarea':
                        modalType === 'EditarTarea' ? 'Editar tarea':'Editar Tarea'

                }
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={isProcessing} // Deshabilita mientras se procesa
                width={modalType === 'verProyecto'|| modalType === 'verModulo' ||modalType==='verTarea'||modalType==='verSubtarea'? 800 : undefined}
                //  bodyStyle={{  borderBottom: '1px solid #d9d9d9',borderTop: '1px solid #d9d9d9', borderRadius: '8px' }} // Estilo del cuerpo del modal


            >


                {modalType === 'AñadirSubTarea' && (
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
                            name="estado"
                            // Ocultar el campo
                            // Ocultar el campo del formulario
                            initialValue={selectedColumnId || ''} // Establecer valor inicial
                        >
                            <Input  readOnly />
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

                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

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

                    </div>
                )}

                {modalType === 'EditarTarea' && (
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
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor, ingresa la descripción' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>

                        {/* Este campo de estado se puede manejar de otra manera si no quieres ocultarlo */}
                        <Form.Item
                            name="estado"
                            style={{ display: 'none' }} // Ocultar el campo
                        >
                            <Input readOnly />
                        </Form.Item>
                    </Form>
                )}




            </Modal>


            <Drawer


                width={1100}
                onClose={handleCloseDrawer}
                //onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 50,

                    },
                    mask: {
                        backgroundColor: 'rgba(255, 255, 255, 0)', // Sin opacidad
                    }
                }}
                closeIcon={
                    null
                }


            >
                {selectedTask && (

                    <Form form={form} layout="vertical" hideRequiredMark>

                        <Row gutter={16}>
                            <Col span={18}>
                                {isEditing ? (
                                    <Form.Item
                                        name="nombre"
                                        label="Nombre"
                                        rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                ) : (
                                    <p style={{fontSize: 32, color: '#343940'}}>

                                        {selectedTask.nombre || 'Sin título'}
                                    </p>
                                )}
                            </Col>

                            <Col span={6} style={{ display: 'flex', gap: '8px'}}>
                                {isEditing ? (
                                    <>

                                        <Button
                                            onClick={handleCancelClick}
                                            type="text"

                                            style={{
                                                fontSize: 12,
                                                color: '#656f7d',
                                                border: '1px solid #9daabd', // Gris para el borde
                                                borderRadius: 4,
                                                padding: '2px 6px',
                                                backgroundColor: '#f0f0f0', // Fondo gris claro
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={() => handleGuardarClick(tareaData.id, selectedTask.id)}
                                            type="text"

                                            style={{
                                                fontSize: 12,
                                                color: '#ffffff',
                                                border: '1px solid #52c41a', // Verde de Ant Design
                                                borderRadius: 4,
                                                padding: '2px 6px',
                                                backgroundColor: '#52c41a', // Verde de fondo
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            Guardar
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleEditClick}
                                        type="text"
                                        style={{
                                            fontSize: 12,
                                            color: '#656f7d',
                                            border: '1px solid #9daabd',
                                            borderRadius: 4,
                                            padding: '2px 6px',
                                            background: 'transparent',
                                            fontWeight: 700
                                        }}
                                    >
                                        Editar
                                    </Button>
                                )}

                                <Button
                                    type="text"
                                    icon={<EllipsisOutlined />}
                                    style={{ fontSize: 16, color: '#000' }}
                                />
                                <Button
                                    type="text"
                                    icon={<StarOutlined />}
                                    style={{ fontSize: 16, color: '#000' }}
                                />
                                <Button
                                    type="text"
                                    // onClick={onClose}
                                    style={{ fontSize: 16, color: '#000' }}
                                    onClick={handleCloseDrawer}
                                    icon={<CloseOutlined />}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={17}>


                                <div>

                                    {isEditing ? (
                                        // Mostrar el campo de entrada cuando está en modo edición
                                        <Form.Item
                                            name="descripcion"
                                            label={"Descripcion"}
                                            rules={[{ required: true, message: 'Por favor, ingresa el nombre' }]}
                                        >
                                            <Input.TextArea rows={4} />
                                        </Form.Item>
                                    ) : (
                                        // Mostrar el título cuando no está en modo edición
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

                                            <span>  {selectedTask.descripcion|| 'Sin descripcion'}  </span>
                                        </p>
                                    )}


                                </div>
                            </Col>
                            <Col span={7}>


                                <Timeline>
                                    <Timeline.Item
                                        dot={<CalendarOutlined
                                            style={{fontSize: '20px', color: '#888'}}/>} // Color gris plomo
                                        color="gray" // Color para el ítem
                                    >
                                        <div style={{display: 'flex', alignItems: 'center'}}>

                                            {isEditing ? (
                                                // Mostrar el campo de entrada cuando está en modo edición

                                                <Form.Item
                                                    name="fechaInicio"
                                                    label="Fecha inicio"

                                                >
                                                    <DatePicker/>
                                                </Form.Item>
                                            ) : (
                                                // Mostrar el título cuando no está en modo edición
                                                <p style={{fontSize: '14px', margin: 0}}>
                                                    <span style={{fontWeight: 600}}>Fecha inicio: </span>
                                                    {selectedTask.fechaInicio ?
                                                        (typeof selectedTask.fechaInicio === 'object' ?
                                                            selectedTask.fechaInicio.format('YYYY-MM-DD') :
                                                            selectedTask.fechaInicio)
                                                        :
                                                        'Sin fecha'} {/* Maneja el caso cuando fechaInicio es undefined o null */}
                                                </p>

                                            )}

                                        </div>
                                    </Timeline.Item>
                                    <Timeline.Item
                                        dot={<CalendarOutlined
                                            style={{fontSize: '20px', color: '#52c41a'}}/>} // Color verde
                                        color="green" // Color para el ítem
                                    >
                                        <div style={{display: 'flex', alignItems: 'center' }}>


                                            {isEditing ? (
                                                // Mostrar el campo de entrada cuando está en modo edición

                                                <Form.Item
                                                    name="fechaFin"
                                                    label="Fecha fin"

                                                >
                                                    <DatePicker/>
                                                </Form.Item>
                                            ) : (
                                                // Mostrar el título cuando no está en modo edición
                                                <p style={{fontSize: '14px', margin: 0}}>
                                                    <span style={{fontWeight: 600}}>Fecha fin: </span>
                                                    {selectedTask.fechaFin ?
                                                        (typeof selectedTask.fechaFin === 'object' ?
                                                            selectedTask.fechaFin.format('YYYY-MM-DD') :
                                                            selectedTask.fechaFin)
                                                        :
                                                        'Sin fecha'} {/* Maneja el caso cuando fechaInicio es undefined o null */}
                                                </p>

                                            )}

                                        </div>
                                    </Timeline.Item>

                                </Timeline>


                            </Col>
                        </Row>

                        <Row gutter={16}>

                            <Col span={17}>
                                <h2>Actividades</h2>
                                <Timeline
                                    items={[
                                        {
                                            color: 'green',
                                            children: 'Create a services site 2015-09-01',
                                        },
                                        {
                                            children: 'Solve initial network problems 2015-09-01',
                                        },
                                        {
                                            children: 'Technical testing 2015-09-01',
                                        },
                                        {

                                            children: 'Network problems being solved 2015-09-01',
                                        },
                                        {
                                            children: 'Create a services site 2015-09-01',
                                        },
                                        {
                                            children: 'Solve initial network problems 2015-09-01',
                                        },
                                        {
                                            children: 'Technical testing 2015-09-01',
                                        },
                                        {
                                            children: 'Network problems being solved 2015-09-01',
                                        },
                                        {
                                            children: 'Create a services site 2015-09-01',
                                        },
                                        {
                                            children: 'Solve initial network problems 2015-09-01',
                                        },
                                        {
                                            children: 'Technical testing 2015-09-01',
                                        },
                                        {
                                            color: 'red',
                                            children: 'Network problems being solved 2015-09-01',
                                        },
                                    ]}
                                />
                            </Col>
                            <Col span={7}>

                                <div
                                    style={{
                                        width: '100%',



                                    }} // Ancho del Card

                                >
                                    <p style={{fontWeight: 700}}>Estado </p>
                                    <span> {selectedTask.estado} </span>

                                    {/* Aquí puedes agregar más contenido si lo deseas */}
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        marginTop: 10,
                                        borderBottom: '1px solid #e6e9ed',
                                        marginBottom:10
                                    }} // Ancho del Card

                                >


                                    {/* Aquí puedes agregar más contenido si lo deseas */}
                                </div>
                                <Card
                                    style={{width: '100%'}} // Ancho del Card
                                    title="Asignar usuarios" // Título del Card
                                >
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
                                    {/* Aquí puedes agregar más contenido si lo deseas */}
                                </Card>

                                <div
                                    style={{
                                        width: '100%',

                                        marginTop: 15
                                    }} // Ancho del Card

                                >
                                    <p style={{fontWeight: 700}}>Prioridad </p>

                                    <p style={{fontSize: '14px', margin: 0}}>

                                        <FlagOutlined
                                            style={{
                                                marginRight: 5,
                                                fontSize: '16px',
                                                color: selectedTask?.prioridad?.backgroundPrioridad || 'gray' // Color predeterminado si es null
                                            }}
                                        />
                                        <span style={{color: selectedTask?.prioridad?.selectedTask || 'gray'}}
                                        >{selectedTask?.prioridad?.nombre || "Sin prioridad"}</span>
                                    </p>


                                    {/* Aquí puedes agregar más contenido si lo deseas */}
                                </div>
                                <div
                                    style={{
                                        width: '100%',
                                        marginTop: 10,
                                        borderBottom: '1px solid #e6e9ed'
                                    }} // Ancho del Card

                                >


                                    {/* Aquí puedes agregar más contenido si lo deseas */}
                                </div>


                            </Col>

                        </Row>


                    </Form>
                )}
            </Drawer>


        </>


    );


};


export default KanbanBoardSubtarea;
