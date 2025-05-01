import React, {useEffect, useState} from 'react';
import {Typography, Row, Col, Card, Button, Empty, Spin, Statistic, Badge, Divider, Alert} from 'antd';
import {BarChartOutlined, EyeOutlined, LinkOutlined, CalendarOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {getQuizList} from '../../api/quizApi';
import {getQuizzesHasResp, getTotalResponseByQuizId} from '../../api/quizQuestionAnswerApi';
import dayjs from 'dayjs';

const {Title, Text, Paragraph} = Typography;
const {Meta} = Card;

interface QuizType {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
    creator: string;
}

const QuizAnalysisCenter: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [loading, setLoading] = useState(true);
    const [responseCounts, setResponseCounts] = useState<{ [key: number]: number }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const data = await getQuizzesHasResp();

                setQuizzes(data as QuizType[]);

                // 获取每个问卷的回复数
                const counts: { [key: number]: number } = {};
                for (const quiz of data as QuizType[]) {
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

    // 获取状态标签
    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return <Badge status="processing" text="进行中"/>;
            case 0:
                return <Badge status="error" text="已结束"/>;
            default:
                return <Badge status="default" text="未知状态"/>;
        }
    };

    // 进入问卷分析页面
    const goToAnalysis = (quizId: number) => {
        navigate(`/quiz-analysis/${quizId}`);
    };

    // 进入问卷回复页面
    const goToResponses = (quizId: number) => {
        navigate(`/quiz-responses/${quizId}`);
    };

    // 生成问卷链接
    const getQuizLink = (quizId: number) => {
        return `${window.location.origin}/doQuiz/${quizId}`;
    };

    // 复制问卷链接到剪贴板
    const copyQuizLink = (quizId: number) => {
        const link = getQuizLink(quizId);
        navigator.clipboard.writeText(link).then(() => {
            alert('问卷链接已复制到剪贴板');
        });
    };

    if (loading) {
        return (
            <div style={{textAlign: 'center', padding: '50px'}}>
                <Spin size="large" tip="加载问卷中..."/>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div style={{padding: '24px'}}>
                <Title level={4}>我的问卷</Title>
                <Empty
                    description="您还没有创建任何问卷"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }
    const getActionsList = (quiz: QuizType) => {
        const link = <Button
            type="text"
            icon={<LinkOutlined/>}
            onClick={() => copyQuizLink(quiz.quizId)}
        >
            复制链接
        </Button>
        const resp = <Button
            type="text"
            icon={<EyeOutlined/>}
            onClick={() => goToResponses(quiz.quizId)}
        >
            查看回复
        </Button>
        const analysis = <Button
            type="text"
            icon={<BarChartOutlined/>}
            onClick={() => goToAnalysis(quiz.quizId)}
        >
            数据分析
        </Button>
        if (quiz.status != 0) {
            return [link, resp, analysis]
        } else {
            return [resp, analysis]
        }
    }
    return (
        <div style={{padding: '24px'}}>
            <Title level={4}>我的问卷</Title>
            <Paragraph type="secondary">
                在这里查看您的问卷统计数据和回复情况 (仅至少有1个回复的问卷会被列在此处)
            </Paragraph>
            <Divider/>

            <Row gutter={[16, 16]} style={{marginTop: '16px'}}>
                {quizzes.map((quiz) => (
                    <Col xs={24} sm={12} lg={8} key={quiz.quizId}>
                        <Card
                            hoverable
                            className="quiz-card"
                            style={{height: '100%'}}
                            actions={getActionsList(quiz)}
                        >
                            <Meta
                                title={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text strong ellipsis style={{maxWidth: '70%'}}>{quiz.quizName}</Text>
                                        {getStatusBadge(quiz.status)}
                                    </div>
                                }
                                description={
                                    <div style={{height: '100%'}}>
                                        <Paragraph ellipsis={{rows: 2}} style={{marginBottom: 16}}>
                                            {quiz.quizDescription || '无描述'}
                                        </Paragraph>

                                        <div style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
                                            <CalendarOutlined style={{marginRight: 8}}/>
                                            <Text type="secondary">
                                                {quiz.quizStartTime ? dayjs(quiz.quizStartTime).format('YYYY-MM-DD') : '无起始日期'}
                                                {quiz.quizEndTime ? ` 至 ${dayjs(quiz.quizEndTime).format('YYYY-MM-DD')}` : ''}
                                            </Text>
                                        </div>

                                        <Statistic
                                            title="收到回复"
                                            value={responseCounts[quiz.quizId] || 0}
                                            valueStyle={{fontSize: '18px'}}
                                        />
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default QuizAnalysisCenter;