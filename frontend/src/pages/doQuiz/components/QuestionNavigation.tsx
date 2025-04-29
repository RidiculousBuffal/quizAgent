import React from "react";
import { Typography, Space, Badge, Tooltip, Button } from "antd";
import { BaseQuestion } from "../../../lib/Questions/BaseQuestion";

const { Title, Text } = Typography;

interface QuestionNavigationProps {
    questions: BaseQuestion[];
    currentIndex: number;
    onQuestionChange: (index: number) => void;
    answeredQuestions: { id: number; isAnswered: boolean; isRequired: boolean }[];
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
                                                                   questions,
                                                                   currentIndex,
                                                                   onQuestionChange,
                                                                   answeredQuestions
                                                               }) => {
    const getQuestionStatus = (questionId: number) => {
        const question = answeredQuestions.find(q => q.id === questionId);
        if (!question) return "normal";

        if (question.isAnswered) {
            return "answered";
        } else if (question.isRequired) {
            return "required";
        }
        return "normal";
    };

    const getButtonStyle = (index: number, status: string) => {
        const isActive = index === currentIndex;

        const baseStyle = {
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            margin: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: isActive ? 'bold' : 'normal',
        };

        if (isActive) {
            return {
                ...baseStyle,
                border: '2px solid #1890ff',
                color: '#1890ff',
                background: '#e6f7ff'
            };
        }

        switch (status) {
            case "answered":
                return {
                    ...baseStyle,
                    background: '#f6ffed',
                    border: '1px solid #b7eb8f'
                };
            case "required":
                return {
                    ...baseStyle,
                    background: '#fff2e8',
                    border: '1px solid #ffbb96'
                };
            default:
                return {
                    ...baseStyle,
                    border: '1px solid #d9d9d9'
                };
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={4}>题目导航</Title>

            {/* Question status legend */}
            <div style={{ marginBottom: 16 }}>
                <Space direction="vertical" size="small">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge status="success" style={{ marginRight: 8 }} />
                        <Text type="secondary">已回答</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge status="warning" style={{ marginRight: 8 }} />
                        <Text type="secondary">未回答(必填)</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge status="default" style={{ marginRight: 8 }} />
                        <Text type="secondary">未回答(选填)</Text>
                    </div>
                </Space>
            </div>

            {/* Question buttons */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4
            }}>
                {questions.map((question, index) => {
                    const status = getQuestionStatus(question.id);

                    return (
                        <Tooltip
                            key={question.id}
                            title={
                                <div style={{ maxWidth: 200 }}>
                                    <div>{question.title}</div>
                                    {status === "answered" && <div style={{ color: '#52c41a' }}>已回答</div>}
                                    {status === "required" && <div style={{ color: '#fa8c16' }}>必答题</div>}
                                </div>
                            }
                            placement="left"
                        >
                            <Button
                                type="text"
                                onClick={() => onQuestionChange(index)}
                                style={getButtonStyle(index, status)}
                            >
                                {index + 1}
                            </Button>
                        </Tooltip>
                    );
                })}
            </div>

            {/* Completion summary */}
            <div style={{ marginTop: 24 }}>
                <Text type="secondary">进度: </Text>
                <Text strong>{answeredQuestions.filter(q => q.isAnswered).length}</Text>
                <Text type="secondary"> / {questions.length} 题已完成</Text>

                <div style={{ marginTop: 8 }}>
                    <Text type="danger">
                        {answeredQuestions.filter(q => q.isRequired && !q.isAnswered).length > 0 &&
                            `还有 ${answeredQuestions.filter(q => q.isRequired && !q.isAnswered).length} 道必答题未作答`
                        }
                    </Text>
                </div>
            </div>
        </Space>
    );
};

export default QuestionNavigation;