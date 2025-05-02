// src/components/statistics/FillBlankStatistics.tsx
import React, { useMemo, useState } from 'react';
import { Tabs, Table, Tag, Card, Typography, Row, Col, Button } from 'antd';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';
import WordCloud from './WordCloud';
import { exportToExcel } from '../utils/exportUtils.ts';
import {FillBlankQuestion} from "./input.ts";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface FillBlankStatisticsProps {
    question: FillBlankQuestion;
    answers: Array<{
        user: string;
        parsedAnswer: string[];
    }>;
}

// 用于提取关键词的工具函数
const extractKeywords = (texts: string[]): {word: string, count: number}[] => {
    // 简易的词频统计，实际项目中可以使用更复杂的NLP库
    const wordCount: Record<string, number> = {};

    texts.forEach(text => {
        if (!text) return;
        // 简单按空格、标点符号分词
        const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/);
        words.forEach(word => {
            // 过滤过短的词
            if (word.length >= 1) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
    });

    // 转换为数组并排序
    return Object.entries(wordCount)
        .map(([word, count]) => ({ word, count }))
        .filter(item => item.count >= 1) // 只保留出现次数大于1的词
        .sort((a, b) => b.count - a.count)
        .slice(0, 50); // 取出现频率最高的50个词
};

const FillBlankStatistics: React.FC<FillBlankStatisticsProps> = ({ question, answers }) => {
    const [activeTab, setActiveTab] = useState('1');

    // 处理填空题数据
    const processedData = useMemo(() => {
        const { blankLabels = [], blankCount = 1 } = question;
        const labels = blankLabels.length === blankCount ? blankLabels : Array(blankCount).fill('').map((_, i) => `填空 ${i + 1}`);

        // 按照填空项分类所有回答
        const blankAnswers: string[][] = Array(blankCount).fill(0).map(() => []);

        answers.forEach(({ parsedAnswer }) => {
            if (Array.isArray(parsedAnswer) && parsedAnswer.length === blankCount) {
                parsedAnswer.forEach((ans, index) => {
                    if (index < blankCount) {
                        blankAnswers[index].push(ans || '');
                    }
                });
            }
        });

        // 计算每个填空的常见回答
        const commonAnswers = blankAnswers.map(blankAnswer => {
            const answerCount: Record<string, number> = {};
            blankAnswer.forEach(ans => {
                answerCount[ans] = (answerCount[ans] || 0) + 1;
            });

            return Object.entries(answerCount)
                .map(([answer, count]) => ({ answer, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10); // 取出现频率最高的10个回答
        });

        // 提取关键词
        const keywordsByBlank = blankAnswers.map(extractKeywords);

        // 简单统计指标（平均字数、最长回答等）
        const stats = blankAnswers.map(blankAnswer => {
            const nonEmptyAnswers = blankAnswer.filter(ans => ans.trim() !== '');
            const avgLength = nonEmptyAnswers.length > 0 ?
                nonEmptyAnswers.reduce((sum, ans) => sum + ans.length, 0) / nonEmptyAnswers.length : 0;
            const maxLength = Math.max(...nonEmptyAnswers.map(ans => ans.length), 0);

            return {
                totalAnswers: blankAnswer.length,
                nonEmptyAnswers: nonEmptyAnswers.length,
                avgLength: avgLength.toFixed(1),
                maxLength
            };
        });

        return {
            labels,
            blankAnswers,
            commonAnswers,
            keywordsByBlank,
            stats
        };
    }, [question, answers]);

    // 导出填空题回答数据
    const exportAnswers = () => {
        const { labels, blankAnswers } = processedData;

        // 为每个填空项创建一个工作表
        const worksheets = labels.map((label, index) => {
            const data = blankAnswers[index].map((answer, i) => ({
                '序号': i + 1,
                '填空项': label,
                '回答内容': answer || '(空)',
                '字数': (answer || '').length
            }));

            return {
                name: `${label}`,
                data
            };
        });

        exportToExcel(worksheets, `填空题-${question.title}-回答数据`);
    };

    return (
        <div className="fill-blank-statistics">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={5}>填空题分析</Title>
                <Button
                    icon={<DownloadOutlined />}
                    onClick={exportAnswers}
                >
                    导出原始回答
                </Button>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="填空概览" key="1">
                    <Row gutter={[16, 16]}>
                        {processedData.labels.map((label, index) => (
                            <Col span={12} key={`stat-${index}`}>
                                <Card
                                    title={label}
                                    size="small"
                                    style={{ height: '100%' }}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Statistic title="回答数量" value={processedData.stats[index].nonEmptyAnswers} />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title="平均字数" value={processedData.stats[index].avgLength} />
                                        </Col>
                                    </Row>

                                    <Paragraph style={{ marginTop: 16 }}>
                                        <Text strong>常见回答：</Text>
                                        <div style={{ marginTop: 8 }}>
                                            {processedData.commonAnswers[index].slice(0, 5).map((item, i) => (
                                                <Tag color="blue" key={i} style={{ margin: '4px 8px 4px 0' }}>
                                                    {item.answer} ({item.count})
                                                </Tag>
                                            ))}
                                        </div>
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </TabPane>

                {processedData.labels.map((label, index) => (
                    <TabPane tab={label} key={`blank-${index + 2}`}>
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Card title="关键词频率分析" size="small">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={processedData.keywordsByBlank[index].slice(0, 10)}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="word" />
                                            <YAxis />
                                            <Tooltip formatter={(value: any) => [`${value} 次`, '出现次数']} />
                                            <Bar dataKey="count" fill="#8884d8">
                                                {processedData.keywordsByBlank[index].slice(0, 10).map((_, i) => (
                                                    <Cell key={`cell-${i}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="回答词云" size="small" style={{ height: '100%' }}>
                                    <WordCloud
                                        data={processedData.keywordsByBlank[index].map(item => ({
                                            text: item.word,
                                            value: item.count
                                        }))}
                                        height={300}
                                        width={400} // 添加显式宽度
                                    />
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card title="原始回答列表" size="small">
                                    <Table
                                        dataSource={processedData.blankAnswers[index].map((answer, i) => ({
                                            key: i,
                                            index: i + 1,
                                            answer: answer || '(空)',
                                            length: (answer || '').length
                                        }))}
                                        columns={[
                                            { title: '序号', dataIndex: 'index', width: 80 },
                                            { title: '回答内容', dataIndex: 'answer' },
                                            { title: '字数', dataIndex: 'length', width: 100 }
                                        ]}
                                        pagination={{ pageSize: 10 }}
                                        size="small"
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

// 简单的统计卡片组件
const Statistic = ({ title, value }: { title: string; value: string | number }) => (
    <div>
        <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>{title}</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
    </div>
);

export default FillBlankStatistics;