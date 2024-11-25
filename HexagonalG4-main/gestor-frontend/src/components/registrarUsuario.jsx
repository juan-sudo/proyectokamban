import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";
const { Title } = Typography;
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useN

import {Button, Row, Col,

    Input,
    Modal,
    Form,
    Select,
    Space, Typography, Divider
} from 'antd';
import googleIcon from "../assets/googleicon.svg";
const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];



function RegistrarUsuario(onLoginR) {
    const [proyectos, setProyectos] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [form] = Form.useForm(); // Instancia de `form`

    useEffect(() => {


        console.log("aqui"+proyectos)
    }, []);





    const responseGoogle = async (response) => {
        if (response.error) {
            console.error('Error en el login con Google:', response.error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo iniciar sesión con Google.',
                confirmButtonText: 'OK',
            });
        } else {
            const googleData = {
                token: response.tokenId,              // Token proporcionado por Google
                email: response.profileObj.email,     // Email del usuario
                nombres: response.profileObj.givenName,
                apellidoPaterno:response.profileObj.familyName// Nombre completo del usuario

            };

            console.log('Datos de Google:', googleData);

            // Registrar los datos de Google en el backend
            let url = `${backendUrl}/api/v1/autenticacion/signupuser`;

            try {
                const result = await axios.post(url, googleData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Mostrar mensaje de éxito al registrar
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'El usuario se ha registrado correctamente con Google.',
                    confirmButtonText: 'OK',
                });
            } catch (error) {
                console.error('Error registrando usuario con Google:', error);

                // Obtener mensaje de error del servidor
                const errorMessage = error.response?.data?.error || 'Ocurrió un error al registrar el usuario con Google.';

                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonText: 'OK',
                });
            }
        }
    };



    const navigate = useNavigate();



    const handleOk = () => {
        form.validateFields().then(async (values) => {
            if (values.fechaNacimiento) {
                values.fechaNacimiento = values.fechaNacimiento.format('YYYY-MM-DD');
            }

            let url = `${backendUrl}/api/v1/autenticacion/signupuser`;

            console.log("Datos que se envían:", values);

            try {
                await axios.post(url, values, {
                    headers: {
                        'Content-Type': 'application/json',

                    }
                });
                // Muestra la alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'El usuario se ha registrado correctamente.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    // Resetea el formulario y cierra el modal solo si se acepta la alerta
                    form.resetFields();
                    setIsModalOpen(false);
                });

                //fetchProyectos(); // Descomenta si necesitas esta función
            } catch (error) {
                console.error("Error creando usuario:", error);

                // Captura el mensaje de error específico
                const errorMessage = error.response?.data?.error || 'Ocurrió un error al registrar el usuario.';

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage, // Muestra el mensaje de error específico
                    confirmButtonText: 'OK',
                });
            }
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












    return (

        <>
            <div className="login-container"
                 style={{
                     background: 'linear-gradient(to right, RGB(149,200,199), RGB(19,41,45)', // Gradiente de color
                     backgroundSize: 'cover',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center',
                 }}
            >


                {/* Lista de tareas (sin tabla) */}
                <div className="registrase">

                    <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginBottom:20}}>
                        <Title style={{textAlign: 'center', fontWeight:700, fontSize:35}}>Regístate ahora en segundos! </Title>
                    </div>



                    <Row gutter={[16, 16]}
                         style={{

                             cursor: "pointer",

                             transition: 'background-color 0.3s ease',
                             paddingBottom: '13px',
                             color: '#656f7d',
                             fontSize: '12px'
                         }}
                    >

                        <Col span={24}>

                            <Form form={form} layout="vertical">
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="nombres"
                                            label="Nombres"
                                            rules={[
                                                {required: true, message: 'Ingrese nombres'},
                                                {min: 2, message: 'Debe contener al menos 2 caracteres'},
                                                {pattern: /^[A-Za-z\s]+$/, message: 'Solo se permiten letras'},
                                            ]}
                                        >
                                            <Input placeholder="Nombres"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="apellidoPaterno"
                                            label="Apellido Paterno"
                                            rules={[
                                                {required: true, message: 'Ingrese el Apellido Paterno'},
                                                {min: 2, message: 'Debe contener al menos 2 caracteres'},
                                                {pattern: /^[A-Za-z\s]+$/, message: 'Solo se permiten letras'},
                                            ]}
                                        >
                                            <Input placeholder="Apellido Paterno"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="apellidoMaterno"
                                            label="Apellido Materno"
                                            rules={[
                                                {required: true, message: 'Ingrese Apellido Materno'},
                                                {min: 2, message: 'Debe contener al menos 2 caracteres'},
                                                {pattern: /^[A-Za-z\s]+$/, message: 'Solo se permiten letras'},
                                            ]}
                                        >
                                            <Input placeholder="Apellido Materno"/>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>

                                    <Col span={10}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                {required: true, message: 'Ingrese correo electrónico'},
                                                {type: 'email', message: 'Ingrese un correo electrónico válido'},
                                            ]}
                                        >
                                            <Input placeholder="Correo electrónico"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="telefono"
                                            label="Phone"
                                            rules={[
                                                {required: true, message: 'Ingrese el teléfono'},
                                                {pattern: /^[0-9]+$/, message: 'Solo se permiten números'},
                                                {len: 9, message: 'Debe contener exactamente 9 dígitos'}
                                            ]}
                                        >
                                            <Input placeholder="Teléfono" maxLength={9}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="genero"
                                            label="Género"
                                            rules={[{required: true, message: 'Seleccione un género'}]}
                                        >
                                            <Select placeholder="Seleccione un género">
                                                <Option value="F">Mujer</Option>
                                                <Option value="M">Varón</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="password"
                                            label="Contraseña"
                                            rules={[
                                                {required: true, message: 'Ingrese la contraseña'},
                                                {min: 8, message: 'La contraseña debe tener al menos 8 caracteres'},
                                                {
                                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-])/,
                                                    message: 'La contraseña debe incluir letras, números y caracteres especiales'
                                                },
                                            ]}
                                        >
                                            <Input.Password placeholder="Contraseña"/>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="passwordConfirm"
                                            label="Repite Contraseña"
                                            dependencies={['password']}
                                            rules={[
                                                {required: true, message: 'Repita la contraseña'},
                                                ({getFieldValue}) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Las contraseñas no coinciden'));
                                                    }
                                                })
                                            ]}
                                        >
                                            <Input.Password placeholder="Repite la contraseña"/>
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <Row gutter={[16, 16]}>
                                    <Col span={6}>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                onClick={handleOk}
                                                style={{width: '100%', height:35, fontWeight:500}} // Esto hace que el botón ocupe todo el ancho disponible
                                            >
                                                Registrarse
                                            </Button>

                                        </Form.Item>
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'left', marginTop:8 }}>
                                        <span style={{marginRight:10}}>
                                            o
                                        </span>
    <span style={{color:'#038fde', fontWeight:700}} onClick={() => window.location.href = '/' }>
        Iniciar sesion
    </span>
                                    </Col>

                                </Row>



                                <Row gutter={[16, 16]}>
                                <Col span={12} style={{textAlign: 'center'}}>

                                    </Col>

                                    <Col span={12} style={{textAlign: 'center'}}>




                                    </Col>
                                </Row>

                            </Form>
                        </Col>


                    </Row>


                </div>

            </div>
        </>

    );

}

export default RegistrarUsuario;
