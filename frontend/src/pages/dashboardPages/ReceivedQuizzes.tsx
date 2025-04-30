// src/components/dashboard/ReceivedQuizzes.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Card, Table, Button, Tag, Badge, Space, Empty, Spin, Modal, Tabs, Statistic, Row, Col } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { getQuizList } from '../../api/quizApi.ts';
import {getAnswerList, getSpecificAnswer, getTotalResponseByQuizId} from '../../api/quizQuestionAnswerApi.ts';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface QuizType {
    quizId: string;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
}

export interface QuizResponseType {
    uniqueSubmitId: string;
    userName: string; // 可能是匿名的
    answerTime: string;
    answers?: {
        questionName: string,
        questionDescription: string,
        userAnswer: string
    }[]
}

const ReceivedQuizzes: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
    const [responses, setResponses] = useState<QuizResponseType[]>([]);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [responseModalVisible, setResponseModalVisible] = useState<boolean>(false);
    const [selectedResponse, setSelectedResponse] = useState<QuizResponseType | null>(null);
    const [responseCounts, setResponseCounts] = useState<{[key: string]: number}>({});

    // 加载所有问卷
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const data = await getQuizList();
                // 只保留已发布的问卷
                const publishedQuizzes = (data as QuizType[]).filter(quiz => quiz.status === 1);
                setQuizzes(publishedQuizzes);

                // 为每个问卷获取回复数
                const counts: {[key: string]: number} = {};
                for (const quiz of publishedQuizzes) {
                    try {
                        const count = await getTotalResponseByQuizId(quiz.quizId);
                        counts[quiz.quizId] = count ?? 0;
                    } catch (error) {
                        console.error(`获取问卷 ${quiz.quizId} 回复数失败:`, error);
                        counts[quiz.quizId] = 0;
                    }
                }
                setResponseCounts(counts);
            } catch (error) {
                console.error("获取问卷列表失败:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // 查看问卷回复
    const viewResponses = async (quiz: QuizType) => {
        try {
            setResponseLoading(true);
            setSelectedQuiz(quiz);
            const data = await getAnswerList(quiz.quizId);
            setResponses(data ?? []);

        } catch (error) {
            console.error("获取问卷回复失败:", error);
        } finally {
            setResponseLoading(false);
        }
    };

    const viewSpecificResposne = async (uniqueSubmitId: string) => {
        try {
            setResponseLoading(true);
            // 获取详细数据
            const data = await getSpecificAnswer(uniqueSubmitId);
            console.log(data)

            // 获取当前简要数据
            let pre: QuizResponseType | undefined = undefined;
            responses.forEach(item => {
                if (item.uniqueSubmitId === uniqueSubmitId) {
                    pre = item;
                }
            });

            if (!pre || !data) {
                setSelectedResponse(null); // 或做错误处理
                return;
            }

            // 用 SpecificAnswerDTO[] 转换为 QuizResponseType 的 answers 格式
            const answers = data.map(item => ({
                questionName: item.questionName,
                questionDescription: item.questionDescription,
                userAnswer: item.answer
            }));

            setSelectedResponse({
                ...(pre as QuizResponseType),
                answers: answers
            });

            console.log({
                ...(pre as QuizResponseType),
                answers: answers
            })

        } catch (error) {
            console.error("获取问卷回复失败:", error);
        } finally {
            setResponseLoading(false);
        }
    };

    // 查看单个回复详情
    const viewResponseDetail = async (response: QuizResponseType) => {
        setSelectedResponse(response);
        await viewSpecificResposne(response.uniqueSubmitId)
        setResponseModalVisible(true);
    };

    // 导出回复数据
    const exportResponses = () => {
        // 实现导出功能，可以是CSV或Excel格式
        console.log("导出问卷回复数据");
        // 实际实现应调用API或前端生成文件下载
    };

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
                    onClick={() => viewResponses(record)}
                >
                    查看回复
                </Button>
            ),
            width: 200
        }
    ];

    // 回复列表表格列定义
    const responseColumns: TableProps<QuizResponseType>['columns'] = [
        {
            title: '回复ID',
            dataIndex: 'uniqueSubmitId',
            key: 'uniqueSubmitId'
        },
        {
            title: '回复者',
            dataIndex: 'userName',
            key: 'userName'
        },
        {
            title: '提交时间',
            dataIndex: 'answerTime',
            key: 'answerTime'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => viewResponseDetail(record)}
                >
                    查看详情
                </Button>
            )
        }
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>收到的问卷回复</Title>

            {/* 问卷列表 */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                </div>
            ) : quizzes.length === 0 ? (
                <Empty
                    description="暂无已发布问卷"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : selectedQuiz === null ? (
                <Card
                    title="我的已发布问卷"
                    style={{ flex: 1, overflowY: 'auto' }}
                >
                    <Table
                        columns={columns}
                        dataSource={quizzes}
                        rowKey="quizId"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            ) : (
                /* 问卷回复列表 */
                <Card
                    title={`问卷回复 - ${selectedQuiz.quizName}`}
                    extra={
                        <Space>
                            <Button onClick={() => setSelectedQuiz(null)}>返回问卷列表</Button>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={exportResponses}
                            >
                                导出回复
                            </Button>
                        </Space>
                    }
                    style={{ flex: 1, overflowY: 'auto' }}
                >
                    {responseLoading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : responses.length === 0 ? (
                        <Empty
                            description="暂无回复数据"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Table
                            columns={responseColumns}
                            dataSource={responses}
                            rowKey="responseId"
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                </Card>
            )}

            {/* 单个回复详情modal */}
            <Modal
                title="回复详情"
                open={responseModalVisible}
                onCancel={() => setResponseModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setResponseModalVisible(false)}>
                        关闭
                    </Button>
                ]}
                width={700}
            >
                {selectedResponse && (
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Statistic title="回复者" value={selectedResponse.userName} />
                                </Col>
                                <Col span={16}>
                                    <Statistic title="提交时间" value={selectedResponse.uniqueSubmitId} />
                                </Col>
                            </Row>
                        </div>

                        <Title level={5}>回答内容</Title>
                        <div style={{ marginTop: '15px' }}>
                            {selectedResponse.answers!.map((answer, index) => (
                                <Card
                                    key={index}
                                    style={{ marginBottom: '10px' }}
                                    size="small"
                                >
                                    <div>
                                        <Text strong>问题 {index + 1}: {answer.questionName}</Text>
                                    </div>
                                    <div>
                                    <Text strong>描述 {index + 1}: {answer.questionDescription}</Text>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <Text type="secondary">回答: </Text>
                                        <Text>
                                            {Array.isArray(answer.userAnswer) ?
                                                answer.userAnswer.join(', ') :
                                                answer.userAnswer}
                                        </Text>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReceivedQuizzes;