import React, {useMemo} from 'react';
import {Row, Col, Table} from 'antd';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import type {ColumnsType} from 'antd/es/table';

interface MultipleChoiceStatisticsProps {
    question: any; // 使用any替代MultipleChoiceQuestion以避免类型问题
    answers: Array<{
        user: string;
        parsedAnswer: string; // 这里是JSON字符串格式的answer
    }>;
}


const MultipleChoiceStatistics: React.FC<MultipleChoiceStatisticsProps> = ({question, answers}) => {
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

        // 计数 - 解析JSON字符串
        answers.forEach(({parsedAnswer}) => {
            try {
                if (Array.isArray(parsedAnswer)) {
                    // 多选题答案是数组
                    parsedAnswer.forEach(ans => {
                        if (typeof ans === 'string') {
                            if (ans.startsWith('other:')) {
                                countMap['other'] = (countMap['other'] || 0) + 1;
                            } else {
                                countMap[ans] = (countMap[ans] || 0) + 1;
                            }
                        }
                    });
                } else if (typeof parsedAnswer === 'string') {
                    // 单个答案
                    if (parsedAnswer.startsWith('other:')) {
                        countMap['other'] = (countMap['other'] || 0) + 1;
                    } else {
                        countMap[parsedAnswer] = (countMap[parsedAnswer] || 0) + 1;
                    }
                }
            } catch (e) {
                console.error('Error parsing answer:', parsedAnswer, e);
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
        }] : []).filter((item: { value: number }) => item.value > 0);
    }, [question, answers]);

    // 表格列定义
    const columns: ColumnsType<any> = [
        {
            title: '选项',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '选择次数',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '选择比例',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (text, record) => `${record.percentage} (${record.value}/${answers.length})`,
        }
    ];

    return (
        <Row gutter={[24, 24]}>
            <Col span={12}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={statisticsData}
                        layout="vertical"
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis type="number"/>
                        <YAxis dataKey="name" type="category" width={150}/>
                        <Tooltip formatter={(value: any) => [`${value} 次`, '选择次数']}/>
                        <Legend/>
                        <Bar dataKey="value" name="选择次数" fill="#8884d8"/>
                    </BarChart>
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

export default MultipleChoiceStatistics;