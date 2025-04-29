import React, {useState} from "react";
import {Button, App, Typography, List, Space} from "antd";
import {ExclamationCircleOutlined, SendOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useQuestionStore} from "../../../store/question/QuestionStore";
import {submitQuizAnswers} from "../../../api/answerapi";

const {Text} = Typography;

interface SubmitQuizButtonProps {
    quizId: number;
    answeredQuestions: { id: number; isAnswered: boolean; isRequired: boolean }[];
    quizName?: string;
}

const SubmitQuizButton: React.FC<SubmitQuizButtonProps> = ({
                                                               quizId,
                                                               answeredQuestions,
                                                               quizName = "问卷"
                                                           }) => {
    const {modal, message} = App.useApp();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
                            style={{maxHeight: '200px', overflow: 'auto', marginTop: 16}}
                            dataSource={missingRequiredQuestions}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Space>
                                        <ExclamationCircleOutlined style={{color: '#faad14'}}/>
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
            icon: <SendOutlined/>,
            content: (
                <div>
                    <Text>您已回答 {answeredQuestions.filter(q => q.isAnswered).length} 道题目（共 {answeredQuestions.length} 题）</Text>
                    <br/>
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
            const answers = answeredQuestions
                .filter(q => q.isAnswered) // Only submit answered questions
                .map(q => ({
                    questionId: q.id,
                    answer: questionStore.findAnswer(q.id)
                }));

            // Call the API to submit answers
            const response = await submitQuizAnswers({
                quizId,
                answers
            });

            if (response) {
                setSubmitted(true);

                // Show brief success message
                message.success('问卷提交成功！');

                // Navigate to completion page with submission details
                const answeredCount = answeredQuestions.filter(q => q.isAnswered).length;
                const totalCount = answeredQuestions.length;

                // Use navigate with state to pass data to the completion page
                navigate('/quizComplete', {
                    state: {
                        quizName,
                        answeredQuestions: answeredCount,
                        totalQuestions: totalCount,
                        quizId
                    }
                });
            } else {
                throw new Error(response?.msg || '提交失败');
            }
        } catch (error) {
            console.error("Failed to submit answers:", error);
            message.error('提交失败：' + (error instanceof Error ? error.message : '请稍后重试'));
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
            disabled={submitted}
            icon={<SendOutlined/>}
        >
            {submitted ? '已提交' : '提交问卷'}
        </Button>
    );
};

export default SubmitQuizButton;