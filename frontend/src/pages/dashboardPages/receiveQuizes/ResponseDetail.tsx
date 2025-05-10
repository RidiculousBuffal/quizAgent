// src/components/dashboard/ResponseDetail.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Spin, Empty, Divider } from 'antd';
import { getSpecificAnswer } from '../../../api/quizQuestionAnswerApi';
import { useQuestionStore } from '../../../store/question/QuestionStore';
import QuestionDisplayWrapper from '../../../lib/Questions/QuestionWarpper/QuestionDisplayWarpper.tsx';

const { Title, Text } = Typography;

interface SpecificAnswerDTO {
    question: any[];
    answer: string[];
    user: string | null;
}

interface ResponseDetailProps {
    uniqueSubmitId: string;
    responseInfo: {
        userName: string;
        answerTime: string;
    };
}

const ResponseDetail: React.FC<ResponseDetailProps> = ({
                                                           uniqueSubmitId,
                                                           responseInfo
                                                       }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answerData, setAnswerData] = useState<SpecificAnswerDTO | null>(null);

    const setQuestionAnswer = useQuestionStore(state => state.setQuestionAnswer);

    // 加载详细回答数据
    useEffect(() => {
        const fetchAnswerDetail = async () => {
            try {
                setLoading(true);
                const data = await getSpecificAnswer(uniqueSubmitId);

                if (data) {
                    setAnswerData(data!);

                    // 将问题和回答数据注入到store中
                    setQuestionAnswer(data.question, data.answer);
                } else {
                    setError('未能获取回答数据');
                }
            } catch (error) {
                console.error('获取回答详情失败:', error);
                setError('获取回答详情失败');
            } finally {
                setLoading(false);
            }
        };

        fetchAnswerDetail();
    }, [uniqueSubmitId, setQuestionAnswer]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '30px' }}>
                <Spin size="large" tip="加载回答详情..." />
            </div>
        );
    }

    if (error || !answerData) {
        return <Empty description={error || '无法获取回答数据'} />;
    }

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="回复者" value={responseInfo.userName || '匿名用户'} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="提交时间" value={responseInfo.answerTime} />
                    </Col>
                </Row>
            </div>

            <Divider orientation="left">回答内容</Divider>

            <div style={{ marginTop: '15px',maxHeight:"680px",overflowY:"auto" }}>
                {answerData.question.map((question) => (
                    <Card
                        key={question.id}
                        style={{ marginBottom: '16px' }}
                        size="small"
                    >
                        <QuestionDisplayWrapper questionId={question.id} />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ResponseDetail;