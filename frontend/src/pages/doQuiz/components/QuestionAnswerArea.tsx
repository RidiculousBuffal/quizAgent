import React from "react";
import { Card, Typography, Button, Space, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { BaseQuestion } from "../../../lib/Questions/BaseQuestion";
import QuestionViewWrapper from "../../../lib/Questions/QuestionWarpper/QuestionPreviewWrapper";

const { Title, Text } = Typography;

interface QuestionAnswerAreaProps {
    question: BaseQuestion;
    value: any;
    onChange: (value: any) => void;
    currentIndex: number;
    totalQuestions: number;
    onNext: () => void;
    onPrevious: () => void;
}

const QuestionAnswerArea: React.FC<QuestionAnswerAreaProps> = ({
                                                                   question,
                                                                   value,
                                                                   onChange,
                                                                   currentIndex,
                                                                   totalQuestions,
                                                                   onNext,
                                                                   onPrevious
                                                               }) => {
    return (
        <Card
            variant={"borderless"}
            style={{
                maxWidth: 800,
                margin: '0 auto',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
        >
            {/* Question number and navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
            }}>
                <Text type="secondary">问题 {currentIndex + 1} / {totalQuestions}</Text>
                <Space>
                    <Button
                        icon={<LeftOutlined />}
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                    >
                        上一题
                    </Button>
                    <Button
                        type="primary"
                        onClick={onNext}
                        disabled={currentIndex === totalQuestions - 1}
                    >
                        下一题 <RightOutlined />
                    </Button>
                </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />


            {/* Question content */}
            <div style={{ marginTop: 16 }}>
                <QuestionViewWrapper
                    id={question.id}
                    questionValue={value}
                    onValueChange={onChange}
                    showValidation={false}
                />
            </div>
        </Card>
    );
};

export default QuestionAnswerArea;