// src/pages/analysis/QuizAnalysisDetail.tsx
import React, {useEffect, useState} from 'react';
import {Card, Breadcrumb, Spin, Alert, Typography} from 'antd';
import {useParams, Link} from 'react-router-dom';
import {ArrowLeftOutlined} from '@ant-design/icons';
import QuizStatistics from './QuizStatistics/QuizStatistics';
import {getQuizDetail} from "../../api/quizApi.ts";

const {Title} = Typography;

interface QuizInfo {
    quizId: number;
    quizName: string;
    quizDescription: string;
}


const QuizAnalysisDetail: React.FC = () => {
    const {quizId} = useParams<{ quizId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);

    useEffect(() => {
        const fetchQuizInfo = async () => {
            if (!quizId) return;

            try {
                setLoading(true);
                const quiz = await getQuizDetail(parseInt(quizId));
                if (quiz) {
                    setQuizInfo(quiz);
                } else {
                    setError('问卷信息获取失败');
                }
            } catch (err) {
                console.error('获取问卷信息失败:', err);
                setError('获取问卷信息失败');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizInfo();
    }, [quizId]);

    if (!quizId) {
        return <Alert type="error" message="无效的问卷ID"/>;
    }

    if (loading) {
        return (
            <div style={{padding: '24px'}}>
                <Spin tip="加载问卷信息..."/>
            </div>
        );
    }

    // 如果没有找到问卷信息，使用默认名称
    const quizName = quizInfo?.quizName || `问卷 #${quizId}`;

    return (
        <div style={{padding: '24px'}}>
            <Breadcrumb style={{marginBottom: '16px'}}>
                <Breadcrumb.Item>
                    <Link to="/quiz-analysis">
                        <ArrowLeftOutlined/> 返回问卷列表
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>问卷分析</Breadcrumb.Item>
            </Breadcrumb>

            <Card variant={"borderless"}>
                <QuizStatistics
                    quizId={parseInt(quizId)}
                    quizName={quizName}
                />
            </Card>
        </div>
    );
};

export default QuizAnalysisDetail;