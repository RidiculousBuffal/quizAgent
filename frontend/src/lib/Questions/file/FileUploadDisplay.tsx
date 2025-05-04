import React from 'react';
import {List, Typography, Button, Space} from 'antd';
import {FileOutlined, DownloadOutlined} from '@ant-design/icons';
import {FileUploadQuestion, FileUploadAnswer} from './FileUploadQuestion.ts';
import '../base.css';
import {Markdown} from "@lobehub/ui";

const {Text, Paragraph} = Typography;

interface FileUploadDisplayProps {
    question: FileUploadQuestion;
    answer: FileUploadAnswer | null;
}

const FileUploadDisplay: React.FC<FileUploadDisplayProps> = ({
                                                                 question,
                                                                 answer
                                                             }) => {
    // 确保 answer 存在，如果为 null 或 undefined 则使用默认值
    const safeAnswer: FileUploadAnswer = answer || {
        fileUrls: [],
        fileNames: [],
        fileSizes: [],
        fileTypes: []
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    // 处理下载文件
    const handleDownload = (url: string, fileName: string) => {
        // 创建一个隐藏的 a 标签
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // 设置下载的文件名
        a.download = fileName;

        // 添加到文档并点击
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
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

            {safeAnswer.fileUrls.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={safeAnswer.fileUrls.map((url, index) => ({
                        url,
                        name: safeAnswer.fileNames[index],
                        size: safeAnswer.fileSizes[index],
                        type: safeAnswer.fileTypes[index],
                        index
                    }))}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button
                                    key="download"
                                    type="primary"
                                    icon={<DownloadOutlined/>}
                                    onClick={() => handleDownload(item.url, item.name)}
                                >
                                    下载
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<FileOutlined style={{fontSize: 24}}/>}
                                title={
                                    <Space>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            {item.name}
                                        </a>
                                    </Space>
                                }
                                description={`${formatFileSize(item.size)} · ${item.type}`}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Text type="secondary">未上传文件</Text>
            )}

            {safeAnswer.markdown_details && (
                <div style={{marginTop: 16}}>
                    <Text strong>文件内容预览:</Text>
                    <div style={{
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        padding: '16px',
                        marginTop: '8px',
                        backgroundColor: '#f5f5f5',
                        maxHeight: '300px',
                        overflow: 'auto'
                    }}>
                        <Paragraph>
                            <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                                    <Markdown allowHtml={true} children={safeAnswer.markdown_details.toString()}
                                              fullFeaturedCodeBlock={true} style={{maxWidth: "600px"}} lineHeight={0.1}
                                              marginMultiple={0.1} headerMultiple={0.1}></Markdown>
                            </pre>
                        </Paragraph>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploadDisplay;