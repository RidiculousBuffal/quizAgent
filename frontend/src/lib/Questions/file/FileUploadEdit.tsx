import React from 'react';
import {Form, Input, Switch, InputNumber, Select, Button} from 'antd';
import {FileUploadQuestion} from './FileUploadQuestion.ts';
import '../base.css';

interface FileUploadEditProps {
    question: FileUploadQuestion;
    onChange: (question: FileUploadQuestion) => void;
}

const FileUploadEdit: React.FC<FileUploadEditProps> = ({question, onChange}) => {
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

    const handleMaxFileSizeChange = (value: number | null) => {
        question.maxFileSize = value || 10 * 1024 * 1024; // 默认10MB
        onChange(question);
    };

    const handleMaxFilesChange = (value: number | null) => {
        question.maxFiles = value || 1;
        onChange(question);
    };

    const handleAllowedFileTypesChange = (values: string[]) => {
        question.allowedFileTypes = values;
        onChange(question);
    };

    const handleConvertToMarkdownChange = (checked: boolean) => {
        question.convertToMarkdown = checked;
        onChange(question);
    };

    // 常见文件类型选项
    const fileTypeOptions = [
        {label: 'PDF文件 (.pdf)', value: '.pdf'},
        {label: 'Word文档 (.docx)', value: '.docx'},
        {label: 'Excel表格 (.xlsx)', value: '.xlsx'},
        {label: 'PowerPoint演示文稿 (.pptx)', value: '.pptx'},
        {label: '文本文件 (.txt)', value: '.txt'},
        {label: '图片文件 (.jpg)', value: '.jpg'},
        {label: '图片文件 (.png)', value: '.png'},
        {label: '压缩文件 (.zip)', value: '.zip'},
    ];

    return (
        <div style={{width: "1000px"}} className="question-edit">
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

                <Form.Item label="最大文件大小 (MB)">
                    <InputNumber
                        min={1}
                        max={100}
                        value={question.maxFileSize / (1024 * 1024)}
                        onChange={(value) => handleMaxFileSizeChange(value ? value * 1024 * 1024 : null)}
                    />
                </Form.Item>

                <Form.Item label="最大文件数量">
                    <InputNumber
                        min={1}
                        max={10}
                        value={question.maxFiles}
                        onChange={handleMaxFilesChange}
                    />
                </Form.Item>

                <Form.Item label="允许的文件类型">
                    <Select
                        mode="multiple"
                        placeholder="不限制文件类型"
                        value={question.allowedFileTypes}
                        onChange={handleAllowedFileTypesChange}
                        style={{width: '100%'}}
                        options={fileTypeOptions}
                    />
                </Form.Item>

                <Form.Item label="将文本文件转换为Markdown">
                    <Switch checked={question.convertToMarkdown} onChange={handleConvertToMarkdownChange}/>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FileUploadEdit;