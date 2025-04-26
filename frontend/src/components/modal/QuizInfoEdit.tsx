import React, { useEffect } from 'react';
import { Modal, Input, DatePicker, Form, FormInstance } from 'antd';
import { Dayjs } from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export interface QuizInfoType {
    title: string;
    description: string;
    timeRange: Dayjs[]
}

interface QuizModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    formData: FormInstance<any>;
    initialValue?: QuizInfoType
}

const NewQuizCreate: React.FC<QuizModalProps> = ({ open, onOk, onCancel, formData, initialValue }) => {
    useEffect(() => {
        if (open && initialValue) {
            // 这里主动同步最新的初始化值到表单
            formData.setFieldsValue(initialValue);
        }
    }, [open, initialValue, formData]);


    return (
        <div>
            <Modal
                open={open}
                title="问卷信息"
                onOk={onOk}
                onCancel={onCancel}
                okText="确定"
                cancelText="取消"
                destroyOnClose
            >
                <Form
                    layout="vertical"
                    form={formData}
                    initialValues={initialValue}
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

