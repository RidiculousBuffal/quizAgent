// src/pages/analysis/QuizAnalysisDetail.tsx
import React, {useEffect, useState} from 'react';
import {Card, Spin, Alert} from 'antd';

import QuizStatistics from './QuizStatistics/QuizStatistics';
import {getQuizDetail} from "../../api/quizApi.ts";



interface QuizInfo {
    quizId: number;
    quizName: string;
    quizDescription: string;
}


const QuizAnalysisDetail = ({quizId}:{quizId:number}) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);

    useEffect(() => {
        const fetchQuizInfo = async () => {
            if (!quizId) return;

            try {
                setLoading(true);
                const quiz = await getQuizDetail(quizId);
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
            <Card variant={"borderless"}>
                <QuizStatistics
                    quizId={quizId}
                    quizName={quizName}
                />
            </Card>
        </div>
    );
};

export default QuizAnalysisDetail;