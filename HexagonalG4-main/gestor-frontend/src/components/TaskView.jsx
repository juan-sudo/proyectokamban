import React, { useState, useEffect } from 'react';

function TaskView() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Supongamos que tu backend expone un endpoint /api/tareas para obtener las tareas
        fetch('/api/tareas')
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error('Error al obtener las tareas:', error));
    }, []);

    return (
        <div>
            <h2>Lista de Tareas</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.nombre}</li>
                ))}
            </ul>
        </div>
    );
}

export default TaskView;
