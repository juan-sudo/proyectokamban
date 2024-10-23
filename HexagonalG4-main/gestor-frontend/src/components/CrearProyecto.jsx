import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';  // Importar componentes de Ant Design
import { createProyecto } from '../services/api';

const CrearProyecto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    // Función para manejar la creación del proyecto
    const handleSubmit = async () => {
        // Crear el objeto del proyecto
        const nuevoProyecto = {
            nombre,
            descripcion,
            // Omitimos el estado para que el backend maneje su valor por defecto
            responsable: null,  // Si deseas agregar lógica para el responsable
            tareas: []  // Puedes dejarlo como una lista vacía si no hay tareas iniciales
        };

        try {
            // Enviar la solicitud de creación
            await createProyecto(nuevoProyecto);
            alert('Proyecto creado con éxito');

            // Limpiar los campos después de crear el proyecto
            setNombre('');
            setDescripcion('');
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
            alert('Hubo un error al crear el proyecto.');
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Nombre del Proyecto" required>
                <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingrese el nombre del proyecto"
                    required
                />
            </Form.Item>
            <Form.Item label="Descripción" required>
                <Input.TextArea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ingrese la descripción del proyecto"
                    required
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Crear Proyecto
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CrearProyecto;
