import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";
const { Title } = Typography;
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useN
import {
    DatePicker,

    Button,

    Row,
    Col,

    Input,
    Modal,
    Form,
    Select,
    Space, Typography, Divider
} from 'antd';
import {

    FolderOutlined,

    UserOutlined,


} from '@ant-design/icons';
import dayjs from 'dayjs';
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
                        'Content-Type': 'application/json'
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
            <div className="login-container" >


                {/* Lista de tareas (sin tabla) */}
                <div className="task-list">

                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Title style={{textAlign: 'center'}}>Crea tu cuenta </Title>
                    </div>


                    <Form.Item wrapperCol={{span: 30}}
                               style={{marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0ede6'}}>
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
                                    <Col span={24}>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                onClick={handleOk}
                                                style={{width: '100%'}} // Esto hace que el botón ocupe todo el ancho disponible
                                            >
                                                Registrarte
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>


                                <Row gutter={[16, 16]}>
                                    <Col span={24} style={{textAlign: 'center'}}>
                                        <span onClick={() => window.location.href = '/'} style={{fontSize:19, color:"green"}}>

                                            ¿Ya tienes cuenta?

                                        </span>
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
