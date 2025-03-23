import React from 'react';
import {Form, Input, Switch, Button, Space} from 'antd';
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {SingleChoiceQuestion} from './radio.ts';
import './radio.css'
import '../base.css'
import {BaseQuestionEditParams} from "../BaseQuestion.ts";
interface SingleChoiceEditProps  extends BaseQuestionEditParams{
    question: SingleChoiceQuestion;
    onChange: (question: SingleChoiceQuestion) => void;
}

const SingleRadioEdit: React.FC<SingleChoiceEditProps> = ({question, onChange}) => {
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        question.title = e.target.value;
        onChange(question);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        question.description = e.target.value;
        onChange(question);
    };

    const handleRequiredChange = (checked: boolean) => {
        question.isRequired = checked;
        onChange(question);
    };

    const handleOptionTextChange = (id: number, text: string) => {
        const option = question.options.find(opt => opt.id === id);
        if (option) {
            option.text = text;
            onChange(question);
        }
    };

    const addOption = () => {
        question.addOption('新选项');
        onChange(question);
    };

    const removeOption = (id: number) => {
        question.removeOption(id);
        onChange(question);
    };

    return (
        <div  style={{width:"1000px"}} className="question-edit">
            <Form layout="vertical">
                <Form.Item label="问题标题">
                    <Input value={question.title} onChange={handleTitleChange}/>
                </Form.Item>

                <Form.Item label="问题描述">
                    <Input value={question.description} onChange={handleDescriptionChange}/>
                </Form.Item>

                <Form.Item label="是否必填">
                    <Switch checked={question.isRequired} onChange={handleRequiredChange}/>
                </Form.Item>

                <Form.Item label="选项">
                    {question.options.map(option => (
                        <Space key={option.id} style={{display: 'flex', marginBottom: 8}}>
                            <Input
                                value={option.text}
                                onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                                style={{width: '300px'}}
                            />
                            <Button
                                type="text"
                                icon={<DeleteOutlined/>}
                                onClick={() => removeOption(option.id)}
                                disabled={question.options.length <= 1}
                            />
                        </Space>
                    ))}

                    <Button
                        type="dashed"
                        onClick={addOption}
                        icon={<PlusOutlined/>}
                        style={{width: '300px'}}
                    >
                        添加选项
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SingleRadioEdit;