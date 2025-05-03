import React from 'react';
import {Card, Typography} from 'antd';
import {toQuestionInstance} from "../../../store/question/questionSlice.ts";
import {BaseQuestion} from "../../../lib/Questions/BaseQuestion.ts";

const {Title, Text} = Typography;

interface QuestionStatisticsCardProps {
    questionData: {
        question: BaseQuestion;
        answers: Array<{
            user: string;
            answer: string;
        }>;
    };
    index: number;
}

const QuestionStatisticsCard: React.FC<QuestionStatisticsCardProps> = ({
                                                                           questionData,
                                                                           index
                                                                       }) => {
    let {question} = questionData;
    const {answers} = questionData
    const totalResponses = answers.length;
    question = toQuestionInstance(question)
    const StaticComponent = question.getStatisticsComponent()
    // 解析回答数据
    const parsedAnswers = answers.map(item => {
        try {
            return {
                user: item.user,
                parsedAnswer: JSON.parse(item.answer)
            };
        } catch (e) {
            console.error('解析回答失败:', e);
            return {
                user: item.user,
                parsedAnswer: item.answer
            };
        }
    });


    return (
        <Card className="question-statistics-card">
            <div className="question-header">
                <Title level={5}>
                    问题 {index}: {question.title}
                </Title>
                {question.description && (
                    <Text type="secondary" style={{display: 'block', marginBottom: '12px'}}>
                        {question.description}
                    </Text>
                )}
                <Text strong>回答人数: {totalResponses}</Text>
            </div>

            <div className="statistics-content" style={{marginTop: '16px'}}>
                <StaticComponent question={question} answers={parsedAnswers}/>
            </div>
        </Card>
    );
};

export default QuestionStatisticsCard;