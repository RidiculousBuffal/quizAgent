import React, {useState} from 'react';
import {Upload, Button, Typography, List, Progress} from 'antd';
import {UploadOutlined, FileOutlined, DeleteOutlined} from '@ant-design/icons';
import {FileUploadQuestion, FileUploadAnswer} from './FileUploadQuestion.ts';

import '../base.css';
import {uploadFile} from "../../../api/uploadapi.ts";

const {Text} = Typography;

interface FileUploadPreviewProps {
    question: FileUploadQuestion;
    value: FileUploadAnswer | null;
    onChange: (value: FileUploadAnswer) => void;
    showValidation?: boolean;
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({
                                                                 question,
                                                                 value,
                                                                 onChange,
                                                                 showValidation = false
                                                             }) => {
    // 确保 value 存在，如果为 null 或 undefined 则使用默认值
    const safeValue: FileUploadAnswer = value || {
        fileUrls: [],
        fileNames: [],
        fileSizes: [],
        fileTypes: []
    };

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // 验证结果
    const validationResult = showValidation ? question.validate(safeValue) : true;
    const isValid = typeof validationResult === 'boolean' ? validationResult : validationResult.isValid;
    const errorMessage = typeof validationResult === 'boolean' ? '' : validationResult.message;

    // 将文本文件转换为Markdown的函数
    const convertToMarkdown = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            resolve("")
        });
    };

    const handleFileUpload = async (file: File) => {
        // 检查文件类型
        if (question.allowedFileTypes.length > 0) {
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (!question.allowedFileTypes.includes(fileExtension)) {
                setError(`不支持的文件类型，请上传 ${question.allowedFileTypes.join(', ')} 格式的文件`);
                return false;
            }
        }

        // 检查文件大小
        if (file.size > question.maxFileSize) {
            setError(`文件大小超过限制，最大允许 ${question.maxFileSize / (1024 * 1024)} MB`);
            return false;
        }

        // 检查文件数量
        if (safeValue.fileUrls.length >= question.maxFiles) {
            setError(`最多只能上传 ${question.maxFiles} 个文件`);
            return false;
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const fileUrl = await uploadFile({
                file,
                onProgress: (percent) => setProgress(percent)
            });

            let markdownContent = safeValue.markdown_details;

            // 如果是文本文件并且设置了转换为Markdown
            if (question.convertToMarkdown &&
                (file.type.includes('text') ||
                    file.name.endsWith('.txt') ||
                    file.name.endsWith('.pdf'))) {
                try {
                    // 执行转换
                    markdownContent = await convertToMarkdown(file);
                } catch (e) {
                    console.error('Failed to convert file to markdown:', e);
                }
            }

            // 创建更新后的值
            const newValue = {
                fileUrls: [...safeValue.fileUrls, fileUrl],
                fileNames: [...safeValue.fileNames, file.name],
                fileSizes: [...safeValue.fileSizes, file.size],
                fileTypes: [...safeValue.fileTypes, file.type],
                markdown_details: markdownContent
            };

            onChange(newValue);
            return false; // 阻止默认上传行为
        } catch (error: any) {
            setError(error.message || '文件上传失败，请重试');
            return false;
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = (index: number) => {
        const newValue = {
            fileUrls: safeValue.fileUrls.filter((_, i) => i !== index),
            fileNames: safeValue.fileNames.filter((_, i) => i !== index),
            fileSizes: safeValue.fileSizes.filter((_, i) => i !== index),
            fileTypes: safeValue.fileTypes.filter((_, i) => i !== index),
            markdown_details: safeValue.markdown_details
        };
        onChange(newValue);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="question-preview">
            <div className="question-title">
                {question.title}
                {question.isRequired && <span className="required-mark">*</span>}
            </div>

            {question.description && (
                <div className="question-description">{question.description}</div>
            )}

            <div style={{marginBottom: 16}}>
                <Upload
                    beforeUpload={handleFileUpload}
                    fileList={[]}
                    showUploadList={false}
                    disabled={uploading || safeValue.fileUrls.length >= question.maxFiles}
                >
                    <Button
                        icon={<UploadOutlined/>}
                        loading={uploading}
                        disabled={safeValue.fileUrls.length >= question.maxFiles}
                    >
                        {uploading ? '上传中...' : '上传文件'}
                    </Button>
                </Upload>

                {uploading && <Progress percent={progress} style={{marginTop: 8}}/>}

                {error && <Text type="danger" style={{display: 'block', marginTop: 8}}>{error}</Text>}

                <div style={{marginTop: 8}}>
                    {question.allowedFileTypes.length > 0 && (
                        <Text type="secondary" style={{display: 'block'}}>
                            支持的文件类型: {question.allowedFileTypes.join(', ')}
                        </Text>
                    )}

                    <Text type="secondary" style={{display: 'block'}}>
                        最大文件大小: {question.maxFileSize / (1024 * 1024)} MB, 最多上传 {question.maxFiles} 个文件
                    </Text>
                </div>
            </div>

            {safeValue.fileUrls.length > 0 && (
                <List
                    itemLayout="horizontal"
                    dataSource={safeValue.fileUrls.map((url, index) => ({
                        url,
                        name: safeValue.fileNames[index],
                        size: safeValue.fileSizes[index],
                        type: safeValue.fileTypes[index],
                        index
                    }))}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button
                                    key="delete"
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined/>}
                                    onClick={() => handleRemoveFile(item.index)}
                                >
                                    删除
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<FileOutlined style={{fontSize: 24}}/>}
                                title={<a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>}
                                description={`${formatFileSize(item.size)} · ${item.type}`}
                            />
                        </List.Item>
                    )}
                />
            )}

            {showValidation && !isValid && (
                <Text type="danger" style={{display: 'block', marginTop: 8}}>
                    {errorMessage}
                </Text>
            )}
        </div>
    );
};

export default FileUploadPreview;