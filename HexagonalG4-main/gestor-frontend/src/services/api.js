import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Cambia esta URL según el endpoint de tu backend

// Configurar Axios para trabajar con un proxy
const instance = axios.create({
    baseURL: API_URL
    ,
    proxy: {
      host: 'mello.inei.gob.pe',  // Host del proxy
    port: 3128,  // Puerto del proxy
    }
});

// Obtener todos los proyectos
export const getProyectos = async () => {
    try {
        const response = await instance.get(`/proyectos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        throw error;
    }
};

// Crear un nuevo proyecto
export const createProyecto = async (proyecto) => {
    try {
        const response = await instance.post(`/proyectos`, proyecto);
        return response.data;
    } catch (error) {
       // console.error('Error al crear el proyecto:', error);
        //throw error;

        if (error.response) {
            console.error('Error de respuesta:', error.response.data);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error al crear el proyecto:', error.message);
        }
        throw error;

    }
};
