import React, {useMemo} from 'react';
import {Row, Col, Table, Typography, Card, Statistic} from 'antd';
import {FileOutlined, UploadOutlined, FileTextOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import {FileUploadQuestion} from './FileUploadQuestion.ts';
import {BaseStatisticsProps} from '../BaseQuestion.ts';

const {Title, Text} = Typography;

interface FileUploadStatisticsProps extends BaseStatisticsProps {
    question: FileUploadQuestion;
    answers: Array<{
        user: string;
        parsedAnswer: {
            fileUrls: string[];
            fileNames: string[];
            fileSizes: number[];
            fileTypes: string[];
            markdown_details?: string;
        };
    }>;
}

const FileUploadStatistics: React.FC<FileUploadStatisticsProps> = ({question, answers}) => {
    // 计算统计数据
    const statistics = useMemo(() => {
        const totalFiles = answers.reduce((sum, answer) =>
            sum + (answer.parsedAnswer?.fileUrls?.length || 0), 0);

        const totalSize = answers.reduce((sum, answer) =>
            sum + (answer.parsedAnswer?.fileSizes?.reduce((s, size) => s + size, 0) || 0), 0);

        // 统计文件类型分布
        const fileTypeCount: Record<string, number> = {};
        answers.forEach(answer => {
            if (answer.parsedAnswer?.fileTypes) {
                answer.parsedAnswer.fileTypes.forEach(type => {
                    fileTypeCount[type] = (fileTypeCount[type] || 0) + 1;
                });
            }
        });

        // 统计哪些用户提交了文件
        const submittedUsers = answers.filter(answer =>
            answer.parsedAnswer?.fileUrls?.length > 0
        ).map(answer => answer.user);

        // 计算应答率
        const responseRate = answers.length > 0
            ? submittedUsers.length / answers.length * 100
            : 0;

        return {
            totalFiles,
            totalSize,
            fileTypeCount,
            submittedUsers,
            responseRate,
            averageFilesPerUser: submittedUsers.length > 0
                ? totalFiles / submittedUsers.length
                : 0
        };
    }, [answers]);

    // 表格列定义 - 文件类型统计
    const fileTypeColumns: ColumnsType<any> = [
        {
            title: '文件类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: '百分比',
            dataIndex: 'percentage',
            key: 'percentage',
        }
    ];

    // 表格数据 - 文件类型统计
    const fileTypeData = Object.entries(statistics.fileTypeCount).map(([type, count]) => ({
        type,
        count,
        percentage: statistics.totalFiles > 0
            ? `${(count / statistics.totalFiles * 100).toFixed(1)}%`
            : '0%'
    }));

    // 表格列定义 - 用户提交统计
    const userSubmissionColumns: ColumnsType<any> = [
        {
            title: '用户',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: '文件数',
            dataIndex: 'fileCount',
            key: 'fileCount',
        }
    ];

    // 表格数据 - 用户提交统计
    const userSubmissionData = answers.map(answer => ({
        user: answer.user,
        fileCount: answer.parsedAnswer?.fileUrls?.length || 0
    }));

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div>
            <Title level={4}>{question.title} - 文件上传统计</Title>

            <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="已上传文件总数"
                            value={statistics.totalFiles}
                            prefix={<FileOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总文件大小"
                            value={formatFileSize(statistics.totalSize)}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="答题率"
                            value={statistics.responseRate.toFixed(1)}
                            suffix="%"
                            prefix={<UploadOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Title level={5}>文件类型分布</Title>
                    <Table
                        dataSource={fileTypeData}
                        columns={fileTypeColumns}
                        pagination={false}
                        rowKey="type"
                    />
                </Col>
                <Col span={12}>
                    <Title level={5}>用户提交情况</Title>
                    <Table
                        dataSource={userSubmissionData}
                        columns={userSubmissionColumns}
                        pagination={false}
                        rowKey="user"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default FileUploadStatistics;