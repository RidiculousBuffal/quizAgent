// src/pages/doQuiz/components/SubmitQuizButton.tsx
import React, { useState } from "react";
import { Button, App, Typography, List, Space } from "antd";
import { ExclamationCircleOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuestionStore } from "../../../store/question/QuestionStore";

const { Text } = Typography;

interface SubmitQuizButtonProps {
    quizId: number;
    answeredQuestions: { id: number; isAnswered: boolean; isRequired: boolean }[];
}

const SubmitQuizButton: React.FC<SubmitQuizButtonProps> = ({
                                                               quizId,
                                                               answeredQuestions
                                                           }) => {
    const { modal, message, notification } = App.useApp();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const questionStore = useQuestionStore();

    // Check if all required questions are answered
    const missingRequiredQuestions = answeredQuestions
        .filter(q => q.isRequired && !q.isAnswered)
        .map(q => {
            const question = questionStore.findQuestion(q.id);
            return {
                id: q.id,
                title: question?.title || `问题 ${q.id}`
            };
        });

    const canSubmit = missingRequiredQuestions.length === 0;

    const handleSubmitClick = () => {
        if (!canSubmit) {
            // Show warning if required questions are not answered
            modal.warning({
                title: '您有未完成的必答题',
                content: (
                    <div>
                        <Text>以下必答题尚未填写:</Text>
                        <List
                            size="small"
                            style={{ maxHeight: '200px', overflow: 'auto', marginTop: 16 }}
                            dataSource={missingRequiredQuestions}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Space>
                                        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                                        <Text>{index + 1}. {item.title}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </div>
                ),
                okText: '继续填写'
            });
            return;
        }

        // Confirm submission
        modal.confirm({
            title: '确认提交问卷',
            icon: <SendOutlined />,
            content: (
                <div>
                    <Text>您已回答 {answeredQuestions.filter(q => q.isAnswered).length} 道题目（共 {answeredQuestions.length} 题）</Text>
                    <br />
                    <Text>提交后将无法修改您的回答，确定提交吗？</Text>
                </div>
            ),
            onOk: submitAnswers,
            okText: '确认提交',
            cancelText: '继续检查'
        });
    };

    const submitAnswers = async () => {
        setSubmitting(true);

        try {
            // Get all answers from the store
            const answers = answeredQuestions.map(q => ({
                questionId: q.id,
                answer: q.isAnswered ? questionStore.findAnswer(q.id) : null
            }));

            // TODO: Implement the actual API call
            // await submitQuizAnswers({
            //   quizId,
            //   answers
            // });

            console.log("Would submit:", { quizId, answers });

            notification.success({
                message: '提交成功',
                description: '感谢您完成此问卷',
                placement: 'topRight'
            });

            // Redirect after delay
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error("Failed to submit answers:", error);
            message.error('提交失败，请稍后重试');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Button
            type="primary"
            size="middle"
            onClick={handleSubmitClick}
            loading={submitting}
            icon={<SendOutlined />}
        >
            提交问卷
        </Button>
    );
};

export default SubmitQuizButton;