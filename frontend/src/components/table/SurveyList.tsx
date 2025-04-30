// src/pages/HomePage/SurveyList.tsx

import React from 'react';
import { Spin, Empty } from 'antd';
import { quizDisplayType } from "../../api/types/questionType";
import SurveyCard from './SurveyCard';

interface SurveyListProps {
    loading: boolean;
    surveys: quizDisplayType[];
    onSurveyClick: (quizId: string) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({ loading, surveys, onSurveyClick }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (surveys.length === 0) {
        return <Empty description="暂无问卷" />;
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24
        }}>
            {surveys.map(survey => (
                <SurveyCard
                    key={survey.quizId}
                    survey={survey}
                    onClick={onSurveyClick}
                />
            ))}
        </div>
    );
};

export default SurveyList;