import React, {useEffect, useState, useMemo} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Layout, Typography, Button, Result, App, Flex} from "antd";
import {LockOutlined, ArrowLeftOutlined} from "@ant-design/icons";
import {checkQuizPermission} from "../../api/quizpermissionapi";
import {getAllQuestionsInQuiz} from "../../api/questionapi";
import {useQuestionStore} from "../../store/question/QuestionStore";
import QuestionAnswerArea from "./components/QuestionAnswerArea";
import QuestionNavigation from "./components/QuestionNavigation";
import SubmitQuizButton from "./components/SubmitQuizButton";
import LoadingScreen from "./components/LoadingScreen";
import {QuizDto} from "../../api/types/questionType.ts";
import {getQuizDetail} from "../../api/quizApi.ts";

const {Header, Sider, Content} = Layout;
const {Title} = Typography;

const DoQuizPage: React.FC = () => {
    const {quizId} = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const {notification} = App.useApp();
    const [loading, setLoading] = useState(true);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizTitle, setQuizTitle] = useState("问卷作答");

    // Get state from question store - using shallow to prevent rerenders
    const questionStore = useQuestionStore();

    // Memoized derived state to prevent infinite renders
    const questions = useMemo(() =>
            questionStore.questionAnswer.map(qa => qa.question),
        [questionStore.questionAnswer]
    );

    // Memoize answeredQuestions to prevent rerenders
    const answeredQuestions = useMemo(() =>
            questions.map(q => ({
                id: q.id,
                isAnswered: Boolean(questionStore.findAnswer(q.id)),
                isRequired: q.isRequired,
            })),
        [questions, questionStore]
    );

    useEffect(() => {
        const loadQuiz = async () => {
            if (!quizId) return;

            setLoading(true);
            try {
                // Check permission first
                const hasPermission = await checkQuizPermission(Number(quizId));

                if (hasPermission === false) {
                    setPermissionError("您没有权限访问此问卷，可能需要登录或获取特定授权");
                    return;
                }

                // Fetch questions
                const questionsData = await getAllQuestionsInQuiz(Number(quizId));
                if (!questionsData || questionsData.length === 0) {
                    setPermissionError("此问卷不存在或尚未添加任何题目");
                    return;
                }
                const orig = await getQuizDetail(Number(quizId)) as QuizDto;
                setQuizTitle(orig.quizName)
                questionStore.setRawQuestions(questionsData);
            } catch (error) {
                console.error("Failed to load quiz:", error);
                setPermissionError("加载问卷失败，请稍后再试");
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [quizId, questionStore.setRawQuestions]);

    // Navigate to a specific question
    const handleQuestionChange = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Handle answer change
    const handleAnswerChange = (questionId: number, value: any) => {
        questionStore.setAnswer(questionId, value);
    };

    if (loading) {
        return <LoadingScreen/>;
    }

    if (permissionError) {
        return (
            <Result
                status="403"
                title="访问受限"
                icon={<LockOutlined/>}
                subTitle={permissionError}
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        返回首页
                    </Button>
                }
            />
        );
    }

    // Get current question
    const currentQuestion = questions[currentQuestionIndex];
    const currentQuestionAnswer = currentQuestion ? questionStore.findAnswer(currentQuestion.id) : null;

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{
                background: '#fff',
                padding: '0 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
            }}>
                <Flex justify="space-between" align="center" style={{height: '100%'}}>
                    <Flex align="center">
                        <Button
                            icon={<ArrowLeftOutlined/>}
                            type="text"
                            onClick={() => navigate('/')}
                            style={{marginRight: 16}}
                        />
                        <Title level={4} style={{margin: 0}}>{quizTitle}</Title>
                    </Flex>
                    <SubmitQuizButton
                        quizId={Number(quizId)}
                        answeredQuestions={answeredQuestions}
                        quizName={quizTitle}
                    />
                </Flex>
            </Header>
            <Layout>
                <Content style={{
                    padding: '24px 50px',
                    background: '#f5f5f5',
                    minHeight: 'calc(100vh - 64px)'
                }}>
                    {questions.length > 0 && currentQuestionIndex < questions.length ? (
                        <QuestionAnswerArea
                            question={currentQuestion}
                            value={currentQuestionAnswer}
                            onChange={value => handleAnswerChange(currentQuestion.id, value)}
                            currentIndex={currentQuestionIndex}
                            totalQuestions={questions.length}
                            onNext={() => {
                                if (currentQuestionIndex < questions.length - 1) {
                                    setCurrentQuestionIndex(prev => prev + 1);
                                }
                            }}
                            onPrevious={() => {
                                if (currentQuestionIndex > 0) {
                                    setCurrentQuestionIndex(prev => prev - 1);
                                }
                            }}
                        />
                    ) : (
                        <Result
                            status="info"
                            title="问卷暂无内容"
                            subTitle="此问卷没有任何问题可供回答"
                        />
                    )}
                </Content>
                <Sider
                    width={250}
                    style={{
                        background: '#fff',
                        padding: '16px',
                        boxShadow: '-2px 0 8px rgba(0,0,0,0.06)',
                        overflowY: 'auto'
                    }}
                >
                    <QuestionNavigation
                        questions={questions}
                        currentIndex={currentQuestionIndex}
                        onQuestionChange={handleQuestionChange}
                        answeredQuestions={answeredQuestions}
                    />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default DoQuizPage;