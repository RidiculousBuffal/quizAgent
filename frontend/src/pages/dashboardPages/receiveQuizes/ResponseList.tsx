// src/components/dashboard/ResponseList.tsx
import React from 'react';
import { Table, Button, Empty, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

export interface QuizResponseType {
    uniqueSubmitId: string;
    userName: string;
    answerTime: string;
    answers?: {
        questionName: string,
        questionDescription: string,
        userAnswer: string
    }[];
}

interface ResponseListProps {
    responses: QuizResponseType[];
    loading: boolean;
    onViewDetail: (response: QuizResponseType) => void;
}

const ResponseList: React.FC<ResponseListProps> = ({
                                                       responses,
                                                       loading,
                                                       onViewDetail
                                                   }) => {
    const columns: TableProps<QuizResponseType>['columns'] = [
        {
            title: '回复ID',
            dataIndex: 'uniqueSubmitId',
            key: 'uniqueSubmitId',
            width: '30%',
            ellipsis: true
        },
        {
            title: '回复者',
            dataIndex: 'userName',
            key: 'userName',
            width: '20%'
        },
        {
            title: '提交时间',
            dataIndex: 'answerTime',
            key: 'answerTime',
            width: '30%'
        },
        {
            title: '操作',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => onViewDetail(record)}
                >
                    查看详情
                </Button>
            )
        }
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (responses.length === 0) {
        return (
            <Empty
                description="暂无回复数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <Table
            columns={columns}
            dataSource={responses}
            rowKey="uniqueSubmitId"
            pagination={{ pageSize: 10 }}
        />
    );
};

export default ResponseList;