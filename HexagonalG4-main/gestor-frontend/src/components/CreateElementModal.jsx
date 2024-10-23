import React from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

const CreateElementModal = ({ open, type, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const handleCreate = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values); // Enviar los datos al componente padre
            })
            .catch((info) => {
                console.log('Error:', info);
            });
    };

    return (
        <Modal
            open={open}
            title={`Crear nuevo ${type}`}
            onCancel={onCancel}
            onOk={handleCreate}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: `Por favor, ingrese el nombre del ${type}` }]}
                >
                    <Input placeholder={`Nombre del ${type}`} />
                </Form.Item>

                {type !== 'subtarea' && (
                    <Form.Item
                        name="descripcion"
                        label="Descripción"
                        rules={[{ required: true, message: `Por favor, ingrese la descripción del ${type}` }]}
                    >
                        <Input.TextArea placeholder={`Descripción del ${type}`} />
                    </Form.Item>
                )}

                <Form.Item
                    name="fechaInicio"
                    label="Fecha de inicio"
                    rules={[{ required: true, message: 'Por favor, seleccione la fecha de inicio' }]}
                >
                    <DatePicker defaultValue={moment()} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="fechaFin"
                    label="Fecha de finalización"
                    rules={[{ required: true, message: 'Por favor, seleccione la fecha de finalización' }]}
                >
                    <DatePicker defaultValue={moment().add(1, 'days')} format="YYYY-MM-DD" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateElementModal;
