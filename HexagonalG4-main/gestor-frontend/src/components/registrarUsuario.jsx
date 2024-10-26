import Swal from 'sweetalert2';
import axios from 'axios';
import React,{ useEffect, useState } from 'react';
import "../index.css";
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
    Space
} from 'antd';
import {

    FolderOutlined,

    UserOutlined,


} from '@ant-design/icons';
import dayjs from 'dayjs';
const pearlescentColors = [
    '#f4f1de', '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f',
    '#d3d3d3', '#e6e6fa', '#faf0e6', '#dcdcdc', '#ffebcd'
];



function ProyectoList() {
    const [proyectos, setProyectos] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [form] = Form.useForm(); // Instancia de `form`

    useEffect(() => {


        console.log("aqui"+proyectos)
    }, []);






    const handleOk = () => {
        form.validateFields().then(async (values) => {
            if (values.fechaNacimiento) {
                values.fechaNacimiento = values.fechaNacimiento.format('YYYY-MM-DD');
            }

            let url = `${backendUrl}/api/usuarios`;

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

            <Row gutter={[16, 16]}
                 style={{


                     minWidth: '600px',
                     transition: 'background-color 0.3s ease',

                     color:'#656f7d',
                     fontSize:'12px'

                 }}>
                <Col span={24} style={{ padding: '16px', fontSize:23 }}>
                    <FolderOutlined style={{paddingRight:5,paddingLeft:5}} />
                    <UserOutlined  style={{paddingRight:5,paddingLeft:10}} />
                    <span>Registrar usuario</span>
                </Col>
            </Row>

            {/* Lista de tareas (sin tabla) */}
            <div className="task-list">


                        <Row  gutter={[16, 16]}
                             style={{
                                 borderBottom: '1px solid #d9d9d9',
                                 cursor: "pointer",
                                 minWidth: '600px',
                                 transition: 'background-color 0.3s ease',
                                 paddingBottom: '13px',
                                 color: '#656f7d',
                                 fontSize: '12px'
                             }}
                        >
                            <Col span={12}>
                                <Form form={form} layout="vertical">
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="nombres"
                                                label="Nombres"
                                                rules={[
                                                    { required: true, message: 'Ingrese nombres' },
                                                    { min: 2, message: 'Debe contener al menos 2 caracteres' },
                                                    { pattern: /^[A-Za-z\s]+$/, message: 'Solo se permiten letras' },
                                                ]}
                                            >
                                                <Input placeholder="Nombres" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="apellidoPaterno"
                                                label="Apellido Paterno"
                                                rules={[
                                                    { required: true, message: 'Ingrese el Apellido Paterno' },
                                                    { min: 2, message: 'Debe contener al menos 2 caracteres' },
                                                    { pattern: /^[A-Za-z\s]+$/, message: 'Solo se permiten letras' },
                                                ]}
                                            >
                                                <Input placeholder="Apellido Paterno" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="apellidoMaterno"
                                                label="Apellido Materno"
                                                rules={[
                                                    { required: true, message: 'Ingrese Apellido Materno' },
                                                    { min: 2, message: 'Debe contener al menos 2 caracteres' },
                                                    { pattern: /^[A-Za-z\s]+$/, message: 'Solo se permiten letras' },
                                                ]}
                                            >
                                                <Input placeholder="Apellido Materno" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>

                                        <Col span={8}>
                                            <Form.Item
                                                name="fechaNacimiento"
                                                label="Fecha de Nacimiento"
                                                rules={[
                                                    { required: true, message: 'Seleccione una fecha de nacimiento' },
                                                    {
                                                        validator: (_, value) =>
                                                            !value || dayjs(value).isBefore(dayjs(), 'day')
                                                                ? Promise.resolve()
                                                                : Promise.reject(new Error('La fecha debe ser menor que la actual')),
                                                    },
                                                ]}
                                            >
                                                <DatePicker format="YYYY-MM-DD" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="telefono"
                                                label="Phone"
                                                rules={[
                                                    { required: true, message: 'Ingrese el teléfono' },
                                                    { pattern: /^[0-9]+$/, message: 'Solo se permiten números' },
                                                    { len: 9, message: 'Debe contener exactamente 9 dígitos' }
                                                ]}
                                            >
                                                <Input placeholder="Teléfono" maxLength={9} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="genero"
                                                label="Género"
                                                rules={[{ required: true, message: 'Seleccione un género' }]}
                                            >
                                                <Select placeholder="Seleccione un género">
                                                    <Option value="F">Mujer</Option>
                                                    <Option value="M">Varón</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Ingrese correo electrónico' },
                                            { type: 'email', message: 'Ingrese un correo electrónico válido' },
                                        ]}
                                    >
                                        <Input placeholder="Correo electrónico" />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label="Contraseña"
                                        rules={[
                                            { required: true, message: 'Ingrese la contraseña' },
                                            { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
                                            {
                                                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-])/,
                                                message: 'La contraseña debe incluir letras, números y caracteres especiales'
                                            },
                                        ]}
                                    >
                                        <Input.Password placeholder="Contraseña" />
                                    </Form.Item>

                                    <Form.Item
                                        name="passwordConfirm"
                                        label="Repite Contraseña"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Repita la contraseña' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                                                }
                                            })
                                        ]}
                                    >
                                        <Input.Password placeholder="Repite la contraseña" />
                                    </Form.Item>

                                    <Row gutter={[16, 16]}>
                                        <Col span={8}></Col>
                                        <Col span={8}>
                                            <Form.Item>
                                                <Button type="primary" onClick={handleOk}>
                                                    Registrarte
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}></Col>
                                    </Row>
                                </Form>
                            </Col>



                </Row>

                {/* Aquí puedes agregar los encabezados de las columnas si es necesario */}


                {/* Renderiza las tareas */}


                {/* Si no está colapsado, renderiza el contenido adicional */}


            </div>






        </>
    );

}

export default ProyectoList;
