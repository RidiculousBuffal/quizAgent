import React, { useMemo, useState } from 'react';
import {
    Tabs,
    Table,
    Card,
    Typography,
    Row,
    Col,
    Button,
    Statistic as AntStatistic,
    Divider
} from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import WordCloud from '../input/WordCloud';  // 复用之前的词云组件
import { EssayQuestion } from './essay';
import { BaseStatisticsProps } from '../BaseQuestion';
import { exportToExcel } from '../utils/exportUtils';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 提取常用词和短语的工具函数
const extractKeywords = (texts: string[]): {word: string, count: number}[] => {
    // 简单的词频统计实现
    const wordCount: Record<string, number> = {};

    texts.forEach(text => {
        if (!text) return;
        // 简单按空格、标点符号分词
        const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/);
        words.forEach(word => {
            // 过滤过短的词
            if (word.length >= 2) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
    });

    // 转换为数组并排序
    return Object.entries(wordCount)
        .map(([word, count]) => ({ word, count }))
        .filter(item => item.count > 1) // 只保留出现次数大于1的词
        .sort((a, b) => b.count - a.count)
        .slice(0, 50); // 取出现频率最高的50个词
};

// 提取常见短语和句子片段
const extractPhrases = (texts: string[], minCount: number = 2): {phrase: string, count: number}[] => {
    const phraseCount: Record<string, number> = {};

    // 遍历所有文本
    texts.forEach(text => {
        if (!text || text.length < 5) return;

        // 将文本分割成句子
        const sentences = text.split(/[.!?。！？]/);

        sentences.forEach(sentence => {
            const cleanSentence = sentence.trim();
            if (cleanSentence.length < 5) return;

            // 提取3-6个词的片段
            const words = cleanSentence.split(/\s+/);
            if (words.length < 3) return;

            for (let i = 0; i < words.length - 2; i++) {
                for (let len = 3; len <= Math.min(6, words.length - i); len++) {
                    const phrase = words.slice(i, i + len).join(' ');
                    if (phrase.length >= 10) {
                        phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
                    }
                }
            }
        });
    });

    // 转换为数组并排序
    return Object.entries(phraseCount)
        .map(([phrase, count]) => ({ phrase, count }))
        .filter(item => item.count >= minCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 30); // 最多取30个短语
};

// 计算情感分析的简单实现
const calculateSentiment = (text: string): number => {
    const positiveWords = ['good', 'great', 'excellent', 'awesome', 'like', 'love',
        'happy', 'pleased', 'satisfied', 'wonderful', 'positive',
        '好', '优秀', '喜欢', '满意', '快乐', '高兴'];

    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'dislike', 'hate',
        'unhappy', 'disappointed', 'dissatisfied', 'negative',
        '差', '糟糕', '不喜欢', '不满意', '失望', '难过'];

    // 转为小写并分词
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/);

    let score = 0;
    words.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
    });

    return score;
};

interface EssayStatisticsProps extends BaseStatisticsProps {
    question: EssayQuestion;
    answers: Array<{
        user: string;
        parsedAnswer: string;
    }>;
}

const EssayStatistics: React.FC<EssayStatisticsProps> = ({ question, answers }) => {
    const [activeTab, setActiveTab] = useState('1');

    // 处理答案数据
    const processedData = useMemo(() => {
        // 提取所有非空回答
        const validAnswers = answers
            .filter(item => item.parsedAnswer && typeof item.parsedAnswer === 'string')
            .map(item => item.parsedAnswer);

        // 字数统计
        const lengthStats = validAnswers.map(answer => answer.length);
        const totalChars = lengthStats.reduce((sum, len) => sum + len, 0);
        const averageLength = validAnswers.length ? Math.round(totalChars / validAnswers.length) : 0;
        const minLength = validAnswers.length ? Math.min(...lengthStats) : 0;
        const maxLength = validAnswers.length ? Math.max(...lengthStats) : 0;

        // 长度分布
        const lengthDistribution: Record<string, number> = {
            '0-50字': 0,
            '51-100字': 0,
            '101-200字': 0,
            '201-500字': 0,
            '501-1000字': 0,
            '1000字以上': 0
        };

        lengthStats.forEach(len => {
            if (len <= 50) lengthDistribution['0-50字']++;
            else if (len <= 100) lengthDistribution['51-100字']++;
            else if (len <= 200) lengthDistribution['101-200字']++;
            else if (len <= 500) lengthDistribution['201-500字']++;
            else if (len <= 1000) lengthDistribution['501-1000字']++;
            else lengthDistribution['1000字以上']++;
        });

        // 关键词分析
        const keywords = extractKeywords(validAnswers);

        // 常见短语
        const phrases = extractPhrases(validAnswers);

        // 简单的情感分析
        const sentiments = validAnswers.map(answer => ({
            text: answer.substring(0, 100) + (answer.length > 100 ? '...' : ''),
            score: calculateSentiment(answer),
            length: answer.length
        }));

        // 按情感分数分组
        const sentimentGroups = {
            '积极': sentiments.filter(item => item.score > 0).length,
            '中性': sentiments.filter(item => item.score === 0).length,
            '消极': sentiments.filter(item => item.score < 0).length,
        };

        return {
            validAnswers,
            totalResponses: validAnswers.length,
            averageLength,
            minLength,
            maxLength,
            lengthDistribution,
            lengthDistributionData: Object.entries(lengthDistribution).map(([label, count]) => ({
                label, count
            })),
            keywords,
            phrases,
            sentiments,
            sentimentGroups,
            sentimentData: Object.entries(sentimentGroups).map(([label, count]) => ({
                label, count
            }))
        };
    }, [answers]);

    // 导出原始数据
    const exportAnswers = () => {
        const data = answers.map((item, index) => ({
            '序号': index + 1,
            '用户': item.user,
            '回答内容': item.parsedAnswer || '',
            '字数': item.parsedAnswer ? item.parsedAnswer.length : 0
        }));

        exportToExcel([{ name: '简答题回答', data }], `简答题-${question.title}-回答数据`);
    };

    return (
        <div className="essay-statistics">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={5}>简答题分析</Title>
                <Button
                    icon={<DownloadOutlined />}
                    onClick={exportAnswers}
                >
                    导出原始回答
                </Button>
            </div>

            {/* 总体统计指标 */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <AntStatistic
                            title="回答数量"
                            value={processedData.totalResponses}
                            prefix={<FileTextOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <AntStatistic
                            title="平均字数"
                            value={processedData.averageLength}
                            suffix="字"
                        />
                    </Col>
                    <Col span={6}>
                        <AntStatistic
                            title="最短回答"
                            value={processedData.minLength}
                            suffix="字"
                        />
                    </Col>
                    <Col span={6}>
                        <AntStatistic
                            title="最长回答"
                            value={processedData.maxLength}
                            suffix="字"
                        />
                    </Col>
                </Row>
            </Card>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="内容概览" key="1">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card title="回答长度分布" size="small">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={processedData.lengthDistributionData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip formatter={(value: any) => [`${value} 个回答`, '数量']} />
                                        <Bar dataKey="count" fill="#8884d8">
                                            {processedData.lengthDistributionData.map((_, i) => (
                                                <Cell key={`cell-${i}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="情感分析分布" size="small">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={processedData.sentimentData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip formatter={(value: any) => [`${value} 个回答`, '数量']} />
                                        <Bar dataKey="count" fill="#8884d8">
                                            <Cell fill="#ff7875" /> {/* 消极 */}
                                            <Cell fill="#d9d9d9" /> {/* 中性 */}
                                            <Cell fill="#52c41a" /> {/* 积极 */}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="回答词云" size="small">
                                <WordCloud
                                    data={processedData.keywords.map(item => ({
                                        text: item.word,
                                        value: item.count
                                    }))}
                                    width={800}
                                    height={400}
                                />
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="关键词分析" key="2">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card title="常见关键词" size="small">
                                <Table
                                    dataSource={processedData.keywords.map((item, i) => ({
                                        key: i,
                                        rank: i + 1,
                                        word: item.word,
                                        count: item.count
                                    }))}
                                    columns={[
                                        { title: '排名', dataIndex: 'rank', width: 80 },
                                        { title: '关键词', dataIndex: 'word' },
                                        { title: '出现次数', dataIndex: 'count', width: 120 }
                                    ]}
                                    pagination={{ pageSize: 10 }}
                                    size="small"
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="常见短语" size="small">
                                <Table
                                    dataSource={processedData.phrases.map((item, i) => ({
                                        key: i,
                                        rank: i + 1,
                                        phrase: item.phrase,
                                        count: item.count
                                    }))}
                                    columns={[
                                        { title: '排名', dataIndex: 'rank', width: 80 },
                                        { title: '短语', dataIndex: 'phrase' },
                                        { title: '出现次数', dataIndex: 'count', width: 120 }
                                    ]}
                                    pagination={{ pageSize: 10 }}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="原始回答" key="3">
                    <Card size="small">
                        <Table
                            dataSource={processedData.sentiments.map((item, i) => ({
                                key: i,
                                index: i + 1,
                                text: item.text,
                                length: item.length,
                                sentiment: item.score > 0 ? '积极' : (item.score < 0 ? '消极' : '中性')
                            }))}
                            columns={[
                                { title: '序号', dataIndex: 'index', width: 80 },
                                { title: '回答摘要', dataIndex: 'text' },
                                { title: '字数', dataIndex: 'length', width: 80 },
                                { title: '情感倾向', dataIndex: 'sentiment', width: 100,
                                    render: (sentiment) => (
                                        <span style={{
                                            color: sentiment === '积极' ? '#52c41a' :
                                                sentiment === '消极' ? '#ff4d4f' : '#8c8c8c'
                                        }}>
                                        {sentiment}
                                    </span>
                                    )
                                }
                            ]}
                            expandable={{
                                expandedRowRender: (record) => {
                                    const answer = processedData.validAnswers[record.index - 1];
                                    return (
                                        <div style={{ padding: 16 }}>
                                            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                                {answer}
                                            </Paragraph>
                                        </div>
                                    );
                                }
                            }}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default EssayStatistics;