import React from 'react';
import { Table, Button, Badge, Typography, Empty, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Text } = Typography;

interface QuizType {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
}

interface QuizListProps {
    quizzes: QuizType[];
    loading: boolean;
    responseCounts: {[key: string]: number};
    onViewResponses: (quiz: QuizType) => void;
}

const QuizList: React.FC<QuizListProps> = ({
                                               quizzes,
                                               loading,
                                               responseCounts,
                                               onViewResponses
                                           }) => {
    // 发布状态标签
    const getStatusTag = (status: number) => {
        switch(status) {
            case 1:
                return <Badge status="processing" text="进行中" />;
            case 0:
                return <Badge status="error" text="已结束" />;
            default:
                return <Badge status="default" text="未知状态" />;
        }
    };

    // 问卷列表表格列定义
    const columns: TableProps<QuizType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'quizId',
            key: 'quizId',
            width: 50
        },
        {
            title: '问卷名称',
            dataIndex: 'quizName',
            key: 'quizName',
            width: 250
        },
        {
            title: '问卷描述',
            dataIndex: 'quizDescription',
            key: 'quizDescription',
            ellipsis: true
        },
        {
            title: '有效期',
            key: 'validPeriod',
            render: (_, record) => (
                <>
                    {record.quizStartTime && record.quizEndTime ?
                        `${record.quizStartTime} 至 ${record.quizEndTime}` :
                        (record.quizStartTime ?
                                `从 ${record.quizStartTime} 开始` :
                                (record.quizEndTime ?
                                    `截止到 ${record.quizEndTime}` :
                                    '永久有效')
                        )
                    }
                </>
            ),
            width: 200
        },
        {
            title: '状态',
            key: 'status',
            render: (_, record) => getStatusTag(record.status),
            width: 100
        },
        {
            title: '收到回复',
            key: 'responseCount',
            render: (_, record) => (
                <Text strong>{responseCounts[record.quizId] || '0'} 份</Text>
            ),
            width: 100
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => onViewResponses(record)}
                >
                    查看回复
                </Button>
            ),
            width: 200
        }
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <Empty
                description="暂无已发布问卷"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="quizId"
            pagination={{ pageSize: 10 }}
        />
    );
};

export default QuizList;