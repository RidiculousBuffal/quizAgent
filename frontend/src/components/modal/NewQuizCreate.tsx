import React from 'react';
import { Modal, Input, DatePicker, Form, FormInstance } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface QuizModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    formData: FormInstance<any>
}

const NewQuizCreate: React.FC<QuizModalProps> = ({ open, onOk, onCancel, formData }) => {
    // 处理提交
    // const handleOk = async () => {
    //     try {
    //         const values = await form.validateFields();
    //         // values: { title, description, timeRange }
    //         // 这里可以将数据提交到后端
    //         message.success('创建成功, 数据: ' + JSON.stringify({
    //             ...values,
    //             quizStartTime: values.timeRange ? values.timeRange[0].format('YYYY-MM-DD HH:mm:ss') : '',
    //             quizEndTime: values.timeRange ? values.timeRange[1].format('YYYY-MM-DD HH:mm:ss') : '',
    //         }));
    //         setOpen(false);
    //         form.resetFields();
    //     } catch (err) {
    //         console.error(err);
    //         message.error('创建失败');
    //         form.resetFields();
    //     }
    // };

    // const handleCancel = () => {
    //     setOpen(false);
    //     form.resetFields();
    // };


    return (
        <div>
            <Modal
                open={open}
                title="新建问卷"
                onOk={onOk}
                onCancel={onCancel}
                okText="确定"
                cancelText="取消"
                destroyOnClose
            >
                <Form
                    layout="vertical"
                    form={formData}
                    initialValues={{
                        title: '',
                        description: '',
                        timeRange: ''
                    }}
                >
                    <Form.Item
                        label="问卷标题"
                        name="title"
                        rules={[{ required: true, message: '请输入问卷标题' }]}
                    >
                        <Input placeholder="请输入问卷标题" />
                    </Form.Item>

                    <Form.Item
                        label="问卷描述"
                        name="description"
                        rules={[{ message: '请输入问卷描述' }]}
                    >
                        <TextArea placeholder="请输入问卷描述" rows={4} />
                    </Form.Item>

                    <Form.Item
                        label={
                            <>
                                开始与结束时间&nbsp;
                                <span style={{ color: '#888', fontSize: 12 }}>
                                    （如不填写，默认为当前时间）
                                </span>
                            </>
                        }
                        name="timeRange"
                    >
                        <RangePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            allowClear={true}
                            showTime
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NewQuizCreate;

