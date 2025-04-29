// src/pages/doQuiz/components/QuizCompletionPage.tsx
import React from 'react';
import {Result, Button, Typography, Card, Flex} from 'antd';
import {CheckCircleFilled, HomeFilled} from '@ant-design/icons';
import {useLocation, useNavigate} from 'react-router-dom';

const {Paragraph} = Typography;

interface CompletionState {
    quizName: string;
    answeredQuestions: number;
    totalQuestions: number;
    quizId: number;
}

const QuizCompletionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the state passed from the submission page
    const state = location.state as CompletionState;

    // Default values if no state is passed
    const quizName = state?.quizName || '问卷';
    const answeredQuestions = state?.answeredQuestions || 0;
    const totalQuestions = state?.totalQuestions || 0;

    return (
        <Flex justify="center" align="center" style={{minHeight: '100vh', background: '#f5f5f5', padding: 24}}>
            <Card style={{maxWidth: 600, width: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
                <Result
                    icon={<CheckCircleFilled style={{color: '#52c41a'}}/>}
                    title="问卷已成功提交"
                    subTitle={`感谢您完成"${quizName}"问卷`}
                    extra={[
                        <Button
                            type="primary"
                            icon={<HomeFilled/>}
                            key="home"
                            onClick={() => navigate('/')}
                        >
                            返回首页
                        </Button>,
                    ]}
                >
                    <div style={{background: '#f6ffed', padding: 16, borderRadius: 8, marginBottom: 24}}>
                        <Paragraph>
                            您的回答已经成功记录。您共完成了 {answeredQuestions} 道题，问卷总共 {totalQuestions} 道题。
                        </Paragraph>
                        <Paragraph>
                            感谢您的参与和宝贵反馈！
                        </Paragraph>
                    </div>

                    <Paragraph type="secondary" style={{textAlign: 'center'}}>
                        您现在可以关闭此页面或返回首页。
                    </Paragraph>
                </Result>
            </Card>
        </Flex>
    );
};

export default QuizCompletionPage;