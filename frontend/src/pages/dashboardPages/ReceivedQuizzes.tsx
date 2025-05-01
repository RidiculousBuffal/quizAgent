// src/components/dashboard/ReceivedQuizzes.tsx
import React, {useEffect, useState} from 'react';
import {Typography, Card, Button, Space, Modal} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {getQuizList} from '../../api/quizApi';
import {getAnswerList, getTotalResponseByQuizId} from '../../api/quizQuestionAnswerApi';
import QuizList from './receiveQuizes/QuizList';
import ResponseList from './receiveQuizes/ResponseList';
import ResponseDetail from './receiveQuizes/ResponseDetail';

const {Title} = Typography;

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
    userName: string;
    answerTime: string;
}

const ReceivedQuizzes: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
    const [responses, setResponses] = useState<QuizResponseType[]>([]);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [responseModalVisible, setResponseModalVisible] = useState<boolean>(false);
    const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
    const [selectedResponseInfo, setSelectedResponseInfo] = useState<{
        userName: string,
        answerTime: string
    } | null>(null);
    const [responseCounts, setResponseCounts] = useState<{ [key: string]: number }>({});

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
                const counts: { [key: string]: number } = {};
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

    // 查看单个回复详情
    const viewResponseDetail = (response: QuizResponseType) => {
        setSelectedResponseId(response.uniqueSubmitId);
        setSelectedResponseInfo({
            userName: response.userName,
            answerTime: response.answerTime
        });
        setResponseModalVisible(true);
    };

    // 导出回复数据
    const exportResponses = () => {
        // 实现导出功能，可以是CSV或Excel格式
        console.log("导出问卷回复数据");
        // 实际实现应调用API或前端生成文件下载
    };

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Title level={4} style={{marginBottom: '16px'}}>收到的问卷回复</Title>

            {/* 问卷列表或回复列表 */}
            {selectedQuiz === null ? (
                <Card
                    title="我的已发布问卷"
                    style={{flex: 1, overflowY: 'auto'}}
                >
                    <QuizList
                        quizzes={quizzes}
                        loading={loading}
                        responseCounts={responseCounts}
                        onViewResponses={viewResponses}
                    />
                </Card>
            ) : (
                <Card
                    title={`问卷回复 - ${selectedQuiz.quizName}`}
                    extra={
                        <Space>
                            <Button onClick={() => setSelectedQuiz(null)}>返回问卷列表</Button>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined/>}
                                onClick={exportResponses}
                            >
                                导出回复
                            </Button>
                        </Space>
                    }
                    style={{flex: 1, overflowY: 'auto'}}
                >
                    <ResponseList
                        responses={responses}
                        loading={responseLoading}
                        onViewDetail={viewResponseDetail}
                    />
                </Card>
            )}

            {/* 单个回复详情弹窗 */}
            <Modal
                title="回复详情"
                open={responseModalVisible}
                onCancel={() => setResponseModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setResponseModalVisible(false)}>
                        关闭
                    </Button>
                ]}
                width={800}
                destroyOnClose={true} // 关闭时销毁组件，避免数据残留
            >
                {selectedResponseId && selectedResponseInfo && (
                    <ResponseDetail
                        uniqueSubmitId={selectedResponseId}
                        responseInfo={selectedResponseInfo}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ReceivedQuizzes;