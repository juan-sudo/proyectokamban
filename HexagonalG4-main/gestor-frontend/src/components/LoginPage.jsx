import React, { useState } from 'react';
import {Form, Input, Button, Card, Typography, message, Divider, Row, Col, DatePicker, Select} from 'antd';
import { UserOutlined, LockOutlined,GoogleOutlined, } from '@ant-design/icons';
import axios from 'axios';  // Usaremos axios para realizar la solicitud POST
import '../index.css';
import googleIcon from '../assets/googleicon.svg';
import dayjs from "dayjs"; // Asegúrate de que la ruta sea correcta


const { Title } = Typography;

const LoginPage = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);

        axios.post('http://localhost:8080/api/v1/autenticacion/signin', {
            email: values.email,
            password: values.password
        })
            .then(response => {
                setLoading(false);
                const token = response.data.token;  // Aquí capturas el token

                if (token) {

                    // Guardamos el token en localStorage para usarlo posteriormente
                    localStorage.setItem('token', token);
                    message.success('Inicio de sesión exitoso');
                    window.location.reload();  // Recargar la página solo si el token es válido
                    onLogin();  // Actualiza el estado de autenticación


                }

            })
            .catch(error => {
                setLoading(false);
                message.error('Usuario o contraseña incorrectos');
            });
    };


    return (
        <div className="login-container"

             style={{
                 background: 'linear-gradient(to right, RGB(149,200,199), RGB(19,41,45)', // Gradiente de color
                 backgroundSize: 'cover',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center',
             }}
        >


            <Card className="login-card">
                <Title level={3} style={{ textAlign: 'center', fontSize:30, fontWeight:700 }}>Bienvenido</Title>
                <Form
                    name="login_form"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}

                >
                    {/* Botón para continuar con Google */}
                    <Form.Item wrapperCol={{ span: 30 }}>
                        <Button
                            type="default"
                            style={{
                                width: '100%',
                                backgroundColor: '#fffff',
                                color: '#373c42',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                height: '40px', // Ajusta la altura según tus necesidades

                            }}

                        >
                            <img
                                src={googleIcon}
                                alt="Google Icon"
                                style={{width: '20px', height: '20px'}}
                            />
                            Continuar con Google
                        </Button>
                    </Form.Item>
                    {/* Línea divisoria */}
                    <Divider style={{borderColor: '#d9d9d9'}}><span style={{color:'#d9d9d9'}}>o</span></Divider>
                    <Form.Item
                        label="Correo Electrónico"
                        name="email"
                        rules={[
                            { required: true, message: 'Por favor ingrese su email' },
                            { type: 'email', message: 'Ingrese un correo válido' } // Valida formato de email
                        ]}
                        labelCol={{ span: 24 }} // Ocupa todo el ancho para que la etiqueta esté arriba
                        wrapperCol={{ span: 24 }} // Asegura que el campo de entrada también ocupe todo el ancho
                    >
                        <Input
                            type="email"
                            prefix={<UserOutlined style={{ color: '#90969e' }} />} // Cambia el color del ícono
                            placeholder="example@gmail.com"
                            style={{
                                height: '40px', // Ajusta la altura según tus necesidades
                                fontSize: '16px', // Aumenta el tamaño de la fuente
                            }}
                        />

                    </Form.Item>



                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[
                            { required: true, message: 'Por favor ingrese su contraseña' },
                            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                        ]}
                        labelCol={{ span: 24 }} // Coloca la etiqueta arriba del campo de entrada
                        wrapperCol={{ span: 24 }} // Ajusta el campo de entrada para que ocupe todo el ancho
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#90969e' }} />} // Cambia el color del ícono
                            placeholder="Contraseña"
                            style={{
                                height: '40px', // Ajusta la altura según tus necesidades
                                fontSize: '16px', // Aumenta el tamaño de la fuente
                            }}
                        />
                    </Form.Item>

                    {/* Enlace para "¿Olvidaste tu contraseña?" */}
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <a href="/reset-password" style={{ color: '#1890ff', fontSize: '14px' }}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={loading}
                            block
                            style={{
                                height: '40px', // Ajusta la altura según tus necesidades
                                fontSize: '16px', // Aumenta el tamaño de la fuente
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Form.Item>

                </Form>
            </Card>


        </div>
    );
};

export default LoginPage;
