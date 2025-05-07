import React, {useEffect, useState} from 'react';
import {Typography, Card, Button, Space, Modal, Alert, Select} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';

import {getAnswerList, getQuizzesHasResp, getTotalResponseByQuizId} from '../../api/quizQuestionAnswerApi';
import QuizList from './receiveQuizes/QuizList';
import ResponseList from './receiveQuizes/ResponseList';
import ResponseDetail from './receiveQuizes/ResponseDetail';
import AIModal from "./AI/AIModal.tsx";

const {Title} = Typography;

export interface QuizType {
    quizId: number;
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

const ReceivedQuizzes = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
    const [responses, setResponses] = useState<QuizResponseType[]>([]);
    const [responseLoading, setResponseLoading] = useState<boolean>(false);
    const [responseModalVisible, setResponseModalVisible] = useState<boolean>(false);
    const [aiModal, setAIModal] = useState(false);
    const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
    const [modelName, setModelName] = useState("gpt-4.1");
    const modelOptions = [
        {value: "gpt-4.1", label: "gpt-4.1"},
        {value: "DeepSeek-V3", label: "DeepSeek-V3"},
        {value: "gemini-2.5-pro-preview-03-25", label: "gemini-2.5-pro"},
    ];

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
                const data = await getQuizzesHasResp()
                // 只保留已发布的问卷

                setQuizzes(data!);

                // 为每个问卷获取回复数
                const counts: { [key: string]: number } = {};
                for (const quiz of data!) {
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
            <Alert style={{marginBottom: "16px", borderRadius: "0"}} message="仅至少有1个回复的问卷会被列在此处"
                   type="info"/>
            {/* 问卷列表或回复列表 */}
            {selectedQuiz === null ? (
                <Card

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
                            <Button onClick={() => setAIModal(true)}>AI助手</Button>
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
            {/*AI分析*/}

            <Modal
                title={"AI问答"}
                open={aiModal}
                onCancel={() => setAIModal(false)}
                footer={[
                    <Select
                        value={modelName}
                        onChange={setModelName}
                        options={modelOptions}
                        style={{marginRight: "20px"}}
                    />
                    ,
                    <Button key="back" onClick={() => setAIModal(false)}>
                        关闭
                    </Button>
                ]}
                centered
                width={800}
                destroyOnClose={true} // 关闭时销毁组件，避免数据残留
                maskClosable={false}
            >
                <AIModal modelName={modelName} quizId={selectedQuiz?.quizId}></AIModal>
            </Modal>
            {/* 单个回复详情弹窗 */}
            <Modal
                title="回复详情"
                open={responseModalVisible}
                centered
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