import React, {useEffect, useState} from 'react';
import {Typography, Spin, Empty, Divider} from 'antd';
import QuestionStatisticsCard from './QuestionStatisticsCard';
import {getAnalysisDataInQuiz} from '../../../api/quizQuestionAnswerApi';
import './quizAnalysis.css'
const {Title} = Typography;

export interface QuestionStatData {
    question: any;
    answers: Array<{
        user: string;
        answer: string;
    }>;
}

interface QuizStatisticsProps {
    quizId: number;
    quizName: string;
}

const QuizStatistics: React.FC<QuizStatisticsProps> = ({quizId, quizName}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statisticsData, setStatisticsData] = useState<QuestionStatData[]>([]);

    useEffect(() => {
        const fetchStatisticsData = async () => {
            try {
                setLoading(true);
                const data = await getAnalysisDataInQuiz(quizId);
                if (data) {
                    setStatisticsData(data);
                } else {
                    setError('没有找到统计数据');
                }
            } catch (error) {
                console.error('获取统计数据失败:', error);
                setError('获取统计数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchStatisticsData();
    }, [quizId]);

    if (loading) {
        return (
            <div style={{textAlign: 'center', padding: '50px'}}>
                <Spin size="large" tip="加载统计数据中..."/>
            </div>
        );
    }

    if (error || statisticsData.length === 0) {
        return (
            <Empty
                description={error || "暂无统计数据"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div className="quiz-statistics">
            <Title level={4}>{quizName} - 统计分析</Title>
            <Divider/>

            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {statisticsData.map((questionData, index) => (
                    <QuestionStatisticsCard
                        key={questionData.question.id || index}
                        questionData={questionData}
                        index={index + 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuizStatistics;