// src/components/dashboard/SurveyListCard.tsx
import React from 'react';
import { Card, Button } from 'antd';
import QuizTable from "../../components/table/QuizTable.tsx";


export interface QuizShowType {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    status: number;
}

interface SurveyListCardProps {
    surveyData: QuizShowType[];
    onCreateNewQuiz: () => void;
    onChangeInfo: (record: QuizShowType) => void;
    onEdit: (quizId: number) => void;
    onDelete: (quizId: number) => void;
    onPublishPermission: (record: QuizShowType) => void;
}

const SurveyListCard: React.FC<SurveyListCardProps> = ({
                                                           surveyData,
                                                           onCreateNewQuiz,
                                                           onChangeInfo,
                                                           onEdit,
                                                           onDelete,
                                                           onPublishPermission
                                                       }) => {
    return (
        <Card
            title="最近的问卷"
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
            styles={{
                body: {
                    flex: 1,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }
            }}
            extra={
                <Button
                    type="primary"
                    onClick={onCreateNewQuiz}
                >
                    创建我的问卷
                </Button>
            }
        >
            <div style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {surveyData.length === 0 ? (
                    <p>你还没有创建任何问卷.</p>
                ) : (
                    <QuizTable
                        surveyData={surveyData}
                        onChangeInfo={onChangeInfo}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onPublishPermission={onPublishPermission}
                    />
                )}
            </div>
        </Card>
    );
};

export default SurveyListCard;