// src/components/statistics/SingleChoiceStatistics.tsx
import React, {useMemo} from 'react';
import {Row, Col, Table} from 'antd';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import type {ColumnsType} from 'antd/es/table';
import {SingleChoiceQuestion} from "./radio.ts";

interface SingleChoiceStatisticsProps {
    question: SingleChoiceQuestion;
    answers: Array<{
        user: string;
        parsedAnswer: string;
    }>;
}

const CHART_COLORS = ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96'];

const SingleChoiceStatistics: React.FC<SingleChoiceStatisticsProps> = ({question, answers}) => {
    // 计算统计数据
    const statisticsData = useMemo(() => {
        const options = question.options || [];
        const countMap: Record<string, number> = {};

        // 初始化统计
        options.forEach((opt: any) => {
            const optionId = opt.value?.toString() || opt.id || opt.key;
            countMap[optionId] = 0;
        });

        // 统计"其他"选项
        if (question.allowOther) {
            countMap['other'] = 0;
        }

        // 计数
        answers.forEach(({parsedAnswer}) => {
            if (parsedAnswer && typeof parsedAnswer === 'string') {
                // 处理"其他"选项
                if (parsedAnswer.startsWith('other:')) {
                    countMap['other'] = (countMap['other'] || 0) + 1;
                } else {
                    countMap[parsedAnswer] = (countMap[parsedAnswer] || 0) + 1;
                }
            }
        });

        // 转换为图表数据格式
        return options.map((opt: any) => {
            const optionId = opt.value?.toString() || opt.id || opt.key;
            const count = countMap[optionId] || 0;
            const percentage = answers.length > 0 ? (count / answers.length * 100).toFixed(1) : '0';

            return {
                name: opt.text,
                value: count,
                percentage: `${percentage}%`,
                id: optionId
            };
        }).concat(question.allowOther ? [{
            name: question.otherText || '其他',
            value: countMap['other'] || 0,
            percentage: answers.length > 0 ? `${((countMap['other'] || 0) / answers.length * 100).toFixed(1)}%` : '0%',
            id: 'other'
        }] : []).filter(item => item.value > 0);
    }, [question, answers]);

    // 表格列定义
    const columns: ColumnsType<any> = [
        {
            title: '选项',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '回答数',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '百分比',
            dataIndex: 'percentage',
            key: 'percentage',
        }
    ];

    return (
        <Row gutter={[24, 24]}>
            <Col span={12}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={statisticsData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({name, percentage}) => `${name}: ${percentage}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {statisticsData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value} 人`, '回答数']}/>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </Col>
            <Col span={12}>
                <Table
                    dataSource={statisticsData}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                />
            </Col>
        </Row>
    );
};

export default SingleChoiceStatistics;