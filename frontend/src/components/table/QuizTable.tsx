import React, { useEffect, useRef, useState } from 'react';
import {Badge, Button, Popconfirm, Space, Table} from 'antd';
import { SettingOutlined } from "@ant-design/icons";
import type {PresetStatusColorType} from "antd/es/_util/colors";

export interface quizShowType {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
}

interface QuizTableProps {
    surveyData: quizShowType[];
    onChangeInfo?: (record: quizShowType) => void;
    onEdit?: (quizId: number) => void;
    onDelete?: (quizId: number) => void;
    onPublishPermission?: (record: quizShowType) => void
}

// 状态映射
const statusMap: Record<number, { text: string; status: PresetStatusColorType }> = {
    0: { text: '待发布', status: 'error' },
    1: { text: '已发布', status: 'processing' },
};

const QuizTable: React.FC<QuizTableProps> = ({ surveyData, onChangeInfo, onEdit, onDelete, onPublishPermission }) => {
    // 用于动态计算表格高度
    const [tableHeight, setTableHeight] = useState<number>(300);
    const containerRef = useRef<HTMLDivElement>(null);

    // 调整表格高度
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                // 获取容器高度并预留分页器空间
                const height = containerRef.current.clientHeight - 105;
                setTableHeight(height > 100 ? height : 300);
            }
        };

        // 初始化和窗口调整时更新高度
        updateHeight();
        window.addEventListener('resize', updateHeight);

        // 组件加载后再次测量（处理初始渲染可能不准确的问题）
        const timer = setTimeout(updateHeight, 100);

        return () => {
            window.removeEventListener('resize', updateHeight);
            clearTimeout(timer);
        };
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'quizId',
            key: 'quizId',
            width: 70,
        },
        {
            title: '问卷名称',
            dataIndex: 'quizName',
            key: 'quizName',
            width: 150,
        },
        {
            title: '描述',
            dataIndex: 'quizDescription',
            key: 'quizDescription',
            ellipsis: true,
        },
        {
            title: '开始时间',
            dataIndex: 'quizStartTime',
            key: 'quizStartTime',
            width: 160,
        },
        {
            title: '结束时间',
            dataIndex: 'quizEndTime',
            key: 'quizEndTime',
            width: 160,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 90,
            render: (status: number) => {
                const s = statusMap[status] || { text: '未知', color: 'gray' };
                return <Badge status={s.status} text={s.text} />;
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 400,
            render: (_: any, record: quizShowType) => (
                <Space>
                    <Button
                        size="small"
                        type="default"
                        onClick={() => onChangeInfo && onChangeInfo(record)}
                    >更改问卷基础信息</Button>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => onEdit && onEdit(record.quizId)}
                    >编辑</Button>
                    <Button
                        size="small"
                        onClick={() => onPublishPermission && onPublishPermission(record)}
                        icon={<SettingOutlined />}
                    >发布/权限</Button>
                    <Popconfirm
                        title="确认要删除吗?"
                        onConfirm={() => onDelete && onDelete(record.quizId)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button size="small" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
            <Table
                rowKey="quizId"
                columns={columns}
                dataSource={surveyData}
                pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                }}
                scroll={{ y: tableHeight }}
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
};

export default QuizTable;