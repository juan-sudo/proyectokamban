import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';  // Importar componentes de Ant Design
import { getProyectos } from '../services/api';

const Proyectos = () => {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const data = await getProyectos();
                setProyectos(data);
            } catch (error) {
                console.error('Error al cargar los proyectos:', error);
            }
        };

        fetchProyectos();
    }, []);

    return (
        <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={proyectos}
            renderItem={proyecto => (
                <List.Item>
                    <Card title={proyecto.nombre}>
                        {proyecto.descripcion}
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default Proyectos;
