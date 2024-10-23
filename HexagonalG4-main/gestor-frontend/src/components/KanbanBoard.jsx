import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import CreateElementModal from './CreateElementModal';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const KanbanBoard = () => {
    const [data, setData] = useState(null); // Cambiado a null para manejar cuando no hay datos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createType, setCreateType] = useState(null);
    const navigate = useNavigate();
    const { proyectoId, moduloId } = useParams(); // Obtener IDs de proyecto y módulo desde la URL
    const [projectData, setProjectData] = useState(null); // Estado para projectData

    useEffect(() => {
        // Llamada a la API para obtener las tareas del módulo
        const fetchTasks = async () => {
            try {
                // Obtener datos del proyecto
                const projectResponse = await axios.get(`http://localhost:8080/api/proyectos/${proyectoId}`);
                const projectData = projectResponse.data;
                console.log("proyecto...........::",projectData);

                // Actualiza el estado de projectData
                setProjectData(projectData);
                const response = await axios.get(`http://localhost:8080/api/proyectos/${proyectoId}/modulos/${moduloId}`);
                const moduleData = response.data;
                console.log("modulo............::",moduleData);
                // Actualiza el estado de projectData


                // Formatea los datos para ajustarse a la estructura del kanban
                const formattedData = {
                    projects: {
                        'project-1': { id: 'project-1', title: 'Proyecto 1', modules: [moduleData] },
                    },
                    tasks: moduleData.tareas.reduce((acc, tarea) => ({
                        ...acc,
                        [tarea.id]: {
                            id: tarea.id.toString(),
                            title: tarea.nombre || 'Sin título',
                            description: tarea.descripcion,
                            estado: tarea.estado, // Agrega el estado de la tarea
                        }
                    }), {}),
                    columns: {
                        'column-1': {
                            id: 'column-1',
                            title: 'Pendiente',
                            taskIds: [],
                        },
                        'column-2': {
                            id: 'column-2',
                            title: 'En Proceso',
                            taskIds: [],
                        },
                        'column-3': {
                            id: 'column-3',
                            title: 'Completada',
                            taskIds: [],
                        },
                    },
                    columnOrder: ['column-1', 'column-2', 'column-3'],
                };

                // Asigna las tareas a las columnas correspondientes
                moduleData.tareas.forEach(tarea => {
                    const columnId = tarea.estado === 'PENDIENTE' ? 'column-1' :
                        tarea.estado === 'EN_PROGRESO' ? 'column-2' :
                            tarea.estado === 'COMPLETADA' ? 'column-3' : null;
                    if (columnId) {
                        formattedData.columns[columnId].taskIds.push(tarea.id.toString());
                        console.log("parav ver error::"+formattedData);
                    }
                });

                setData(formattedData);
            } catch (error) {
                console.error('Error al obtener las tareas:', error);
            }
        };
        // Llamada a la API para obtener el nombre del proyecto



        fetchTasks();

    }, []);

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

    const handleDateChange = async (taskId, newDate) => {
        try {
            const response = await axios.patch(`/api/tareas/${taskId}`, { fechaFin: newDate });
            const updatedTask = response.data;
            setData(prevData => ({
                ...prevData,
                tasks: { ...prevData.tasks, [updatedTask.id]: updatedTask }
            }));
        } catch (error) {
            console.error('Error actualizando la fecha de la tarea:', error);
        }
    };
    const handleCreate = (newTask) => {
        // Lógica para agregar una nueva tarea
        const newTaskId = (Math.max(...Object.keys(data.tasks).map(Number)) + 1).toString(); // Generar un nuevo ID
        setData((prevData) => ({
            ...prevData,
            tasks: {
                ...prevData.tasks,
                [newTaskId]: newTask
            },
            columns: {
                ...prevData.columns,
                'column-1': {
                    ...prevData.columns['column-1'],
                    taskIds: [...prevData.columns['column-1'].taskIds, newTaskId]
                }
            }
        }));
        setIsModalOpen(false); // Cerrar el modal después de crear la tarea
    };
    const CreateElementModal = ({ open, onCreate, onCancel }) => {
        const [newTask, setNewTask] = useState({ title: '', description: '' });

        const handleSubmit = () => {
            if (newTask.title && newTask.description) {
                onCreate(newTask);  // This calls the handleCreate function passed as a prop
            }
        };

        return (
            <Modal visible={open} onCancel={onCancel} onOk={handleSubmit}>
                {/* Form inputs to set newTask */}
            </Modal>
        );
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
                    await axios.put(`http://localhost:8080/api/modulos/${moduloId}/tareas/${draggableId}/estado?nuevoEstado=${nuevoEstado}`);

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
    });

    if (!data) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }


    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 20}}>
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined/>}
                    onClick={() => navigate(-1)}
                    style={{padding: '10px 20px'}} // Ajusta el padding aquí
                >
                    Volver
                </Button>
                <span style={{marginLeft: 8}}></span> {/* Texto al lado del botón */}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Row gutter={16}>
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

                        return (
                            <Col key={column.id} span={8}>
                                <h2>{column.title}</h2>
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
                                                            ref={draggableProvided.innerRef}
                                                            {...draggableProvided.draggableProps}
                                                            {...draggableProvided.dragHandleProps}
                                                            className="task-card"
                                                            actions={[
                                                                <DeleteOutlined key="delete"
                                                                                onClick={() => handleDelete(task.id)}/>,
                                                                <ClockCircleOutlined key="clock"
                                                                                     onClick={() => handleDateChange(task.id, moment().format('YYYY-MM-DD'))}/>
                                                            ]}
                                                        >
                                                            <Card.Meta title={task.title}
                                                                       description={task.description}/>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                        );
                    })}
                </Row>
            </DragDropContext>

            <CreateElementModal
                open={isModalOpen}
                onCreate={handleCreate}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default KanbanBoard;
